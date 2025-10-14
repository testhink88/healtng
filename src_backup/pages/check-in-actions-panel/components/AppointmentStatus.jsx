import React from 'react';
import Icon from '@/components/AppIcon';

const AppointmentStatus = ({ appointment, consultationTime }) => {
  if (!appointment) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'checked-in':
        return {
          label: 'Paciente Ingresado',
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'in-progress':
        return {
          label: 'Consulta en Progreso',
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      case 'completed':
        return {
          label: 'Consulta Completada',
          icon: 'CheckCircle2',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      default:
        return {
          label: 'Estado Desconocido',
          icon: 'Help',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10'
        };
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDuration = () => {
    if (!appointment?.duration) return null;
    const remainingTime = (appointment?.duration * 60) - consultationTime;
    return remainingTime > 0 ? Math.ceil(remainingTime / 60) : 0;
  };

  const statusConfig = getStatusConfig(appointment?.status);
  const remainingMinutes = getDuration();

  return (
    <div className="space-y-3">
      {/* Status Indicator */}
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${statusConfig?.bgColor} rounded-full flex items-center justify-center`}>
          <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm text-foreground">
            {statusConfig?.label}
          </p>
          <p className="text-xs text-muted-foreground">
            Tiempo transcurrido: {formatTime(consultationTime)}
          </p>
        </div>
      </div>

      {/* Time Information */}
      {remainingMinutes !== null && (
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-foreground">
                Tiempo de consulta
              </p>
              <p className="text-xs text-muted-foreground">
                Duración programada: {appointment?.duration} min
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${
                remainingMinutes > 5 ? 'text-success' :
                remainingMinutes > 0 ? 'text-warning': 'text-error'
              }`}>
                {remainingMinutes > 0 
                  ? `${remainingMinutes} min restantes`
                  : 'Tiempo excedido'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentStatus;