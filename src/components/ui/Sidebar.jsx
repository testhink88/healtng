// src/components/ui/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn"; // Utilidad para concatenar clases
import Icon from "@/components/AppIcon"; // Componente Icono
import Button from "@/components/ui/Button"; // Componente Botón

// ====================================================================
// === FUNCIONES AUXILIARES ===
// ====================================================================

/**
 * Normaliza los roles de usuario a un conjunto canónico.
 */
const normalizeRole = (role) => {
  const map = {
    clinic_admin: "clinic",
    board: "association",
    medic: "doctor",
    supplier: "provider",
  };
  return map?.[role] ?? role ?? "patient";
};

/**
 * Normaliza el tipo de negocio a minúsculas, usando "mixto" como defecto.
 */
const bt = (t) => String(t || "mixto").toLowerCase();

// ⚠️ MOCK: DEBES IMPLEMENTAR O IMPORTAR getProviderBadges EN TU PROYECTO
const getProviderBadges = () => {
    // Ejemplo de datos dinámicos.
    return {
        shipments: 5,
        orders: 12,
    };
};


// ----------------------------------------------------------------------
// FUNCIÓN UNIVERSAL DE PROVEEDOR (CORREGIDA Y CONSOLIDADA con UX Writing LATAM)
// ----------------------------------------------------------------------
const makeUniversalProviderMenu = (type, mods, currentBadges) => {
  // Las condiciones aquí son para la lógica demo de 'businessType'
  const isProducto = type === "producto" || type === "mixto";
  const isServicio = type === "servicio" || type === "mixto";

  return [
    { key: "dashboard", label: "Panel Principal", icon: "Home", href: "/provider/dashboard" },

    // 1. GESTIÓN DE INVENTARIO (Producto)
    ...(isProducto ? [{
      key: "inventory_management",
      label: "Gestión de Inventario",
      icon: "Package",
      isGroup: true,
      children: [
        { key: "inventory", label: "Inventario (Existencias)", icon: "Package", href: "/provider/inventory" },
        // UX Writing: 'Caducidad' -> 'Vencimiento'
        { key: "lotes", label: "Lotes y Vencimiento", icon: "Layers", href: "/provider/inventory/lots" }, 
        { key: "ajustes", label: "Ajustes de Stock", icon: "Edit", href: "/provider/inventory/adjustments" },
      ],
    }] : []),

    // 2. GESTIÓN DE RECURSOS Y AGENDA (Servicio)
    ...(isServicio ? [{
      key: "resource_and_schedule",
      label: "Gestión de Recursos y Agenda",
      icon: "CalendarCheck",
      isGroup: true,
      children: [
        { key: "agenda", label: "Agenda de Citas", icon: "CalendarDays", href: "/provider/appointments" },
        // UX Writing: 'Recursos' -> 'Personal y Unidades'
        { key: "recursos", label: "Personal y Unidades", icon: "Users", href: "/provider/resources" },
      ],
    }] : []),

    // 3. GESTIÓN DE PEDIDOS (Común y Central - Estilo HealthInventory)
    {
      key: "orders_management",
      label: "Gestión de Pedidos",
      icon: "ShoppingCart",
      isGroup: true,
      children: [
        { key: "orders", label: "Pedidos", icon: "ShoppingCart", href: "/provider/orders", badge: currentBadges?.orders || 0 },
        // UX Writing: 'Despachos' -> 'Envíos'
        { key: "dispatch", label: "Envíos", icon: "Truck", href: "/provider/dispatch", badge: currentBadges?.shipments || 0 },
      ],
    },

    // 4. GESTIÓN FINANCIERA Y COBERTURA (Común)
    {
      key: "billing_management",
      label: "Gestión Financiera y Cobertura",
      icon: "DollarSign",
      isGroup: true,
      children: [
        { key: "billing", label: "Facturas y Pagos", icon: "CreditCard", href: "/provider/billing" },
        // UX Writing: 'Validación de Cobertura' -> 'Pre-autorizaciones'
        ...(isServicio ? [{ key: "authorizations", label: "Pre-autorizaciones", icon: "Shield", href: "/provider/authorizations" }] : []),
      ],
    },

    // 5. CONTROL SANITARIO Y LOGÍSTICO (Principalmente Producto)
    ...(isProducto ? [{
      key: "compliance_logistics",
      // UX Writing: Título principal optimizado
      label: "Control de Recetas y Logística",
      icon: "FileText",
      isGroup: true,
      children: [
        // UX Writing: 'RX Intake' -> 'Validación y Entrega de Recetas'
        { key: "rx-intake", label: "Validación y Entrega de Recetas", icon: "FileText", href: "/provider/rx-intake" },
        // UX Writing: Añadir aclaración 'Insumos'
        { key: "b2b", label: "Marketplace B2B (Insumos)", icon: "Building2", href: "/provider/b2b" },
      ],
    }] : []),

    // 6. ANALÍTICAS (Común)
    {
      key: "analytics",
      // UX Writing: 'Analíticas' -> 'Análisis de Datos'
      label: "Análisis de Datos",
      icon: "BarChart3",
      isGroup: true,
      children: [
        // UX Writing: 'Ventas y Rotación' -> 'Ventas y Rendimiento'
        { key: "ventas", label: "Ventas y Rendimiento", icon: "TrendingUp", href: "/provider/analytics/sales" },
        // UX Writing: 'Tiempos y Ocupación'
        ...(isServicio ? [{ key: "servicios", label: "Tiempos y Ocupación", icon: "Clock", href: "/provider/analytics/services" }] : []),
      ],
    },
    // Ítem de nivel 1 sin grupo
    { key: "marketplace", label: "Marketplace", icon: "Store", href: "/marketplace-hub" },
  ];
};
// ----------------------------------------------------------------------


// ====================================================================
// === COMPONENTE PRINCIPAL: Sidebar ===
// ====================================================================

const Sidebar = ({
  userRole: roleProp = "patient",
  isCollapsed = false,
  onToggleCollapse,
  className = "",
  isMobileOpen = false,
  onMobileClose,
  // PROPS DEL PROVEEDOR
  modulos = {},
  businessType = "mixto",
  hideSidebar = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (hideSidebar) return null;

  const normalizedBusinessType = bt(businessType);

  // 1. DETERMINACIÓN DEL ROL
  const userRole = useMemo(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
    return normalizeRole(roleProp || stored);
  }, [roleProp]);

  // 2. ESTADOS
  const [activeKey, setActiveKey] = useState("dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [badges, setBadges] = useState({ shipments: 0, orders: 0 }); // Inicialización de badges

  // 3. EFECTO: CARGA DE INSIGNIAS DINÁMICAS (Solo para Provider)
  useEffect(() => {
    if (userRole === "provider" && typeof getProviderBadges === 'function') {
      try {
        const loadedBadges = getProviderBadges(); 
        setBadges({ shipments: loadedBadges.shipments || 0, orders: loadedBadges.orders || 0 });
      } catch (e) {
        console.error("Error loading provider badges:", e);
        setBadges({ shipments: 0, orders: 0 });
      }
    }
  }, [userRole]);

  // 4. EFECTO: SINCRONIZACIÓN DE RUTA A CLAVE ACTIVA (RUTAS CORREGIDAS)
  useEffect(() => {
    const path = location?.pathname;
    const pathToKey = [
      // Mapeos de rutas CORREGIDOS para la nueva estructura
      ["/provider/dashboard", "dashboard"],
      ["/provider/inventory/lots", "lotes"], 
      ["/provider/inventory/adjustments", "ajustes"], 
      ["/provider/inventory", "inventory"],
      ["/provider/appointments", "agenda"],
      ["/provider/resources", "recursos"], 
      ["/provider/orders", "orders"],
      ["/provider/dispatch", "dispatch"],
      ["/provider/billing", "billing"],
      ["/provider/accounts", "accounts"], 
      ["/provider/rx-intake", "rx-intake"],
      ["/provider/authorizations", "authorizations"], 
      ["/provider/b2b", "b2b"],
      ["/provider/analytics/sales", "ventas"], 
      ["/provider/analytics/services", "servicios"], 
      ["/provider/analytics", "analytics"],
      ["/provider/", "dashboard"], 
      // ... (resto de mapeos de rutas para otros roles)
    ];
    for (const [p, k] of pathToKey) {
      if (path?.startsWith(p)) {
        setActiveKey(k);
        break;
      }
    }
  }, [location?.pathname]);

  const toggleGroup = (key) =>
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev?.[key] }));

  // 5. DEFINICIÓN DE MENÚS POR ROL (useMemo)
  const itemsByRole = useMemo(() => {
    const otherRolesMenus = { /* ... menús de otros roles ... */ };

    // La función makeUniversalProviderMenu ahora reemplaza el antiguo makeProviderMenu
    const providerMenu = makeUniversalProviderMenu(normalizedBusinessType, modulos, badges);

    return {
      // 1. ROL: PATIENT (Paciente)
     patient: [
        { 
          key: "dashboard", 
          label: "Panel Principal", 
          icon: "Home", 
          href: "/patient-dashboard" 
        },

        {
          key: "clinical_care",
          label: "Cuidado Clínico",
          icon: "Stethoscope",
          isGroup: true,
          children: [
            { key: "doctor_search", label: "Buscar Médicos", icon: "Search", href: "/doctor-discovery" },
            { key: "appointments", label: "Mis Citas", icon: "Calendar", href: "/patient-appointment-history" },
            { key: "new_appointment", label: "Nueva Cita", icon: "CalendarPlus", href: "/new-patient-appointment" },
          ],
        },

        {
          key: "clinical_files",
          label: "Archivos Clínicos",
          icon: "FileText",
          isGroup: true,
          children: [
            { key: "active_rx", label: "Recetas Activas", icon: "Pill", href: "/prescription-management" },
            { key: "medical_history", label: "Historial Médico", icon: "FileStack", href: "/medical-history" },
          ],
        },

        {
          key: "financial_reimbursements",
          label: "Pagos y Reembolsos",
          icon: "CreditCard",
          isGroup: true,
          children: [
            { key: "registered_payments", label: "Pagos Registrados", icon: "Receipt", href: "/patient/reimbursements/payments" },
            { key: "upload_docs", label: "Cargar Soporte de Gasto", icon: "Upload", href: "/patient/reimbursements/upload" },
            { key: "claim_tracking", label: "Seguimiento de Siniestro", icon: "Activity", href: "/patient/reimbursements/status" },
          ],
        },

        { key: "marketplace", label: "Marketplace", icon: "ShoppingBag", href: "/marketplace-hub" },
        
        // ❌ El ítem de configuración ha sido ELIMINADO de aquí.
      ],


      // 2. ROL: CLINIC (Clínica/Administrador)
      clinic: [
        { key: "dashboard", label: "Panel Principal", icon: "Home", href: "/clinic-dashboard" },
        {
          key: "practice",
          label: "Gestión de Consulta",
          icon: "Building2",
          isGroup: true,
          children: [
            { key: "appointments", label: "Agenda de Citas", icon: "Calendar", href: "/clinic-appointments-management", badge: "5" },
            { key: "patients", label: "Pacientes", icon: "Users", href: "/patients?scope=clinic&groupBy=specialty" },
            { key: "prescriptions", label: "Recetas", icon: "Pill", href: "/prescription-management?scope=clinic" },
            { key: "diagnosis", label: "Diagnósticos", icon: "Stethoscope", href: "/diagnosis/new?scope=clinic&mode=list" },
            { key: "referrals", label: "Derivaciones", icon: "Share2", href: "/referrals/new?scope=clinic&mode=list" },
          ],
        },
        { key: "inventory", label: "Inventario", icon: "Package", href: "/clinic/inventory" },
        { key: "orders", label: "Órdenes de Compra", icon: "ShoppingCart", href: "/clinic/purchase-orders" },
        { key: "spaces_management", label: "Espacios", icon: "Building", href: "/clinic/spaces" },
        { key: "marketplace", label: "Marketplace", icon: "Store", href: "/clinic-marketplace-hub" },
      ],

      // 3. ROL: DOCTOR (Médico general)
      // Localización: Dentro del array principal de itemsByRole, bajo la clave doctor

doctor: [
  // Módulo Principal: Inteligencia de Práctica
  { key: "dashboard", label: "Panel Profesional", icon: "BarChart3", href: "/professional-dashboard" },
  
  // Módulo Consolidado: Gestión de Consulta (Práctica y Archivos)
  {
    key: "gestion_practica_clinica", // Nueva clave consolidada
    label: "Gestión de Consulta",
    icon: "Stethoscope", // Usamos el ícono clínico para el grupo
    isGroup: true,
    children: [
      { key: "agenda_citas", label: "Agenda de Citas", icon: "Calendar", href: "/appointment-booking", badge: "5" },
      { key: "mis_pacientes", label: "Mis Pacientes", icon: "Users", href: "/patients" },
      
      // CONSOLIDACIÓN 1: Generación de Órdenes (Incluye Recetas, Informes y Órdenes)
      {
        key: "generacion_ordenes", 
        label: "Generación de Órdenes", // Nuevo Título UX Writing
        icon: "FileText",
        isGroup: true,
        children: [
          // Emisión de Recetas (Mantenemos el término conocido)
          { key: "emitir_receta", label: "Nueva Receta", icon: "Pill", href: "/prescriptions/new" },
          // Emisión de Informes (Soporte Clínico/Documental)
          { key: "emitir_informe", label: "Generar Informe Clínico", icon: "Clipboard", href: "/reports/new" }, 
          // Órdenes de Diagnóstico (Laboratorio, Imagenología)
          { key: "ordenes_dx", label: "Órdenes de Diagnóstico", icon: "Stethoscope", href: "/diagnosis/new" },
        ],
      },
      
      // CONSOLIDACIÓN 2: Referencias y Derivaciones (Acción de Interoperabilidad)
      {
        key: "referencias_derivaciones",
        label: "Referencias y Derivaciones",
        icon: "Share2",
        href: "/referrals/new",
      },
    ],
  },
  
  // Módulo de Operaciones de Práctica (Alquiler y Abastecimiento)
  { 
    key: "operaciones_practica", 
    label: "Operaciones de Práctica", 
    icon: "Building", // Ícono para reflejar la Renta de Espacios
    isGroup: true,
    children: [
      { key: "renta_espacios", label: "Renta de Espacios Clínicos", icon: "Building", href: "/space-reservation" },
      { key: "compra_insumos", label: "Compra de Insumos", icon: "ShoppingBag", href: "/marketplace-insumos" },
    ],
  },
  
  // El resto del menú
  { key: "configuracion", label: "Configuración", icon: "Settings", href: "/settings" },
  { key: "ayuda", label: "Ayuda y Soporte", icon: "HelpCircle", href: "/help" },
],

      // 4. ROL: SPECIALIST (Especialista)
      specialist: [
        { key: "dashboard", label: "Panel Especialista", icon: "BarChart3", href: "/professional-dashboard" },
        {
          key: "practice",
          label: "Gestión Especializada",
          icon: "Stethoscope",
          isGroup: true,
          children: [
            { key: "appointments", label: "Consultas", icon: "Calendar", href: "/appointment-booking", badge: "3" },
            { key: "patients", label: "Pacientes", icon: "Users", href: "/patients" },
            { key: "procedures", label: "Procedimientos", icon: "Activity", href: "/procedures" },
            {
              key: "actions",
              label: "Acciones",
              icon: "Zap",
              isGroup: true,
              children: [
                { key: "new_prescription", label: "Nueva Receta", icon: "FileText", href: "/prescriptions/new" },
                { key: "new_diagnosis", label: "Nuevo Diagnóstico", icon: "Stethoscope", href: "/diagnosis/new" },
                { key: "new_referral", label: "Derivar", icon: "Share2", href: "/referrals/new" },
              ],
            },
          ],
        },
        { key: "spaces", label: "Espacios Médicos", icon: "Building", href: "/space-reservation" },
        { key: "marketplace", label: "Suministros", icon: "Package", href: "/marketplace-hub" },
      ],

      // 5. ROL: PROVIDER (Proveedor) - Adaptado
      provider: providerMenu,

      // 6. ROL: ASSOCIATION (Asociación/Colegio)
      association: [
        { key: "dashboard", label: "Panel Colegio", icon: "Shield", href: "/college-admin" },
        { key: "roster", label: "Padrón", icon: "Users", href: "/college-admin/roster" },
        { key: "verification", label: "Verificaciones", icon: "CheckCircle", href: "/college-admin/verification", badge: "12" },
        { key: "verifier_panel", label: "Panel Verificador", icon: "FileCheck", href: "/entity/verifier" },
        { key: "sanctions", label: "Sanciones", icon: "AlertTriangle", href: "/college-admin/sanctions" },
        { key: "reports", label: "Reportes", icon: "FileText", href: "/college-admin/reports" },
        { key: "settings", label: "Configuración", icon: "Settings", href: "/college-admin/settings" },
      ],

      // 7. ROL: COLLEGE_ADMIN
      college_admin: [
        { key: "dashboard", label: "Panel Colegio", icon: "Shield", href: "/college-admin" },
        { key: "roster", label: "Padrón", icon: "Users", href: "/college-admin/roster" },
        { key: "verification", label: "Verificaciones", icon: "CheckCircle", href: "/college-admin/verification", badge: "12" },
        { key: "verifier_panel", label: "Panel Verificador", icon: "FileCheck", href: "/entity/verifier" },
        { key: "sanctions", label: "Sanciones", icon: "AlertTriangle", href: "/college-admin/sanctions" },
        { key: "reports", label: "Reportes", icon: "FileText", href: "/college-admin/reports" },
        { key: "settings", label: "Configuración", icon: "Settings", href: "/college-admin/settings" },
      ],

      // 8. ROL: VERIFIER
      verifier: [
        { key: "dashboard", label: "Panel Verificador", icon: "FileCheck", href: "/entity/verifier" },
        { key: "pending", label: "Pendientes", icon: "Clock", href: "/entity/verifier?tab=pending", badge: "8" },
        { key: "approved", label: "Aprobados", icon: "CheckCircle", href: "/entity/verifier?tab=approved" },
        { key: "rejected", label: "Rechazados", icon: "XCircle", href: "/entity/verifier?tab=rejected" },
      ],

      // 9. ROL: SUPER_ADMIN
      super_admin: [
        { key: "dashboard", label: "Admin", icon: "Settings", href: "/admin-dashboard" },
        { key: "audit", label: "Auditoría", icon: "Eye", href: "/admin/audit" },
        { key: "config", label: "Configuración Global", icon: "Cog", href: "/admin/config" },
        { key: "catalogs", label: "Catálogos Maestros", icon: "Database", href: "/admin/catalogs" },
      ],
    };
  }, [badges, normalizedBusinessType, modulos]); // Dependencias actualizadas

  const navItems = itemsByRole?.[userRole] || itemsByRole?.patient;

  const handleNavigation = (href, key) => {
    setActiveKey(key);
    navigate(href);
    onMobileClose?.();
  };

  // 6. FUNCIÓN DE RENDERIZADO RECURSIVO
  const renderItem = (item, depth = 0) => {
    const isActive = activeKey === item?.key;
    const isExpanded = !!expandedGroups?.[item?.key];
    const isDisabled = item?.disabled;
    
    // Clases comunes para ítems (incluyendo estado de deshabilitado)
    const itemClasses = cn(
      "w-full justify-start mb-1 px-3 py-2 text-sm font-medium transition-colors",
      isCollapsed ? "px-2" : "px-3",
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      isDisabled && "opacity-40 pointer-events-none" // Estilo si está deshabilitado
    );

    // Lógica para renderizar grupos
    if (item?.isGroup) {
      return (
        <div key={item?.key} className="mb-1">
          <Button
            className={cn("w-full justify-between", itemClasses)} 
            variant="ghost"
            onClick={() => !isDisabled && toggleGroup(item?.key)} // No expandir si está deshabilitado
          >
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon} size={18} />
              {!isCollapsed && <span>{item?.label}</span>}
            </div>
            {!isCollapsed && (
              <Icon
                name="ChevronDown"
                size={16}
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            )}
          </Button>
          {!isCollapsed && isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item?.children?.map((c) => renderItem(c, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Lógica para renderizar ítems simples
    const badgeValue = item?.badge;
    const badgeElement = (badgeValue !== undefined && badgeValue !== null && badgeValue !== 0) && (
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
            {badgeValue}
        </span>
    );

    return (
      <Button
        key={item?.key}
        variant="ghost"
        onClick={() => !isDisabled && handleNavigation(item?.href, item?.key)}
        className={cn(itemClasses, depth > 0 ? "ml-2" : "", "justify-start")}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Icon name={item?.icon} size={18} />
            {!isCollapsed && <span>{item?.label}</span>}
          </div>
          {!isCollapsed && badgeElement}
        </div>
      </Button>
    );
  };

  // 7. DETERMINACIÓN DEL ETIQUETA DEL ROL
  const roleLabel =
    userRole === "provider" ? `Proveedor • ${normalizedBusinessType.toUpperCase()}`
    // ... (resto de roles)
    : userRole === "patient" ? "Paciente"
      : userRole === "doctor" ? "Médico"
      : userRole === "specialist" ? "Especialista"
      : userRole === "clinic" ? "Clínica"
      : userRole === "association" ? "Colegio"
      : userRole === "college_admin" ? "Colegio"
      : userRole === "verifier" ? "Verificador"
      : userRole === "super_admin" ? "Admin" : "Usuario";

  // 8. RENDERIZADO FINAL
  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-50 bg-card border-r border-border transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${className}`}
      >
        {/* Cabecera y Botón de Colapso */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                <Icon name="Activity" size={14} color="var(--color-primary)" />
              </div>
              <span className="text-sm font-semibold text-foreground">{roleLabel}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden lg:flex min-w-touch min-h-touch"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
          </Button>
        </div>

        {/* Contenedor de Navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems?.map((it) => renderItem(it))}
        </nav>

        {/* Pie de Página: Ayuda y Configuración */}
        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/help")}
              >
                <Icon name="HelpCircle" size={16} className="mr-3" />
                Ayuda y Soporte
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
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
                className="w-full min-h-touch"
                title="Ayuda y Soporte"
              >
                <Icon name="HelpCircle" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                className="w-full min-h-touch"
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