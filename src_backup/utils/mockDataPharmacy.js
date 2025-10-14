// src/utils/mockDataPharmacy.js
// ✅ Mocks realistas para una cadena de farmacias (multi-sucursal)
// No importes providerProfile aquí para evitar ciclos. Usamos localStorage directo.

const LS_KEYS = {
  profile: "providerProfile",
  products: "pharmacy.products",
  orders: "pharmacy.orders",
  shipments: "pharmacy.shipments",
  rxInbox: "pharmacy.rxInbox",
  suppliers: "pharmacy.suppliers",
};

const STORES = [
  { id: "SCL-001", name: "Sucursal Centro" },
  { id: "SCL-002", name: "Sucursal Norte" },
];

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Inicializa demo de farmacia si no existe */
export function seedPharmacyDemo() {
  // 1) Perfil de proveedor (tipo producto)
  const existingProfile = load(LS_KEYS.profile, null);
  if (!existingProfile || existingProfile.businessType !== "producto") {
    const profile = {
      businessName: "Mi Negocio",
      businessType: "producto",
      operationCategory: "Venta de medicamentos",
      createdAt: new Date().toISOString(),
      businessModules: {
        inventario: true,
        agenda: false,
        pedidos: true,
        despacho: true,
        facturacion: true,
        marketplace: true,
        rxIntake: true,
        authorizations: true,
        analytics: true,
      },
    };
    save(LS_KEYS.profile, profile);
    localStorage.setItem("userRole", "provider");
  }

  // 2) Productos (con lotes y vencimientos)
  if (!load(LS_KEYS.products)) {
    const products = [
      {
        id: "P-0001",
        sku: "RX-OMEP-20-CAPS-30",
        name: "Omeprazol 20 mg",
        form: "cápsulas",
        strength: "20 mg",
        brand: "Genfar",
        generic: "omeprazol",
        category: "Rx",
        requiresPrescription: true,
        coldChain: false,
        controlled: false,
        uom: "caja x 30",
        taxRate: 0.0,
        price: { retail: 7.5, wholesale: 6.3 },
        stockByStore: [
          { storeId: "SCL-001", onHand: 120, reserved: 6, reorderPoint: 80 },
          { storeId: "SCL-002", onHand: 60, reserved: 8, reorderPoint: 70 },
        ],
        batches: [
          { lot: "A23-OM20-01", expiry: "2025-11-15", qty: 100 },
          { lot: "A24-OM20-02", expiry: "2026-04-30", qty: 80 },
        ],
        barcodes: ["7701234567890"],
      },
      {
        id: "P-0002",
        sku: "OTC-PARAC-500-TABS-100",
        name: "Paracetamol 500 mg",
        form: "tabletas",
        strength: "500 mg",
        brand: "MK",
        generic: "acetaminofén",
        category: "OTC",
        requiresPrescription: false,
        coldChain: false,
        controlled: false,
        uom: "frasco x 100",
        taxRate: 0.0,
        price: { retail: 5.2, wholesale: 4.0 },
        stockByStore: [
          { storeId: "SCL-001", onHand: 40, reserved: 2, reorderPoint: 60 }, // ⚠️ bajo
          { storeId: "SCL-002", onHand: 110, reserved: 10, reorderPoint: 60 },
        ],
        batches: [{ lot: "MK-PA500-01", expiry: "2026-01-31", qty: 150 }],
        barcodes: ["7700987654321"],
      },
      {
        id: "P-0003",
        sku: "COLD-INSU-10ML",
        name: "Insulina NPH 10 ml",
        form: "solución inyectable",
        strength: "100 UI/ml",
        brand: "Novo Nordisk",
        generic: "insulina NPH",
        category: "Cadena de frío",
        requiresPrescription: true,
        coldChain: true,
        controlled: false,
        uom: "frasco 10 ml",
        taxRate: 0.0,
        price: { retail: 18.9, wholesale: 16.0 },
        stockByStore: [
          { storeId: "SCL-001", onHand: 25, reserved: 1, reorderPoint: 20 },
          { storeId: "SCL-002", onHand: 8, reserved: 0, reorderPoint: 15 }, // ⚠️ bajo
        ],
        batches: [
          { lot: "NPH-2410", expiry: "2025-03-30", qty: 20 },
          { lot: "NPH-2412", expiry: "2025-07-30", qty: 13 },
        ],
        barcodes: ["7790001112223"],
      },
    ];
    save(LS_KEYS.products, products);
  }

  // 3) Proveedores
  if (!load(LS_KEYS.suppliers)) {
    save(LS_KEYS.suppliers, [
      { id: "SUP-001", name: "Mayorista SaludPlus", ruc: "J-12345678-9" },
      { id: "SUP-002", name: "Farmadistribuciones", ruc: "J-87654321-0" },
    ]);
  }

  // 4) Órdenes (ventas + compras)
  if (!load(LS_KEYS.orders)) {
    const today = new Date().toISOString().slice(0, 10);
    const orders = [
      {
        id: "SO-1001",
        type: "sale",
        channel: "POS",
        date: today,
        storeId: "SCL-001",
        status: "completed",
        items: [
          { sku: "RX-OMEP-20-CAPS-30", qty: 2, price: 7.5 },
          { sku: "OTC-PARAC-500-TABS-100", qty: 1, price: 5.2 },
        ],
        totals: { subtotal: 20.2, tax: 0, total: 20.2 },
      },
      {
        id: "SO-1002",
        type: "sale",
        channel: "Online",
        date: today,
        storeId: "SCL-002",
        status: "completed",
        items: [{ sku: "RX-OMEP-20-CAPS-30", qty: 1, price: 7.5 }],
        totals: { subtotal: 7.5, tax: 0, total: 7.5 },
      },
      {
        id: "PO-9001",
        type: "purchase",
        supplierId: "SUP-001",
        date: today,
        status: "pending",
        items: [
          { sku: "OTC-PARAC-500-TABS-100", qty: 200, cost: 3.8 },
          { sku: "COLD-INSU-10ML", qty: 30, cost: 15.0 },
        ],
        totals: { subtotal: 1140, tax: 0, total: 1140 },
      },
    ];
    save(LS_KEYS.orders, orders);
  }

  // 5) Envíos (despacho)
  if (!load(LS_KEYS.shipments)) {
    save(LS_KEYS.shipments, [
      {
        id: "SH-7001",
        orderId: "SO-1002",
        carrier: "LocalCourier",
        tracking: "LC-001-ABC",
        status: "in_transit",
        eta: new Date(Date.now() + 2 * 86400000).toISOString(),
      },
    ]);
  }

  // 6) Bandeja de recetas
  if (!load(LS_KEYS.rxInbox)) {
    save(LS_KEYS.rxInbox, [
      {
        id: "RX-001",
        rxCode: "001234",
        patient: "María García",
        medication: "Insulina NPH 10 ml",
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
        dosage: "Según esquema",
        duration: "30 días",
      },
      {
        id: "RX-002",
        rxCode: "001235",
        patient: "Carlos López",
        medication: "Omeprazol 20 mg",
        status: "accepted",
        date: new Date().toISOString().slice(0, 10),
        dosage: "1 cápsula en ayunas",
        duration: "60 días",
      },
    ]);
  }
}

