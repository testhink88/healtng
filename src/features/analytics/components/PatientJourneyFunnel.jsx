import React from "react";

export default function PatientJourneyFunnel({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Embudo de Cuidado del Paciente</h3>
      <div className="space-y-2">
        {data.map((stage) => (
          <div key={stage.stage} className="flex justify-between">
            <span>{stage.stage}</span>
            <span>{stage.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
