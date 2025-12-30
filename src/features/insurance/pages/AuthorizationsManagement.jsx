import React, { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const DAY_MS = 24 * 60 * 60 * 1000;

// Helpers seguros (evita crasheos)
const safeNumber = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const toDate = (v) => {
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
};
const daysBetween = (from, to) => {
  const a = toDate(from);
  const b = toDate(to);
  if (!a || !b) return 0;
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / DAY_MS));
};
const formatMoney = (v) => `Bs. ${safeNumber(v).toLocaleString()}`;

// SLA simple (puedes ajustar por aseguradora luego)
const SLA_DAYS = {
  pending: 2,
  in_review: 4,
  approved: 0,
  denied: 0,
  expired: 0,
};

const normalizeRole = (r) => {
  const map = { clinic_admin: "clinic" };
  return map[r] || r || "clinic";
};

const getStatusConfig = (status) => {
  const statusConfig = {
    pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
    in_review: { label: "En Revisión", className: "bg-blue-100 text-blue-800" },
    approved: { label: "Aprobada", className: "bg-green-100 text-green-800" },
    denied: { label: "Denegada", className: "bg-red-100 text-red-800" },
    expired: { label: "Vencida", className: "bg-gray-100 text-gray-800" },
  };
  return statusConfig[status] || statusConfig.pending;
};

const getPriorityConfig = (priority) => {
  const priorityConfig = {
    normal: { label: "Normal", className: "bg-gray-100 text-gray-800" },
    high: { label: "Alta", className: "bg-red-100 text-red-800" },
    urgent: { label: "Urgente", className: "bg-red-200 text-red-900" },
  };
  return priorityConfig[priority] || priorityConfig.normal;
};

const computeSlaState = (auth) => {
  const now = new Date();
  const status = auth?.status || "pending";
  const slaDays = SLA_DAYS[status] ?? 2;
  if (!slaDays || ["approved", "denied", "expired"].includes(status)) {
    return { label: "Sin SLA", className: "bg-gray-100 text-gray-700", isBreached: false, daysLate: 0, daysToBreach: 0 };
  }

  const ageDays = daysBetween(auth?.requestDate, now);
  const daysToBreach = slaDays - ageDays;

  if (daysToBreach < 0) {
    return {
      label: `SLA vencida (${Math.abs(daysToBreach)}d)`,
      className: "bg-red-100 text-red-800",
      isBreached: true,
      daysLate: Math.abs(daysToBreach),
      daysToBreach,
    };
  }

  if (daysToBreach === 0) {
    return {
      label: "SLA vence hoy",
      className: "bg-orange-100 text-orange-800",
      isBreached: false,
      daysLate: 0,
      daysToBreach,
    };
  }

  if (daysToBreach <= 1) {
    return {
      label: `Por vencer (${daysToBreach}d)`,
      className: "bg-orange-100 text-orange-800",
      isBreached: false,
      daysLate: 0,
      daysToBreach,
    };
  }

  return {
    label: "En tiempo",
    className: "bg-green-100 text-green-800",
    isBreached: false,
    daysLate: 0,
    daysToBreach,
  };
};

const RiskPill = ({ level, text }) => {
  const cfg = {
    green: { className: "bg-green-100 text-green-800 border-green-200", icon: "CheckCircle" },
    yellow: { className: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "AlertTriangle" },
    red: { className: "bg-red-100 text-red-800 border-red-200", icon: "XCircle" },
  }[level];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.className}`}>
      <Icon name={cfg.icon} size={14} />
      <span>{text}</span>
    </div>
  );
};

const KPI = ({ title, value, hint, icon, accent = "text-foreground" }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-2xl font-bold ${accent}`}>{value}</p>
        {hint ? <p className="text-xs text-muted-foreground mt-1">{hint}</p> : null}
      </div>
      <Icon name={icon} size={22} className="text-muted-foreground" />
    </div>
  </div>
);

