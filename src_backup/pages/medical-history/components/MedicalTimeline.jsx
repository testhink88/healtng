import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const MedicalTimeline = ({ events, onEventClick }) => {
  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'diagnosis': case'diagnóstico':
        return 'Stethoscope';
      case 'treatment': case'tratamiento':
        return 'Pill';
      case 'surgery': case'cirugía':
        return 'Scissors';
      case 'test': case'examen':
        return 'FileText';
      case 'appointment': case'cita':
        return 'Calendar';
      case 'emergency': case'emergencia':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const getEventColor = (type, severity) => {
    if (severity === 'critical' || severity === 'grave') {
      return 'bg-error text-error-foreground border-error';
    }
    
    switch (type?.toLowerCase()) {
      case 'diagnosis': case'diagnóstico':
        return 'bg-primary text-primary-foreground border-primary';
      case 'treatment': case'tratamiento':
        return 'bg-success text-success-foreground border-success';
      case 'surgery': case'cirugía':
        return 'bg-warning text-warning-foreground border-warning';
      case 'test': case'examen':
        return 'bg-secondary text-secondary-foreground border-secondary';
      case 'emergency': case'emergencia':
        return 'bg-error text-error-foreground border-error';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  if (!events || events?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Clock" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium text-foreground mb-2">Sin Eventos Médicos</h3>
        <p className="text-muted-foreground">No hay eventos médicos registrados en el historial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Cronología Médica</h3>
        <Button variant="outline" size="sm">
          <Icon name="Filter" size={14} className="mr-2" />
          Filtrar
        </Button>
      </div>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Timeline Events */}
        <div className="space-y-6">
          {events?.map((event, index) => (
            <div key={event?.id || index} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event?.type, event?.severity)}`}>
                <Icon name={getEventIcon(event?.type)} size={20} />
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-lg">{event?.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="Calendar" size={12} />
                          <span>{formatDate(event?.date)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="User" size={12} />
                          <span>{event?.doctor || event?.provider}</span>
                        </span>
                        <span className="text-xs opacity-75">{getTimeAgo(event?.date)}</span>
                      </div>
                    </div>
                    {event?.severity && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event?.severity === 'critical' || event?.severity === 'grave' ? 'bg-error/10 text-error' :
                        event?.severity === 'moderate' || event?.severity === 'moderado' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        {event?.severity}
                      </span>
                    )}
                  </div>

                  {/* Event Description */}
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {event?.description}
                  </p>

                  {/* Event Details */}
                  {event?.details && (
                    <div className="space-y-2 mb-3">
                      {event?.details?.diagnosis && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Stethoscope" size={14} className="text-primary" />
                          <span className="text-muted-foreground">Diagnóstico:</span>
                          <span className="font-medium text-foreground">{event?.details?.diagnosis}</span>
                        </div>
                      )}
                      {event?.details?.medication && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Pill" size={14} className="text-success" />
                          <span className="text-muted-foreground">Medicamento:</span>
                          <span className="font-medium text-foreground">{event?.details?.medication}</span>
                        </div>
                      )}
                      {event?.details?.result && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="FileText" size={14} className="text-secondary" />
                          <span className="text-muted-foreground">Resultado:</span>
                          <span className="font-medium text-foreground">{event?.details?.result}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Attachments */}
                  {event?.attachments && event?.attachments?.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</h5>
                      <div className="flex flex-wrap gap-2">
                        {event?.attachments?.map((attachment, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-muted/50 px-2 py-1 rounded text-xs">
                            <Icon name="Paperclip" size={12} />
                            <span>{attachment?.name}</span>
                            <Button variant="ghost" size="icon" className="w-4 h-4">
                              <Icon name="Download" size={10} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Digital Signature */}
                  {event?.digitalSignature && (
                    <div className="flex items-center space-x-2 p-2 bg-success/10 border border-success/20 rounded mb-3">
                      <Icon name="Shield" size={14} className="text-success" />
                      <span className="text-xs text-success font-medium">Verificado digitalmente</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEventClick?.(event)}
                      >
                        <Icon name="Eye" size={12} className="mr-1" />
                        Ver Detalles
                      </Button>
                      {event?.relatedRecords && (
                        <Button variant="ghost" size="sm">
                          <Icon name="Link" size={12} className="mr-1" />
                          Relacionados ({event?.relatedRecords})
                        </Button>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Icon name="Download" size={12} className="mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Load More */}
      <div className="text-center pt-6">
        <Button variant="outline">
          <Icon name="ChevronDown" size={16} className="mr-2" />
          Cargar Más Eventos
        </Button>
      </div>
    </div>
  );
};

export default MedicalTimeline;