// src/api/services.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_services_v1", {
  seed: [
    {
      id: "SRV-001",
      name: "Consulta General",
      specialty: "Medicina General",
      clinic_id: "CLI-001",
      provider_id: null,
      price: 10,
      city: "Valencia",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export async function fetchServices(filters = {}) {
  const { q, city, specialty, clinic_id, provider_id } = filters;
  return client.list((s) => {
    let ok = true;
    if (q) {
      const haystack = `${s.name} ${s.specialty}`.toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok =
        ok &&
        String(s.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase());
    }
    if (specialty) {
      ok =
        ok &&
        String(s.specialty || "")
          .toLowerCase()
          .includes(String(specialty).toLowerCase());
    }
    if (clinic_id) {
      ok = ok && String(s.clinic_id) === String(clinic_id);
    }
    if (provider_id) {
      ok = ok && String(s.provider_id) === String(provider_id);
    }
    return ok;
  });
}

export const getServiceById = (id) => client.get(id);
export const createService = (payload) => client.create(payload);
export const updateService = (id, patch) => client.update(id, patch);
export const deleteService = (id) => client.remove(id);

export const fetchServicesByClinic = (clinicId) =>
  fetchServices({ clinic_id: clinicId });

export const fetchServicesByProvider = (providerId) =>
  fetchServices({ provider_id: providerId });

export const searchServices = ({ term, specialty, city }) =>
  fetchServices({ q: term, specialty, city });
