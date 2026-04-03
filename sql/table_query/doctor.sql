SELECT 
    ds.slot_id,
    ds.slot_code,
    ds.doctor_id,
    a.appointment_id,
    a.patient_id,
    a.status AS appointment_status
FROM doctor_slot ds
JOIN appointment a 
    ON ds.slot_id = a.slot_id
WHERE ds.slot_status = 'BOOKED';