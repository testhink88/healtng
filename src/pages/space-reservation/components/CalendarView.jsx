import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  view = 'month', 
  onViewChange, 
  selectedDate, 
  onDateSelect, 
  reservations = [],
  onReservationClick,
  className = '' 
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const viewOptions = [
    { key: 'month', label: 'Mes', icon: 'Calendar' },
    { key: 'week', label: 'Semana', icon: 'CalendarDays' },
    { key: 'day', label: 'Día', icon: 'CalendarCheck' },
    { key: 'timeline', label: 'Timeline', icon: 'Clock' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-warning-foreground';
      case 'APPROVED': return 'bg-success text-success-foreground';
      case 'REJECTED': return 'bg-error text-error-foreground';
      case 'CHECKED_IN': return 'bg-primary text-primary-foreground';
      case 'COMPLETED': return 'bg-secondary text-secondary-foreground';
      case 'CANCELLED': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      newDate?.setMonth(newDate?.getMonth() + direction);
    } else if (view === 'week') {
      newDate?.setDate(newDate?.getDate() + (direction * 7));
    } else if (view === 'day') {
      newDate?.setDate(newDate?.getDate() + direction);
    }
    
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    const options = {
      month: { year: 'numeric', month: 'long' },
      week: { year: 'numeric', month: 'long', day: 'numeric' },
      day: { year: 'numeric', month: 'long', day: 'numeric' },
      timeline: { year: 'numeric', month: 'long', day: 'numeric' }
    };

    return currentDate?.toLocaleDateString('es-ES', options?.[view]);
  };

  const renderMonthView = () => {
    const year = currentDate?.getFullYear();
    const month = currentDate?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current?.getDay() !== 0) {
      days?.push(new Date(current));
      current?.setDate(current?.getDate() + 1);
    }

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week Headers */}
        {weekDays?.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {/* Calendar Days */}
        {days?.map((day, index) => {
          const isCurrentMonth = day?.getMonth() === month;
          const isToday = day?.toDateString() === new Date()?.toDateString();
          const isSelected = selectedDate && day?.toDateString() === selectedDate?.toDateString();
          const dayReservations = reservations?.filter(res => 
            new Date(res.date)?.toDateString() === day?.toDateString()
          );

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && onDateSelect(day)}
              className={`relative p-2 min-h-[80px] border border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                isCurrentMonth ? 'bg-card' : 'bg-muted/20'
              } ${isSelected ? 'ring-2 ring-primary' : ''} ${
                isToday ? 'bg-primary/10' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
              } ${isToday ? 'text-primary' : ''}`}>
                {day?.getDate()}
              </div>
              {/* Reservation Indicators */}
              <div className="mt-1 space-y-1">
                {dayReservations?.slice(0, 3)?.map((reservation, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e?.stopPropagation();
                      onReservationClick(reservation);
                    }}
                    className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${getStatusColor(reservation?.status)}`}
                  >
                    {reservation?.time} - {reservation?.spaceName}
                  </div>
                ))}
                {dayReservations?.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayReservations?.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek?.setDate(currentDate?.getDate() - currentDate?.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day?.setDate(startOfWeek?.getDate() + i);
      return day;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-3 text-sm font-medium text-muted-foreground">Hora</div>
            {weekDays?.map((day, index) => {
              const isToday = day?.toDateString() === new Date()?.toDateString();
              return (
                <div
                  key={index}
                  className={`p-3 text-center border-l border-border ${
                    isToday ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day?.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {day?.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-8">
            {hours?.map(hour => (
              <React.Fragment key={hour}>
                <div className="p-2 text-sm text-muted-foreground border-b border-border">
                  {hour?.toString()?.padStart(2, '0')}:00
                </div>
                {weekDays?.map((day, dayIndex) => {
                  const dayReservations = reservations?.filter(res => {
                    const resDate = new Date(res.date);
                    const resHour = parseInt(res?.time?.split(':')?.[0]);
                    return resDate?.toDateString() === day?.toDateString() && resHour === hour;
                  });

                  return (
                    <div
                      key={dayIndex}
                      className="min-h-[60px] p-1 border-l border-b border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => onDateSelect(day)}
                    >
                      {dayReservations?.map((reservation, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e?.stopPropagation();
                            onReservationClick(reservation);
                          }}
                          className={`text-xs p-1 rounded mb-1 cursor-pointer ${getStatusColor(reservation?.status)}`}
                        >
                          <div className="font-medium truncate">{reservation?.spaceName}</div>
                          <div className="truncate">{reservation?.time}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayReservations = reservations?.filter(res => 
      new Date(res.date)?.toDateString() === currentDate?.toDateString()
    );

    return (
      <div className="space-y-1">
        {hours?.map(hour => {
          const hourReservations = dayReservations?.filter(res => {
            const resHour = parseInt(res?.time?.split(':')?.[0]);
            return resHour === hour;
          });

          return (
            <div key={hour} className="flex border-b border-border">
              <div className="w-20 p-3 text-sm text-muted-foreground">
                {hour?.toString()?.padStart(2, '0')}:00
              </div>
              <div className="flex-1 min-h-[60px] p-2 hover:bg-muted/50 cursor-pointer">
                {hourReservations?.map((reservation, idx) => (
                  <div
                    key={idx}
                    onClick={() => onReservationClick(reservation)}
                    className={`p-2 rounded mb-1 cursor-pointer ${getStatusColor(reservation?.status)}`}
                  >
                    <div className="font-medium">{reservation?.spaceName}</div>
                    <div className="text-sm">{reservation?.time} - {reservation?.duration}</div>
                    <div className="text-sm">{reservation?.doctorName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTimelineView = () => {
    const sortedReservations = [...reservations]?.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    return (
      <div className="space-y-4">
        {sortedReservations?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No hay reservaciones programadas</p>
          </div>
        ) : (
          sortedReservations?.map((reservation, index) => (
            <div
              key={index}
              onClick={() => onReservationClick(reservation)}
              className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(reservation?.status)?.replace('text-', 'bg-')?.replace('-foreground', '')}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{reservation?.spaceName}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(reservation?.status)}`}>
                    {reservation?.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {reservation?.date} • {reservation?.time} • {reservation?.duration}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dr. {reservation?.doctorName} • {reservation?.clinicName}
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">
              {formatDateHeader()}
            </h3>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate(-1)}
                className="w-8 h-8"
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate(1)}
                className="w-8 h-8"
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>

          {/* View Selector */}
          <div className="flex items-center space-x-1">
            {viewOptions?.map(option => (
              <Button
                key={option?.key}
                variant={view === option?.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewChange(option?.key)}
                iconName={option?.icon}
                iconPosition="left"
                iconSize={14}
                className="hidden sm:flex"
              >
                {option?.label}
              </Button>
            ))}
            
            {/* Mobile View Selector */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                iconName={viewOptions?.find(opt => opt?.key === view)?.icon}
                iconPosition="left"
                iconSize={14}
              >
                {viewOptions?.find(opt => opt?.key === view)?.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">Pendiente</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Aprobado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">En Curso</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Completado</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-error" />
            <span className="text-muted-foreground">Rechazado</span>
          </div>
        </div>
      </div>
      {/* Calendar Content */}
      <div className="p-4">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'timeline' && renderTimelineView()}
      </div>
    </div>
  );
};

export default CalendarView;