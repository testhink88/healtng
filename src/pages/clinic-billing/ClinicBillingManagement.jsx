import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/**
 * ClinicBillingManagement v2.3 (archivo único, demo robusto, moneda referencial USD)
 *
 * ✅ Fixes incluidos:
 * - Aging (días vencido) CORREGIDO (antes siempre daba 0)
 * - Hooks inválidos dentro del JSX ELIMINADOS (rompía reglas de React)
 * - Multi-moneda real: Documento puede estar en USD o VES, pagos pueden ser USD/VES
 *   => Se convierten y aplican al saldo del documento usando FX (USD→VES)
 * - KPIs normalizados a USD (moneda referencial)
 * - Semántica: "Beneficiario" (quien recibe servicio) vs "Pagador" (quien paga)
 * - Ranking Aseguradoras por tardanza (promedio días hasta pago completo)
 *
 * NOTA DE FX:
 * - fxRate = USD→VES (Ej: 38.5 significa 1 USD = 38.5 VES)
 * - Convertir VES→USD: VES / fxRate
 * - Convertir USD→VES: USD * fxRate
 *
 * Persistencia: localStorage (demo estable + migración simple)
 */

const LS = {
  DOCS: "healtng_clinic_billing_docs_v3",
  PAYMENTS: "healtng_clinic_billing_payments_v3",
  SETTINGS: "healtng_clinic_billing_settings_v3",
};

const PAYER_TYPES = [
  { value: "patient", label: "Paciente" },
  { value: "insurance", label: "Aseguradora" },
  { value: "company", label: "Empresa" }, // Salud ocupacional / corporativo
];

const LINK_KINDS = [
  { value: "manual", label: "Manual" },
  { value: "appointment", label: "Cita" },
  { value: "order", label: "Orden" },
  { value: "authorization", label: "Autorización" },
];

const DOC_STATUS = [
  { value: "all", label: "Todos" },
  { value: "draft", label: "Borrador" },
  { value: "issued", label: "Emitido" },
  { value: "partial", label: "Parcial" },
  { value: "paid", label: "Pagado" },
  { value: "overdue", label: "Vencido" },
  { value: "cancelled", label: "Cancelado" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Efectivo" },
  { value: "transfer", label: "Transferencia" },
  { value: "card", label: "Tarjeta" },
  { value: "pos", label: "Punto de venta" },
  { value: "zelle", label: "Zelle" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Otro" },
];

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "VES", label: "Bs." },
];

const DATE_RANGES = [
  { value: "all", label: "Todos los períodos" },
  { value: "today", label: "Hoy" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "this_month", label: "Este mes" },
];

const CLAIM_STATUS = [
  { value: "submitted", label: "Enviado" },
  { value: "in_review", label: "En revisión" },
  { value: "approved", label: "Aprobado" },
  { value: "paid", label: "Pagado" },
  { value: "rejected", label: "Rechazado" },
];

