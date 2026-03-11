// src/api/patients.js
import { createMockClient } from "../_mockBase";

const client = createMockClient("healtng_patients_v1", {
  seed: [], // Se ha eliminado el seed para que no cargue datos mock al iniciar.
});

export async function fetchPatients(filters = {}) {
  const { q, professional_id } = filters;

  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient');

    if (q) {
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    if (professional_id) {
      // Si queremos SOLO los que tienen cita con este doctor:
      // Nota: Supabase solo permite este tipo de filtrado complejo via rpc o vistas si no hay relación directa simple.
      // Por ahora, usaremos una subconsulta lógica: obtener IDs de pacientes con citas.
      const { data: apts } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('professional_id', professional_id);
      
      const patientIds = [...new Set(apts?.map(a => a.patient_id).filter(id => !!id))];
      
      if (patientIds.length === 0) return [];
      query = query.in('id', patientIds);
    }

    const { data, error } = await query.order('full_name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
}

export async function getPatientById(id) {
  if (!id) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching patient by id:", error);
    return null;
  }
}

import { supabase } from "../../lib/supabase";

/**
 * FETCH CLINICAL HISTORY FOR PATIENT
 */
export async function fetchPatientHistory(patientId) {
  if (!patientId) return { diagnoses: [], treatments: [], encounters: [] };

  try {
    const [diagnoses, treatments, encounters] = await Promise.all([
      supabase
        .from('diagnoses')
        .select('*, doctor:profiles!diagnoses_doctor_id_fkey(*)')
        .eq('patient_id', patientId)
        .order('diagnosis_date', { ascending: false }),
      supabase
        .from('treatments')
        .select('*, doctor:profiles!treatments_doctor_id_fkey(*)')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false }),
      supabase
        .from('encounters')
        .select('*, doctor:profiles!encounters_doctor_id_fkey(*)')
        .eq('patient_id', patientId)
        .order('started_at', { ascending: false })
    ]);

    return {
      diagnoses: diagnoses.data || [],
      treatments: treatments.data || [],
      encounters: encounters.data || []
    };
  } catch (error) {
    console.error("Error fetching patient medical history:", error);
    return { diagnoses: [], treatments: [], encounters: [] };
  }
}
