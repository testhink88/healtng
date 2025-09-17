// src/utils/mockData.js
import { getProviderProfile } from "./providerProfile";

// --- Perfil cargado desde localStorage (si existe) ---
const profile = getProviderProfile();
console.log("Perfil cargado desde localStorage:", profile);

// ==========================
//  ANALYTICS
// ==========================
export function getAnalytics(...args) {
  console.warn("Placeholder: getAnalytics is not implemented yet.", args);
  return {
    salesToday: 1250.75,
    orders: 23,
    topSku: "SKU-P-001",
    fillRate: 0.92,
  };
}

// ==========================
//  PRODUCTS
// ==========================
let mockProducts = [
  {
    id: "P-001",
    sku: "SKU-P-001",
    name: "Producto Ejemplo 1",
    uom: "unidad",
    price: 25.5,
    stock: 150,
    category: "General",
    retailChannels: { b2c: true, b2b: false },
  },
  {
    id: "P-002",
    sku: "SKU-P-002",
    name: "Producto Ejemplo 2",
    uom: "caja",
    price: 45.0,
    stock: 75,
    category: "Equipamiento",
    retailChannels: { b2c: false, b2b: true },
  },
];

export function getProducts(...args) {
  console.warn("Placeholder: getProducts is not implemented yet.", args);
  return mockProducts;
}

export function upsertProduct(productData) {
  const existingIndex = mockProducts?.findIndex((p) => p?.id === productData?.id);
  if (existingIndex >= 0) {
    mockProducts[existingIndex] = { ...mockProducts?.[existingIndex], ...productData };
  } else {
    mockProducts?.push(productData);
  }
  return [...mockProducts];
}

export function togglePublishChannel(productId, channel) {
  const productIndex = mockProducts?.findIndex((p) => p?.id === productId);
  if (productIndex >= 0) {
    const product = mockProducts?.[productIndex];
    const currentChannels = product?.retailChannels || {};
    mockProducts[productIndex] = {
      ...product,
      retailChannels: {
        ...currentChannels,
        [channel]: !currentChannels?.[channel],
      },
    };
  }
  return [...mockProducts];
}

// ==========================
//  B2B ORDERS
// ==========================
export function getB2BOrders(...args) {
  console.warn("Placeholder: getB2BOrders is not implemented yet.", args);
  return [
    { id: "B2B-001", buyer: "Clínica San Rafael", total: 450.0, status: "Pendiente" },
    { id: "B2B-002", buyer: "Hospital Central", total: 850.25, status: "Procesando" },
    { id: "B2B-003", buyer: "Laboratorio Norte", total: 320.5, status: "Completado" },
  ];
}

export function setB2BOrders(...args) {
  console.warn("Placeholder: setB2BOrders is not implemented yet.", args);
  return null;
}

// ==========================
//  APPOINTMENTS
// ==========================
let mockAppointments = [
  { id: "APT-001", service: "Consulta General", customer: "María González", when: "2025-01-07 09:00", status: "booked" },
  { id: "APT-002", service: "Examen de Rutina", customer: "Carlos Rodríguez", when: "2025-01-07 10:30", status: "booked" },
  { id: "APT-003", service: "Seguimiento", customer: "Ana Martínez", when: "2025-01-07 14:00", status: "done" },
];

export function getAppointments(...args) {
  console.warn("Placeholder: getAppointments is not implemented yet.", args);
  return mockAppointments || [];
}

export function setAppointments(appointments, ...args) {
  console.warn("Placeholder: setAppointments is not implemented yet.", args);
  if (Array.isArray(appointments)) {
    mockAppointments = [...appointments];
  }
  return mockAppointments || [];
}

// ==========================
//  AUTHORIZATIONS
// ==========================
let mockAuthorizations = [
  { id: "AUTH-001", member: "María García", procedure: "Resonancia Magnética", status: "requested", date: "2025-01-07", priority: "normal" },
  { id: "AUTH-002", member: "Carlos López", procedure: "Cirugía Ambulatoria", status: "requested", date: "2025-01-08", priority: "urgent" },
  { id: "AUTH-003", member: "Ana Rodríguez", procedure: "Tomografía Computada", status: "approved", date: "2025-01-06", priority: "normal" },
  { id: "AUTH-004", member: "José Martínez", procedure: "Endoscopía", status: "denied", date: "2025-01-05", priority: "normal" },
];

