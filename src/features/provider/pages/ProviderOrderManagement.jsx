import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";

/**
 * ProviderOrderManagement
 * - Modo DEMO (seed + reset) para que nunca salga vacío en presentación.
 * - Tasa VES/USD editable (afecta conversión y AR).
 * - Al marcar una orden como ENTREGADA (producto) o COMPLETADA (servicio),
 *   se crea automáticamente un registro de cobranza (AR) en ProviderBillingManagement (localStorage).
 */

// ==========================
// Storage keys (compartidos con Billing)
// ==========================
const STORAGE_ORDERS = "healtng_provider_orders_v1";
const STORAGE_FX = "healtng_provider_fx_rate_v1"; // VES por 1 USD
const STORAGE_SALES = "healtng_provider_sales_v1"; // Billing AR

const DEFAULT_FX_RATE = 36.5;

// ==========================
// Helpers
// ==========================
const safeDate = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : x;
};

const isoAtNoon = (yyyyMmDd) => {
  // Evita problemas de TZ al guardar fechas
  const d = safeDate(`${yyyyMmDd}T12:00:00`);
  return d ? d.toISOString() : new Date().toISOString();
};

const formatDateVE = (dateLike) => {
  const d = safeDate(dateLike);
  if (!d) return "-";
  return d.toLocaleDateString("es-VE", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const normalizePhone = (s) => String(s || "").replace(/[^\d]/g, "");

const formatMoneyVES = (n) => `Bs. ${(Number(n) || 0).toLocaleString("es-VE")}`;

const formatMoneyUSD = (n) => {
  const v = Number(n) || 0;
  return `$${v.toFixed(2)}`;
};

const toCSV = (rows) => {
  const escape = (v) => {
    const s = String(v ?? "");
    const needsQuotes = /[",\n]/.test(s);
    const clean = s.replace(/"/g, '""');
    return needsQuotes ? `"${clean}"` : clean;
  };

  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r?.[h])).join(",")),
  ];
  return lines.join("\n");
};

const downloadTextFile = (filename, content, mime = "text/csv;charset=utf-8;") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ==========================
// Config UI
// ==========================
const TAB_OPTIONS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "in_progress", label: "En Proceso" },
  { key: "shipped", label: "Enviadas" },
  { key: "delivered", label: "Entregadas" },
  { key: "completed", label: "Completadas" },
  { key: "products", label: "Productos" },
  { key: "services", label: "Servicios" },
];

const STATUS_CONFIG = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800", icon: "Clock" },
  in_progress: { label: "En Proceso", class: "bg-blue-100 text-blue-800", icon: "RefreshCw" },
  shipped: { label: "Enviada", class: "bg-purple-100 text-purple-800", icon: "Truck" },
  delivered: { label: "Entregada", class: "bg-green-100 text-green-800", icon: "CheckCircle" },
  completed: { label: "Completada", class: "bg-green-100 text-green-800", icon: "CheckCircle" },
  cancelled: { label: "Cancelada", class: "bg-red-100 text-red-800", icon: "XCircle" },
};

const PRIORITY_CONFIG = {
  low: { label: "Baja", class: "bg-gray-100 text-gray-800" },
  medium: { label: "Media", class: "bg-blue-100 text-blue-800" },
  high: { label: "Alta", class: "bg-red-100 text-red-800" },
};

const ORDER_TYPE_OPTIONS = [
  { label: "Producto", value: "product" },
  { label: "Servicio", value: "service" },
];

// “Cliente” en órdenes puede ser clínica/farmacia/paciente. Para AR conviene mapear a tipos del billing.
const CUSTOMER_TYPE_OPTIONS = [
  { label: "Clínica", value: "clinic" },
  { label: "Farmacia", value: "pharmacy" },
  { label: "Paciente", value: "patient" },
  { label: "Médico", value: "doctor" },
  { label: "Distribuidor", value: "distributor" },
  { label: "Otro", value: "other" },
];

