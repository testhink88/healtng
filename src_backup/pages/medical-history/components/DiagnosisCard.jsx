import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const DiagnosisCard = ({ diagnosis, onViewDetails, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': case'grave':
        return 'text-error bg-error/10 border-error/20';
      case 'moderate': case'moderado':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'mild': case'leve':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case'activo':
        return 'text-error bg-error/10';
      case 'resolved': case'resuelto':
        return 'text-success bg-success/10';
      case 'monitoring': case'seguimiento':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-foreground text-lg">{diagnosis?.condition}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnosis?.status)}`}>
              {diagnosis?.status}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{diagnosis?.diagnosisDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{diagnosis?.doctor}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {diagnosis?.severity && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(diagnosis?.severity)}`}>
              {diagnosis?.severity}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-w-touch min-h-touch"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
      </div>
      {/* ICD Code */}
      {diagnosis?.icdCode && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 bg-accent rounded text-xs font-mono">
            ICD-10: {diagnosis?.icdCode}
          </span>
        </div>
      )}
      {/* Description */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {diagnosis?.description}
      </p>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Symptoms */}
          {diagnosis?.symptoms && diagnosis?.symptoms?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Activity" size={16} className="mr-2" />
                Síntomas Reportados
              </h4>
              <div className="flex flex-wrap gap-2">
                {diagnosis?.symptoms?.map((symptom, index) => (
                  <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Tests */}
          {diagnosis?.relatedTests && diagnosis?.relatedTests?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="FileText" size={16} className="mr-2" />
                Exámenes Relacionados
              </h4>
              <div className="space-y-2">
                {diagnosis?.relatedTests?.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div>
                      <p className="text-sm font-medium">{test?.name}</p>
                      <p className="text-xs text-muted-foreground">{test?.date} - {test?.result}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="Eye" size={14} className="mr-1" />
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Plan */}
          {diagnosis?.treatmentPlan && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="Clipboard" size={16} className="mr-2" />
                Plan de Tratamiento
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {diagnosis?.treatmentPlan}
              </p>
            </div>
          )}

          {/* Notes */}
          {diagnosis?.notes && (
            <div>
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Notas Médicas
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {diagnosis?.notes}
              </p>
            </div>
          )}

          {/* Digital Signature */}
          {diagnosis?.digitalSignature && (
            <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-success">Firma Digital Verificada</p>
                  <p className="text-xs text-muted-foreground">
                    Colegio Médico de Venezuela - Lic. #{diagnosis?.digitalSignature?.licenseNumber}
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
                onClick={() => onViewDetails?.(diagnosis)}
              >
                <Icon name="Eye" size={14} className="mr-2" />
                Ver Detalles
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport?.(diagnosis)}
              >
                <Icon name="Download" size={14} className="mr-2" />
                Exportar
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Última actualización: {diagnosis?.lastUpdated}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisCard;