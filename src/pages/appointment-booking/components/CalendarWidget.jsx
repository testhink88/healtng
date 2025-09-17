import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect, availableSlots }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

  const generateCalendarDays = () => {
    const year = currentMonth?.getFullYear();
    const month = currentMonth?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());

    const days = [];
    const today = new Date();
    today?.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + i);
      
      const isCurrentMonth = date?.getMonth() === month;
      const isPast = date < today;
      const isToday = date?.toDateString() === today?.toDateString();
      const isSelected = selectedDate && date?.toDateString() === selectedDate?.toDateString();
      const hasSlots = availableSlots?.[date?.toISOString()?.split('T')?.[0]]?.length > 0;

      days?.push({
        date,
        day: date?.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        hasSlots: isCurrentMonth && !isPast && hasSlots
      });
    }

    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day) => {
    if (day?.isPast || !day?.isCurrentMonth || !day?.hasSlots) return;
    onDateSelect(day?.date);
  };

  const getTimeSlots = () => {
    if (!selectedDate) return [];
    const dateKey = selectedDate?.toISOString()?.split('T')?.[0];
    return availableSlots?.[dateKey] || [];
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Seleccionar Fecha y Hora</h2>
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(-1)}
            className="min-w-touch min-h-touch"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth(1)}
            className="min-w-touch min-h-touch"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames?.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays?.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={day?.isPast || !day?.isCurrentMonth || !day?.hasSlots}
              className={`
                relative w-10 h-10 text-sm font-medium rounded-md transition-all duration-150
                ${day?.isCurrentMonth 
                  ? day?.hasSlots && !day?.isPast
                    ? day?.isSelected
                      ? 'bg-primary text-primary-foreground'
                      : day?.isToday
                        ? 'bg-accent text-accent-foreground border-2 border-primary'
                        : 'bg-muted hover:bg-muted/80 text-foreground hover:text-foreground' :'text-muted-foreground cursor-not-allowed' :'text-muted-foreground/50 cursor-not-allowed'
                }
              `}
            >
              {day?.day}
              {day?.hasSlots && day?.isCurrentMonth && !day?.isPast && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-success rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-md font-semibold text-foreground mb-3">
            Horarios Disponibles - {selectedDate?.toLocaleDateString('es-VE', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {getTimeSlots()?.map((slot) => (
              <Button
                key={slot?.time}
                variant={selectedTime === slot?.time ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeSelect(slot?.time)}
                disabled={!slot?.available}
                className="min-h-touch justify-center"
              >
                <div className="text-center">
                  <div className="font-medium">{slot?.time}</div>
                  {slot?.type && (
                    <div className="text-xs opacity-75">
                      {slot?.type === 'in-person' ? 'Presencial' : 'Virtual'}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {getTimeSlots()?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Calendar" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No hay horarios disponibles para esta fecha</p>
              <p className="text-sm text-muted-foreground mt-1">Selecciona otra fecha</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;