// src/utils/providerProfile.js
const STORAGE_KEY = "providerProfile";

export const BUSINESS_TYPES = ["producto", "servicio", "mixto"];
export const AUDIENCES = ["b2c", "b2b", "both"]; // consumidor final, empresas, ambos

export const defaultProviderProfile = {
  businessName: "Mi Negocio",
  businessType: "",            // 'producto' | 'servicio' | 'mixto' (requerido)
  audience: "",                // 'b2c' | 'b2b' | 'both' (requerido)
  canBuy: false,               // habilita Marketplace/Compras a proveedores
  operationCategory: "",
  address: "",
  phone: "",
  email: "",
  businessModules: undefined,  // autocompleta via modulesFor()
  createdAt: new Date().toISOString(),
};

/**
 * Módulos por tipo de negocio + audiencia + canBuy.
 * IMPORTANTE: aquí incluimos también rxIntake, authorizations y analytics
 * para estar alineados con Sidebar y ProviderDashboard.
 */
export const modulesFor = (type = "mixto", audience = "both", canBuy = false) => {
  const t = String(type || "mixto").toLowerCase();
  const aud = String(audience || "both").toLowerCase();

  const base = {
    // inventario sólo si vendes productos o mixto
    inventario: t !== "servicio",
    // agenda si vendes servicios o mixto
    agenda: t !== "producto",
    // siempre gestionas pedidos/órdenes
    pedidos: true,
    // despacho logístico cuando hay productos
    despacho: t !== "servicio",
    // siempre hay facturación
    facturacion: true,
    // Marketplace visible si compra a proveedores o vende a empresas
    marketplace: !!canBuy || aud !== "b2c",

    // extras que usan Sidebar / ProviderDashboard
    rxIntake: true,
    authorizations: true,
    analytics: true,
  };

  return base;
};

export function getProviderProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    console.log("[getProviderProfile] RAW:", raw);

    if (!raw) return null;

    const parsed = JSON.parse(raw);
    console.log("[getProviderProfile] PARSED:", parsed);
    return parsed;
  } catch (err) {
    console.error("[getProviderProfile] Error parseando perfil:", err);
    return null;
  }
}

export function setProviderProfile(partial) {
  const current = getProviderProfile() ?? defaultProviderProfile;
  const next = { ...current, ...partial };

  const bt = BUSINESS_TYPES.includes(next.businessType) ? next.businessType : "mixto";
  const aud = AUDIENCES.includes(next.audience) ? next.audience : "both";
  const buy = Boolean(next.canBuy);

  // siempre recalculamos módulos con la matriz central
  next.businessModules = modulesFor(bt, aud, buy);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  try {
    window.dispatchEvent(new Event("providerProfile:updated"));
  } catch {}

  console.log("[setProviderProfile] GUARDADO:", next);
  return next;
}

// Escritura “dura” (sin merge), útil en onboarding
export function writeProviderProfileHard(profile) {
  const normalized = { ...defaultProviderProfile, ...profile };

  const bt = BUSINESS_TYPES.includes(normalized.businessType)
    ? normalized.businessType
    : "mixto";
  const aud = AUDIENCES.includes(normalized.audience) ? normalized.audience : "both";
  const buy = Boolean(normalized.canBuy);

  normalized.businessModules = modulesFor(bt, aud, buy);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  try {
    window.dispatchEvent(new Event("providerProfile:updated"));
  } catch {}

  console.log("[writeProviderProfileHard] GUARDADO:", normalized);
  return normalized;
}

export function hasProviderOnboarding() {
  const p = getProviderProfile();
  return !!p?.businessType && !!p?.audience;
}

export function clearProviderProfile() {
  localStorage.removeItem(STORAGE_KEY);
  try {
    window.dispatchEvent(new Event("providerProfile:updated"));
  } catch {}
}
