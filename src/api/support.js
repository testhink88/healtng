// src/api/support.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_support_tickets_v1");

export const createSupportTicket = (payload) =>
  client.create({ status: "open", ...payload });

export async function fetchTickets(filters = {}) {
  const { user_id, status } = filters;
  return client.list((t) => {
    let ok = true;
    if (user_id) ok = ok && String(t.user_id) === String(user_id);
    if (status) ok = ok && String(t.status || "") === String(status);
    return ok;
  });
}

export const getTicketById = (id) => client.get(id);

export const updateTicketStatus = (id, statusPatch) =>
  client.update(id, { status: statusPatch });
