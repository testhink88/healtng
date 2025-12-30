import React, { useState, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { getStatusColor } from '@/utils/spaces';

const WeeklyCalendar = ({ spaces, bookings, onSpaceReserve }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // --- Lógica interna para evitar errores de importación ---
  const checkOverlap = (aStart, aEnd, bStart, bEnd) => {
    const parse = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    return parse(aStart) < parse(bEnd) && parse(bStart) < parse(aEnd);
  };

  const weekDates = useMemo(() => {
    const week = [];
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  }, [currentWeek]);

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const getBookingForSlot = (spaceId, date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    const [h, m] = time.split(':');
    const slotStart = time;
    const slotEnd = `${String(Number(h) + 1).padStart(2, '0')}:${m}`;

    return bookings?.find(b => {
      const bStart = b.startTime || b.start;
      const bEnd = b.endTime || b.end;
      return (
        b.spaceId === spaceId && 
        b.date === dateStr &&
        checkOverlap(slotStart, slotEnd, bStart, bEnd) &&
        b.status !== 'cancelada'
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg border">
            <Button variant="ghost" size="sm" onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))} className="h-8 w-8 p-0">
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))} className="h-8 w-8 p-0">
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">
            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <Button size="sm" variant="outline" onClick={() => setCurrentWeek(new Date())}>Hoy</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="p-4 text-left border-b border-r border-gray-200 min-w-[150px]">Espacio</th>
                {weekDates.map((date, i) => (
                  <th key={i} className="p-4 border-b border-gray-200 min-w-[120px]">
                    <div>{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                    <div className="text-lg font-bold text-gray-900">{date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spaces.map((space) => (
                <React.Fragment key={space.id}>
                  <tr className="bg-primary/5">
                    <td className="p-2 border-b border-r border-gray-200 font-bold text-[11px] text-primary uppercase">
                      {space.name}
                    </td>
                    {weekDates.map((_, i) => <td key={i} className="border-b border-gray-100"></td>)}
                  </tr>
                  {timeSlots.map((time) => (
                    <tr key={`${space.id}-${time}`} className="group">
                      <td className="p-2 border-r border-b border-gray-100 text-[10px] font-bold text-gray-400 text-center bg-gray-50/30">
                        {time}
                      </td>
                      {weekDates.map((date, i) => {
                        const booking = getBookingForSlot(space.id, date, time);
                        return (
                          <td key={i} className="border-r border-b border-gray-50 relative h-12 transition-colors hover:bg-gray-50/50">
                            {booking ? (
                              <div className={`absolute inset-1 p-1 rounded-lg border text-[9px] flex flex-col justify-center shadow-sm ${getStatusColor(booking.status)}`}>
                                <div className="font-bold truncate">{booking.professional}</div>
                              </div>
                            ) : (
                              <button onClick={() => onSpaceReserve(space)} className="w-full h-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-primary/40">
                                <Icon name="Plus" size={12} />
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;