const SEND_CHANNEL_OPTIONS = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
];

const PAYMENT_TERMS_DAYS = 30;

// ==========================
// Seed DEMO (controlado)
// ==========================
const seedOrders = () => {
  // Totales en VES (como en tu screenshot).
  return [
    {
      id: "ORD-001",
      type: "product",
      orderTypeLabel: "Pedido de Productos",
      customerName: "Clínica San Rafael",
      customerType: "clinic",
      customerId: "CLI-001",
      customerEmail: "cobranzas@clinicasanrafael.com",
      customerPhone: "584141234567",
      dateISO: "2026-01-10T12:00:00.000Z",
      status: "pending",
      priority: "high",
      totalVES: 125000,
      items: [
        { name: "Paracetamol 500mg", quantity: 100, priceVES: 2500 },
        { name: "Ibuprofeno 400mg", quantity: 50, priceVES: 3000 },
      ],
      shippingAddress: "Av. Principal, Caracas",
      trackingNumber: null,
      notes: "Entrega urgente solicitada",
      fulfillment: { processedAt: null, shippedAt: null, deliveredAt: null, completedAt: null },
      arCreated: false,
    },
    {
      id: "ORD-002",
      type: "service",
      orderTypeLabel: "Orden de Servicio",
      customerName: "María González",
      customerType: "patient",
      customerId: "PAT-002",
      customerEmail: "maria.gonzalez@gmail.com",
      customerPhone: "584121112233",
      dateISO: "2026-01-10T12:00:00.000Z",
      status: "in_progress",
      priority: "medium",
      totalVES: 45000,
      items: [
        { name: "Examen de Laboratorio - Hemograma", quantity: 1, priceVES: 35000 },
        { name: "Consulta Especializada", quantity: 1, priceVES: 10000 },
      ],
      serviceDateISO: "2026-01-11T12:00:00.000Z",
      notes: "Orden médica adjunta",
      resultsUploaded: false,
      fulfillment: { processedAt: "2026-01-10T12:00:00.000Z", shippedAt: null, deliveredAt: null, completedAt: null },
      arCreated: false,
    },
    {
      id: "ORD-003",
      type: "product",
      orderTypeLabel: "Pedido de Productos",
      customerName: "Farmacia Central",
      customerType: "pharmacy",
      customerId: "FAR-003",
      customerEmail: "pagos@farmaciacentral.com",
      customerPhone: "584141010101",
      dateISO: "2026-01-09T12:00:00.000Z",
      status: "shipped",
      priority: "low",
      totalVES: 85000,
      items: [{ name: "Insulina Regular", quantity: 10, priceVES: 8500 }],
      shippingAddress: "Centro Comercial, Valencia",
      trackingNumber: "TRK-789456",
      notes: "",
      fulfillment: { processedAt: "2026-01-09T12:00:00.000Z", shippedAt: "2026-01-10T12:00:00.000Z", deliveredAt: null, completedAt: null },
      arCreated: false,
    },
    {
      id: "ORD-004",
      type: "service",
      orderTypeLabel: "Orden de Servicio",
      customerName: "Carlos Rodríguez",
      customerType: "patient",
      customerId: "PAT-004",
      customerEmail: "",
      customerPhone: "584121998877",
      dateISO: "2026-01-09T12:00:00.000Z",
      status: "completed",
      priority: "medium",
      totalVES: 30000,
      items: [{ name: "Examen Visual Completo", quantity: 1, priceVES: 30000 }],
      serviceDateISO: "2026-01-09T12:00:00.000Z",
      notes: "Resultados cargados",
      resultsUploaded: true,
      fulfillment: { processedAt: "2026-01-09T12:00:00.000Z", shippedAt: null, deliveredAt: null, completedAt: "2026-01-09T12:00:00.000Z" },
      arCreated: true, // simula que ya generó cobranza
    },
    {
      id: "ORD-005",
      type: "product",
      orderTypeLabel: "Pedido de Productos",
      customerName: "Hospital General",
      customerType: "clinic",
      customerId: "HOS-005",
      customerEmail: "compras@hospitalgeneral.com",
      customerPhone: "",
      dateISO: "2026-01-08T12:00:00.000Z",
      status: "cancelled",
      priority: "high",
      totalVES: 200000,
      items: [{ name: "Equipos de Protección", quantity: 500, priceVES: 400 }],
      shippingAddress: "Maracay",
      trackingNumber: null,
      notes: "Cancelada por solicitud del cliente",
      cancelReason: "Solicitud del cliente",
      fulfillment: { processedAt: null, shippedAt: null, deliveredAt: null, completedAt: null },
      arCreated: false,
    },
  ];
};

