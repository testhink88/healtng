import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar"; // Asegúrate de que Sidebar se esté importando correctamente
import { getProviderProfile } from "../../utils/providerProfile";
import { getProviderBadges } from "../../utils/providerMetrics";

const ProviderLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const [badges, setBadges] = useState({ inventory: 0, orders: 0, shipments: 0 });

  // Tipo de negocio
  const businessType = useMemo(() => {
    const p = getProviderProfile();
    // valores esperados: "producto" | "servicio" | "mixto"
    return p?.businessType || "mixto";
  }, []);

  useEffect(() => {
    setBadges(getProviderBadges());
  }, []);

  // Item activo por ruta
  useEffect(() => {
    const p = location.pathname || "";
    if (p.includes("/provider/inventory")) setActiveKey("inventory");
    else if (p.includes("/provider/orders/create")) setActiveKey("orders_create");
    else if (p.includes("/provider/orders")) setActiveKey("orders");
    else if (p.includes("/provider/dispatch")) setActiveKey("shipments");
    else if (p.includes("/provider/billing")) setActiveKey("billing");
    else if (p.includes("/provider/analytics")) setActiveKey("analytics");
    else if (p.includes("/provider/rx-intake")) setActiveKey("rx");
    else if (p.includes("/provider/authorizations")) setActiveKey("authz");
    else if (p.includes("/provider/services")) setActiveKey("services");
    else if (p.includes("/provider/b2b")) setActiveKey("b2b");
    else setActiveKey("dashboard");
  }, [location.pathname]);

  const handleMenuToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="provider"
        onMenuToggle={handleMenuToggle}
        showSearch
        showNotifications
        showProfile
      />

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        userRole="provider"
        isCollapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        businessType={businessType}
        modulos={{}} // Aquí debes pasar los módulos que usas (por ejemplo, inventario, pedidos, etc.)
        badges={badges}
      />

      {/* Contenido principal */}
      <main className={`pt-16 transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProviderLayout;
