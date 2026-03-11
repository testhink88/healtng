import { supabase } from "@/lib/supabase";

/**
 * FETCH ENCOUNTERS
 */
export async function fetchEncounters(filters = {}) {
  const { patient_id, doctor_id, clinic_id, status } = filters;
  
  let query = supabase
    .from('encounters')
    .select('*, patient:profiles!encounters_patient_id_fkey(*), doctor:profiles!encounters_doctor_id_fkey(*), clinic:profiles!encounters_clinic_id_fkey(*)')
    .order('started_at', { ascending: false });

  if (patient_id) query = query.eq('patient_id', patient_id);
  if (doctor_id) query = query.eq('doctor_id', doctor_id);
  if (clinic_id) query = query.eq('clinic_id', clinic_id);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * GET ENCOUNTER BY ID
 */
export async function getEncounterById(id) {
  const { data, error } = await supabase
    .from('encounters')
    .select('*, patient:profiles!encounters_patient_id_fkey(*), doctor:profiles!encounters_doctor_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * CREATE ENCOUNTER
 */
export async function createEncounter(payload) {
  const { data, error } = await supabase
    .from('encounters')
    .insert([{ started_at: new Date().toISOString(), status: 'in-progress', ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * FINISH ENCOUNTER
 */
export async function finishEncounter(id, notes) {
  const { data, error } = await supabase
    .from('encounters')
    .update({ status: 'completed', finished_at: new Date().toISOString(), notes })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
/**
 * UPDATE ENCOUNTER
 */
export async function updateEncounter(id, patch) {
  const { data, error } = await supabase
    .from('encounters')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
