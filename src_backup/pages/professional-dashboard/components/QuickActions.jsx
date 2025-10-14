import React from 'react';
import Icon from '@/components/AppIcon';


const QuickActions = ({ userRole = 'doctor', className = '' }) => {
  const getQuickActionsByRole = () => {
    const actionSets = {
      doctor: [
        {
          key: 'new-appointment',
          label: 'Nueva Cita',
          description: 'Agendar nueva consulta',
          icon: 'CalendarPlus',
          href: '/appointment-booking',
          color: 'primary'
        },
        {
          key: 'find-patient',
          label: 'Buscar Paciente',
          description: 'Encontrar historial médico',
          icon: 'Search',
          href: '/patient-management',
          color: 'secondary'
        },
        {
          key: 'finances',
          label: 'Finanzas',
          description: 'Revisar ingresos y pagos',
          icon: 'DollarSign',
          href: '/payment-processing',
          color: 'success'
        },
        {
          key: 'prescriptions',
          label: 'Recetas',
          description: 'Gestionar prescripciones',
          icon: 'Pill',
          href: '/prescription-management',
          color: 'warning'
        },
        {
          key: 'spaces',
          label: 'Espacios',
          description: 'Reservar consultorios',
          icon: 'Building',
          href: '/space-reservation',
          color: 'accent'
        },
        {
          key: 'marketplace',
          label: 'Suministros',
          description: 'Equipos y medicamentos',
          icon: 'Package',
          href: '/marketplace',
          color: 'secondary'
        }
      ],
      specialist: [
        {
          key: 'new-consultation',
          label: 'Nueva Consulta',
          description: 'Consulta especializada',
          icon: 'Stethoscope',
          href: '/appointment-booking',
          color: 'primary'
        },
        {
          key: 'patient-records',
          label: 'Expedientes',
          description: 'Historiales especializados',
          icon: 'FileText',
          href: '/patient-management',
          color: 'secondary'
        },
        {
          key: 'procedures',
          label: 'Procedimientos',
          description: 'Gestionar procedimientos',
          icon: 'Activity',
          href: '/procedures',
          color: 'success'
        },
        {
          key: 'equipment',
          label: 'Equipamiento',
          description: 'Equipos especializados',
          icon: 'Monitor',
          href: '/marketplace',
          color: 'warning'
        }
      ]
    };

    return actionSets?.[userRole] || actionSets?.doctor;
  };

  const handleActionClick = (action) => {
    if (action?.href) {
      window.location.href = action?.href;
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20',
      secondary: 'bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20',
      success: 'bg-success/10 hover:bg-success/20 text-success border-success/20',
      warning: 'bg-warning/10 hover:bg-warning/20 text-warning border-warning/20',
      accent: 'bg-accent/50 hover:bg-accent/70 text-accent-foreground border-accent'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const actions = getQuickActionsByRole();

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Acciones Rápidas</h2>
        <Icon name="Zap" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions?.map((action) => (
          <div
            key={action?.key}
            onClick={() => handleActionClick(action)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${getColorClasses(action?.color)}`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center">
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{action?.label}</h3>
              </div>
            </div>
            <p className="text-sm opacity-80 line-clamp-2">{action?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;