import React, { useMemo } from "react";
import Icon from "@/components/AppIcon";

const statusPill = (s) => {
  const map = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-rose-100 text-rose-800",
    attended: "bg-blue-100 text-blue-800",
    "no-show": "bg-slate-200 text-slate-700",
  };
  return map[s] || "bg-muted text-foreground";
};

/**
 * Panel lateral con el detalle del día seleccionado.
 * props:
 * - selectedDate: 'YYYY-MM-DD'
 * - appointments: []
 * - onStatusChange(id, status)
 * - onReschedule(appointment)
 * - onContactPatient(appointment)
 */
export default function AppointmentDetailsPanel({
  selectedDate,
  appointments = [],
  onStatusChange = () => {},
  onReschedule = () => {},
  onContactPatient = () => {},
}) {
  const list = useMemo(
    () => appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  );

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="px-4 py-3 border-b border-border">
        <div className="text-sm text-muted-foreground">Citas del día</div>
        <div className="text-lg font-semibold text-foreground">
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("es-VE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
            : "Selecciona una fecha"}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          <Icon name="Calendar" size={40} className="mx-auto mb-2 opacity-60" />
          No hay citas programadas
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {list.map((a) => (
            <li key={a.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{a.time} — {a.patientName}</div>
                  <div className="text-xs text-muted-foreground">{a.reason || "Consulta"}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusPill(a.status)}`}>
                  {a.status === "confirmed" && "Confirmada"}
                  {a.status === "pending" && "Pendiente"}
                  {a.status === "attended" && "Atendida"}
                  {a.status === "cancelled" && "Cancelada"}
                  {a.status === "no-show" && "No asistió"}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                <button className="text-xs px-2 py-1 rounded bg-muted hover:bg-accent"
                        onClick={() => onContactPatient(a)}>
                  Contactar
                </button>
                <button className="text-xs px-2 py-1 rounded bg-muted hover:bg-accent"
                        onClick={() => onReschedule(a)}>
                  Reprogramar
                </button>
                <button className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200"
                        onClick={() => onStatusChange(a.id, "attend")}>
                  Marcar Atendida
                </button>
                <button className="text-xs px-2 py-1 rounded bg-rose-100 hover:bg-rose-200"
                        onClick={() => onStatusChange(a.id, "cancel")}>
                  Cancelar
                </button>
                <button className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-slate-300"
                        onClick={() => onStatusChange(a.id, "no-show")}>
                  No asistió
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Leyenda */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Confirmada
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pendiente
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Atendida
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Cancelada
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span> No asistió
          </span>
        </div>
      </div>
    </div>
  );
}
