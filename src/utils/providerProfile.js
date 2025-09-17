// src/utils/providerProfile.js
const STORAGE_KEY = "providerProfile";

export const defaultProviderProfile = {
  businessName: "Mi Negocio",
  businessType: "",             // 'producto' | 'servicio' | 'mixto'
  operationCategory: "",
  address: "",
  phone: "",
  email: "",
  businessModules: undefined,   // se autocompleta con modulesFor
  createdAt: new Date().toISOString(),
};

export const modulesFor = (type = "mixto") => {
  switch (type) {
    case "producto":
      return { inventario: true,  agenda: false, pedidos: true, despacho: true,  facturacion: true };
    case "servicio":
      return { inventario: false, agenda: true,  pedidos: true, despacho: false, facturacion: true };
    default: // mixto
      return { inventario: true,  agenda: true,  pedidos: true, despacho: true,  facturacion: true };
  }
};

export function getProviderProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setProviderProfile(partial) {
  const current = getProviderProfile() ?? defaultProviderProfile;
  const next = { ...current, ...partial };
  if (!next.businessModules) next.businessModules = modulesFor(next.businessType || "mixto");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  try { window.dispatchEvent(new Event("providerProfile:updated")); } catch {}
  return next;
}

// Escritura “dura” (sin merge)
export function writeProviderProfileHard(profile) {
  const normalized = { ...defaultProviderProfile, ...profile };
  if (!normalized.businessModules) {
    normalized.businessModules = modulesFor(normalized.businessType || "mixto");
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  try { window.dispatchEvent(new Event("providerProfile:updated")); } catch {}
  return normalized;
}

export function hasProviderOnboarding() {
  const p = getProviderProfile();
  return !!p?.businessType;
}

export function clearProviderProfile() {
  localStorage.removeItem(STORAGE_KEY);
  try { window.dispatchEvent(new Event("providerProfile:updated")); } catch {}
}
