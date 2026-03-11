import { supabase } from "@/lib/supabase";

/**
 * FETCH TREATMENTS
 */
export async function fetchTreatments(filters = {}) {
  const { patient_id, doctor_id, diagnosis_id, status } = filters;
  
  let query = supabase
    .from('treatments')
    .select(`
      *,
      patient:profiles!treatments_patient_id_fkey(id, full_name, email),
      doctor:profiles!treatments_doctor_id_fkey(id, full_name, email),
      diagnosis:diagnoses(*)
    `)
    .order('start_date', { ascending: false });

  if (patient_id) query = query.eq('patient_id', patient_id);
  if (doctor_id) query = query.eq('doctor_id', doctor_id);
  if (diagnosis_id) query = query.eq('diagnosis_id', diagnosis_id);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * CREATE TREATMENT
 */
export async function createTreatment(payload) {
  const { data, error } = await supabase
    .from('treatments')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * UPDATE TREATMENT
 */
export async function updateTreatment(id, patch) {
  const { data, error } = await supabase
    .from('treatments')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * HELPERS
 */
export const listTreatmentsByPatient = (patientId) => fetchTreatments({ patient_id: patientId });
export const listTreatmentsByDiagnosis = (diagnosisId) => fetchTreatments({ diagnosis_id: diagnosisId });
export const listTreatmentsByDoctor = (doctorId) => fetchTreatments({ doctor_id: doctorId });