const AuthorizationsManagement = ({ mode = "auto" }) => {
  const [authorizations, setAuthorizations] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Campos operativos (para demo / medición)
  const [processForm, setProcessForm] = useState({
    insurerContacted: false,
    insurerChannel: "email", // email, whatsapp, portal, call
    insurerTicketId: "",
    expectedResponseDays: 2,
    internalNotes: "",
    decision: "in_review", // in_review, approved, denied
    denialReason: "",
  });

  // ---- rol: clinic o provider
  const role = useMemo(() => {
    if (mode !== "auto") return normalizeRole(mode);
    if (typeof window === "undefined") return "clinic";
    return normalizeRole(localStorage.getItem("userRole"));
  }, [mode]);

  const isClinic = role === "clinic";
  const isProvider = role === "provider";

  const labels = useMemo(() => {
    return {
      title: "Pre-autorizaciones (Seguros)",
      subtitle: isClinic
        ? "Controla solicitudes, SLA y riesgo por aseguradora"
        : "Gestiona respuesta a clínicas, SLA y documentación",
      primaryAction: isClinic ? "Procesar solicitud" : "Responder / procesar",
      newAction: isClinic ? "Nueva solicitud" : "Nueva respuesta",
    };
  }, [isClinic]);

  useEffect(() => {
    // Mock mejorado: agrega campos “operativos” para seguros
    const mock = [
      {
        id: "AUTH-001",
        patientName: "María González",
        patientId: "V-12345678",
        insuranceCompany: "Seguros Caracas",
        policyNumber: "POL-789456",
        serviceType: "Cirugía Menor",
        procedureCode: "CPT-12345",
        requestedService: "Extirpación de lunar",
        requestingDoctor: "Dr. Carlos Mendoza",
        requestDate: "2024-01-15",
        status: "pending",
        priority: "normal",
        estimatedCost: 150000,
        copay: 15000,
        notes: "Lesión pigmentada en brazo derecho",
        documents: [
          { name: "Solicitud médica", type: "PDF", uploaded: true },
          { name: "Historia clínica", type: "PDF", uploaded: true },
          { name: "Exámenes previos", type: "PDF", uploaded: false },
        ],
        // campos gerenciales:
        insurerResponseDate: null,
        lastInsurerContactDate: "2024-01-15",
        slaDays: 2,
      },
      {
        id: "AUTH-002",
        patientName: "Carlos Rodríguez",
        patientId: "V-87654321",
        insuranceCompany: "Seguro Social",
        policyNumber: "SS-456789",
        serviceType: "Tratamiento Especializado",
        procedureCode: "CPT-54321",
        requestedService: "Terapia de Insulina",
        requestingDoctor: "Dra. Ana Silva",
        requestDate: "2024-01-14",
        status: "approved",
        priority: "high",
        estimatedCost: 200000,
        copay: 0,
        approvalDate: "2024-01-15",
        authorizationNumber: "APP-789123",
        notes: "Diabetes tipo 2 descompensada, requiere tratamiento inmediato",
        documents: [
          { name: "Solicitud médica", type: "PDF", uploaded: true },
          { name: "Exámenes de laboratorio", type: "PDF", uploaded: true },
        ],
        insurerResponseDate: "2024-01-15",
        lastInsurerContactDate: "2024-01-14",
        slaDays: 2,
      },
      {
        id: "AUTH-003",
        patientName: "Ana López",
        patientId: "V-11223344",
        insuranceCompany: "Medicina Privada S.A.",
        policyNumber: "MP-112233",
        serviceType: "Estudios Diagnósticos",
        procedureCode: "CPT-98765",
        requestedService: "Resonancia Magnética",
        requestingDoctor: "Dr. Luis Herrera",
        requestDate: "2024-01-13",
        status: "denied",
        priority: "normal",
        estimatedCost: 300000,
        copay: 30000,
        denialDate: "2024-01-14",
        denialReason: "Falta documentación complementaria",
        notes: "Dolor lumbar crónico",
        documents: [{ name: "Solicitud médica", type: "PDF", uploaded: true }],
        insurerResponseDate: "2024-01-14",
        lastInsurerContactDate: "2024-01-13",
        slaDays: 2,
      },
      {
        id: "AUTH-004",
        patientName: "Pedro Martínez",
        patientId: "V-99887766",
        insuranceCompany: "Seguros Unidos",
        policyNumber: "SU-998877",
        serviceType: "Consulta Especializada",
        procedureCode: "CPT-11111",
        requestedService: "Consulta Cardiológica",
        requestingDoctor: "Dr. Roberto García",
        requestDate: "2024-01-12",
        status: "in_review",
        priority: "high",
        estimatedCost: 80000,
        copay: 8000,
        notes: "Antecedentes de arritmia cardíaca",
        documents: [
          { name: "Solicitud médica", type: "PDF", uploaded: true },
          { name: "Electrocardiograma", type: "PDF", uploaded: true },
        ],
        insurerResponseDate: null,
        lastInsurerContactDate: "2024-01-12",
        slaDays: 4,
      },
    ];

    setAuthorizations(mock);
  }, []);

  // ---------- datos gerenciales (Rafa)
  const analytics = useMemo(() => {
    const list = Array.isArray(authorizations) ? authorizations : [];
    const now = new Date();

    const open = list.filter((a) => ["pending", "in_review"].includes(a.status));
    const approved = list.filter((a) => a.status === "approved");
    const denied = list.filter((a) => a.status === "denied");

    const riskAmountOpen = open.reduce((sum, a) => sum + safeNumber(a.estimatedCost), 0);
    const heldAmountPending = list
      .filter((a) => a.status === "pending")
      .reduce((sum, a) => sum + safeNumber(a.estimatedCost), 0);

    // SLA breached:
    const breached = open.filter((a) => computeSlaState(a).isBreached);

    // Avg response time (solo cerradas con respuesta)
    const responded = list.filter((a) => a.insurerResponseDate && a.requestDate);
    const avgResponseDays =
      responded.length > 0
        ? Math.round(
            responded.reduce((sum, a) => sum + daysBetween(a.requestDate, a.insurerResponseDate), 0) / responded.length
          )
        : 0;

    const approvalRate = list.length > 0 ? Math.round((approved.length / list.length) * 100) : 0;

    // Riesgo simple:
    // - rojo: SLA vencidas >=2 o monto retenido alto
    // - amarillo: SLA vencida >=1 o muchas por vencer
    const aboutToBreach = open.filter((a) => {
      const s = computeSlaState(a);
      return !s.isBreached && (s.label.includes("vence hoy") || s.label.includes("Por vencer"));
    });

    const riskLevel = (() => {
      if (breached.length >= 2) return "red";
      if (breached.length === 1) return "yellow";
      if (aboutToBreach.length >= 2) return "yellow";
      if (riskAmountOpen >= 500000) return "yellow"; // umbral demo
      return "green";
    })();

    const riskText =
      riskLevel === "green"
        ? "Operación estable"
        : riskLevel === "yellow"
        ? "Presión operativa"
        : "Riesgo de retrasos";

    return {
      total: list.length,
      open: open.length,
      approved: approved.length,
      denied: denied.length,
      breached: breached.length,
      aboutToBreach: aboutToBreach.length,
      avgResponseDays,
      approvalRate,
      riskAmountOpen,
      heldAmountPending,
      riskLevel,
      riskText,
    };
  }, [authorizations]);

  const filteredAuthorizations = useMemo(() => {
    const list = Array.isArray(authorizations) ? authorizations : [];
    if (activeTab === "all") return list;
    return list.filter((a) => a.status === activeTab);
  }, [authorizations, activeTab]);

  const openDetails = (auth) => {
    setSelectedAuth(auth);
    setProcessForm({
      insurerContacted: false,
      insurerChannel: "email",
      insurerTicketId: "",
      expectedResponseDays: SLA_DAYS[auth?.status] ?? 2,
      internalNotes: "",
      decision: auth?.status === "pending" ? "in_review" : auth?.status,
      denialReason: auth?.denialReason || "",
    });
    setIsModalOpen(true);
  };

  const applyMockDecision = () => {
    if (!selectedAuth) return;

    setAuthorizations((prev) =>
      prev.map((a) => {
        if (a.id !== selectedAuth.id) return a;

        const nowIso = new Date().toISOString().slice(0, 10);
        const nextStatus = processForm.decision;

        return {
          ...a,
          status: nextStatus,
          denialReason: nextStatus === "denied" ? processForm.denialReason || "No especificado" : undefined,
          insurerResponseDate: ["approved", "denied"].includes(nextStatus) ? nowIso : a.insurerResponseDate,
          lastInsurerContactDate: processForm.insurerContacted ? nowIso : a.lastInsurerContactDate,
          insurerTicketId: processForm.insurerTicketId || a.insurerTicketId,
          internalNotes: processForm.internalNotes || a.internalNotes,
        };
      })
    );

    setIsModalOpen(false);
    setSelectedAuth(null);
  };

  const getStatusBadge = (status) => {
    const cfg = getStatusConfig(status);
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${cfg.className}`}>{cfg.label}</span>;
  };

  const getPriorityBadge = (priority) => {
    const cfg = getPriorityConfig(priority);
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${cfg.className}`}>
        ⚡ {cfg.label}
      </span>
    );
  };

  const SlaBadge = ({ auth }) => {
    const s = computeSlaState(auth);
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${s.className}`}>{s.label}</span>;
  };

  const AuthorizationCard = ({ authorization }) => {
    const statusCfg = getStatusConfig(authorization?.status);
    const priorityCfg = getPriorityConfig(authorization?.priority);
    const sla = computeSlaState(authorization);

    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{authorization?.id}</h3>
              <p className="text-sm text-muted-foreground">{authorization?.patientName}</p>
              <p className="text-sm text-muted-foreground">ID: {authorization?.patientId}</p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusCfg.className}`}>
              {statusCfg.label}
            </span>

            {authorization?.priority !== "normal" && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityCfg.className}`}>
                ⚡ {priorityCfg.label}
              </span>
            )}

            {["pending", "in_review"].includes(authorization?.status) && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${sla.className}`}>
                {sla.label}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Servicio:</span>
            <span className="text-foreground">{authorization?.requestedService}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seguro:</span>
            <span className="text-foreground">{authorization?.insuranceCompany}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="text-foreground">
              {authorization?.requestDate ? new Date(authorization.requestDate).toLocaleDateString() : "-"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Costo:</span>
            <span className="text-foreground font-medium">{formatMoney(authorization?.estimatedCost)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Copago:</span>
            <span className="text-foreground">{formatMoney(authorization?.copay)}</span>
          </div>

          {authorization?.documents?.length ? (
            <div className="pt-2">
              <div className="text-xs text-muted-foreground mb-2">Documentos</div>
              <div className="space-y-1">
                {authorization.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={14} className="text-muted-foreground" />
                      <span className="text-foreground">{doc?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {doc?.uploaded ? (
                        <Icon name="CheckCircle" size={14} className="text-green-600" />
                      ) : (
                        <Icon name="AlertCircle" size={14} className="text-red-600" />
                      )}
                      <span className={`text-xs ${doc?.uploaded ? "text-green-600" : "text-red-600"}`}>
                        {doc?.uploaded ? "Cargado" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {authorization?.notes ? (
          <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
            <strong>Notas:</strong> {authorization.notes}
          </p>
        ) : null}

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => openDetails(authorization)}>
            <Icon name="Eye" size={14} className="mr-2" />
            Ver / Procesar
          </Button>

          <Button variant="outline" size="sm" onClick={() => openDetails(authorization)}>
            <Icon name="Edit2" size={14} />
          </Button>
        </div>
      </div>
    );
  };

  // Tabs
  const tabs = useMemo(() => {
    const list = Array.isArray(authorizations) ? authorizations : [];
    const count = (s) => list.filter((a) => a.status === s).length;
    return [
      { key: "all", label: "Todas", count: list.length },
      { key: "pending", label: "Pendientes", count: count("pending") },
      { key: "in_review", label: "En Revisión", count: count("in_review") },
      { key: "approved", label: "Aprobadas", count: count("approved") },
      { key: "denied", label: "Denegadas", count: count("denied") },
    ];
  }, [authorizations]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{labels.title}</h1>
            <RiskPill level={analytics.riskLevel} text={analytics.riskText} />
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {isClinic ? "Vista Clínica" : isProvider ? "Vista Proveedor" : "Vista"}
            </span>
          </div>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtros
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            {labels.newAction}
          </Button>
        </div>
      </div>

      {/* KPIs gerenciales (Rafa) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPI title="Abiertas" value={analytics.open} hint="Pendientes + En revisión" icon="Inbox" />
        <KPI
          title="SLA vencidas"
          value={analytics.breached}
          hint="Riesgo por tardanza"
          icon="AlertTriangle"
          accent={analytics.breached > 0 ? "text-red-600" : "text-foreground"}
        />
        <KPI title="Resp. promedio" value={`${analytics.avgResponseDays}d`} hint="Aseguradora → respuesta" icon="Clock" />
        <KPI
          title="Tasa aprobación"
          value={`${analytics.approvalRate}%`}
          hint="Aprobadas / total"
          icon="CheckCircle"
          accent={analytics.approvalRate >= 60 ? "text-green-600" : "text-foreground"}
        />
        <KPI
          title="Monto en riesgo"
          value={formatMoney(analytics.riskAmountOpen)}
          hint="Aprobación pendiente"
          icon="DollarSign"
          accent={analytics.riskAmountOpen > 0 ? "text-yellow-700" : "text-foreground"}
        />
      </div>

      {/* Insight narrativo (storytelling gerencial) */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Activity" size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Lectura operativa</p>
            <p className="text-sm text-muted-foreground mt-1">
              {analytics.breached > 0
                ? `⚠ ${analytics.breached} solicitudes tienen SLA vencida. Esto puede retrasar agenda y flujo de caja.`
                : `✅ No hay SLA vencidas. Mantén control de documentación y tiempos de respuesta.`}
              {analytics.riskAmountOpen > 0
                ? ` Monto retenido estimado por pre-autorizaciones abiertas: ${formatMoney(analytics.riskAmountOpen)}.`
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={activeTab === t.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(t.key)}
          >
            {t.label} ({t.count})
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthorizations.map((a) => (
          <AuthorizationCard key={a.id} authorization={a} />
        ))}
      </div>

      {filteredAuthorizations.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Shield" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No hay solicitudes</p>
          <p className="text-muted-foreground">en esta categoría por el momento</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{selectedAuth?.id}</h2>
                  {getStatusBadge(selectedAuth?.status)}
                  {["pending", "in_review"].includes(selectedAuth?.status) ? <SlaBadge auth={selectedAuth} /> : null}
                </div>
                <p className="text-muted-foreground">Detalle operativo de pre-autorización</p>
              </div>

              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Bloque 1 */}
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Paciente</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="text-foreground">{selectedAuth?.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cédula:</span>
                      <span className="text-foreground">{selectedAuth?.patientId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Seguro</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aseguradora:</span>
                      <span className="text-foreground">{selectedAuth?.insuranceCompany}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Póliza:</span>
                      <span className="text-foreground">{selectedAuth?.policyNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Copago:</span>
                      <span className="text-foreground">{formatMoney(selectedAuth?.copay)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloque 2 */}
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Servicio</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Solicitado:</span>
                      <span className="text-foreground">{selectedAuth?.requestedService}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="text-foreground">{selectedAuth?.serviceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Código:</span>
                      <span className="text-foreground font-mono">{selectedAuth?.procedureCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Costo:</span>
                      <span className="text-foreground">{formatMoney(selectedAuth?.estimatedCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Tiempos (SLA)</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Solicitud:</span>
                      <span className="text-foreground">
                        {selectedAuth?.requestDate ? new Date(selectedAuth.requestDate).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Último contacto:</span>
                      <span className="text-foreground">
                        {selectedAuth?.lastInsurerContactDate
                          ? new Date(selectedAuth.lastInsurerContactDate).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resp. aseguradora:</span>
                      <span className="text-foreground">
                        {selectedAuth?.insurerResponseDate
                          ? new Date(selectedAuth.insurerResponseDate).toLocaleDateString()
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Procesamiento (lo que Rafa quiere medir) */}
            <div className="border border-border rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-3">Procesamiento / Seguimiento</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!processForm.insurerContacted}
                    onChange={(e) => setProcessForm((p) => ({ ...p, insurerContacted: e.target.checked }))}
                  />
                  <span>Se contactó aseguradora</span>
                </label>

                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Canal</div>
                  <select
                    className="w-full border border-border rounded px-3 py-2 bg-background"
                    value={processForm.insurerChannel}
                    onChange={(e) => setProcessForm((p) => ({ ...p, insurerChannel: e.target.value }))}
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="portal">Portal</option>
                    <option value="call">Llamada</option>
                  </select>
                </div>

                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Ticket / Caso (aseguradora)</div>
                  <input
                    className="w-full border border-border rounded px-3 py-2 bg-background"
                    value={processForm.insurerTicketId}
                    onChange={(e) => setProcessForm((p) => ({ ...p, insurerTicketId: e.target.value }))}
                    placeholder="Ej: SC-2024-00123"
                  />
                </div>

                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Respuesta esperada (días)</div>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-border rounded px-3 py-2 bg-background"
                    value={processForm.expectedResponseDays}
                    onChange={(e) => setProcessForm((p) => ({ ...p, expectedResponseDays: safeNumber(e.target.value, 0) }))}
                  />
                </div>

                <div className="text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Decisión (demo)</div>
                  <select
                    className="w-full border border-border rounded px-3 py-2 bg-background"
                    value={processForm.decision}
                    onChange={(e) => setProcessForm((p) => ({ ...p, decision: e.target.value }))}
                  >
                    <option value="in_review">En revisión</option>
                    <option value="approved">Aprobada</option>
                    <option value="denied">Denegada</option>
                  </select>
                </div>

                {processForm.decision === "denied" && (
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground mb-1">Motivo denegación</div>
                    <input
                      className="w-full border border-border rounded px-3 py-2 bg-background"
                      value={processForm.denialReason}
                      onChange={(e) => setProcessForm((p) => ({ ...p, denialReason: e.target.value }))}
                      placeholder="Ej: Falta documentación / Fuera de cobertura"
                    />
                  </div>
                )}

                <div className="md:col-span-2 text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Notas internas</div>
                  <textarea
                    className="w-full border border-border rounded px-3 py-2 bg-background min-h-[90px]"
                    value={processForm.internalNotes}
                    onChange={(e) => setProcessForm((p) => ({ ...p, internalNotes: e.target.value }))}
                    placeholder="Qué falta, quién respondió, próximos pasos..."
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-2">
              <Button variant="default" className="flex-1 min-w-[220px]" onClick={applyMockDecision}>
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Guardar (demo) y actualizar estado
              </Button>

              <Button variant="outline" className="flex-1 min-w-[220px]">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Contactar aseguradora
              </Button>

              <Button variant="outline">
                <Icon name="Printer" size={16} className="mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationsManagement;
