import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { cn } from '../../../utils/cn';

const AppointmentCard = ({ appointment, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        color: 'bg-success/10 text-success border-success/20',
        icon: 'CheckCircle',
        label: 'Completada'
      },
      cancelled: {
        color: 'bg-error/10 text-error border-error/20',
        icon: 'XCircle',
        label: 'Cancelada'
      },
      'no-show': {
        color: 'bg-warning/10 text-warning border-warning/20',
        icon: 'AlertCircle',
        label: 'No asistió'
      },
      rescheduled: {
        color: 'bg-secondary/10 text-secondary border-secondary/20',
        icon: 'Clock',
        label: 'Reprogramada'
      }
    };

    const config = statusConfig?.[status] || statusConfig?.completed;

    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config?.color
      )}>
        <Icon name={config?.icon} size={12} />
        {config?.label}
      </div>
    );
  };

  const getTypeIcon = (type) => {
    return type === 'teleconsultation' ? 'Video' : 'MapPin';
  };

  const getTypeLabel = (type) => {
    return type === 'teleconsultation' ? 'Teleconsulta' : 'Presencial';
  };

  const canReschedule = appointment?.status === 'completed' && 
    new Date(appointment.date) < new Date();

  const showDetails = appointment?.status === 'completed' && 
    (appointment?.visitSummary || appointment?.medications?.length > 0 || 
     appointment?.followUpInstructions || appointment?.documents?.length > 0);

  return (
    <div className="p-6 hover:bg-muted/50 transition-colors">
      <div className="space-y-4">
        {/* Main Info Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Doctor Photo */}
            <div className="flex-shrink-0">
              <img
                src={appointment?.doctor?.photo || '/assets/images/no_image.png'}
                alt={appointment?.doctor?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-border"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>

            {/* Appointment Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {appointment?.doctor?.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {appointment?.doctor?.specialty}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    ${appointment?.fee}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    USD/VES
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-3">
                {/* Date & Time */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span>{formatDate(appointment?.date)} • {formatTime(appointment?.time)}</span>
                </div>

                {/* Type */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name={getTypeIcon(appointment?.type)} size={16} />
                  <span>{getTypeLabel(appointment?.type)}</span>
                  {appointment?.location && (
                    <span className="truncate">• {appointment?.location}</span>
                  )}
                </div>

                {/* Status */}
                <div className="flex lg:justify-end">
                  {getStatusBadge(appointment?.status)}
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3">
                <p className="text-sm text-foreground font-medium">
                  {appointment?.reason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('view', appointment?.id)}
            iconName="Eye"
          >
            Ver detalles
          </Button>

          {canReschedule && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction('reschedule', appointment?.id)}
              iconName="Calendar"
            >
              Reagendar
            </Button>
          )}

          {appointment?.status === 'completed' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction('message', appointment?.id)}
                iconName="MessageCircle"
              >
                Contactar
              </Button>

              {appointment?.medications?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAction('refill', appointment?.id)}
                  iconName="Pill"
                >
                  Renovar receta
                </Button>
              )}
            </>
          )}

          {/* Expandable Details Toggle */}
          {showDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            >
              {isExpanded ? 'Menos detalles' : 'Más detalles'}
            </Button>
          )}
        </div>

        {/* Expandable Details Section */}
        {isExpanded && showDetails && (
          <div className="border-t border-border pt-4 space-y-4">
            {/* Visit Summary */}
            {appointment?.visitSummary && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Resumen de la consulta
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {appointment?.visitSummary}
                </p>
              </div>
            )}

            {/* Medications */}
            {appointment?.medications?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Pill" size={16} />
                  Medicamentos recetados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {appointment?.medications?.map((med, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium"
                    >
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up Instructions */}
            {appointment?.followUpInstructions && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} />
                  Instrucciones de seguimiento
                </h4>
                <p className="text-sm text-muted-foreground bg-warning/5 border border-warning/20 p-3 rounded-lg">
                  {appointment?.followUpInstructions}
                </p>
              </div>
            )}

            {/* Documents */}
            {appointment?.documents?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Icon name="Paperclip" size={16} />
                  Documentos adjuntos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {appointment?.documents?.map((doc, index) => (
                    <a
                      key={index}
                      href={doc?.url}
                      className="flex items-center gap-2 p-2 border border-border rounded hover:bg-muted/50 transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon 
                        name={doc?.type === 'pdf' ? 'FileText' : 'Image'} 
                        size={16} 
                        className="text-primary" 
                      />
                      <span className="flex-1 truncate">{doc?.name}</span>
                      <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;