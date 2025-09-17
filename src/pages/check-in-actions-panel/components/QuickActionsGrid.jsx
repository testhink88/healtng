import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsGrid = ({ onActionClick }) => {
  const actions = [
    {
      id: 'prescription',
      label: 'Nueva Receta',
      icon: 'FileText',
      color: 'bg-blue-500',
      description: 'Prescribir medicamentos'
    },
    {
      id: 'diagnosis',
      label: 'Nuevo Diagnóstico',
      icon: 'Stethoscope',
      color: 'bg-green-500',
      description: 'Registrar diagnóstico'
    },
    {
      id: 'referral',
      label: 'Derivar',
      icon: 'Share2',
      color: 'bg-orange-500',
      description: 'Enviar a especialista'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {actions?.map((action) => (
        <Button
          key={action?.id}
          variant="outline"
          onClick={() => onActionClick?.(action?.id)}
          className="p-3 h-auto justify-start hover:bg-primary/5 border-primary/20 transition-all duration-200 group"
        >
          <div className="flex items-center space-x-3 w-full">
            <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
              <Icon name={action?.icon} size={18} color="white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-sm">
                {action?.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {action?.description}
              </p>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActionsGrid;