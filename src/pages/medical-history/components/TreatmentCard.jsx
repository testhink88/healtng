import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TreatmentCard = ({ treatment, onViewDetails, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case'activo':
        return 'text-primary bg-primary/10';
      case 'completed': case'completado':
        return 'text-success bg-success/10';
      case 'suspended': case'suspendido':
        return 'text-warning bg-warning/10';
      case 'cancelled': case'cancelado':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'medication': case'medicamento':
        return 'Pill';
      case 'therapy': case'terapia':
        return 'Activity';
      case 'surgery': case'cirugía':
        return 'Scissors';
      case 'procedure': case'procedimiento':
        return 'Stethoscope';
      default:
        return 'Heart';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={getTypeIcon(treatment?.type)} size={16} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{treatment?.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(treatment?.status)}`}>
              {treatment?.status}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{treatment?.startDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{treatment?.prescribedBy}</span>
            </span>
            {treatment?.duration && (
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{treatment?.duration}</span>
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-w-touch min-h-touch"
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {/* Progress Bar */}
      {treatment?.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Progreso</span>
            <span className="text-sm text-muted-foreground">{treatment?.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(treatment?.progress)}`}
              style={{ width: `${treatment?.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Description */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {treatment?.description}
      </p>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Treatment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treatment?.dosage && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Dosis</h4>
                <p className="text-sm text-muted-foreground">{treatment?.dosage}</p>
              </div>
            )}
            {treatment?.frequency && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Frecuencia</h4>
                <p className="text-sm text-muted-foreground">{treatment?.frequency}</p>
              </div>
            )}
            {treatment?.route && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Vía de Administración</h4>
                <p className="text-sm text-muted-foreground">{treatment?.route}</p>
              </div>
            )}
            {treatment?.endDate && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Fecha de Finalización</h4>
                <p className="text-sm text-muted-foreground">{treatment?.endDate}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {treatment?.instructions && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="FileText" size={16} className="mr-2" />
                Instrucciones
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {treatment?.instructions}
              </p>
            </div>
          )}

          {/* Side Effects */}
          {treatment?.sideEffects && treatment?.sideEffects?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="AlertTriangle" size={16} className="mr-2 text-warning" />
                Efectos Secundarios Posibles
              </h4>
              <div className="flex flex-wrap gap-2">
                {treatment?.sideEffects?.map((effect, index) => (
                  <span key={index} className="px-2 py-1 bg-warning/10 text-warning rounded text-xs">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Monitoring Schedule */}
          {treatment?.monitoringSchedule && treatment?.monitoringSchedule?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Calendar" size={16} className="mr-2" />
                Cronograma de Seguimiento
              </h4>
              <div className="space-y-2">
                {treatment?.monitoringSchedule?.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">{schedule?.type}</p>
                      <p className="text-xs text-muted-foreground">{schedule?.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      schedule?.completed ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {schedule?.completed ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Diagnosis */}
          {treatment?.relatedDiagnosis && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Link" size={16} className="mr-2" />
                Diagnóstico Relacionado
              </h4>
              <div className="p-3 bg-accent/50 rounded border border-accent">
                <p className="text-sm font-medium text-accent-foreground">{treatment?.relatedDiagnosis}</p>
              </div>
            </div>
          )}

          {/* Digital Signature */}
          {treatment?.digitalSignature && (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-success">Prescripción Verificada</p>
                  <p className="text-xs text-muted-foreground">
                    Colegio Médico de Venezuela - Lic. #{treatment?.digitalSignature?.licenseNumber}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-success hover:text-success">
                <Icon name="CheckCircle" size={14} className="mr-1" />
                Verificar
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(treatment)}
              >
                <Icon name="Eye" size={14} className="mr-2" />
                Ver Detalles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport?.(treatment)}
              >
                <Icon name="Download" size={14} className="mr-2" />
                Exportar
              </Button>
              {treatment?.status === 'Activo' && (
                <Button variant="ghost" size="sm" className="text-primary">
                  <Icon name="Calendar" size={14} className="mr-2" />
                  Agendar Seguimiento
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Última actualización: {treatment?.lastUpdated}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentCard;