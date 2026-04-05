from app.db import fetch_all, fetch_one, execute_query
from datetime import datetime

# ==============================
# CHECK MONTH STATUS
# ==============================
def get_month_status(doctor_id: str, year: int, month: int):
    return fetch_one("""
        SELECT is_inserted
        FROM doctor_insert_month
        WHERE doctor_id = %s
        AND year = %s
        AND month = %s
    """, (doctor_id, year, month))


# ==============================
# GENERATE PREVIEW
# ==============================
def generate_preview(doctor_id: str, year: int, month: int):
    prev_month = month - 1
    prev_year = year

    if prev_month == 0:
        prev_month = 12
        prev_year -= 1

    start = f"{prev_year}-{prev_month:02d}-01"
    end = f"{year}-{month:02d}-01"

    rows = fetch_all("""
        SELECT
            EXTRACT(ISODOW FROM slot_date) AS dow,
            slot_code,
            COUNT(*) AS cnt
        FROM doctor_slot
        WHERE doctor_id = %s
        AND slot_status = 'AVAILABLE'
        AND slot_date >= %s
        AND slot_date < %s
        AND EXTRACT(ISODOW FROM slot_date) BETWEEN 1 AND 6
        GROUP BY dow, slot_code
    """, (doctor_id, start, end))

    result = {}

    for r in rows:
        key = f"{int(r['dow'])}_{r['slot_code']}"
        result[key] = "GREEN" if r["cnt"] >= 2 else "RED"

    return result


# ==============================
# CONFIRM GENERATE
# ==============================
def confirm_generate(doctor_id: str, year: int, month: int, slots: list):
    from datetime import date, timedelta

    # ==============================
    # CHECK ALREADY INSERTED
    # ==============================
    check = fetch_one("""
        SELECT is_inserted
        FROM doctor_insert_month
        WHERE doctor_id = %s
        AND year = %s
        AND month = %s
    """, (doctor_id, year, month))

    if check and check["is_inserted"]:
        return {"message": "Already generated"}

    # ==============================
    # GENERATE ALL DAYS IN MONTH
    # ==============================
    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    delta = end_date - start_date

    insert_rows = []

    holidays = fetch_all("""
        SELECT date
        FROM calendar_day
        WHERE date >= %s
        AND date < %s
        AND status = 'HOLIDAY'
    """, (start_date, end_date))

    holiday_set = set(h["date"] for h in holidays)

    for i in range(delta.days):
        current_date = start_date + timedelta(days=i)

        dow = current_date.isoweekday()

        # 🔥 SKIP HOLIDAY
        if current_date in holiday_set:
            continue

        for s in slots:
            if s["dow"] != dow:
                continue

            slot_code = s["slot_code"]

            slot_id = f"{current_date.strftime('%Y%m%d')}{doctor_id}{slot_code}"

            insert_rows.append((
                slot_id,
                doctor_id,
                current_date,
                slot_code,
                "AVAILABLE"
            ))
    # ==============================
    # INSERT BATCH
    # ==============================
    if insert_rows:
        from psycopg2.extras import execute_values
        from app.db import get_app_connection

        conn = get_app_connection()

        try:
            with conn.cursor() as cur:
                execute_values(
                    cur,
                    """
                    INSERT INTO doctor_slot (
                        slot_id,
                        doctor_id,
                        slot_date,
                        slot_code,
                        slot_status
                    )
                    VALUES %s
                    ON CONFLICT (slot_id) DO NOTHING;
                    """,
                    insert_rows
                )

            conn.commit()
        finally:
            conn.close()

    # ==============================
    # MARK INSERTED
    # ==============================
    execute_query("""
        INSERT INTO doctor_insert_month (
            doctor_id,
            year,
            month,
            is_inserted
        )
        VALUES (%s, %s, %s, TRUE)
        ON CONFLICT (doctor_id, year, month)
        DO UPDATE SET is_inserted = TRUE;
    """, (doctor_id, year, month))

    return {"message": "Generated successfully"}
