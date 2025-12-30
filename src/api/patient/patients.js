// src/api/patients.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_patients_v1", {
  seed: [], // Se ha eliminado el seed para que no cargue datos mock al iniciar.
});

export async function fetchPatients(filters = {}) {
  const { q, city } = filters;
  return client.list((p) => {
    let ok = true;
    if (q) {
      const haystack = `${p.full_name} ${p.email} ${p.document_id}`.toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok = ok && String(p.city || "").toLowerCase().includes(String(city).toLowerCase());
    }
    return ok;
  });
}

export const getPatientById = (id) => client.get(id);
export const createPatient = (payload) => client.create(payload);
export const updatePatient = (id, patch) => client.update(id, patch);
export const deletePatient = (id) => client.remove(id);

// Funciones adicionales, como las de dashboard, se mantienen igual pero vacías.
export async function fetchPatientDashboardSummary(patientId) {
  return {
    patient_id: patientId,
    upcoming_appointments: 0,
    active_orders: 0,
    last_diagnostic_at: null,
  };
}

export async function fetchPatientHistory(patientId) {
  return [];
}
