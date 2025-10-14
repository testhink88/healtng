// src/utils/mockData.js
import { getProviderProfile } from "./providerProfile";


const money = (n) => Number(n?.toFixed(2));
const pick = (arr) => arr?.[Math.floor(Math.random() * arr?.length)];
const todayIso = () => new Date()?.toISOString()?.slice(0, 10);

// 1) Central mock data by business type
export function getBusinessContext() {
  try {
    const profile = getProviderProfile() || {};
    return {
      businessType: profile?.businessType || "Farmacia",
      businessName: profile?.businessName || "Mi Negocio",
      operationCategory: profile?.operationCategory || "Venta de medicamentos"
    };
  } catch (error) {
    return {
      businessType: "Farmacia",
      businessName: "Mi Negocio",
      operationCategory: "Venta de medicamentos"
    };
  }
}

export function getMockCatalog(businessType = "") {
  const bType = businessType?.toLowerCase() || "";
  
  // Base products for all businesses
  const base = [
    { sku: "SKU-P-001", name: "Producto Ejemplo 1", category: "General", unit: "unidad", price: 25.5, stock: 150, b2c: true, b2b: false },
    { sku: "SKU-P-002", name: "Producto Ejemplo 2", category: "Equipamiento", unit: "caja", price: 45.0, stock: 75, b2c: false, b2b: true }
  ];
  
  // Farmacia
  if (bType?.includes("farmacia")) {
    return [
      { sku: "RX-100", name: "Omeprazol 20mg", category: "Medicamento", unit: "blister", price: 4.9, stock: 450, b2c: true, b2b: true },
      { sku: "RX-210", name: "Atorvastatina 40mg", category: "Medicamento", unit: "blister", price: 7.2, stock: 320, b2c: true, b2b: true },
      { sku: "RX-301", name: "Losartán 50mg", category: "Medicamento", unit: "blister", price: 6.8, stock: 280, b2c: true, b2b: true },
      { sku: "VIT-001", name: "Vitamina D3", category: "Suplemento", unit: "frasco", price: 12.5, stock: 120, b2c: true, b2b: false },
      ...base
    ];
  }
  
  // Laboratorio Clínico
  if (bType?.includes("laboratorio")) {
    return [
      { sku: "LAB-CRP", name: "Proteína C Reactiva", category: "Reactivo", unit: "kit", price: 110, stock: 12, b2c: false, b2b: true },
      { sku: "LAB-HB1", name: "HbA1c", category: "Reactivo", unit: "kit", price: 135, stock: 10, b2c: false, b2b: true },
      { sku: "LAB-GLU", name: "Glucosa", category: "Reactivo", unit: "kit", price: 65, stock: 25, b2c: false, b2b: true },
      { sku: "LAB-COL", name: "Colesterol Total", category: "Reactivo", unit: "kit", price: 85, stock: 18, b2c: false, b2b: true },
      ...base
    ];
  }
  
  // Óptica / Centro de Visión
  if (bType?.includes("óptica") || bType?.includes("optica") || bType?.includes("visión")) {
    return [
      { sku: "OPT-GLS", name: "Lente monofocal", category: "Óptica", unit: "par", price: 60, stock: 45, b2c: true, b2b: true },
      { sku: "OPT-CTC", name: "Lente de contacto", category: "Óptica", unit: "caja", price: 32, stock: 90, b2c: true, b2b: false },
      { sku: "OPT-PRG", name: "Lente progresivo", category: "Óptica", unit: "par", price: 120, stock: 25, b2c: true, b2b: true },
      { sku: "OPT-SOL", name: "Lentes de sol", category: "Óptica", unit: "unidad", price: 85, stock: 35, b2c: true, b2b: false },
      ...base
    ];
  }
  
  // Consultorio/Centro de Salud - Servicios
  if (bType?.includes("consultorio") || bType?.includes("centro") || bType?.includes("salud")) {
    return [
      { sku: "SRV-001", name: "Consulta General", category: "Servicio", unit: "consulta", price: 45, stock: 0, b2c: true, b2b: false },
      { sku: "SRV-002", name: "Examen Preventivo", category: "Servicio", unit: "examen", price: 65, stock: 0, b2c: true, b2b: false },
      { sku: "SRV-003", name: "Consulta Especializada", category: "Servicio", unit: "consulta", price: 80, stock: 0, b2c: true, b2b: false },
      { sku: "SRV-004", name: "Control Post-Tratamiento", category: "Servicio", unit: "control", price: 35, stock: 0, b2c: true, b2b: false },
      ...base
    ];
  }
  
  // Distribuidor / Equipos / Insumos
  if (bType?.includes("distribuidor") || bType?.includes("equipo") || bType?.includes("insumo")) {
    return [
      { sku: "EQP-001", name: "Tensiómetro Digital", category: "Equipo", unit: "unidad", price: 280, stock: 15, b2c: false, b2b: true },
      { sku: "EQP-002", name: "Estetoscopio", category: "Equipo", unit: "unidad", price: 125, stock: 25, b2c: false, b2b: true },
      { sku: "INS-001", name: "Guantes Nitrilo", category: "Insumo", unit: "caja", price: 18, stock: 200, b2c: false, b2b: true },
      { sku: "INS-002", name: "Mascarillas N95", category: "Insumo", unit: "caja", price: 35, stock: 150, b2c: false, b2b: true },
      ...base
    ];
  }
  
  // Empresa de Seguros
  if (bType?.includes("seguro")) {
    return [
      { sku: "PLN-BAS", name: "Plan Básico", category: "Plan", unit: "mensual", price: 75, stock: 0, b2c: true, b2b: false },
      { sku: "PLN-PRE", name: "Plan Premium", category: "Plan", unit: "mensual", price: 150, stock: 0, b2c: true, b2b: false },
      { sku: "PLN-FAM", name: "Plan Familiar", category: "Plan", unit: "mensual", price: 220, stock: 0, b2c: true, b2b: false },
      { sku: "PLN-EMP", name: "Plan Empresarial", category: "Plan", unit: "anual", price: 1800, stock: 0, b2c: false, b2b: true },
      ...base
    ];
  }
  
  return base;
}

