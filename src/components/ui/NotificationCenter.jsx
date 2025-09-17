import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  userRole = 'patient',
  className = '',
  onNotificationClick,
  variant = 'dropdown' // 'dropdown', 'panel'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'appointments', 'prescriptions', 'payments'
  const notificationRef = useRef(null);

  // Initialize notifications based on user role
  useEffect(() => {
    const getNotificationsByRole = () => {
      const baseNotifications = {
        patient: [
          {
            id: 1,
            type: 'appointment',
            title: 'Recordatorio de Cita',
            message: 'Cita médica mañana a las 10:00 AM con Dr. Carlos Mendoza',
            time: '2h',
            unread: true,
            priority: 'high',
            actionUrl: '/appointment-booking'
          },
          {
            id: 2,
            type: 'prescription',
            title: 'Receta Lista',
            message: 'Su receta de Losartán está lista para recoger en Farmacia Central',
            time: '4h',
            unread: true,
            priority: 'medium',
            actionUrl: '/prescription-management'
          },
          {
            id: 3,
            type: 'payment',
            title: 'Pago Procesado',
            message: 'Pago de $45.00 USD procesado exitosamente para consulta médica',
            time: '1d',
            unread: false,
            priority: 'low',
            actionUrl: '/payment-processing'
          },
          {
            id: 4,
            type: 'result',
            title: 'Resultados Disponibles',
            message: 'Los resultados de su examen de sangre ya están disponibles',
            time: '2d',
            unread: false,
            priority: 'medium',
            actionUrl: '/medical-history'
          }
        ],
        doctor: [
          {
            id: 1,
            type: 'appointment',
            title: 'Nueva Cita Agendada',
            message: 'María González agendó cita para mañana 2:30 PM',
            time: '1h',
            unread: true,
            priority: 'high',
            actionUrl: '/appointment-booking'
          },
          {
            id: 2,
            type: 'patient',
            title: 'Paciente Urgente',
            message: 'José Martínez requiere atención prioritaria - Dolor en el pecho',
            time: '3h',
            unread: true,
            priority: 'urgent',
            actionUrl: '/patient-management'
          },
          {
            id: 3,
            type: 'space',
            title: 'Reserva de Consultorio',
            message: 'Consultorio B reservado para procedimiento especial',
            time: '5h',
            unread: false,
            priority: 'medium',
            actionUrl: '/space-reservation'
          },
          {
            id: 4,
            type: 'payment',
            title: 'Pago Recibido',
            message: 'Pago de $120.00 USD recibido por consulta especializada',
            time: '1d',
            unread: false,
            priority: 'low',
            actionUrl: '/payment-processing'
          }
        ],
        clinic_admin: [
          {
            id: 1,
            type: 'system',
            title: 'Reporte Diario',
            message: '15 citas completadas, $2,340 USD en ingresos',
            time: '30m',
            unread: true,
            priority: 'medium',
            actionUrl: '/professional-dashboard'
          },
          {
            id: 2,
            type: 'space',
            title: 'Mantenimiento Programado',
            message: 'Consultorio C requiere mantenimiento el viernes',
            time: '2h',
            unread: true,
            priority: 'medium',
            actionUrl: '/space-reservation'
          },
          {
            id: 3,
            type: 'payment',
            title: 'Facturación Pendiente',
            message: '3 facturas pendientes por procesar',
            time: '4h',
            unread: false,
            priority: 'high',
            actionUrl: '/payment-processing'
          }
        ]
      };

      return baseNotifications[userRole] || baseNotifications.patient;
    };

    setNotifications(getNotificationsByRole());
  }, [userRole]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return 'Calendar';
      case 'prescription': return 'Pill';
      case 'payment': return 'CreditCard';
      case 'result': return 'FileText';
      case 'patient': return 'User';
      case 'space': return 'Building';
      case 'system': return 'BarChart3';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'var(--color-error)';
    if (priority === 'high') return 'var(--color-warning)';
    
    switch (type) {
      case 'appointment': return 'var(--color-primary)';
      case 'prescription': return 'var(--color-success)';
      case 'payment': return 'var(--color-secondary)';
      case 'result': return 'var(--color-accent-foreground)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-xs bg-error text-error-foreground px-2 py-1 rounded-full">Urgente</span>;
      case 'high':
        return <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded-full">Alta</span>;
      default:
        return null;
    }
  };

  const filterOptions = [
    { key: 'all', label: 'Todas', icon: 'Bell' },
    { key: 'unread', label: 'No leídas', icon: 'BellRing' },
    { key: 'appointment', label: 'Citas', icon: 'Calendar' },
    { key: 'prescription', label: 'Recetas', icon: 'Pill' },
    { key: 'payment', label: 'Pagos', icon: 'CreditCard' }
  ];

  return (
    <div ref={notificationRef} className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative min-w-touch min-h-touch"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown/Panel */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 bg-popover border border-border rounded-lg shadow-lg animate-fade-in z-50 ${
          variant === 'panel' ? 'w-96' : 'w-80'
        }`}>
          
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Notificaciones</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:text-primary"
                  >
                    Marcar todas como leídas
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6"
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 overflow-x-auto">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(option.key)}
                  className="flex items-center space-x-1 text-xs whitespace-nowrap"
                >
                  <Icon name={option.icon} size={12} />
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <Icon name="Bell" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  {filter === 'unread' ? 'No hay notificaciones sin leer' : 'No hay notificaciones'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors duration-150 ${
                    notification.unread ? 'bg-accent/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.priority === 'urgent' ? 'bg-error/10' :
                      notification.priority === 'high' ? 'bg-warning/10' :
                      notification.type === 'appointment' ? 'bg-primary/10' :
                      notification.type === 'prescription'? 'bg-success/10' : 'bg-muted'
                    }`}>
                      <Icon 
                        name={getNotificationIcon(notification.type)} 
                        size={16} 
                        color={getNotificationColor(notification.type, notification.priority)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notification.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getPriorityBadge(notification.priority)}
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.unread && (
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-xs text-primary font-medium">Nueva</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={notification.unread ? "Marcar como leída" : "Marcar como no leída"}
                      >
                        <Icon name={notification.unread ? "Check" : "RotateCcw"} size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        title="Eliminar notificación"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/notifications'}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Ver todas las notificaciones
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Limpiar todo
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;