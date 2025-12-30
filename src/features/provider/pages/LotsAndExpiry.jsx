import React, { useMemo, useState } from "react";
import { Upload, Download, Plus, Clock, Package } from "lucide-react";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";

import LotsFilters from "../components/lots/LotsFilters";
import LotsTable from "../components/lots/LotsTable";
import LotReceiveModal from "../components/lots/LotReceiveModal";
import LotAdjustModal from "../components/lots/LotAdjustModal";
import LotTransferModal from "../components/lots/LotTransferModal";
import LotHistoryModal from "../components/lots/LotHistoryModal";

// Dataset de ejemplo (puedes reemplazar por fetch)
const initialLots = [
  {
    id: "b-ax-01",
    productId: 1,
    productName: "Amoxicilina 250mg",
    sku: "HC20241201001",
    lot_code: "AX-01",
    expires_at: "2025-12-31",
    on_hand: 30,
    unitPrice: 0.45,
    location: "A-2-1",
    supplier: "Farmacéutica Internacional",
  },
  {
    id: "b-ax-02",
    productId: 1,
    productName: "Amoxicilina 250mg",
    sku: "HC20241201001",
    lot_code: "AX-02",
    expires_at: "2026-06-30",
    on_hand: 45,
    unitPrice: 0.45,
    location: "A-2-3",
    supplier: "Farmacéutica Internacional",
  },
  {
    id: "b-ds-01",
    productId: 2,
    productName: "Desinfectante Hospitalario",
    sku: "HC20241201007",
    lot_code: "DS-01",
    expires_at: "2025-02-10",
    on_hand: 10,
    unitPrice: 8.5,
    location: "E-1-1",
    supplier: "CleanLab",
  },
  {
    id: "b-gs-01",
    productId: 3,
    productName: "Gasas Estériles 10×10cm",
    sku: "HC20241201003",
    lot_code: "GS-01",
    expires_at: "2024-11-30",
    on_hand: 200,
    unitPrice: 0.08,
    location: "C-1-2",
    supplier: "MedSup",
  },
];

function derive(row) {
  const today = new Date();
  const d = Math.ceil((new Date(row.expires_at) - today) / 86400000);
  const expiryState = d < 0 ? "Vencido" : d <= 30 ? "Por vencer" : "OK";
  return { ...row, days: d, expiryState };
}

