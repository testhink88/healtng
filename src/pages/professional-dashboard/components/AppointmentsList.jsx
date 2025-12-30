import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const AppointmentsList = ({ appointments = [], dateLabel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-progress':
      case 'inprogress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type) => (type === 'teleconsultation' ? 'Video' : 'User');

  const goToPatientProfile = (appointment) => {
    const patientId = appointment?.patientId ?? appointment?.id;
    window.location.href = `/patients/${patientId}`;
  };

  // Si no te pasan dateLabel, se calcula hoy por defecto
  const todayLabel =
    dateLabel ||
    new Date().toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Citas de Hoy</h2>
          </div>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => (window.location.href = '/appointment-booking')}
          >
            Nueva Cita
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{todayLabel}</p>
      </div>

      {/* Listado estilo “cards” (igual al look de tu mock), sin acciones */}
      <div className="px-4 sm:px-6 py-4 space-y-3">
        {appointments?.map((a) => (
          <div
            key={a?.id}
            className="rounded-xl border border-border bg-background px-4 sm:px-5 py-4 flex items-start justify-between"
          >
            {/* bloque izquierdo con hora */}
            <div className="w-20 sm:w-24 shrink-0">
              <div className="text-sm font-semibold text-foreground leading-5">{a?.time}</div>
              <div className="text-xs text-muted-foreground">{a?.duration} min</div>
            </div>

            {/* centro: nombre + motivo + tipo */}
            <div className="flex-1 min-w-0 px-2 sm:px-3">
              <button
                type="button"
                onClick={() => goToPatientProfile(a)}
                className="text-left font-medium text-foreground hover:underline truncate"
                title="Ver perfil del paciente"
              >
                {a?.patientName}
              </button>
              <div className="text-sm text-muted-foreground truncate">{a?.reason}</div>

              <div className="mt-1 flex items-center gap-2 text-sm">
                <Icon name={getTypeIcon(a?.type)} size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  {a?.type === 'in-person' ? 'In-Person' : a?.type}
                </span>
              </div>
            </div>

            {/* derecha: pill de estado */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                  a?.status
                )}`}
              >
                {a?.status === 'confirmed' && 'Confirmada'}
                {a?.status === 'pending' && 'Pendiente'}
                {(a?.status === 'in-progress' || a?.status === 'inprogress') && 'En Progreso'}
                {a?.status === 'completed' && 'Completada'}
                {a?.status === 'cancelled' && 'Cancelada'}
              </span>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {appointments?.length === 0 && (
          <div className="py-10 text-center">
            <Icon name="Calendar" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1">No hay citas programadas</h3>
            <p className="text-muted-foreground mb-4">Programa tu primera cita del día</p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => (window.location.href = '/appointment-booking')}
            >
              Nueva Cita
            </Button>
          </div>
        )}
      </div>

      {/* Footer CTA: Ver Agenda Completa */}
      {appointments?.length > 0 && (
        <div className="border-t border-border px-6 py-3">
          <button
            type="button"
            onClick={() => (window.location.href = '/appointment-booking')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Icon name="Calendar" size={16} />
            Ver Agenda Completa
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
