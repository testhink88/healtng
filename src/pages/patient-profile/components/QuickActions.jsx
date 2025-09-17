import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      key: 'prescription',
      label: 'Nueva Receta',
      icon: 'FileText',
      description: 'Crear una nueva receta médica',
      color: 'bg-primary text-primary-foreground hover:bg-primary/90'
    },
    {
      key: 'diagnosis',
      label: 'Nuevo Diagnóstico',
      icon: 'Stethoscope',
      description: 'Registrar nuevo diagnóstico',
      color: 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
    },
    {
      key: 'referral',
      label: 'Derivar',
      icon: 'Share2',
      description: 'Crear derivación a especialista',
      color: 'bg-accent text-accent-foreground hover:bg-accent/90'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Actions Card */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Zap" size={18} className="mr-2" />
            Acciones Rápidas
          </h3>
          <p className="text-sm text-muted-foreground">
            Acciones disponibles para este paciente
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          {actions?.map((action) => (
            <Button
              key={action?.key}
              onClick={() => onAction?.(action?.key)}
              className={`w-full justify-start p-4 h-auto ${action?.color}`}
              variant="default"
            >
              <div className="flex items-start space-x-3 w-full">
                <Icon name={action?.icon} size={20} className="mt-0.5" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{action?.label}</div>
                  <div className="text-sm opacity-90">{action?.description}</div>
                </div>
                <Icon name="ChevronRight" size={16} className="mt-0.5" />
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Info" size={18} className="mr-2" />
            Resumen Médico
          </h3>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado</span>
            <span className="text-sm font-medium text-success">Estable</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Última visita</span>
            <span className="text-sm font-medium text-foreground">15 Ago, 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próxima cita</span>
            <span className="text-sm font-medium text-foreground">10 Sep, 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Condiciones activas</span>
            <span className="text-sm font-medium text-warning">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Alergias</span>
            <span className="text-sm font-medium text-error">3</span>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Phone" size={18} className="mr-2" />
            Contacto
          </h3>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">+58 424-123-4567</span>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">maria.gonzalez@email.com</span>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
            <span className="text-sm text-foreground">
              Av. Francisco de Miranda, Los Palos Grandes, Caracas
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="AlertTriangle" size={18} className="mr-2" />
            Contacto de Emergencia
          </h3>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="font-medium text-foreground">Carlos González</div>
          <div className="text-sm text-muted-foreground">Esposo</div>
          <div className="flex items-center space-x-2">
            <Icon name="Phone" size={14} className="text-muted-foreground" />
            <span className="text-sm text-foreground">+58 414-987-6543</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;