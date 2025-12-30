// src/features/analytics/components/PerformanceAnalytics.jsx
import React from "react";

const PerformanceAnalytics = ({ series }) => {
  // Aquí puedes implementar la lógica de visualización
  // y cómo presentar las barras de rendimiento
  return (
    <div className="performance-analytics">
      <h3 className="text-lg font-semibold">Rendimiento</h3>
      <div>
        {series.map((item, index) => (
          <div key={index} className="performance-item">
            <span>{item.label}: </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
