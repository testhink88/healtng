// src/utils/demoProfileStorage.js

const STORAGE_KEYS = {
  patient: "healtng_profile_patient",
  doctor: "healtng_profile_doctor",
  clinic: "healtng_profile_clinic",
};

export const saveDemoProfile = (role, data) => {
  const key = STORAGE_KEYS[role];
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadDemoProfile = (role) => {
  const key = STORAGE_KEYS[role];
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearDemoProfiles = () => {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
};

// ✅ Default export para compatibilidad con tu index.js/barrels
const demoProfileStorage = {
  saveDemoProfile,
  loadDemoProfile,
  clearDemoProfiles,
  STORAGE_KEYS,
};

export default demoProfileStorage;
