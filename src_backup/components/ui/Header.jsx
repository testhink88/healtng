// src/@/@/components/ui/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ✅ Usando alias en lugar de imports relativos
import Icon from '@/components/ui/AppIcon';
import Button from '@/components/ui/Button';

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

  const markAsRead = (id) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

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
      case 'appointment': return 'Calendar';
      case 'prescription': return 'Pill';
      case 'payment': return 'CreditCard';
      default: return 'Bell';
    }
  };

  // Accesos rápidos por rol
  const getRoleBasedQuickActions = () => {
    switch (effectiveRole) {
      case 'patient':
        return [
          { label: 'Buscar Médicos', icon: 'Search', href: '/doctor-discovery' },
          { label: 'Mis Citas', icon: 'Calendar', href: '/patient-appointment-history' },
          { label: 'Agendar Cita', icon: 'Plus', href: '/new-patient-appointment' },
          { label: 'Recetas', icon: 'Pill', href: '/prescription-management' },
        ];
      case 'doctor':
      case 'specialist':
        return [
          { label: 'Agenda de Citas', icon: 'Calendar', href: '/appointment-booking' },
          { label: 'Mis Pacientes', icon: 'Users', href: '/patients' },
          { label: 'Nueva Receta', icon: 'FileText', href: '/prescriptions/new' },
        ];
      case 'clinic':
      case 'clinic_admin':
        return [
          { label: 'Inventario', icon: 'Package', href: '/clinic/inventory' },
          { label: 'Órdenes de Compra', icon: 'ShoppingCart', href: '/clinic/purchase-orders' },
          { label: 'Agenda de Citas', icon: 'Calendar', href: '/appointment-booking' },
          { label: 'Marketplace', icon: 'Store', href: '/marketplace-hub' },
        ];
      case 'provider': // ✅ corregido (sin duplicado)
        return [
          { label: 'Panel Proveedor', icon: 'BarChart3', href: '/provider/dashboard' },
          { label: 'Productos', icon: 'Package2', href: '/provider/products' },
          { label: 'Cargar CSV/XLSX', icon: 'Upload', href: '/provider/uploads' },
        ];
      default:
        return [
          { label: 'Buscar Médicos', icon: 'Search', href: '/doctor-discovery' },
          { label: 'Marketplace', icon: 'Store', href: '/marketplace-hub' },
          { label: 'Pagos', icon: 'CreditCard', href: '/payment-processing' },
        ];
    }
  };

  const quickActions = getRoleBasedQuickActions();

  const setRoleAndReload = (role) => {
    localStorage.setItem('userRole', role);
    navigate(0); // recarga suave
  };

  // === Header para NO autenticados ===
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
          <Button variant="default" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </Button>
        </div>
      </header>
    );
  }

  // === Header para autenticados ===
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
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

        {/* 🔔 Search, Notifs, Profile */}
        {/* ... mantén aquí tu bloque de búsqueda, notificaciones y perfil igual como lo tenías */}
      </div>
    </header>
  );
};

export default Header;
