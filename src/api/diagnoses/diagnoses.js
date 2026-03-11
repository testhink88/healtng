import { supabase } from "@/lib/supabase";

/**
 * FETCH DIAGNOSES
 */
export async function fetchDiagnoses(filters = {}) {
  const { patient_id, doctor_id, encounter_id, status } = filters;
  
  let query = supabase
    .from('diagnoses')
    .select(`
      *,
      patient:profiles!diagnoses_patient_id_fkey(id, full_name, email),
      doctor:profiles!diagnoses_doctor_id_fkey(id, full_name, email),
      encounter:encounters(*)
    `)
    .order('diagnosis_date', { ascending: false });

  if (patient_id) query = query.eq('patient_id', patient_id);
  if (doctor_id) query = query.eq('doctor_id', doctor_id);
  if (encounter_id) query = query.eq('encounter_id', encounter_id);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * GET DIAGNOSIS BY ID
 */
export async function getDiagnosisById(id) {
  const { data, error } = await supabase
    .from('diagnoses')
    .select(`
      *, 
      patient:profiles!diagnoses_patient_id_fkey(*), 
      doctor:profiles!diagnoses_doctor_id_fkey(*), 
      encounter:encounters(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * CREATE DIAGNOSIS
 */
export async function createDiagnosis(payload) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert([payload])
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

/**
 * UPDATE DIAGNOSIS
 */
export async function updateDiagnosis(id, patch) {
  const { data, error } = await supabase
    .from('diagnoses')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

/**
 * HELPERS
 */
export const listDiagnosesByPatient = (patientId) => fetchDiagnoses({ patient_id: patientId });
export const listDiagnosesByEncounter = (encounterId) => fetchDiagnoses({ encounter_id: encounterId });
