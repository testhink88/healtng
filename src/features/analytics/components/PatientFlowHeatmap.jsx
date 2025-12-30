import React from "react";

/**
 * Props:
 * - cells: [{ weekday: 0..6 (0=Dom), hour: 0..23, value: number }]
 */
export default function PatientFlowHeatmap({ cells = [] }) {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7..20

  const get = (w, h) => cells.find(c => c.weekday === w && c.hour === h)?.value || 0;
  const max = Math.max(1, ...cells.map(c => c.value || 0));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full text-xs">
        <thead>
          <tr>
            <th className="text-left p-2"></th>
            {hours.map(h => <th key={h} className="p-2 text-center font-medium">{String(h).padStart(2,"0")}:00</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((d, w) => (
            <tr key={w}>
              <td className="p-2 font-medium">{d}</td>
              {hours.map(h => {
                const v = get(w, h);
                const ratio = v / max;
                const bg = `rgba(var(--primary-rgb,59,130,246), ${0.18 + ratio * 0.6})`;
                return (
                  <td key={h} className="p-1">
                    <div title={`${d} ${h}:00 - ${v} atenciones`} className="h-6 rounded" style={{ background: bg }} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
