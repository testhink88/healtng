// src/api/providers.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_providers_v1", {
  seed: [
    {
      id: "PRV-001",
      name: "Farmacia Demo",
      business_type: "mixto", // productos, servicios, mixto
      city: "Valencia",
      address: "Calle Principal",
      phone: "+58 241-1111111",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export async function fetchProviders(filters = {}) {
  const { q, city, business_type } = filters;
  return client.list((p) => {
    let ok = true;
    if (q) {
      const haystack = `${p.name} ${p.city} ${p.address}`.toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok =
        ok &&
        String(p.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase());
    }
    if (business_type) {
      ok =
        ok &&
        String(p.business_type || "") === String(business_type);
    }
    return ok;
  });
}

export const getProviderById = (id) => client.get(id);
export const createProvider = (payload) => client.create(payload);
export const updateProvider = (id, patch) => client.update(id, patch);
export const deleteProvider = (id) => client.remove(id);

export async function fetchProviderCatalog(providerId) {
  // Luego lo conectas con products/services
  return { provider_id: providerId, products: [], services: [] };
}

export async function fetchProviderBusinessTypes(providerId) {
  const provider = await client.get(providerId);
  return provider?.business_type || "mixto";
}

export async function updateProviderBusinessTypes(providerId, typesPatch) {
  return client.update(providerId, { business_type: typesPatch });
}

export async function fetchProviderDashboardSummary(providerId) {
  return {
    provider_id: providerId,
    month_orders: 35,
    month_revenue_estimate: 1200,
  };
}
