// src/api/clinics.js
import { createMockClient } from "@/api/_mockBase";


const client = createMockClient("healtng_clinics_v1", {
  seed: [
    {
      id: "CLI-001",
      name: "Clínica Demo Healtng",
      city: "Valencia",
      address: "Av. Principal, Valencia",
      phone: "+58 241-0000000",
      business_type: "clinic",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export async function fetchClinics(filters = {}) {
  const { q, city, business_type } = filters;
  return client.list((c) => {
    let ok = true;
    if (q) {
      const haystack = `${c.name} ${c.city} ${c.address}`.toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok =
        ok &&
        String(c.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase());
    }
    if (business_type) {
      ok =
        ok &&
        String(c.business_type || "") === String(business_type);
    }
    return ok;
  });
}

export const getClinicById = (id) => client.get(id);
export const createClinic = (payload) => client.create(payload);
export const updateClinic = (id, patch) => client.update(id, patch);
export const deleteClinic = (id) => client.remove(id);

export async function fetchClinicServices(_clinicId) {
  return [];
}

export async function updateClinicServices(clinicId, servicesPatch) {
  // En mock, lo devolvemos tal cual
  return { clinic_id: clinicId, services: servicesPatch };
}

export async function fetchClinicTeam(_clinicId) {
  return [];
}

export async function fetchClinicDashboardSummary(clinicId) {
  return {
    clinic_id: clinicId,
    today_appointments: 10,
    month_appointments: 200,
    occupied_spaces: 4,
  };
}
