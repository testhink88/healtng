import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";

const PERIODS = [
  { label: "Todo el historial", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
  { label: "Este trimestre", value: "quarter" },
];

const TYPES = [
  { label: "Todos los movimientos", value: "all" },
  { label: "Entradas", value: "in" },
  { label: "Salidas", value: "out" },
  { label: "Ajustes", value: "adjust" },
  { label: "Transferencias", value: "transfer" },
];

const fmt = (d) => new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(d));

export default function MovementHistoryModal({ isOpen, item, onClose }) {
  const [period, setPeriod] = useState("all");
  const [type, setType] = useState("all");

  const base = Array.isArray(item?.movements) && item.movements.length
    ? item.movements
    : [
        { id: "m1", kind: "in", qty: +100, at: "2024-01-12T10:30:00", reason: "Compra a proveedor", ref: "PO-2024-001", user: "María González", notes: "Recepción según OC", before: 50, after: 150 },
        { id: "m2", kind: "out", qty: -25, at: "2024-01-11T15:45:00", reason: "Venta a cliente", ref: "VT-2024-045", user: "Carlos Ruiz", notes: "Venta directa", before: 150, after: 125 },
        { id: "m3", kind: "adjust", qty: -5, at: "2024-01-10T09:15:00", reason: "Productos dañados", ref: "ADJ-2024-003", user: "Ana López", notes: "Daño transporte", before: 125, after: 120 },
        { id: "m4", kind: "transfer", qty: -20, at: "2024-01-09T14:20:00", reason: "Transferencia a sucursal norte", ref: "TRF-2024-012", user: "Luis Martín", notes: "Traslado", before: 120, after: 100 },
      ];

  const filtered = useMemo(() => {
    let list = [...base];
    if (type !== "all") list = list.filter((m) => m.kind === type);

    const now = new Date();
    if (period !== "all") {
      const start = new Date();
      if (period === "today") start.setHours(0, 0, 0, 0);
      if (period === "week") start.setDate(now.getDate() - 7);
      if (period === "month") start.setMonth(now.getMonth() - 1);
      if (period === "quarter") start.setMonth(now.getMonth() - 3);
      list = list.filter((m) => new Date(m.at) >= start);
    }

    return list.sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [base, period, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Historial de Movimientos</h3>
          <p className="text-xs text-gray-500 mt-1">
            {item?.name} — <b>{item?.sku}</b>
          </p>
        </div>

        <div className="px-5 py-3 border-b grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Período</label>
            <Select options={PERIODS} value={period} onChange={setPeriod} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tipo de Movimiento</label>
            <Select options={TYPES} value={type} onChange={setType} />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={() => alert("Exportar historial (mock)")}>Exportar</Button>
          </div>
        </div>

        <div className="px-5 py-4 max-h-[60vh] overflow-auto">
          {filtered.map((m) => (
            <div key={m.id} className="border rounded-md p-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {m.kind === "in" && "Entrada"}
                  {m.kind === "out" && "Salida"}
                  {m.kind === "adjust" && "Ajuste"}
                  {m.kind === "transfer" && "Transferencia"}
                </div>
                <div className={m.qty >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {m.qty > 0 ? `+${m.qty}` : m.qty} {item?.unit || "unid"}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{fmt(m.at)}</div>
              <div className="text-sm mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                <div><span className="text-gray-500">Motivo:</span> {m.reason}</div>
                <div><span className="text-gray-500">Referencia:</span> {m.ref || "—"}</div>
                <div><span className="text-gray-500">Usuario:</span> {m.user || "—"}</div>
                <div><span className="text-gray-500">Notas:</span> {m.notes || "—"}</div>
                <div className="col-span-full text-xs text-gray-500 mt-1">
                  Stock: {m.before} → {m.after}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-8">No hay movimientos para el filtro actual.</div>
          )}
        </div>

        <div className="px-5 py-4 border-t flex justify-end">
          <Button variant="default" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
