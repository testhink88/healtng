import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { cn } from '../../../utils/cn';

const CalendarBooking = ({ doctor, onDateTimeSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth?.getFullYear();
    const month = currentMonth?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date?.setDate(startDate?.getDate() + i);
      
      const dateKey = date?.toISOString()?.split('T')?.[0];
      const isCurrentMonth = date?.getMonth() === month;
      const isPast = date < today?.setHours(0, 0, 0, 0);
      const hasAvailability = doctor?.availability?.[dateKey]?.length > 0;
      
      days?.push({
        date,
        dateKey,
        isCurrentMonth,
        isPast,
        hasAvailability,
        day: date?.getDate()
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleDateSelect = (day) => {
    if (day?.isPast || !day?.hasAvailability || !day?.isCurrentMonth) return;
    setSelectedDate(day?.dateKey);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    return doctor?.availability?.[selectedDate] || [];
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Doctor Summary */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-4">
          <img
            src={doctor?.photo || '/assets/images/no_image.png'}
            alt={doctor?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-border"
            onError={(e) => {
              e.target.src = '/assets/images/no_image.png';
            }}
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {doctor?.name}
            </h2>
            <p className="text-muted-foreground mb-2">{doctor?.specialty}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className="text-warning" />
                <span className="font-medium">{doctor?.rating}</span>
                <span className="text-muted-foreground">({doctor?.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span>{doctor?.location}</span>
              </div>
              <div className="font-semibold text-primary">
                ${doctor?.consultationFee?.usd} USD
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={onBack} iconName="ArrowLeft">
            Cambiar médico
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Seleccionar fecha
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth(-1)}
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <div className="text-center min-w-[140px]">
                <div className="font-semibold text-foreground">
                  {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth(1)}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays?.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days?.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={day?.isPast || !day?.hasAvailability || !day?.isCurrentMonth}
                  className={cn(
                    "p-2 text-sm rounded-lg border transition-colors relative",
                    day?.isCurrentMonth
                      ? "text-foreground border-border"
                      : "text-muted-foreground border-transparent",
                    day?.isPast && "opacity-50 cursor-not-allowed",
                    !day?.hasAvailability && day?.isCurrentMonth && !day?.isPast
                      ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                      : "",
                    day?.hasAvailability && !day?.isPast && day?.isCurrentMonth
                      ? "hover:bg-primary/10 hover:border-primary cursor-pointer" :"",
                    selectedDate === day?.dateKey
                      ? "bg-primary text-primary-foreground border-primary"
                      : ""
                  )}
                >
                  <div className="relative">
                    {day?.day}
                    {day?.hasAvailability && !day?.isPast && day?.isCurrentMonth && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-muted rounded-full" />
              <span className="text-muted-foreground">No disponible</span>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Horarios disponibles
          </h3>

          {!selectedDate ? (
            <div className="text-center py-12">
              <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Selecciona una fecha para ver los horarios disponibles
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm font-medium text-foreground mb-4">
                {formatDate(selectedDate)}
              </div>

              {getAvailableSlots()?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    No hay horarios disponibles para esta fecha
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {getAvailableSlots()?.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "p-3 text-sm font-medium rounded-lg border transition-colors",
                        selectedTime === time
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:bg-primary/10 hover:border-primary"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Resumen de la cita
              </h4>
              <p className="text-sm text-muted-foreground">
                {doctor?.name} • {formatDate(selectedDate)} • {selectedTime}
              </p>
            </div>
            <Button onClick={handleConfirm} iconName="ArrowRight" size="lg">
              Continuar con los detalles
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking;