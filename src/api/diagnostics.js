// src/api/diagnostics.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_diagnostics_v1");

export async function fetchDiagnostics(filters = {}) {
  const { patient_id, professional_id, appointment_id } = filters;
  return client.list((d) => {
    let ok = true;
    if (patient_id) {
      ok = ok && String(d.patient_id) === String(patient_id);
    }
    if (professional_id) {
      ok = ok && String(d.professional_id) === String(professional_id);
    }
    if (appointment_id) {
      ok = ok && String(d.appointment_id) === String(appointment_id);
    }
    return ok;
  });
}

export const getDiagnosticById = (id) => client.get(id);
export const createDiagnostic = (payload) => client.create(payload);
export const updateDiagnostic = (id, patch) => client.update(id, patch);
export const deleteDiagnostic = (id) => client.remove(id);

export const fetchDiagnosticsByPatient = (patientId) =>
  fetchDiagnostics({ patient_id: patientId });

export const fetchDiagnosticsByProfessional = (professionalId) =>
  fetchDiagnostics({ professional_id: professionalId });

export async function attachFilesToDiagnostic(id, filesPayload) {
  // En mock solo guardamos metadatos
  return client.update(id, {
    attachments: filesPayload,
  });
}
