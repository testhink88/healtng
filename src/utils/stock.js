// src/utils/stock.js

/**
 * Estados estándar de inventario a nivel dominio.
 */
export const STOCK_STATUS = {
  OUT: 'out-of-stock',     // Sin stock neto
  LOW: 'low-stock',        // Bajo stock (<= reorder point)
  OK: 'in-stock',          // Normal
  OVER: 'overstocked',     // Sobre stock (> 3x reorder point)
};

/**
 * Stock neto = on_hand - reserved (nunca negativo).
 */
export function computeNetStock({ on_hand = 0, reserved = 0 }) {
  const net = Number(on_hand) - Number(reserved);
  return net > 0 ? net : 0;
}

/**
 * Clasifica el estado del stock con base en neto y punto de reorden.
 */
export function deriveStockStatus({ on_hand = 0, reserved = 0, reorder_point = 0 }) {
  const net = computeNetStock({ on_hand, reserved });
  if (net === 0) return STOCK_STATUS.OUT;
  if (net <= Number(reorder_point || 0)) return STOCK_STATUS.LOW;
  if (net > Number(reorder_point || 0) * 3) return STOCK_STATUS.OVER;
  return STOCK_STATUS.OK;
}

/**
 * Deriva flags de riesgo útiles para UI.
 */
export function deriveRiskFlags({ on_hand = 0, reserved = 0, reorder_point = 0 }) {
  const net = computeNetStock({ on_hand, reserved });
  return {
    isOut: net === 0,
    isLow: net > 0 && net <= (reorder_point || 0),
    isOver: net > (reorder_point || 0) * 3,
  };
}

/**
 * Formateadores utilitarios (opcionales).
 */
export const currencyES = (n = 0, currency = 'EUR') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(Number(n) || 0);

export const dateES = (value) => {
  try { return new Intl.DateTimeFormat('es-ES').format(new Date(value)); }
  catch { return String(value ?? ''); }
};
