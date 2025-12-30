// src/api/orders.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_orders_v1");

export async function fetchOrders(filters = {}) {
  const { patient_id, provider_id, clinic_id, status } = filters;
  return client.list((o) => {
    let ok = true;
    if (patient_id) ok = ok && String(o.patient_id) === String(patient_id);
    if (provider_id) ok = ok && String(o.provider_id) === String(provider_id);
    if (clinic_id) ok = ok && String(o.clinic_id) === String(clinic_id);
    if (status) ok = ok && String(o.status || "") === String(status);
    return ok;
  });
}

export const getOrderById = (id) => client.get(id);

export const placeOrder = (payload) =>
  client.create({
    status: "pending",
    ...payload,
  });

export const updateOrderStatus = (id, statusPatch) =>
  client.update(id, { status: statusPatch });

export const fetchOrdersByPatient = (patientId) =>
  fetchOrders({ patient_id: patientId });

export const fetchOrdersByProvider = (providerId) =>
  fetchOrders({ provider_id: providerId });

export const fetchOrdersByClinic = (clinicId) =>
  fetchOrders({ clinic_id: clinicId });
