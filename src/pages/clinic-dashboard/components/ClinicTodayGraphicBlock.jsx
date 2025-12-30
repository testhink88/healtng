import React from "react";
import Icon from "@/components/AppIcon";

const ClinicTodayGraphicBlock = ({
  title = "Pulso operativo",
  subtitle = "Una lectura compacta del día.",
  items = [],
}) => {
  // items ejemplo:
  // [{ label:"Ocupación salas", value:72 }, { label:"Puntualidad", value:88 }]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="Pulse" size={16} className="text-primary" />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-500 border rounded-lg p-3">
          Sin datos por ahora.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => {
            const v = Math.min(100, Math.max(0, Number(it.value ?? 0)));
            return (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{it.label}</span>
                  <span className="font-semibold text-gray-900">{v}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${v}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClinicTodayGraphicBlock;
