import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Icon from "@/components/AppIcon";
import { getBusinessContext, getMockProviderOrders } from "@/utils/mockData";

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
  return d.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
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

// ==========================
// Constantes de Opciones
// ==========================
const STATUS_OPTIONS = [
  { label: "Todos los estados", value: "all" },
  { label: "Pendiente", value: "pending" },
  { label: "Parcial", value: "partial" },
  { label: "Pagado", value: "paid" },
  { label: "Vencido", value: "overdue" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Todos los períodos", value: "all" },
  { label: "Hoy", value: "today" },
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

const PAYER_TYPE_OPTIONS = [
  { label: "Paciente", value: "patient" },
  { label: "Aseguradora", value: "insurance" },
  { label: "Empresa", value: "company" },
];

// ==========================
// Helpers de Lógica de Negocio
// ==========================
const calculateEstimatedTaxes = (amount, businessType) => {
  const bType = (businessType || "").toLowerCase();
  let rate = 0.0;
  if (bType.includes("farmacia") || bType.includes("laboratorio")) rate = 0.08;
  else if (bType.includes("óptica") || bType.includes("optica")) rate = 0.12;
  else if (bType) rate = 0.16;

  const iva = Math.round((Number(amount) || 0) * rate * 100) / 100;
  const total = Math.round((Number(amount) || 0) * (1 + rate) * 100) / 100;
  return { rate, iva, total };
};

const calculatePlatformFee = (amount, businessType) => {
  const bType = (businessType || "").toLowerCase();
  let rate = 0.03;
  if (bType.includes("farmacia")) rate = 0.025;
  else if (bType.includes("laboratorio")) rate = 0.035;

  const fee = Math.round((Number(amount) || 0) * rate * 100) / 100;
  return { rate, amount: fee };
};

const mapPaymentStatus = (orderPaymentStatus) => {
  switch (orderPaymentStatus) {
    case "pending": return "pending";
    case "approved": return "partial";
    case "paid": return "paid";
    default: return "pending";
  }
};

// ==========================
// KPIs Cobranza
// ==========================
const calcAR = (records = []) =>
  records
    .filter((r) => r?.paymentStatus !== "paid")
    .reduce((acc, r) => acc + (Number(r?.amount) || 0), 0);

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
      const amt = Number(r?.amount) || 0;
      if (!due) { buckets["0-30"] += amt; return; }
      const daysPastDue = Math.max(0, daysBetween(due, today));
      if (daysPastDue <= 30) buckets["0-30"] += amt;
      else if (daysPastDue <= 60) buckets["31-60"] += amt;
      else if (daysPastDue <= 90) buckets["61-90"] += amt;
      else buckets["90+"] += amt;
    });
  return buckets;
};

