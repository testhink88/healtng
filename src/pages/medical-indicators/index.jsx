import React, { useMemo, useState, useCallback } from "react";

// Shell
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

// Analítica
import {
  GlobalControls,
  KPIMetricsCard,
  PerformanceAnalytics,
  PatientFlowHeatmap,
  LivePatientQueue,
  PatientJourneyFlow,
  QualityKPICard,
  SatisfactionTrendsChart,
} from "@/features/analytics/components";

/* -------------------- Utilidades de fecha -------------------- */
function isoToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
function seqDays(fromIso, toIso) {
  const out = [];
  const from = new Date(fromIso);
  const to = new Date(toIso);
  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    out.push(x.toISOString());
  }
  return out;
}

/* -------------------- Diccionarios legibles -------------------- */
const TYPE_LABEL = {
  appointment: "Cita",
  diagnosis: "Diagnóstico",
  rx: "Receta",
  lab: "Laboratorio",
  note: "Nota",
  referral: "Referencia",
};
const STATUS_LABEL = {
  completed: "completado",
  confirmed: "confirmado",
  active: "activa",
  sent: "enviada",
  added: "agregada",
  no_show: "no asistió",
};
const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* -------------------- Factores por Sede y Canal (mock) -------------------- */
const LOCATION_FACTORS = {
  main:   { atenciones: 1.00, espera: 1.00, duracion: 1.00 },
  east:   { atenciones: 0.88, espera: 0.95, duracion: 0.97 },
  west:   { atenciones: 1.12, espera: 1.08, duracion: 1.03 },
};
const CHANNEL_FACTORS = {
  inperson: { atenciones: 1.00, espera: 1.00, duracion: 1.00 },
  virtual:  { atenciones: 0.75, espera: 0.70, duracion: 0.85 },
};

