// src/api/clinic/spaces.js
import { createMockClient } from "@/api/_mockBase";
import { mockSpaces } from "@/utils/spaces"; 

const client = createMockClient("healtng_spaces_v1", {
  seed: Array.isArray(mockSpaces) ? mockSpaces : [],
  indexKey: "id",
});

export async function fetchSpaces(filters = {}) {
  // ✅ CORRECCIÓN: Aceptamos 'search' o 'q' para evitar errores de integración
  const { clinic_id, q, search, type, status } = filters;
  const searchTerm = q || search; 

  return client.list((s) => {
    let ok = true;

    if (clinic_id) ok = ok && String(s.clinic_id) === String(clinic_id);
    if (type && type !== "all") ok = ok && String(s.type || "") === String(type);
    if (status && status !== "all") ok = ok && String(s.status || "") === String(status);

    if (searchTerm) {
      const haystack = `${s.name || ""} ${s.description || ""} ${s.id || ""}`.toLowerCase();
      ok = ok && haystack.includes(String(searchTerm).toLowerCase());
    }

    return ok;
  });
}

export const getSpaceById = (id) => client.get(id);
export const createSpace = (payload) => client.create(payload);
export const updateSpace = (id, patch) => client.update(id, patch);
export const deleteSpace = (id) => client.remove(id);

export async function fetchSpacesByClinic(clinicId) {
  return fetchSpaces({ clinic_id: clinicId });
}

// ✅ CORRECCIÓN: Para el demo, simulamos que la reserva se procesó con éxito
export const bookSpace = async (payload) => {
  console.log("API: Registrando reserva en sistema...", payload);
  // En un entorno real, aquí harías: return client.bookings.create(payload);
  return { 
    ...payload, 
    id: `BK-${Math.floor(Math.random() * 1000)}`, 
    status: "confirmada",
    success: true 
  };
};

export async function fetchSpaceAvailability(spaceId, _dateRange) {
  return { space_id: spaceId, available: true };
}