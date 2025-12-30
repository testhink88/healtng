// src/api/auth.js
import { createMockClient } from "./_mockBase";

const usersClient = createMockClient("healtng_users_v1");
const CURRENT_KEY = "healtng_current_user_v1";
const LATENCY = 120;
const delay = () => new Promise((r) => setTimeout(r, LATENCY));

const loadCurrent = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveCurrent = (user) => {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(CURRENT_KEY);
  } else {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  }
};

export async function registerPatient(payload) {
  // en mock: role = patient
  const user = await usersClient.create({
    role: "patient",
    ...payload,
  });
  saveCurrent(user);
  return user;
}

export async function registerProfessional(payload) {
  const user = await usersClient.create({
    role: "professional",
    ...payload,
  });
  saveCurrent(user);
  return user;
}

export async function registerClinic(payload) {
  const user = await usersClient.create({
    role: "clinic",
    ...payload,
  });
  saveCurrent(user);
  return user;
}

export async function registerProvider(payload) {
  const user = await usersClient.create({
    role: "provider",
    ...payload,
  });
  saveCurrent(user);
  return user;
}

export async function login({ email, password }) {
  await delay();
  const list = await usersClient.list();
  const found = list.find((u) => u.email === email);
  // En mock ignoramos el password
  if (!found) {
    throw new Error("Usuario no encontrado (mock)");
  }
  saveCurrent(found);
  return found;
}

export async function logout() {
  await delay();
  saveCurrent(null);
  return true;
}

export async function getCurrentUser() {
  await delay();
  return loadCurrent();
}

export async function setCurrentUser(user) {
  await delay();
  saveCurrent(user);
  return user;
}

export async function requestPasswordReset(email) {
  await delay();
  // Solo se simula
  return { email, requested: true };
}

export async function resetPassword(token, newPassword) {
  await delay();
  // En mock no hacemos nada con esto
  return { token, changed: true, newPasswordLength: newPassword?.length ?? 0 };
}
