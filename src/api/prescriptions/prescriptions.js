import { createMockClient } from "../_mockBase";
const client = createMockClient("healtng_prescriptions_v1", { seed: [] });

export async function createPrescription(payload) {
  // payload: { encounter_id, patient_id, doctor_id, dx_id, template_id, template_version, meds, signature, created_at }
  return client.create(payload);
}
export async function getPrescriptionById(id) {
  return client.get(id);
}
export async function listPrescriptionsByPatient(patientId) {
  return client.list(r => String(r.patient_id) === String(patientId));
}
