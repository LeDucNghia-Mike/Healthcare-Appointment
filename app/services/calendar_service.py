# app/services/calendar_service.py

from app.db import execute_query, fetch_all

def get_calendar_range(start_date, end_date):
    return fetch_all("""
        SELECT * FROM calendar_day
        WHERE date BETWEEN %s AND %s
        ORDER BY date
    """, (start_date, end_date))


def update_calendar_status(date, status):
    execute_query("""
        UPDATE calendar_day
        SET status = %s
        WHERE date = %s
    """, (status, date))