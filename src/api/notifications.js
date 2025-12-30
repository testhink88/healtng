// src/api/notifications.js
import { createMockClient } from "./_mockBase";

const client = createMockClient("healtng_notifications_v1");

export async function fetchNotifications(userId) {
  return client.list((n) => String(n.user_id) === String(userId));
}

export const createNotification = (payload) => client.create(payload);

export async function markNotificationAsRead(notificationId) {
  return client.update(notificationId, { is_read: true });
}

export async function markAllAsRead(userId) {
  const list = await fetchNotifications(userId);
  await Promise.all(list.map((n) => markNotificationAsRead(n.id)));
  return true;
}
