// src/pages/clinic-operations-overview-dashboard/components/ClinicHeatmapMini.jsx
import React, { useMemo } from "react";
import Icon from "@/components/AppIcon";

const levelTag = (value) => {
  if (value >= 80) return { label: "Alta", className: "bg-red-50 text-red-700 border-red-200" };
  if (value >= 50) return { label: "Media", className: "bg-yellow-50 text-yellow-700 border-yellow-200" };
  return { label: "Baja", className: "bg-green-50 text-green-700 border-green-200" };
};

const barClass = (value) => {
  if (value >= 80) return "bg-red-500";
  if (value >= 50) return "bg-yellow-500";
  return "bg-green-500";
};

const ClinicHeatmapMini = ({ rooms = [], title = "Ocupación por sala (mock)" }) => {
  const normalized = useMemo(
    () =>
      (rooms || []).map((r) => ({
        name: r?.name ?? "Sala",
        occupancy: Number(r?.occupancy ?? 0),
        queue: Number(r?.queue ?? 0),
      })),
    [rooms]
  );

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">
            Lectura rápida de presión operativa por zona.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Icon name="Thermometer" size={14} />
          <span>Actualización simulada</span>
        </div>
      </div>

      {normalized.length === 0 ? (
        <div className="text-sm text-gray-500 border rounded-lg p-4">
          Sin datos de salas.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {normalized.map((r, i) => {
            const tag = levelTag(r.occupancy);
            return (
              <div
                key={`${r.name}-${i}`}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <p className="text-[11px] text-gray-500">
                      Cola estimada: {r.queue}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${tag.className}`}
                  >
                    {tag.label}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Ocupación</span>
                    <span className="font-semibold text-gray-900">
                      {r.occupancy}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barClass(r.occupancy)}`}
                      style={{ width: `${Math.min(100, Math.max(0, r.occupancy))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ClinicHeatmapMini;
