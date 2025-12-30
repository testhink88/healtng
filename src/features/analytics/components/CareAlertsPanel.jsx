import React from "react";

export default function CareAlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Alertas de Cuidado</h3>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id} className="text-sm text-muted-foreground mb-2">
            <span className="font-medium">{alert.type}:</span> {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
