// src/api/appointments.js
import { supabase } from "@/lib/supabase";

/**
 * Obtener citas con filtros opcionales
 */
export async function fetchAppointments(filters = {}) {
  const {
    patient_id,
    professional_id,
    clinic_id,
    status,
    from,
    to,
  } = filters;

  let query = supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (patient_id) query = query.eq('patient_id', patient_id);
  if (professional_id) query = query.eq('professional_id', professional_id);
  if (clinic_id) query = query.eq('clinic_id', clinic_id);
  if (status) query = query.eq('status', status);
  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
  return data;
}

export async function getAppointmentById(id) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
  return data;
}

export async function createAppointment(payload) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      status: "pending",
      ...payload,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
  return data;
}

export async function updateAppointment(id, patch) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ 
      ...patch, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
  return data;
}

export async function cancelAppointment(id, { reason } = {}) {
  return updateAppointment(id, { 
    status: "cancelled", 
    cancel_reason: reason || null 
  });
}

export const fetchAppointmentsByPatient = (patientId) =>
  fetchAppointments({ patient_id: patientId });

export const fetchAppointmentsByProfessional = (professionalId) =>
  fetchAppointments({ professional_id: professionalId });

export const fetchAppointmentsByClinic = (clinicId) =>
  fetchAppointments({ clinic_id: clinicId });

/**
 * Simulación de disponibilidad (Se puede mejorar luego con lógica real de horarios)
 */
export async function fetchAvailableSlots({
  professionalId,
  clinicId,
  serviceId,
  dateRange = [],
}) {
  // Por ahora mantenemos el mock de disponibilidad hasta tener tabla de 'availability'
  return dateRange.map((date) => ({
    date,
    slots: ["09:00", "09:30", "10:00", "10:30", "11:00", "15:00", "15:30", "16:00"],
    professional_id: professionalId,
    clinic_id: clinicId,
    service_id: serviceId,
  }));
}
