import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickActionsGrid = ({ className = '', onActionClick }) => {
  const quickActions = [
    {
      id: 'pharmacy',
      title: 'Farmacia',
      description: 'Medicamentos y productos de salud',
      icon: 'Pill',
      color: 'bg-success/10 hover:bg-success/20 border-success/20',
      iconColor: 'text-success',
      href: '/prescription-management',
      badge: '2 recetas'
    },
    {
      id: 'cardiology',
      title: 'Cardiología',
      description: 'Especialistas del corazón',
      icon: 'Heart',
      color: 'bg-error/10 hover:bg-error/20 border-error/20',
      iconColor: 'text-error',
      href: '/doctor-discovery?specialty=cardiology',
      badge: 'Disponible'
    },
    {
      id: 'pediatrics',
      title: 'Pediatría',
      description: 'Cuidado infantil especializado',
      icon: 'Baby',
      color: 'bg-warning/10 hover:bg-warning/20 border-warning/20',
      iconColor: 'text-warning',
      href: '/doctor-discovery?specialty=pediatrics',
      badge: null
    },
    {
      id: 'emergency',
      title: 'Emergencia',
      description: 'Atención médica urgente 24/7',
      icon: 'AlertTriangle',
      color: 'bg-error/10 hover:bg-error/20 border-error/20',
      iconColor: 'text-error',
      href: '/emergency',
      badge: '24/7',
      urgent: true
    },
    {
      id: 'laboratory',
      title: 'Laboratorio',
      description: 'Exámenes y análisis médicos',
      icon: 'TestTube',
      color: 'bg-primary/10 hover:bg-primary/20 border-primary/20',
      iconColor: 'text-primary',
      href: '/medical-history?tab=exams',
      badge: '1 resultado'
    },
    {
      id: 'teleconsultation',
      title: 'Teleconsulta',
      description: 'Consultas médicas virtuales',
      icon: 'Video',
      color: 'bg-secondary/10 hover:bg-secondary/20 border-secondary/20',
      iconColor: 'text-secondary',
      href: '/appointment-booking?type=virtual',
      badge: 'Nuevo'
    }
  ];

  const handleActionClick = (action) => {
    onActionClick?.(action);
    if (action?.href) {
      window.location.href = action?.href;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Servicios de Salud</h2>
        <button 
          onClick={() => window.location.href = '/doctor-discovery'}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150"
        >
          Ver todos
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            onClick={() => handleActionClick(action)}
            className={`relative p-6 rounded-2xl border cursor-pointer transition-all duration-150 hover:shadow-md group ${action?.color}`}
          >
            {action?.badge && (
              <span className={`absolute -top-2 -right-2 text-xs font-medium px-2 py-1 rounded-full ${
                action?.urgent 
                  ? 'bg-error text-error-foreground animate-pulse' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {action?.badge}
              </span>
            )}
            
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center ${action?.iconColor} group-hover:scale-105 transition-transform duration-150 shadow-sm`}>
                <Icon name={action?.icon} size={28} />
              </div>
              
              <h3 className={`font-semibold mb-2 ${action?.iconColor}`}>
                {action?.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {action?.description}
              </p>
              
              {action?.urgent && (
                <div className="mt-3">
                  <span className="inline-flex items-center text-xs bg-error text-error-foreground px-2 py-1 rounded-full">
                    <Icon name="AlertTriangle" size={10} className="mr-1" />
                    Urgente
                  </span>
                </div>
              )}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;