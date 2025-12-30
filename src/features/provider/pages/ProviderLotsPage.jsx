import React, { useMemo, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

/**
 * ✅ Datos mock (puedes conectar a tu API más adelante)
 * Estructura:
 * - productId, sku, productName, category, subcategory
 * - lots: [{ lotCode, qty, expDate(ISO), location? }]
 */
const initialGroups = [
  {
    productId: 1,
    sku: "HC20241201001",
    productName: "Amoxicilina 250mg",
    category: "Medicamentos",
    subcategory: "Antibióticos",
    lots: [
      { lotCode: "AMX-24A-001", qty: 25, expDate: "2024-12-01", location: "A-2-1" },
      { lotCode: "AMX-24B-002", qty: 50, expDate: "2025-03-10", location: "A-2-2" },
    ],
  },
  {
    productId: 2,
    sku: "HC20241201002",
    productName: "Desinfectante Hospitalario",
    category: "Limpieza y desinfección",
    subcategory: "Desinfectantes",
    lots: [{ lotCode: "DSF-24-009", qty: 30, expDate: "2026-01-05", location: "E-1-1" }],
  },
  {
    productId: 3,
    sku: "HC20241201003",
    productName: "Gasas estériles 10×10cm",
    category: "Material Médico",
    subcategory: "Gasas",
    lots: [
      { lotCode: "GAS-24-001", qty: 0, expDate: "2024-06-12", location: "C-1-2" },
      { lotCode: "GAS-24-002", qty: 0, expDate: "2024-08-22", location: "C-1-2" },
    ],
  },
];

/* ----------------------- Helpers de fecha/estado ----------------------- */
const DAYS_POR_VENCER = 30;

const parseISO = (s) => new Date(`${s}T00:00:00`);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const diffDays = (a, b) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / (1000 * 60 * 60 * 24));

/**
 * Estado del lote por fecha:
 * - "Vencido"       (expDate < hoy)
 * - "Por vencer"    (0 <= días <= 30)
 * - "Vigente"       (> 30 días)
 */
const getLotStatus = (expISO, today = new Date()) => {
  const exp = parseISO(expISO);
  const delta = diffDays(exp, today);
  if (delta < 0) return { code: "Expired", label: "Vencido", tone: "bg-rose-50 text-rose-700" };
  if (delta <= DAYS_POR_VENCER) return { code: "DueSoon", label: "Por vencer", tone: "bg-amber-50 text-amber-700" };
  return { code: "Valid", label: "Vigente", tone: "bg-emerald-50 text-emerald-700" };
};

/**
 * Estado del GRUPO (producto) consolidado por sus lotes:
 * - Si TODOS están vencidos -> "Vencido"
 * - Si ALGUNO está "Por vencer" (y no vencido) -> "Por vencer"
 * - En otro caso -> "Vigente"
 * - Si qty total = 0 y además todos vencidos -> "Vencido"
 */
const getGroupStatus = (lots, today = new Date()) => {
  let hasDueSoon = false;
  let allExpired = true;
  for (const lot of lots) {
    const st = getLotStatus(lot.expDate, today).code;
    if (st !== "Expired") allExpired = false;
    if (st === "DueSoon") hasDueSoon = true;
  }
  if (allExpired) return { label: "Vencido", tone: "bg-rose-50 text-rose-700" };
  if (hasDueSoon) return { label: "Por vencer", tone: "bg-amber-50 text-amber-700" };
  return { label: "Vigente", tone: "bg-emerald-50 text-emerald-700" };
};

