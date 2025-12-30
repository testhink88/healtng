// src/utils/batches.js

/**
 * Selección FEFO: eliges el lote con vencimiento más próximo que aún tenga stock.
 */
export function pickFEFOBatch(batches = []) {
  return [...(batches || [])]
    .filter(b => Number(b?.on_hand || 0) > 0)
    .sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at))[0] || null;
}

/**
 * ¿Está vencido este lote? (fecha <= hoy)
 */
export function hasExpired(batch) {
  if (!batch?.expires_at) return false;
  const d = new Date(batch.expires_at);
  const today = new Date();
  // normaliza a medianoche para comparación justa
  d.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return d <= today;
}

/**
 * ¿Vence en N días o menos?
 */
export function expiresInDays(batch, days = 30) {
  if (!batch?.expires_at) return false;
  const now = new Date();
  const exp = new Date(batch.expires_at);
  const diff = (exp - now) / (1000 * 60 * 60 * 24);
  return diff <= days;
}

/**
 * Métricas de vencimiento sobre un conjunto de lotes.
 */
export function expiryMetrics(batches = [], windowDays = 30) {
  const total = batches?.length || 0;
  const expired = batches?.filter(hasExpired) || [];
  const expiringSoon = batches?.filter(b => !hasExpired(b) && expiresInDays(b, windowDays)) || [];
  return {
    total,
    expiredCount: expired.length,
    expiringSoonCount: expiringSoon.length,
    expired,
    expiringSoon,
  };
}
