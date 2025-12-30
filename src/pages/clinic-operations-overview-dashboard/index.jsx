import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// API fake
import { getClinicOperationsSnapshot } from "@/api/analytics";

// Componentes ligeros
import ClinicHeatmapMini from "./components/ClinicHeatmapMini";
import ClinicPerformanceMini from "./components/ClinicPerformanceMini";
import ClinicAppointmentsFeedMini from "./components/ClinicAppointmentsFeedMini";

const clampNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toneFromDelta = (delta, betterWhenLower = false) => {
  // betterWhenLower: true (espera), false (ingresos/flujo)
  if (betterWhenLower) {
    if (delta <= 0) return "success";
    if (delta <= 5) return "warning";
    return "danger";
  }
  if (delta >= 0) return "success";
  if (delta >= -5) return "warning";
  return "danger";
};

const CompareKPI = ({
  title,
  actual,
  target,
  unit = "",
  icon = "Target",
  betterWhenLower = false,
}) => {
  const a = clampNum(actual, 0);
  const t = clampNum(target, 0);
  const delta = a - t;

  const tone = toneFromDelta(delta, betterWhenLower);
  const toneCls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : "border-rose-200 bg-rose-50";

  const deltaStr =
    delta === 0 ? "0" : delta > 0 ? `+${delta.toFixed(0)}` : `${delta.toFixed(0)}`;

  return (
    <div className={`rounded-xl border p-5 ${toneCls}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">
          <Icon name={icon} size={18} className="text-gray-700" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[11px] text-gray-500">Actual</p>
          <p className="text-lg font-bold text-gray-900">
            {a.toLocaleString()}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Objetivo</p>
          <p className="text-lg font-bold text-gray-900">
            {t.toLocaleString()}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-gray-500">Delta</p>
          <p className="text-lg font-bold text-gray-900">
            {deltaStr}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

const ClinicOperationsOverviewDashboard = () => {
  const navigate = useNavigate();

  const [userRole] = useState(localStorage.getItem("userRole") || "clinic");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [data, setData] = useState({
    liveRevenue: 0,
    waitingTimeAvg: 0,
    patientsInFlow: 0,

    // extras (si el api fake los trae)
    liveRevenueTarget: 1200,
    waitingTimeTarget: 10,
    patientsInFlowTarget: 25,

    // opcional: capacidad/huecos (si luego lo conectas)
    capacityUsedPct: 0,
    capacityTargetPct: 80,
    deadMinutes: 0,
    deadMinutesTarget: 120,

    roomsHeatmap: [],
    appointmentsFeed: [],
    performance: {},
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const snapshot = await getClinicOperationsSnapshot();
        if (!cancelled && snapshot) setData((p) => ({ ...p, ...snapshot }));
      } catch (e) {
        console.error("ClinicOperations snapshot error:", e);
      }
    };

    load();
    const t = setInterval(load, 15000);

    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  const derived = useMemo(() => {
    // fallback targets si el snapshot no los trae
    const liveRevenueTarget = clampNum(data.liveRevenueTarget, 1200);
    const waitingTimeTarget = clampNum(data.waitingTimeTarget, 10);
    const patientsInFlowTarget = clampNum(data.patientsInFlowTarget, 25);

    const capacityTargetPct = clampNum(data.capacityTargetPct, 80);
    const deadMinutesTarget = clampNum(data.deadMinutesTarget, 120);

    return {
      liveRevenueTarget,
      waitingTimeTarget,
      patientsInFlowTarget,
      capacityTargetPct,
      deadMinutesTarget,
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* HERO */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Activity" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Panel de Operaciones
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Operación en tiempo real
                </h1>
                <p className="text-sm text-gray-500">
                  Flujo de pacientes, citas y ocupación de salas.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/clinic-dashboard")}>
                Volver a Gerencia
              </Button>
              <Button onClick={() => navigate("/clinic/management")}>Modo Condominio</Button>
            </div>
          </section>

          {/* ✅ (1) Panel Comparativa vs Objetivo */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CompareKPI
              title="Ingresos Live"
              actual={data.liveRevenue}
              target={derived.liveRevenueTarget}
              unit="USD"
              icon="DollarSign"
              betterWhenLower={false}
            />
            <CompareKPI
              title="Tiempo de espera"
              actual={data.waitingTimeAvg}
              target={derived.waitingTimeTarget}
              unit="min"
              icon="Clock"
              betterWhenLower={true}
            />
            <CompareKPI
              title="Pacientes en flujo"
              actual={data.patientsInFlow}
              target={derived.patientsInFlowTarget}
              unit=""
              icon="Users"
              betterWhenLower={false}
            />
          </section>

          {/* (extra opcional) si ya quieres mostrar capacidad/huecos aquí */}
          {(clampNum(data.capacityUsedPct, 0) > 0 || clampNum(data.deadMinutes, 0) > 0) && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CompareKPI
                title="Capacidad usada"
                actual={data.capacityUsedPct}
                target={derived.capacityTargetPct}
                unit="%"
                icon="Gauge"
                betterWhenLower={false}
              />
              <CompareKPI
                title="Huecos muertos"
                actual={data.deadMinutes}
                target={derived.deadMinutesTarget}
                unit="min"
                icon="Timer"
                betterWhenLower={true}
              />
            </section>
          )}

          {/* PERFORMANCE MINI */}
          <ClinicPerformanceMini data={data.performance} />

          {/* HEATMAP MINI */}
          <ClinicHeatmapMini rooms={data.roomsHeatmap} />

          {/* FEED MINI */}
          <ClinicAppointmentsFeedMini items={data.appointmentsFeed} />
        </div>
      </main>
    </div>
  );
};

export default ClinicOperationsOverviewDashboard;
