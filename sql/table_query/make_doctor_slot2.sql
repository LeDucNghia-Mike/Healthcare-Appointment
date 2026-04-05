WITH pattern AS (
    SELECT
        doctor_id,
        EXTRACT(ISODOW FROM slot_date) AS dow,
        slot_code
    FROM doctor_slot
    WHERE slot_status = 'AVAILABLE'
      AND slot_date >= DATE '2026-04-01'
      AND slot_date <  DATE '2026-05-01'
      AND EXTRACT(ISODOW FROM slot_date) BETWEEN 1 AND 6
    GROUP BY doctor_id, dow, slot_code
    HAVING COUNT(*) >= 2
),

may_dates AS (
    SELECT 
        d::date AS slot_date,
        EXTRACT(ISODOW FROM d) AS dow
    FROM generate_series(
        DATE '2026-05-01',
        DATE '2026-05-31',
        INTERVAL '1 day'
    ) d
    WHERE EXTRACT(ISODOW FROM d) BETWEEN 1 AND 6
)

INSERT INTO doctor_slot (
    slot_id,
    doctor_id,
    slot_date,
    slot_code,
    slot_status
)
SELECT
    -- ✅ FORMAT MỚI
    TO_CHAR(m.slot_date, 'YYYYMMDD') || p.doctor_id || p.slot_code,
    p.doctor_id,
    m.slot_date,
    p.slot_code,
    'AVAILABLE'
FROM pattern p
JOIN may_dates m
    ON p.dow = m.dow

ON CONFLICT (doctor_id, slot_date, slot_code) DO NOTHING;