// ==========================
// AR (Billing) helpers (minimal)
// ==========================
const calculateEstimatedTaxesUSD = (amountUSD) => {
  const rate = 0.16; // placeholder IVA referencia
  const iva = Math.round((Number(amountUSD) || 0) * rate * 100) / 100;
  const total = Math.round((Number(amountUSD) || 0) * (1 + rate) * 100) / 100;
  return { rate, iva, total };
};

const calculatePlatformFeeUSD = (amountUSD) => {
  const rate = 0.03; // placeholder fee plataforma
  const fee = Math.round((Number(amountUSD) || 0) * rate * 100) / 100;
  return { rate, amount: fee };
};

const mapCustomerTypeToBilling = (t) => {
  // Billing soporta: clinic, pharmacy, doctor, distributor, other
  if (t === "clinic") return "clinic";
  if (t === "pharmacy") return "pharmacy";
  if (t === "doctor") return "doctor";
  if (t === "distributor") return "distributor";
  // paciente no existe como tipo en billing actual: lo bajamos a "other" (o “clinic” si es B2B).
  if (t === "patient") return "other";
  return "other";
};

// ==========================
// Component
// ==========================
const ProviderOrderManagement = () => {
  const [fxRate, setFxRate] = useState(() => {
    const saved = Number(localStorage.getItem(STORAGE_FX));
    return !Number.isNaN(saved) && saved > 0 ? saved : DEFAULT_FX_RATE;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_ORDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Contact modal (para demo realista)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [sendChannel, setSendChannel] = useState("whatsapp");
  const [sendTo, setSendTo] = useState("");
  const [sendMessage, setSendMessage] = useState("");

  // Create order modal (simple)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderType, setNewOrderType] = useState("product");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerType, setNewCustomerType] = useState("clinic");
  const [newTotalVES, setNewTotalVES] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const isDemoMode = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get("demo");
    return v === "1" || v === "true";
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders || []));
  }, [orders]);

  useEffect(() => {
    if (fxRate > 0) localStorage.setItem(STORAGE_FX, String(fxRate));
  }, [fxRate]);

  // Auto-seed si demo=1 y está vacío
  useEffect(() => {
    if (!isDemoMode) return;
    if ((orders || []).length > 0) return;
    const seeded = seedOrders();
    setOrders(seeded);
  }, [isDemoMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==========================
  // UI helpers
  // ==========================
  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG?.[status] || STATUS_CONFIG.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${cfg.class}`}>
        <Icon name={cfg.icon} size={14} />
        {cfg.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const cfg = PRIORITY_CONFIG?.[priority] || PRIORITY_CONFIG.medium;
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${cfg.class}`}>{cfg.label}</span>;
  };

  const getOrderIcon = (order) => {
    if (order?.type === "product") return "Package";
    if (order?.type === "service") return "Activity";
    return "FileText";
  };

  const orderUSD = (order) => {
    const ves = Number(order?.totalVES) || 0;
    if (!fxRate || fxRate <= 0) return 0;
    return ves / fxRate;
  };

  const tabCounts = useMemo(() => {
    const all = orders || [];
    const byStatus = (s) => all.filter((o) => o?.status === s).length;
    const products = all.filter((o) => o?.type === "product").length;
    const services = all.filter((o) => o?.type === "service").length;

    return {
      all: all.length,
      pending: byStatus("pending"),
      in_progress: byStatus("in_progress"),
      shipped: byStatus("shipped"),
      delivered: byStatus("delivered"),
      completed: byStatus("completed"),
      products,
      services,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = (searchTerm || "").toLowerCase().trim();
    return (orders || []).filter((o) => {
      const matchesSearch =
        !q ||
        String(o?.id || "").toLowerCase().includes(q) ||
        String(o?.customerName || "").toLowerCase().includes(q) ||
        String(o?.orderTypeLabel || "").toLowerCase().includes(q) ||
        String(o?.trackingNumber || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === "all") return true;
      if (activeTab === "products") return o?.type === "product";
      if (activeTab === "services") return o?.type === "service";
      return o?.status === activeTab;
    });
  }, [orders, activeTab, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const all = orders || [];
    const total = all.length;
    const pending = all.filter((o) => o?.status === "pending").length;
    const inProgress = all.filter((o) => o?.status === "in_progress").length;
    const finalized = all.filter((o) => o?.status === "completed" || o?.status === "delivered").length;
    const totalVES = all.reduce((sum, o) => sum + (Number(o?.totalVES) || 0), 0);
    const totalUSD = fxRate > 0 ? totalVES / fxRate : 0;

    return { total, pending, inProgress, finalized, totalVES, totalUSD };
  }, [orders, fxRate]);

  // ==========================
  // AR creation (connect orders -> billing)
  // ==========================
  const createARFromOrderIfNeeded = (order) => {
    if (!order) return;
    if (order?.arCreated) return;

    const shouldCreate =
      (order.type === "product" && order.status === "delivered") ||
      (order.type === "service" && order.status === "completed");

    if (!shouldCreate) return;

    const totalUSD = orderUSD(order);
    if (!(totalUSD > 0)) return;

    const now = new Date();
    const issueDate = now.toISOString();
    const dueDate = new Date(now.getTime() + PAYMENT_TERMS_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const estimatedTaxes = calculateEstimatedTaxesUSD(totalUSD);
    const platformFee = calculatePlatformFeeUSD(totalUSD);

    const recordNumber = `RV-${order.id}`;
    const arId = recordNumber;

    let existing = [];
    try {
      const saved = localStorage.getItem(STORAGE_SALES);
      existing = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const alreadyExists = existing.some((r) => r?.id === arId);
    if (alreadyExists) {
      // marca order como arCreated para que no lo intente cada vez
      setOrders((prev) =>
        (prev || []).map((o) => (o?.id === order.id ? { ...o, arCreated: true } : o))
      );
      return;
    }

    const billingCustomerType = mapCustomerTypeToBilling(order.customerType);

    const arRow = {
      id: arId,
      recordNumber,
      // cliente
      customerName: order.customerName || "Cliente",
      customerType: billingCustomerType,
      customerEmail: String(order.customerEmail || "").trim(),
      customerPhone: String(order.customerPhone || "").trim(),
      // montos
      amountUSD: Math.round(totalUSD * 100) / 100,
      amountVES: Math.round((Number(order.totalVES) || 0)),
      // fechas
      issueDate,
      dueDate,
      // estado cobranza
      paymentStatus: "pending",
      lastPaymentDate: null,
      // meta
      notes: `Generado automáticamente desde ${order.type === "product" ? "pedido" : "orden de servicio"} ${order.id}`,
      estimatedTaxes,
      platformFee,
      sentAt: null,
      reminderCount: 0,
      lastReminderAt: null,
      // vínculo
      sourceType: "order",
      sourceId: order.id,
    };

    localStorage.setItem(STORAGE_SALES, JSON.stringify([arRow, ...existing]));

    setOrders((prev) =>
      (prev || []).map((o) => (o?.id === order.id ? { ...o, arCreated: true } : o))
    );
  };

  // ==========================
  // Order status transitions
  // ==========================
  const nextStatusForOrder = (order) => {
    if (!order) return order?.status;
    if (order.status === "cancelled") return "cancelled";

    if (order.type === "product") {
      const flow = ["pending", "in_progress", "shipped", "delivered"];
      const idx = flow.indexOf(order.status);
      if (idx === -1) return "pending";
      return flow[Math.min(idx + 1, flow.length - 1)];
    }

    if (order.type === "service") {
      const flow = ["pending", "in_progress", "completed"];
      const idx = flow.indexOf(order.status);
      if (idx === -1) return "pending";
      return flow[Math.min(idx + 1, flow.length - 1)];
    }

    return order.status;
  };

  const processOrder = (orderId) => {
    const target = (orders || []).find((o) => o?.id === orderId);
    if (!target) return;

    const next = nextStatusForOrder(target);
    if (next === target.status) return;

    const nowIso = new Date().toISOString();
    const updated = {
      ...target,
      status: next,
      fulfillment: {
        ...(target.fulfillment || { processedAt: null, shippedAt: null, deliveredAt: null, completedAt: null }),
        processedAt: target.fulfillment?.processedAt || nowIso,
        shippedAt: next === "shipped" ? nowIso : target.fulfillment?.shippedAt || null,
        deliveredAt: next === "delivered" ? nowIso : target.fulfillment?.deliveredAt || null,
        completedAt: next === "completed" ? nowIso : target.fulfillment?.completedAt || null,
      },
    };

    setOrders((prev) => (prev || []).map((o) => (o?.id === orderId ? updated : o)));

    // Si llega a estado final, genera AR
    // (OJO: usamos "updated" para no depender del setState async)
    if (next === "delivered" || next === "completed") {
      // crea AR con base en "updated"
      createARFromOrderIfNeeded(updated);
    }
  };

  // ==========================
  // Contact flow (demo realista)
  // ==========================
  const buildDefaultContactMessage = (order) => {
    const totalV = formatMoneyVES(order?.totalVES || 0);
    const totalU = formatMoneyUSD(orderUSD(order));
    const statusLabel = STATUS_CONFIG?.[order?.status]?.label || "Pendiente";
    return `Hola ${order?.customerName || "cliente"}. Actualización de ${order?.id}: estado "${statusLabel}". Total: ${totalV} (~${totalU}).`;
  };

  const openWhatsApp = (phone, text) => {
    const p = normalizePhone(phone);
    if (!p) return;
    const url = `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const openEmail = (email, subject, body) => {
    const e = String(email || "").trim();
    if (!e) return;
    const url = `mailto:${encodeURIComponent(e)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const openContactModal = (order) => {
    setSelectedOrder(order);
    setSendChannel("whatsapp");
    setSendTo(order?.customerPhone || order?.customerEmail || "");
    setSendMessage(buildDefaultContactMessage(order));
    setIsContactModalOpen(true);
  };

  const confirmContact = () => {
    if (!selectedOrder) return;

    const subject = `Actualización de orden ${selectedOrder.id}`;
    const msg = String(sendMessage || "").trim();
    const to = String(sendTo || "").trim();

    if (!msg) {
      alert("Escribe un mensaje.");
      return;
    }

    if (sendChannel === "whatsapp") {
      const phone = to || selectedOrder.customerPhone;
      if (!normalizePhone(phone)) {
        alert("Falta teléfono para WhatsApp.");
        return;
      }
      openWhatsApp(phone, msg);
    } else {
      const email = to || selectedOrder.customerEmail;
      if (!String(email || "").trim()) {
        alert("Falta email para enviar correo.");
        return;
      }
      openEmail(email, subject, msg);
    }

    setIsContactModalOpen(false);
  };

  // ==========================
  // Demo controls
  // ==========================
  const loadDemo = () => {
    const seeded = seedOrders();
    setOrders(seeded);
  };

  const resetOrders = () => {
    localStorage.removeItem(STORAGE_ORDERS);
    setOrders([]);
  };

  // ==========================
  // Create order (simple)
  // ==========================
  const createNewOrder = () => {
    const name = String(newCustomerName || "").trim();
    const totalStr = String(newTotalVES || "").replace(/,/g, ".");
    const total = Number(totalStr);

    if (!name) {
      alert("Ingresa el nombre del cliente.");
      return;
    }
    if (Number.isNaN(total) || total <= 0) {
      alert("Ingresa un total VES válido.");
      return;
    }

    const id = `ORD-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const nowIso = new Date().toISOString();

    const row = {
      id,
      type: newOrderType,
      orderTypeLabel: newOrderType === "product" ? "Pedido de Productos" : "Orden de Servicio",
      customerName: name,
      customerType: newCustomerType,
      customerId: "N/A",
      customerEmail: "",
      customerPhone: "",
      dateISO: nowIso,
      status: "pending",
      priority: "medium",
      totalVES: Math.round(total),
      items: [],
      shippingAddress: "",
      trackingNumber: null,
      notes: String(newNotes || "").trim(),
      fulfillment: { processedAt: null, shippedAt: null, deliveredAt: null, completedAt: null },
      arCreated: false,
    };

    setOrders((prev) => [row, ...(prev || [])]);

    setIsNewOrderModalOpen(false);
    setNewOrderType("product");
    setNewCustomerName("");
    setNewCustomerType("clinic");
    setNewTotalVES("");
    setNewNotes("");
  };

  // ==========================
  // Export
  // ==========================
  const exportOrders = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const rows = (filteredOrders || []).map((o) => ({
      id: o.id,
      type: o.type,
      customerName: o.customerName,
      customerType: o.customerType,
      status: o.status,
      priority: o.priority,
      date: formatDateVE(o.dateISO),
      totalVES: Number(o.totalVES || 0),
      approxUSD: fxRate > 0 ? Math.round((Number(o.totalVES || 0) / fxRate) * 100) / 100 : 0,
      trackingNumber: o.trackingNumber || "",
      arCreated: o.arCreated ? "yes" : "no",
    }));
    downloadTextFile(`provider-orders-${stamp}.csv`, toCSV(rows));
  };

  // ==========================
  // UI pieces
  // ==========================
  const OrderCard = ({ order }) => {
    const statusCfg = STATUS_CONFIG?.[order?.status] || STATUS_CONFIG.pending;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Icon name={getOrderIcon(order)} size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{order?.id}</h3>
              <p className="text-sm text-gray-600">{order?.orderTypeLabel}</p>
              <p className="text-sm text-gray-600">{order?.customerName}</p>

              {order?.arCreated && (
                <div className="mt-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 inline-flex items-center gap-1">
                  <Icon name="Receipt" size={14} />
                  Cobranza creada (AR)
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusCfg.class}`}>
              <Icon name={statusCfg.icon} size={14} />
              {statusCfg.label}
            </span>
            {getPriorityBadge(order?.priority)}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha:</span>
            <span className="text-gray-900">{formatDateVE(order?.dateISO)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total:</span>
            <div className="text-right">
              <div className="text-gray-900 font-medium">{formatMoneyVES(order?.totalVES)}</div>
              <div className="text-xs text-gray-600">~ {formatMoneyUSD(orderUSD(order))}</div>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ítems:</span>
            <span className="text-gray-900">{order?.items?.length || 0}</span>
          </div>

          {order?.trackingNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tracking:</span>
              <span className="text-gray-900 font-mono">{order?.trackingNumber}</span>
            </div>
          )}
        </div>

        {order?.notes ? (
          <p className="text-sm text-gray-700 mb-4 p-2 bg-gray-50 border border-gray-200 rounded">
            {order?.notes}
          </p>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedOrder(order);
              setIsDetailsModalOpen(true);
            }}
          >
            <Icon name="Eye" size={14} className="mr-2" />
            Ver Detalles
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => processOrder(order?.id)}
            disabled={order?.status === "cancelled" || order?.status === "delivered" || order?.status === "completed"}
            title={
              order?.status === "delivered" || order?.status === "completed"
                ? "Ya finalizada"
                : "Avanzar al siguiente estado"
            }
          >
            <Icon name="Edit2" size={14} className="mr-2" />
            Procesar
          </Button>

          <Button variant="outline" size="sm" onClick={() => openContactModal(order)} title="Contactar cliente">
            <Icon name="MessageSquare" size={14} />
          </Button>
        </div>
      </div>
    );
  };

  const handleSelectChange = (setter) => (e) => {
    const val = e?.target ? e.target.value : e;
    setter(val);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos y Órdenes</h1>
          <p className="text-gray-600 text-sm mt-1">
            Fulfillment + creación automática de registros de cobranza (AR) al completar/entregar.
          </p>
          {isDemoMode && (
            <div className="mt-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1 inline-flex items-center gap-1">
              <Icon name="Beaker" size={14} />
              Modo demo activo (seed automático si está vacío)
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* FX */}
          <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <div className="text-[11px] text-gray-700">Tasa VES/USD</div>
            <input
              value={fxRate}
              onChange={(e) => setFxRate(Number(e.target.value) || 0)}
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-28 rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              aria-label="Tasa VES por USD"
            />
          </div>

          <Button onClick={exportOrders} variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar
          </Button>

          <Button
            variant="outline"
            onClick={loadDemo}
            className="border-gray-300"
            title="Cargar datos demo controlados"
          >
            <Icon name="Database" size={16} className="mr-2" />
            Cargar Demo
          </Button>

          <Button
            variant="outline"
            onClick={resetOrders}
            className="text-red-600 border-red-200 hover:bg-red-50"
            title="Borrar órdenes locales (demo)"
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Reset Órdenes
          </Button>

          <Button onClick={() => setIsNewOrderModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Icon name="Plus" size={16} className="mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TAB_OPTIONS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
              activeTab === t.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label} ({tabCounts?.[t.key] ?? 0})
          </button>
        ))}
      </div>

      {/* Search + quick filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Buscar</label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              placeholder="ORD-001 / cliente / tracking..."
              className="w-full"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}
            className="border-gray-300"
            title="Limpiar filtros"
          >
            <Icon name="Trash2" size={16} className="mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Icon name="ShoppingCart" size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Icon name="Clock" size={24} className="text-yellow-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Icon name="RefreshCw" size={24} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Finalizadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.finalized}</p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-lg font-bold text-gray-900">{formatMoneyVES(stats.totalVES)}</p>
              <p className="text-xs text-gray-600">~ {formatMoneyUSD(stats.totalUSD)}</p>
            </div>
            <Icon name="DollarSign" size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order?.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 text-center">
          <Icon name="ShoppingCart" size={52} className="text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">No se encontraron órdenes</p>
          <p className="text-gray-600 text-sm mt-1">Cambia filtros o carga el demo para presentar.</p>
        </div>
      )}

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedOrder?.id}</h2>
                <p className="text-gray-600">{selectedOrder?.orderTypeLabel}</p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <div className="text-sm text-gray-500">Cliente</div>
                <div className="text-gray-900 font-medium">{selectedOrder?.customerName}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Tipo: <b>{selectedOrder?.customerType}</b>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Estado</div>
                <div className="mt-1">{getStatusBadge(selectedOrder?.status)}</div>
                <div className="mt-2">{getPriorityBadge(selectedOrder?.priority)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Fecha</div>
                <div className="text-gray-900">{formatDateVE(selectedOrder?.dateISO)}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-gray-900 font-semibold">{formatMoneyVES(selectedOrder?.totalVES)}</div>
                <div className="text-xs text-gray-600">~ {formatMoneyUSD(orderUSD(selectedOrder))}</div>
              </div>
            </div>

            {selectedOrder?.trackingNumber ? (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500">Tracking</div>
                <div className="font-mono text-gray-900">{selectedOrder?.trackingNumber}</div>
              </div>
            ) : null}

            {selectedOrder?.shippingAddress ? (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500">Dirección / Entrega</div>
                <div className="text-gray-900">{selectedOrder?.shippingAddress}</div>
              </div>
            ) : null}

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Ítems</div>
              <div className="space-y-2">
                {(selectedOrder?.items || []).length === 0 ? (
                  <div className="text-sm text-gray-500">Sin ítems (demo/placeholder).</div>
                ) : (
                  selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                      <div>
                        <div className="text-gray-900">{it?.name}</div>
                        <div className="text-xs text-gray-600">Cantidad: {it?.quantity}</div>
                      </div>
                      <div className="text-gray-900 font-medium">
                        {formatMoneyVES((Number(it?.priceVES) || 0) * (Number(it?.quantity) || 0))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedOrder?.notes ? (
              <div className="mb-5 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xs text-gray-500">Notas</div>
                <div className="text-gray-900">{selectedOrder?.notes}</div>
              </div>
            ) : null}

            <div className="flex flex-col md:flex-row gap-2 pt-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={() => processOrder(selectedOrder?.id)}
                disabled={
                  selectedOrder?.status === "cancelled" ||
                  selectedOrder?.status === "delivered" ||
                  selectedOrder?.status === "completed"
                }
              >
                <Icon name="Edit2" size={16} className="mr-2" />
                Procesar (avanzar estado)
              </Button>

              <Button variant="outline" className="flex-1" onClick={() => openContactModal(selectedOrder)}>
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Contactar Cliente
              </Button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Nota demo: al llegar a <b>Entregada</b> (producto) o <b>Completada</b> (servicio), se crea AR en “Finanzas y Cobranza”.
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal (con textarea corregida para mensaje) */}
      {isContactModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xl mx-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contactar cliente</h3>
                <div className="text-sm text-gray-600 mt-1">
                  Orden: <b>{selectedOrder?.id}</b> · Cliente: <b>{selectedOrder?.customerName}</b>
                </div>
              </div>
              <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-gray-700" aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs text-gray-500">Canal</label>
                <Select value={sendChannel} onChange={handleSelectChange(setSendChannel)} options={SEND_CHANNEL_OPTIONS} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Destino ({sendChannel === "whatsapp" ? "Teléfono" : "Email"})</label>
                <Input
                  value={sendTo}
                  onChange={(e) => setSendTo(e?.target?.value)}
                  placeholder={sendChannel === "whatsapp" ? "58412..." : "correo@cliente.com"}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-500">Mensaje</label>
              <textarea
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                rows={5}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Escribe el mensaje…"
              />
              <div className="mt-2 text-xs text-gray-500">
                Tip demo: usa este modal para “hacer real” la operación (WhatsApp / correo con texto precargado).
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmContact} className="bg-blue-600 hover:bg-blue-700 text-white">
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal (simple) */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Orden (manual)</h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-gray-400 hover:text-gray-700" aria-label="Cerrar">
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-2">Modo demo: crea una orden simple para simular el flujo.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs text-gray-500">Tipo</label>
                <Select value={newOrderType} onChange={handleSelectChange(setNewOrderType)} options={ORDER_TYPE_OPTIONS} />
              </div>

              <div>
                <label className="text-xs text-gray-500">Tipo de cliente</label>
                <Select value={newCustomerType} onChange={handleSelectChange(setNewCustomerType)} options={CUSTOMER_TYPE_OPTIONS} />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Cliente</label>
                <Input value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} placeholder="Ej: Clínica X" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Total (VES)</label>
                <Input value={newTotalVES} onChange={(e) => setNewTotalVES(e.target.value)} placeholder="0" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-500">Notas</label>
                <Input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Referencia / instrucción…" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" onClick={() => setIsNewOrderModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createNewOrder} className="bg-blue-600 hover:bg-blue-700 text-white">
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderOrderManagement;