export function getMockOrders(businessType = "") {
  const bType = businessType?.toLowerCase() || "";
  const clinics = ["Clínica San Rafael", "Hospital Central", "Centro Médico Norte", "Clínica Especializada"];
  const statuses = ["Nuevo", "Procesando", "Enviado", "Entregado", "Anulado"];

  const makeOrder = (i) => ( {
    id: `ORD-${String(i)?.padStart(4, "0")}`,
    client: pick(clinics),
    date: todayIso(),
    status: pick(statuses),
    total: money(300 + Math.random() * 1200),
    items: 3 + Math.floor(Math.random() * 15),
    priority: pick(["low", "normal", "high"]),
    tracking: getMockShipmentTracking(`ORD-${String(i)?.padStart(4, "0")}`) // Asignar seguimiento
  });

  const orders = Array.from({ length: 12 }, (_, i) => makeOrder(i + 1));

  if (bType?.includes("farmacia")) {
    orders?.unshift({
      id: "RX-INTAKE",
      client: "Bandeja de Recetas",
      date: todayIso(),
      status: "Procesando",
      total: 0,
      items: 4,
      priority: "high",
      tracking: getMockShipmentTracking("RX-INTAKE") // Agregar tracking
    });
  }
  
  return orders;
}


export function getMockKPIs(businessType = "") {
  const bType = businessType?.toLowerCase() || "";
  const baseSales = 900 + Math.random() * 1200;
  
  let topItem = "SKU-P-001";
  if (bType?.includes("farmacia")) topItem = "Omeprazol 20mg";
  else if (bType?.includes("laboratorio")) topItem = "Proteína C Reactiva";
  else if (bType?.includes("óptica")) topItem = "Lente monofocal";
  else if (bType?.includes("consultorio")) topItem = "Consulta General";
  else if (bType?.includes("distribuidor")) topItem = "Tensiómetro Digital";
  else if (bType?.includes("seguro")) topItem = "Plan Premium";
  
  return {
    ventasHoy: money(baseSales),
    ordenesActivas: 15 + Math.floor(Math.random() * 20),
    fillRate: 88 + Math.floor(Math.random() * 10),
    topSKU: topItem,
    topService: topItem
  };
}

