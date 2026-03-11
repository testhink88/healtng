// src/pages/professional-dashboard/components/UpcomingSchedule.jsx
import React from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

/**
 * Props:
 * - weekPills: [{ dayLabel:'Lun', dayNum:26, count:8, active?:true }]
 * - timeline: [{ time:'09:00', left?:'María G.', right?:'Carlos R.', slot?:'Disponible'|'Descanso' }]
 * - monthLabel: "Agosto - Septiembre 2025"
 */
const UpcomingSchedule = ({ weekPills = [], timeline = [], monthLabel = "", onEditAppointment, className = "" }) => {
  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Vista Semanal</h2>
            <div className="text-xs text-muted-foreground mt-1">{monthLabel}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        {/* Pills de días */}
        <div className="mt-4 flex items-end gap-2 overflow-x-auto pb-1">
          {weekPills?.map((d, i) => (
            <div
              key={`${d.dayLabel}-${d.dayNum}-${i}`}
              className={`shrink-0 rounded-2xl border px-3 py-2 text-center min-w-[52px] ${
                d.active
                  ? "border-primary text-primary ring-1 ring-primary/40"
                  : "border-border text-foreground"
              }`}
            >
              <div className="text-xs">{d.dayLabel}</div>
              <div className="text-base font-semibold leading-5">{d.dayNum}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {d.count} citas
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cronograma de hoy */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Cronograma de Hoy
        </h3>

        <div className="space-y-3">
          {timeline?.map((row, idx) => {
            const isSlot = !!row.slot;
            return (
              <div
                key={`${row.time}-${idx}`}
                className="grid grid-cols-[56px,1fr] items-center gap-3"
              >
                {/* hora */}
                <div className="text-xs text-muted-foreground">{row.time}</div>

                {/* contenido: dos columnas (izq/der) o chip */}
                {isSlot ? (
                  <div
                    className={`text-center text-[12px] rounded-md py-1.5 border ${
                      row.slot === "Disponible"
                        ? "bg-muted/60 text-muted-foreground border-border"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {row.slot}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => onEditAppointment && onEditAppointment(row.appointment)}
                      className="h-9 rounded-md border border-border bg-background text-sm px-3 text-left hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate">{row.patientName || ""}</span>
                      <Icon name="Edit2" size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA inferior opcional */}
        <div className="pt-4">
          <Button
            variant="ghost"
            fullWidth
            iconName="Calendar"
            iconPosition="left"
            onClick={() => (window.location.href = "/appointment-booking")}
          >
            Ver agenda completa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSchedule;