const rankInsurers = (records = []) => {
  const map = new Map();
  records
    .filter(
      (r) =>
        r?.paymentStatus === "paid" &&
        r?.lastPaymentDate &&
        (r?.payerType === "insurance" || r?.payerType === "aseguradora") &&
        r?.payerName
    )
    .forEach((r) => {
      const key = r.payerName;
      const days = daysBetween(r?.issueDate, r?.lastPaymentDate);
      const prev = map.get(key) || { totalDays: 0, count: 0 };
      map.set(key, { totalDays: prev.totalDays + days, count: prev.count + 1 });
    });

  return Array.from(map.entries())
    .map(([payerName, v]) => ({
      payerName,
      avgDays: v.count ? Math.round(v.totalDays / v.count) : 0,
      count: v.count,
    }))
    .sort((a, b) => b.avgDays - a.avgDays);
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
// Componente Principal
// ==========================
const ProviderBillingManagement = () => {
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

  // New Sale Manual Entry State
  const [newSaleCustomer, setNewSaleCustomer] = useState("");
  const [newSaleAmount, setNewSaleAmount] = useState("");
  const [newSaleDate, setNewSaleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newSalePayerType, setNewSalePayerType] = useState("patient");
  const [newSaleNotes, setNewSaleNotes] = useState("");
  
  // -- NUEVO: Campos específicos para Clínicas (Seguros) --
  const [newSalePolicy, setNewSalePolicy] = useState("");
  const [newSaleApprovalKey, setNewSaleApprovalKey] = useState("");

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));

  // -- NUEVO: Campos específicos para Proveedores (Retenciones) --
  const [hasRetention, setHasRetention] = useState(false);
  const [retentionAmount, setRetentionAmount] = useState("");

  // --- INIT DATA CON LOCALSTORAGE ---
  const [salesRecords, setSalesRecords] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("healtng_sales_v1");
      if (saved) return JSON.parse(saved);
    }
    const businessContext = getBusinessContext();
    const orders = getMockProviderOrders(businessContext?.businessType || "");
    const transformed = orders?.map((order) => {
        const issueDate = order?.orderDate;
        const amount = Number(order?.totalAmount) || 0;
        const estimatedTaxes = calculateEstimatedTaxes(amount, businessContext?.businessType);
        const platformFee = calculatePlatformFee(amount, businessContext?.businessType);
        const num = `RV-${String(order?.id || "").replace("PO-", "") || Math.floor(Math.random() * 99999)}`;

        return {
          id: num,
          recordNumber: num,
          orderId: order?.id || "-",
          customer: order?.customer,
          issueDate,
          dueDate: new Date(new Date(issueDate)?.getTime() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
          amount,
          currency: "USD",
          amountVES: Math.round(amount * 36.5),
          paymentStatus: mapPaymentStatus(order?.paymentStatus),
          paymentMethod: order?.paymentMethod || "transfer",
          notes: order?.notes || "",
          products: order?.products || [],
          estimatedTaxes,
          platformFee,
          payerType: order?.payerType || "patient",
          payerName: order?.payerName || order?.customer?.name || "Paciente",
          sentAt: null,
          lastPaymentDate: order?.paymentStatus === "paid"
              ? new Date(new Date(issueDate)?.getTime() + 5 * 24 * 60 * 60 * 1000)?.toISOString()
              : null,
          // Nuevos campos inicializados vacíos en mocks
          policyNumber: "",
          approvalKey: "",
        };
      }) || [];
      return transformed;
  });

  const [paymentsLedger, setPaymentsLedger] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("healtng_payments_v1");
      if (saved) return JSON.parse(saved);
    }
    return []; 
  });

  useEffect(() => {
      const isMockInit = !localStorage.getItem("healtng_payments_v1") && paymentsLedger.length === 0;
      if (isMockInit && salesRecords.length > 0) {
        const seededPayments = salesRecords
          .filter((r) => r?.paymentStatus === "paid" && r?.lastPaymentDate)
          .map((r) => ({
            id: `PAY-${r.id}`,
            recordId: r.id,
            recordNumber: r.recordNumber,
            payerName: r.payerName,
            payerType: r.payerType,
            amount: r.amount,
            currency: r.currency,
            method: r.paymentMethod || "transfer",
            paidAt: r.lastPaymentDate,
            notes: "Pago registrado (mock inicial)",
            retentionAmount: 0 // Init con 0
          }));
        setPaymentsLedger(seededPayments);
      }
  }, []);

  // --- PERSISTENCIA AUTOMÁTICA ---
  useEffect(() => { localStorage.setItem("healtng_sales_v1", JSON.stringify(salesRecords)); }, [salesRecords]);
  useEffect(() => { localStorage.setItem("healtng_payments_v1", JSON.stringify(paymentsLedger)); }, [paymentsLedger]);

  // Handler seguro
  const handleSelectChange = (setter) => (e) => { const val = e?.target ? e.target.value : e; setter(val); };
  
  // Helpers Context
  const businessContext = useMemo(() => getBusinessContext(), []);

  // ==========================
  // Filters Logic
  // ==========================
  const matchesDateRange = (record) => {
    if (dateRange === "all") return true;
    const issued = safeDate(record?.issueDate);
    if (!issued) return true;
    const now = new Date();
    const start = new Date(now);
    if (dateRange === "today") start.setDate(now.getDate());
    else if (dateRange === "week") start.setDate(now.getDate() - 7);
    else if (dateRange === "month") start.setMonth(now.getMonth() - 1);
    else if (dateRange === "quarter") start.setMonth(now.getMonth() - 3);
    return issued >= start;
  };

  const filteredSales = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return (salesRecords || []).filter((r) => {
      const matchesSearch =
        (r?.customer?.name || "").toLowerCase().includes(q) ||
        (r?.recordNumber || "").toLowerCase().includes(q) ||
        (r?.orderId || "").toLowerCase().includes(q) ||
        (r?.payerName || "").toLowerCase().includes(q);
      let matchesStatus = statusFilter === "all" || r?.paymentStatus === statusFilter;
      if (statusFilter === "overdue") matchesStatus = isOverdue(r?.dueDate, r?.paymentStatus);
      const matchesCustomer = customerFilter === "all" || r?.customer?.name === customerFilter;
      return matchesSearch && matchesStatus && matchesCustomer && matchesDateRange(r);
    });
  }, [salesRecords, searchTerm, statusFilter, customerFilter, dateRange]);

  const clearFilters = () => { setSearchTerm(""); setStatusFilter("all"); setDateRange("all"); setCustomerFilter("all"); };
  const customerOptions = useMemo(() => { const uniqueNames = [...new Set((salesRecords || []).map((r) => r?.customer?.name))].filter(Boolean); const opts = uniqueNames.map((name) => ({ label: name, value: name })); return [{ label: "Todos los clientes", value: "all" }, ...opts]; }, [salesRecords]);

  // KPIs
  const arTotal = useMemo(() => calcAR(filteredSales), [filteredSales]);
  const dso = useMemo(() => calcDSO(filteredSales), [filteredSales]);
  const aging = useMemo(() => calcAging(filteredSales), [filteredSales]);
  const insurerRanking = useMemo(() => rankInsurers(filteredSales), [filteredSales]);
  const totalRevenue = useMemo(() => filteredSales.reduce((acc, r) => acc + (Number(r?.amount) || 0), 0), [filteredSales]);
  const pendingAmount = useMemo(() => filteredSales.filter((r) => r?.paymentStatus !== "paid").reduce((acc, r) => acc + (Number(r?.amount) || 0), 0), [filteredSales]);

  const handleSendRecord = (recordId) => { setSalesRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, sentAt: new Date().toISOString() } : r))); };

  const openRegisterPayment = (record) => {
    setPaymentTarget(record);
    const alreadyPaid = (paymentsLedger || [])
      .filter((p) => p.recordId === record.id)
      .reduce((acc, p) => acc + (Number(p.amount) || 0) + (Number(p.retentionAmount) || 0), 0); // Considerar retenciones previas
    
    const remaining = Math.max(0, (Number(record.amount) || 0) - alreadyPaid);
    
    setPaymentAmount(String(remaining));
    setPaymentMethod(record?.paymentMethod || "transfer");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setHasRetention(false);
    setRetentionAmount("");
    setShowPaymentModal(true);
  };

  const confirmRegisterPayment = () => {
    if (!paymentTarget) return;

    // Validación de monto (comas y puntos)
    const cleanAmountStr = String(paymentAmount).replace(/,/g, ".");
    const amt = Number(cleanAmountStr);
    
    // Validación de retención
    let retAmt = 0;
    if (hasRetention) {
        const cleanRetStr = String(retentionAmount).replace(/,/g, ".");
        retAmt = Number(cleanRetStr);
    }

    // Permitir que el monto sea 0 si hay retención (ej: se paga todo con retención, raro pero posible)
    // O monto > 0
    const totalEffective = amt + retAmt;

    if (isNaN(amt) || isNaN(retAmt) || totalEffective <= 0) {
      alert("Por favor ingresa montos válidos.");
      return;
    }

    const paidAt = new Date(paymentDate + "T12:00:00").toISOString();

    const paymentRow = {
      id: `PAY-${paymentTarget.id}-${Date.now()}`,
      recordId: paymentTarget.id,
      recordNumber: paymentTarget.recordNumber,
      payerName: paymentTarget.payerName,
      payerType: paymentTarget.payerType,
      amount: amt, // Dinero recibido
      retentionAmount: retAmt, // Dinero en papeles (retenciones)
      currency: paymentTarget.currency || "USD",
      method: paymentMethod,
      paidAt,
      notes: hasRetention ? `Pago con retención (${formatCurrency(retAmt)})` : "Pago registrado",
    };

    setPaymentsLedger((prev) => [paymentRow, ...prev]);

    setSalesRecords((prev) =>
      prev.map((r) => {
        if (r.id !== paymentTarget.id) return r;
        
        const previousPaid = (paymentsLedger || [])
          .filter((p) => p.recordId === r.id)
          .reduce((acc, p) => acc + (Number(p.amount) || 0) + (Number(p.retentionAmount) || 0), 0);

        const totalPaidSoFar = previousPaid + totalEffective;
        const totalAmount = Number(r.amount) || 0;

        let nextStatus = "pending";
        if (totalPaidSoFar >= totalAmount - 0.01 && totalAmount > 0) nextStatus = "paid";
        else if (totalPaidSoFar > 0) nextStatus = "partial";

        return {
          ...r,
          paymentStatus: nextStatus,
          paymentMethod: paymentMethod || r.paymentMethod,
          lastPaymentDate: paidAt,
        };
      })
    );
    setShowPaymentModal(false);
    setPaymentTarget(null);
  };

  const handleGenerateReceipt = (record) => {
    const html = `
      <html>
        <head>
          <title>Comprobante de Venta - ${record?.recordNumber}</title>
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
          <h1>Comprobante de Operación</h1>
          <div class="muted">Documento no fiscal emitido por Healtng.</div>
          <div class="box">
            <div class="row">
              <div>
                <div class="muted">Nro de registro</div>
                <div><b>${record?.recordNumber || "-"}</b></div>
              </div>
              <div>
                <div class="muted">Fecha</div>
                <div><b>${formatDateVE(record?.issueDate)}</b></div>
              </div>
              <div>
                <div class="muted">Orden</div>
                <div><b>${record?.orderId || "-"}</b></div>
              </div>
            </div>
            <div style="margin-top:12px" class="row">
              <div>
                <div class="muted">Cliente</div>
                <div><b>${record?.customer?.name || "-"}</b></div>
              </div>
              <div>
                <div class="muted">Pagador</div>
                <div><b>${record?.payerName || "-"}</b> <span class="muted">(${payerLabel(record?.payerType)})</span></div>
              </div>
            </div>
            ${record?.payerType === 'insurance' ? `
            <div style="margin-top:12px" class="row">
                <div><div class="muted">Póliza</div><div><b>${record?.policyNumber || "N/A"}</b></div></div>
                <div><div class="muted">Clave Aprobación</div><div><b>${record?.approvalKey || "N/A"}</b></div></div>
            </div>` : ''}
            <table>
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th class="right">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total operación</td>
                  <td class="right"><b>${formatCurrency(record?.amount)}</b></td>
                </tr>
                <tr>
                  <td class="muted">Impuestos (estimados)</td>
                  <td class="right">${formatCurrency(record?.estimatedTaxes?.iva || 0)}</td>
                </tr>
                <tr>
                  <td class="muted">Fee plataforma (Healtng)</td>
                  <td class="right">${formatCurrency(record?.platformFee?.amount || 0)}</td>
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
    const cleanAmountStr = String(newSaleAmount).replace(/,/g, ".");
    const amount = Number(cleanAmountStr);

    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    const issueDate = new Date(newSaleDate).toISOString();
    const dueDate = new Date(new Date(issueDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const estimatedTaxes = calculateEstimatedTaxes(amount, businessContext?.businessType);
    const platformFee = calculatePlatformFee(amount, businessContext?.businessType);
    const now = new Date();
    const id = `RV-${now.getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    const newRecord = {
      id,
      recordNumber: id,
      orderId: `MANUAL-${now.getTime().toString().slice(-6)}`,
      customer: { name: newSaleCustomer || "Cliente Mostrador" },
      issueDate,
      dueDate,
      amount,
      currency: "USD",
      amountVES: Math.round(amount * 36.5),
      paymentStatus: "pending",
      paymentMethod: "transfer",
      notes: newSaleNotes || "Registro manual de venta",
      products: [],
      estimatedTaxes,
      platformFee,
      payerType: newSalePayerType,
      payerName: newSaleCustomer || "Paciente",
      sentAt: null,
      lastPaymentDate: null,
      // Guardar campos nuevos
      policyNumber: newSalePolicy,
      approvalKey: newSaleApprovalKey
    };
    setSalesRecords((prev) => [newRecord, ...prev]);
    
    // Reset form
    setNewSaleCustomer("");
    setNewSaleAmount("");
    setNewSaleNotes("");
    setNewSalePolicy("");
    setNewSaleApprovalKey("");
    setShowNewSaleModal(false);
  };

  const exportForActiveTab = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const sortedSales = [...(filteredSales || [])].sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));

    if (activeTab === "sales") {
      const rows = sortedSales.map((r) => ({
        recordNumber: r.recordNumber,
        orderId: r.orderId,
        customer: r.customer?.name || "",
        payerName: r.payerName || "",
        payerType: r.payerType || "",
        policy: r.policyNumber || "", // Exportar póliza
        approval: r.approvalKey || "", // Exportar clave
        issueDate: formatDateVE(r.issueDate),
        dueDate: formatDateVE(r.dueDate),
        amountUSD: Number(r.amount || 0),
        status: isOverdue(r.dueDate, r.paymentStatus) ? "overdue" : r.paymentStatus,
        estimatedTaxUSD: Number(r.estimatedTaxes?.iva || 0),
        platformFeeUSD: Number(r.platformFee?.amount || 0),
      }));
      downloadTextFile(`healtng-registros-venta-${stamp}.csv`, toCSV(rows));
      return;
    }

    if (activeTab === "payments") {
      const rows = (paymentsLedger || []).map((p) => ({
        paymentId: p.id,
        recordNumber: p.recordNumber,
        payerName: p.payerName,
        payerType: p.payerType,
        amountCash: Number(p.amount || 0),
        amountRetention: Number(p.retentionAmount || 0), // Exportar retención
        currency: p.currency || "USD",
        method: p.method || "",
        paidAt: formatDateVE(p.paidAt),
        notes: p.notes || "",
      }));
      downloadTextFile(`healtng-pagos-${stamp}.csv`, toCSV(rows));
      return;
    }
    // Resto de exportaciones iguales...
    if (activeTab === "reports") {
      const rows = sortedSales.map((r) => ({
        date: formatDateVE(r.issueDate),
        recordNumber: r.recordNumber,
        customer: r.customer?.name || "",
        totalUSD: Number(r.amount || 0),
        status: isOverdue(r.dueDate, r.paymentStatus) ? "overdue" : r.paymentStatus,
      }));
      downloadTextFile(`healtng-reporte-ventas-${stamp}.csv`, toCSV(rows));
      return;
    }
  };

  const handleBulkAction = (action) => {
    if (action === "send") { selectedSales.forEach((id) => handleSendRecord(id)); setSelectedSales([]); }
    if (action === "remind") { console.log("Sending reminders to:", selectedSales); setSelectedSales([]); }
  };

  // UI Helpers
  const payerLabel = (payerType) => payerType === "insurance" ? "Aseguradora" : payerType === "company" ? "Empresa" : "Paciente";
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
        <Icon name={c.icon} size={12} className="mr-1" />{c.text}
      </div>
    );
  };

  const tabs = [
    { id: "sales", label: "Registros de Venta", icon: "FileText" },
    { id: "payments", label: "Pagos", icon: "CreditCard" },
    { id: "reports", label: "Reportes", icon: "BarChart3" },
    { id: "analytics", label: "Análisis Financiero", icon: "TrendingUp" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Ventas y Cobranza</h1>
            <p className="text-sm text-gray-600 mt-1">Registro de ventas, seguimiento de pagos y analítica financiera (sin emisión fiscal)</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setShowNewSaleModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Icon name="Plus" size={16} className="mr-2" />Nuevo Registro
            </Button>
            <Button onClick={exportForActiveTab} className="bg-green-600 hover:bg-green-700 text-white">
              <Icon name="Download" size={16} className="mr-2" />Exportar
            </Button>
            <Button variant="ghost" onClick={() => { localStorage.removeItem("healtng_sales_v1"); localStorage.removeItem("healtng_payments_v1"); window.location.reload(); }} className="text-red-500 hover:bg-red-50 hover:text-red-700" title="Borrar datos locales y reiniciar demo">
              <Icon name="RefreshCw" size={16} className="mr-2"/>Reset Demo
            </Button>
          </div>
        </div>
      </div>

      {/* FILTROS Y TABS (Sin cambios visuales) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <Icon name={tab.icon} size={16} className="mr-2" />{tab.label}
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
              <div><label className="text-xs text-gray-500 mb-1 block">Búsqueda</label><Input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e?.target?.value)} className="w-full" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Estado</label><Select value={statusFilter} onChange={handleSelectChange(setStatusFilter)} options={STATUS_OPTIONS} className="w-full" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Cliente</label><Select value={customerFilter} onChange={handleSelectChange(setCustomerFilter)} options={customerOptions} className="w-full" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Rango de fechas</label><Select value={dateRange} onChange={handleSelectChange(setDateRange)} options={DATE_RANGE_OPTIONS} className="w-full" /></div>
            </div>
            <Button onClick={clearFilters} variant="outline" className="mb-[2px] border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-red-600 px-3" title="Limpiar filtros"><Icon name="Trash2" size={16} /> <span className="ml-2 hidden lg:inline">Limpiar</span></Button>
          </div>
        </div>
      </div>

      {/* DASHBOARD ANALYTICS (RESTAURADO COMPLETO) */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
           {/* FILA 1: KPIs Principales */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm font-medium text-gray-600">Cuentas por Cobrar (AR)</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(arTotal)}</p></div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm font-medium text-gray-600">DSO (días promedio)</p><p className="text-2xl font-bold text-gray-900">{dso} días</p><p className="text-xs text-gray-500 mt-1">Promedio solo en registros pagados</p></div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <p className="text-sm font-medium text-gray-600">Antigüedad de mora</p>
               <div className="mt-2 space-y-1 text-sm text-gray-700">
                 <div className="flex justify-between"><span>0–30</span><span>{formatCurrency(aging["0-30"] || 0)}</span></div>
                 <div className="flex justify-between"><span>31–60</span><span>{formatCurrency(aging["31-60"] || 0)}</span></div>
                 <div className="flex justify-between"><span>61–90</span><span>{formatCurrency(aging["61-90"] || 0)}</span></div>
                 <div className="flex justify-between"><span>90+</span><span>{formatCurrency(aging["90+"] || 0)}</span></div>
               </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <p className="text-sm font-medium text-gray-600">Ranking Aseguradoras (tardanza)</p>
               {insurerRanking.length ? (
                 <div className="mt-2 space-y-1 text-sm text-gray-700">
                   {insurerRanking.slice(0, 5).map((x) => (<div key={x.payerName} className="flex justify-between"><span className="truncate">{x.payerName}</span><span className="ml-2">{x.avgDays} d</span></div>))}
                   <p className="text-xs text-gray-500 mt-2">Ordenado: más tardío primero</p>
                 </div>
               ) : (<p className="text-sm text-gray-500 mt-2">No hay pagos de aseguradoras para rankear.</p>)}
             </div>
           </div>
           
           {/* FILA 2: Métricas Secundarias (RESTAURADA) */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center justify-between">
                 <div><p className="text-sm font-medium text-gray-600">Ingresos Totales</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p><p className="text-sm text-gray-500">{formatCurrency(totalRevenue * 36.5, "VES")}</p></div>
                 <div className="p-3 bg-green-50 rounded-full"><Icon name="DollarSign" size={24} className="text-green-600" /></div>
               </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center justify-between">
                 <div><p className="text-sm font-medium text-gray-600">Por Cobrar</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p><p className="text-sm text-gray-500">{formatCurrency(pendingAmount * 36.5, "VES")}</p></div>
                 <div className="p-3 bg-yellow-50 rounded-full"><Icon name="Clock" size={24} className="text-yellow-600" /></div>
               </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center justify-between">
                 <div><p className="text-sm font-medium text-gray-600">Registros Pagados</p><p className="text-2xl font-bold text-gray-900">{filteredSales.filter((r) => r?.paymentStatus === "paid").length}</p></div>
                 <div className="p-3 bg-blue-50 rounded-full"><Icon name="CheckCircle" size={24} className="text-blue-600" /></div>
               </div>
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
               <div className="flex items-center justify-between">
                 <div><p className="text-sm font-medium text-gray-600">Rentabilidad</p><p className="text-2xl font-bold text-gray-900">22.3%</p><p className="text-xs text-gray-500 mt-1">(placeholder)</p></div>
                 <div className="p-3 bg-purple-50 rounded-full"><Icon name="TrendingUp" size={24} className="text-purple-600" /></div>
               </div>
             </div>
           </div>

           {/* FILA 3: Gráfico (RESTAURADA) */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <h3 className="text-lg font-medium text-gray-900 mb-4">Flujo de Caja</h3>
             <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
               <div className="text-center"><Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-2" /><p className="text-gray-500">Gráfico de tendencias de ingresos</p><p className="text-sm text-gray-400">Datos de los últimos 12 meses</p></div>
             </div>
           </div>
        </div>
      )}

      {/* TABLA DE VENTAS */}
      {activeTab === "sales" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {selectedSales.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700">{selectedSales.length} seleccionadas</p>
                <div className="flex items-center space-x-2">
                  <Button size="sm" onClick={() => handleBulkAction("send")} className="bg-blue-600 hover:bg-blue-700 text-white">Enviar</Button>
                  <Button size="sm" onClick={() => handleBulkAction("remind")} className="bg-orange-600 hover:bg-orange-700 text-white">Recordatorios</Button>
                </div>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left"><input type="checkbox" onChange={(e) => { if (e?.target?.checked) setSelectedSales(filteredSales.map((r) => r.id)); else setSelectedSales([]); }} checked={selectedSales.length === filteredSales.length && filteredSales.length > 0} className="rounded border-gray-300" /></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro / Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha / Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado de Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="flex flex-col items-center"><Icon name="FileText" size={48} className="text-gray-400 mb-4" /><p className="text-gray-500 text-lg font-medium">No hay registros</p><p className="text-gray-400 text-sm">No se encontraron resultados con los filtros aplicados</p></div></td></tr>
                ) : (
                  filteredSales.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" checked={selectedSales.includes(r.id)} onChange={(e) => { if (e?.target?.checked) setSelectedSales((prev) => [...prev, r.id]); else setSelectedSales((prev) => prev.filter((id) => id !== r.id)); }} className="rounded border-gray-300" /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div><div className="text-sm font-medium text-gray-900">{r.recordNumber}</div><div className="text-sm text-gray-500">{r.customer?.name}</div><div className="text-xs text-gray-400">Orden: {r.orderId}</div>{r.sentAt && <div className="text-xs text-gray-400">Enviado: {formatDateVE(r.sentAt)}</div>}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{r.payerName || "-"}</div><div className="text-xs text-gray-500">{payerLabel(r.payerType)}</div>
                      {/* Mostrar Póliza si existe (Clínicas) */}
                      {r.policyNumber && <div className="text-xs text-blue-600 mt-1">Pol: {r.policyNumber}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div><div className="text-sm text-gray-900">Emitida: {formatDateVE(r.issueDate)}</div><div className={`text-sm ${isOverdue(r.dueDate, r.paymentStatus) ? "text-red-600" : "text-gray-500"}`}>Vence: {formatDateVE(r.dueDate)}</div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div><div className="text-sm font-medium text-gray-900">{formatCurrency(r.amount)}</div><div className="text-xs text-gray-500">{formatCurrency(r.amountVES, "VES")}</div><div className="text-xs text-gray-400">Fee plataforma: {formatCurrency(r.platformFee?.amount || 0)}</div><div className="text-xs text-gray-400">Impuestos (estim.): {formatCurrency(r.estimatedTaxes?.iva || 0)}</div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">{getPaymentStatusBadge(isOverdue(r.dueDate, r.paymentStatus) ? "overdue" : r.paymentStatus)}{r.lastPaymentDate && <div className="text-xs text-gray-500 mt-1">Último pago: {formatDateVE(r.lastPaymentDate)}</div>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleSendRecord(r.id)} className="text-blue-600 hover:text-blue-900"><Icon name="Send" size={16} className="mr-1" />Enviar</Button>
                        {r.paymentStatus !== "paid" && (<Button variant="ghost" size="sm" onClick={() => openRegisterPayment(r)} className="text-green-600 hover:text-green-900"><Icon name="Check" size={16} className="mr-1" />Registrar Pago</Button>)}
                        <Button variant="ghost" size="sm" onClick={() => handleGenerateReceipt(r)} className="text-purple-600 hover:text-purple-900"><Icon name="Receipt" size={16} className="mr-1" />Recibo</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLA DE PAGOS */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200"><h3 className="text-lg font-medium text-gray-900">Pagos</h3><p className="text-sm text-gray-600 mt-1">Ledger de pagos registrados (para conciliación y cuentas por cobrar).</p></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(paymentsLedger || []).length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No hay pagos registrados.</td></tr>
                ) : (
                  paymentsLedger.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{p.id}</div><div className="text-xs text-gray-400">{p.notes || ""}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.recordNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{p.payerName}</div><div className="text-xs text-gray-500">{payerLabel(p.payerType)}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateVE(p.paidAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(p.amount, p.currency)}
                        {/* Mostrar si hubo retención */}
                        {(p.retentionAmount > 0) && <span className="text-xs text-gray-500 block">+ {formatCurrency(p.retentionAmount)} (Ret)</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORTES TAB (Sin cambios) */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
            <p className="text-sm text-gray-600 mt-1">Exportables para control interno / contabilidad.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">Reporte de ventas (CSV)</p><p className="text-xs text-gray-500 mt-1">Basado en filtros actuales.</p>
                <Button onClick={exportForActiveTab} className="mt-3 bg-green-600 hover:bg-green-700 text-white"><Icon name="Download" size={16} className="mr-2" />Exportar</Button>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900">Pagos recibidos</p><p className="text-xs text-gray-500 mt-1">Detalle de ingresos y retenciones.</p>
                <Button onClick={() => setActiveTab('payments')} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"><Icon name="Eye" size={16} className="mr-2" />Ver Pagos</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVA VENTA (Actualizado para Clínicas) */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Registrar Venta Manual</h3><button onClick={() => setShowNewSaleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <p className="text-sm text-gray-600 mt-2">Ingrese los datos para registrar una nueva venta manualmente.</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><label className="text-xs text-gray-500 block mb-1">Nombre Cliente/Paciente</label><Input value={newSaleCustomer} onChange={(e) => setNewSaleCustomer(e.target.value)} placeholder="Ej: Juan Perez" /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Tipo de Pagador</label><Select value={newSalePayerType} onChange={handleSelectChange(setNewSalePayerType)} options={PAYER_TYPE_OPTIONS} /></div>
              
              {/* --- CAMPOS CLÍNICA (Solo si es seguro) --- */}
              {newSalePayerType === 'insurance' && (
                  <>
                    <div><label className="text-xs text-gray-500 block mb-1">Nro Póliza</label><Input value={newSalePolicy} onChange={(e) => setNewSalePolicy(e.target.value)} placeholder="Ej: POL-12345" /></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Clave Aprobación</label><Input value={newSaleApprovalKey} onChange={(e) => setNewSaleApprovalKey(e.target.value)} placeholder="Ej: CLV-999" /></div>
                  </>
              )}

              <div><label className="text-xs text-gray-500 block mb-1">Fecha Emisión</label><Input type="date" value={newSaleDate} onChange={(e) => setNewSaleDate(e.target.value)} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Monto Total ($)</label><Input type="number" value={newSaleAmount} onChange={(e) => setNewSaleAmount(e.target.value)} placeholder="0.00" /></div>
              <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">Notas / Concepto</label><Input value={newSaleNotes} onChange={(e) => setNewSaleNotes(e.target.value)} placeholder="Detalle de la venta..." /></div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button onClick={() => setShowNewSaleModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900">Cancelar</Button>
              <Button onClick={handleNewSale} className="bg-blue-600 hover:bg-blue-700 text-white">Crear Registro</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PAGO (Actualizado para Proveedores/Retenciones) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg p-6">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Registrar Pago</h3><button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">✕</button></div>
            <div className="mt-4 text-sm text-gray-700"><div><span className="text-gray-500">Registro:</span> <b>{paymentTarget?.recordNumber}</b></div><div><span className="text-gray-500">Deudor:</span> <b>{paymentTarget?.payerName}</b></div></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              <div><label className="text-xs text-gray-500">Monto Recibido ($)</label><Input value={paymentAmount} onChange={(e) => setPaymentAmount(e?.target?.value)} placeholder="0.00" /></div>
              <div><label className="text-xs text-gray-500">Método de Pago</label><Select value={paymentMethod} onChange={handleSelectChange(setPaymentMethod)} options={PAYMENT_METHOD_OPTIONS} /></div>
              <div><label className="text-xs text-gray-500">Fecha Pago</label><Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e?.target?.value)} /></div>
            </div>

            {/* --- SECCIÓN RETENCIONES (Proveedores) --- */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={hasRetention} onChange={(e) => setHasRetention(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500"/>
                    <span>Incluir Comprobante Retención (IVA/ISLR)</span>
                </label>
                {hasRetention && (
                    <div className="mt-2 animate-fadeIn">
                        <label className="text-xs text-gray-500">Monto Retenido (Papel)</label>
                        <Input value={retentionAmount} onChange={(e) => setRetentionAmount(e.target.value)} placeholder="0.00" className="mt-1" />
                        <p className="text-xs text-gray-400 mt-1">Este monto se sumará al pago para saldar la deuda.</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button onClick={() => setShowPaymentModal(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-900">Cancelar</Button>
              <Button onClick={confirmRegisterPayment} className="bg-green-600 hover:bg-green-700 text-white">Confirmar Pago</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBillingManagement;