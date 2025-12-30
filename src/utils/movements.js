// src/utils/movements.js

/**
 * Crea un registro de movimiento/auditoría para un ajuste o evento de inventario.
 * delta: +ingreso, -egreso
 * reason: 'correction' | 'damage' | 'receive' | 'return' | 'shrinkage' | ...
 */
export function createMovement({ item, delta = 0, reason = 'correction', actor }) {
  const now = new Date().toISOString();
  const before = Number(item?.on_hand ?? item?.stock ?? 0);
  const after = before + Number(delta || 0);

  return {
    id: `mv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    item_id: item?.id,
    delta: Number(delta || 0),
    reason,
    actor: actor ? { id: actor.id, name: actor.name, role: actor.role } : null,
    created_at: now,
    meta: {
      before,
      after,
      // puedes incluir batch_id si el ajuste es por lote
      product_snapshot: {
        sku: item?.sku, name: item?.name, category: item?.category,
      }
    }
  };
}

/**
 * Aplica un movimiento sobre el item en memoria (front) y devuelve el nuevo item.
 * OJO: en producción, debes persistir (API) y confiar en la respuesta del backend.
 */
export function applyMovementToItem(item, movement) {
  const next = { ...item };
  const before = Number(next?.on_hand ?? next?.stock ?? 0);
  next.on_hand = before + Number(movement?.delta || 0);
  if (next.on_hand < 0) next.on_hand = 0;
  return next;
}
