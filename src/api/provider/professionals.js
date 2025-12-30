// src/api/professionals.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_professionals_v1", {
  seed: [
    {
      id: "PRO-001",
      full_name: "Dra. Demo",
      specialty: "Medicina General",
      email: "doctora@demo.com",
      phone: "+58 414-0000000",
      city: "Valencia",
      country: "VE",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export async function fetchProfessionals(filters = {}) {
  const { q, city, specialty, status } = filters;
  return client.list((p) => {
    let ok = true;
    if (q) {
      const haystack = `${p.full_name} ${p.email}`
        .toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok =
        ok &&
        String(p.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase());
    }
    if (specialty) {
      ok =
        ok &&
        String(p.specialty || "")
          .toLowerCase()
          .includes(String(specialty).toLowerCase());
    }
    if (status) {
      ok = ok && String(p.status || "") === String(status);
    }
    return ok;
  });
}

export const getProfessionalById = (id) => client.get(id);
export const createProfessional = (payload) => client.create(payload);
export const updateProfessional = (id, patch) => client.update(id, patch);
export const deleteProfessional = (id) => client.remove(id);

export const toggleProfessionalStatus = (id, newStatus) =>
  client.update(id, { status: newStatus });

export async function fetchProfessionalSchedule(_id) {
  // Horario fake
  return [
    { weekday: "monday", slots: ["09:00", "10:00", "11:00"] },
    { weekday: "wednesday", slots: ["14:00", "15:00"] },
  ];
}

export async function updateProfessionalSchedule(_id, schedulePatch) {
  // Solo retornamos lo que llega para mock
  return schedulePatch;
}

export async function fetchProfessionalDashboardSummary(professionalId) {
  return {
    professional_id: professionalId,
    upcoming_appointments: 3,
    today_appointments: 1,
    month_revenue_estimate: 150,
  };
}
