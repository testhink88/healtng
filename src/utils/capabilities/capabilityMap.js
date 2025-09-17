// src/utils/capabilities/capabilityMap.js
// Catálogo de capacidades y mapeo Negocio -> capacidades

export const CAPABILITIES = {
  RX_INTAKE:       "rx_intake",        // intake/validación/dispensa de recetas
  LAB_ORDERS:      "lab_orders",       // gestión de órdenes de laboratorio/imagen
  OPTICS_ORDERS:   "optics_orders",    // órdenes de óptica
  APPOINTMENTS:    "appointments",     // agenda/turnos/servicios
  B2B:             "b2b",              // compras B2B / abastecimiento
  ANALYTICS:       "analytics",        // KPIs/BI
  AUTHORIZATIONS:  "authorizations",   // autorizaciones (aseguradora)
  CLAIMS:          "claims",           // siniestros/claims (aseguradora)
};

// *** LISTA COMPLETA de tipos de negocio ***
export const BUSINESS_TYPES = [
  "Consultorio Médico Privado",
  "Clínica o Centro de Salud Integral",
  "Centro de Diagnóstico / Imagenología",
  "Centro de Entrenamiento Funcional",
  "Laboratorio Clínico",
  "Farmacia",
  "Droguería",
  "Distribuidor de Medicamentos",
  "Distribuidor de Insumos Médicos",
  "Tienda de Equipos Médicos",
  "Óptica / Centro de Visión",
  "Centro de Rehabilitación / Fisioterapia",
  "Centro de Salud Mental / Psicología",
  "Estética Médica / Spa Médico",
  "Centro de Medicina Alternativa",
  "Centro de Vacunación",
  "Servicio de Ambulancias / Emergencias Médicas",
  "Consultora de Salud / Telemedicina",
  "Funeraria / Servicios de Previsión",
  "Empresa de Seguros de Salud",
  "ONG o Fundación de Salud",
  "Empresa de Salud Ocupacional",
  "Centro de Educación Médica / Formación Profesional",
  "Proveedor de Servicios de Bioseguridad",
  "Empresa de Servicios Logísticos en Salud",
];

const C = CAPABILITIES;

// Mapa Negocio -> capacidades (extensible)
export const capabilitiesByBusinessType = {
  "Farmacia":                          [C?.RX_INTAKE, C?.B2B, C?.ANALYTICS],
  "Droguería":                         [C?.RX_INTAKE, C?.B2B, C?.ANALYTICS],
  "Distribuidor de Medicamentos":      [C?.B2B, C?.ANALYTICS],
  "Distribuidor de Insumos Médicos":   [C?.B2B, C?.ANALYTICS],
  "Tienda de Equipos Médicos":         [C?.B2B, C?.ANALYTICS],

  "Laboratorio Clínico":               [C?.LAB_ORDERS, C?.B2B, C?.ANALYTICS],
  "Centro de Diagnóstico / Imagenología": [C?.LAB_ORDERS, C?.ANALYTICS],

  "Óptica / Centro de Visión":         [C?.OPTICS_ORDERS, C?.B2B, C?.ANALYTICS],

  "Consultorio Médico Privado":        [C?.APPOINTMENTS, C?.ANALYTICS],
  "Clínica o Centro de Salud Integral":[C?.APPOINTMENTS, C?.ANALYTICS],
  "Centro de Entrenamiento Funcional": [C?.APPOINTMENTS, C?.ANALYTICS],
  "Centro de Rehabilitación / Fisioterapia": [C?.APPOINTMENTS, C?.ANALYTICS],
  "Centro de Salud Mental / Psicología":[C?.APPOINTMENTS, C?.ANALYTICS],
  "Estética Médica / Spa Médico":      [C?.APPOINTMENTS, C?.ANALYTICS],
  "Centro de Medicina Alternativa":    [C?.APPOINTMENTS, C?.ANALYTICS],
  "Centro de Vacunación":              [C?.APPOINTMENTS, C?.ANALYTICS],
  "Consultora de Salud / Telemedicina":[C?.APPOINTMENTS, C?.ANALYTICS],
  "Empresa de Salud Ocupacional":      [C?.APPOINTMENTS, C?.ANALYTICS],

  "Servicio de Ambulancias / Emergencias Médicas": [C?.APPOINTMENTS, C?.ANALYTICS],
  "Proveedor de Servicios de Bioseguridad":        [C?.B2B, C?.ANALYTICS],
  "Empresa de Servicios Logísticos en Salud":      [C?.B2B, C?.ANALYTICS],
  "Centro de Educación Médica / Formación Profesional": [C?.ANALYTICS],
  "ONG o Fundación de Salud":                      [C?.ANALYTICS],
  "Funeraria / Servicios de Previsión":           [C?.ANALYTICS],

  // *** ASEGURADORA ***
  "Empresa de Seguros de Salud":      [C?.AUTHORIZATIONS, C?.CLAIMS, C?.ANALYTICS, C?.B2B],
};

// Helpers
const STORAGE_KEY = "providerProfile";
export function getproviderProfile() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}
export function setproviderProfile(partial) {
  const cur = getproviderProfile() || {};
  const next = { ...cur, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
export function getCapabilitiesForCurrentprovider() {
  const p = getproviderProfile();
  const type = p?.businessType || "";
  return capabilitiesByBusinessType?.[type] || [C?.ANALYTICS];
}
function resolveCapabilities(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: resolveCapabilities is not implemented yet.', args);
  return null;
}

export { resolveCapabilities };
function capabilitySidebarItems(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: capabilitySidebarItems is not implemented yet.', args);
  return null;
}

export { capabilitySidebarItems };