export default function LotsAndExpiry() {
  const [lots, setLots] = useState(initialLots);
  const [filters, setFilters] = useState({ q: "", status: "Todos", from: "", to: "" });
  const [selected, setSelected] = useState([]);

  // modales
  const [receiveModal, setReceiveModal] = useState({ isOpen: false, product: null });
  const [adjustModal, setAdjustModal] = useState({ isOpen: false, batch: null });
  const [transferModal, setTransferModal] = useState({ isOpen: false, batch: null });
  const [historyModal, setHistoryModal] = useState({ isOpen: false, batch: null });

  const derived = useMemo(() => lots.map(derive), [lots]);

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;

    return derived.filter((r) => {
      const matchesQ =
        !q ||
        r.productName.toLowerCase().includes(q) ||
        r.sku.toLowerCase().includes(q) ||
        r.lot_code.toLowerCase().includes(q);

      const matchesStatus = filters.status === "Todos" || r.expiryState === filters.status;

      const expDate = new Date(r.expires_at);
      const matchesRange = (!from || expDate >= from) && (!to || expDate <= to);

      return matchesQ && matchesStatus && matchesRange;
    });
  }, [derived, filters]);

  const counts = useMemo(() => {
    const total = derived.length;
    const expired = derived.filter((r) => r.expiryState === "Vencido").length;
    const soon = derived.filter((r) => r.expiryState === "Por vencer").length;
    const riskValue = derived
      .filter((r) => r.expiryState !== "OK")
      .reduce((acc, r) => acc + (r.on_hand || 0) * (r.unitPrice || 0), 0);
    return { total, expired, soon, riskValue };
  }, [derived]);

  // Handlers
  const receiveLot = (payload) => {
    // payload: {productName, sku, lot_code, expires_at, on_hand, location, supplier, unitPrice}
    setLots((prev) => [
      {
        id: `b-${Date.now()}`,
        productId: Date.now(),
        ...payload,
      },
      ...prev,
    ]);
    setReceiveModal({ isOpen: false, product: null });
  };

  const adjustLot = ({ batchId, type, qty, reason }) => {
    setLots((prev) =>
      prev.map((r) => {
        if (r.id !== batchId) return r;
        const now = Number(r.on_hand || 0);
        let next = now;
        if (type === "set") next = qty;
        if (type === "add") next = now + qty;
        if (type === "sub") next = Math.max(0, now - qty);
        return { ...r, on_hand: next };
      })
    );
    setAdjustModal({ isOpen: false, batch: null });
  };

  const transferLot = ({ batchId, toLocation, qty }) => {
    setLots((prev) =>
      prev.map((r) => {
        if (r.id !== batchId) return r;
        const nextQty = Math.max(0, (r.on_hand || 0) - qty);
        return { ...r, on_hand: nextQty, location: toLocation || r.location };
      })
    );
    setTransferModal({ isOpen: false, batch: null });
  };

  const deleteLot = (batchId) => {
    setLots((prev) => prev.filter((r) => r.id !== batchId));
  };

  const consumeFEFO = (productName, qty = 1) => {
    // Sencillo: para ese producto, toma los lotes ordenados por fecha asc y consume del primero no vencido
    setLots((prev) => {
      const same = prev.filter((r) => r.productName === productName).sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at));
      const other = prev.filter((r) => r.productName !== productName);
      let remaining = qty;

      for (const b of same) {
        const d = Math.ceil((new Date(b.expires_at) - new Date()) / 86400000);
        if (d < 0) continue; // vencido no se consume
        if (remaining <= 0) break;
        const take = Math.min(b.on_hand, remaining);
        b.on_hand -= take;
        remaining -= take;
      }
      return [...same, ...other];
    });
    alert(`Se intentó consumir ${qty} por FEFO de ${productName}.`);
  };

  const exportCSV = () => {
    const headers = ["SKU", "Producto", "Lote", "F_Vencimiento", "Dias", "Cantidad", "Ubicacion", "Proveedor", "Estado"];
    const rows = filtered.map((r) => [
      r.sku,
      r.productName,
      r.lot_code,
      r.expires_at,
      r.days,
      r.on_hand,
      r.location || "",
      r.supplier || "",
      r.expiryState,
    ]);
    const csv = headers.join(",") + "\n" + rows.map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lotes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Lotes y Vencimiento" }]} />
      <h1 className="text-2xl font-semibold mt-2 mb-1">Lotes y Vencimientos</h1>
      <p className="text-sm text-gray-500 mb-6">Controla el inventario por lote, vigila fechas de caducidad y realiza movimientos.</p>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Lotes totales</div>
          <div className="text-lg font-semibold flex items-center gap-2"><Package className="w-4 h-4"/> {counts.total}</div>
        </div>
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Vencidos</div>
          <div className="text-lg font-semibold text-red-600">{counts.expired}</div>
        </div>
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Por vencer (≤30 días)</div>
          <div className="text-lg font-semibold text-amber-600">{counts.soon}</div>
        </div>
        <div className="bg-white border rounded p-3">
          <div className="text-xs text-gray-500 mb-1">Valor en riesgo (USD)</div>
          <div className="text-lg font-semibold">{counts.riskValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <LotsFilters value={filters} onChange={setFilters} />
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline"><Upload className="w-4 h-4 mr-2"/> Importar</Button>
          <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2"/> Exportar</Button>
          <Button variant="default" onClick={() => setReceiveModal({ isOpen: true, product: null })}>
            <Plus className="w-4 h-4 mr-2"/> Recibir Lote
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <LotsTable
        rows={filtered}
        selected={selected}
        onToggleRow={(id) =>
          setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
        onToggleAll={(allIds) =>
          setSelected((prev) => (prev.length === allIds.length ? [] : allIds))
        }
        onAdjust={(batch) => setAdjustModal({ isOpen: true, batch })}
        onTransfer={(batch) => setTransferModal({ isOpen: true, batch })}
        onHistory={(batch) => setHistoryModal({ isOpen: true, batch })}
        onDelete={(batch) => deleteLot(batch.id)}
        onConsumeFEFO={(batch) => consumeFEFO(batch.productName, 1)}
      />

      {/* Modales */}
      <LotReceiveModal
        isOpen={receiveModal.isOpen}
        onClose={() => setReceiveModal({ isOpen: false, product: null })}
        onSave={receiveLot}
      />
      <LotAdjustModal
        isOpen={adjustModal.isOpen}
        batch={adjustModal.batch}
        onClose={() => setAdjustModal({ isOpen: false, batch: null })}
        onSave={adjustLot}
      />
      <LotTransferModal
        isOpen={transferModal.isOpen}
        batch={transferModal.batch}
        onClose={() => setTransferModal({ isOpen: false, batch: null })}
        onSave={transferLot}
      />
      <LotHistoryModal
        isOpen={historyModal.isOpen}
        batch={historyModal.batch}
        onClose={() => setHistoryModal({ isOpen: false, batch: null })}
      />
    </div>
  );
}
