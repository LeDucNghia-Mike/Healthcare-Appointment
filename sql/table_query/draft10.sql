select * 
from patient 
where patient_id = (select max(patient_id) from patient)