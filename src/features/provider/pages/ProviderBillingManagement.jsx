import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";

// ==========================
// Storage
// ==========================
const STORAGE_SALES = "healtng_provider_sales_v1";
const STORAGE_PAYMENTS = "healtng_provider_payments_v1";
const STORAGE_FX = "healtng_provider_fx_rate_v1"; // VES por 1 USD

const DEFAULT_FX_RATE = 36.5;

// ==========================
// Helpers (Fechas / Dinero)
// ==========================
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const safeDate = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : x;
};

const daysBetween = (from, to) => {
  const a = safeDate(from);
  const b = safeDate(to);
  if (!a || !b) return 0;
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
};

const formatDateVE = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-VE", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const formatCurrency = (amount, currency = "USD") => {
  const n = Number(amount) || 0;
  if (currency === "VES") return `Bs. ${n.toLocaleString("es-VE")}`;
  return `$${n.toFixed(2)}`;
};

const isOverdue = (dueDate, paymentStatus) => {
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return false;
  return paymentStatus !== "paid" && d < new Date();
};

const normalizePhone = (s) => String(s || "").replace(/[^\d]/g, "");

/**
 * Parseo robusto para montos con coma/punto:
 * - "1.234,56" => 1234.56
 * - "1,234.56" => 1234.56
 * - "1234,56"  => 1234.56
 * - "1234.56"  => 1234.56
 * - "1 234,56" => 1234.56
 */
const parseAmount = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  // quitar espacios
  let s = raw.replace(/\s+/g, "");

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");

  // Caso con ambos: el último separador es decimal, el otro es miles
  if (hasComma && hasDot) {
    const lastComma = s.lastIndexOf(",");
    const lastDot = s.lastIndexOf(".");
    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";

    s = s.split(thousandSep).join("");
    s = s.replace(decimalSep, ".");
    const n = Number(s);
    return Number.isNaN(n) ? NaN : n;
  }

  // Solo coma o solo punto
  const sep = hasComma ? "," : hasDot ? "." : null;
  if (!sep) {
    const n = Number(s);
    return Number.isNaN(n) ? NaN : n;
  }

  const parts = s.split(sep);

  // Si hay múltiples separadores, asume miles y deja el último como decimal si parece decimal
  if (parts.length > 2) {
    const last = parts.pop();
    const head = parts.join("");
    const candidate = `${head}${sep}${last}`;

    // si el último bloque tiene 1-2 dígitos, trátalo como decimal
    if (/^\d{1,2}$/.test(last)) {
      const normalized = candidate.replace(sep, ".");
      const n = Number(normalized);
      return Number.isNaN(n) ? NaN : n;
    }

    // si no, todo eran miles
    const n = Number(`${head}${last}`);
    return Number.isNaN(n) ? NaN : n;
  }

  // Exactamente 2 partes: decidir si es decimal o miles
  if (parts.length === 2) {
    const [a, b] = parts;
    // si b tiene 1-2 dígitos => decimal
    if (/^\d{1,2}$/.test(b)) {
      const n = Number(`${a}.${b}`);
      return Number.isNaN(n) ? NaN : n;
    }
    // si b tiene 3 dígitos y a corto => miles
    if (/^\d{3}$/.test(b) && /^\d{1,3}$/.test(a)) {
      const n = Number(`${a}${b}`);
      return Number.isNaN(n) ? NaN : n;
    }
    // fallback: tratar como decimal
    const n = Number(`${a}.${b}`);
    return Number.isNaN(n) ? NaN : n;
  }

  // fallback
  const n = Number(s);
  return Number.isNaN(n) ? NaN : n;
};

const safeJSONParse = (str, fallback) => {
  try {
    if (!str) return fallback;
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const clampFx = (n) => {
  const x = Number(n);
  if (Number.isNaN(x) || x <= 0) return null;
  return Math.round(x * 100) / 100;
};

// ==========================
// Opciones UI
// ==========================
const STATUS_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "Parcial", value: "partial" },
  { label: "Pagado", value: "paid" },
  { label: "Vencido", value: "overdue" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Todos", value: "all" },
  { label: "Últimos 7 días", value: "week" },
  { label: "Último mes", value: "month" },
  { label: "Últimos 3 meses", value: "quarter" },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: "Transferencia", value: "transfer" },
  { label: "Efectivo", value: "cash" },
  { label: "Punto de venta", value: "pos" },
  { label: "Zelle", value: "zelle" },
  { label: "Otro", value: "other" },
];

const PAYMENT_CURRENCY_OPTIONS = [
  { label: "USD", value: "USD" },
  { label: "VES", value: "VES" },
];

const CUSTOMER_TYPE_OPTIONS = [
  { label: "Clínica", value: "clinic" },
  { label: "Farmacia", value: "pharmacy" },
  { label: "Médico", value: "doctor" },
  { label: "Distribuidor", value: "distributor" },
  { label: "Otro", value: "other" },
];

const SEND_CHANNEL_OPTIONS = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
];

// ==========================
// Lógica de negocio (simplificada)
// ==========================
const calculateEstimatedTaxes = (amountUSD) => {
  const rate = 0.16; // IVA referencia (placeholder)
  const iva = Math.round((Number(amountUSD) || 0) * rate * 100) / 100;
  const total = Math.round((Number(amountUSD) || 0) * (1 + rate) * 100) / 100;
  return { rate, iva, total };
};

const calculatePlatformFee = (amountUSD) => {
  const rate = 0.03;
  const fee = Math.round((Number(amountUSD) || 0) * rate * 100) / 100;
  return { rate, amount: fee };
};

const paymentMethodLabel = (val) =>
  PAYMENT_METHOD_OPTIONS.find((o) => o.value === val)?.label || val || "-";

