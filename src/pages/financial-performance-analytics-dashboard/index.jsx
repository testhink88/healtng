// src/pages/financial-performance-analytics-dashboard/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

import {
  getARSummary,
  getDPR,
  getAgingByPayer,
  getCollectionBottlenecks,
} from "@/api/finance/ar";

import { fetchFinanceOrders } from "@/api/finance/orders";

const Tarjeta = ({ children, className = "" }) => (
  <div className={`bg-card border border-border rounded-xl ${className}`}>{children}</div>
);

const formatearDinero = (n, moneda = "USD") => {
  const v = Number(n || 0);
  // Mantengo simple para demo (sin Intl por si quieres control total)
  const simbolo = moneda === "USD" ? "$" : "";
  return `${simbolo}${v.toFixed(2)}`;
};

export default function AnalisisFinanciero() {
  const [rol] = useState(() => localStorage.getItem("userRole") || "clinic");
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [sidebarMovilAbierto, setSidebarMovilAbierto] = useState(false);

  // Si luego guardas clinic_id real en perfil, lo tomamos de allí.
  const clinicId = useMemo(() => {
    // Intento: usar un perfil de clínica si existe
    try {
      const raw = localStorage.getItem("demoClinicProfile") || localStorage.getItem("healtng_profile_clinic");
      const parsed = raw ? JSON.parse(raw) : null;
      // si tu perfil tiene id, úsalo. Si no, cae a demo.
      return parsed?.clinic_id || parsed?.id || "CLINIC-001";
    } catch {
      return "CLINIC-001";
    }
  }, []);

  const [cargando, setCargando] = useState(true);

  const [resumenAR, setResumenAR] = useState({ total_accounts_receivable: 0, open_orders: 0 });
  const [dpr, setDpr] = useState(0);
  const [aging, setAging] = useState([]);
  const [gargalos, setGargalos] = useState([]);

  // KPIs “CFO” derivados de órdenes financieras (ingresos, ticket promedio, tasa de cobro)
  const [kpiCFO, setKpiCFO] = useState({
    ingresosTotales: 0,
    valorPromedioTransaccion: 0,
    tasaCobro: 0, // 0..1
  });

  const recargar = async () => {
    setCargando(true);
    try {
      // 1) AR
      const [rAR, rDPR, rAging, rGargalos] = await Promise.all([
        getARSummary(clinicId),
        getDPR(clinicId),
        getAgingByPayer(clinicId),
        getCollectionBottlenecks(clinicId),
      ]);

      setResumenAR(rAR);
      setDpr(rDPR);
      setAging(rAging);
      setGargalos(rGargalos);

      // 2) KPIs CFO (ingresos / ticket / tasa de cobro)
      const ordenes = await fetchFinanceOrders({ clinic_id: clinicId });
      const total = ordenes.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

      const cobradas = ordenes.filter((o) => o.status === "paid");
      const totalCobradas = cobradas.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

      const tasaCobro = total > 0 ? totalCobradas / total : 0;
      const valorPromedio = ordenes.length ? total / ordenes.length : 0;

      setKpiCFO({
        ingresosTotales: total,
        valorPromedioTransaccion: valorPromedio,
        tasaCobro,
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicId]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={rol} onMenuToggle={() => setSidebarMovilAbierto(true)} />
      <Sidebar
        userRole={rol}
        isCollapsed={sidebarColapsado}
        onToggleCollapse={() => setSidebarColapsado((v) => !v)}
        isMobileOpen={sidebarMovilAbierto}
        onMobileClose={() => setSidebarMovilAbierto(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarColapsado ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4">
          {/* Encabezado */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Análisis de Rendimiento Financiero</h1>
              <p className="text-muted-foreground">
                Seguimiento de ingresos, cobranza y cuentas por cobrar (nivel gerencial).
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Clínica: <span className="font-medium text-foreground">{clinicId}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={recargar} className="gap-2">
                <Icon name="RefreshCcw" size={16} />
                Actualizar
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.alert("Exportación PDF/Excel: conectar cuando tengas necesidad real.")}
                className="gap-2"
              >
                <Icon name="Download" size={16} />
                Exportar
              </Button>
            </div>
          </div>

          {/* KPIs estilo CFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Ingresos Totales (período)</p>
              <p className="text-2xl font-semibold mt-1">{formatearDinero(kpiCFO.ingresosTotales)}</p>
              <p className="text-xs text-muted-foreground mt-2">Base: órdenes financieras unificadas</p>
            </Tarjeta>

            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Valor Promedio por Transacción</p>
              <p className="text-2xl font-semibold mt-1">{formatearDinero(kpiCFO.valorPromedioTransaccion)}</p>
              <p className="text-xs text-muted-foreground mt-2">Ticket promedio (caja/seguro)</p>
            </Tarjeta>

            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Tasa de Cobro</p>
              <p className="text-2xl font-semibold mt-1">{(kpiCFO.tasaCobro * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-2">Monto cobrado / monto facturado</p>
            </Tarjeta>
          </div>

          {/* KPIs AR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Cuentas por Cobrar Pendientes</p>
              <p className="text-2xl font-semibold mt-1">{formatearDinero(resumenAR.total_accounts_receivable)}</p>
              <p className="text-xs text-muted-foreground mt-2">Órdenes abiertas: {resumenAR.open_orders}</p>
            </Tarjeta>

            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Días Promedio de Reembolso (DPR)</p>
              <p className="text-2xl font-semibold mt-1">{Number(dpr || 0).toFixed(0)} días</p>
              <p className="text-xs text-muted-foreground mt-2">Promedio: facturación → cobro (seguros)</p>
            </Tarjeta>

            <Tarjeta className="p-4">
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="text-2xl font-semibold mt-1">{cargando ? "Cargando…" : "Actualizado"}</p>
              <p className="text-xs text-muted-foreground mt-2">Datos mock (prototipo)</p>
            </Tarjeta>
          </div>

          {/* Aging por Aseguradora */}
          <Tarjeta className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Aging de Cuentas por Cobrar (por aseguradora)</h2>
                <p className="text-sm text-muted-foreground">
                  Cuánto dinero está retenido y cuántos días lleva en mora (promedio).
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Aseguradora</th>
                    <th className="text-left font-medium px-3 py-2">Monto pendiente</th>
                    <th className="text-left font-medium px-3 py-2">Días promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {aging.map((r) => (
                    <tr key={r.payer} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">{r.payer}</td>
                      <td className="px-3 py-2">{formatearDinero(r.total_amount)}</td>
                      <td className="px-3 py-2">{Number(r.avg_days || 0).toFixed(0)} días</td>
                    </tr>
                  ))}
                  {aging.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                        No hay data de aseguradoras en “por cobrar”. (Sembrar órdenes financieras demo)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tarjeta>

          {/* Gargalos de cobranza */}
          <Tarjeta className="p-4">
            <h2 className="text-lg font-semibold text-foreground">Gargalos de Cobranza</h2>
            <p className="text-sm text-muted-foreground">
              Servicios/categorías donde más dinero queda pendiente (útil para auditoría y optimización).
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Servicio / Categoría</th>
                    <th className="text-left font-medium px-3 py-2">Monto pendiente</th>
                    <th className="text-left font-medium px-3 py-2">Órdenes</th>
                  </tr>
                </thead>
                <tbody>
                  {gargalos.map((r) => (
                    <tr key={r.service} className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">{r.service}</td>
                      <td className="px-3 py-2">{formatearDinero(r.pending_amount)}</td>
                      <td className="px-3 py-2">{r.count}</td>
                    </tr>
                  ))}
                  {gargalos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-muted-foreground">
                        Aún no hay data suficiente para detectar gargalos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Tarjeta>
        </div>
      </main>
    </div>
  );
}
