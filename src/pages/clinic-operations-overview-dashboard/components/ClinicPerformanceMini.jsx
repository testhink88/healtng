// src/pages/clinic-operations-overview-dashboard/components/ClinicPerformanceMini.jsx
import React from "react";
import Icon from "@/components/AppIcon";

const MetricCard = ({ label, value, hint, icon }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      {icon && (
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
          <Icon name={icon} size={14} className="text-gray-500" />
        </div>
      )}
    </div>
    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    {hint && <p className="text-[11px] text-gray-500 mt-1">{hint}</p>}
  </div>
);

const ClinicPerformanceMini = ({
  data = {},
  title = "Performance del día (mock)",
  subtitle = "Señales clave de eficiencia y calidad operativa.",
}) => {
  const {
    scheduled = 0,
    attended = 0,
    cancelled = 0,
    onTimeRate = 0,
    avgCycleTime = 0,
    satisfaction = 0,
  } = data || {};

  const attendanceRate =
    scheduled > 0 ? Math.round((attended / scheduled) * 100) : 0;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          label="Citas programadas"
          value={scheduled}
          hint="Capacidad planificada del día"
          icon="Calendar"
        />
        <MetricCard
          label="Asistencia"
          value={`${attendanceRate}%`}
          hint={`${attended} atendidas`}
          icon="UserCheck"
        />
        <MetricCard
          label="Cancelaciones"
          value={cancelled}
          hint="Impacto directo en eficiencia"
          icon="Ban"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <MetricCard
          label="Puntualidad"
          value={`${onTimeRate}%`}
          hint="Inicio dentro de ventana esperada"
          icon="Clock"
        />
        <MetricCard
          label="Ciclo promedio"
          value={`${avgCycleTime} min`}
          hint="Desde llegada hasta salida"
          icon="Activity"
        />
        <MetricCard
          label="Satisfacción estimada"
          value={`${satisfaction}%`}
          hint="Encuestas internas simuladas"
          icon="Smile"
        />
      </div>
    </section>
  );
};

export default ClinicPerformanceMini;
