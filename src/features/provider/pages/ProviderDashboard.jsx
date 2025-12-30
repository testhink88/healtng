import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { getProviderProfile } from "@/utils/providerProfile";

// Importación de datos falsos para simular la farmacia
import {
  seedPharmacyDemo,
  getPharmacyAnalytics,
  getPharmacyProducts,
  getPharmacyOrders,
} from "@/utils/mockDataPharmacy";

// Función para definir los módulos disponibles según el tipo de proveedor
const modulesFor = (type = "mixto") => {
  switch (type) {
    case "producto":
      return {
        inventario: true,
        agenda: false,
        pedidos: true,
        despacho: true,
        facturacion: true,
        marketplace: true,
        rxIntake: true,
        authorizations: true,
        analytics: true,
      };
    case "servicio":
      return {
        inventario: false,
        agenda: true,
        pedidos: true,
        despacho: false,
        facturacion: true,
        marketplace: true,
        rxIntake: true,
        authorizations: true,
        analytics: true,
      };
    default:
      return {
        inventario: true,
        agenda: true,
        pedidos: true,
        despacho: true,
        facturacion: true,
        marketplace: true,
        rxIntake: true,
        authorizations: true,
        analytics: true,
      };
  }
};

// Función para mostrar el tipo de negocio
const typeLabel = (type) =>
  type === "producto"
    ? "Productos"
    : type === "servicio"
    ? "Servicios"
    : "Mixto (Productos + Servicios)";

// Descripción del tipo de negocio
const businessDescription = (type) => {
  const t = String(type || "mixto").toLowerCase();
  switch (t) {
    case "producto":
      return "Administra tus productos y operaciones desde un solo lugar";
    case "servicio":
      return "Administra tus servicios y operaciones desde un solo lugar";
    default:
      return "Administra tus productos, servicios y operaciones desde un solo lugar";
  }
};

// Componente de tarjeta KPI
const KPICard = ({ title, value, icon, change = null, trend = null }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon name={icon} size={16} className="text-primary" />
      </div>
      {typeof change === "number" && (
        <div className="flex items-center space-x-1">
          <Icon
            name={trend === "down" ? "TrendingDown" : "TrendingUp"}
            size={12}
            className={trend === "down" ? "text-red-600" : "text-green-600"}
          />
          <span
            className={`text-xs font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        </div>
      )}
    </div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const ModuleCard = ({ cardKey, icon, title, desc, onClick, badge }) => (
  <div
    key={cardKey}
    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon name={icon} size={20} className="text-primary" />
      </div>
      {!!badge && (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
);

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingOrders: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    pendingShipments: 0,
    activeServices: 0,
    completedOrders: 0,
    salesToday: 0,
  });

  useEffect(() => {
    const p = getProviderProfile();
    if (!p) {
      navigate("/provider-profile-setup", { replace: true });
      return;
    }

    const normalizedType = String(p.businessType || "mixto").toLowerCase();

    // Si es proveedor de PRODUCTOS, sembramos demo de farmacia (si no existe).
    if (normalizedType === "producto") {
      seedPharmacyDemo();
    }

    const normalized = {
      ...p,
      businessType: normalizedType,
      businessModules: p.businessModules || modulesFor(normalizedType),
    };
    setProfile(normalized);

    // KPIs desde mocks SOLO para tipo "producto" (por ahora)
    if (normalizedType === "producto") {
      const a = getPharmacyAnalytics();
      const prods = getPharmacyProducts();
      const allOrders = getPharmacyOrders();
      const completed = allOrders.filter(
        (o) => o.type === "sale" && o.status === "completed"
      ).length;

      setStats((s) => ({
        ...s,
        totalProducts: a.totalProducts ?? prods.length ?? 0,
        lowStock: a.lowStock ?? 0,
        pendingOrders: allOrders.filter((o) => o.status === "pending").length,
        completedOrders: completed,
        monthlyRevenue: Math.round((a.salesToday || 0) * 30),
        salesToday: a.salesToday || 0,
      }));
    }
  }, [navigate]);

  if (!profile) return null;

  const mods = profile.businessModules;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              ¡Bienvenido a tu Panel de Proveedor!
            </h1>
            <p className="text-lg text-muted-foreground">
              Tipo de negocio: {typeLabel(profile.businessType)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {businessDescription(profile.businessType)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/provider/module-configuration")}
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Configurar Módulos
            </Button>
            <Button variant="default" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Nueva Acción
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mods.inventario && (
          <KPICard
            title="Total Productos"
            value={stats.totalProducts}
            icon="Package"
            change={2.5}
            trend="up"
          />
        )}
        <KPICard
          title="Pedidos Pendientes"
          value={stats.pendingOrders}
          icon="ShoppingCart"
          change={12}
          trend="up"
        />
        {mods.agenda && (
          <KPICard
            title="Citas Hoy"
            value={stats.todayAppointments}
            icon="Calendar"
          />
        )}
        <KPICard
          title="Ingresos del Mes"
          value={`$${(stats.monthlyRevenue || 0).toLocaleString()}`}
          icon="DollarSign"
          change={8.3}
          trend="up"
        />
        {mods.inventario && (
          <KPICard
            title="Stock Bajo"
            value={stats.lowStock}
            icon="AlertTriangle"
            change={-5}
            trend="down"
          />
        )}
        {mods.despacho && (
          <KPICard
            title="Despachos Pendientes"
            value={stats.pendingShipments}
            icon="Truck"
          />
        )}
        {mods.agenda && (
          <KPICard
            title="Servicios Activos"
            value={stats.activeServices}
            icon="Activity"
          />
        )}
        <KPICard
          title="Órdenes Completadas"
          value={stats.completedOrders}
          icon="CheckCircle"
          change={15.2}
          trend="up"
        />
      </div>

      {/* Módulos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Módulos de Negocio Activos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mods.inventario && (
            <ModuleCard
              cardKey="inventory-card"
              icon="Package"
              title="Gestión de Inventario"
              desc="Administra productos, stock y movimientos de inventario"
              onClick={() => navigate("/provider/inventory")}
              badge={stats.lowStock > 0 ? `${stats.lowStock} alertas` : null}
            />
          )}
          {mods.agenda && (
            <ModuleCard
              cardKey="services-card"
              icon="Calendar"
              title="Servicios y Agenda"
              desc="Gestiona citas, servicios y programación"
              onClick={() => navigate("/provider/services")}
            />
          )}
          <ModuleCard
            cardKey="orders-card"
            icon="ShoppingCart"
            title="Pedidos y Órdenes"
            desc="Administra pedidos de productos y órdenes de servicios"
            onClick={() => navigate("/provider/orders")}
            badge={stats.pendingOrders > 0 ? `${stats.pendingOrders} pendientes` : null}
          />
          {mods.despacho && (
            <ModuleCard
              cardKey="dispatch-card"
              icon="Truck"
              title="Gestión de Despachos"
              desc="Controla envíos, entregas y logística"
              onClick={() => navigate("/provider/dispatch")}
            />
          )}
          {mods.facturacion && (
            <ModuleCard
              cardKey="billing-card"
              icon="Receipt"
              title="Facturación"
              desc="Genera facturas, controla pagos y reportes fiscales"
              onClick={() => navigate("/provider/billing")}
            />
          )}
          {mods.marketplace && (
            <ModuleCard
              cardKey="b2b-card"
              icon="Building2"
              title="Marketplace B2B"
              desc="Gestiona tu presencia en el marketplace"
              onClick={() => navigate("/provider/b2b")}
            />
          )}
          {mods.rxIntake && (
            <ModuleCard
              cardKey="rx-intake-card"
              icon="FileText"
              title="RX Intake"
              desc="Procesamiento de recetas y órdenes médicas"
              onClick={() => navigate("/provider/rx-intake")}
            />
          )}
          {mods.authorizations && (
            <ModuleCard
              cardKey="authorizations-card"
              icon="Shield"
              title="Autorizaciones"
              desc="Gestión de autorizaciones y seguros"
              onClick={() => navigate("/provider/authorizations")}
            />
          )}
          <ModuleCard
            cardKey="analytics-card"
            icon="BarChart3"
            title="Analíticas"
            desc="Reportes y métricas de rendimiento del negocio"
            onClick={() => navigate("/provider/analytics")}
          />
        </div>
      </div>
    </div>
  );
}
