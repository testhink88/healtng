import React, { useMemo } from "react";
import Icon from "@/components/AppIcon";

// helpers
const fmtISO = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const HOURS = Array.from({ length: 11 }, (_, i) => `${(8 + i).toString().padStart(2, "0")}:00`); // 08:00-18:00

/**
 * Muestra una semana con horas en filas y días en columnas.
 * props:
 * - appointments: [{date:'YYYY-MM-DD', time:'HH:mm', patientName, status}]
 * - currentWeek: Date (cualquier día de la semana mostrada)
 * - onWeekChange: (Date)=>void
 * - onDateSelect: (YYYY-MM-DD)=>void
 * - onTimeSelect: (HH:mm)=>void
 */
export default function AppointmentCalendar({
  appointments = [],
  currentWeek = new Date(),
  onWeekChange = () => {},
  onDateSelect = () => {},
  onTimeSelect = () => {},
}) {
  // inicio de semana (lunes)
  const weekStart = useMemo(() => {
    const d = new Date(currentWeek);
    const day = (d.getDay() + 6) % 7; // 0=Mon
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentWeek]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const mapByDateTime = useMemo(() => {
    const map = new Map();
    appointments.forEach((a) => {
      const key = `${a.date}|${a.time}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    });
    return map;
  }, [appointments]);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded hover:bg-muted"
            onClick={() => onWeekChange(addDays(weekStart, -7))}
            title="Anterior"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          <div className="font-medium text-foreground">
            {weekStart.toLocaleString("es-VE", { month: "long", year: "numeric" })}
          </div>
          <button
            className="p-2 rounded hover:bg-muted"
            onClick={() => onWeekChange(addDays(weekStart, 7))}
            title="Siguiente"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={14} /> {new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
      </div>

      {/* Grid header */}
      <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
        <div className="bg-muted/50 border-b border-border px-3 py-2 text-sm text-muted-foreground">Hora</div>
        {days.map((d) => (
          <div key={d.toISOString()} className="bg-muted/50 border-b border-l border-border px-3 py-2">
            <div className="text-xs text-muted-foreground capitalize">
              {d.toLocaleDateString("es-VE", { weekday: "short" })}
            </div>
            <div className="text-sm font-medium">{d.toLocaleDateString("es-VE", { day: "2-digit", month: "short" })}</div>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className="max-h-[520px] overflow-auto">
        {HOURS.map((h) => (
          <div key={h} className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
            {/* hour label */}
            <div className="border-t border-border px-3 py-4 text-xs text-muted-foreground">{h}</div>
            {/* day cells */}
            {days.map((d) => {
              const dateISO = fmtISO(d);
              const key = `${dateISO}|${h}`;
              const items = mapByDateTime.get(key) || [];
              return (
                <button
                  key={key}
                  className="border-t border-l border-border px-2 py-2 text-left hover:bg-accent/60 transition-colors"
                  onClick={() => { onDateSelect(dateISO); onTimeSelect(h); }}
                  title="Crear/Ver cita"
                >
                  {items.slice(0, 2).map((a) => (
                    <div
                      key={a.id}
                      className="text-[11px] mb-1 px-2 py-1 rounded bg-primary/10 text-foreground truncate"
                    >
                      {a.patientName || "Paciente"} • {a.reason || "Cita"}
                    </div>
                  ))}
                  {items.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{items.length - 2} más…</div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
