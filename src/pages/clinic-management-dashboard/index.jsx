import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { getClinicManagementSnapshot } from "@/api/analytics";

const ClinicManagementDashboard = () => {
  const navigate = useNavigate();

  const [userRole] = useState(localStorage.getItem("userRole") || "clinic");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ✅ Shape alineado a tu analytics.js actual
  const [data, setData] = useState({
    sites: 1,
    totalStaff: 0,
    complianceScore: 0,
    monthlyCost: 0,
    procurementOpen: 0,
    occupancyGlobal: 0, // 0-1
    financeSnapshot: { revenue: 0, costs: 0 }, // derivado opcional
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const snapshot = await getClinicManagementSnapshot();

        if (cancelled || !snapshot) return;

        const monthlyCost = Number(snapshot.monthlyCost || 0);

        // ✅ Derivados para no perder tu bloque financiero
        const financeSnapshot = {
          // Mock de ingresos basado en un margen simple.
          // Puedes cambiar la lógica luego.
          revenue: Math.round(monthlyCost * 1.35),
          costs: monthlyCost,
        };

        setData({
          sites: snapshot.sites ?? 1,
          totalStaff: snapshot.totalStaff ?? 0,
          complianceScore: snapshot.complianceScore ?? 0,
          monthlyCost,
          procurementOpen: snapshot.procurementOpen ?? 0,
          occupancyGlobal: snapshot.occupancyGlobal ?? 0,
          financeSnapshot,
        });
      } catch (e) {
        console.error("ClinicManagement snapshot error:", e);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const occupancyPct = Math.round((data.occupancyGlobal || 0) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
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
                <Icon name="Building" size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Modo Condominio
                </p>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Administración global de la clínica
                </h1>
                <p className="text-sm text-gray-500">
                  Múltiples sedes, cumplimiento, finanzas y control operativo.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/clinic-dashboard")}
              >
                Hoy en la Clínica
              </Button>
              <Button onClick={() => navigate("/clinic/operations")}>
                Panel de Operaciones
              </Button>
            </div>
          </section>

          {/* KPIs */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Sedes
              </p>
              <p className="text-2xl font-bold text-gray-900">{data.sites}</p>
            </div>

            <div className="bg-white rounded-xl border p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Ocupación global
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {occupancyPct}%
              </p>
            </div>

            <div className="bg-white rounded-xl border p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Cumplimiento
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.complianceScore}%
              </p>
            </div>

            <div className="bg-white rounded-xl border p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Compras abiertas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data.procurementOpen}
              </p>
            </div>
          </section>

          {/* RESUMEN FINANCIERO */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Resumen financiero (mock)
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 border rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Ingresos estimados
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ${Number(data.financeSnapshot?.revenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex-1 border rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Costos mensuales
                </p>
                <p className="text-xl font-bold text-gray-900">
                  ${Number(data.financeSnapshot?.costs || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Personal total
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {data.totalStaff}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Costo operativo base
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  ${Number(data.monthlyCost || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* ACCESOS DIRECTOS */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Accesos directos de administración
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/clinic/inventory")}
              >
                Inventario Global
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/clinic/purchase-orders")}
              >
                Órdenes de Compra
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/marketplace/b2b")}
              >
                Abastecer en B2B
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ClinicManagementDashboard;