/* ------------------------------ Page ------------------------------ */
export default function ProviderLotsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [expanded, setExpanded] = useState({}); // {productId: bool}

  const [filters, setFilters] = useState({
    q: "",
    category: "Todas las categorías",
    status: "Todos",
  });

  const categories = useMemo(() => {
    const s = new Set(["Todas las categorías"]);
    groups.forEach((g) => g.category && s.add(g.category));
    return Array.from(s);
  }, [groups]);

  const statusOptions = ["Todos", "Vigente", "Por vencer", "Vencido"];

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return groups
      .map((g) => {
        const totalQty = g.lots.reduce((acc, l) => acc + Number(l.qty || 0), 0);
        const gStatus = getGroupStatus(g.lots);
        return { ...g, totalQty, groupStatus: gStatus };
      })
      .filter((g) => {
        const matchesQ =
          !q ||
          g.productName.toLowerCase().includes(q) ||
          (g.sku || "").toLowerCase().includes(q) ||
          (g.category || "").toLowerCase().includes(q) ||
          (g.subcategory || "").toLowerCase().includes(q);

        const matchesCat = filters.category === "Todas las categorías" || g.category === filters.category;
        const matchesStatus = filters.status === "Todos" || g.groupStatus.label === filters.status;

        return matchesQ && matchesCat && matchesStatus;
      });
  }, [groups, filters]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const recibirLote = () => {
    // Aquí abrirías tu modal real de recepción de lotes
    alert("Acción: Recibir Lote (conectar a modal / flujo de recepción).");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Lotes y Vencimiento" },
        ]}
      />

      <div className="flex items-center justify-between mt-2 mb-1">
        <h1 className="text-2xl font-semibold">Lotes y Vencimiento</h1>
        <Button variant="default" onClick={recibirLote}>
          <Icon name="PackagePlus" className="mr-2" size={18} /> Recibir Lote
        </Button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Control por lote: código, fechas y cantidades. Umbral “Por vencer”: {DAYS_POR_VENCER} días.
      </p>

      {/* Filtros */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Buscar</label>
            <Input
              placeholder="Producto, SKU o código de lote…"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Categoría</label>
            <Select
              value={filters.category}
              onChange={(val) => setFilters({ ...filters, category: val })}
              options={categories.map((c) => ({ label: c, value: c }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Vencimiento</label>
            <Select
              value={filters.status}
              onChange={(val) => setFilters({ ...filters, status: val })}
              options={statusOptions.map((s) => ({ label: s, value: s }))}
            />
          </div>
        </div>
      </div>

      {/* Lista por producto */}
      <div className="space-y-3">
        {filtered.map((g) => {
          const isOpen = !!expanded[g.productId];
          const chip = (
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${g.groupStatus.tone}`}>
              {g.groupStatus.label}
            </span>
          );

          return (
            <div key={g.productId} className="bg-white border rounded-lg">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() => toggle(g.productId)}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={isOpen ? "ChevronDown" : "ChevronRight"}
                    size={18}
                    className="text-gray-400"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{g.productName}</div>
                    <div className="text-xs text-gray-500">
                      SKU: {g.sku} · {String(g.category).toLowerCase()} · {String(g.subcategory).toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-700">
                    Total: <span className="font-medium">{g.totalQty}</span>
                  </div>
                  {chip}
                </div>
              </button>

              {/* Lotes del producto */}
              {isOpen && (
                <div className="px-4 pb-3">
                  <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                          <th className="px-3 py-2 text-left">Código de Lote</th>
                          <th className="px-3 py-2 text-left">Ubicación</th>
                          <th className="px-3 py-2 text-left">Cantidad</th>
                          <th className="px-3 py-2 text-left">Vencimiento</th>
                          <th className="px-3 py-2 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.lots.map((l) => {
                          const st = getLotStatus(l.expDate);
                          return (
                            <tr key={l.lotCode} className="border-t">
                              <td className="px-3 py-2 font-medium text-gray-800">{l.lotCode}</td>
                              <td className="px-3 py-2 text-gray-700">{l.location || "-"}</td>
                              <td className="px-3 py-2 text-gray-800">{Number(l.qty || 0)}</td>
                              <td className="px-3 py-2 text-gray-700">
                                {new Date(l.expDate).toLocaleDateString("es-ES")}
                              </td>
                              <td className="px-3 py-2">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${st.tone}`}>
                                  {st.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {g.lots.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                              Sin lotes para este producto.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
            No hay resultados para los filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}
