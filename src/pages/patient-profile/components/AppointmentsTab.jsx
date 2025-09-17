import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const AppointmentsTab = ({ patient }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return 'No programada';
    const date = new Date(dateString);
    return {
      date: date?.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date?.toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Mock appointment history - Replace with actual data
  const appointmentHistory = [
    {
      id: 'apt1',
      date: '2024-08-15',
      time: '10:30',
      type: 'Consulta General',
      status: 'Completada',
      doctor: 'Dr. María González',
      notes: 'Control de rutina. Paciente estable.',
      duration: '30 min'
    },
    {
      id: 'apt2',
      date: '2024-07-22',
      time: '14:15',
      type: 'Seguimiento',
      status: 'Completada',
      doctor: 'Dr. Carlos Pérez',
      notes: 'Evaluación de diabetes. Ajuste de medicación.',
      duration: '45 min'
    },
    {
      id: 'apt3',
      date: '2024-06-10',
      time: '09:00',
      type: 'Consulta Especializada',
      status: 'Completada',
      doctor: 'Dr. Antonio Rodríguez',
      notes: 'Evaluación cardiológica. Todo normal.',
      duration: '60 min'
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completada':
        return 'bg-success/10 text-success border-success/20';
      case 'programada':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelada':
        return 'bg-error/10 text-error border-error/20';
      case 'no asistió':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completada': return 'CheckCircle';
      case 'programada': return 'Clock';
      case 'cancelada': return 'XCircle';
      case 'no asistió': return 'AlertTriangle';
      default: return 'Calendar';
    }
  };

  const nextAppointment = patient?.nextAppointment ? formatDateTime(patient?.nextAppointment) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Calendar" size={20} className="mr-2" />
          Citas Médicas
        </h3>
        <Button 
          size="sm"
          onClick={() => window.location.href = '/appointment-booking'}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Next Appointment */}
      {nextAppointment && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-primary mb-3 flex items-center">
            <Icon name="Clock" size={18} className="mr-2" />
            Próxima Cita Programada
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha</p>
              <p className="font-medium text-foreground">{nextAppointment?.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hora</p>
              <p className="font-medium text-foreground">{nextAppointment?.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="font-medium text-foreground">Consulta de Seguimiento</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-primary/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Recordatorio: Traer resultados de laboratorio
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Icon name="Edit" size={14} className="mr-1" />
                  Modificar
                </Button>
                <Button variant="outline" size="sm" className="text-error hover:bg-error/10">
                  <Icon name="X" size={14} className="mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment History */}
      <div>
        <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
          <Icon name="History" size={18} className="mr-2" />
          Historial de Citas ({appointmentHistory?.length})
        </h4>

        {appointmentHistory?.length > 0 ? (
          <div className="space-y-4">
            {appointmentHistory?.map((appointment) => (
              <div key={appointment?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon name="Calendar" size={18} className="text-primary" />
                      <h5 className="font-medium text-foreground">{appointment?.type}</h5>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment?.status)}`}>
                        <Icon name={getStatusIcon(appointment?.status)} size={12} className="mr-1" />
                        {appointment?.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Fecha:</span>
                        <br />
                        {new Date(appointment?.date)?.toLocaleDateString('es-VE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div>
                        <span className="font-medium">Hora:</span>
                        <br />
                        {appointment?.time}
                      </div>
                      <div>
                        <span className="font-medium">Médico:</span>
                        <br />
                        {appointment?.doctor}
                      </div>
                      <div>
                        <span className="font-medium">Duración:</span>
                        <br />
                        {appointment?.duration}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    Ver Detalles
                  </Button>
                </div>

                {appointment?.notes && (
                  <div className="bg-background rounded-md p-3 border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Notas de la consulta:</p>
                    <p className="text-sm text-foreground">{appointment?.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay historial de citas disponible</p>
          </div>
        )}
      </div>

      {/* Quick Statistics */}
      <div>
        <h4 className="text-md font-medium text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={18} className="mr-2" />
          Estadísticas de Citas
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-success/10 rounded-lg p-4 text-center border border-success/20">
            <div className="text-2xl font-bold text-success mb-2">
              {appointmentHistory?.filter(apt => apt?.status === 'Completada')?.length}
            </div>
            <div className="text-sm text-success font-medium">Completadas</div>
          </div>
          
          <div className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
            <div className="text-2xl font-bold text-primary mb-2">
              {patient?.nextAppointment ? 1 : 0}
            </div>
            <div className="text-sm text-primary font-medium">Programadas</div>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-4 text-center border border-warning/20">
            <div className="text-2xl font-bold text-warning mb-2">
              {appointmentHistory?.filter(apt => apt?.status === 'No asistió')?.length || 0}
            </div>
            <div className="text-sm text-warning font-medium">No Asistió</div>
          </div>
          
          <div className="bg-error/10 rounded-lg p-4 text-center border border-error/20">
            <div className="text-2xl font-bold text-error mb-2">
              {appointmentHistory?.filter(apt => apt?.status === 'Cancelada')?.length || 0}
            </div>
            <div className="text-sm text-error font-medium">Canceladas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTab;