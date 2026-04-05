SELECT
    TO_CHAR(slot_date, 'Dy') AS day_name,   -- Mon, Tue, ...
    slot_code,
    COUNT(*) AS available_count
FROM doctor_slot
WHERE doctor_id = 'DR005'
  AND slot_status = 'AVAILABLE'
  AND slot_date >= DATE '2026-04-01'
  AND slot_date <  DATE '2026-05-01'
  AND EXTRACT(ISODOW FROM slot_date) BETWEEN 1 AND 6
GROUP BY day_name, slot_code
HAVING COUNT(*) >= 2
ORDER BY 
    MIN(EXTRACT(ISODOW FROM slot_date)),   -- giữ đúng thứ tự Mon → Sat
    slot_code;