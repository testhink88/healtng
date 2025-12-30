// src/api/products.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_products_v1", {
  seed: [
    {
      id: "PROD-001",
      name: "Paracetamol 500mg",
      sku: "PARA500",
      category: "Analgésicos",
      provider_id: "PRV-001",
      price: 2.5,
      city: "Valencia",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
});

export async function fetchProducts(filters = {}) {
  const { q, city, category, provider_id } = filters;
  return client.list((p) => {
    let ok = true;
    if (q) {
      const haystack = `${p.name} ${p.sku} ${p.category}`.toLowerCase();
      ok = ok && haystack.includes(String(q).toLowerCase());
    }
    if (city) {
      ok =
        ok &&
        String(p.city || "")
          .toLowerCase()
          .includes(String(city).toLowerCase());
    }
    if (category) {
      ok =
        ok &&
        String(p.category || "")
          .toLowerCase()
          .includes(String(category).toLowerCase());
    }
    if (provider_id) {
      ok = ok && String(p.provider_id) === String(provider_id);
    }
    return ok;
  });
}

export const getProductById = (id) => client.get(id);
export const createProduct = (payload) => client.create(payload);
export const updateProduct = (id, patch) => client.update(id, patch);
export const deleteProduct = (id) => client.remove(id);

export const fetchProductsByProvider = (providerId) =>
  fetchProducts({ provider_id: providerId });

export const searchProducts = ({ term, city, category }) =>
  fetchProducts({ q: term, city, category });

export async function bulkImportProducts(providerId, fileData) {
  // Mock: simplemente devolvemos cuántos "productos" se simulan
  const createdCount = Array.isArray(fileData?.rows)
    ? fileData.rows.length
    : 0;
  return { provider_id: providerId, created: createdCount };
}
