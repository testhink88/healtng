// src/components/ui/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { getProviderProfile } from "@/utils/providerProfile";

// ===========================================================
// === HELPERS ===============================================
// ===========================================================
const safeJsonParse = (raw, fallback = null) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Normaliza roles
const normalizeRole = (role) => {
  const map = {
    clinic_admin: "clinic",
    board: "association",
    medic: "doctor",
    supplier: "provider",
  };
  return map?.[role] ?? role ?? "patient";
};

// Normaliza tipo de negocio: producto / servicio / mixto
const normalizeBusinessType = (type) => {
  const t = String(type || "mixto").toLowerCase();

  if (["producto", "productos", "product", "products"].includes(t)) {
    return "producto";
  }
  if (["servicio", "servicios", "service", "services"].includes(t)) {
    return "servicio";
  }
  return "mixto";
};

const bt = normalizeBusinessType;

const userHasPermission = (requiredPermission, userPermissions) => {
  if (!requiredPermission) return true;
  return userPermissions && userPermissions.includes(requiredPermission);
};

// --- Módulos por tipo de negocio (igual que en ProviderDashboard) ---
const defaultModulesForType = (type = "mixto") => {
  const t = normalizeBusinessType(type);

  switch (t) {
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

const normalizeModules = (mods) => {
  const m = mods || {};
  return {
    inventario: m.inventario ?? true,
    agenda: m.agenda ?? true,
    pedidos: m.pedidos ?? true,
    despacho: m.despacho ?? true,
    facturacion: m.facturacion ?? true,
    marketplace: m.marketplace ?? true,
    rxIntake: m.rxIntake ?? false,
    authorizations: m.authorizations ?? true,
    analytics: m.analytics ?? true,
  };
};

// ===========================================================
// === MENÚ UNIVERSAL (basePath configurable) =================
// ===========================================================
const makeUniversalProviderMenu = (
  currentBadges,
  rawModules,
  businessType = "mixto",
  {
    basePath = "/provider", // "/provider" o "/clinic"
    enableMarketplace = true,
  } = {}
) => {
  const mods = normalizeModules(rawModules);
  const btNormalized = normalizeBusinessType(businessType);

  const isProduct = btNormalized === "producto" || btNormalized === "mixto";
  const isService = btNormalized === "servicio" || btNormalized === "mixto";

  const items = [];

  items.push({
    key: "dashboard",
    label: "Panel Principal",
    icon: "Home",
    href: `${basePath}/dashboard`,
  });

  if (mods.inventario && isProduct) {
    items.push({
      key: "inventory_management",
      label: "Gestión de Inventario",
      icon: "Package",
      isGroup: true,
      children: [
        {
          key: "inventory",
          label: "Inventario (Existencias)",
          icon: "Package",
          href: `${basePath}/inventory`,
        },
        {
          key: "lotes",
          label: "Lotes y Vencimiento",
          icon: "Layers",
          href: `${basePath}/lots`,
        },
      ],
    });
  }

  if (mods.agenda && isService) {
    items.push({
      key: "services_agenda",
      label: isProduct && isService ? "Servicios y Agenda" : "Servicios",
      icon: "Calendar",
      href: `${basePath}/services`,
    });
  }

  if (mods.pedidos || mods.despacho || mods.rxIntake) {
    const children = [];

    if (mods.pedidos) {
      children.push({
        key: "orders",
        label: "Pedidos",
        icon: "ShoppingCart",
        href: `${basePath}/orders`,
        badge: currentBadges?.orders || 0,
      });
    }

    if (mods.despacho && isProduct) {
      children.push({
        key: "dispatch",
        label: "Envíos",
        icon: "Truck",
        href: `${basePath}/dispatch`,
        badge: currentBadges?.shipments || 0,
      });
    }

    if (mods.rxIntake) {
      children.push({
        key: "rx_intake",
        label: "RX Intake",
        icon: "FileText",
        href: `${basePath}/rx-intake`,
      });
    }

    if (children.length) {
      items.push({
        key: "orders_management",
        label: "Gestión de Pedidos",
        icon: "ShoppingCart",
        isGroup: true,
        children,
      });
    }
  }

  if (mods.facturacion || mods.authorizations) {
    const children = [];

    if (mods.facturacion) {
      children.push({
        key: "billing",
        label: "Facturas y Pagos",
        icon: "CreditCard",
        href: `${basePath}/billing`,
      });
    }

    if (mods.authorizations) {
      children.push({
        key: "authorizations",
        label: "Pre-autorizaciones",
        icon: "Shield",
        href: `${basePath}/authorizations`,
      });
    }

    if (children.length) {
      items.push({
        key: "billing_management",
        label: "Finanzas y Cobertura",
        icon: "DollarSign",
        isGroup: true,
        children,
      });
    }
  }

  if (mods.analytics) {
    items.push({
      key: "analytics",
      label: "Análisis de Datos",
      icon: "BarChart3",
      href: `${basePath}/analytics`,
    });
  }

  if (enableMarketplace && mods.marketplace) {
    const children = [];

    children.push({
      key: "marketplace_b2b_my_offers",
      label:
        isProduct && isService
          ? "Mi catálogo B2B (productos y servicios)"
          : isProduct
          ? "Mi catálogo B2B (productos)"
          : "Mi catálogo B2B (servicios/planes)",
      icon: "Store",
      href: `${basePath}/b2b`,
    });

    children.push({
      key: "marketplace_b2b_buy",
      label: "Comprar a otros proveedores B2B",
      icon: "ShoppingBag",
      href: `${basePath}/b2b/buy`,
    });

    items.push({
      key: "marketplace",
      label: "Marketplace B2B",
      icon: "Store",
      isGroup: true,
      children,
    });
  }

  return items;
};

// ===========================================================
// === COMPONENTE PRINCIPAL: Sidebar =========================
// ===========================================================
const Sidebar = ({
  userRole: roleProp = "patient",
  isCollapsed = false,
  onToggleCollapse,
  className = "",
  isMobileOpen = false,
  onMobileClose,
  permissions = [],
  businessType = "mixto",
  badges = { shipments: 0, orders: 0 },
  hideSidebar = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (hideSidebar) return null;

  const normalizedBusinessType = normalizeBusinessType(businessType);

  const userRole = useMemo(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    return normalizeRole(roleProp || stored);
  }, [roleProp]);

  const [activeKey, setActiveKey] = useState("dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [providerModules, setProviderModules] = useState(null);

  const [clinicProfile, setClinicProfile] = useState(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (userRole !== "provider") return;

    try {
      const profile = getProviderProfile?.() || {};
      const baseModules =
        profile.businessModules ||
        defaultModulesForType(profile.businessType || normalizedBusinessType);

      setProviderModules(normalizeModules(baseModules));

      const providerName =
        profile.businessName ||
        profile.tradeName ||
        profile.legalName ||
        profile.name;
      if (providerName) setDisplayName(providerName);
    } catch {
      setProviderModules(
        normalizeModules(defaultModulesForType(normalizedBusinessType))
      );
    }
  }, [userRole, normalizedBusinessType]);

  useEffect(() => {
    if (userRole !== "clinic") return;
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem("clinicProfile");
    const profile = safeJsonParse(raw, null);
    if (profile) {
      setClinicProfile(profile);
      if (profile.clinicName) setDisplayName(profile.clinicName);
    }
  }, [userRole]);

  const navItems = useMemo(() => {
    // ----------------------------------------------------
    // PROVEEDOR
    // ----------------------------------------------------
    if (userRole === "provider") {
      return makeUniversalProviderMenu(
        badges,
        providerModules,
        normalizedBusinessType
      );
    }

    // ----------------------------------------------------
    // MENÚS PARA OTROS ROLES
    // ----------------------------------------------------
    const otherRolesMenus = {
      patient: [
        {
          key: "dashboard",
          label: "Panel Principal",
          icon: "Home",
          href: "/patient-dashboard",
        },
        {
          key: "clinical_care",
          label: "Cuidado Clínico",
          icon: "Stethoscope",
          isGroup: true,
          children: [
            {
              key: "doctor_search",
              label: "Buscar Médicos",
              icon: "Search",
              href: "/doctor-discovery",
            },
            {
              key: "appointments",
              label: "Mis Citas",
              icon: "Calendar",
              href: "/patient-appointment-history",
            },
            {
              key: "new_appointment",
              label: "Nueva Cita",
              icon: "CalendarPlus",
              href: "/new-patient-appointment",
            },
          ],
        },
        {
          key: "clinical_files",
          label: "Archivos Clínicos",
          icon: "FileText",
          isGroup: true,
          children: [
            {
              key: "active_rx",
              label: "Recetas Activas",
              icon: "Pill",
              href: "/prescription-management",
            },
            {
              key: "medical_history",
              label: "Historial Médico",
              icon: "FileStack",
              href: "/medical-history",
            },
          ],
        },
        {
          key: "marketplace",
          label: "Marketplace",
          icon: "ShoppingBag",
          href: "/marketplace-hub",
        },
      ],

      // 🏥 CLÍNICA
      clinic: (() => {
        const menu = [
          {
            key: "clinic_panels",
            label: "Paneles de Clínica",
            icon: "Home",
            isGroup: true,
            children: [
              {
                key: "clinic_today",
                label: "Resumen Ejecutivo",
                icon: "Home",
                href: "/clinic-dashboard",
              },
              {
                key: "clinic_ops_live",
                label: "Operaciones",
                icon: "Activity",
                href: "/clinic/operations",
              },
              {
                key: "clinic_management",
                label: "Modo Condominio",
                icon: "Building",
                href: "/clinic/management",
              },
            ],
          },

          {
            key: "operations",
            label: "Operaciones Diarias",
            icon: "Activity",
            isGroup: true,
            children: [
              {
                key: "clinic_appointments",
                label: "Citas y Agenda",
                icon: "CalendarDays",
                href: "/clinic/appointments",
              },
              {
                key: "clinic_spaces",
                label: "Gestión de Espacios",
                icon: "Building2",
                href: "/clinic/spaces",
              },
            ],
          },

          {
            key: "inventory",
            label: "Inventario y Compras",
            icon: "Package",
            isGroup: true,
            children: [
              {
                key: "inventory_stock",
                label: "Inventario",
                icon: "Boxes",
                href: "/clinic/inventory",
              },
              {
                key: "inventory_purchases",
                label: "Órdenes de Compra",
                icon: "ShoppingCart",
                href: "/clinic/purchase-orders",
              },
            ],
          },

          {
            key: "financial",
            label: "Finanzas y Cobertura",
            icon: "DollarSign",
            isGroup: true,
            children: [],
          },
        ];

        // ✅ AQUI VA EXACTAMENTE LA SOLUCIÓN
        // ✅ Inyectar Finanzas y Cobertura (rutas nuevas)
        const financialItem = menu.find((x) => x.key === "financial");
        if (financialItem) {
          financialItem.children = [
            {
              key: "clinic_billing",
              label: "Facturas y Pagos",
              icon: "CreditCard",
              href: "/clinic/billing",
            },
            {
              key: "clinic_authorizations",
              label: "Pre-autorizaciones",
              icon: "Shield",
              href: "/clinic/authorizations",
            },
          ];
        }

        // ✅ Marketplace según flags del onboarding
        const canSell = clinicProfile?.actsAsProvider;
        const canBuy = clinicProfile?.actsAsBuyer;

        if (canSell || canBuy) {
          const marketplaceChildren = [];

          if (canBuy) {
            marketplaceChildren.push({
              key: "clinic_marketplace_buy",
              label: "Comprar en B2B",
              icon: "ShoppingBag",
              href: "/marketplace/b2b",
            });
          }

          if (canSell) {
            marketplaceChildren.push({
              key: "clinic_marketplace_sell",
              label: "Catálogo B2B",
              icon: "Store",
              href: "/provider/b2b",
            });
          }

          if (marketplaceChildren.length) {
            menu.push({
              key: "clinic_marketplace",
              label: "Marketplace",
              icon: "Store",
              isGroup: true,
              children: marketplaceChildren,
            });
          }
        }

        return menu;
      })(),

      doctor: [
        {
          key: "dashboard",
          label: "Panel Principal",
          icon: "Home",
          href: "/professional-dashboard",
        },
        {
          key: "patients",
          label: "Pacientes y Consultas",
          icon: "Users",
          isGroup: true,
          children: [
            {
              key: "patient_list",
              label: "Lista de Pacientes",
              icon: "List",
              href: "/patients",
            },
            {
              key: "appointments",
              label: "Citas Programadas",
              icon: "CalendarDays",
              href: "/appointment-booking",
            },
            {
              key: "clinical_notes",
              label: "Notas Clínicas",
              icon: "Notebook",
              href: "/notes",
            },
          ],
        },
        {
          key: "rx_diag",
          label: "Recetas y Diagnósticos",
          icon: "FileText",
          isGroup: true,
          children: [
            {
              key: "new_rx",
              label: "Crear Nueva Receta",
              icon: "Pencil",
              href: "/prescriptions/new",
            },
            {
              key: "rx_history",
              label: "Historial de Recetas",
              icon: "History",
              href: "/prescription-management",
            },
            {
              key: "diag_new",
              label: "Nuevo Diagnóstico",
              icon: "Stethoscope",
              href: "/diagnosis/new",
            },
            {
              key: "diag_results",
              label: "Resultados",
              icon: "ClipboardList",
              href: "/diagnosis/results",
            },
          ],
        },
        {
          key: "medical_indicators",
          label: "Indicadores Médicos",
          icon: "BarChart3",
          href: "/medical-indicators",
        },
        {
          key: "spaces",
          label: "Reserva de Espacios",
          icon: "CalendarCheck",
          href: "/space-reservation",
        },
        {
          key: "marketplace",
          label: "Marketplace Profesional",
          icon: "Store",
          href: "/marketplace-hub",
        },
      ],

      college: [
        {
          key: "dashboard",
          label: "Panel Principal",
          icon: "Home",
          href: "/college-dashboard",
        },
      ],
    };

    return otherRolesMenus[userRole] || otherRolesMenus.patient;
  }, [userRole, badges, providerModules, normalizedBusinessType, clinicProfile]);

  // ===========================================================
  // === LÓGICA DE NAVEGACIÓN Y RENDER =========================
  // ===========================================================
  useEffect(() => {
    const path = location?.pathname || "";
    const findActiveKey = (items, pathToMatch) => {
      for (const item of items) {
        if (item.href && pathToMatch.startsWith(item.href)) return item.key;
        if (item.children) {
          const childKey = findActiveKey(item.children, pathToMatch);
          if (childKey) return childKey;
        }
      }
      return null;
    };
    const found = findActiveKey(navItems, path);
    if (found) setActiveKey(found);
  }, [location?.pathname, navItems]);

  const toggleGroup = (key) =>
    setExpandedGroups((p) => ({ ...p, [key]: !p[key] }));

  const handleNavigation = (href, key) => {
    setActiveKey(key);
    navigate(href);
    onMobileClose?.();
  };

  const renderItem = (item, depth = 0) => {
    const isActive = activeKey === item.key;
    const isExpanded = expandedGroups[item.key];
    const itemClasses = cn(
      "w-full justify-start mb-1 px-3 py-2 text-sm font-medium transition-colors",
      isCollapsed ? "px-2" : "px-3",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    );

    if (item.isGroup) {
      return (
        <div key={item.key}>
          <Button
            variant="ghost"
            className={cn("w-full justify-between", itemClasses)}
            onClick={() => toggleGroup(item.key)}
          >
            <div className="flex items-center space-x-3">
              <Icon name={item.icon} size={18} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && (
              <Icon
                name="ChevronDown"
                size={16}
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </Button>
          {!isCollapsed && isExpanded && (
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
        onClick={() => handleNavigation(item.href, item.key)}
        className={cn(itemClasses, depth > 0 && "ml-2")}
      >
        <div className="flex items-center space-x-3">
          <Icon name={item.icon} size={18} />
          {!isCollapsed && <span>{item.label}</span>}
        </div>
      </Button>
    );
  };

  const roleLabel =
    userRole === "provider"
      ? `Proveedor • ${normalizedBusinessType.toUpperCase()}`
      : userRole === "clinic"
      ? "Clínica"
      : userRole === "doctor"
      ? "Médico"
      : userRole === "college"
      ? "Colegio Profesional"
      : userRole === "patient"
      ? "Paciente"
      : "Usuario";

  const sidebarTitle = displayName || roleLabel;
  const sidebarSubtitle = displayName ? roleLabel : "";

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-50 bg-card border-r border-border transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${className}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex flex-col w-full">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name="Activity" size={14} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground truncate">
                  {sidebarTitle}
                </span>
              </div>
              {sidebarSubtitle && (
                <span className="mt-0.5 ml-8 text-[11px] text-muted-foreground uppercase tracking-wide">
                  {sidebarSubtitle}
                </span>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex"
          >
            <Icon
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={16}
            />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((it) => renderItem(it))}
        </nav>

        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/help")}
              >
                <Icon name="HelpCircle" size={16} className="mr-3" />
                Ayuda y Soporte
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => navigate("/settings")}
              >
                <Icon name="Settings" size={16} className="mr-3" />
                Configuración
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/help")}
                title="Ayuda y Soporte"
              >
                <Icon name="HelpCircle" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                title="Configuración"
              >
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
