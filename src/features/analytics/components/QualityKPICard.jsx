import React from "react";

/**
 * Props:
 * - { label, value, target?, status: 'ok'|'warn'|'alert' }
 */
export default function QualityKPICard({ label, value, target, status = "ok" }) {
  const ring =
    status === "ok" ? "ring-emerald-500/40" :
    status === "warn" ? "ring-amber-500/40" :
    "ring-rose-600/40";

  return (
    <div className={`bg-card rounded-lg border border-border p-3 ring-2 ${ring}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {target && <div className="text-[11px] text-muted-foreground mt-1">Objetivo: {target}</div>}
      <div className="mt-2 h-1.5 bg-muted rounded">
        <div
          className={`${statusColor(status)} h-1.5 rounded`}
          style={{ width: status === "ok" ? "100%" : status === "warn" ? "66%" : "33%" }}
        />
      </div>
    </div>
  );
}

function statusColor(s) {
  return s === "ok" ? "bg-emerald-600" : s === "warn" ? "bg-amber-500" : "bg-rose-600";
}