function uid(prefix = "ID") {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(isoDate, days) {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function parseNumber(val) {
  if (val === null || val === undefined) return 0;
  const clean = String(val).trim().replace(/\s/g, "").replace(/,/g, ".");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
}

function fmtMoney(amount, currency = "USD") {
  const n = Number(amount || 0);
  if (currency === "VES") return `Bs. ${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

function daysBetween(aISO, bISO) {
  const a = new Date(aISO);
  const b = new Date(bISO);
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function badgeClass(status) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    case "partial":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "issued":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "cancelled":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSave(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function toCSV(rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    if (s.includes('"') || s.includes(",") || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(escape).join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Modal({ title, children, onClose }) {
  const modal = (
    <div className="fixed inset-0 z-[9999]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-3 md:p-6">
        <div className="w-[min(960px,96vw)] max-h-[92vh] overflow-auto rounded-xl bg-white shadow-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800" onClick={onClose}>
              Cerrar
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-500">{label}</div>
      {children}
      {hint ? <div className="text-[11px] text-gray-400">{hint}</div> : null}
    </div>
  );
}

function Select({ value, onChange, options, disabled }) {
  return (
    <select
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Input(props) {
  return (
    <input
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-900
                 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200
                 disabled:bg-gray-50 disabled:text-gray-500"
      {...props}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-900
                 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200
                 disabled:bg-gray-50 disabled:text-gray-500"
      {...props}
    />
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        disabled ? "bg-blue-300 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, disabled }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm ${
        disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function DangerButton({ children, onClick }) {
  return (
    <button className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white" onClick={onClick}>
      {children}
    </button>
  );
}

function formatPayerLabel(payerType) {
  return PAYER_TYPES.find((p) => p.value === payerType)?.label || payerType;
}

function formatMethodLabel(method) {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label || method;
}

function formatLinkKind(kind) {
  return LINK_KINDS.find((k) => k.value === kind)?.label || kind;
}

// ===== FX helpers (USD referencial) =====
// fxRate = USD->VES
function toUSD(amount, currency, fxRateUSDToVES) {
  const amt = parseNumber(amount);
  if (currency === "USD") return amt;
  const fx = parseNumber(fxRateUSDToVES);
  if (fx <= 0) return 0;
  // VES -> USD
  return amt / fx;
}

function fromUSD(usdAmount, currency, fxRateUSDToVES) {
  const usd = parseNumber(usdAmount);
  if (currency === "USD") return usd;
  const fx = parseNumber(fxRateUSDToVES);
  if (fx <= 0) return 0;
  // USD -> VES
  return usd * fx;
}

/**
 * Convierte un pago hacia la moneda del documento, usando:
 * - FX del pago si pago es VES (required)
 * - FX del documento si doc es VES (para aplicar en VES)
 * - Siempre pasa por USD como moneda base
 */
function paymentToDocCurrency(payment, doc, settingsDefaultFx) {
  const payAmt = parseNumber(payment.amount);
  const payCur = payment.currency || "USD";
  const payFx = payCur === "VES" ? parseNumber(payment.fxRate) : 0;

  const docCur = doc.currency || "USD";
  const docFx = docCur === "VES" ? parseNumber(doc.fxRate || settingsDefaultFx) : 0;

  // Primero a USD
  const usd = payCur === "USD" ? payAmt : toUSD(payAmt, "VES", payFx);

  // Luego a moneda del doc
  return docCur === "USD" ? usd : fromUSD(usd, "VES", docFx);
}

function docAmountToUSD(amountInDocCurrency, doc, settingsDefaultFx) {
  const amt = parseNumber(amountInDocCurrency);
  const cur = doc.currency || "USD";
  const fx = cur === "VES" ? parseNumber(doc.fxRate || settingsDefaultFx) : 0;
  return cur === "USD" ? amt : toUSD(amt, "VES", fx);
}

function normalizeDocStatus(doc, nowISO) {
  if (doc.status === "cancelled") return "cancelled";
  if (doc.status === "draft") return "draft";

  const total = parseNumber(doc.total);
  const paid = parseNumber(doc.paidTotal);
  const balance = Math.max(total - paid, 0);

  if (balance <= 0.00001) return "paid";

  // Regla: si no hay dueAt, NO marcamos overdue automáticamente
  if (!doc.dueAt) {
    return paid > 0 ? "partial" : "issued";
  }

  const isOverdue = new Date(doc.dueAt) < new Date(nowISO);
  if (paid > 0 && balance > 0) return isOverdue ? "overdue" : "partial";
  return isOverdue ? "overdue" : "issued";
}

const DEFAULT_SETTINGS = {
  baseCurrency: "USD",
  defaultFxRate: 38.5, // USD->VES
  autoDocPrefix: "CX",
};

function buildDemoData() {
  const now = todayISO();

  // Demo coherente:
  // - Beneficiario es el paciente/empleado
  // - Pagador puede ser paciente, empresa o aseguradora
  const docs = [
    {
      id: uid("DOC"),
      docNo: "CX-2026-001",
      beneficiaryName: "Juan Pérez",
      beneficiaryId: "V-12345678",
      payerType: "patient",
      payerName: "Juan Pérez",
      issuedAt: addDaysISO(now, -10),
      dueAt: addDaysISO(now, 5),
      currency: "USD",
      fxRate: 0,
      subtotal: 430,
      tax: 0,
      fees: 31,
      total: 461,
      paidTotal: 0,
      status: "issued",
      notes: "Consulta + procedimiento.",
      link: { kind: "appointment", ref: "APT-001" },
      insurance: null,
      company: null,
    },
    {
      id: uid("DOC"),
      docNo: "CX-2026-002",
      beneficiaryName: "María G. (empleada)",
      beneficiaryId: "V-87654321",
      payerType: "company",
      payerName: "Empresa XYZ, C.A.",
      issuedAt: addDaysISO(now, -25),
      dueAt: addDaysISO(now, -3),
      currency: "VES",
      fxRate: 38.5,
      subtotal: 2500,
      tax: 0,
      fees: 0,
      total: 2500,
      paidTotal: 0,
      status: "issued",
      notes: "Salud ocupacional. Pendiente de conciliación.",
      link: { kind: "order", ref: "ORD-882" },
      insurance: null,
      company: {
        rif: "J-12345678-9",
        costCenter: "Operaciones",
        approvalRef: "EMP-APR-1002",
      },
    },
    {
      id: uid("DOC"),
      docNo: "CX-2026-003",
      beneficiaryName: "Pedro S.",
      beneficiaryId: "V-11223344",
      payerType: "insurance",
      payerName: "Seguros Miranda",
      issuedAt: addDaysISO(now, -20),
      dueAt: addDaysISO(now, 10),
      currency: "USD",
      fxRate: 0,
      subtotal: 1100,
      tax: 0,
      fees: 100,
      total: 1200,
      paidTotal: 0,
      status: "issued",
      notes: "Caso aseguradora en curso.",
      link: { kind: "authorization", ref: "AUTH-009" },
      insurance: {
        insurerName: "Seguros Miranda",
        policyNumber: "POL-778812",
        approvalKey: "APR-98321",
        claimStatus: "in_review",
      },
      company: null,
    },
  ].map((d) => ({ ...d, status: normalizeDocStatus(d, now) }));

  const payments = [
    {
      id: uid("PAY"),
      docId: docs[0].id,
      paidAt: addDaysISO(now, -2),
      amount: 200,
      currency: "USD",
      fxRate: 0,
      method: "transfer",
      reference: "TRX-188220",
      notes: "Abono parcial",
    },
    {
      id: uid("PAY"),
      docId: docs[1].id,
      paidAt: addDaysISO(now, -1),
      amount: 1000,
      currency: "VES",
      fxRate: 38.5,
      method: "pos",
      reference: "POS-88291",
      notes: "",
    },
  ];

  return { docs, payments, settings: DEFAULT_SETTINGS };
}

// ======= UI =======
export default function ClinicBillingManagement() {
  const [activeTab, setActiveTab] = useState("ar");

  const [docs, setDocs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // filters (CxC)
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [payerType, setPayerType] = useState("all");
  const [beneficiary, setBeneficiary] = useState("all");
  const [range, setRange] = useState("all");
  const [currency, setCurrency] = useState("all");

  // modals
  const [openNewDoc, setOpenNewDoc] = useState(false);
  const [openNewPayment, setOpenNewPayment] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedDocIdForPayment, setSelectedDocIdForPayment] = useState(null);

  // view
  const [openDocView, setOpenDocView] = useState(false);
  const [docViewId, setDocViewId] = useState(null);

  const nowISO = todayISO();

  // ===== Load persisted + migration =====
  useEffect(() => {
    const savedDocs = safeLoad(LS.DOCS, null);
    const savedPays = safeLoad(LS.PAYMENTS, null);
    const savedSettings = safeLoad(LS.SETTINGS, null);

    if (!savedDocs || !savedPays) {
      const demo = buildDemoData();
      setDocs(demo.docs);
      setPayments(demo.payments);
      setSettings(demo.settings);
      safeSave(LS.DOCS, demo.docs);
      safeSave(LS.PAYMENTS, demo.payments);
      safeSave(LS.SETTINGS, demo.settings);
      return;
    }

    // Migración mínima:
    // - Si venías de un esquema anterior con clientName, lo mapeamos a beneficiaryName
    const migratedDocs = (Array.isArray(savedDocs) ? savedDocs : []).map((d) => {
      const beneficiaryName = d.beneficiaryName || d.clientName || "";
      const payerName =
        d.payerName ||
        (d.payerType === "patient" ? beneficiaryName : d.payerType === "company" ? "Empresa" : "Aseguradora");
      const currency = d.currency || "USD";
      const fxRate = currency === "VES" ? parseNumber(d.fxRate || savedSettings?.defaultFxRate || DEFAULT_SETTINGS.defaultFxRate) : 0;
      const next = {
        ...d,
        beneficiaryName,
        payerName,
        currency,
        fxRate,
      };
      next.status = normalizeDocStatus(next, nowISO);
      return next;
    });

    setDocs(migratedDocs);
    setPayments(Array.isArray(savedPays) ? savedPays : []);
    setSettings(savedSettings || DEFAULT_SETTINGS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => safeSave(LS.DOCS, docs), [docs]);
  useEffect(() => safeSave(LS.PAYMENTS, payments), [payments]);
  useEffect(() => safeSave(LS.SETTINGS, settings), [settings]);

  // ===== Recompute doc paid totals from payments (aplicados en moneda del documento) =====
  useEffect(() => {
    if (!docs.length) return;

    const paidByDocInDocCurrency = payments.reduce((acc, p) => {
      const doc = docs.find((d) => d.id === p.docId);
      if (!doc) return acc;

      const applied = paymentToDocCurrency(p, doc, settings.defaultFxRate);
      acc[p.docId] = (acc[p.docId] || 0) + applied;
      return acc;
    }, {});

    const updated = docs.map((d) => {
      const paidTotal = parseNumber(paidByDocInDocCurrency[d.id] || 0);
      const next = { ...d, paidTotal };
      next.status = normalizeDocStatus(next, nowISO);
      return next;
    });

    const changed = updated.some((u, i) => parseNumber(u.paidTotal) !== parseNumber(docs[i]?.paidTotal) || u.status !== docs[i]?.status);
    if (changed) setDocs(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments, settings.defaultFxRate]);

  const beneficiariesList = useMemo(() => {
    const unique = Array.from(new Set(docs.map((d) => d.beneficiaryName).filter(Boolean))).sort();
    return [{ value: "all", label: "Todos los beneficiarios" }, ...unique.map((c) => ({ value: c, label: c }))];
  }, [docs]);

  const docRows = useMemo(() => {
    const lower = q.trim().toLowerCase();

    const rangeMatch = (d) => {
      if (range === "all") return true;
      const issued = d.issuedAt ? new Date(d.issuedAt) : null;
      if (!issued) return true;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      if (range === "today") return d.issuedAt === todayISO();

      if (range === "7d") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        return issued >= cutoff;
      }

      if (range === "30d") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        return issued >= cutoff;
      }

      if (range === "this_month") return issued >= startOfMonth;

      return true;
    };

    return docs
      .map((d) => {
        const total = parseNumber(d.total);
        const paid = parseNumber(d.paidTotal);
        const balance = Math.max(total - paid, 0);

        const lastPay = payments
          .filter((p) => p.docId === d.id)
          .sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))[0];

        const balanceUSD = docAmountToUSD(balance, d, settings.defaultFxRate);

        return { ...d, total, paid, balance, balanceUSD, lastPay };
      })
      .filter((d) => {
        if (lower) {
          const hay = `${d.docNo} ${d.beneficiaryName} ${d.payerName} ${d.payerType} ${d.link?.ref || ""}`.toLowerCase();
          if (!hay.includes(lower)) return false;
        }
        if (status !== "all" && d.status !== status) return false;
        if (payerType !== "all" && d.payerType !== payerType) return false;
        if (beneficiary !== "all" && d.beneficiaryName !== beneficiary) return false;
        if (currency !== "all" && d.currency !== currency) return false;
        if (!rangeMatch(d)) return false;
        return true;
      })
      .sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
  }, [docs, payments, q, status, payerType, beneficiary, range, currency, settings.defaultFxRate]);

  // ===== KPIs normalizados a USD =====
  const kpis = useMemo(() => {
    const collectedTodayUSD = payments
      .filter((p) => p.paidAt === nowISO)
      .reduce((sum, p) => sum + toUSD(p.amount, p.currency, p.currency === "VES" ? p.fxRate : settings.defaultFxRate), 0);

    const receivablesUSD = docs
      .filter((d) => !["paid", "cancelled", "draft"].includes(d.status))
      .reduce((sum, d) => {
        const bal = Math.max(parseNumber(d.total) - parseNumber(d.paidTotal), 0);
        return sum + docAmountToUSD(bal, d, settings.defaultFxRate);
      }, 0);

    const overdueUSD = docs
      .filter((d) => d.status === "overdue")
      .reduce((sum, d) => {
        const bal = Math.max(parseNumber(d.total) - parseNumber(d.paidTotal), 0);
        return sum + docAmountToUSD(bal, d, settings.defaultFxRate);
      }, 0);

    const insurerPendingUSD = docs
      .filter((d) => d.payerType === "insurance" && !["paid", "cancelled"].includes(d.status))
      .reduce((sum, d) => {
        const bal = Math.max(parseNumber(d.total) - parseNumber(d.paidTotal), 0);
        return sum + docAmountToUSD(bal, d, settings.defaultFxRate);
      }, 0);

    return { collectedTodayUSD, receivablesUSD, overdueUSD, insurerPendingUSD };
  }, [docs, payments, nowISO, settings.defaultFxRate]);

  // ===== Aging (buckets en USD) + vencidos =====
  const aging = useMemo(() => {
    const bucketsUSD = { "0-7": 0, "8-15": 0, "16-30": 0, "31+": 0 };

    const overdueDocs = docs
      .map((d) => {
        const total = parseNumber(d.total);
        const paid = parseNumber(d.paidTotal);
        const balance = Math.max(total - paid, 0);

        // ✅ FIX: días vencido correcto (si dueAt < now)
        const overdueDays = d.dueAt ? Math.max(daysBetween(d.dueAt, nowISO), 0) : 0;

        const balanceUSD = docAmountToUSD(balance, d, settings.defaultFxRate);
        return { ...d, balance, balanceUSD, overdueDays };
      })
      .filter((d) => d.status === "overdue" && d.balance > 0)
      .sort((a, b) => b.overdueDays - a.overdueDays);

    overdueDocs.forEach((d) => {
      const od = d.overdueDays;
      if (od <= 7) bucketsUSD["0-7"] += d.balanceUSD;
      else if (od <= 15) bucketsUSD["8-15"] += d.balanceUSD;
      else if (od <= 30) bucketsUSD["16-30"] += d.balanceUSD;
      else bucketsUSD["31+"] += d.balanceUSD;
    });

    return { bucketsUSD, overdueDocs };
  }, [docs, nowISO, settings.defaultFxRate]);

  // ===== Claims aseguradoras (pipeline) =====
  const insurerClaims = useMemo(() => {
    return docs
      .filter((d) => d.payerType === "insurance")
      .map((d) => {
        const total = parseNumber(d.total);
        const paid = parseNumber(d.paidTotal);
        const balance = Math.max(total - paid, 0);

        const claimStatus = d.insurance?.claimStatus || "submitted";
        const insurerName = d.insurance?.insurerName || d.payerName || "Aseguradora";

        return {
          docId: d.id,
          docNo: d.docNo,
          beneficiaryName: d.beneficiaryName,
          insurerName,
          policyNumber: d.insurance?.policyNumber || "",
          approvalKey: d.insurance?.approvalKey || "",
          issuedAt: d.issuedAt,
          dueAt: d.dueAt,
          currency: d.currency || "USD",
          total,
          paid,
          balance,
          claimStatus,
          link: d.link || null,
        };
      })
      .sort((a, b) => String(b.issuedAt).localeCompare(String(a.issuedAt)));
  }, [docs]);

  // ===== Ranking aseguradoras por tardanza (promedio días hasta pago completo) =====
  const insurerRanking = useMemo(() => {
    // Solo docs insurance que estén paid (financiero) y tengan pagos
    const paidInsuranceDocs = docs.filter((d) => d.payerType === "insurance" && d.status === "paid");

    const rows = paidInsuranceDocs
      .map((d) => {
        const pays = payments.filter((p) => p.docId === d.id).sort((a, b) => String(a.paidAt).localeCompare(String(b.paidAt)));
        const lastPay = pays[pays.length - 1];
        if (!lastPay || !d.issuedAt) return null;

        const insurerName = d.insurance?.insurerName || d.payerName || "Aseguradora";
        const daysToPay = daysBetween(d.issuedAt, lastPay.paidAt);
        return { insurerName, daysToPay: Math.max(daysToPay, 0) };
      })
      .filter(Boolean);

    const by = rows.reduce((acc, r) => {
      acc[r.insurerName] = acc[r.insurerName] || { insurerName: r.insurerName, count: 0, sumDays: 0 };
      acc[r.insurerName].count += 1;
      acc[r.insurerName].sumDays += r.daysToPay;
      return acc;
    }, {});

    const ranking = Object.values(by)
      .map((x) => ({
        insurerName: x.insurerName,
        paidDocs: x.count,
        avgDays: x.count ? x.sumDays / x.count : 0,
      }))
      .sort((a, b) => b.avgDays - a.avgDays);

    return ranking;
  }, [docs, payments]);

  function resetDemo() {
    const ok = confirm("¿Resetear demo? Esto reemplaza docs/pagos/settings.");
    if (!ok) return;
    const demo = buildDemoData();
    setDocs(demo.docs);
    setPayments(demo.payments);
    setSettings(demo.settings);
    safeSave(LS.DOCS, demo.docs);
    safeSave(LS.PAYMENTS, demo.payments);
    safeSave(LS.SETTINGS, demo.settings);
  }

  function clearFilters() {
    setQ("");
    setStatus("all");
    setPayerType("all");
    setBeneficiary("all");
    setRange("all");
    setCurrency("all");
  }

  function exportDocsCSV() {
    const rows = docRows.map((d) => ({
      docNo: d.docNo,
      beneficiaryName: d.beneficiaryName,
      beneficiaryId: d.beneficiaryId || "",
      payerType: d.payerType,
      payerName: d.payerName,
      issuedAt: d.issuedAt,
      dueAt: d.dueAt,
      currency: d.currency,
      fxRate: d.fxRate || "",
      total: d.total,
      paidTotal: d.paid,
      balance: d.balance,
      balanceUSD: d.balanceUSD,
      status: d.status,
      lastPaymentAt: d.lastPay?.paidAt || "",
      lastPaymentRef: d.lastPay?.reference || "",
      linkKind: d.link?.kind || "",
      linkRef: d.link?.ref || "",
      insurerName: d.insurance?.insurerName || "",
      policyNumber: d.insurance?.policyNumber || "",
      approvalKey: d.insurance?.approvalKey || "",
      claimStatus: d.insurance?.claimStatus || "",
      companyRif: d.company?.rif || "",
      companyCostCenter: d.company?.costCenter || "",
      companyApprovalRef: d.company?.approvalRef || "",
      notes: d.notes || "",
    }));
    const csv = toCSV(rows);
    downloadCSV(`clinic_billing_docs_${todayISO()}.csv`, csv);
  }

  function exportPaymentsCSV() {
    const rows = payments
      .slice()
      .sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))
      .map((p) => {
        const d = docs.find((x) => x.id === p.docId);
        const appliedDoc = d ? paymentToDocCurrency(p, d, settings.defaultFxRate) : 0;
        const amountUSD = toUSD(p.amount, p.currency, p.currency === "VES" ? p.fxRate : settings.defaultFxRate);

        return {
          paidAt: p.paidAt,
          amount: parseNumber(p.amount),
          currency: p.currency,
          fxRate: p.fxRate || "",
          amountUSD,
          method: p.method,
          reference: p.reference,
          docNo: d?.docNo || "",
          beneficiaryName: d?.beneficiaryName || "",
          payerType: d?.payerType || "",
          payerName: d?.payerName || "",
          appliedInDocCurrency: appliedDoc,
          docCurrency: d?.currency || "",
          notes: p.notes || "",
        };
      });
    const csv = toCSV(rows);
    downloadCSV(`clinic_billing_payments_${todayISO()}.csv`, csv);
  }

  function openPaymentForDoc(docId) {
    setSelectedDocIdForPayment(docId);
    setOpenNewPayment(true);
  }

  function openDocDetails(docId) {
    setDocViewId(docId);
    setOpenDocView(true);
  }

  function cancelDoc(docId) {
    const ok = confirm("¿Marcar este documento como cancelado? (No elimina pagos existentes.)");
    if (!ok) return;
    setDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, status: "cancelled" } : d)));
  }

  function deletePayment(payId) {
    const ok = confirm("¿Eliminar este pago? Esto recalculará saldos.");
    if (!ok) return;
    setPayments((prev) => prev.filter((p) => p.id !== payId));
  }

  function updateClaimStatus(docId, claimStatus) {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        const insurance = d.insurance || {
          insurerName: d.payerName || "Aseguradora",
          policyNumber: "",
          approvalKey: "",
          claimStatus: "submitted",
        };
        return { ...d, insurance: { ...insurance, claimStatus } };
      })
    );
  }

  const reports = useMemo(() => {
    // Todo en USD para reportes ejecutivos (dueño/contador)
    const byPayerUSD = { patient: 0, insurance: 0, company: 0 };
    const byMethodUSD = {};
    const byCurrencyRaw = { USD: 0, VES: 0 };

    payments.forEach((p) => {
      const amtUSD = toUSD(p.amount, p.currency, p.currency === "VES" ? p.fxRate : settings.defaultFxRate);
      byMethodUSD[p.method] = (byMethodUSD[p.method] || 0) + amtUSD;
      byCurrencyRaw[p.currency] = (byCurrencyRaw[p.currency] || 0) + parseNumber(p.amount);

      const doc = docs.find((d) => d.id === p.docId);
      if (doc) byPayerUSD[doc.payerType] = (byPayerUSD[doc.payerType] || 0) + amtUSD;
    });

    return { byPayerUSD, byMethodUSD, byCurrencyRaw };
  }, [docs, payments, settings.defaultFxRate]);

  // ======= Modals state =======
  const [newDoc, setNewDoc] = useState({
    docNo: "",
    beneficiaryName: "",
    beneficiaryId: "",
    payerType: "patient",
    payerName: "",
    issuedAt: todayISO(),
    dueAt: addDaysISO(todayISO(), 15),
    currency: "USD",
    fxRate: DEFAULT_SETTINGS.defaultFxRate,
    subtotal: "",
    tax: "",
    fees: "",
    notes: "",
    // vínculo pro
    linkKind: "manual",
    linkRef: "",
    // insurance
    insurerName: "",
    policyNumber: "",
    approvalKey: "",
    claimStatus: "submitted",
    // company
    companyRif: "",
    companyCostCenter: "",
    companyApprovalRef: "",
  });

  useEffect(() => {
    setNewDoc((p) => ({
      ...p,
      currency: settings.baseCurrency || "USD",
      fxRate: settings.defaultFxRate || DEFAULT_SETTINGS.defaultFxRate,
    }));
  }, [settings.baseCurrency, settings.defaultFxRate]);

  // Auto: si payerType=patient y no hay payerName, usar beneficiary
  useEffect(() => {
    if (newDoc.payerType !== "patient") return;
    if (String(newDoc.payerName || "").trim()) return;
    if (!String(newDoc.beneficiaryName || "").trim()) return;
    setNewDoc((p) => ({ ...p, payerName: p.beneficiaryName }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDoc.payerType, newDoc.beneficiaryName]);

  function computeDocTotal(draft) {
    const subtotal = parseNumber(draft.subtotal);
    const tax = parseNumber(draft.tax);
    const fees = parseNumber(draft.fees);
    return subtotal + tax + fees;
  }

  function canCreateDoc(draft) {
    if (!String(draft.beneficiaryName || "").trim()) return false;

    const total = computeDocTotal(draft);
    if (total <= 0) return false;

    if (draft.currency === "VES" && parseNumber(draft.fxRate) <= 0) return false;

    if (!String(draft.payerName || "").trim()) return false;

    if (draft.linkKind !== "manual" && !String(draft.linkRef || "").trim()) return false;

    if (draft.payerType === "insurance") {
      if (!String(draft.insurerName || "").trim()) return false;
      if (!String(draft.policyNumber || "").trim()) return false;
      if (!String(draft.approvalKey || "").trim()) return false;
    }

    if (draft.payerType === "company") {
      if (!String(draft.companyRif || "").trim()) return false;
      // costCenter y approvalRef pueden ser opcionales según convenio, pero ayudan mucho
    }

    return true;
  }

  function createDoc() {
    if (!canCreateDoc(newDoc)) {
      alert("Faltan campos obligatorios o el total es inválido.");
      return;
    }

    const total = computeDocTotal(newDoc);
    const prefix = settings.autoDocPrefix || "CX";
    const docNo =
      String(newDoc.docNo || "").trim() ||
      `${prefix}-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    const link = newDoc.linkKind === "manual" ? null : { kind: newDoc.linkKind, ref: String(newDoc.linkRef || "").trim() };

    const doc = {
      id: uid("DOC"),
      docNo,
      beneficiaryName: String(newDoc.beneficiaryName).trim(),
      beneficiaryId: String(newDoc.beneficiaryId || "").trim(),
      payerType: newDoc.payerType,
      payerName:
        newDoc.payerType === "insurance" ? String(newDoc.insurerName).trim() : String(newDoc.payerName || "").trim(),
      issuedAt: newDoc.issuedAt,
      dueAt: newDoc.dueAt,
      currency: newDoc.currency,
      fxRate: newDoc.currency === "VES" ? parseNumber(newDoc.fxRate) : 0,
      subtotal: parseNumber(newDoc.subtotal),
      tax: parseNumber(newDoc.tax),
      fees: parseNumber(newDoc.fees),
      total,
      paidTotal: 0,
      status: "issued",
      notes: String(newDoc.notes || ""),
      link,
      insurance:
        newDoc.payerType === "insurance"
          ? {
              insurerName: String(newDoc.insurerName).trim(),
              policyNumber: String(newDoc.policyNumber).trim(),
              approvalKey: String(newDoc.approvalKey).trim(),
              claimStatus: newDoc.claimStatus || "submitted",
            }
          : null,
      company:
        newDoc.payerType === "company"
          ? {
              rif: String(newDoc.companyRif || "").trim(),
              costCenter: String(newDoc.companyCostCenter || "").trim(),
              approvalRef: String(newDoc.companyApprovalRef || "").trim(),
            }
          : null,
    };

    doc.status = normalizeDocStatus(doc, todayISO());
    setDocs((prev) => [doc, ...prev]);
    setOpenNewDoc(false);

    setNewDoc((p) => ({
      ...p,
      docNo: "",
      beneficiaryName: "",
      beneficiaryId: "",
      payerType: "patient",
      payerName: "",
      issuedAt: todayISO(),
      dueAt: addDaysISO(todayISO(), 15),
      subtotal: "",
      tax: "",
      fees: "",
      notes: "",
      linkKind: "manual",
      linkRef: "",
      insurerName: "",
      policyNumber: "",
      approvalKey: "",
      claimStatus: "submitted",
      companyRif: "",
      companyCostCenter: "",
      companyApprovalRef: "",
    }));
  }

  const [payDraft, setPayDraft] = useState({
    docId: "",
    paidAt: todayISO(),
    amount: "",
    currency: "USD",
    fxRate: DEFAULT_SETTINGS.defaultFxRate,
    method: "transfer",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    setPayDraft((p) => ({
      ...p,
      currency: settings.baseCurrency || "USD",
      fxRate: settings.defaultFxRate || DEFAULT_SETTINGS.defaultFxRate,
    }));
  }, [settings.baseCurrency, settings.defaultFxRate]);

  useEffect(() => {
    if (selectedDocIdForPayment) {
      setPayDraft((p) => ({ ...p, docId: selectedDocIdForPayment }));
    }
  }, [selectedDocIdForPayment]);

  function canCreatePayment(draft) {
    if (!draft.docId) return false;
    const amt = parseNumber(draft.amount);
    if (amt <= 0) return false;
    if (draft.currency === "VES" && parseNumber(draft.fxRate) <= 0) return false;
    return true;
  }

  function createPayment() {
    if (!canCreatePayment(payDraft)) {
      alert("Pago inválido o faltan campos obligatorios.");
      return;
    }

    const doc = docs.find((d) => d.id === payDraft.docId);
    if (!doc) {
      alert("Documento no encontrado.");
      return;
    }

    const total = parseNumber(doc.total);
    const paid = parseNumber(doc.paidTotal);
    const balanceDoc = Math.max(total - paid, 0);

    const payAmt = parseNumber(payDraft.amount);

    // Convertimos el pago a moneda del documento para compararlo con el saldo
    const simulatedPayment = {
      amount: payAmt,
      currency: payDraft.currency,
      fxRate: payDraft.currency === "VES" ? parseNumber(payDraft.fxRate) : 0,
    };
    const appliedInDocCurrency = paymentToDocCurrency(simulatedPayment, doc, settings.defaultFxRate);

    if (appliedInDocCurrency > balanceDoc + 0.00001) {
      const ok = confirm(
        `El pago aplicado (${fmtMoney(appliedInDocCurrency, doc.currency)}) excede el saldo del documento (${fmtMoney(
          balanceDoc,
          doc.currency
        )}). ¿Continuar?`
      );
      if (!ok) return;
    }

    const payment = {
      id: uid("PAY"),
      docId: payDraft.docId,
      paidAt: payDraft.paidAt,
      amount: payAmt,
      currency: payDraft.currency,
      fxRate: payDraft.currency === "VES" ? parseNumber(payDraft.fxRate) : 0,
      method: payDraft.method,
      reference: String(payDraft.reference || "").trim(),
      notes: String(payDraft.notes || ""),
    };

    setPayments((prev) => [payment, ...prev]);
    setOpenNewPayment(false);
    setSelectedDocIdForPayment(null);

    setPayDraft((p) => ({
      ...p,
      docId: "",
      paidAt: todayISO(),
      amount: "",
      method: "transfer",
      reference: "",
      notes: "",
    }));
  }

  const docForView = useMemo(() => docs.find((d) => d.id === docViewId) || null, [docs, docViewId]);

  const paymentsForView = useMemo(
    () =>
      docViewId
        ? payments.filter((p) => p.docId === docViewId).sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))
        : [],
    [payments, docViewId]
  );

  const docOptionsForPay = useMemo(() => {
    return [
      { value: "", label: "Selecciona un documento" },
      ...docs
        .filter((d) => !["paid", "cancelled", "draft"].includes(d.status))
        .map((d) => ({ value: d.id, label: `${d.docNo} — ${d.beneficiaryName}` })),
    ];
  }, [docs]);

  // ===== UI =====
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Finanzas (Clínica)</h2>
          <p className="text-sm text-gray-600 mt-1">
            CxC, pagos, aseguradoras, reportes y análisis (demo). Moneda referencial: <b>USD</b>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <PrimaryButton onClick={() => setOpenNewDoc(true)}>+ Nuevo documento</PrimaryButton>
          <GhostButton
            onClick={() => {
              setSelectedDocIdForPayment(null);
              setOpenNewPayment(true);
            }}
          >
            + Registrar pago
          </GhostButton>
          <GhostButton onClick={() => setOpenSettings(true)}>Settings</GhostButton>
          <GhostButton onClick={() => (activeTab === "payments" ? exportPaymentsCSV() : exportDocsCSV())}>Exportar CSV</GhostButton>
          <DangerButton onClick={resetDemo}>Reset demo</DangerButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "ar", label: "Cuentas por Cobrar (CxC)" },
          { key: "payments", label: "Pagos" },
          { key: "insurers", label: "Aseguradoras" },
          { key: "reports", label: "Reportes" },
          { key: "analysis", label: "Análisis Financiero" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm border ${
              activeTab === t.key ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50 text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* KPIs (USD) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-xs text-gray-500">Cobrado hoy (USD)</div>
          <div className="text-lg font-semibold text-gray-900">{fmtMoney(kpis.collectedTodayUSD, "USD")}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-xs text-gray-500">Cuentas por cobrar (USD)</div>
          <div className="text-lg font-semibold text-gray-900">{fmtMoney(kpis.receivablesUSD, "USD")}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-xs text-gray-500">Vencido (USD)</div>
          <div className="text-lg font-semibold text-gray-900">{fmtMoney(kpis.overdueUSD, "USD")}</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-xs text-gray-500">Pendiente aseguradoras (USD)</div>
          <div className="text-lg font-semibold text-gray-900">{fmtMoney(kpis.insurerPendingUSD, "USD")}</div>
        </div>
      </div>

      {/* Filters (only AR) */}
      {activeTab === "ar" && (
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Field label="Búsqueda">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Doc / beneficiario / pagador / ref..." />
            </Field>

            <Field label="Estado">
              <Select value={status} onChange={setStatus} options={DOC_STATUS} />
            </Field>

            <Field label="Tipo de pagador">
              <Select value={payerType} onChange={setPayerType} options={[{ value: "all", label: "Todos" }, ...PAYER_TYPES]} />
            </Field>

            <Field label="Beneficiario">
              <Select value={beneficiary} onChange={setBeneficiary} options={beneficiariesList} />
            </Field>

            <Field label="Rango de fechas">
              <Select value={range} onChange={setRange} options={DATE_RANGES} />
            </Field>

            <Field label="Moneda del documento">
              <Select value={currency} onChange={setCurrency} options={[{ value: "all", label: "Todas" }, ...CURRENCIES]} />
            </Field>
          </div>

          <div className="flex justify-end gap-2">
            <GhostButton onClick={clearFilters}>Limpiar</GhostButton>
          </div>
        </div>
      )}

      {/* CxC */}
      {activeTab === "ar" && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando <b>{docRows.length}</b> documentos
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-[1250px] w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Documento / Beneficiario</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3">Pagador</th>
                  <th className="px-4 py-3">Emitida / Vence</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pagado</th>
                  <th className="px-4 py-3">Saldo</th>
                  <th className="px-4 py-3">Saldo (USD)</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Último pago</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {docRows.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{d.docNo}</div>
                      <div className="text-gray-600">
                        {d.beneficiaryName}
                        {d.beneficiaryId ? <span className="text-xs text-gray-400"> · {d.beneficiaryId}</span> : null}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {d.link?.kind ? (
                        <div>
                          <div className="text-gray-900">{formatLinkKind(d.link.kind)}</div>
                          <div className="text-xs text-gray-500">{d.link.ref || "—"}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-900">Manual</div>
                          <div className="text-xs text-gray-500">—</div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-900">{d.payerName}</div>
                      <div className="text-xs text-gray-500">{formatPayerLabel(d.payerType)}</div>

                      {d.payerType === "insurance" && d.insurance?.policyNumber && (
                        <div className="text-xs text-gray-500 mt-1">Póliza: {d.insurance.policyNumber}</div>
                      )}

                      {d.payerType === "company" && d.company?.rif && (
                        <div className="text-xs text-gray-500 mt-1">RIF: {d.company.rif}</div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-900">Emitida: {d.issuedAt}</div>
                      <div className={`text-gray-700 ${d.status === "overdue" ? "text-red-700 font-medium" : ""}`}>
                        Vence: {d.dueAt || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">{fmtMoney(d.total, d.currency)}</td>
                    <td className="px-4 py-3">{fmtMoney(d.paid, d.currency)}</td>
                    <td className="px-4 py-3">{fmtMoney(d.balance, d.currency)}</td>
                    <td className="px-4 py-3">{fmtMoney(d.balanceUSD, "USD")}</td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs border rounded-full ${badgeClass(d.status)}`}>
                        {DOC_STATUS.find((s) => s.value === d.status)?.label || d.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {d.lastPay ? (
                        <>
                          <div>{d.lastPay.paidAt}</div>
                          <div className="text-xs text-gray-500">{d.lastPay.reference || formatMethodLabel(d.lastPay.method)}</div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs"
                          onClick={() => openDocDetails(d.id)}
                        >
                          Ver
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs disabled:bg-green-300"
                          onClick={() => openPaymentForDoc(d.id)}
                          disabled={d.status === "paid" || d.status === "cancelled" || d.status === "draft"}
                        >
                          Registrar pago
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs disabled:text-red-300"
                          onClick={() => cancelDoc(d.id)}
                          disabled={d.status === "cancelled"}
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!docRows.length && (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center text-gray-500">
                      No hay documentos que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagos */}
      {activeTab === "payments" && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Pagos registrados: <b>{payments.length}</b>
            </div>
            <div className="flex gap-2">
              <GhostButton onClick={exportPaymentsCSV}>Exportar CSV</GhostButton>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Monto (USD)</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Referencia</th>
                  <th className="px-4 py-3">Documento</th>
                  <th className="px-4 py-3">Beneficiario</th>
                  <th className="px-4 py-3">Pagador</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments
                  .slice()
                  .sort((a, b) => String(b.paidAt).localeCompare(String(a.paidAt)))
                  .map((p) => {
                    const d = docs.find((x) => x.id === p.docId);
                    const amtUSD = toUSD(p.amount, p.currency, p.currency === "VES" ? p.fxRate : settings.defaultFxRate);
                    return (
                      <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{p.paidAt}</td>
                        <td className="px-4 py-3">{fmtMoney(p.amount, p.currency)}</td>
                        <td className="px-4 py-3">{fmtMoney(amtUSD, "USD")}</td>
                        <td className="px-4 py-3">{formatMethodLabel(p.method)}</td>
                        <td className="px-4 py-3">{p.reference || "—"}</td>
                        <td className="px-4 py-3">{d?.docNo || "—"}</td>
                        <td className="px-4 py-3">{d?.beneficiaryName || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900">{d?.payerName || "—"}</div>
                          <div className="text-xs text-gray-500">{d ? formatPayerLabel(d.payerType) : ""}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs"
                            onClick={() => deletePayment(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                {!payments.length && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                      Aún no hay pagos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aseguradoras */}
      {activeTab === "insurers" && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-900">Pipeline de aseguradoras</div>
            <div className="text-xs text-gray-600 mt-1">
              Documentos con pagador “Aseguradora”. Aquí viven póliza/clave y estatus del claim (separado del estatus financiero).
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-[1250px] w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3">Documento</th>
                  <th className="px-4 py-3">Origen</th>
                  <th className="px-4 py-3">Beneficiario</th>
                  <th className="px-4 py-3">Aseguradora</th>
                  <th className="px-4 py-3">Póliza / Clave</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Saldo</th>
                  <th className="px-4 py-3">Claim</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {insurerClaims.map((c) => (
                  <tr key={c.docId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{c.docNo}</td>
                    <td className="px-4 py-3">
                      {c.link?.kind ? (
                        <div>
                          <div className="text-gray-900">{formatLinkKind(c.link.kind)}</div>
                          <div className="text-xs text-gray-500">{c.link.ref || "—"}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Manual</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{c.beneficiaryName}</td>
                    <td className="px-4 py-3">{c.insurerName}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{c.policyNumber || "—"}</div>
                      <div className="text-xs text-gray-500">Clave: {c.approvalKey || "—"}</div>
                    </td>
                    <td className="px-4 py-3">{fmtMoney(c.total, c.currency)}</td>
                    <td className="px-4 py-3">{fmtMoney(c.balance, c.currency)}</td>
                    <td className="px-4 py-3">
                      <Select value={c.claimStatus} onChange={(v) => updateClaimStatus(c.docId, v)} options={CLAIM_STATUS} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <GhostButton onClick={() => openDocDetails(c.docId)}>Ver</GhostButton>
                    </td>
                  </tr>
                ))}

                {!insurerClaims.length && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                      No hay documentos de aseguradora aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reportes */}
      {activeTab === "reports" && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-gray-900">Reportes (ejecutivo)</div>
              <div className="text-xs text-gray-600 mt-1">Totales normalizados a USD (útil para contador/dueño).</div>
            </div>
            <div className="flex gap-2">
              <GhostButton onClick={exportDocsCSV}>Export Docs</GhostButton>
              <GhostButton onClick={exportPaymentsCSV}>Export Pagos</GhostButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Cobrado (USD) por tipo de pagador</div>
              <div className="mt-2 space-y-1 text-sm">
                {Object.entries(reports.byPayerUSD).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-700">{formatPayerLabel(k)}</span>
                    <span className="font-medium text-gray-900">{fmtMoney(v, "USD")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Cobrado (USD) por método</div>
              <div className="mt-2 space-y-1 text-sm">
                {Object.entries(reports.byMethodUSD).length ? (
                  Object.entries(reports.byMethodUSD).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-700">{formatMethodLabel(k)}</span>
                      <span className="font-medium text-gray-900">{fmtMoney(v, "USD")}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">Sin pagos aún.</div>
                )}
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Cobrado por moneda (raw)</div>
              <div className="mt-2 space-y-1 text-sm">
                {Object.entries(reports.byCurrencyRaw).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-700">{k}</span>
                    <span className="font-medium text-gray-900">{fmtMoney(v, k)}</span>
                  </div>
                ))}
              </div>
              <div className="text-[11px] text-gray-400 mt-2">
                Nota: “raw” muestra montos sin conversión. Los agregados ejecutivos arriba están en USD.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análisis */}
      {activeTab === "analysis" && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-900">Análisis Financiero</div>
            <div className="text-xs text-gray-600 mt-1">Aging en USD + vencidos + ranking de aseguradoras (tardanza).</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {Object.entries(aging.bucketsUSD).map(([k, v]) => (
              <div key={k} className="border rounded-lg p-3">
                <div className="text-xs text-gray-500">Vencido {k} días (USD)</div>
                <div className="text-lg font-semibold text-gray-900">{fmtMoney(v, "USD")}</div>
              </div>
            ))}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b text-sm text-gray-700">
              Documentos vencidos: <b>{aging.overdueDocs.length}</b>
            </div>
            <div className="overflow-auto">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3">Doc</th>
                    <th className="px-4 py-3">Beneficiario</th>
                    <th className="px-4 py-3">Pagador</th>
                    <th className="px-4 py-3">Vence</th>
                    <th className="px-4 py-3">Días vencido</th>
                    <th className="px-4 py-3">Saldo (doc)</th>
                    <th className="px-4 py-3">Saldo (USD)</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {aging.overdueDocs.map((d) => (
                    <tr key={d.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.docNo}</td>
                      <td className="px-4 py-3">{d.beneficiaryName}</td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{d.payerName}</div>
                        <div className="text-xs text-gray-500">{formatPayerLabel(d.payerType)}</div>
                      </td>
                      <td className="px-4 py-3">{d.dueAt || "-"}</td>
                      <td className="px-4 py-3">{d.overdueDays}</td>
                      <td className="px-4 py-3">{fmtMoney(d.balance, d.currency)}</td>
                      <td className="px-4 py-3">{fmtMoney(d.balanceUSD, "USD")}</td>
                      <td className="px-4 py-3 text-right">
                        <GhostButton onClick={() => openDocDetails(d.id)}>Ver</GhostButton>
                      </td>
                    </tr>
                  ))}
                  {!aging.overdueDocs.length && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                        No hay vencidos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b text-sm text-gray-700">
              Ranking Aseguradoras (tardanza): <b>{insurerRanking.length}</b>
            </div>
            <div className="overflow-auto">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3">Aseguradora</th>
                    <th className="px-4 py-3">Docs pagados</th>
                    <th className="px-4 py-3">Promedio días a pago completo</th>
                  </tr>
                </thead>
                <tbody>
                  {insurerRanking.map((r) => (
                    <tr key={r.insurerName} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.insurerName}</td>
                      <td className="px-4 py-3">{r.paidDocs}</td>
                      <td className="px-4 py-3">{Math.round(r.avgDays)} días</td>
                    </tr>
                  ))}
                  {!insurerRanking.length && (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                        No hay suficientes pagos de aseguradoras para rankear (necesitas docs insurance en estado “Pagado”).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-[11px] text-gray-400">
            Siguiente nivel (cuando Rafael lo pida): DSO por pagador, tasa de recuperación, y SLA por convenio (aseguradoras/empresas).
          </div>
        </div>
      )}

      {/* ====== MODALS ====== */}
      {openSettings && (
        <Modal title="Settings (demo)" onClose={() => setOpenSettings(false)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Moneda referencial">
              <Select
                value={settings.baseCurrency}
                onChange={(v) => setSettings((p) => ({ ...p, baseCurrency: v }))}
                options={[{ value: "USD", label: "USD (recomendado)" }]}
                disabled
              />
            </Field>

            <Field label="Tasa FX default (USD→VES)" hint="Ej: 38.5 significa 1 USD = 38.5 Bs.">
              <Input
                value={String(settings.defaultFxRate)}
                onChange={(e) => setSettings((p) => ({ ...p, defaultFxRate: parseNumber(e.target.value) || 0 }))}
                placeholder="38.5"
              />
            </Field>

            <Field label="Prefijo auto DocNo" hint="Ej: CX / INV / REC">
              <Input
                value={settings.autoDocPrefix}
                onChange={(e) => setSettings((p) => ({ ...p, autoDocPrefix: e.target.value }))}
                placeholder="CX"
              />
            </Field>
          </div>

          <div className="flex justify-end mt-4">
            <PrimaryButton onClick={() => setOpenSettings(false)}>Guardar</PrimaryButton>
          </div>
        </Modal>
      )}

      {openNewDoc && (
        <Modal title="Nuevo documento (CxC)" onClose={() => setOpenNewDoc(false)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Doc No (opcional)">
              <Input value={newDoc.docNo} onChange={(e) => setNewDoc((p) => ({ ...p, docNo: e.target.value }))} placeholder="CX-2026-0001" />
            </Field>

            <Field label="Beneficiario (obligatorio)" hint="Paciente / empleado que recibe el servicio">
              <Input
                value={newDoc.beneficiaryName}
                onChange={(e) => setNewDoc((p) => ({ ...p, beneficiaryName: e.target.value }))}
                placeholder="Ej: Juan Pérez / María G."
              />
            </Field>

            <Field label="ID Beneficiario (opcional)" hint="Cédula o ID interno">
              <Input value={newDoc.beneficiaryId} onChange={(e) => setNewDoc((p) => ({ ...p, beneficiaryId: e.target.value }))} placeholder="V-12345678" />
            </Field>

            <Field label="Tipo de pagador">
              <Select value={newDoc.payerType} onChange={(v) => setNewDoc((p) => ({ ...p, payerType: v }))} options={PAYER_TYPES} />
            </Field>

            <Field label="Pagador (obligatorio)" hint="Quién paga: paciente / empresa / aseguradora">
              <Input
                value={newDoc.payerName}
                onChange={(e) => setNewDoc((p) => ({ ...p, payerName: e.target.value }))}
                placeholder="Ej: Juan Pérez / Empresa XYZ / Seguros Miranda"
              />
            </Field>

            <Field label="Emitida">
              <Input type="date" value={newDoc.issuedAt} onChange={(e) => setNewDoc((p) => ({ ...p, issuedAt: e.target.value }))} />
            </Field>

            <Field label="Vence">
              <Input type="date" value={newDoc.dueAt} onChange={(e) => setNewDoc((p) => ({ ...p, dueAt: e.target.value }))} />
            </Field>

            <Field label="Moneda del documento">
              <Select value={newDoc.currency} onChange={(v) => setNewDoc((p) => ({ ...p, currency: v }))} options={CURRENCIES} />
            </Field>

            <Field label="FX (solo si VES)" hint="USD→VES. Requerido si documento está en Bs.">
              <Input
                value={String(newDoc.fxRate)}
                onChange={(e) => setNewDoc((p) => ({ ...p, fxRate: e.target.value }))}
                placeholder="38.5"
                disabled={newDoc.currency !== "VES"}
              />
            </Field>

            <Field label="Origen (vínculo pro)">
              <Select value={newDoc.linkKind} onChange={(v) => setNewDoc((p) => ({ ...p, linkKind: v }))} options={LINK_KINDS} />
            </Field>

            <Field label="Ref Origen" hint="Requerido si el origen no es Manual">
              <Input
                value={newDoc.linkRef}
                onChange={(e) => setNewDoc((p) => ({ ...p, linkRef: e.target.value }))}
                placeholder="APT-001 / ORD-001 / AUTH-001"
                disabled={newDoc.linkKind === "manual"}
              />
            </Field>

            <Field label="Subtotal">
              <Input value={newDoc.subtotal} onChange={(e) => setNewDoc((p) => ({ ...p, subtotal: e.target.value }))} placeholder="0.00" />
            </Field>

            <Field label="Impuesto">
              <Input value={newDoc.tax} onChange={(e) => setNewDoc((p) => ({ ...p, tax: e.target.value }))} placeholder="0.00" />
            </Field>

            <Field label="Fees / Comisiones">
              <Input value={newDoc.fees} onChange={(e) => setNewDoc((p) => ({ ...p, fees: e.target.value }))} placeholder="0.00" />
            </Field>

            {newDoc.payerType === "insurance" && (
              <div className="md:col-span-3 border rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900">Datos de Aseguradora</div>
                <div className="text-xs text-gray-600 mt-1">Campos obligatorios para documento de seguro.</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <Field label="Aseguradora (nombre)">
                    <Input value={newDoc.insurerName} onChange={(e) => setNewDoc((p) => ({ ...p, insurerName: e.target.value }))} placeholder="Seguros X" />
                  </Field>
                  <Field label="N° Póliza">
                    <Input value={newDoc.policyNumber} onChange={(e) => setNewDoc((p) => ({ ...p, policyNumber: e.target.value }))} placeholder="POL-000" />
                  </Field>
                  <Field label="Clave / Aprobación">
                    <Input value={newDoc.approvalKey} onChange={(e) => setNewDoc((p) => ({ ...p, approvalKey: e.target.value }))} placeholder="APR-000" />
                  </Field>
                  <Field label="Estatus Claim">
                    <Select value={newDoc.claimStatus} onChange={(v) => setNewDoc((p) => ({ ...p, claimStatus: v }))} options={CLAIM_STATUS} />
                  </Field>
                </div>
              </div>
            )}

            {newDoc.payerType === "company" && (
              <div className="md:col-span-3 border rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900">Datos de Empresa (salud ocupacional)</div>
                <div className="text-xs text-gray-600 mt-1">Mínimo viable para que contabilidad lo entienda sin ambigüedad.</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <Field label="RIF (obligatorio)">
                    <Input value={newDoc.companyRif} onChange={(e) => setNewDoc((p) => ({ ...p, companyRif: e.target.value }))} placeholder="J-12345678-9" />
                  </Field>
                  <Field label="Centro de costo (opcional)">
                    <Input value={newDoc.companyCostCenter} onChange={(e) => setNewDoc((p) => ({ ...p, companyCostCenter: e.target.value }))} placeholder="RRHH / Operaciones..." />
                  </Field>
                  <Field label="Referencia autorización (opcional)">
                    <Input value={newDoc.companyApprovalRef} onChange={(e) => setNewDoc((p) => ({ ...p, companyApprovalRef: e.target.value }))} placeholder="EMP-APR-0001" />
                  </Field>
                </div>
              </div>
            )}

            <div className="md:col-span-3">
              <Field label="Notas">
                <Textarea value={newDoc.notes} onChange={(e) => setNewDoc((p) => ({ ...p, notes: e.target.value }))} placeholder="Detalle interno" rows={3} />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-700">
              Total: <b>{fmtMoney(computeDocTotal(newDoc), newDoc.currency)}</b>
            </div>
            <div className="flex gap-2">
              <GhostButton onClick={() => setOpenNewDoc(false)}>Cancelar</GhostButton>
              <PrimaryButton onClick={createDoc} disabled={!canCreateDoc(newDoc)}>
                Crear documento
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {openNewPayment && (
        <Modal title="Registrar pago" onClose={() => setOpenNewPayment(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Documento">
              <Select value={payDraft.docId} onChange={(v) => setPayDraft((p) => ({ ...p, docId: v }))} options={docOptionsForPay} />
            </Field>

            <Field label="Fecha">
              <Input type="date" value={payDraft.paidAt} onChange={(e) => setPayDraft((p) => ({ ...p, paidAt: e.target.value }))} />
            </Field>

            <Field label="Moneda del pago">
              <Select value={payDraft.currency} onChange={(v) => setPayDraft((p) => ({ ...p, currency: v }))} options={CURRENCIES} />
            </Field>

            <Field label="FX (solo VES)" hint="USD→VES. Requerido si el pago está en Bs.">
              <Input value={String(payDraft.fxRate)} onChange={(e) => setPayDraft((p) => ({ ...p, fxRate: e.target.value }))} disabled={payDraft.currency !== "VES"} />
            </Field>

            <Field label="Método">
              <Select value={payDraft.method} onChange={(v) => setPayDraft((p) => ({ ...p, method: v }))} options={PAYMENT_METHODS} />
            </Field>

            <Field label="Monto">
              <Input value={payDraft.amount} onChange={(e) => setPayDraft((p) => ({ ...p, amount: e.target.value }))} placeholder="0.00" />
            </Field>

            <Field label="Referencia">
              <Input value={payDraft.reference} onChange={(e) => setPayDraft((p) => ({ ...p, reference: e.target.value }))} placeholder="TRX / POS / ZELLE..." />
            </Field>

            <Field label="Notas">
              <Input value={payDraft.notes} onChange={(e) => setPayDraft((p) => ({ ...p, notes: e.target.value }))} placeholder="Opcional" />
            </Field>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <GhostButton onClick={() => setOpenNewPayment(false)}>Cancelar</GhostButton>
            <PrimaryButton onClick={createPayment} disabled={!canCreatePayment(payDraft)}>
              Guardar pago
            </PrimaryButton>
          </div>

          <div className="text-[11px] text-gray-400 mt-3">Nota: este pago luego se concilia con banca (backend).</div>
        </Modal>
      )}

      {openDocView && docForView && (
        <Modal title={`Detalle: ${docForView.docNo}`} onClose={() => setOpenDocView(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Beneficiario</div>
              <div className="text-sm font-medium text-gray-900">{docForView.beneficiaryName}</div>
              {docForView.beneficiaryId ? <div className="text-xs text-gray-500 mt-1">ID: {docForView.beneficiaryId}</div> : null}
              <div className="text-xs text-gray-500 mt-2">
                Pagador: <b>{docForView.payerName}</b> ({formatPayerLabel(docForView.payerType)})
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Fechas</div>
              <div className="text-sm text-gray-900">
                Emitida: <b>{docForView.issuedAt}</b>
              </div>
              <div className="text-sm text-gray-900">
                Vence: <b className={docForView.status === "overdue" ? "text-red-700" : ""}>{docForView.dueAt || "-"}</b>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Montos</div>
              <div className="text-sm text-gray-900">
                Total: <b>{fmtMoney(docForView.total, docForView.currency)}</b>
              </div>
              <div className="text-sm text-gray-900">
                Pagado: <b>{fmtMoney(docForView.paidTotal, docForView.currency)}</b> · Saldo:{" "}
                <b>{fmtMoney(Math.max(parseNumber(docForView.total) - parseNumber(docForView.paidTotal), 0), docForView.currency)}</b>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Saldo (USD):{" "}
                <b>
                  {fmtMoney(
                    docAmountToUSD(Math.max(parseNumber(docForView.total) - parseNumber(docForView.paidTotal), 0), docForView, settings.defaultFxRate),
                    "USD"
                  )}
                </b>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Origen</div>
              {docForView.link?.kind ? (
                <div className="text-sm text-gray-900">
                  <div>
                    Tipo: <b>{formatLinkKind(docForView.link.kind)}</b>
                  </div>
                  <div>
                    Ref: <b>{docForView.link.ref || "—"}</b>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">Manual</div>
              )}
            </div>

            {docForView.payerType === "insurance" && (
              <div className="md:col-span-2 border rounded-lg p-3">
                <div className="text-xs text-gray-500">Aseguradora</div>
                <div className="text-sm text-gray-900">{docForView.insurance?.insurerName || docForView.payerName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Póliza: {docForView.insurance?.policyNumber || "—"} · Clave: {docForView.insurance?.approvalKey || "—"}
                </div>
                <div className="mt-2">
                  <Field label="Estatus claim">
                    <Select value={docForView.insurance?.claimStatus || "submitted"} onChange={(v) => updateClaimStatus(docForView.id, v)} options={CLAIM_STATUS} />
                  </Field>
                </div>
              </div>
            )}

            {docForView.payerType === "company" && (
              <div className="md:col-span-2 border rounded-lg p-3">
                <div className="text-xs text-gray-500">Empresa</div>
                <div className="text-sm text-gray-900">
                  {docForView.payerName} {docForView.company?.rif ? <span className="text-xs text-gray-500">· RIF {docForView.company.rif}</span> : null}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Centro de costo: {docForView.company?.costCenter || "—"} · Autorización: {docForView.company?.approvalRef || "—"}
                </div>
              </div>
            )}

            <div className="md:col-span-2 border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b text-sm text-gray-700">
                Pagos asociados: <b>{paymentsForView.length}</b>
              </div>
              <div className="overflow-auto">
                <table className="min-w-[820px] w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-gray-600">
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Monto (USD)</th>
                      <th className="px-4 py-3">Aplicado al doc</th>
                      <th className="px-4 py-3">Método</th>
                      <th className="px-4 py-3">Referencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsForView.map((p) => {
                      const amtUSD = toUSD(p.amount, p.currency, p.currency === "VES" ? p.fxRate : settings.defaultFxRate);
                      const applied = paymentToDocCurrency(p, docForView, settings.defaultFxRate);
                      return (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{p.paidAt}</td>
                          <td className="px-4 py-3">{fmtMoney(p.amount, p.currency)}</td>
                          <td className="px-4 py-3">{fmtMoney(amtUSD, "USD")}</td>
                          <td className="px-4 py-3">{fmtMoney(applied, docForView.currency)}</td>
                          <td className="px-4 py-3">{formatMethodLabel(p.method)}</td>
                          <td className="px-4 py-3">{p.reference || "—"}</td>
                        </tr>
                      );
                    })}
                    {!paymentsForView.length && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                          No hay pagos asociados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 flex justify-end">
                <PrimaryButton onClick={() => openPaymentForDoc(docForView.id)}>Registrar pago</PrimaryButton>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Notas</div>
              <div className="text-sm text-gray-800">{docForView.notes || "—"}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
