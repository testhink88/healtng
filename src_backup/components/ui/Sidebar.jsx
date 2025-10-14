import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import Button from "./Button";
import { getProviderBadges } from "../../utils/providerMetrics";

const normalizeRole = (role) => {
  const map = { clinic_admin: "clinic", board: "association", medic: "doctor", provider: "provider" };
  return map?.[role] ?? role ?? "patient";
};

const bt = (t) => String(t || "mixto").toLowerCase();

export default function Sidebar({
  userRole: roleProp = undefined,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
  isMobileOpen = false,
  onMobileClose,
  modulos = {},
  businessType = "mixto",
  hideSidebar = false, // Nueva propiedad
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Si hideSidebar es true, no renderizar el Sidebar
  if (hideSidebar) return null;

  const userRole = useMemo(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("userRole")) || "";
    return normalizeRole(roleProp || stored || "patient");
  }, [roleProp]);

  const [activeKey, setActiveKey] = useState("dashboard");
  const [expanded, setExpanded] = useState({});
  const [badges, setBadges] = useState({ shipments: 0 });

  // Marca activo por ruta
  useEffect(() => {
    const path = location?.pathname || "";
    const map = [
      ["/patient-dashboard", "dashboard"],
      ["/clinic-dashboard", "dashboard"],
      ["/professional-dashboard", "dashboard"],
      ["/provider/dashboard", "dashboard"],

      ["/provider/inventory", "inventory"],
      ["/provider/services", "services"],
      ["/provider/orders", "orders"],
      ["/provider/dispatch", "dispatch"],
      ["/provider/billing", "billing"],
      ["/provider/analytics", "analytics"],
      ["/provider/b2b", "b2b"],
      ["/provider/rx-intake", "rx-intake"],
      ["/provider/authorizations", "authorizations"],

      ["/marketplace-hub", "marketplace"],
    ];
    for (const [p, k] of map) {
      if (path.startsWith(p)) { setActiveKey(k); break; }
    }

    // Abre sólo el grupo que contiene la ruta actual
    const groupFor = (p) => {
      if (p.startsWith("/provider/inventory")) return "inventory-group";
      if (p.startsWith("/provider/orders")) return "orders-group";
      if (p.startsWith("/provider/dispatch")) return "dispatch-group";
      if (p.startsWith("/provider/billing")) return "billing-group";
      if (p.startsWith("/provider/b2b") || p.startsWith("/provider/rx-intake") || p.startsWith("/provider/authorizations")) return "special-group";
      return null;
    };
    const g = groupFor(path);
    setExpanded(g ? { [g]: true } : {}); // sólo uno abierto
  }, [location?.pathname]);

  // Badges proveedor
  useEffect(() => {
    if (userRole === "provider") {
      try { setBadges(getProviderBadges()); } catch { setBadges({ shipments: 0 }); }
    }
  }, [userRole]);

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev?.[key] }));

  // ---------- Menús por rol ----------
  const items = useMemo(() => makeMenus(userRole, businessType, modulos, badges), [userRole, businessType, modulos, badges]);

  const handleNav = (item, e) => {
    if (item?.disabled) return;
    e?.stopPropagation?.();
    setActiveKey(item.key);
    navigate(item.href);
    onMobileClose?.();
  };

  const renderItem = (item, depth = 0) => {
    const isActive = activeKey === item.key;
    const isOpen = !!expanded[item.key];
    if (item.isGroup) {
      return (
        <div key={item.key} className="mb-1">
          <Button
            variant="ghost"
            onClick={() => !item.disabled && toggle(item.key)}
            className={`w-full justify-between px-3 py-2 text-sm font-medium ${isCollapsed ? "px-2" : "px-3"} ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"} ${item.disabled ? "opacity-40 pointer-events-none" : ""}`}
          >
            <div className="flex items-center space-x-3">
              <Icon name={item.icon} size={18} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] rounded-full bg-green-500 text-white">
                    {item.badge}
                  </span>
                )}
                <Icon name="ChevronDown" size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            )}
          </Button>
          {!isCollapsed && isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children?.map((c) => renderItem(c, depth + 1))}
            </div>
          )}
        </div>
      );
    }
    return (
      <Button
        key={item.key}
        variant="ghost"
        onClick={(e) => handleNav(item, e)}
        className={`w-full justify-start mb-1 px-3 py-2 text-sm font-medium ${isCollapsed ? "px-2" : "px-3"} ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"} ${depth > 0 ? "ml-2" : ""} ${item.disabled ? "opacity-40 pointer-events-none" : ""}`}
      >
        <div className="flex items-center space-x-3">
          <Icon name={item.icon} size={18} />
          {!isCollapsed && <span>{item.label}</span>}
        </div>
      </Button>
    );
  };

  const roleLabel =
    userRole === "patient" ? "Paciente" :
    userRole === "doctor"  ? "Médico"   :
    userRole === "clinic"  ? "Clínica"  :
    userRole === "provider"? `Proveedor • ${bt(businessType)}` : "Usuario";

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />}
      <aside className={`sidebar-container fixed top-16 left-0 bottom-0 z-50 bg-card border-r transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${className}`}>
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={14} className="text-primary" />
              <span className="text-sm font-semibold">{roleLabel}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map((it) => renderItem(it))}
        </nav>

        <div className="p-4 border-t">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/help")}>
                <Icon name="HelpCircle" size={16} className="mr-3" />
                Ayuda y Soporte
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/settings")}>
                <Icon name="Settings" size={16} className="mr-3" />
                Configuración
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/help")} title="Ayuda">
                <Icon name="HelpCircle" size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} title="Configuración">
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ---- Menús por rol ----
function makeMenus(role, businessType, modulos, badges) {
  const type = bt(businessType);
  const isProducto = type === "producto";
  const isMixto = type === "mixto";
  const provider = [
    { key: "dashboard", label: "Panel Principal", icon: "Home", href: "/provider/dashboard" },

    ...(isProducto || isMixto ? [{
      key: "inventory-group", label: "Inventario", icon: "Package", isGroup: true,
      disabled: modulos?.inventario === false,
      children: [{ key: "inventory", label: "Gestión de Inventario", icon: "Package", href: "/provider/inventory" }],
    }] : []),

    { key: "orders-group", label: "Pedidos", icon: "ShoppingCart", isGroup: true,
      children: [{ key: "orders", label: "Gestión de Pedidos", icon: "ShoppingCart", href: "/provider/orders" }],
    },

    ...(isProducto || isMixto ? [{
      key: "dispatch-group", label: "Envíos", icon: "Truck", isGroup: true,
      badge: Number(badges?.shipments || 0),
      disabled: modulos?.despacho === false,
      children: [{ key: "dispatch", label: "Gestión de Envíos", icon: "Truck", href: "/provider/dispatch" }],
    }] : []),

    { key: "billing-group", label: "Facturación", icon: "Receipt", isGroup: true,
      disabled: modulos?.facturacion === false,
      children: [
        { key: "billing", label: "Facturas", icon: "Receipt", href: "/provider/billing" },
        { key: "payments", label: "Pagos", icon: "CreditCard", href: "/provider/billing" },
      ],
    },

    { key: "special-group", label: "Servicios Especializados", icon: "Activity", isGroup: true,
      children: [
        { key: "b2b", label: "Abastecimiento B2B", icon: "Building2", href: "/provider/b2b" },
        { key: "rx-intake", label: "Intake de Recetas", icon: "FileText", href: "/provider/rx-intake" },
        { key: "authorizations", label: "Autorizaciones", icon: "Shield", href: "/provider/authorizations" },
      ],
    },

    { key: "analytics", label: "Analíticas", icon: "BarChart3", href: "/provider/analytics" },
    { key: "marketplace", label: "Marketplace", icon: "Store", href: "/marketplace-hub" },
  ];

  const patient = [
    { key: "dashboard", label: "Panel Principal", icon: "Home", href: "/patient-dashboard" },
    { key: "salud", label: "Servicios Médicos", icon: "Stethoscope", isGroup: true, children: [
      { key: "buscar_medicos", label: "Buscar Médicos", icon: "Search", href: "/doctor-discovery" },
      { key: "citas", label: "Mis Citas", icon: "Calendar", href: "/patient-appointment-history" },
      { key: "nueva_cita", label: "Nueva Cita", icon: "CalendarPlus", href: "/new-patient-appointment" },
      { key: "recetas", label: "Recetas", icon: "Pill", href: "/prescription-management" },
      { key: "historial", label: "Historial Médico", icon: "FileText", href: "/medical-history" },
    ]},
    { key: "marketplace", label: "Marketplace", icon: "ShoppingBag", href: "/marketplace-hub" },
    { key: "pagos", label: "Pagos", icon: "CreditCard", href: "/payment-processing" },
  ];

  return (
    { provider, patient }[role] || patient
  );
}
