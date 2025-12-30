import React from "react";

export default function PatientRiskMatrix({ data }) {
  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Nivel de Riesgo</h3>
      <p><strong>Riesgo: </strong>{data.riskLevel}</p>
      <p><strong>Factor principal: </strong>{data.mainFactor}</p>
      <p><strong>Próxima acción: </strong>{data.nextAction}</p>
    </div>
  );
}
