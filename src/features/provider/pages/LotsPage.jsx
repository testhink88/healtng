import React, { useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ChevronDown, ChevronRight, PackagePlus, Pencil, Trash2 } from "lucide-react";
import LotsReceiveModal from "@/features/provider/components/lots/LotReceiveModal"; // Verifica la ruta de importación

/* ================= MOCK: LOTES ================= */
const MOCK_LOTS = [
  {
    id: "LOT-AX-001",
    productId: "HC20241201001",
    productName: "Amoxicilina 250mg",
    sku: "HC20241201001",
    category: "medicamentos",
    subcategory: "antibióticos",
    lotCode: "AX250-2309-A",
    qty: 30,
    unit: "unidades",
    mfgDate: "2023-09-10",
    expDate: "2025-09-10",
    supplier: "PharmaX",
  },
  {
    id: "LOT-AX-002",
    productId: "HC20241201001",
    productName: "Amoxicilina 250mg",
    sku: "HC20241201001",
    category: "medicamentos",
    subcategory: "antibióticos",
    lotCode: "AX250-2402-B",
    qty: 45,
    unit: "unidades",
    mfgDate: "2024-02-02",
    expDate: "2025-02-02",
    supplier: "PharmaX",
  },
  {
    id: "LOT-DS-001",
    productId: "HC20241201002",
    productName: "Desinfectante Hospitalario",
    sku: "HC20241201002",
    category: "limpieza",
    subcategory: "desinfectantes",
    lotCode: "DS-2307-01",
    qty: 30,
    unit: "litros",
    mfgDate: "2023-07-01",
    expDate: "2026-07-01",
    supplier: "CleanLab",
  },
  {
    id: "LOT-GS-001",
    productId: "HC20241201003",
    productName: "Gasas estériles 10×10cm",
    sku: "HC20241201003",
    category: "material-médico",
    subcategory: "gasas",
    lotCode: "GS-2205-X",
    qty: 0,
    unit: "unidades",
    mfgDate: "2022-05-15",
    expDate: "2024-05-15",
    supplier: "MedTex",
  },
];

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
  const [lots, setLots] = useState(MOCK_LOTS);

  // filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [expiry, setExpiry] = useState("Todos"); // Todos | Vigente | Por vencer | Vencido
  // solo un dropdown abierto
  const [openMenu, setOpenMenu] = useState(null);

  // acordeón por producto
  const [openProducts, setOpenProducts] = useState({});

  // modal Recibir lote
  const [receiveOpen, setReceiveOpen] = useState(false);

  // productos “conocidos” para el modal
  const modalProducts = useMemo(() => {
    const map = new Map();
    lots.forEach(l => {
      if (!map.has(l.productId)) {
        map.set(l.productId, {
          productId: l.productId,
          productName: l.productName,
          sku: l.sku,
          category: l.category,
          subcategory: l.subcategory,
          unit: l.unit,
          supplier: l.supplier,
        });
      }
    });
    return Array.from(map.values());
  }, [lots]);

  // filtrado por búsqueda/categoría/vencimiento
  const filteredLots = useMemo(() => {
    return lots.filter((r) => {
      const s =
        !search ||
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.sku.toLowerCase().includes(search.toLowerCase()) ||
        r.lotCode.toLowerCase().includes(search.toLowerCase());

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
  }, [lots, search, category, expiry]);

  // agrupación por producto
  const groups = useMemo(() => {
    const g = new Map();
    filteredLots.forEach((l) => {
      if (!g.has(l.productId)) g.set(l.productId, []);
      g.get(l.productId).push(l);
    });
    // agregados por producto
    return Array.from(g.entries()).map(([productId, items]) => {
      const { productName, sku, category, subcategory } = items[0];
      const totalQty = items.reduce((acc, x) => acc + Number(x.qty || 0), 0);
      // estado agregado = el peor (Vencido > Por vencer > Vigente)
      let worst = "Vigente";
      items.forEach((i) => {
        const e = expiryBadge(i.expDate).label;
        if (e === "Vencido") worst = "Vencido";
        else if (e === "Por vencer" && worst !== "Vencido") worst = "Por vencer";
      });
      return { productId, productName, sku, category, subcategory, totalQty, items, worst };
    });
  }, [filteredLots]);

  // handler guardar desde modal
  const handleReceive = (lot) => {
    setLots((prev) => [lot, ...prev]);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lotes y Vencimiento</h1>
          <p className="text-sm text-muted-foreground">
            Control por <b>lote</b>: código, fechas y cantidades. Umbral “Por vencer”: {POR_VENCER_UMBRAL_DIAS} días.
          </p>
        </div>
        <Button onClick={() => setReceiveOpen(true)}>
          <PackagePlus className="w-4 h-4 mr-2" />
          Recibir Lote
        </Button>
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
                {[ "Todas las categorías", "medicamentos", "material-médico", "limpieza", "consumibles" ].map((opt) => (
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
        {groups.map((g) => {
          const isOpen = !!openProducts[g.productId];
          const worstCls = g.worst === "Vencido" ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200" : g.worst === "Por vencer" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";

          return (
            <div key={g.productId} className="rounded-lg border bg-white">
              {/* Header del acordeón */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                onClick={() => setOpenProducts((prev) => ({ ...prev, [g.productId]: !isOpen }))}
              >
                <div className="flex items-center gap-3">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <div>
                    <div className="font-medium text-gray-900">{g.productName}</div>
                    <div className="text-xs text-gray-500">
                      SKU: {g.sku} · {g.category} · {g.subcategory}
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

              {/* Tabla de lotes del producto */}
              {isOpen && (
                <div className="w-full overflow-x-auto border-t">
                  <table className="min-w-full text-sm">
                    <colgroup>
                      <col className="w-[240px]" />
                      <col className="w-[160px]" />
                      <col className="w-[160px]" />
                      <col className="w-[120px]" />
                      <col className="w-[120px]" />
                    </colgroup>
                    <thead className="text-xs text-gray-500 bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Código de Lote</th>
                        <th className="px-4 py-2 text-left">F. Fabricación</th>
                        <th className="px-4 py-2 text-left">F. Vencimiento</th>
                        <th className="px-4 py-2 text-left">Días</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((r) => {
                        const ex = expiryBadge(r.expDate);
                        const rowBorder = ex.label === "Vencido" ? "border-l-4 border-rose-400" : ex.label === "Por vencer" ? "border-l-4 border-amber-400" : "";

                        return (
                          <tr key={r.id} className={`border-t ${rowBorder}`}>
                            <td className="px-4 py-2 text-gray-800">{r.lotCode}</td>
                            <td className="px-4 py-2 text-gray-800">{r.mfgDate}</td>
                            <td className="px-4 py-2 text-gray-800">{r.expDate}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ex.cls}`} title={ex.label}>
                                {ex.days}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-800">{r.qty} {r.unit}</td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2 text-gray-500">
                                <button className="hover:text-blue-600" title="Editar lote">
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button className="hover:text-rose-600" title="Eliminar lote">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {g.items.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                            Sin lotes para este producto.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">
            No hay lotes para mostrar con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* MODAL: Recibir lote */}
      <LotsReceiveModal
        isOpen={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        onSave={handleReceive}
        products={modalProducts}
      />
    </div>
  );
}
