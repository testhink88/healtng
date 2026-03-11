import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const NextAppointment = ({ className = '', appointmentData }) => {
  const [showActions, setShowActions] = useState(false);

  // Si no hay datos, mostrar estado vacío o placeholder
  if (!appointmentData) {
    return (
      <div className={`bg-card rounded-2xl border border-dashed border-border p-8 text-center ${className}`}>
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Calendar" size={20} className="text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-semibold text-foreground">Sin citas próximas</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">No tienes citas confirmadas para los próximos días.</p>
        <Button 
          onClick={() => window.location.href = '/appointment-booking'}
          primary
          className="mx-auto"
        >
          Agendar ahora
        </Button>
      </div>
    );
  }

  const appointment = {
    id: appointmentData.id,
    doctorName: appointmentData.professional_name || 'Médico Especialista',
    specialty: appointmentData.specialty_label || 'Consulta General',
    date: appointmentData.date,
    time: appointmentData.time,
    type: appointmentData.reason || 'Consulta Médica',
    location: appointmentData.location || 'Consultorio Virtual / Clínica',
    avatar: appointmentData.doctor_avatar || '/assets/images/no_image.png',
    status: appointmentData.status,
    canReschedule: true,
    canCancel: true
  };

  const handleReschedule = () => {
    window.location.href = `/appointment-booking?reschedule=${appointment?.id}`;
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      // Mock cancellation
      alert('Cita cancelada exitosamente');
    }
  };

  const handleJoinVirtual = () => {
    window.location.href = `/telemedicine/join/${appointment?.id}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'cancelled': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-VE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = () => {
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    return today?.toDateString() === appointmentDate?.toDateString();
  };

  const isTomorrow = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    const appointmentDate = new Date(appointment.date);
    return tomorrow?.toDateString() === appointmentDate?.toDateString();
  };

  const getDateLabel = () => {
    if (isToday()) return 'Hoy';
    if (isTomorrow()) return 'Mañana';
    return formatDate(appointment?.date);
  };

  return (
    <div className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Próxima Cita</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment?.status)}`}>
          {getStatusText(appointment?.status)}
        </span>
      </div>
      <div className="space-y-4">
        {/* Doctor Info */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <img 
              src={appointment?.avatar} 
              alt={appointment?.doctorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {appointment?.doctorName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {appointment?.specialty}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowActions(!showActions)}
            className="min-w-touch min-h-touch"
          >
            <Icon name="MoreVertical" size={16} />
          </Button>
        </div>

        {/* Appointment Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={16} color="var(--color-primary)" />
            </div>
            <div>
              <p className="font-medium text-foreground">{getDateLabel()}</p>
              <p className="text-sm text-muted-foreground">{appointment?.time}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
              <Icon name="Stethoscope" size={16} color="var(--color-secondary)" />
            </div>
            <div>
              <p className="font-medium text-foreground">{appointment?.type}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Icon name="MapPin" size={16} color="var(--color-accent-foreground)" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {appointment?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Time Until Appointment */}
        {(isToday() || isTomorrow()) && (
          <div className="bg-accent/50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-accent-foreground)" />
              <p className="text-sm font-medium text-accent-foreground">
                {isToday() ? `En ${appointment?.time}` : `Mañana a las ${appointment?.time}`}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`space-y-2 transition-all duration-300 ${showActions ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="grid grid-cols-2 gap-3">
            {appointment?.canReschedule && (
              <Button
                variant="outline"
                onClick={handleReschedule}
                className="flex items-center justify-center space-x-2"
              >
                <Icon name="Calendar" size={16} />
                <span>Reagendar</span>
              </Button>
            )}
            
            {appointment?.canCancel && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="flex items-center justify-center space-x-2"
              >
                <Icon name="X" size={16} />
                <span>Cancelar</span>
              </Button>
            )}
          </div>

          <Button
            variant="default"
            onClick={() => window.location.href = '/appointment-booking'}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Icon name="Plus" size={16} />
            <span>Agendar Nueva Cita</span>
          </Button>
        </div>

        {!showActions && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleReschedule}
              className="flex items-center justify-center space-x-2"
            >
              <Icon name="Calendar" size={16} />
              <span>Reagendar</span>
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex items-center justify-center space-x-2"
            >
              <Icon name="X" size={16} />
              <span>Cancelar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextAppointment;