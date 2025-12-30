// src/api/finance/ar.js
import { fetchFinanceOrders } from "./orders";

/**
 * Utilidad: diferencia en días
 */
const daysBetween = (from, to = new Date()) => {
  const a = new Date(from);
  const b = new Date(to);
  return Math.floor((b - a) / (1000 * 60 * 60 * 24));
};

/**
 * Aging Report de Cuentas por Cobrar (por aseguradora)
 */
export const getAgingByPayer = async (clinic_id) => {
  const orders = await fetchFinanceOrders({
    clinic_id,
    status: "pending_payment",
    payer_type: "insurance",
  });

  const map = {};

  orders.forEach((o) => {
    const days = daysBetween(o.billed_at);

    if (!map[o.payer_id]) {
      map[o.payer_id] = {
        payer: o.payer_id,
        total_amount: 0,
        avg_days: 0,
        orders: [],
      };
    }

    map[o.payer_id].total_amount += o.total_amount;
    map[o.payer_id].orders.push(days);
  });

  return Object.values(map).map((p) => ({
    payer: p.payer,
    total_amount: p.total_amount,
    avg_days:
      p.orders.reduce((a, b) => a + b, 0) / (p.orders.length || 1),
  }));
};

/**
 * KPI: Días Promedio de Reembolso (DPR)
 */
export const getDPR = async (clinic_id) => {
  const orders = await fetchFinanceOrders({
    clinic_id,
    payer_type: "insurance",
  });

  const paid = orders.filter(
    (o) => o.status === "paid" && o.paid_at
  );

  if (!paid.length) return 0;

  const days = paid.map((o) =>
    daysBetween(o.billed_at, o.paid_at)
  );

  return (
    days.reduce((a, b) => a + b, 0) / days.length
  );
};

/**
 * Análisis de gargalos de cobranza
 */
export const getCollectionBottlenecks = async (clinic_id) => {
  const orders = await fetchFinanceOrders({
    clinic_id,
    payer_type: "insurance",
  });

  const byService = {};

  orders.forEach((o) => {
    if (!byService[o.service_category]) {
      byService[o.service_category] = {
        service: o.service_category,
        pending_amount: 0,
        count: 0,
      };
    }

    if (o.status === "pending_payment") {
      byService[o.service_category].pending_amount += o.total_amount;
      byService[o.service_category].count += 1;
    }
  });

  return Object.values(byService).sort(
    (a, b) => b.pending_amount - a.pending_amount
  );
};

/**
 * Resumen ejecutivo de AR
 */
export const getARSummary = async (clinic_id) => {
  const orders = await fetchFinanceOrders({
    clinic_id,
    status: "pending_payment",
  });

  const total = orders.reduce(
    (acc, o) => acc + o.total_amount,
    0
  );

  return {
    total_accounts_receivable: total,
    open_orders: orders.length,
  };
};
