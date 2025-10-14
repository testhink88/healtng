import React from 'react';

import Icon from '@/components/AppIcon';

const UrgencySelector = ({ selectedUrgency, onChange }) => {
  const urgencyLevels = [
    {
      value: 'low',
      label: 'Baja',
      description: 'Consulta rutinaria o preventiva',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: 'Clock'
    },
    {
      value: 'normal',
      label: 'Normal',
      description: 'Consulta estándar con especialista',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: 'Calendar'
    },
    {
      value: 'high',
      label: 'Alta',
      description: 'Requiere atención prioritaria',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: 'AlertTriangle'
    },
    {
      value: 'urgent',
      label: 'Urgente',
      description: 'Atención médica inmediata',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      icon: 'AlertCircle'
    }
  ];

  const selectedLevel = urgencyLevels?.find(level => level?.value === selectedUrgency);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Nivel de Urgencia *
      </label>
      
      {/* Visual Urgency Selector */}
      <div className="grid grid-cols-2 gap-3">
        {urgencyLevels?.map(level => (
          <button
            key={level?.value}
            type="button"
            onClick={() => onChange?.(level?.value)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedUrgency === level?.value
                ? `${level?.borderColor} ${level?.bgColor}`
                : 'border-border hover:border-border/50 bg-transparent hover:bg-muted/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                selectedUrgency === level?.value ? level?.bgColor : 'bg-muted'
              }`}>
                <Icon 
                  name={level?.icon} 
                  size={14} 
                  className={selectedUrgency === level?.value ? level?.color : 'text-muted-foreground'} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${
                  selectedUrgency === level?.value ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {level?.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                  {level?.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Urgency Summary */}
      {selectedLevel && (
        <div className={`p-3 rounded-lg border ${selectedLevel?.borderColor} ${selectedLevel?.bgColor}`}>
          <div className="flex items-center space-x-2">
            <Icon name={selectedLevel?.icon} size={16} className={selectedLevel?.color} />
            <span className="text-sm font-medium text-foreground">
              Urgencia {selectedLevel?.label}
            </span>
            <span className="text-xs text-muted-foreground">
              - {selectedLevel?.description}
            </span>
          </div>
        </div>
      )}

      {/* Urgency Guidelines */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Guía de Urgencias</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><span className="font-medium text-success">Baja:</span> Consulta en 2-4 semanas</p>
          <p><span className="font-medium text-primary">Normal:</span> Consulta en 1-2 semanas</p>
          <p><span className="font-medium text-warning">Alta:</span> Consulta en 2-5 días</p>
          <p><span className="font-medium text-error">Urgente:</span> Consulta en 24-48 horas</p>
        </div>
      </div>
    </div>
  );
};

export default UrgencySelector;