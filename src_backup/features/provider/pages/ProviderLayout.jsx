// src/features/provider/pages/ProviderLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";

import { getProviderProfile } from "../../utils/providerProfile";
import { getProviderBadges } from "../../utils/providerMetrics";

/**
 * Layout exclusivo del rol PROVEEDOR.
 * - Mantiene exactamente tu UI existente.
 * - No altera sidebars ni rutas de Paciente / Médico / Clínica.
 * - Calcula 'businessType' desde tu util y habilita módulos acordes.
 * - Expone 'badges' (inventario, órdenes, envíos) usando tu util.
 */
const ProviderLayout = () => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState({ inventory: 0, orders: 0, shipments: 0 });

  // Tipo de negocio (valores esperados: "producto" | "servicio" | "mixto")
  const businessType = useMemo(() => {
    try {
      const p = getProviderProfile?.() || {};
      return p?.businessType || "mixto";
    } catch {
      return "mixto";
    }
  }, []);

  /**
   * Mapa de módulos: NO oculta nada de tu UI; sólo sirve si tu Sidebar
   * utiliza este objeto para enfatizar secciones según el tipo de negocio.
   * Dejamos todo en true para evitar inconsistencias visuales.
   */
  const modulos = useMemo(() => {
    return {
      inventory: true,
      orders: true,
      shipments: true,
      billing: true,
      analytics: true,
      rx: true,
      authz: true,
      services: true,
      b2b: true,
    };
  }, []);

  // Badges iniciales
  useEffect(() => {
    try {
      const b = getProviderBadges?.() || { inventory: 0, orders: 0, shipments: 0 };
      setBadges(b);
    } catch {
      setBadges({ inventory: 0, orders: 0, shipments: 0 });
    }
  }, []);

  // Cerrar sidebar móvil al cambiar de ruta (evita overlay abierto)
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
  }, [location.pathname, mobileOpen]);

  const handleMenuToggle = () => setMobileOpen((v) => !v);

  return (
    <div className="min-h-screen bg-background">
      {/* Header superior (tu componente existente) */}
      <Header
        userRole="provider"
        onMenuToggle={handleMenuToggle}
        showSearch
        showNotifications
        showProfile
      />

      {/* Backdrop móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar específico de proveedor (mismas props que usabas) */}
      <Sidebar
        userRole="provider"
        isCollapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        businessType={businessType}
        modulos={modulos}
        badges={badges}
      />

      {/* Contenido principal (mantener tus paddings y transición) */}
      <main className={`pt-16 transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProviderLayout;