// ==========================
// KPIs Cobranza
// ==========================
const calcAR = (records = []) =>
  records
    .filter((r) => r?.paymentStatus !== "paid")
    .reduce((acc, r) => acc + (Number(r?.amountUSD) || 0), 0);

const calcDSO = (records = []) => {
  const paid = records.filter((r) => r?.paymentStatus === "paid" && r?.lastPaymentDate);
  if (!paid.length) return 0;
  const totalDays = paid.reduce((acc, r) => acc + daysBetween(r?.issueDate, r?.lastPaymentDate), 0);
  return Math.round(totalDays / paid.length);
};

const calcAging = (records = []) => {
  const buckets = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
  const today = new Date();

  records
    .filter((r) => r?.paymentStatus !== "paid")
    .forEach((r) => {
      const due = safeDate(r?.dueDate);
      const amt = Number(r?.amountUSD) || 0;
      if (!due) {
        buckets["0-30"] += amt;
        return;
      }
      const daysPastDue = Math.max(0, daysBetween(due, today));
      if (daysPastDue <= 30) buckets["0-30"] += amt;
      else if (daysPastDue <= 60) buckets["31-60"] += amt;
      else if (daysPastDue <= 90) buckets["61-90"] += amt;
      else buckets["90+"] += amt;
    });

  return buckets;
};

// ==========================
// CSV Export
// ==========================
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
// Mock seed
// ==========================
const seedSales = (fxRate) => {
  const now = new Date();
  const iso = (d) => new Date(d).toISOString();
  const day = 24 * 60 * 60 * 1000;

  const rows = [
    {
      id: "RV-1001",
      recordNumber: "RV-1001",
      customerName: "Clínica San Rafael",
      customerType: "clinic",
      customerEmail: "cobranzas@clinicasanrafael.com",
      customerPhone: "584141234567",
      issueDate: iso(now.getTime() - 12 * day),
      dueDate: iso(now.getTime() + 18 * day),
      amountUSD: 450,
      paymentStatus: "pending",
      notes: "Pedido mayorista",
      estimatedTaxes: calculateEstimatedTaxes(450),
      platformFee: calculatePlatformFee(450),
      sentAt: null,
      reminderCount: 0,
      lastReminderAt: null,
      lastPaymentDate: null,
    },
    {
      id: "RV-1002",
      recordNumber: "RV-1002",
      customerName: "Farmacia Central",
      customerType: "pharmacy",
      customerEmail: "pagos@farmaciacentral.com",
      customerPhone: "584121112233",
      issueDate: iso(now.getTime() - 40 * day),
      dueDate: iso(now.getTime() - 10 * day),
      amountUSD: 220,
      paymentStatus: "partial",
      notes: "Reposición de stock",
      estimatedTaxes: calculateEstimatedTaxes(220),
      platformFee: calculatePlatformFee(220),
      sentAt: iso(now.getTime() - 39 * day),
      reminderCount: 1,
      lastReminderAt: iso(now.getTime() - 12 * day),
      lastPaymentDate: iso(now.getTime() - 20 * day),
    },
    {
      id: "RV-1003",
      recordNumber: "RV-1003",
      customerName: "Dr. Pérez",
      customerType: "doctor",
      customerEmail: "dr.perez@gmail.com",
      customerPhone: "584141010101",
      issueDate: iso(now.getTime() - 20 * day),
      dueDate: iso(now.getTime() - 2 * day),
      amountUSD: 90,
      paymentStatus: "paid",
      notes: "Compra directa",
      estimatedTaxes: calculateEstimatedTaxes(90),
      platformFee: calculatePlatformFee(90),
      sentAt: iso(now.getTime() - 19 * day),
      reminderCount: 0,
      lastReminderAt: null,
      lastPaymentDate: iso(now.getTime() - 7 * day),
    },
  ];

  return rows.map((r) => ({
    ...r,
    amountVES: Math.round((Number(r.amountUSD) || 0) * fxRate),
  }));
};

