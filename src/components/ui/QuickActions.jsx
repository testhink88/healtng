import React from 'react';
import Icon from '../AppIcon';


const QuickActions = ({ 
  userRole = 'patient',
  variant = 'grid', // 'grid', 'horizontal', 'compact'
  className = '',
  onActionClick,
  showLabels = true,
  maxActions = 8
}) => {
  
  const getQuickActionsByRole = () => {
    const actionSets = {
      patient: [
        {
          key: 'find-doctors',
          label: 'Buscar Médicos',
          description: 'Encuentra especialistas cerca de ti',
          icon: 'Search',
          href: '/doctor-discovery',
          color: 'primary',
          urgent: false
        },
        {
          key: 'book-appointment',
          label: 'Agendar Cita',
          description: 'Reserva tu próxima consulta médica',
          icon: 'Calendar',
          href: '/appointment-booking',
          color: 'success',
          urgent: false,
          badge: 'Disponible'
        },
        {
          key: 'prescriptions',
          label: 'Mis Recetas',
          description: 'Gestiona tus medicamentos',
          icon: 'Pill',
          href: '/prescription-management',
          color: 'warning',
          urgent: false,
          badge: '2'
        },
        {
          key: 'medical-history',
          label: 'Historial Médico',
          description: 'Revisa tu historial clínico',
          icon: 'FileText',
          href: '/medical-history',
          color: 'secondary',
          urgent: false
        },
        {
          key: 'emergency',
          label: 'Emergencia',
          description: 'Contacto de emergencia 24/7',
          icon: 'Phone',
          href: '/emergency',
          color: 'error',
          urgent: true
        },
        {
          key: 'marketplace',
          label: 'Marketplace',
          description: 'Compra productos médicos',
          icon: 'ShoppingBag',
          href: '/marketplace',
          color: 'accent',
          urgent: false
        },
        {
          key: 'payments',
          label: 'Pagos',
          description: 'Gestiona tus pagos médicos',
          icon: 'CreditCard',
          href: '/payment-processing',
          color: 'secondary',
          urgent: false
        },
        {
          key: 'telemedicine',
          label: 'Telemedicina',
          description: 'Consultas médicas virtuales',
          icon: 'Video',
          href: '/telemedicine',
          color: 'primary',
          urgent: false,
          badge: 'Nuevo'
        }
      ],
      doctor: [
        {
          key: 'today-schedule',
          label: 'Agenda de Hoy',
          description: 'Revisa tus citas del día',
          icon: 'Calendar',
          href: '/appointment-booking',
          color: 'primary',
          urgent: false,
          badge: '5'
        },
        {
          key: 'patients',
          label: 'Mis Pacientes',
          description: 'Gestiona información de pacientes',
          icon: 'Users',
          href: '/patient-management',
          color: 'secondary',
          urgent: false
        },
        {
          key: 'prescriptions',
          label: 'Recetas',
          description: 'Crear y gestionar recetas',
          icon: 'Pill',
          href: '/prescription-management',
          color: 'success',
          urgent: false
        },
        {
          key: 'spaces',
          label: 'Reservar Espacio',
          description: 'Gestiona consultorios y salas',
          icon: 'Building',
          href: '/space-reservation',
          color: 'warning',
          urgent: false
        },
        {
          key: 'emergency-patients',
          label: 'Pacientes Urgentes',
          description: 'Atención prioritaria requerida',
          icon: 'AlertTriangle',
          href: '/emergency-patients',
          color: 'error',
          urgent: true,
          badge: '2'
        },
        {
          key: 'telemedicine',
          label: 'Consultas Virtuales',
          description: 'Atención médica remota',
          icon: 'Video',
          href: '/telemedicine',
          color: 'primary',
          urgent: false
        },
        {
          key: 'reports',
          label: 'Reportes Médicos',
          description: 'Genera informes clínicos',
          icon: 'FileText',
          href: '/medical-reports',
          color: 'accent',
          urgent: false
        },
        {
          key: 'continuing-education',
          label: 'Educación Continua',
          description: 'Cursos y certificaciones',
          icon: 'GraduationCap',
          href: '/education',
          color: 'secondary',
          urgent: false
        }
      ],
      clinic_admin: [
        {
          key: 'dashboard-overview',
          label: 'Resumen Diario',
          description: 'KPIs y métricas operativas',
          icon: 'BarChart3',
          href: '/professional-dashboard',
          color: 'primary',
          urgent: false
        },
        {
          key: 'staff-management',
          label: 'Gestión de Personal',
          description: 'Administra médicos y staff',
          icon: 'Users',
          href: '/staff-management',
          color: 'secondary',
          urgent: false
        },
        {
          key: 'space-management',
          label: 'Gestión de Espacios',
          description: 'Optimiza uso de consultorios',
          icon: 'Building',
          href: '/space-reservation',
          color: 'warning',
          urgent: false,
          badge: '3'
        },
        {
          key: 'financial-overview',
          label: 'Resumen Financiero',
          description: 'Ingresos y pagos pendientes',
          icon: 'DollarSign',
          href: '/payment-processing',
          color: 'success',
          urgent: false
        },
        {
          key: 'patient-flow',
          label: 'Flujo de Pacientes',
          description: 'Monitorea tiempos de espera',
          icon: 'Activity',
          href: '/patient-flow',
          color: 'accent',
          urgent: false
        },
        {
          key: 'inventory',
          label: 'Inventario Médico',
          description: 'Suministros y equipamiento',
          icon: 'Package',
          href: '/inventory',
          color: 'secondary',
          urgent: false
        },
        {
          key: 'compliance',
          label: 'Cumplimiento',
          description: 'Auditorías y regulaciones',
          icon: 'Shield',
          href: '/compliance',
          color: 'primary',
          urgent: false
        },
        {
          key: 'emergency-protocols',
          label: 'Protocolos de Emergencia',
          description: 'Procedimientos críticos',
          icon: 'AlertTriangle',
          href: '/emergency-protocols',
          color: 'error',
          urgent: true
        }
      ]
    };

    return actionSets?.[userRole] || actionSets?.patient;
  };

  const handleActionClick = (action) => {
    onActionClick?.(action);
    if (action?.href) {
      window.location.href = action?.href;
    }
  };

  const getColorClasses = (color, urgent = false) => {
    if (urgent) {
      return {
        bg: 'bg-error/10 hover:bg-error/20 border-error/20',
        icon: 'text-error',
        text: 'text-error'
      };
    }

    const colorMap = {
      primary: {
        bg: 'bg-primary/10 hover:bg-primary/20 border-primary/20',
        icon: 'text-primary',
        text: 'text-primary'
      },
      secondary: {
        bg: 'bg-secondary/10 hover:bg-secondary/20 border-secondary/20',
        icon: 'text-secondary',
        text: 'text-secondary'
      },
      success: {
        bg: 'bg-success/10 hover:bg-success/20 border-success/20',
        icon: 'text-success',
        text: 'text-success'
      },
      warning: {
        bg: 'bg-warning/10 hover:bg-warning/20 border-warning/20',
        icon: 'text-warning',
        text: 'text-warning'
      },
      error: {
        bg: 'bg-error/10 hover:bg-error/20 border-error/20',
        icon: 'text-error',
        text: 'text-error'
      },
      accent: {
        bg: 'bg-accent hover:bg-accent/80 border-accent',
        icon: 'text-accent-foreground',
        text: 'text-accent-foreground'
      }
    };

    return colorMap?.[color] || colorMap?.primary;
  };

  const actions = getQuickActionsByRole()?.slice(0, maxActions);

  if (variant === 'horizontal') {
    return (
      <div className={`flex space-x-4 overflow-x-auto pb-2 ${className}`}>
        {actions?.map((action) => {
          const colors = getColorClasses(action?.color, action?.urgent);
          return (
            <div
              key={action?.key}
              onClick={() => handleActionClick(action)}
              className={`relative flex-shrink-0 w-32 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${colors?.bg}`}
            >
              {action?.badge && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {action?.badge}
                </span>
              )}
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-card flex items-center justify-center ${colors?.icon}`}>
                  <Icon name={action?.icon} size={24} />
                </div>
                {showLabels && (
                  <p className={`text-sm font-medium ${colors?.text}`}>{action?.label}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {actions?.slice(0, 4)?.map((action) => {
          const colors = getColorClasses(action?.color, action?.urgent);
          return (
            <div
              key={action?.key}
              onClick={() => handleActionClick(action)}
              className={`relative p-3 rounded-lg border cursor-pointer transition-all duration-150 ${colors?.bg} group`}
            >
              {action?.badge && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {action?.badge}
                </span>
              )}
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-card flex items-center justify-center ${colors?.icon}`}>
                  <Icon name={action?.icon} size={16} />
                </div>
                {showLabels && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${colors?.text}`}>{action?.label}</p>
                  </div>
                )}
                <Icon name="ArrowRight" size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default grid variant
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {actions?.map((action) => {
        const colors = getColorClasses(action?.color, action?.urgent);
        return (
          <div
            key={action?.key}
            onClick={() => handleActionClick(action)}
            className={`relative p-6 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md ${colors?.bg} group`}
          >
            {action?.badge && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                {action?.badge}
              </span>
            )}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center ${colors?.icon} group-hover:scale-105 transition-transform duration-150`}>
                <Icon name={action?.icon} size={28} />
              </div>
              
              {showLabels && (
                <div>
                  <h3 className={`font-semibold mb-1 ${colors?.text}`}>{action?.label}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{action?.description}</p>
                </div>
              )}
              
              {action?.urgent && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs bg-error text-error-foreground px-2 py-1 rounded-full">
                    <Icon name="AlertTriangle" size={10} className="mr-1" />
                    Urgente
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuickActions;