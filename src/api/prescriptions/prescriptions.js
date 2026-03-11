import { supabase } from "@/lib/supabase";

export async function createPrescription(payload) {
  // En Healtng, una receta es un registro en la tabla 'treatments' con metadatos específicos
  const { data, error } = await supabase
    .from('treatments')
    .insert([{ ...payload, type: 'Medicamento' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPrescriptionById(id) {
  const { data, error } = await supabase
    .from('treatments')
    .select(`
      *,
      patient:profiles!treatments_patient_id_fkey(id, full_name, email),
      doctor:profiles!treatments_doctor_id_fkey(id, full_name, email)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function listPrescriptionsByPatient(patientId) {
  const { data, error } = await supabase
    .from('treatments')
    .select(`
      *,
      doctor:profiles!treatments_doctor_id_fkey(id, full_name, email)
    `)
    .eq('patient_id', patientId)
    .eq('type', 'Medicamento')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function listPrescriptionsByDoctor(doctorId) {
  const { data, error } = await supabase
    .from('treatments')
    .select(`
      *,
      patient:profiles!treatments_patient_id_fkey(id, full_name, email)
    `)
    .eq('doctor_id', doctorId)
    .eq('type', 'Medicamento')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
