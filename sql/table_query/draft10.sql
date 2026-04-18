SELECT 
    mr.record_id,
    mr.slot_id,
    mr.patient_id,
    p.patient_name,
    mr.version_number,
    mr.diagnosis_note,
    mr.prescription_note,
    ds.slot_date,
    ds.slot_code,
    mr.created_at
FROM medical_record mr
JOIN doctor_slot ds ON mr.slot_id = ds.slot_id
JOIN patient p ON mr.patient_id = p.patient_id
WHERE p.patient_name = 'Vương Ngọc Diệu'
ORDER BY mr.slot_id DESC, mr.version_number ASC;