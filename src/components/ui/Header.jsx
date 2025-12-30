// src/components/ui/Header.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

/**
 * 👇 Rutas del logotipo (se sirven desde /public)
 * Coloca tus archivos en:
 * public/assets/brand/logo-light.svg
 * public/assets/brand/logo-dark.svg
 * (Opcional) public/assets/brand/logo-mark.svg
 *
 * Si solo tienes un logo, apunta ambos a la misma ruta.
 */
const BRAND = {
  name: "Healtng",
  logoLight: "/assets/brand/logo-light.svg",
  logoDark: "/assets/brand/logo-dark.svg",
};

const Header = ({
  userRole = "patient",
  isAuthenticated = true,
  onMenuToggle,
  className = "",
}) => {
  const navigate = useNavigate();

  const effectiveRole = userRole || localStorage.getItem("userRole") || "patient";

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    { id: 1, type: "appointment", message: "Cita médica mañana a las 10:00 AM", time: "2h", unread: true },
    { id: 2, type: "prescription", message: "Receta lista para recoger", time: "4h", unread: true },
    { id: 3, type: "payment", message: "Pago procesado exitosamente", time: "1d", unread: false },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  useEffect(() => {
    const closeAll = (e) => {
      if (!e.target.closest(".notification-dropdown")) setIsNotificationOpen(false);
      if (!e.target.closest(".profile-dropdown")) setIsProfileOpen(false);
      if (!e.target.closest(".search-container")) setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return "Calendar";
      case "prescription":
        return "Pill";
      case "payment":
        return "CreditCard";
      default:
        return "Bell";
    }
  };

  const getRoleBasedQuickActions = () => {
    switch (effectiveRole) {
      case "patient":
        return [
          { label: "Buscar Médicos", icon: "Search", href: "/doctor-discovery" },
          { label: "Mis Citas", icon: "Calendar", href: "/patient-appointment-history" },
          { label: "Agendar Cita", icon: "Plus", href: "/new-patient-appointment" },
          { label: "Recetas", icon: "Pill", href: "/prescription-management" },
        ];
      case "doctor":
      case "specialist":
        return [
          { label: "Agenda de Citas", icon: "Calendar", href: "/appointment-booking" },
          { label: "Mis Pacientes", icon: "Users", href: "/patients" },
          { label: "Nueva Receta", icon: "FileText", href: "/prescriptions/new" },
        ];
      case "clinic":
      case "clinic_admin":
        return [
          { label: "Inventario", icon: "Package", href: "/clinic/inventory" },
          { label: "Órdenes de Compra", icon: "ShoppingCart", href: "/clinic/purchase-orders" },
          { label: "Agenda de Citas", icon: "Calendar", href: "/appointment-booking" },
          { label: "Marketplace", icon: "Store", href: "/marketplace-hub" },
        ];
      case "provider":
        return [
          { label: "Panel Proveedor", icon: "BarChart3", href: "/provider/dashboard" },
          { label: "Productos", icon: "Package2", href: "/provider/products" },
          { label: "Cargar CSV/XLSX", icon: "Upload", href: "/provider/uploads" },
        ];
      default:
        return [
          { label: "Buscar Médicos", icon: "Search", href: "/doctor-discovery" },
          { label: "Marketplace", icon: "Store", href: "/marketplace-hub" },
          { label: "Pagos", icon: "CreditCard", href: "/payment-processing" },
        ];
    }
  };

  const quickActions = getRoleBasedQuickActions();

  if (!isAuthenticated) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border ${className}`}>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <button onClick={() => navigate("/")} className="flex items-center space-x-2">
            {/* 🔵 Logo (no autenticado) */}
            <picture>
              <source srcSet={BRAND.logoDark} media="(prefers-color-scheme: dark)" />
              <img
                src={BRAND.logoLight}
                alt={BRAND.name}
                className="h-7 w-auto select-none"
                draggable={false}
              />
            </picture>
          </button>
          <Button variant="default" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border overflow-visible ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* IZQUIERDA */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
            <Icon name="Menu" size={20} />
          </Button>
          <button onClick={() => navigate("/")} className="flex items-center space-x-2">
            {/* 🔵 Logo (autenticado) */}
            <picture>
              <source srcSet={BRAND.logoDark} media="(prefers-color-scheme: dark)" />
              <img
                src={BRAND.logoLight}
                alt={BRAND.name}
                className="h-7 w-auto select-none"
                draggable={false}
              />
            </picture>
          </button>
          <nav className="hidden lg:flex items-center space-x-1 ml-8">
            {quickActions.slice(0, 4).map((action, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => navigate(action.href)}
              >
                <Icon name={action.icon} size={16} />
                <span>{action.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* DERECHA */}
        <div className="flex items-center space-x-2">
          {/* Búsqueda */}
          <div className="search-container relative">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen((v) => !v)}>
              <Icon name="Search" size={20} />
            </Button>
            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <form onSubmit={handleSearch} className="p-4">
                  <div className="relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar médicos, servicios, medicamentos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">Presiona Enter para buscar</div>
                </form>
              </div>
            )}
          </div>

          {/* Notificaciones */}
          <div className="notification-dropdown relative">
            <Button variant="ghost" size="icon" onClick={() => setIsNotificationOpen((v) => !v)} className="relative">
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notificaciones</h3>
                  {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-xs text-muted-foreground hover:text-foreground">
                      Limpiar todo
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                          n.unread ? "bg-accent/20" : ""
                        }`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              n.type === "appointment"
                                ? "bg-primary/10"
                                : n.type === "prescription"
                                ? "bg-success/10"
                                : "bg-warning/10"
                            }`}
                          >
                            <Icon name={getNotificationIcon(n.type)} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{n.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                          {n.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Perfil */}
          <div className="profile-dropdown relative">
            <Button variant="ghost" onClick={() => setIsProfileOpen((v) => !v)} className="flex items-center space-x-2 px-3 py-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">Healtng</p>
                  <p className="text-sm text-muted-foreground">
                    Rol actual: <span className="font-medium">{effectiveRole}</span>
                  </p>
                </div>

                <div className="py-2">
                  <Button variant="ghost" className="w-full justify-start px-4 py-2 text-sm" onClick={() => navigate("/profile")}>
                    <Icon name="User" size={16} className="mr-3" />
                    Mi Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2 text-sm" onClick={() => navigate("/settings")}>
                    <Icon name="Settings" size={16} className="mr-3" />
                    Configuración
                  </Button>
                </div>

                {/* 🚫 Se eliminó la sección Cambiar rol */}

                <div className="border-t border-border my-2" />
                <div className="py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      localStorage.removeItem("auth-token");
                      navigate("/login");
                    }}
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Búsqueda móvil */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border p-4 z-50">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar médicos, servicios, medicamentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
