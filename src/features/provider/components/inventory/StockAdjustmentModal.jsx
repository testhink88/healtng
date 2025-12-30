import React, { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

const ADJUST_TYPES = [
  { label: "Establecer cantidad exacta", value: "set-exact" },
  { label: "Incrementar (+)", value: "increase" },
  { label: "Reducir (-)", value: "decrease" },
];

const ADJUST_REASONS = [
  { label: "Corrección de inventario", value: "correction" },
  { label: "Recepción de compra", value: "receive" },
  { label: "Daño / Merma", value: "damage" },
  { label: "Transferencia", value: "transfer" },
  { label: "Devolución", value: "return" },
];

export default function StockAdjustmentModal({ isOpen, item, onClose, onSave }) {
  const [type, setType] = useState("set-exact");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const currentStock = useMemo(() => Number(item?.stock ?? 0), [item]);
  const unit = item?.unit || "unid";

  if (!isOpen) return null;

  const submit = (e) => {
    e?.preventDefault?.();
    if (!qty || isNaN(Number(qty))) return alert("Ingresa una cantidad válida");
    if (!reason) return alert("Selecciona un motivo del ajuste");

    const payload = {
      itemId: item.id,
      type,
      reason,
      reference,
      notes,
    };
    if (type === "set-exact") payload.exactQty = Number(qty);
    else payload.delta = Number(qty) * (type === "decrease" ? -1 : 1);

    onSave?.(payload);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Ajuste de Inventario</h3>
          <p className="text-xs text-gray-500 mt-1">
            {item?.name} — <b>{item?.sku}</b>
          </p>
        </div>

        <form onSubmit={submit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-gray-500">Stock Actual</div>
              <div className="font-semibold">{currentStock} {unit}</div>
            </div>
            <div>
              <div className="text-gray-500">Stock Mínimo</div>
              <div className="font-semibold">{item?.reorderPoint ?? 0} {unit}</div>
            </div>
            <div>
              <div className="text-gray-500">Ubicación</div>
              <div className="font-semibold">{item?.location || "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo de Ajuste</label>
              <Select options={ADJUST_TYPES} value={type} onChange={setType} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
              <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Ingrese la cantidad" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Motivo del Ajuste</label>
            <Select options={ADJUST_REASONS} value={reason} onChange={setReason} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Referencia (Opcional)</label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Nº de doc., OC, etc." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Notas Adicionales</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Detalles del ajuste…" />
            </div>
          </div>
        </form>

        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={submit}>Guardar Ajuste</Button>
        </div>
      </div>
    </div>
  );
}
