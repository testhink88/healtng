import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { cn } from '../../../utils/cn';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onAction }) => {
  if (!isOpen || !appointment) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      }
    };

    const config = statusConfig?.[status] || statusConfig?.completed;

    return (
      <div className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
        config?.color
      )}>
        <Icon name={config?.icon} size={16} />
        {config?.label}
      </div>
    );
  };

  const getTypeInfo = (type) => {
    return {
      icon: type === 'teleconsultation' ? 'Video' : 'MapPin',
      label: type === 'teleconsultation' ? 'Teleconsulta' : 'Presencial'
    };
  };

  const typeInfo = getTypeInfo(appointment?.type);
  const canReschedule = appointment?.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex items-start gap-4 flex-1">
            <img
              src={appointment?.doctor?.photo || '/assets/images/no_image.png'}
              alt={appointment?.doctor?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">
                {appointment?.doctor?.name}
              </h2>
              <p className="text-muted-foreground mb-3">
                {appointment?.doctor?.specialty}
              </p>
              {getStatusBadge(appointment?.status)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="Calendar" size={18} />
                    Información de la cita
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">{formatDate(appointment?.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora:</span>
                      <span className="font-medium">{appointment?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <div className="flex items-center gap-1">
                        <Icon name={typeInfo?.icon} size={14} />
                        <span className="font-medium">{typeInfo?.label}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span className="font-medium">{appointment?.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    Motivo de consulta
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {appointment?.reason}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="DollarSign" size={18} />
                  Información de pago
                </h3>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      ${appointment?.fee}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appointment?.status === 'completed' ? 'Pagado' : 'No cobrado'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Details - Only for completed appointments */}
            {appointment?.status === 'completed' && (
              <>
                {/* Visit Summary */}
                {appointment?.visitSummary && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Resumen de la consulta
                    </h3>
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {appointment?.visitSummary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Medications */}
                {appointment?.medications?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Icon name="Pill" size={18} />
                      Medicamentos recetados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {appointment?.medications?.map((medication, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="Pill" size={16} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">
                              {medication}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Instructions */}
                {appointment?.followUpInstructions && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Icon name="AlertCircle" size={18} />
                      Instrucciones de seguimiento
                    </h3>
                    <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {appointment?.followUpInstructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Documents */}
                {appointment?.documents?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Icon name="Paperclip" size={18} />
                      Documentos adjuntos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {appointment?.documents?.map((document, index) => (
                        <a
                          key={index}
                          href={document?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon 
                              name={document?.type === 'pdf' ? 'FileText' : 'Image'} 
                              size={20} 
                              className="text-primary" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">
                              {document?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {document?.type?.toUpperCase()} file
                            </p>
                          </div>
                          <Icon 
                            name="ExternalLink" 
                            size={16} 
                            className="text-muted-foreground group-hover:text-primary transition-colors" 
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <div className="flex gap-2">
            {appointment?.status === 'completed' && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onAction('message', appointment?.id);
                    onClose();
                  }}
                  iconName="MessageCircle"
                >
                  Contactar
                </Button>
                {appointment?.medications?.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onAction('refill', appointment?.id);
                      onClose();
                    }}
                    iconName="Pill"
                  >
                    Renovar receta
                  </Button>
                )}
              </>
            )}
            {canReschedule && (
              <Button
                onClick={() => {
                  onAction('reschedule', appointment?.id);
                  onClose();
                }}
                iconName="Calendar"
              >
                Reagendar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;