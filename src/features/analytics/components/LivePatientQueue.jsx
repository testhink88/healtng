import React from "react";

/**
 * Props:
 * - snapshot: { waiting, inService, completed, noShow, avgWaitMin }
 */
export default function LivePatientQueue({ snapshot = { waiting:0, inService:0, completed:0, noShow:0, avgWaitMin:0 } }) {
  const items = [
    { key: "waiting", label: "En espera", color: "bg-amber-500" },
    { key: "inService", label: "En consulta", color: "bg-blue-500" },
    { key: "completed", label: "Completado", color: "bg-emerald-600" },
    { key: "noShow", label: "No-show", color: "bg-rose-600" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Espera promedio</div>
        <div className="text-lg font-semibold">{snapshot.avgWaitMin} min</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(it => (
          <div key={it.key} className="border border-border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{it.label}</div>
              <span className={`inline-block w-2 h-2 rounded-full ${it.color}`} />
            </div>
            <div className="mt-1 text-xl font-semibold">{snapshot[it.key] ?? 0}</div>
          </div>
        ))}
      </div>

      {/* Barra apilada simple */}
      <div className="h-3 w-full bg-muted rounded overflow-hidden">
        {items.map(it => {
          const total = Math.max(1, snapshot.waiting + snapshot.inService + snapshot.completed + snapshot.noShow);
            const pct = ((snapshot[it.key] || 0) / total) * 100;
            return <div key={it.key} className={`${it.color} h-full`} style={{ width: `${pct}%` }} />;
          })}
      </div>
    </div>
  );
}
