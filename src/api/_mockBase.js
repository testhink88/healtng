// src/api/_mockBase.js
// Pequeño cliente genérico para CRUD en localStorage.
// Úsalo solo en entorno de prototipado.

// Latencia por defecto para mocks
export const DEFAULT_LATENCY = 120; // ms

// Utilidades compartidas
export const delay = (ms = DEFAULT_LATENCY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const safeArray = (val, fallback = []) =>
  Array.isArray(val) ? val : fallback;

export const safeObject = (val, fallback = {}) =>
  val && typeof val === "object" && !Array.isArray(val) ? val : fallback;

// ------------------------------------------------------
// Cliente CRUD basado en localStorage
// ------------------------------------------------------
export function createMockClient(
  storageKey,
  { seed = [], indexKey = "id", latency = DEFAULT_LATENCY } = {}
) {
  const KEY = storageKey;

  const load = () => {
    if (typeof window === "undefined") return [...seed];
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) {
        if (seed.length) {
          window.localStorage.setItem(KEY, JSON.stringify(seed));
        }
        return [...seed];
      }
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data;
    } catch (e) {
      console.warn("MockClient load error", e);
      return [];
    }
  };

  const save = (items) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("MockClient save error", e);
    }
  };

  const generateId = () =>
    `${storageKey}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;

  return {
    async list(filterFn) {
      await delay(latency);
      const all = load();
      return typeof filterFn === "function" ? all.filter(filterFn) : all;
    },

    async get(id) {
      await delay(latency);
      const all = load();
      return all.find((item) => String(item[indexKey]) === String(id)) || null;
    },

    async create(payload) {
      await delay(latency);
      const all = load();
      const now = new Date().toISOString();
      const id = payload[indexKey] || generateId();
      const item = {
        ...payload,
        [indexKey]: id,
        created_at: now,
        updated_at: now,
      };
      all.push(item);
      save(all);
      return item;
    },

    async update(id, patch) {
      await delay(latency);
      const all = load();
      const idx = all.findIndex((item) => String(item[indexKey]) === String(id));
      if (idx === -1) return null;
      const now = new Date().toISOString();
      const updated = { ...all[idx], ...patch, updated_at: now };
      all[idx] = updated;
      save(all);
      return updated;
    },

    async remove(id) {
      await delay(latency);
      const all = load();
      const idx = all.findIndex((item) => String(item[indexKey]) === String(id));
      if (idx === -1) return false;
      all.splice(idx, 1);
      save(all);
      return true;
    },

    // Para debug
    _loadRaw: () => load(),
    _saveRaw: (items) => save(items),
  };
}
