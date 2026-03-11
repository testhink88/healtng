import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LotTransferModal({ isOpen, batch, onClose, onSave }) {
  const [form, setForm] = useState({ toLocation: "", qty: "" });

  useEffect(() => {
    if (!isOpen) setForm({ toLocation: "", qty: "" });
  }, [isOpen]);

  if (!isOpen || !batch) return null;

  const submit = () => {
    if (!form.toLocation || form.qty === "") return;
    onSave({ batchId: batch.id, toLocation: form.toLocation, qty: Number(form.qty) });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Transferir Lote – {batch.lot_code}</h3>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="text-xs text-gray-500">Producto: <b>{batch.productName}</b> · Stock actual: <b>{batch.on_hand}</b></div>
          <Input label="Ubicación Destino *" value={form.toLocation} onChange={(e)=>setForm((s)=>({ ...s, toLocation: e.target.value }))} />
          <Input label="Cantidad a Transferir *" type="number" value={form.qty} onChange={(e)=>setForm((s)=>({ ...s, qty: e.target.value }))} />
        </div>

        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit}>Transferir</Button>
        </div>
      </div>
    </div>
  );
}