export default function MedicalIndicatorsPage() {
  /* ---------- Shell y rol ---------- */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const userRole = "doctor";

  /* ------------------ Filtros globales ------------------ */
  const [filters, setFilters] = useState({
    from: isoDaysAgo(30),
    to: isoToday(),
    locationId: "main",
    channel: "inperson",
  });

  /* --------- Factores combinados según sede y canal (mock reactivo) --------- */
  const factors = useMemo(() => {
    const lf = LOCATION_FACTORS[filters.locationId] || LOCATION_FACTORS.main;
    const cf = CHANNEL_FACTORS[filters.channel] || CHANNEL_FACTORS.inperson;
    return {
      atenciones: +(lf.atenciones * cf.atenciones).toFixed(2),
      espera:     +(lf.espera     * cf.espera).toFixed(2),
      duracion:   +(lf.duracion   * cf.duracion).toFixed(2),
    };
  }, [filters.locationId, filters.channel]);

  /* ------------------ Cola (mock) dependiente de filtros ------------------ */
  const clinic = useMemo(() => ({
    factors,
    queue: [
      { name: "Carlos R.", status: "En espera" },
      { name: "Ana M.", status: "En consulta" },
      { name: "Luis P.", status: "Completado" },
    ],
  }), [factors]);

  /* ------------------ Tabs y búsqueda de paciente ------------------ */
  const [tab, setTab] = useState("global");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isPatientViewActive, setIsPatientViewActive] = useState(false);

  const handlePatientSearch = useCallback(() => {
    if (selectedPatientId.trim() !== "") setIsPatientViewActive(true);
    else setIsPatientViewActive(false);
  }, [selectedPatientId]);

  /* ------------------ KPIs y Series (Global) ------------------ */
  const baseKpis = useMemo(
    () => ({
      atenciones: Math.round(856 * factors.atenciones),
      pacientesUnicos: 499, // fijo en mock
      asistenciaPct: 80.9,
      cancelacionPct: 16.5,
      esperaMin: Math.round(17 * factors.espera),
      duracionMin: Math.round(22 * factors.duracion),
    }),
    [factors]
  );

  const kpis = useMemo(() => [
    { label: "Atenciones", value: baseKpis.atenciones, deltaPct: +6.2, trend: "up" },
    { label: "Pacientes únicos", value: baseKpis.pacientesUnicos, deltaPct: +3.1, trend: "up" },
    { label: "Asistencia", value: `${baseKpis.asistenciaPct.toFixed(1)}%`, deltaPct: +1.2, trend: "up" },
    { label: "Cancelación", value: `${baseKpis.cancelacionPct.toFixed(1)}%`, deltaPct: -0.7, trend: "down" },
    { label: "Espera (min)", value: baseKpis.esperaMin, deltaPct: -8.0, trend: "down" },
    { label: "Duración (min)", value: baseKpis.duracionMin, deltaPct: +0.3, trend: "flat" },
  ], [baseKpis]);

  const rawSeries = useMemo(() => {
    const days = seqDays(filters.from, filters.to);
    const fA = factors.atenciones;
    const fE = factors.espera;
    const fD = factors.duracion;
    return [
      { label: "Atenciones", data: days.map((d, i) => ({ x: d, y: Math.round((30 + ((i * 7) % 18)) * fA) })) },
      { label: "Espera (min)", data: days.map((d, i) => ({ x: d, y: Math.round((10 + ((i * 5) % 9)) * fE) })) },
      { label: "Duración consulta (min)", data: days.map((d, i) => ({ x: d, y: Math.round((18 + ((i * 3) % 7)) * fD) })) },
    ];
  }, [filters.from, filters.to, factors]);

  const performanceBars = useMemo(() => {
    const sum = (arr) => arr.reduce((s, p) => s + (p?.y ?? 0), 0);
    return rawSeries.map((s) => ({ label: s.label, value: sum(s.data) }));
  }, [rawSeries]);

  const { matrix, xLabels, yLabels } = useMemo(() => {
    const hours = Array.from({ length: 14 }, (_, i) => 7 + i);
    const week = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
    const f = factors.atenciones;
    const m = week.map(() =>
      hours.map((_, h) => Math.floor((Math.sin(h) + 1.5) * 4 * f + Math.random() * 2))
    );
    return {
      matrix: m,
      xLabels: hours.map((h) => `${String(h).padStart(2, "0")}:00`),
      yLabels: week,
    };
  }, [factors, filters.from, filters.to]);

  const queueItems = useMemo(() => clinic.queue, [clinic]);

  const satisfaction = useMemo(
    () => ({
      nps: seqDays(isoDaysAgo(30), isoToday()).map((d, i) => ({ x: d, y: 30 + ((i * 11) % 40) })),
      csat: seqDays(isoDaysAgo(30), isoToday()).map((d, i) => ({ x: d, y: 3.8 + ((i % 4) * 0.1) })),
      reasons: [
        { reason: "Tiempo de espera", count: 18 },
        { reason: "Atención del médico", count: 44 },
        { reason: "Costos", count: 11 },
        { reason: "Instalaciones", count: 7 },
      ],
    }),
    []
  );

  /* ------------------ Journey paciente (solo si está activo) ------------------ */
  const journeyItems = useMemo(() =>
    isPatientViewActive ? [
      { type: "appointment", at: isoDaysAgo(25), title: "Consulta general", status: "completed", meta: { doctor: "Dr. C. Mendoza" } },
      { type: "diagnosis",  at: isoDaysAgo(25), title: "HTA (I10)",        status: "confirmed" },
      { type: "rx",         at: isoDaysAgo(25), title: "Losartán 50mg",    status: "active" },
      { type: "lab",        at: isoDaysAgo(17), title: "Perfil lipídico",  status: "completed" },
      { type: "appointment",at: isoDaysAgo(10), title: "Control",          status: "completed", meta: { waitMin: 12, durationMin: 18 } },
      { type: "note",       at: isoDaysAgo(10), title: "Recomendar dieta DASH", status: "added" },
      { type: "referral",   at: isoDaysAgo(8),  title: "Cardiología",      status: "sent" },
      { type: "appointment",at: isoDaysAgo(2),  title: "Seguimiento",      status: "no_show" },
    ] : []
  , [isPatientViewActive]);

  const journeyLegible = useMemo(
    () => journeyItems.map((it) => ({
      ...it,
      title: `${TYPE_LABEL[it.type] ?? it.type} · ${it.title}`,
      status: STATUS_LABEL[it.status] ?? it.status,
      at: fmtDateTime(it.at),
    })),
    [journeyItems]
  );

  const qualityKpis = useMemo(
    () => isPatientViewActive ? [
      { label: "Asistencia a control 90d", value: "66%", target: "≥70%", status: "warn" },
      { label: "PA controlada (<140/90)", value: "72%", target: "≥75%", status: "ok" },
      { label: "IMC", value: "27.8", target: "18.5–24.9", status: "warn" },
      { label: "Reingreso 30d", value: "0", target: "0", status: "ok" },
    ] : [],
    [isPatientViewActive]
  );

  return (
    <div className="min-h-screen bg-background med-indicators">
      {/* Estilos finos para inputs/selects en dark/light */}
      <style>{`
        .med-indicators input[type="date"],
        .med-indicators select {
          background: var(--background);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          outline: none;
        }
        .med-indicators input[type="date"]::placeholder { color: var(--muted-foreground); }
        .med-indicators input[type="date"]:focus,
        .med-indicators select:focus {
          box-shadow: 0 0 0 2px rgba(99,102,241,0.3);
        }
        .dark .med-indicators input[type="date"],
        .dark .med-indicators select {
          background: var(--card);
          color: var(--foreground);
          border-color: var(--border);
        }
      `}</style>

      <Header
        userRole={userRole}
        isAuthenticated
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Encabezado y tabs */}
          <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Indicadores Médicos</h1>
                <p className="text-sm text-muted-foreground">Estadística global y seguimiento individual</p>
              </div>

              <div className="inline-flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setTab("global")}
                  className={`px-3 py-2 text-sm ${tab === "global" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  Visión global
                </button>
                <button
                  onClick={() => setTab("patient")}
                  className={`px-3 py-2 text-sm ${tab === "patient" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                >
                  Por paciente
                </button>
              </div>
            </div>
          </div>

          {/* --------------------- GLOBAL --------------------- */}
          {tab === "global" && (
            <>
              {/* Filtros controlados */}
              <div className="bg-card border border-border rounded-lg p-4 sm:p-5 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-center">
                  <div className="lg:col-span-3">
                    <GlobalControls
                      value={filters}
                      onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
                    />
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
                {kpis.map((k) => (
                  <KPIMetricsCard key={k.label} {...k} />
                ))}
              </section>

              {/* Rendimiento + Cola */}
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">Rendimiento clínico-operativo</h3>
                    <p className="text-xs text-muted-foreground">Volumen total por métrica</p>
                  </div>
                  <PerformanceAnalytics series={performanceBars} />
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">Cola de pacientes (hoy)</h3>
                    <p className="text-xs text-muted-foreground">Estado en vivo</p>
                  </div>
                  <LivePatientQueue items={queueItems} />
                </div>
              </section>

              {/* Heatmap + Satisfacción */}
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">Mapa de calor de atención</h3>
                    <p className="text-xs text-muted-foreground">Días y horas con mayor carga</p>
                  </div>
                  <PatientFlowHeatmap matrix={matrix} xLabels={xLabels} yLabels={yLabels} />
                </div>

                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold">Tendencias de satisfacción</h3>
                    <p className="text-xs text-muted-foreground">Recomendación (NPS), Satisfacción (CSAT) y motivos</p>
                  </div>
                  <SatisfactionTrendsChart
                    nps={satisfaction.nps}
                    csat={satisfaction.csat}
                    reasons={satisfaction.reasons}
                  />
                  <div className="mt-3 rounded-md bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Glosario</div>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li><span className="text-foreground font-medium">NPS</span>: disposición a recomendar (–100 a 100).</li>
                      <li><span className="text-foreground font-medium">CSAT</span>: satisfacción promedio (1–5).</li>
                      <li><span className="text-foreground font-medium">Motivos</span>: razones frecuentes que afectan la experiencia.</li>
                    </ul>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* --------------------- POR PACIENTE --------------------- */}
          {tab === "patient" && (
            <section className="space-y-6">
              {/* Búsqueda paciente */}
              <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium">Paciente</label>
                <input
                  className="bg-background text-foreground placeholder:text-muted-foreground border border-border rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="ID o nombre (mock)"
                  value={selectedPatientId}
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    setIsPatientViewActive(false);
                  }}
                />
                <button
                  onClick={handlePatientSearch}
                  disabled={selectedPatientId.trim() === ""}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    selectedPatientId.trim() === ""
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  Buscar Recorrido
                </button>
                <span className="text-xs text-muted-foreground">Usa cualquier valor para activar en demo</span>
              </div>

              {/* Contenido condicional */}
              {isPatientViewActive ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Recorrido (2/3) */}
                  <div className="xl:col-span-2 bg-card rounded-lg border border-border p-4">
                    <h3 className="text-lg font-semibold mb-3">Recorrido del paciente</h3>
                    <PatientJourneyFlow items={journeyLegible} />
                  </div>

                  {/* KPIs calidad + satisfacción (1/3) */}
                  <div className="space-y-3">
                    {qualityKpis.map((q) => (
                      <QualityKPICard key={q.label} {...q} />
                    ))}
                    <div className="bg-card rounded-lg border border-border p-4">
                      <h4 className="text-sm font-semibold mb-2">Satisfacción del paciente</h4>
                      <SatisfactionTrendsChart
                        nps={satisfaction.nps.slice(-10)}
                        csat={satisfaction.csat.slice(-10)}
                        reasons={satisfaction.reasons}
                        compact
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
                  <h3 className="text-base font-semibold">Seleccione un paciente y haga clic en "Buscar Recorrido" para visualizar sus indicadores.</h3>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
