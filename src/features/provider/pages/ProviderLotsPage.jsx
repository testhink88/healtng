import React, { useMemo, useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ChevronDown, ChevronRight, PackagePlus, Pencil, Trash2, RefreshCw } from "lucide-react";
import LotReceiveModal from "@/features/provider/components/lots/LotReceiveModal";
import { 
  getLots,
  getProducts,
  upsertLotAndSync,
  deleteLotAndSync
} from "../utils/inventorySync";

/* ============ helpers de vencimiento ============ */
const POR_VENCER_UMBRAL_DIAS = 30;

function daysTo(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function expiryBadge(expDate) {
  const d = daysTo(expDate);
  if (d < 0) return { label: "Vencido", cls: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", days: d };
  if (d <= POR_VENCER_UMBRAL_DIAS) return { label: "Por vencer", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", days: d };
  return { label: "Vigente", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", days: d };
}

/* ============ Dropdown controlado ============ */
function Dropdown({ valueLabel, open, onOpen, onClose, children }) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        className="h-10 rounded-md border px-3 inline-flex items-center gap-2 hover:border-gray-400"
      >
        <span className="text-sm text-gray-700">{valueLabel}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-[240px] rounded-md border bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

export default function LotsPage() {
  const [lots, setLots] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [expiry, setExpiry] = useState("Todos"); 
  const [openMenu, setOpenMenu] = useState(null);

  // acordeón por producto
  const [openProducts, setOpenProducts] = useState({});

  // modal Recibir lote
  const [receiveOpen, setReceiveOpen] = useState(false);

  // productos para el modal (desde Supabase)
  const modalProducts = useMemo(() => {
    return allProducts.map(p => ({
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      category: p.category,
      unit: p.unit || "unidades",
      supplier: p.supplier || ""
    }));
  }, [allProducts]);

  // Normalizar lots de Supabase (snake_case a camelCase para la UI si es necesario)
  const normalizedLots = useMemo(() => lots.map(l => ({
    ...l,
    productId: l.product_id,
    productName: l.product_name || "Producto desconocido",
    lotCode: l.lot_code,
    mfgDate: l.mfg_date,
    expDate: l.exp_date
  })), [lots]);

  // filtrado por búsqueda/categoría/vencimiento
  const filteredLots = useMemo(() => {
    return normalizedLots.filter((r) => {
      const s =
        !search ||
        (r.productName || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.sku || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.lotCode || "").toLowerCase().includes(search.toLowerCase());

      const c =
        category === "Todas las categorías" || r.category === category;

      const b = expiryBadge(r.expDate);
      const e =
        expiry === "Todos" ||
        (expiry === "Vigente" && b.label === "Vigente") ||
        (expiry === "Por vencer" && b.label === "Por vencer") ||
        (expiry === "Vencido" && b.label === "Vencido");

      return s && c && e;
    });
  }, [normalizedLots, search, category, expiry]);

  // agrupación por producto
  const groups = useMemo(() => {
    const g = new Map();
    filteredLots.forEach((l) => {
      if (!g.has(l.productId)) g.set(l.productId, []);
      g.get(l.productId).push(l);
    });
    return Array.from(g.entries()).map(([productId, items]) => {
      const first = items[0];
      const totalQty = items.reduce((acc, x) => acc + Number(x.qty || 0), 0);
      let worst = "Vigente";
      items.forEach((i) => {
        const e = expiryBadge(i.expDate).label;
        if (e === "Vencido") worst = "Vencido";
        else if (e === "Por vencer" && worst !== "Vencido") worst = "Por vencer";
      });
      return { 
        productId, 
        productName: first.productName, 
        sku: first.sku, 
        category: first.category, 
        subcategory: first.subcategory, 
        totalQty, 
        items, 
        worst 
      };
    });
  }, [filteredLots]);

  // Handlers Supabase
  const handleReceive = async (lotData) => {
    // Mapear de camelCase a snake_case para Supabase
    const dbLot = {
      product_id: lotData.productId,
      product_name: lotData.productName,
      sku: lotData.sku,
      lot_code: lotData.lotCode,
      qty: Number(lotData.qty),
      unit: lotData.unit,
      mfg_date: lotData.mfgDate,
      exp_date: lotData.expDate,
      supplier: lotData.supplier
    };

    await upsertLotAndSync(dbLot);
    loadData();
    setReceiveOpen(false);
  };

  const handleDelete = async (lot) => {
    if (!confirm("¿Eliminar este lote?")) return;
    await deleteLotAndSync(lot.id, lot.product_id);
    loadData();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lotes y Vencimiento</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Sincronizando con Supabase..." : "Datos reales desde la nube."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setReceiveOpen(true)}>
            <PackagePlus className="w-4 h-4 mr-2" />
            Recibir Lote
          </Button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3 items-center">
          <Input
            label="Buscar"
            placeholder="Producto, SKU o código de lote…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Categoría</span>
              <Dropdown
                valueLabel={category}
                open={openMenu === "category"}
                onOpen={() => setOpenMenu("category")}
                onClose={() => setOpenMenu(null)}
              >
                {[ "Todas las categorías", "Medicamentos", "Material Médico", "Limpieza y desinfección", "Consumibles" ].map((opt) => (
                  <button
                    key={opt}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${category === opt ? "bg-blue-50" : ""}`}
                    onClick={() => {
                      setCategory(opt);
                      setOpenMenu(null);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </Dropdown>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Vencimiento</span>
              <Dropdown
                valueLabel={expiry}
                open={openMenu === "expiry"}
                onOpen={() => setOpenMenu("expiry")}
                onClose={() => setOpenMenu(null)}
              >
                {["Todos", "Vigente", "Por vencer", "Vencido"].map((opt) => (
                  <button
                    key={opt}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${expiry === opt ? "bg-blue-50" : ""}`}
                    onClick={() => {
                      setExpiry(opt);
                      setOpenMenu(null);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {/* AGRUPACIÓN POR PRODUCTO (acordeón) */}
      <div className="space-y-3">
        {loading ? (
           <div className="h-32 flex items-center justify-center border rounded-lg bg-white">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
           </div>
        ) : (
          groups.map((g) => {
            const isOpen = !!openProducts[g.productId];
            const worstCls = g.worst === "Vencido" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : g.worst === "Por vencer" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";

            return (
              <div key={g.productId} className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenProducts((prev) => ({ ...prev, [g.productId]: !isOpen }))}
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{g.productName}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {g.sku} · {g.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">
                      Total: <b>{g.totalQty}</b>
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${worstCls}`}>
                      {g.worst}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="w-full overflow-x-auto border-t bg-gray-50/30">
                    <table className="min-w-full text-sm">
                      <thead className="text-xs text-gray-500 bg-gray-100/50 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-left">Código de Lote</th>
                          <th className="px-4 py-3 text-left">F. Fabricación</th>
                          <th className="px-4 py-3 text-left">F. Vencimiento</th>
                          <th className="px-4 py-3 text-left">Días</th>
                          <th className="px-4 py-3 text-left">Cantidad</th>
                          <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {g.items.map((r) => {
                          const ex = expiryBadge(r.expDate);
                          const rowBorder = ex.label === "Vencido" ? "border-l-4 border-rose-400" : ex.label === "Por vencer" ? "border-l-4 border-amber-400" : "";
                          return (
                            <tr key={r.id} className={`border-t ${rowBorder} hover:bg-gray-50/50`}>
                              <td className="px-4 py-3 text-gray-800 font-mono text-xs">{r.lotCode}</td>
                              <td className="px-4 py-3 text-gray-800">{r.mfgDate}</td>
                              <td className="px-4 py-3 text-gray-800 font-medium">{r.expDate}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ex.cls}`}>
                                  {ex.days}d
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-800 font-semibold">{r.qty} {r.unit}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 text-gray-400">
                                  <button className="hover:text-blue-600 p-1" title="Editar lote">
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button className="hover:text-rose-600 p-1" title="Eliminar lote" onClick={() => handleDelete(r)}>
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}

        {!loading && groups.length === 0 && (
          <div className="rounded-lg border bg-white p-12 text-center text-sm text-gray-500">
            No hay lotes registrados en Supabase que coincidan con los filtros.
          </div>
        )}
      </div>

      <LotReceiveModal
        isOpen={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        onSave={handleReceive}
        products={modalProducts}
      />
    </div>
  );
}
