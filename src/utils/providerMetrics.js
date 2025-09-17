// src/utils/providerMetrics.js
import { getProducts, getB2BOrders } from "./mockData";
import { getShipments } from "./shipmentsMock";

export function getInventoryCount() {
  try {
    const items = getProducts?.() || [];
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}

export function getPendingOrdersCount() {
  try {
    const orders = getB2BOrders?.() || [];
    // Consideramos "pendientes" los que no estén "Completado/Completado"
    const pending = orders.filter(o => {
      const s = String(o?.status || '').toLowerCase();
      return !['completado', 'completed', 'pagado', 'paid'].includes(s);
    });
    return pending.length;
  } catch {
    return 0;
  }
}

export function getActiveShipmentsCount() {
  try {
    const sh = getShipments?.() || [];
    // Activos = pending + in_transit + late (no entregados)
    const active = sh.filter(x => x?.status !== 'delivered');
    return active.length;
  } catch {
    return 0;
  }
}

// Útil si quieres pedir todo de una vez
export function getProviderBadges() {
  return {
    inventory: getInventoryCount(),
    orders: getPendingOrdersCount(),
    shipments: getActiveShipmentsCount(),
  };
}
