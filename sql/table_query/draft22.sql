select * from medical_record 
where patient_id = 1253 
and slot_id = (select slot_id from medical_record where slot_id like '%DR002%' )
and version_number = (select max(version_number) from medical_record where patient_id = 1253 and slot_id like '%DR002%');