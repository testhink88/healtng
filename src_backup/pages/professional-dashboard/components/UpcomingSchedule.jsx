import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const UpcomingSchedule = ({ schedule = [], className = '' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'cancelled':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'teleconsultation' ? 'Video' : 'User';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow?.setDate(tomorrow?.getDate() + 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Hoy';
    } else if (date?.toDateString() === tomorrow?.toDateString()) {
      return 'Mañana';
    } else {
      return date?.toLocaleDateString('es-VE', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Próximas Citas</h2>
          <Button 
            variant="ghost" 
            size="sm"
            iconName="Calendar"
            onClick={() => window.location.href = '/appointment-booking'}
          >
            Ver Agenda
          </Button>
        </div>
      </div>
      <div className="p-6">
        {schedule?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No hay citas próximas</h3>
            <p className="text-muted-foreground mb-4">Tu agenda está libre para los próximos días</p>
            <Button 
              variant="outline" 
              iconName="Plus" 
              iconPosition="left"
              onClick={() => window.location.href = '/appointment-booking'}
            >
              Agendar Cita
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule?.slice(0, 5)?.map((appointment, index) => (
              <div key={appointment?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={getTypeIcon(appointment?.type)} size={16} className="text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground truncate">{appointment?.patientName}</p>
                    <span className={`text-xs font-medium ${getStatusColor(appointment?.status)}`}>
                      {appointment?.status === 'confirmed' && 'Confirmada'}
                      {appointment?.status === 'pending' && 'Pendiente'}
                      {appointment?.status === 'cancelled' && 'Cancelada'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{appointment?.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{formatDate(appointment?.date)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mt-1">{appointment?.reason}</p>
                </div>
                
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.location.href = `/appointment-booking?id=${appointment?.id}`}
                    className="w-8 h-8"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {schedule?.length > 5 && (
              <div className="pt-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => window.location.href = '/appointment-booking'}
                >
                  Ver todas las citas ({schedule?.length - 5} más)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSchedule;