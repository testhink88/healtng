// src/api/appointments.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_appointments_v1");

export async function fetchAppointments(filters = {}) {
  const {
    patient_id,
    professional_id,
    clinic_id,
    status,
    from,
    to,
  } = filters;

  return client.list((a) => {
    let ok = true;
    if (patient_id) {
      ok = ok && String(a.patient_id) === String(patient_id);
    }
    if (professional_id) {
      ok = ok && String(a.professional_id) === String(professional_id);
    }
    if (clinic_id) {
      ok = ok && String(a.clinic_id) === String(clinic_id);
    }
    if (status) {
      ok = ok && String(a.status || "") === String(status);
    }
    if (from) {
      ok = ok && String(a.date) >= String(from);
    }
    if (to) {
      ok = ok && String(a.date) <= String(to);
    }
    return ok;
  });
}

export const getAppointmentById = (id) => client.get(id);

export const createAppointment = (payload) =>
  client.create({
    status: "pending",
    ...payload,
  });

export const updateAppointment = (id, patch) => client.update(id, patch);

export const cancelAppointment = (id, { reason } = {}) =>
  client.update(id, { status: "cancelled", cancel_reason: reason || null });

export const fetchAppointmentsByPatient = (patientId) =>
  fetchAppointments({ patient_id: patientId });

export const fetchAppointmentsByProfessional = (professionalId) =>
  fetchAppointments({ professional_id: professionalId });

export const fetchAppointmentsByClinic = (clinicId) =>
  fetchAppointments({ clinic_id: clinicId });

export async function fetchAvailableSlots({
  professionalId,
  clinicId,
  serviceId,
  dateRange = [],
}) {
  // Mock absoluto: mismos horarios todos los días
  return dateRange.map((date) => ({
    date,
    slots: ["09:00", "10:00", "11:00", "15:00"],
    professional_id: professionalId,
    clinic_id: clinicId,
    service_id: serviceId,
  }));
}