// ==========================
// Component
// ==========================
const ProviderBillingManagement = () => {
  const [fxRate, setFxRate] = useState(() => {
    const savedRaw = localStorage.getItem(STORAGE_FX);
    const saved = clampFx(savedRaw);
    return saved ?? DEFAULT_FX_RATE;
  });

  // Tabs
  const [activeTab, setActiveTab] = useState("sales");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");

  // UI actions
  const [selectedSales, setSelectedSales] = useState([]);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null);

  // Send / Remind (Demo)
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMode, setSendMode] = useState("send"); // "send" | "remind"
  const [sendTargets, setSendTargets] = useState([]); // records[]
  const [sendChannel, setSendChannel] = useState("whatsapp"); // "whatsapp" | "email"
  const [sendTo, setSendTo] = useState(""); // editable for single target
  const [sendMessage, setSendMessage] = useState("");

  // New Sale
  const [newSaleCustomer, setNewSaleCustomer] = useState("");
  const [newSaleCustomerType, setNewSaleCustomerType] = useState("clinic");
  const [newSaleEmail, setNewSaleEmail] = useState("");
  const [newSalePhone, setNewSalePhone] = useState("");
  const [newSaleAmountUSD, setNewSaleAmountUSD] = useState("");
  const [newSaleDate, setNewSaleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newSaleNotes, setNewSaleNotes] = useState("");

  // Payment
  const [paymentCurrency, setPaymentCurrency] = useState("USD");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Retentions
  const [hasRetention, setHasRetention] = useState(false);
  const [retentionAmountUSD, setRetentionAmountUSD] = useState("");

  // Data
  const [salesRecords, setSalesRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_SALES);
    const parsed = safeJSONParse(saved, null);
    if (Array.isArray(parsed) && parsed.length) return parsed;
    return seedSales(DEFAULT_FX_RATE);
  });

  const [paymentsLedger, setPaymentsLedger] = useState(() => {
    const saved = localStorage.getItem(STORAGE_PAYMENTS);
    const parsed = safeJSONParse(saved, []);
    return Array.isArray(parsed) ? parsed : [];
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SALES, JSON.stringify(salesRecords));
    } catch {}
  }, [salesRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PAYMENTS, JSON.stringify(paymentsLedger));
    } catch {}
  }, [paymentsLedger]);

  useEffect(() => {
    const nextFx = clampFx(fxRate);
    if (!nextFx) return;

    try {
      localStorage.setItem(STORAGE_FX, String(nextFx));
    } catch {}

    setSalesRecords((prev) =>
      (prev || []).map((r) => ({ ...r, amountVES: Math.round((Number(r.amountUSD) || 0) * nextFx) }))
    );
  }, [fxRate]);

  const handleSelectChange = (setter) => (e) => {
    const val = e?.target ? e.target.value : e;
    setter(val);
  };

  const payerLabel = (customerType) => {
    const map = {
      clinic: "Clínica",
      pharmacy: "Farmacia",
      doctor: "Médico",
      distributor: "Distribuidor",
      other: "Otro",
    };
    return map[customerType] || "Cliente";
  };

  // Filters
  const matchesDateRange = (record) => {
    if (dateRange === "all") return true;
    const issued = safeDate(record?.issueDate);
    if (!issued) return true;

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    if (dateRange === "week") start.setDate(now.getDate() - 7);
    else if (dateRange === "month") start.setMonth(now.getMonth() - 1);
    else if (dateRange === "quarter") start.setMonth(now.getMonth() - 3);

    return issued >= start;
  };

  const filteredSales = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();

    return (salesRecords || []).filter((r) => {
      const matchesSearch =
        (r?.customerName || "").toLowerCase().includes(q) ||
        (r?.recordNumber || "").toLowerCase().includes(q) ||
        (r?.notes || "").toLowerCase().includes(q);

      let matchesStatus = statusFilter === "all" || r?.paymentStatus === statusFilter;
      if (statusFilter === "overdue") matchesStatus = isOverdue(r?.dueDate, r?.paymentStatus);

      const matchesCustomer = customerFilter === "all" || r?.customerName === customerFilter;

      return matchesSearch && matchesStatus && matchesCustomer && matchesDateRange(r);
    });
  }, [salesRecords, searchTerm, statusFilter, customerFilter, dateRange]);

  // ✅ Limpia selección “fantasma” cuando cambian filtros
  useEffect(() => {
    const visibleIds = new Set((filteredSales || []).map((r) => r.id));
    setSelectedSales((prev) => (prev || []).filter((id) => visibleIds.has(id)));
  }, [filteredSales]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange("all");
    setCustomerFilter("all");
  };

  const customerOptions = useMemo(() => {
    const uniqueNames = [...new Set((salesRecords || []).map((r) => r?.customerName))].filter(Boolean);
    return [{ label: "Todos los clientes", value: "all" }, ...uniqueNames.map((n) => ({ label: n, value: n }))];
  }, [salesRecords]);

  // KPIs
  const arTotal = useMemo(() => calcAR(filteredSales), [filteredSales]);
  const dso = useMemo(() => calcDSO(filteredSales), [filteredSales]);
  const aging = useMemo(() => calcAging(filteredSales), [filteredSales]);
  const totalRevenue = useMemo(
    () => filteredSales.reduce((acc, r) => acc + (Number(r?.amountUSD) || 0), 0),
    [filteredSales]
  );
  const pendingAmount = useMemo(
    () =>
      filteredSales
        .filter((r) => r?.paymentStatus !== "paid")
        .reduce((acc, r) => acc + (Number(r?.amountUSD) || 0), 0),
    [filteredSales]
  );

  // ==========================
  // Envío (Demo): WhatsApp / Email
  // ==========================
  const buildSendText = ({ mode, record }) => {
    const totalUSD = formatCurrency(record?.amountUSD || 0, "USD");
    const totalVES = formatCurrency((record?.amountUSD || 0) * fxRate, "VES");
    const vence = formatDateVE(record?.dueDate);
    const cliente = record?.customerName || "Cliente";
    const id = record?.recordNumber || record?.id || "-";

    if (mode === "remind") {
      return `Hola ${cliente}. Recordatorio de pago: ${id}. Monto: ${totalUSD} (${totalVES}). Vence: ${vence}. Gracias.`;
    }
    return `Hola ${cliente}. Te enviamos el detalle del registro ${id}. Monto: ${totalUSD} (${totalVES}). Vence: ${vence}.`;
  };

  const openWhatsApp = (phone, text) => {
    const p = normalizePhone(phone);
    if (!p) return;
    const url = `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const openEmail = (email, subject, body) => {
    const to = String(email || "").trim();
    if (!to) return;
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const openSendForRecords = (mode, recordIds = []) => {
    const targets = (salesRecords || []).filter((r) => recordIds.includes(r.id));
    if (!targets.length) return;

    setSendMode(mode);
    setSendTargets(targets);
    setSendChannel("whatsapp");

    const one = targets.length === 1 ? targets[0] : null;
    const defaultTo = one ? one.customerPhone || one.customerEmail || "" : "";
    setSendTo(defaultTo);

    const msg = one ? buildSendText({ mode, record: one }) : "";
    setSendMessage(msg);

    setShowSendModal(true);
  };

  const confirmSend = () => {
    if (!sendTargets.length) return;

    const missing = sendTargets.filter((r) => {
      const phone = normalizePhone(r.customerPhone);
      const email = String(r.customerEmail || "").trim();
      return !(phone || email);
    });

    if (missing.length > 0) {
      alert("Hay registros sin teléfono/email del cliente. Completa el contacto para poder enviar.");
      return;
    }

    const isSingle = sendTargets.length === 1;
    const nowIso = new Date().toISOString();

    sendTargets.forEach((rec) => {
      const phone = normalizePhone(isSingle && sendTo ? sendTo : rec.customerPhone);
      const email = String(isSingle && sendTo ? sendTo : rec.customerEmail).trim();

      const text = isSingle && sendMessage ? sendMessage : buildSendText({ mode: sendMode, record: rec });

      const subject =
        sendMode === "remind"
          ? `Recordatorio de pago - ${rec.recordNumber}`
          : `Detalle de registro - ${rec.recordNumber}`;

      if (sendChannel === "whatsapp") openWhatsApp(phone || rec.customerPhone, text);
      if (sendChannel === "email") openEmail(email || rec.customerEmail, subject, text);
    });

    setSalesRecords((prev) =>
      (prev || []).map((r) => {
        const hit = sendTargets.some((t) => t.id === r.id);
        if (!hit) return r;

        if (sendMode === "remind") {
          return {
            ...r,
            reminderCount: (Number(r.reminderCount) || 0) + 1,
            lastReminderAt: nowIso,
          };
        }
        return { ...r, sentAt: nowIso };
      })
    );

    setShowSendModal(false);
    setSelectedSales([]);
  };

  // ==========================
  // Actions
  // ==========================
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentTarget(null);
    setHasRetention(false);
    setRetentionAmountUSD("");
    setPaymentAmount("");
  };

  const openRegisterPayment = (record) => {
    setPaymentTarget(record);

    const alreadyPaidUSD = (paymentsLedger || [])
      .filter((p) => p.recordId === record.id)
      .reduce((acc, p) => acc + (Number(p.amountUSD) || 0) + (Number(p.retentionUSD) || 0), 0);

    const remainingUSD = Math.max(0, (Number(record.amountUSD) || 0) - alreadyPaidUSD);

    setPaymentCurrency("USD");
    setPaymentAmount(String(remainingUSD.toFixed(2)));
    setPaymentMethod("transfer");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setHasRetention(false);
    setRetentionAmountUSD("");
    setShowPaymentModal(true);
  };

  const confirmRegisterPayment = () => {
    if (!paymentTarget) return;

    const rawPay = parseAmount(paymentAmount);
    if (Number.isNaN(rawPay) || rawPay < 0) {
      alert("Monto inválido.");
      return;
    }

    const fx = clampFx(fxRate);
    if (!fx) {
      alert("Tasa VES/USD inválida.");
      return;
    }

    let paidUSD = rawPay;
    let paidVES = 0;

    if (paymentCurrency === "VES") {
      paidVES = rawPay;
      paidUSD = paidVES / fx;
    }

    let retUSD = 0;
    if (hasRetention) {
      const rr = parseAmount(retentionAmountUSD);
      if (Number.isNaN(rr) || rr < 0) {
        alert("Monto de retención inválido.");
        return;
      }
      retUSD = rr;
    }

    const totalEffectiveUSD = paidUSD + retUSD;
    if (totalEffectiveUSD <= 0) {
      alert("El pago debe ser mayor a 0 (o incluir retención).");
      return;
    }

    const paidAt = new Date(`${paymentDate}T12:00:00`).toISOString();

    const paymentRow = {
      id: `PAY-${paymentTarget.id}-${Date.now()}`,
      recordId: paymentTarget.id,
      recordNumber: paymentTarget.recordNumber,
      customerName: paymentTarget.customerName,
      amountUSD: Math.round(paidUSD * 100) / 100,
      amountVES: paymentCurrency === "VES" ? Math.round(paidVES) : Math.round(paidUSD * fx),
      paymentCurrency,
      fxRateAtPayment: fx,
      method: paymentMethod,
      paidAt,
      retentionUSD: Math.round(retUSD * 100) / 100,
      notes: hasRetention ? `Pago + retención (USD ${retUSD.toFixed(2)})` : "Pago registrado",
    };

    setPaymentsLedger((prev) => [paymentRow, ...(prev || [])]);

    // ✅ Actualiza status basado en ledger existente + este pago
    setSalesRecords((prev) =>
      (prev || []).map((r) => {
        if (r.id !== paymentTarget.id) return r;

        const previousPaidUSD = (paymentsLedger || [])
          .filter((p) => p.recordId === r.id)
          .reduce((acc, p) => acc + (Number(p.amountUSD) || 0) + (Number(p.retentionUSD) || 0), 0);

        const totalPaidSoFarUSD = previousPaidUSD + totalEffectiveUSD;
        const totalAmountUSD = Number(r.amountUSD) || 0;

        let nextStatus = "pending";
        if (totalAmountUSD > 0 && totalPaidSoFarUSD >= totalAmountUSD - 0.01) nextStatus = "paid";
        else if (totalPaidSoFarUSD > 0) nextStatus = "partial";

        return {
          ...r,
          paymentStatus: nextStatus,
          lastPaymentDate: paidAt,
        };
      })
    );

    closePaymentModal();
  };

  const handleGenerateReceipt = (record) => {
    const html = `
      <html>
        <head>
          <title>Comprobante - ${record?.recordNumber}</title>
          <meta charset="utf-8" />
          <style>
            body{ font-family: Arial, sans-serif; padding: 24px; color:#111;}
            .muted{ color:#666; font-size:12px;}
            .box{ border:1px solid #ddd; border-radius:12px; padding:16px; margin-top:12px;}
            h1{ font-size:18px; margin:0 0 6px;}
            .row{ display:flex; justify-content:space-between; gap:12px; }
            .row > div{ flex:1; }
            table{ width:100%; border-collapse:collapse; margin-top:12px;}
            td,th{ border-bottom:1px solid #eee; padding:8px; font-size:12px; text-align:left;}
            .right{ text-align:right;}
          </style>
        </head>
        <body>
          <h1>Comprobante de Operación (No fiscal)</h1>
          <div class="muted">Documento interno para control de ventas/cobranza.</div>
          <div class="box">
            <div class="row">
              <div>
                <div class="muted">Registro</div>
                <div><b>${record?.recordNumber || "-"}</b></div>
              </div>
              <div>
                <div class="muted">Fecha emisión</div>
                <div><b>${formatDateVE(record?.issueDate)}</b></div>
              </div>
              <div>
                <div class="muted">Vence</div>
                <div><b>${formatDateVE(record?.dueDate)}</b></div>
              </div>
            </div>
            <div style="margin-top:12px" class="row">
              <div>
                <div class="muted">Cliente</div>
                <div><b>${record?.customerName || "-"}</b> <span class="muted">(${payerLabel(record?.customerType)})</span></div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th class="right">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total (USD)</td>
                  <td class="right"><b>${formatCurrency(record?.amountUSD, "USD")}</b></td>
                </tr>
                <tr>
                  <td>Total (VES)</td>
                  <td class="right">${formatCurrency((record?.amountUSD || 0) * fxRate, "VES")}</td>
                </tr>
                <tr>
                  <td class="muted">Impuestos (estimados)</td>
                  <td class="right">${formatCurrency(record?.estimatedTaxes?.iva || 0, "USD")}</td>
                </tr>
                <tr>
                  <td class="muted">Fee plataforma (Healtng)</td>
                  <td class="right">${formatCurrency(record?.platformFee?.amount || 0, "USD")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <script>window.print()</script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const handleNewSale = () => {
    const amountUSD = parseAmount(newSaleAmountUSD);

    if (Number.isNaN(amountUSD) || amountUSD <= 0) {
      alert("Ingresa un monto USD válido.");
      return;
    }

    const fx = clampFx(fxRate);
    if (!fx) {
      alert("Tasa VES/USD inválida.");
      return;
    }

    const issueDate = new Date(`${newSaleDate}T12:00:00`).toISOString();
    const dueDate = new Date(new Date(issueDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const estimatedTaxes = calculateEstimatedTaxes(amountUSD);
    const platformFee = calculatePlatformFee(amountUSD);

    const now = new Date();
    const id = `RV-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    const newRecord = {
      id,
      recordNumber: id,
      customerName: newSaleCustomer || "Cliente",
      customerType: newSaleCustomerType,
      customerEmail: String(newSaleEmail || "").trim(),
      customerPhone: String(newSalePhone || "").trim(),
      issueDate,
      dueDate,
      amountUSD,
      amountVES: Math.round(amountUSD * fx),
      paymentStatus: "pending",
      notes: newSaleNotes || "Registro manual",
      estimatedTaxes,
      platformFee,
      sentAt: null,
      reminderCount: 0,
      lastReminderAt: null,
      lastPaymentDate: null,
    };

    setSalesRecords((prev) => [newRecord, ...(prev || [])]);

    setNewSaleCustomer("");
    setNewSaleCustomerType("clinic");
    setNewSaleEmail("");
    setNewSalePhone("");
    setNewSaleAmountUSD("");
    setNewSaleNotes("");
    setShowNewSaleModal(false);
  };

  const exportForActiveTab = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const sortedSales = [...(filteredSales || [])].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    if (activeTab === "sales") {
      const rows = sortedSales.map((r) => ({
        recordNumber: r.recordNumber,
        customerName: r.customerName || "",
        customerType: payerLabel(r.customerType),
        customerEmail: r.customerEmail || "",
        customerPhone: r.customerPhone || "",
        issueDate: formatDateVE(r.issueDate),
        dueDate: formatDateVE(r.dueDate),
        amountUSD: Number(r.amountUSD || 0),
        amountVES: Math.round(Number(r.amountUSD || 0) * fxRate),
        status: isOverdue(r.dueDate, r.paymentStatus) ? "overdue" : r.paymentStatus,
        estimatedTaxUSD: Number(r.estimatedTaxes?.iva || 0),
        platformFeeUSD: Number(r.platformFee?.amount || 0),
        sentAt: r.sentAt ? formatDateVE(r.sentAt) : "",
        reminderCount: Number(r.reminderCount || 0),
        lastReminderAt: r.lastReminderAt ? formatDateVE(r.lastReminderAt) : "",
      }));
      downloadTextFile(`provider-ventas-${stamp}.csv`, toCSV(rows));
      return;
    }

    if (activeTab === "payments") {
      const rows = (paymentsLedger || []).map((p) => ({
        paymentId: p.id,
        recordNumber: p.recordNumber,
        customerName: p.customerName,
        paymentCurrency: p.paymentCurrency,
        fxRateAtPayment: p.fxRateAtPayment,
        amountUSD: Number(p.amountUSD || 0),
        amountVES: Number(p.amountVES || 0),
        retentionUSD: Number(p.retentionUSD || 0),
        method: paymentMethodLabel(p.method),
        paidAt: formatDateVE(p.paidAt),
        notes: p.notes || "",
      }));
      downloadTextFile(`provider-pagos-${stamp}.csv`, toCSV(rows));
      return;
    }

    if (activeTab === "reports") {
      const rows = sortedSales.map((r) => ({
        date: formatDateVE(r.issueDate),
        recordNumber: r.recordNumber,
        customerName: r.customerName || "",
        totalUSD: Number(r.amountUSD || 0),
        status: isOverdue(r.dueDate, r.paymentStatus) ? "overdue" : r.paymentStatus,
      }));
      downloadTextFile(`provider-reporte-${stamp}.csv`, toCSV(rows));
      return;
    }
  };

  const handleBulkAction = (action) => {
    if (!selectedSales.length) return;
    if (action === "send") {
      openSendForRecords("send", selectedSales);
      return;
    }
    if (action === "remind") {
      openSendForRecords("remind", selectedSales);
      return;
    }
  };

  const getPaymentStatusBadge = (status) => {
    const cfg = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: "Clock", text: "Pendiente" },
      partial: { color: "bg-blue-100 text-blue-800", icon: "AlertCircle", text: "Parcial" },
      paid: { color: "bg-green-100 text-green-800", icon: "CheckCircle", text: "Pagado" },
      overdue: { color: "bg-red-100 text-red-800", icon: "AlertTriangle", text: "Vencido" },
    };
    const c = cfg?.[status] || cfg.pending;
    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
        <Icon name={c.icon} size={12} className="mr-1" />
        {c.text}
      </div>
    );
  };

  const tabs = [
    { id: "sales", label: "Ventas (AR)", icon: "FileText" },
    { id: "payments", label: "Pagos", icon: "CreditCard" },
    { id: "reports", label: "Reportes", icon: "BarChart3" },
    { id: "analytics", label: "Analítica", icon: "TrendingUp" },
  ];

  // ✅ “Select all” correcto aunque haya selección previa
  const visibleIds = useMemo(() => (filteredSales || []).map((r) => r.id), [filteredSales]);
  const visibleSet = useMemo(() => new Set(visibleIds), [visibleIds]);
  const selectedVisibleCount = useMemo(
    () => (selectedSales || []).filter((id) => visibleSet.has(id)).length,
    [selectedSales, visibleSet]
  );
  const allVisibleSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventas y Cobranza (Proveedor)</h1>
            <p className="text-sm text-gray-600 mt-1">Control interno (USD referencia) + pagos USD/VES + retenciones</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tasa */}
            <div className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <div className="text-[11px] text-gray-700">Tasa VES/USD</div>
              <input
                value={fxRate}
                onChange={(e) => {
                  const next = clampFx(e.target.value);
                  // si el usuario borra el input momentáneamente, no lo mates a 0
                  if (!next) {
                    setFxRate(e.target.value);
                    return;
                  }
                  setFxRate(next);
                }}
                type="number"
                min={0}
                step="0.01"
                // CORRECCIÓN: bg-white, texto negro y negrita
                className="mt-1 w-28 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                aria-label="Tasa VES por USD"
              />
            </div>

            <Button onClick={() => setShowNewSaleModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Icon name="Plus" size={16} className="mr-2" />
              Nuevo Registro
            </Button>

            <Button onClick={exportForActiveTab} className="bg-green-600 hover:bg-green-700 text-white">
              <Icon name="Download" size={16} className="mr-2" />
              Exportar
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem(STORAGE_SALES);
                localStorage.removeItem(STORAGE_PAYMENTS);
                localStorage.removeItem(STORAGE_FX);
                window.location.reload();
              }}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
              title="Borrar datos locales y reiniciar demo"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Reset Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon name={tab.icon} size={16} className="mr-2" />
                {tab.label}
                {tab.id === "sales" && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {filteredSales.filter((r) => r?.paymentStatus === "pending").length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-end gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Búsqueda</label>
                <Input
                  type="text"
                  placeholder="Cliente / registro / notas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  // CORRECCIÓN: Fondo blanco explícito
                  className="w-full bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Estado</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={statusFilter} onChange={handleSelectChange(setStatusFilter)} options={STATUS_OPTIONS} className="w-full bg-white border-gray-300 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Cliente</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={customerFilter} onChange={handleSelectChange(setCustomerFilter)} options={customerOptions} className="w-full bg-white border-gray-300 text-gray-900" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Rango</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={dateRange} onChange={handleSelectChange(setDateRange)} options={DATE_RANGE_OPTIONS} className="w-full bg-white border-gray-300 text-gray-900" />
              </div>
            </div>

            <Button
              onClick={clearFilters}
              variant="outline"
              className="mb-[2px] border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-red-600 px-3"
              title="Limpiar filtros"
            >
              <Icon name="Trash2" size={16} />
              <span className="ml-2 hidden lg:inline">Limpiar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600">Cuentas por Cobrar (AR)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(arTotal, "USD")}</p>
              <p className="text-xs text-gray-500 mt-1">{formatCurrency(arTotal * fxRate, "VES")}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600">DSO (promedio)</p>
              <p className="text-2xl font-bold text-gray-900">{dso} días</p>
              <p className="text-xs text-gray-500 mt-1">Solo registros pagados</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600">Mora (aging)</p>
              <div className="mt-2 space-y-1 text-sm text-gray-700">
                <div className="flex justify-between"><span>0–30</span><span>{formatCurrency(aging["0-30"] || 0)}</span></div>
                <div className="flex justify-between"><span>31–60</span><span>{formatCurrency(aging["31-60"] || 0)}</span></div>
                <div className="flex justify-between"><span>61–90</span><span>{formatCurrency(aging["61-90"] || 0)}</span></div>
                <div className="flex justify-between"><span>90+</span><span>{formatCurrency(aging["90+"] || 0)}</span></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-medium text-gray-600">Totales</p>
              <p className="text-sm text-gray-700 mt-2">Ingresos: <b>{formatCurrency(totalRevenue)}</b></p>
              <p className="text-sm text-gray-700">Por cobrar: <b>{formatCurrency(pendingAmount)}</b></p>
              <p className="text-xs text-gray-500 mt-2">Referencia USD + equivalencia VES</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flujo de Caja (placeholder)</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Aquí luego conectas un gráfico real</p>
                <p className="text-sm text-gray-400">Con data mensual (backend)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      {activeTab === "sales" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedSales.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700">{selectedSales.length} seleccionadas</p>
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={() => handleBulkAction("send")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Enviar
                  </Button>
                  <Button size="sm" onClick={() => handleBulkAction("remind")} className="bg-orange-600 hover:bg-orange-700 text-white">
                    Recordatorios
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e?.target?.checked) setSelectedSales(visibleIds);
                        else setSelectedSales([]);
                      }}
                      checked={allVisibleSelected}
                      className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      aria-label="Seleccionar todos"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro / Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Vence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Icon name="FileText" size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg font-medium">No hay registros</p>
                        <p className="text-gray-400 text-sm">No se encontraron resultados con los filtros aplicados</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((r) => {
                    const overdue = isOverdue(r.dueDate, r.paymentStatus);
                    const status = overdue ? "overdue" : r.paymentStatus;

                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSales.includes(r.id)}
                            onChange={(e) => {
                              if (e?.target?.checked) setSelectedSales((prev) => [...prev, r.id]);
                              else setSelectedSales((prev) => prev.filter((id) => id !== r.id));
                            }}
                            className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            aria-label={`Seleccionar ${r.recordNumber}`}
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{r.recordNumber}</div>
                            <div className="text-sm text-gray-600">
                              {r.customerName} <span className="text-xs text-gray-400">({payerLabel(r.customerType)})</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {r.customerPhone ? `Tel: ${r.customerPhone}` : "Tel: -"}{" "}
                              <span className="mx-2 text-gray-300">|</span>{" "}
                              {r.customerEmail ? `Email: ${r.customerEmail}` : "Email: -"}
                            </div>

                            {r.sentAt && <div className="text-xs text-gray-400 mt-1">Enviado: {formatDateVE(r.sentAt)}</div>}
                            {Number(r.reminderCount || 0) > 0 && (
                              <div className="text-xs text-gray-400">
                                Recordatorios: {r.reminderCount} {r.lastReminderAt ? `· Último: ${formatDateVE(r.lastReminderAt)}` : ""}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">Emitida: {formatDateVE(r.issueDate)}</div>
                            <div className={`text-sm ${overdue ? "text-red-600" : "text-gray-600"}`}>Vence: {formatDateVE(r.dueDate)}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(r.amountUSD, "USD")}</div>
                            <div className="text-xs text-gray-600">{formatCurrency(r.amountUSD * fxRate, "VES")}</div>
                            <div className="text-xs text-gray-500">Fee: {formatCurrency(r.platformFee?.amount || 0, "USD")}</div>
                            <div className="text-xs text-gray-500">IVA est.: {formatCurrency(r.estimatedTaxes?.iva || 0, "USD")}</div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentStatusBadge(status)}
                          {r.lastPaymentDate && <div className="text-xs text-gray-600 mt-1">Último pago: {formatDateVE(r.lastPaymentDate)}</div>}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openSendForRecords("send", [r.id])}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Icon name="Send" size={16} className="mr-1" />
                            Enviar
                          </Button>

                          {r.paymentStatus !== "paid" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRegisterPayment(r)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Icon name="Check" size={16} className="mr-1" />
                              Registrar Pago
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateReceipt(r)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <Icon name="Receipt" size={16} className="mr-1" />
                            Recibo
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pagos</h3>
            <p className="text-sm text-gray-600 mt-1">Ledger para conciliación y cobranza (incluye retenciones).</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {(paymentsLedger || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No hay pagos registrados.
                    </td>
                  </tr>
                ) : (
                  paymentsLedger.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.id}</div>
                        <div className="text-xs text-gray-500">{p.notes || ""}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.recordNumber}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{p.customerName}</div>
                        <div className="text-xs text-gray-600">
                          Tasa: {p.fxRateAtPayment} VES/USD
                          <span className="mx-2 text-gray-300">|</span>
                          Moneda: {p.paymentCurrency}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateVE(p.paidAt)}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{paymentMethodLabel(p.method)}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(p.amountUSD, "USD")}
                        <span className="text-xs text-gray-600 block">{formatCurrency(p.amountVES, "VES")}</span>
                        {p.retentionUSD > 0 && (
                          <span className="text-xs text-gray-600 block">+ {formatCurrency(p.retentionUSD, "USD")} (Ret.)</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
            <p className="text-sm text-gray-600 mt-1">Exportables para control interno / contabilidad.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">Ventas (CSV)</p>
                <p className="text-xs text-gray-500 mt-1">Respeta filtros actuales.</p>
                <Button onClick={exportForActiveTab} className="mt-3 bg-green-600 hover:bg-green-700 text-white">
                  <Icon name="Download" size={16} className="mr-2" />
                  Exportar
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">Pagos (CSV)</p>
                <p className="text-xs text-gray-500 mt-1">Incluye retenciones y tasa aplicada.</p>
                <Button onClick={() => setActiveTab("payments")} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                  <Icon name="Eye" size={16} className="mr-2" />
                  Ver Pagos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Nueva venta */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Registrar Venta Manual</h3>
              <button onClick={() => setShowNewSaleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-sm text-gray-600 mt-2">Registro interno. No genera factura fiscal.</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Cliente</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={newSaleCustomer} onChange={(e) => setNewSaleCustomer(e.target.value)} placeholder="Ej: Clínica X" className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Tipo</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={newSaleCustomerType} onChange={handleSelectChange(setNewSaleCustomerType)} options={CUSTOMER_TYPE_OPTIONS} className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Email (opcional)</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={newSaleEmail} onChange={(e) => setNewSaleEmail(e.target.value)} placeholder="correo@cliente.com" className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Teléfono (opcional)</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={newSalePhone} onChange={(e) => setNewSalePhone(e.target.value)} placeholder="58412..." className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Fecha emisión</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input type="date" value={newSaleDate} onChange={(e) => setNewSaleDate(e.target.value)} className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">Monto (USD)</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={newSaleAmountUSD} onChange={(e) => setNewSaleAmountUSD(e.target.value)} placeholder="0.00" className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Notas</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={newSaleNotes} onChange={(e) => setNewSaleNotes(e.target.value)} placeholder="Detalle / referencia de pedido..." className="bg-white border-gray-300 text-gray-900" />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button onClick={() => setShowNewSaleModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                Cancelar
              </Button>
              <Button onClick={handleNewSale} className="bg-blue-600 hover:bg-blue-700 text-white">
                Crear Registro
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Registrar Pago</h3>
              <button onClick={closePaymentModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div><span className="text-gray-500">Registro:</span> <b>{paymentTarget?.recordNumber}</b></div>
              <div><span className="text-gray-500">Cliente:</span> <b>{paymentTarget?.customerName}</b></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <div>
                <label className="text-xs text-gray-500">Moneda pago</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={paymentCurrency} onChange={handleSelectChange(setPaymentCurrency)} options={PAYMENT_CURRENCY_OPTIONS} className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Método</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={paymentMethod} onChange={handleSelectChange(setPaymentMethod)} options={PAYMENT_METHOD_OPTIONS} className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Monto recibido ({paymentCurrency})</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input value={paymentAmount} onChange={(e) => setPaymentAmount(e?.target?.value)} placeholder="0.00" className="bg-white border-gray-300 text-gray-900" />
                <p className="text-[11px] text-gray-500 mt-1">
                  Referencia del sistema siempre en USD. Si pagas en VES, se convierte con la tasa actual.
                </p>
              </div>

              <div>
                <label className="text-xs text-gray-500">Fecha</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e?.target?.value)} className="bg-white border-gray-300 text-gray-900" />
              </div>
            </div>

            {/* Retenciones */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRetention}
                  onChange={(e) => setHasRetention(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span>Incluir Retención (IVA/ISLR) en USD</span>
              </label>

              {hasRetention && (
                <div className="mt-2">
                  <label className="text-xs text-gray-500">Monto retenido (USD)</label>
                  {/* CORRECCIÓN: Fondo blanco explícito */}
                  <Input value={retentionAmountUSD} onChange={(e) => setRetentionAmountUSD(e.target.value)} placeholder="0.00" className="mt-1 bg-white border-gray-300 text-gray-900" />
                  <p className="text-xs text-gray-500 mt-1">Se suma al pago para “saldar” la deuda (aunque no sea cash).</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button onClick={closePaymentModal} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                Cancelar
              </Button>
              <Button onClick={confirmRegisterPayment} className="bg-green-600 hover:bg-green-700 text-white">
                Confirmar Pago
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Enviar / Recordatorio (DEMO) */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {sendMode === "remind" ? "Enviar Recordatorio" : "Enviar Registro"}
              </h3>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Demo: se abrirá WhatsApp Web o tu cliente de correo con el mensaje precargado.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs text-gray-500">Canal</label>
                {/* CORRECCIÓN: Fondo blanco explícito */}
                <Select value={sendChannel} onChange={handleSelectChange(setSendChannel)} options={SEND_CHANNEL_OPTIONS} className="bg-white border-gray-300 text-gray-900" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Registros</label>
                <div className="text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  {sendTargets.length} seleccionados
                </div>
              </div>
            </div>

            {sendTargets.length === 1 ? (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500">
                    Destino ({sendChannel === "whatsapp" ? "Teléfono" : "Email"})
                  </label>
                  {/* CORRECCIÓN: Fondo blanco explícito */}
                  <Input
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    placeholder={sendChannel === "whatsapp" ? "58412..." : "correo@cliente.com"}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Si lo cambias aquí, se usará este destino para este envío.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500">Mensaje</label>
                  {/* CORRECCIÓN CRÍTICA: Se agrega bg-white explícito al textarea */}
                  <textarea
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
                    rows={5}
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Cliente: <b className="text-gray-800">{sendTargets[0]?.customerName}</b>{" "}
                  <span className="mx-2 text-gray-300">|</span>
                  Vence: <b className="text-gray-800">{formatDateVE(sendTargets[0]?.dueDate)}</b>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                  Se enviará a cada cliente usando el teléfono/email guardado en cada registro.
                  <div className="text-xs text-gray-500 mt-1">
                    Si algún registro no tiene contacto, el envío se bloqueará.
                  </div>
                </div>

                <div className="mt-3 max-h-44 overflow-auto border border-gray-200 rounded-lg">
                  {(sendTargets || []).map((r) => (
                    <div key={r.id} className="px-3 py-2 border-b last:border-b-0 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900 font-medium">{r.recordNumber}</div>
                        <div className="text-gray-600">{formatCurrency(r.amountUSD, "USD")}</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {r.customerName} · Tel: {r.customerPhone || "-"} · Email: {r.customerEmail || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button onClick={() => setShowSendModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                Cancelar
              </Button>
              <Button
                onClick={confirmSend}
                className={`${sendMode === "remind" ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                {sendMode === "remind" ? "Enviar Recordatorio" : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBillingManagement;