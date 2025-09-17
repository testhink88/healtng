import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'patient', isAuthenticated = true, onMenuToggle, className = '' }) => {
  const navigate = useNavigate();

  // Rol efectivo desde prop o localStorage
  const effectiveRole = userRole || localStorage.getItem('userRole') || 'patient';

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'appointment', message: 'Cita médica mañana a las 10:00 AM', time: '2h', unread: true },
    { id: 2, type: 'prescription', message: 'Receta lista para recoger', time: '4h', unread: true },
    { id: 3, type: 'payment', message: 'Pago procesado exitosamente', time: '1d', unread: false }
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const clearAllNotifications = () => { setNotifications([]); setIsNotificationOpen(false); };

  useEffect(() => {
    const closeAll = (e) => {
      if (!e.target.closest('.notification-dropdown')) setIsNotificationOpen(false);
      if (!e.target.closest('.profile-dropdown')) setIsProfileOpen(false);
      if (!e.target.closest('.search-container')) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', closeAll);
    return () => document.removeEventListener('mousedown', closeAll);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':  return 'Calendar';
      case 'prescription': return 'Pill';
      case 'payment':      return 'CreditCard';
      default:             return 'Bell';
    }
  };

  // Accesos rápidos por rol
  const getRoleBasedQuickActions = () => {
    switch (effectiveRole) {
      case 'patient':
        return [
          { label: 'Buscar Médicos', icon: 'Search',   href: '/doctor-discovery' },
          { label: 'Mis Citas',      icon: 'Calendar', href: '/patient-appointment-history' },
          { label: 'Agendar Cita',   icon: 'Plus',     href: '/new-patient-appointment' },
          { label: 'Recetas',        icon: 'Pill',     href: '/prescription-management' },
        ];
      case 'doctor':
      case 'specialist':
        return [
          { label: 'Agenda de Citas', icon: 'Calendar', href: '/appointment-booking' },
          { label: 'Mis Pacientes',   icon: 'Users',    href: '/patients' },
          { label: 'Nueva Receta',    icon: 'FileText', href: '/prescriptions/new' },
        ];
      case 'clinic':
      case 'clinic_admin':
        return [
          { label: 'Inventario',         icon: 'Package',      href: '/clinic/inventory' },
          { label: 'Órdenes de Compra',  icon: 'ShoppingCart', href: '/clinic/purchase-orders' },
          { label: 'Agenda de Citas',    icon: 'Calendar',     href: '/appointment-booking' },
          { label: 'Marketplace',        icon: 'Store',        href: '/marketplace-hub' },
        ];
      case 'provider':
      case 'provider':
        return [
          { label: 'Panel Proveedor', icon: 'BarChart3', href: '/provider-dashboard' },
          { label: 'Productos',       icon: 'Package2',  href: '/provider/products' },
          { label: 'Cargar CSV/XLSX', icon: 'Upload',    href: '/provider/uploads' },
        ];
      default:
        return [
          { label: 'Buscar Médicos', icon: 'Search',   href: '/doctor-discovery' },
          { label: 'Marketplace',    icon: 'Store',    href: '/marketplace-hub' },
          { label: 'Pagos',          icon: 'CreditCard', href: '/payment-processing' },
        ];
    }
  };

  const quickActions = getRoleBasedQuickActions();

  const setRoleAndReload = (role) => {
    localStorage.setItem('userRole', role);
    navigate(0); // recarga suave
  };

  if (!isAuthenticated) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border ${className}`}>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">Healtng</span>
          </div>
          <Button variant="default" className="min-w-touch min-h-touch" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden min-w-touch min-h-touch">
            <Icon name="Menu" size={20} />
          </Button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-foreground">Healtng</span>
          </div>

          {/* Quick actions */}
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

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="search-container relative">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="min-w-touch min-h-touch">
              <Icon name="Search" size={20} />
            </Button>
            {isSearchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg">
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
            <Button variant="ghost" size="icon" onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative min-w-touch min-h-touch">
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg">
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
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer ${n.unread ? 'bg-accent/20' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            n.type === 'appointment' ? 'bg-primary/10' :
                            n.type === 'prescription' ? 'bg-success/10' : 'bg-warning/10'
                          }`}>
                            <Icon
                              name={getNotificationIcon(n.type)}
                              size={16}
                              color={n.type === 'appointment' ? 'var(--color-primary)' :
                                     n.type === 'prescription' ? 'var(--color-success)' :
                                     'var(--color-warning)'}
                            />
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

          {/* Perfil + Cambiar rol */}
          <div className="profile-dropdown relative">
            <Button variant="ghost" onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 px-3 py-2 min-h-touch">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">Healtng</p>
                  <p className="text-sm text-muted-foreground">Rol actual: <span className="font-medium">{effectiveRole}</span></p>
                </div>

                {/* Acciones de perfil */}
                <div className="py-2">
                  <Button variant="ghost" className="w-full justify-start px-4 py-2 text-sm" onClick={() => navigate('/profile')}>
                    <Icon name="User" size={16} className="mr-3" />
                    Mi Perfil
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-4 py-2 text-sm" onClick={() => navigate('/settings')}>
                    <Icon name="Settings" size={16} className="mr-3" />
                    Configuración
                  </Button>
                </div>

                <div className="px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground">Cambiar rol</div>
                <div className="pb-2">
                  <div className="grid grid-cols-2 gap-1 px-2">
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('patient')}>
                      Paciente
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('doctor')}>
                      Médico
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('clinic')}>
                      Clínica
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('clinic_admin')}>
                      Clinic Admin
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('provider')}>
                      Proveedor
                    </Button>
                    <Button variant="ghost" className="justify-start text-sm" onClick={() => setRoleAndReload('specialist')}>
                      Especialista
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border my-2" />
                <div className="py-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => { localStorage.removeItem('auth-token'); navigate('/login'); }}
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border p-4">
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
