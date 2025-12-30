// src/pages/clinic-operations-overview-dashboard/components/ClinicAppointmentsFeedMini.jsx
import React from "react";

const badgeClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("espera")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (s.includes("consulta")) return "bg-blue-50 text-blue-800 border-blue-200";
  if (s.includes("final")) return "bg-green-50 text-green-800 border-green-200";
  if (s.includes("repro")) return "bg-gray-100 text-gray-700 border-gray-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const ClinicAppointmentsFeedMini = ({
  items = [],
  title = "Estado de citas (mock)",
}) => {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500 border rounded-lg p-4">
          Sin actividad reciente.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((a, i) => (
            <div
              key={a?.id ?? i}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {a.patient}
                </p>
                <p className="text-xs text-gray-500">
                  {a.service}
                  {a?.etaMin ? ` • ETA ${a.etaMin} min` : ""}
                </p>
              </div>
              <span
                className={`text-[11px] px-2 py-1 rounded-full border ${badgeClass(
                  a.status
                )}`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClinicAppointmentsFeedMini;
