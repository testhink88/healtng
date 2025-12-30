import React from "react";

// Controles globales: fecha, canal y sede
export default function GlobalControls({ value, onChange }) {
  const v = value || {};
  const set = (patch) => onChange?.({ ...v, ...patch });

  return (
    <div className="p-0 flex flex-wrap gap-4 items-end">
      {/* Fecha desde */}
      <div className="flex-1 min-w-[140px]">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha desde</label>
        <input
          type="date"
          className="border border-border rounded-lg px-3 py-2 text-sm w-full bg-background focus:ring-2 focus:ring-primary/30"
          value={toDateInput(v.from)}
          onChange={(e) => set({ from: toIso(e.target.value) })}
        />
      </div>

      {/* Fecha hasta */}
      <div className="flex-1 min-w-[140px]">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha hasta</label>
        <input
          type="date"
          className="border border-border rounded-lg px-3 py-2 text-sm w-full bg-background focus:ring-2 focus:ring-primary/30"
          value={toDateInput(v.to)}
          onChange={(e) => set({ to: toIso(e.target.value) })}
        />
      </div>

      {/* Canal */}
      <div className="flex-1 min-w-[120px]">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Canal</label>
        <select
          className="border border-border rounded-lg px-3 py-2 text-sm w-full bg-background focus:ring-2 focus:ring-primary/30"
          value={v.channel || "inperson"}
          onChange={(e) => set({ channel: e.target.value })}
        >
          <option value="inperson">Presencial</option>
          <option value="virtual">Virtual</option>
        </select>
      </div>

      {/* Sede */}
      <div className="flex-1 min-w-[280px]">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Sede</label>
        <select
          className="border border-border rounded-lg px-3 py-2 text-sm w-full bg-background focus:ring-2 focus:ring-primary/30"
          value={v.locationId || "main"}
          onChange={(e) => set({ locationId: e.target.value })}
        >
          <option value="main">Centro Clínico Valle de San Diego</option>
          <option value="east">Instituto Docente de Urología</option>
          <option value="west">Clínica El Viñedo</option>
        </select>
      </div>
    </div>
  );
}

function toDateInput(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function toIso(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toISOString();
}