/** ===== Lecturas y helpers ===== */
export function getPharmacyProducts() {
  return load(LS_KEYS.products, []);
}
export function upsertPharmacyProduct(product) {
  const arr = getPharmacyProducts();
  const i = arr.findIndex((p) => p.id === product.id || p.sku === product.sku);
  if (i >= 0) arr[i] = { ...arr[i], ...product };
  else arr.push(product);
  save(LS_KEYS.products, arr);
  return arr;
}

export function getPharmacyOrders() {
  return load(LS_KEYS.orders, []);
}
export function getPharmacyShipments() {
  return load(LS_KEYS.shipments, []);
}
export function getPharmacyRxInbox() {
  return load(LS_KEYS.rxInbox, []);
}

/** KPIs calculados desde los mocks */
export function getPharmacyAnalytics() {
  const orders = getPharmacyOrders();
  const products = getPharmacyProducts();

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = orders.filter((o) => o.type === "sale" && o.status === "completed" && o.date === today);

  const salesToday = +todaySales.reduce((acc, o) => acc + (o.totals?.total || 0), 0).toFixed(2);
  const ordersCount = todaySales.length;

  // Bajo stock: al menos una sucursal por debajo de reorden
  const lowStock = products.filter((p) =>
    (p.stockByStore || []).some((s) => s.onHand < (s.reorderPoint ?? 0))
  ).length;

  // Productos totales (distintos SKUs)
  const totalProducts = products.length;

  return {
    salesToday,
    orders: ordersCount,
    lowStock,
    totalProducts,
    topSku: products[0]?.sku || null,
    fillRate: 0.92,
  };
}
