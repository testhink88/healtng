import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { getClinicDashboardSnapshot } from "@/api/analytics";
import { RoleGuard } from "@/features/auth";

const ClinicDashboard = () => {
  const navigate = useNavigate();

  // 1. ROLE Y PERFIL DE CLÍNICA
  const [userRole] = useState(localStorage.getItem("userRole") || "clinic");
  const [clinicProfile, setClinicProfile] = useState({
    clinicName: "",
    address: "",
    clinicState: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("clinicProfile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setClinicProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("No se pudo leer clinicProfile de localStorage", e);
    }
  }, []);

  const clinicDisplayName = useMemo(() => clinicProfile.clinicName || "Tu Clínica", [clinicProfile.clinicName]);

  // 2. ESTADO UI
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // KPIs mock
  const [dashboardData, setDashboardData] = useState({
    lowStockItems: 0,
    expiringItems: 0,
    openOrders: 0,
    openOrdersValue: 0, // opcional si api lo trae
    todayAppointments: 0,
    monthlyRevenue: 0,
    staffUtilization: 0, // lo usamos como “capacidad usada” (executive)
    spaceOccupancy: 0,

    // gerencial
    todayScheduled: 0,
    todayAttended: 0,
    todayCancelled: 0,
    waitingTimeAvg: 0,

    // targets
    waitingTimeTarget: 10,
    attentionRateTarget: 0.7,
    spaceOccupancyTarget: 75,
    staffUtilizationTarget: 80,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const snapshot = await getClinicDashboardSnapshot();
        if (!cancelled && snapshot) setDashboardData((prev) => ({ ...prev, ...snapshot }));
      } catch (err) {
        console.error("Error cargando KPIs de clínica:", err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // 3. NAVEGACIONES PRINCIPALES
  const handleNavigateToInventory = () => navigate("/clinic/inventory");
  const handleNavigateToOrders = () => navigate("/clinic/purchase-orders");
  const handleNavigateToSpaces = () => navigate("/clinic/spaces");

  // ✅ ruta correcta para agenda de clínica
  const handleNavigateToAgenda = () => navigate("/clinic/appointments");

  const handleNavigateToOperations = () => navigate("/clinic/operations");

  // 4. COMPONENTES UI INTERNOS
  const KPICard = ({ title, value, subtitle, icon, variant = "default", onClick }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "warning":
          return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
        case "danger":
          return "bg-red-50 border-red-200 hover:bg-red-100";
        case "success":
          return "bg-green-50 border-green-200 hover:bg-green-100";
        default:
          return "bg-white border-gray-200 hover:bg-gray-50";
      }
    };

    return (
      <div
        className={`p-6 rounded-lg border transition-colors cursor-pointer ${getVariantClasses()}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? onClick?.() : null)}
      >
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 break-words">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-full bg-primary/10 shrink-0">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
        </div>
      </div>
    );
  };

  const MiniIndicator = ({ label, value, icon, tone = "default", onClick }) => {
    const cls =
      tone === "danger"
        ? "border-rose-200 bg-rose-50"
        : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : tone === "success"
        ? "border-emerald-200 bg-emerald-50"
        : "border-gray-200 bg-white";

    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full text-left rounded-xl border p-4 hover:bg-gray-50 transition ${cls}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          <Icon name={icon} size={16} className="text-gray-500" />
        </div>
        <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
      </button>
    );
  };

  // 5. LÓGICA GERENCIAL
  const scheduled = Number(dashboardData?.todayScheduled ?? dashboardData?.todayAppointments ?? 0);
  const attended = Number(dashboardData?.todayAttended ?? 0);
  const cancelled = Number(dashboardData?.todayCancelled ?? 0);

  const attentionRate = useMemo(() => {
    if (!scheduled) return 0;
    return attended / scheduled;
  }, [attended, scheduled]);

  const attentionPct = Math.round(attentionRate * 100);

  const attentionVariant = attentionRate >= 0.75 ? "success" : attentionRate >= 0.6 ? "warning" : "danger";

  const waitingAvg = Number(dashboardData?.waitingTimeAvg ?? 0);
  const waitingTarget = Number(dashboardData?.waitingTimeTarget ?? 10);
  const waitingDelta = waitingAvg - waitingTarget;

  const waitingVariant = waitingDelta <= 0 ? "success" : waitingDelta <= 5 ? "warning" : "danger";

  const risk = useMemo(() => {
    let score = 0;

    if (attentionRate < Number(dashboardData?.attentionRateTarget ?? 0.7)) score += 2;
    if (waitingDelta > 5) score += 2;
    if (Number(dashboardData?.lowStockItems ?? 0) > 0) score += 2;
    if (Number(dashboardData?.expiringItems ?? 0) > 0) score += 1;
    if (Number(dashboardData?.spaceOccupancy ?? 0) > Number(dashboardData?.spaceOccupancyTarget ?? 75)) score += 1;
    if (Number(dashboardData?.staffUtilization ?? 0) > 90) score += 1;

    if (score >= 5) {
      return { label: "Riesgo alto", variant: "danger", hint: "Probables retrasos y fricción en atención." };
    }
    if (score >= 3) {
      return { label: "Presión operativa", variant: "warning", hint: "Operación estable, pero con puntos sensibles." };
    }
    return { label: "Operación estable", variant: "success", hint: "Flujo controlado sin riesgos críticos." };
  }, [attentionRate, waitingDelta, dashboardData]);

  const narrativeAlerts = useMemo(() => {
    const a = [];

    if (scheduled > 0) {
      a.push({
        icon: "Target",
        title: "Atención efectiva del día",
        text: `${attended}/${scheduled} (${attentionPct}%).`,
        cta: "Ver agenda",
        onClick: handleNavigateToAgenda,
      });
    }

    if (waitingDelta > 0) {
      a.push({
        icon: "Clock",
        title: "Tiempo de espera por encima del objetivo",
        text: `Objetivo ${waitingTarget} min → Actual ${waitingAvg} min (+${waitingDelta} min).`,
        cta: "Ver operaciones",
        onClick: handleNavigateToOperations,
      });
    }

    if (Number(dashboardData?.lowStockItems ?? 0) > 0) {
      a.push({
        icon: "AlertTriangle",
        title: "Riesgo de insumos",
        text: `⚠ ${dashboardData.lowStockItems} insumos críticos podrían afectar la agenda de mañana.`,
        cta: "Revisar inventario",
        onClick: handleNavigateToInventory,
      });
    }

    if (Number(dashboardData?.openOrders ?? 0) > 0) {
      a.push({
        icon: "ShoppingCart",
        title: "Abastecimiento en curso",
        text: `Tienes ${dashboardData.openOrders} órdenes abiertas. Si retrasan, presionan stock crítico.`,
        cta: "Ver compras",
        onClick: handleNavigateToOrders,
      });
    }

    if (cancelled > 0) {
      a.push({
        icon: "XCircle",
        title: "Cancelaciones hoy",
        text: `${cancelled} cita(s) cancelada(s). Impacto directo en productividad del día.`,
        cta: "Ver agenda",
        onClick: handleNavigateToAgenda,
      });
    }

    return a.slice(0, 4);
  }, [
    scheduled,
    attended,
    cancelled,
    attentionPct,
    waitingDelta,
    waitingTarget,
    waitingAvg,
    dashboardData,
    handleNavigateToAgenda,
    handleNavigateToInventory,
    handleNavigateToOrders,
    handleNavigateToOperations,
  ]);

  // ✅ (5) Bloque único “Indicadores clave”
  const keyIndicators = useMemo(() => {
    const capacityUsed = Number(dashboardData?.staffUtilization ?? 0);
    const stockCritical = Number(dashboardData?.lowStockItems ?? 0);
    const openOrders = Number(dashboardData?.openOrders ?? 0);
    const openOrdersValue =
      Number(dashboardData?.openOrdersValue ?? 0) || (openOrders ? openOrders * 250 : 0); // fallback demo

    return {
      attention: scheduled ? `${attended}/${scheduled} (${attentionPct}%)` : "—",
      waiting: `${waitingAvg} min (Δ ${waitingDelta >= 0 ? "+" : ""}${waitingDelta})`,
      capacity: `${capacityUsed}%`,
      stock: `${stockCritical} críticos`,
      orders: `$${openOrdersValue.toFixed(0)} (${openOrders})`,
      semaphore: risk.label,
      tones: {
        attention: attentionVariant,
        waiting: waitingVariant,
        capacity: capacityUsed >= 90 ? "warning" : "default",
        stock: stockCritical > 0 ? "danger" : "success",
        orders: openOrders > 0 ? "warning" : "default",
        semaphore: risk.variant,
      },
    };
  }, [dashboardData, scheduled, attended, attentionPct, waitingAvg, waitingDelta, risk, attentionVariant, waitingVariant]);

  return (
    <RoleGuard allowedRoles={["clinic", "clinic_admin"]}>
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} onMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <Sidebar
          userRole={userRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="p-6 space-y-6">
            {/* HERO */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="Building2" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hoy en la Clínica</p>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{clinicDisplayName}</h1>
                  <p className="text-sm text-gray-500">Vista operativa del día: citas, flujo y recursos críticos.</p>
                </div>
              </div>

              <div className="flex gap-6 text-sm text-gray-600">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Citas Hoy</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.todayAppointments}</p>
                </div>
                <div className="hidden sm:block h-10 w-px bg-gray-200 self-center" />
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Ocupación de Salas</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.spaceOccupancy}%</p>
                </div>
              </div>
            </section>

            {/* ✅ (5) Indicadores clave */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
              <MiniIndicator label="Atención efectiva" value={keyIndicators.attention} icon="Target" tone={keyIndicators.tones.attention} onClick={handleNavigateToAgenda} />
              <MiniIndicator label="Espera vs objetivo" value={keyIndicators.waiting} icon="Clock" tone={keyIndicators.tones.waiting} onClick={handleNavigateToOperations} />
              <MiniIndicator label="Capacidad usada" value={keyIndicators.capacity} icon="Gauge" tone={keyIndicators.tones.capacity} onClick={handleNavigateToAgenda} />
              <MiniIndicator label="Stock crítico" value={keyIndicators.stock} icon="AlertTriangle" tone={keyIndicators.tones.stock} onClick={handleNavigateToInventory} />
              <MiniIndicator label="Órdenes abiertas ($)" value={keyIndicators.orders} icon="ShoppingCart" tone={keyIndicators.tones.orders} onClick={handleNavigateToOrders} />
              <MiniIndicator label="Semáforo" value={keyIndicators.semaphore} icon="ShieldCheck" tone={keyIndicators.tones.semaphore} onClick={handleNavigateToOperations} />
            </section>

            {/* GERENCIAL: KPIs */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <KPICard
                title="Atención efectiva del día"
                value={scheduled ? `${attended}/${scheduled} (${attentionPct}%)` : "—"}
                subtitle={`Objetivo: ${Math.round(Number(dashboardData?.attentionRateTarget ?? 0.7) * 100)}%`}
                icon="Target"
                variant={attentionVariant}
                onClick={handleNavigateToAgenda}
              />

              <KPICard
                title="Tiempo de espera vs objetivo"
                value={`${waitingAvg} min`}
                subtitle={`Objetivo: ${waitingTarget} min • Delta: ${waitingDelta >= 0 ? "+" : ""}${waitingDelta} min`}
                icon="Clock"
                variant={waitingVariant}
                onClick={handleNavigateToOperations}
              />

              <KPICard
                title="Semáforo de riesgo operativo"
                value={risk.label}
                subtitle={risk.hint}
                icon="ShieldCheck"
                variant={risk.variant}
                onClick={handleNavigateToOperations}
              />
            </section>

            {/* ALERTAS NARRATIVAS */}
            <section className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Alertas ejecutivas</h2>
                <Button variant="outline" onClick={handleNavigateToOperations}>
                  Ver en tiempo real
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {narrativeAlerts.map((x, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer"
                    onClick={x.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " " ? x.onClick?.() : null)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={x.icon} size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{x.title}</p>
                      <p className="text-sm text-gray-600">{x.text}</p>
                      <p className="text-xs text-primary font-semibold mt-2">{x.cta} →</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* (otros bloques abajo si quieres) */}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
};

export default ClinicDashboard;
