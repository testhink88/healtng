// src/utils/reorder.js
import { computeNetStock, deriveStockStatus, STOCK_STATUS } from './stock';

/**
 * Construye sugerencias de reorden para items en LOW/OUT.
 * Regla simple: pedir hasta 2x del punto de reorden descontando el neto actual.
 */
export function buildReorderSuggestions(items = []) {
  return (items || [])
    .map(it => {
      const on_hand = Number(it?.on_hand ?? it?.stock ?? 0);
      const reserved = Number(it?.reserved ?? 0);
      const reorder_point = Number(it?.reorder_point ?? it?.reorderPoint ?? 0);
      const status = deriveStockStatus({ on_hand, reserved, reorder_point });
      const net = computeNetStock({ on_hand, reserved });

      return {
        product_id: it?.id,
        sku: it?.sku,
        name: it?.name,
        status,
        net,
        reorder_point,
        suggested_qty: Math.max(reorder_point * 2 - net, 0),
      };
    })
    .filter(sg => [STOCK_STATUS.OUT, STOCK_STATUS.LOW].includes(sg.status) && sg.suggested_qty > 0);
}

/**
 * Suma cantidades sugeridas para construir un payload compacto de OC (opcional).
 */
export function summarizeReorderPayload(suggestions = []) {
  return {
    total_items: suggestions.length,
    total_units: suggestions.reduce((acc, s) => acc + Number(s.suggested_qty || 0), 0),
    items: suggestions.map(({ product_id, suggested_qty }) => ({ product_id, qty: suggested_qty })),
  };
}
