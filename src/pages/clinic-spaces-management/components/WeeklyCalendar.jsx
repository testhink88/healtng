import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WeeklyCalendar = ({ spaces, bookings, onSpaceReserve }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate?.getDay();
    const diff = startDate?.getDate() - day + 1; // Monday as first day
    
    startDate?.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate);
      weekDate?.setDate(startDate?.getDate() + i);
      week?.push(weekDate);
    }
    
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek?.setDate(currentWeek?.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeek(newWeek);
  };

  const getBookingForSlot = (spaceId, date, time) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return bookings?.find(booking => 
      booking?.spaceId === spaceId && 
      booking?.date === dateStr &&
      booking?.start <= time && 
      booking?.end > time
    );
  };

  const getBookingColor = (status) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const isSlotAvailable = (space, date, time) => {
    if (space?.status !== 'Disponible') return false;
    const booking = getBookingForSlot(space?.id, date, time);
    return !booking || booking?.status === 'cancelada';
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <h3 className="text-lg font-semibold text-gray-900">
            {weekDates?.[0]?.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long' 
            })} - {weekDates?.[6]?.toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
        
        <Button
          size="sm"
          onClick={() => setCurrentWeek(new Date())}
        >
          Hoy
        </Button>
      </div>
      {/* Calendar Grid */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
              <div className="p-3 text-sm font-medium text-gray-900">
                Espacio / Hora
              </div>
              {weekDates?.map((date, index) => (
                <div key={index} className="p-3 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {date?.toLocaleDateString('es-ES', { weekday: 'short' })?.toUpperCase()}
                  </div>
                  <div className="text-lg font-bold text-gray-700">
                    {date?.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Space Rows */}
            {spaces?.slice(0, 5)?.map((space) => (
              <div key={space?.id}>
                {/* Space Header */}
                <div className="grid grid-cols-8 border-b border-gray-100">
                  <div className="p-3 bg-gray-50 border-r border-gray-200">
                    <div className="text-sm font-medium text-gray-900">{space?.name}</div>
                    <div className="text-xs text-gray-500">{space?.type}</div>
                    <div className="text-xs text-gray-500">${space?.hourlyRate}/h</div>
                  </div>
                  {weekDates?.map((date, dateIndex) => (
                    <div key={dateIndex} className="border-r border-gray-100">
                      {/* Day summary for this space */}
                      <div className="p-2 bg-gray-25 border-b border-gray-100">
                        <div className="text-xs text-center">
                          {bookings?.filter(b => 
                            b?.spaceId === space?.id && 
                            b?.date === date?.toISOString()?.split('T')?.[0]
                          )?.length || 0} reservas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots for this space */}
                {timeSlots?.slice(0, 4)?.map((time) => (
                  <div key={`${space?.id}-${time}`} className="grid grid-cols-8 border-b border-gray-50">
                    <div className="p-2 bg-gray-50 border-r border-gray-200 text-xs text-gray-600 text-center">
                      {time}
                    </div>
                    {weekDates?.map((date, dateIndex) => {
                      const booking = getBookingForSlot(space?.id, date, time);
                      const isAvailable = isSlotAvailable(space, date, time);
                      
                      return (
                        <div key={dateIndex} className="border-r border-gray-100 relative">
                          {booking ? (
                            <div className={`m-1 p-1 rounded text-xs ${getBookingColor(booking?.status)}`}>
                              <div className="font-medium truncate">{booking?.professional}</div>
                              <div className="text-xs opacity-75">{booking?.start}-{booking?.end}</div>
                            </div>
                          ) : isAvailable ? (
                            <button
                              onClick={() => onSpaceReserve(space)}
                              className="w-full h-12 text-xs text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors flex items-center justify-center"
                            >
                              <Icon name="Plus" size={12} />
                            </button>
                          ) : (
                            <div className="w-full h-12 bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-400">No disponible</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Confirmada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-gray-600">Pendiente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Cancelada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-600">No disponible</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;