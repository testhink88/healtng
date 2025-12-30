import React from "react";

export default function KPIMetricsCard({ label, value, deltaPct, trend = "flat" }) {
  const color =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-secondary-foreground";
  const arrow =
    trend === "up" ? "▲" : trend === "down" ? "▼" : "●";

  return (
    <div className="bg-card rounded-lg border border-border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      {deltaPct != null && (
        <div className={`mt-1 text-[11px] ${color}`}>{arrow} {deltaPct > 0 ? "+" : ""}{deltaPct}%</div>
      )}
    </div>
  );
}
