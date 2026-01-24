import { createMockClient } from "../_mockBase";
const client = createMockClient("healtng_encounters_v1", { seed: [] });

export async function createEncounter(payload) {
  // payload: { patient_id, doctor_id, started_at, status }
  return client.create(payload);
}
export async function getEncounterById(id) {
  return client.get(id);
}