export function getMockAppointments(businessType = "") {
  const bType = businessType?.toLowerCase() || "";
  
  const baseAppointments = [
    { id: "CIT-001", when: `${todayIso()} 09:00`, who: "Ana Rodríguez", service: "Consulta" },
    { id: "CIT-002", when: `${todayIso()} 10:30`, who: "Carlos López", service: "Evaluación" },
    { id: "CIT-003", when: `${todayIso()} 14:00`, who: "María García", service: "Control" }
  ];
  
  if (bType?.includes("óptica") || bType?.includes("optica")) {
    baseAppointments[0].service = "Examen visual";
    baseAppointments[1].service = "Toma de medidas";
    baseAppointments[2].service = "Entrega de lentes";
  } else if (bType?.includes("laboratorio")) {
    baseAppointments[0].service = "Toma de muestras";
    baseAppointments[1].service = "Examen especializado";
    baseAppointments[2].service = "Entrega de resultados";
  }
  
  return baseAppointments;
}

export function getMockAuthorizations(businessType = "") {
  return [
    { id: "AUTH-001", patient: "María García", procedure: "Resonancia Magnética", status: "pending" },
    { id: "AUTH-002", patient: "Carlos López", procedure: "Cirugía Ambulatoria", status: "pending" },
    { id: "AUTH-003", patient: "Ana Rodríguez", procedure: "Tomografía Computada", status: "approved" },
    { id: "AUTH-004", patient: "José Martínez", procedure: "Endoscopía", status: "denied" }
  ];
}

export function getMockClaims(businessType = "") {
  return [
    { id: "CLM-001", patient: "María García", amount: 450.75, status: "pending" },
    { id: "CLM-002", patient: "Carlos López", amount: 1200.00, status: "pending" },
    { id: "CLM-003", patient: "Ana Rodríguez", amount: 850.25, status: "paid" },
    { id: "CLM-004", patient: "José Martínez", amount: 320.50, status: "paid" }
  ];
}

export function getMockSupply(businessType = "") {
  const bType = businessType?.toLowerCase() || "";
  
  return [
    { id: "SUP-001", provider: "Droguería Central", product: "Omeprazol 20mg", quantity: 500, status: "Pendiente" },
    { id: "SUP-002", provider: "Laboratorios Unidos", product: "Reactivos", quantity: 50, status: "Procesando" },
    { id: "SUP-003", provider: "Equipos Médicos SA", product: "Tensiómetros", quantity: 10, status: "Completado" }
  ];
}

export function getMockCustomers(businessType = "") {
  return [
    { id: "CUST-001", name: "Clínica San Rafael", revenue: 15000, nps: 9.2, lastPurchase: "2024-12-01" },
    { id: "CUST-002", name: "Hospital Central", revenue: 25000, nps: 8.8, lastPurchase: "2024-11-28" },
    { id: "CUST-003", name: "Centro Médico Norte", revenue: 18500, nps: 9.0, lastPurchase: "2024-12-02" }
  ];
}

