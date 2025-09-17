import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppointmentsList = ({ appointments = [], onCheckIn, onReschedule, onCancel }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'teleconsultation' ? 'Video' : 'User';
  };

  const handleAction = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (!selectedAppointment) return;

    switch (actionType) {
      case 'checkin':
        onCheckIn?.(selectedAppointment?.id);
        break;
      case 'reschedule':
        onReschedule?.(selectedAppointment?.id);
        break;
      case 'cancel':
        onCancel?.(selectedAppointment?.id);
        break;
    }
    
    setShowConfirmModal(false);
    setSelectedAppointment(null);
    setActionType('');
  };

  const getActionMessage = () => {
    if (!selectedAppointment) return '';
    
    switch (actionType) {
      case 'checkin':
        return `¿Confirmar check-in para ${selectedAppointment?.patientName}?`;
      case 'reschedule':
        return `¿Reprogramar cita con ${selectedAppointment?.patientName}?`;
      case 'cancel':
        return `¿Cancelar cita con ${selectedAppointment?.patientName}?`;
      default:
        return '';
    }
  };

  const handlePrescriptionAction = (appointment) => {
    const url = `/profesional/recetas/nueva?appointmentId=${appointment?.id}`;
    window.location.href = url;
  };

  const handleDiagnosisAction = (appointment) => {
    const url = `/profesional/diagnosticos/nuevo?appointmentId=${appointment?.id}`;
    window.location.href = url;
  };

  const handleReferralAction = (appointment) => {
    const url = `/profesional/derivaciones/nueva?appointmentId=${appointment?.id}`;
    window.location.href = url;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Citas de Hoy</h2>
          <Button 
            variant="outline" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => window.location.href = '/appointment-booking'}
          >
            Nueva Cita
          </Button>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Paciente</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hora</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment, index) => (
              <tr key={appointment?.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{appointment?.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment?.reason}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{appointment?.time}</p>
                    <p className="text-muted-foreground">{appointment?.duration} min</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getTypeIcon(appointment?.type)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">{appointment?.type}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment?.status)}`}>
                    {appointment?.status === 'confirmed' && 'Confirmada'}
                    {appointment?.status === 'pending' && 'Pendiente'}
                    {appointment?.status === 'in-progress' && 'En Curso'}
                    {appointment?.status === 'completed' && 'Completada'}
                    {appointment?.status === 'cancelled' && 'Cancelada'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    {appointment?.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="UserCheck"
                        onClick={() => handleAction(appointment, 'checkin')}
                      >
                        Check-in
                      </Button>
                    )}
                    {(appointment?.status === 'confirmed' || appointment?.status === 'pending') && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          iconName="FileText"
                          onClick={() => handlePrescriptionAction(appointment)}
                        >
                          Receta
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          iconName="Stethoscope"
                          onClick={() => handleDiagnosisAction(appointment)}
                        >
                          Diagnóstico
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          iconName="Share2"
                          onClick={() => handleReferralAction(appointment)}
                        >
                          Derivar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Calendar"
                          onClick={() => handleAction(appointment, 'reschedule')}
                        >
                          Reprogramar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="X"
                          onClick={() => handleAction(appointment, 'cancel')}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {appointments?.map((appointment) => (
          <div key={appointment?.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{appointment?.patientName}</p>
                  <p className="text-sm text-muted-foreground">{appointment?.time}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment?.status)}`}>
                {appointment?.status === 'confirmed' && 'Confirmada'}
                {appointment?.status === 'pending' && 'Pendiente'}
                {appointment?.status === 'in-progress' && 'En Curso'}
                {appointment?.status === 'completed' && 'Completada'}
                {appointment?.status === 'cancelled' && 'Cancelada'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Icon name={getTypeIcon(appointment?.type)} size={16} className="text-muted-foreground" />
                <span className="text-foreground capitalize">{appointment?.type}</span>
              </div>
              <span className="text-muted-foreground">{appointment?.duration} min</span>
            </div>
            
            <p className="text-sm text-muted-foreground">{appointment?.reason}</p>
            
            <div className="flex items-center space-x-2 pt-2 flex-wrap gap-2">
              {appointment?.status === 'confirmed' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="UserCheck"
                  onClick={() => handleAction(appointment, 'checkin')}
                  fullWidth
                >
                  Check-in
                </Button>
              )}
              {(appointment?.status === 'confirmed' || appointment?.status === 'pending') && (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="FileText"
                    onClick={() => handlePrescriptionAction(appointment)}
                  >
                    Receta
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="Stethoscope"
                    onClick={() => handleDiagnosisAction(appointment)}
                  >
                    Diagnóstico
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    iconName="Share2"
                    onClick={() => handleReferralAction(appointment)}
                  >
                    Derivar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Calendar"
                    onClick={() => handleAction(appointment, 'reschedule')}
                  >
                    Reprogramar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => handleAction(appointment, 'cancel')}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {appointments?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay citas programadas</h3>
          <p className="text-muted-foreground mb-4">Programa tu primera cita del día</p>
          <Button 
            variant="default" 
            iconName="Plus" 
            iconPosition="left"
            onClick={() => window.location.href = '/appointment-booking'}
          >
            Nueva Cita
          </Button>
        </div>
      )}
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Confirmar Acción</h3>
            </div>
            
            <p className="text-muted-foreground mb-6">{getActionMessage()}</p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmModal(false)}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                variant={actionType === 'cancel' ? 'destructive' : 'default'}
                onClick={confirmAction}
                fullWidth
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;