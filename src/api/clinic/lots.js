// Cliente "mock" para Lotes y Vencimientos.
// Guarda datos en localStorage para persistencia mínima en entorno dev.
// Si luego conectas backend, solo reemplaza las funciones por fetch/axios y
// mantén las mismas firmas.

const STORAGE_KEY = "healtng_lots_v1";

// -------------------- Utils --------------------
const todayISO = () => new Date().toISOString().slice(0, 10);

function classifyExpiry(expires_at) {
  // Retorna: { status: 'ok' | 'near' | 'expired', days_to_expiry: number }
  if (!expires_at) return { status: "ok", days_to_expiry: null };
  const now = new Date();
  const exp = new Date(expires_at + "T23:59:59");
  const diffMs = exp - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days < 0) return { status: "expired", days_to_expiry: days };
  if (days <= 30) return { status: "near", days_to_expiry: days };
  return { status: "ok", days_to_expiry: days };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// -------------------- Seed inicial --------------------
function ensureSeed() {
  if (load()) return;
  const seed = [
    {
      id: "L-AX-01",
      product_id: 1,
      product_sku: "HC20241201004",
      product_name: "Amoxicilina 250mg",
      lot_code: "L-AX-01",
      on_hand: 30,
      unit: "unidades",
      received_at: "2024-10-10",
      expires_at: "2025-12-31",
      supplier: "Farmacéutica Internacional",
      notes: "",
    },
    {
      id: "L-AX-02",
      product_id: 1,
      product_sku: "HC20241201004",
      product_name: "Amoxicilina 250mg",
      lot_code: "L-AX-02",
      on_hand: 45,
      unit: "unidades",
      received_at: "2024-12-01",
      expires_at: "2026-06-30",
      supplier: "Farmacéutica Internacional",
      notes: "",
    },
    {
      id: "L-DES-01",
      product_id: 2,
      product_sku: "HC20241201007",
      product_name: "Desinfectante Hospitalario",
      lot_code: "L-DES-01",
      on_hand: 30,
      unit: "litros",
      received_at: "2024-11-01",
      expires_at: "2025-04-15",
      supplier: "Quimiclin",
      notes: "",
    },
    {
      id: "L-GAS-01",
      product_id: 3,
      product_sku: "HC20241201003",
      product_name: "Gasas Estériles 10x10cm",
      lot_code: "L-GAS-01",
      on_hand: 0,
      unit: "unidades",
      received_at: "2023-12-10",
      expires_at: "2024-01-15",
      supplier: "MediPack",
      notes: "Lote vencido",
    },
  ];
  save(seed);
}
ensureSeed();

// -------------------- API pública --------------------

/**
 * Lista lotes con filtros opcionales
 * @param {Object} params
 *  - search: string
 *  - status: 'all'|'ok'|'near'|'expired'
 *  - productId: number
 */
export async function fetchLots(params = {}) {
  const { search = "", status = "all", productId } = params;
  const q = (search || "").toLowerCase();

  let list = load() || [];
  list = list.map((l) => {
    const cls = classifyExpiry(l.expires_at);
    return { ...l, ...cls };
  });

  if (q) {
    list = list.filter(
      (l) =>
        l.product_name.toLowerCase().includes(q) ||
        l.product_sku?.toLowerCase().includes(q) ||
        l.lot_code?.toLowerCase().includes(q)
    );
  }
  if (productId) {
    list = list.filter((l) => Number(l.product_id) === Number(productId));
  }
  if (status !== "all") {
    list = list.filter((l) => l.status === status);
  }

  // Simula latencia mínima
  await new Promise((r) => setTimeout(r, 120));
  return list;
}

/**
 * Crea un nuevo lote
 */
export async function createLot(payload) {
  const list = load() || [];
  const id = payload.id || payload.lot_code || `LOT-${Date.now()}`;
  const item = {
    id,
    product_id: payload.product_id ?? null,
    product_sku: payload.product_sku ?? "",
    product_name: payload.product_name ?? "",
    lot_code: payload.lot_code ?? id,
    on_hand: Number(payload.on_hand || 0),
    unit: payload.unit || "unidades",
    received_at: payload.received_at || todayISO(),
    expires_at: payload.expires_at || null,
    supplier: payload.supplier || "",
    notes: payload.notes || "",
  };
  list.push(item);
  save(list);
  return item;
}

/**
 * Actualiza campos del lote
 */
export async function updateLot(id, patch) {
  const list = load() || [];
  const idx = list.findIndex((l) => l.id === id || l.lot_code === id);
  if (idx === -1) throw new Error("Lot not found");
  list[idx] = { ...list[idx], ...patch };
  save(list);
  return list[idx];
}

/**
 * Ajusta cantidad on_hand (+/-)
 */
export async function adjustLot(id, delta) {
  const list = load() || [];
  const idx = list.findIndex((l) => l.id === id || l.lot_code === id);
  if (idx === -1) throw new Error("Lot not found");
  const next = Math.max(0, Number(list[idx].on_hand || 0) + Number(delta || 0));
  list[idx] = { ...list[idx], on_hand: next };
  save(list);
  return list[idx];
}

/**
 * Elimina un lote
 */
export async function deleteLot(id) {
  const list = load() || [];
  const next = list.filter((l) => l.id !== id && l.lot_code !== id);
  save(next);
  return { ok: true };
}

/**
 * Historial mock de movimientos por lote
 */
export async function fetchLotHistory(id) {
  // Simulación simple; en backend esto vendría de la tabla de movimientos
  const base = [
    { ts: "2024-12-01T09:00:00Z", type: "receive", qty: 20, note: "Recepción inicial" },
    { ts: "2025-01-15T12:10:00Z", type: "consume", qty: -5, note: "Consumo quirófano" },
    { ts: "2025-02-10T16:20:00Z", type: "adjust", qty: -2, note: "Ajuste por merma" },
  ];
  await new Promise((r) => setTimeout(r, 100));
  return base.map((x, i) => ({ id: `${id}-${i}`, lot_id: id, ...x }));
}
