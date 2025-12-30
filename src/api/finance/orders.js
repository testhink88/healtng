// src/api/finance/orders.js
import { createMockClient } from "../_mockBase";

/**
 * Órdenes financieras unificadas de la clínica.
 * Representan lo que se factura, se cobra o se debe cobrar.
 */
const client = createMockClient("healtng_finance_orders_v1");

/**
 * Obtener todas las órdenes financieras
 */
export const fetchFinanceOrders = async (filters = {}) => {
  const {
    clinic_id,
    payer_type,
    payer_id,
    status,
    from_date,
    to_date,
  } = filters;

  return client.list((o) => {
    let ok = true;

    if (clinic_id) ok = ok && o.clinic_id === clinic_id;
    if (payer_type) ok = ok && o.payer_type === payer_type;
    if (payer_id) ok = ok && o.payer_id === payer_id;
    if (status) ok = ok && o.status === status;

    if (from_date) {
      ok = ok && new Date(o.billed_at) >= new Date(from_date);
    }

    if (to_date) {
      ok = ok && new Date(o.billed_at) <= new Date(to_date);
    }

    return ok;
  });
};

/**
 * Crear una orden financiera
 * (normalmente se dispara desde consulta, procedimiento, farmacia, etc.)
 */
export const createFinanceOrder = async (payload) => {
  return client.create({
    status: "billed",
    currency: "USD",
    ...payload,
  });
};

/**
 * Actualizar estado de la orden
 * Ej: pending_payment → paid
 */
export const updateFinanceOrderStatus = async (id, patch) => {
  return client.update(id, patch);
};

/**
 * Obtener orden por ID
 */
export const getFinanceOrderById = async (id) => {
  return client.get(id);
};

/**
 * Debug helpers
 */
export const _loadFinanceOrdersRaw = () => client._loadRaw();
export const _saveFinanceOrdersRaw = (items) => client._saveRaw(items);
