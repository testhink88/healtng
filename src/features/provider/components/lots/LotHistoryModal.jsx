import React from "react";
import Button from "@/components/ui/Button";

/* 
  Este modal muestra movimientos del lote.
  Por ahora es un placeholder listo para poblar con tu backend.
*/
export default function LotHistoryModal({ isOpen, batch, onClose }) {
  if (!isOpen || !batch) return null;

  // Reemplaza por fetch a /batches/:id/movements
  const mockMoves = [
    { id: 1, type: "Entrada", qty: +50, date: "2024-10-10 10:30", note: "Compra orden OC-001" },
    { id: 2, type: "Salida",  qty: -10, date: "2024-10-20 12:00", note: "Consumo FEFO" },
    { id: 3, type: "Ajuste",  qty: -5,  date: "2024-11-05 09:15", note: "Daño en transporte" },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Historial de Movimientos</h3>
            <p className="text-xs text-gray-500">
              {batch.productName} · Lote {batch.lot_code} · SKU {batch.sku}
            </p>
          </div>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        <div className="px-5 py-4 max-h-[70vh] overflow-auto space-y-3">
          {mockMoves.map((m) => (
            <div key={m.id} className="border rounded p-3">
              <div className="text-sm font-medium">{m.type} <span className={m.qty >= 0 ? "text-emerald-600" : "text-red-600"}>{m.qty > 0 ? `+${m.qty}` : m.qty}</span></div>
              <div className="text-xs text-gray-500">{m.date}</div>
              {m.note && <div className="text-sm mt-1">{m.note}</div>}
            </div>
          ))}
          {mockMoves.length === 0 && (
            <div className="text-center text-gray-500 py-8">Sin movimientos.</div>
          )}
        </div>

        <div className="px-5 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}
