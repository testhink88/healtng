// src/features/provider/pages/ProviderLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { getProviderBadges } from "@/utils/providerMetrics";
import { getProviderProfile } from "@/utils/providerProfile";

// 👇 Normaliza lo que venga del perfil a: "productos" | "servicios" | "mixto"
const normalizeBusinessTypeForSidebar = (raw) => {
  const t = String(raw || "").toLowerCase().trim();

  if (["producto", "productos", "product", "products"].includes(t)) return "productos";
  if (["servicio", "servicios", "service", "services"].includes(t)) return "servicios";
  if (["mixto", "mixed", "mix"].includes(t)) return "mixto";

  // fallback seguro
  return "mixto";
};

const ProviderLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState({ inventory: 0, orders: 0, shipments: 0 });

  // Flags iniciales desde perfil
  const [providerFlags, setProviderFlags] = useState(() => {
    const p = getProviderProfile?.() || {};
    return {
      businessType: p?.businessType || "mixto", // lo que venga del perfil
      audience: p?.audience || "both",
      canBuy: !!p?.canBuy,
    };
  });

  // Escuchar cambios del perfil
  useEffect(() => {
    const onUpd = () => {
      const p = getProviderProfile?.() || {};
      setProviderFlags({
        businessType: p?.businessType || "mixto",
        audience: p?.audience || "both",
        canBuy: !!p?.canBuy,
      });
    };

    window.addEventListener("providerProfile:updated", onUpd);
    return () => window.removeEventListener("providerProfile:updated", onUpd);
  }, []);

  // Badges del proveedor (pedidos, envíos, etc.)
  useEffect(() => {
    try {
      setBadges(getProviderBadges());
    } catch {
      setBadges({ inventory: 0, orders: 0, shipments: 0 });
    }
  }, []);

  // 👉 Esto es lo que se le pasa al Sidebar
  const visualBusinessType = useMemo(
    () => normalizeBusinessTypeForSidebar(providerFlags.businessType),
    [providerFlags.businessType]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="provider"
        onMenuToggle={() => setMobileOpen((v) => !v)}
        showSearch
        showNotifications
        showProfile
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        userRole="provider"
        isCollapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        businessType={visualBusinessType}          // 👈 ahora será "productos", "servicios" o "mixto"
        badges={badges}
        providerAudience={providerFlags.audience}
        providerCanBuy={providerFlags.canBuy}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProviderLayout;
