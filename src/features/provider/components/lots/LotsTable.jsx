import React, { useMemo } from "react";
import { Scissors, Clock, History, MoveRight, Trash2, CheckCircle2 } from "lucide-react";

export default function LotsTable({
  rows = [],
  selected = [],
  onToggleRow,
  onToggleAll,
  onAdjust,
  onTransfer,
  onHistory,
  onDelete,
  onConsumeFEFO,
}) {
  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allChecked = selected.length === rows.length && rows.length > 0;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[40px,1.5fr,0.8fr,0.9fr,0.6fr,0.6fr,0.9fr,0.7fr,140px] px-4 py-2 text-xs text-gray-500 border-b">
        <div>
          <input
            type="checkbox"
            checked={allChecked}
            onChange={() => onToggleAll?.(allIds)}
          />
        </div>
        <div>Producto</div>
        <div>Lote</div>
        <div>F. Vencimiento</div>
        <div>Días</div>
        <div>Cantidad</div>
        <div>Ubicación</div>
        <div>Estado</div>
        <div className="text-right">Acciones</div>
      </div>

      {/* Rows */}
      {rows.map((r) => (
        <div
          key={r.id}
          className="grid grid-cols-1 md:grid-cols-[40px,1.5fr,0.8fr,0.9fr,0.6fr,0.6fr,0.9fr,0.7fr,140px] gap-y-1 px-4 py-3 border-b hover:bg-gray-50"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selected.includes(r.id)}
              onChange={() => onToggleRow?.(r.id)}
            />
          </div>

          <div>
            <div className="font-medium">{r.productName}</div>
            <div className="text-xs text-gray-500">{r.sku}</div>
          </div>

          <div className="md:text-left"><span className="text-sm">{r.lot_code}</span></div>

          <div className="md:text-left">{new Date(r.expires_at).toLocaleDateString()}</div>

          <div className={r.days < 0 ? "text-red-600" : r.days <= 30 ? "text-amber-600" : "text-emerald-600"}>
            {r.days}
          </div>

          <div>{r.on_hand}</div>

          <div>{r.location || "-"}</div>

          <div>
            {r.expiryState === "Vencido" ? (
              <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700">Vencido</span>
            ) : r.expiryState === "Por vencer" ? (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700">Por vencer</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700">OK</span>
            )}
          </div>

          <div className="md:text-right flex md:block gap-2">
            <button className="text-gray-600 hover:text-gray-900" title="Ajustar" onClick={() => onAdjust?.(r)}>
              <Scissors className="w-4 h-4" />
            </button>
            <button className="text-gray-600 hover:text-gray-900" title="Transferir" onClick={() => onTransfer?.(r)}>
              <MoveRight className="w-4 h-4" />
            </button>
            <button className="text-gray-600 hover:text-gray-900" title="Historial" onClick={() => onHistory?.(r)}>
              <History className="w-4 h-4" />
            </button>
            <button className="text-gray-600 hover:text-gray-900" title="Consumir FEFO" onClick={() => onConsumeFEFO?.(r)}>
              <Clock className="w-4 h-4" />
            </button>
            <button className="text-red-600 hover:text-red-800" title="Eliminar" onClick={() => onDelete?.(r)}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {rows.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          No hay lotes con los filtros actuales.
        </div>
      )}
    </div>
  );
}
