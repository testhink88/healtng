import { createMockClient } from "../_mockBase";

const client = createMockClient("healtng_diagnoses_v1", { seed: [] });

export async function createDiagnosis(payload) {
  // payload: { encounter_id, patient_id, doctor_id, template_id, primary_dx, secondary_dx, findings, plan, created_at }
  return client.create(payload);
}

export async function getDiagnosisById(id) {
  return client.get(id);
}

export async function listDiagnosesByPatient(patientId) {
  return client.list(d => String(d.patient_id) === String(patientId));
}

export async function listDiagnosesByEncounter(encounterId) {
  return client.list(d => String(d.encounter_id) === String(encounterId));
}
