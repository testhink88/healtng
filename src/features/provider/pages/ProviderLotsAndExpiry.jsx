import React, { useMemo, useState, useEffect } from "react";
import { Upload, Download, Plus, Clock, Package, RefreshCw } from "lucide-react";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";

import LotsFilters from "../components/lots/LotsFilters";
import LotsTable from "../components/lots/LotsTable";
import LotReceiveModal from "../components/lots/LotReceiveModal";
import LotAdjustModal from "../components/lots/LotAdjustModal";
import LotTransferModal from "../components/lots/LotTransferModal";
import LotHistoryModal from "../components/lots/LotHistoryModal";

import { 
  getLots,
  getProducts,
  upsertLotAndSync,
  deleteLotAndSync 
} from "../utils/inventorySync";

// Helper para derivar estado de vencimiento
function derive(row) {
  const today = new Date();
  const expDate = row.exp_date || row.expires_at || row.expDate;
  const d = Math.ceil((new Date(expDate) - today) / 86400000);
  const expiryState = d < 0 ? "Vencido" : d <= 30 ? "Por vencer" : "OK";
  
  return { 
    ...row, 
    days: d, 
    expiryState,
    lot_code: row.lot_code || row.lotCode,
    expires_at: row.exp_date || row.expDate,
    on_hand: row.qty
  };
}

export default function LotsAndExpiry() {
  const [lots, setLots] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", status: "Todos", from: "", to: "" });
  const [selected, setSelected] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const [l, p] = await Promise.all([getLots(), getProducts()]);
    setLots(l);
    setAllProducts(p);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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
        (r.product_name || "").toLowerCase().includes(q) ||
        (r.sku || "").toLowerCase().includes(q) ||
        (r.lot_code || "").toLowerCase().includes(q);

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
      .reduce((acc, r) => acc + (r.qty || 0) * 0.45, 0); // Precio mock
    return { total, expired, soon, riskValue };
  }, [derived]);

  // Handlers Supabase
  const receiveLot = async (payload) => {
    const dbLot = {
      product_id: payload.productId,
      product_name: payload.productName,
      sku: payload.sku,
      lot_code: payload.lotCode,
      qty: Number(payload.qty),
      unit: payload.unit,
      mfg_date: payload.mfgDate,
      exp_date: payload.expDate,
      supplier: payload.supplier
    };

    await upsertLotAndSync(dbLot);
    loadData();
    setReceiveModal({ isOpen: false, product: null });
  };

  const adjustLot = async ({ batchId, type, qty }) => {
    const target = lots.find(l => l.id === batchId);
    if (!target) return;

    let nextQty = Number(target.qty || 0);
    if (type === "set") nextQty = qty;
    if (type === "add") nextQty += qty;
    if (type === "sub") nextQty = Math.max(0, nextQty - qty);

    await upsertLotAndSync({ ...target, qty: nextQty });
    loadData();
    setAdjustModal({ isOpen: false, batch: null });
  };

  const deleteLot = async (batchId, productId) => {
    if (!confirm("¿Eliminar este lote?")) return;
    await deleteLotAndSync(batchId, productId);
    loadData();
  };

  const exportCSV = () => {
    const headers = ["SKU", "Producto", "Lote", "F_Vencimiento", "Dias", "Cantidad", "Ubicacion", "Proveedor", "Estado"];
    const rows = filtered.map((r) => [
      r.sku,
      r.product_name,
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
    a.download = `seguimiento_lotes_db_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Lotes y Vencimiento" }]} />
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold mt-2 mb-1">Seguimiento de Lotes (Supabase)</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Cargando desde la nube..." : "Control detallado sincronizado con Supabase."}
          </p>
        </div>
        <Button variant="outline" onClick={loadData}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refrescar
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Lotes totales</div>
          <div className="text-2xl font-bold flex items-center gap-2 text-gray-900"><Package className="w-5 h-5 text-blue-500"/> {counts.total}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Vencidos</div>
          <div className="text-2xl font-bold text-red-600">{counts.expired}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Por vencer (≤30 días)</div>
          <div className="text-2xl font-bold text-amber-500">{counts.soon}</div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm border-l-4 border-l-red-500">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Valor en riesgo (USD)</div>
          <div className="text-2xl font-bold text-gray-900">${counts.riskValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      {/* Filtros y acciones */}
      <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
        <LotsFilters value={filters} onChange={setFilters} />
        <div className="mt-4 flex items-center gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-2"/> Exportar CSV</Button>
          <Button variant="default" size="sm" onClick={() => setReceiveModal({ isOpen: true, product: null })}>
            <Plus className="w-4 h-4 mr-2"/> Recibir Nuevo Lote
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
           <div className="h-64 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : (
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
            onDelete={(batch) => deleteLot(batch.id, batch.product_id)}
          />
        )}
      </div>

      {/* Modales */}
      <LotReceiveModal
        isOpen={receiveModal.isOpen}
        onClose={() => setReceiveModal({ isOpen: false, product: null })}
        onSave={receiveLot}
        products={allProducts.map(p => ({ productId: p.id, productName: p.name, sku: p.sku, unit: p.unit }))}
      />
      <LotAdjustModal
        isOpen={adjustModal.isOpen}
        batch={adjustModal.batch}
        onClose={() => setAdjustModal({ isOpen: false, batch: null })}
        onSave={adjustLot}
      />
    </div>
  );
}