export function getAuthorizations(...args) {
  console.warn("Placeholder: getAuthorizations is not implemented yet.", args);
  return mockAuthorizations || [];
}

export function setAuthorizations(authorizations, ...args) {
  console.warn("Placeholder: setAuthorizations is not implemented yet.", args);
  if (Array.isArray(authorizations)) {
    mockAuthorizations = [...authorizations];
  }
  return mockAuthorizations || [];
}

// ==========================
//  CLAIMS
// ==========================
let mockClaims = [
  { id: "CLM-001", member: "María García", amount: 450.75, status: "submitted", date: "2025-01-07", procedure: "Consulta Especializada" },
  { id: "CLM-002", member: "Carlos López", amount: 1200.0, status: "submitted", date: "2025-01-06", procedure: "Análisis de Laboratorio" },
  { id: "CLM-003", member: "Ana Rodríguez", amount: 850.25, status: "paid", date: "2025-01-05", procedure: "Radiografía" },
  { id: "CLM-004", member: "José Martínez", amount: 320.5, status: "paid", date: "2025-01-04", procedure: "Consulta General" },
];

export function getClaims(...args) {
  console.warn("Placeholder: getClaims is not implemented yet.", args);
  return mockClaims || [];
}

export function setClaims(claims, ...args) {
  console.warn("Placeholder: setClaims is not implemented yet.", args);
  if (Array.isArray(claims)) {
    mockClaims = [...claims];
  }
  return mockClaims || [];
}

// ==========================
//  RX INBOX
// ==========================
let mockRxInbox = [
  { id: "RX-001", rxCode: "001234", medication: "Omeprazol 20mg", patient: "María García", status: "pending", date: "2025-01-07", dosage: "1 tablet daily", duration: "30 days" },
  { id: "RX-002", rxCode: "001235", medication: "Atorvastatina 40mg", patient: "Carlos López", status: "pending", date: "2025-01-07", dosage: "1 tablet at night", duration: "90 days" },
  { id: "RX-003", rxCode: "001236", medication: "Losartán 50mg", patient: "Ana Rodríguez", status: "accepted", date: "2025-01-06", dosage: "1 tablet twice daily", duration: "60 days" },
  { id: "RX-004", rxCode: "001237", medication: "Metformina 850mg", patient: "José Martínez", status: "rejected", date: "2025-01-06", dosage: "1 tablet with meals", duration: "30 days" },
];

export function getRxInbox(...args) {
  console.warn("Placeholder: getRxInbox is not implemented yet.", args);
  return mockRxInbox || [];
}

export function setRxInbox(rxInbox, ...args) {
  console.warn("Placeholder: setRxInbox is not implemented yet.", args);
  if (Array.isArray(rxInbox)) {
    mockRxInbox = [...rxInbox];
  }
  return mockRxInbox || [];
}

// ==========================
//  LAB ORDERS
// ==========================
let mockLabOrders = [
  { id: "LAB-001", patient: "María García", test: "Hemograma Completo", status: "received", date: "2025-01-07", priority: "normal" },
  { id: "LAB-002", patient: "Carlos López", test: "Perfil Lipídico", status: "in_progress", date: "2025-01-07", priority: "normal" },
  { id: "LAB-003", patient: "Ana Rodríguez", test: "Glucosa en Ayunas", status: "delivered", date: "2025-01-06", priority: "urgent" },
  { id: "LAB-004", patient: "José Martínez", test: "Función Renal", status: "received", date: "2025-01-06", priority: "normal" },
];

export function getLabOrders(...args) {
  console.warn("Placeholder: getLabOrders is not implemented yet.", args);
  return mockLabOrders || [];
}

export function setLabOrders(labOrders, ...args) {
  console.warn("Placeholder: setLabOrders is not implemented yet.", args);
  if (Array.isArray(labOrders)) {
    mockLabOrders = [...labOrders];
  }
  return mockLabOrders || [];
}

// ==========================
//  OPTICS ORDERS (placeholders)
// ==========================
export function getOpticsOrders(...args) {
  console.warn("Placeholder: getOpticsOrders is not implemented yet.", args);
  return null;
}

export function setOpticsOrders(...args) {
  console.warn("Placeholder: setOpticsOrders is not implemented yet.", args);
  return null;
}