// Persist overrides in localStorage with prefix mock:*
function saveMockOverride(key, data) {
  try {
    localStorage.setItem(`mock:${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save mock override:", error);
  }
}

function getMockOverride(key) {
  try {
    const data = localStorage.getItem(`mock:${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

// Update catalog with localStorage persistence
export function updateMockCatalog(businessType, catalog) {
  saveMockOverride(`catalog:${businessType}`, catalog);
  return catalog;
}

export function getMockCatalogWithOverrides(businessType) {
  const override = getMockOverride(`catalog:${businessType}`);
  return override || getMockCatalog(businessType);
}

// Keep existing functions...
export function getMockProducts(bType = "") {
  return getMockCatalog(bType);
}

export function getMockRxIntake() {
  return [
    { id:"001234", drug:"Omeprazol 20mg",   patient:"María García",  status:"accepted" },
    { id:"001235", drug:"Atorvastatina 40mg", patient:"Carlos López", status:"accepted" },
    { id:"001236", drug:"Losartán 50mg",    patient:"Ana Rodríguez",  status:"accepted" },
    { id:"001237", drug:"Metformina 850mg", patient:"José Martínez",  status:"rejected" },
  ];
}

export function getMockAnalytics(bType = "") {
  const kpis = getMockKPIs(bType);
  const catalog = getMockCatalog(bType);
  
  return {
    todaySales: kpis?.ventasHoy,
    activeOrders: kpis?.ordenesActivas,
    topSku: kpis?.topSKU,
    fillRate: kpis?.fillRate,
    catalog: catalog?.map(p => ({
      sku: p?.sku,
      name: p?.name,
      price: p?.price,
      stock: p?.stock,
      channel: p?.b2b ? "B2B" : "B2C"
    })),
    recentB2B: getMockOrders(bType)?.slice(0, 3)
  };
}

// Enhanced mock data for Provider Dispatch Management and Billing
export function getMockDispatchData(businessType = '') {
  const bType = businessType?.toLowerCase() || '';
  
  const baseShipments = [
    {
      id: 'SHP-2024-001',
      orderId: 'PO-2024-001',
      customer: {
        name: 'Clínica San Rafael',
        contact: 'Dr. María González',
        phone: '+58 212-555-0123'
      },
      status: 'in_transit',
      carrier: 'Transporte Healtng',
      trackingNumber: 'HLT-TRK123456',
      dispatchDate: '2024-12-14T08:00:00Z',
      estimatedDelivery: '2024-12-16T17:00:00Z',
      priority: 'high',
      specialRequirements: bType?.includes('farmacia') ? ['Cadena de frío', 'Entrega con receta'] : [],
      deliveryAddress: 'Av. Principal, Torre Médica, Piso 5, Caracas 1050'
    },
    {
      id: 'SHP-2024-002',
      orderId: 'PO-2024-002',
      customer: {
        name: 'Hospital Central',
        contact: 'Dra. Ana Rodríguez',
        phone: '+58 212-555-0456'
      },
      status: 'preparing',
      carrier: 'Express Médico',
      trackingNumber: 'EXP-456789',
      dispatchDate: '2024-12-14T14:00:00Z',
      estimatedDelivery: '2024-12-17T12:00:00Z',
      priority: 'normal',
      specialRequirements: bType?.includes('laboratorio') ? ['Material frágil', 'Temperatura controlada'] : [],
      deliveryAddress: 'Calle 23, Edificio Hospitalario, Maracaibo 4001'
    }
  ];
  
  return baseShipments;
}

export function getMockBillingData(businessType = '') {
  const bType = businessType?.toLowerCase() || '';
  
  const baseBilling = [
    {
      id: 'INV-2024-001',
      invoiceNumber: 'INV-2024-001',
      orderId: 'PO-2024-001',
      customer: {
        name: 'Clínica San Rafael',
        contact: 'Dr. María González',
        email: 'compras@clinicasanrafael.com'
      },
      issueDate: '2024-12-14T08:30:00Z',
      dueDate: '2025-01-13T23:59:59Z',
      amount: 461.0,
      currency: 'USD',
      amountVES: 16801.5,
      paymentStatus: 'pending',
      taxes: {
        iva: bType?.includes('farmacia') ? 36.88 : 73.76,
        rate: bType?.includes('farmacia') ? 0.08 : 0.16,
        total: bType?.includes('farmacia') ? 497.88 : 534.76
      },
      commission: {
        rate: bType?.includes('farmacia') ? 0.025 : 0.03,
        amount: bType?.includes('farmacia') ? 11.53 : 13.83
      }
    },
    {
      id: 'INV-2024-002',
      invoiceNumber: 'INV-2024-002',
      orderId: 'PO-2024-002',
      customer: {
        name: 'Hospital Central',
        contact: 'Dra. Ana Rodríguez',
        email: 'farmacia@hospitalcentral.com'
      },
      issueDate: '2024-12-14T09:15:00Z',
      dueDate: '2025-01-13T23:59:59Z',
      amount: 992.5,
      currency: 'USD',
      amountVES: 36226.25,
      paymentStatus: 'paid',
      lastPaymentDate: '2024-12-16T10:30:00Z',
      taxes: {
        iva: bType?.includes('farmacia') ? 79.4 : 158.8,
        rate: bType?.includes('farmacia') ? 0.08 : 0.16,
        total: bType?.includes('farmacia') ? 1071.9 : 1151.3
      },
      commission: {
        rate: bType?.includes('farmacia') ? 0.025 : 0.03,
        amount: bType?.includes('farmacia') ? 24.81 : 29.78
      }
    }
  ];
  
  return baseBilling;
}

export function getMockFinancialAnalytics(businessType = '') {
  return {
    totalRevenue: 2450.75,
    pendingAmount: 1458.25,
    paidInvoices: 8,
    profitability: 22.3,
    averagePaymentTime: 18.5,
    monthlyTrend: [
      { month: 'Ene', revenue: 1850.25 },
      { month: 'Feb', revenue: 2120.50 },
      { month: 'Mar', revenue: 1980.75 },
      { month: 'Abr', revenue: 2350.00 },
      { month: 'May', revenue: 2450.75 }
    ]
  };
}

// Enhanced mock data for Provider Order Management
export function getMockProviderOrders(businessType = '') {
  const bType = businessType?.toLowerCase() || '';
  
  const baseOrders = [
    {
      id: 'PO-2024-001',
      customer: {
        name: 'Clínica San Rafael',
        contact: 'Dr. María González',
        phone: '+58 212-555-0123',
        email: 'compras@clinicasanrafael.com'
      },
      products: [
        { sku: 'RX-100', name: 'Omeprazol 20mg', quantity: 50, unitPrice: 4.9 },
        { sku: 'RX-210', name: 'Atorvastatina 40mg', quantity: 30, unitPrice: 7.2 }
      ],
      status: 'received',
      priority: 'high',
      totalAmount: 461.0,
      orderDate: '2024-12-14T08:30:00Z',
      requiredDate: '2024-12-16T17:00:00Z',
      urgencyLevel: 'urgent',
      notes: 'Paciente con condición crítica, necesita entrega urgente',
      fulfillmentStatus: 'pending',
      paymentStatus: 'pending',
      shippingAddress: 'Av. Principal, Torre Médica, Piso 5, Caracas 1050'
    },
    {
      id: 'PO-2024-002',
      customer: {
        name: 'Hospital Central',
        contact: 'Dra. Ana Rodríguez',
        phone: '+58 212-555-0456',
        email: 'farmacia@hospitalcentral.com'
      },
      products: [
        { sku: 'RX-301', name: 'Losartán 50mg', quantity: 100, unitPrice: 6.8 },
        { sku: 'VIT-001', name: 'Vitamina D3', quantity: 25, unitPrice: 12.5 }
      ],
      status: 'processing',
      priority: 'normal',
      totalAmount: 992.5,
      orderDate: '2024-12-14T09:15:00Z',
      requiredDate: '2024-12-17T12:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Orden de reposición mensual',
      fulfillmentStatus: 'in_progress',
      paymentStatus: 'approved',
      shippingAddress: 'Calle 23, Edificio Hospitalario, Maracaibo 4001'
    },
    {
      id: 'PO-2024-003',
      customer: {
        name: 'Centro Médico Norte',
        contact: 'Dr. Carlos López',
        phone: '+58 212-555-0789',
        email: 'pedidos@centromediconorte.com'
      },
      products: [
        { sku: 'LAB-CRP', name: 'Proteína C Reactiva', quantity: 5, unitPrice: 110 },
        { sku: 'LAB-GLU', name: 'Glucosa', quantity: 10, unitPrice: 65 }
      ],
      status: 'shipped',
      priority: 'normal',
      totalAmount: 1200.0,
      orderDate: '2024-12-13T14:20:00Z',
      requiredDate: '2024-12-15T10:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Reactivos para laboratorio mensual',
      fulfillmentStatus: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: 'Av. Libertador, Centro Comercial Norte, Valencia 2001',
      trackingNumber: 'HLT-TRK123456',
      shippedAt: '2024-12-14T16:30:00Z',
      estimatedDelivery: '2024-12-15T12:00:00Z',
      carrier: 'Transporte Healtng'
    }
  ];

  // Add business-specific orders
  if (bType?.includes('óptica')) {
    baseOrders?.push({
      id: 'PO-2024-004',
      customer: {
        name: 'Óptica Central',
        contact: 'María Fernández',
        phone: '+58 212-555-0321',
        email: 'inventario@opticacentral.com'
      },
      products: [
        { sku: 'OPT-GLS', name: 'Lente monofocal', quantity: 20, unitPrice: 60 },
        { sku: 'OPT-CTC', name: 'Lente de contacto', quantity: 15, unitPrice: 32 }
      ],
      status: 'approved',
      priority: 'normal',
      totalAmount: 1680.0,
      orderDate: '2024-12-14T11:00:00Z',
      requiredDate: '2024-12-18T15:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Pedido especial para graduaciones específicas',
      fulfillmentStatus: 'approved',
      paymentStatus: 'approved',
      shippingAddress: 'Centro Comercial Las Mercedes, Local 45, Caracas 1060'
    });
  }

  return baseOrders;
}

export function getMockShipmentTracking(orderId) {
  // Mock tracking data for orders
  return {
    trackingNumber: `HLT-${Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase()}`,
    carrier: 'Transporte Healtng',
    status: 'in_transit',
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
    trackingEvents: [
      {
        status: 'Orden Procesada',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)?.toISOString(),
        location: 'Centro de Procesamiento',
        description: 'Orden procesada y preparada para envío'
      },
      {
        status: 'En Tránsito',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)?.toISOString(),
        location: 'Centro de Distribución',
        description: 'Paquete despachado'
      },
      {
        status: 'En Ruta',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)?.toISOString(),
        location: 'Hub de Distribución Regional',
        description: 'Paquete en ruta hacia destino final'
      }
    ]
  };
}

// Keep other placeholder functions as they were for functions not yet implemented
function getAnalytics(...args) {
  console.warn('Placeholder: getAnalytics is not implemented yet.', args);
  return null;
}
export { getAnalytics };

function getB2BOrders(...args) {
  console.warn('Placeholder: getB2BOrders is not implemented yet.', args);
  return null;
}
export { getB2BOrders };

function getAppointments(...args) {
  console.warn('Placeholder: getAppointments is not implemented yet.', args);
  return null;
}
export { getAppointments };

function setAppointments(...args) {
  console.warn('Placeholder: setAppointments is not implemented yet.', args);
  return null;
}
export { setAppointments };

function getAuthorizations(...args) {
  console.warn('Placeholder: getAuthorizations is not implemented yet.', args);
  return null;
}
export { getAuthorizations };

function setAuthorizations(...args) {
  console.warn('Placeholder: setAuthorizations is not implemented yet.', args);
  return null;
}
export { setAuthorizations };

function setB2BOrders(...args) {
  console.warn('Placeholder: setB2BOrders is not implemented yet.', args);
  return null;
}
export { setB2BOrders };

function getClaims(...args) {
  console.warn('Placeholder: getClaims is not implemented yet.', args);
  return null;
}
export { getClaims };

function setClaims(...args) {
  console.warn('Placeholder: setClaims is not implemented yet.', args);
  return null;
}
export { setClaims };

function getLabOrders(...args) {
  console.warn('Placeholder: getLabOrders is not implemented yet.', args);
  return null;
}
export { getLabOrders };

function setLabOrders(...args) {
  console.warn('Placeholder: setLabOrders is not implemented yet.', args);
  return null;
}
export { setLabOrders };

// Global optics orders storage
let globalOpticsOrders = null;

function getOpticsOrders(...args) {
  return [
    { 
      id: "OPT-001", 
      patient: "María García", 
      item: "Lentes progresivos", 
      grad: "OD: -2.50 -0.75 x 180°, OI: -2.25 -0.50 x 175°", 
      status: "pending" 
    },
    { 
      id: "OPT-002", 
      patient: "Carlos López", 
      item: "Lentes de contacto", 
      grad: "OD: -1.75, OI: -1.50", 
      status: "pending" 
    },
    { 
      id: "OPT-003", 
      patient: "Ana Rodríguez", 
      item: "Lentes bifocales", 
      grad: "OD: +1.25 ADD +2.00, OI: +1.00 ADD +2.00", 
      status: "accepted" 
    },
    { 
      id: "OPT-004", 
      patient: "José Martínez", 
      item: "Lentes monofocales", 
      grad: "OD: -0.75, OI: -1.00", 
      status: "rejected" 
    }
  ];
}
export { getOpticsOrders };

function setOpticsOrders(orders) {
  try {
    if (Array.isArray(orders)) {
      globalOpticsOrders = [...orders];
    }
    return globalOpticsOrders;
  } catch (error) {
    console.warn('Error setting optics orders:', error);
    return globalOpticsOrders || [];
  }
}
export { setOpticsOrders };

function getRxInbox(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: getRxInbox is not implemented yet.', args);
  return null;
}

export { getRxInbox };

function setRxInbox(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: setRxInbox is not implemented yet.', args);
  return null;
}

export { setRxInbox };

// Global products storage for mock data
let globalProducts = null;

// Initialize products on first call
function initializeProducts() {
  if (!globalProducts) {
    const profile = getProviderProfile();
    globalProducts = getMockProducts(profile?.businessType || "")?.map(p => ({
      id: p?.sku,
      sku: p?.sku,
      name: p?.name,
      category: p?.family || p?.category,
      uom: p?.unit,
      price: p?.price,
      stock: p?.stock,
      retailChannels: {
        b2c: p?.b2c,
        b2b: p?.b2b
      }
    }));
  }
  return globalProducts;
}

function getProducts() {
  try {
    return initializeProducts();
  } catch (error) {
    console.warn('Error getting products:', error);
    return [];
  }
}

export { getProducts };

function upsertProduct(product) {
  try {
    if (!globalProducts) {
      initializeProducts();
    }
    
    if (!product?.id && !product?.sku) {
      console.warn('Product must have id or sku');
      return globalProducts;
    }
    
    const productId = product?.id || product?.sku;
    const existingIndex = globalProducts?.findIndex(p => p?.id === productId || p?.sku === productId);
    
    const normalizedProduct = {
      id: productId,
      sku: product?.sku || productId,
      name: product?.name || 'Unnamed Product',
      category: product?.category || 'General',
      uom: product?.uom || 'unidad',
      price: Number(product?.price) || 0,
      stock: Number(product?.stock) || 0,
      retailChannels: {
        b2c: Boolean(product?.retailChannels?.b2c),
        b2b: Boolean(product?.retailChannels?.b2b)
      }
    };
    
    if (existingIndex >= 0) {
      globalProducts[existingIndex] = { ...globalProducts?.[existingIndex], ...normalizedProduct };
    } else {
      globalProducts?.push(normalizedProduct);
    }
    
    return [...globalProducts];
  } catch (error) {
    console.warn('Error upserting product:', error);
    return globalProducts || [];
  }
}

export { upsertProduct };

function togglePublishChannel(productId, channel) {
  try {
    if (!globalProducts) {
      initializeProducts();
    }
    
    const product = globalProducts?.find(p => p?.id === productId || p?.sku === productId);
    if (product && product?.retailChannels && (channel === 'b2c' || channel === 'b2b')) {
      product.retailChannels[channel] = !product?.retailChannels?.[channel];
    }
    
    return [...globalProducts];
  } catch (error) {
    console.warn('Error toggling publish channel:', error);
    return globalProducts || [];
  }
}

export { togglePublishChannel };

export function getAllMocksForCurrentBusiness() {
  const context = getBusinessContext();
  const bType = context?.businessType;
  
  return {
    context,
    products: getMockCatalog(bType),
    orders: getMockOrders(bType),
    kpis: getMockKPIs(bType),
    appointments: getMockAppointments(bType),
    analytics: getMockAnalytics(bType),
    authorizations: getMockAuthorizations(bType),
    claims: getMockClaims(bType),
    supply: getMockSupply(bType),
    customers: getMockCustomers(bType),
    rx: getMockRxIntake()
  };
}