// src/features/provider/pages/ProviderInventory.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Upload, Download, Plus, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

import InventoryTable from "../components/inventory/InventoryTable";
import BulkUploadModal from "../components/inventory/BulkUploadModal";
import ProductModal from "../components/inventory/ProductModal";
import MovementHistoryModal from "../components/inventory/MovementHistoryModal";
import BulkActionsPanel from "../components/inventory/BulkActionsPanel";
import BusinessProfileSelector from "../components/BusinessProfileSelector";

import { deriveStockStatus, STOCK_STATUS } from "@/utils/stock";
import {
  buildReorderSuggestions,
  summarizeReorderPayload,
} from "@/utils/reorder";

// -----------------------------------------------------------------------------
// Datos iniciales MOCK de inventario
// -----------------------------------------------------------------------------
const initialProducts = [
  {
    id: 1,
    sku: "HC20241201001",
    name: "Amoxicilina 250mg",
    category: "Medicamentos",
    subcategory: "Antibióticos",
    stock: 75,
    reorderPoint: 30,
    unitPrice: 0.45,
    unitPriceWholesale: 0.38,
    moq: 50,
    unit: "unidades",
    status: "Activo",
    location: "A-2-1",
    description: "Antibiótico de amplio espectro",
    supplier: "Farmacéutica Internacional",
  },
  {
    id: 2,
    sku: "HC20241201002",
    name: "Desinfectante Hospitalario",
    category: "Limpieza y desinfección",
    subcategory: "Desinfectantes",
    stock: 30,
    reorderPoint: 15,
    unitPrice: 8.5,
    unitPriceWholesale: 7.2,
    moq: 6,
    unit: "litros",
    status: "Activo",
    location: "E-1-1",
  },
  {
    id: 3,
    sku: "HC20241201003",
    name: "Gasas Estériles 10×10cm",
    category: "Material Médico",
    subcategory: "Gasas",
    stock: 0,
    reorderPoint: 200,
    unitPrice: 0.08,
    unitPriceWholesale: 0.07,
    moq: 200,
    unit: "unidades",
    status: "Inactivo",
    location: "C-1-2",
  },
  {
    id: 4,
    sku: "HC20241201004",
    name: "Guantes Nitrilo Talla M",
    category: "Consumibles",
    subcategory: "Guantes",
    stock: 1200,
    reorderPoint: 400,
    unitPrice: 0.12,
    unitPriceWholesale: 0.1,
    moq: 500,
    unit: "unidades",
    status: "Activo",
    location: "B-3-2",
  },
  {
    id: 5,
    sku: "HC20241201005",
    name: "Tensiómetro Digital",
    category: "Equipos",
    subcategory: "Diagnóstico",
    stock: 14,
    reorderPoint: 10,
    unitPrice: 39.9,
    unitPriceWholesale: 35.0,
    moq: 5,
    unit: "unidades",
    status: "Activo",
    location: "EQ-01",
  },
  {
    id: 6,
    sku: "HC20241201006",
    name: "Ibuprofeno 600mg",
    category: "Medicamentos",
    subcategory: "Antiinflamatorios",
    stock: 18,
    reorderPoint: 50,
    unitPrice: 0.35,
    unitPriceWholesale: 0.3,
    moq: 100,
    unit: "unidades",
    status: "Activo",
    location: "A-1-3",
  },
  {
    id: 7,
    sku: "HC20241201007",
    name: "Alcohol Isopropílico 70%",
    category: "Limpieza y desinfección",
    subcategory: "Desinfectantes",
    stock: 60,
    reorderPoint: 40,
    unitPrice: 3.25,
    unitPriceWholesale: 2.85,
    moq: 12,
    unit: "litros",
    status: "Activo",
    location: "E-2-1",
  },
  {
    id: 8,
    sku: "HC20241201008",
    name: "Vendas Elásticas 10cm",
    category: "Material Médico",
    subcategory: "Vendas",
    stock: 220,
    reorderPoint: 150,
    unitPrice: 0.22,
    unitPriceWholesale: 0.19,
    moq: 100,
    unit: "unidades",
    status: "Activo",
    location: "C-2-3",
  },
];

// Normaliza valor de ?mode= a "B2C" / "B2B" / "Mixto"
const normalizeMode = (m) => {
  const x = String(m || "").toLowerCase();
  if (x === "b2b") return "B2B";
  if (x === "b2c") return "B2C";
  if (x === "mixto" || x === "mixed") return "Mixto";
  return "Mixto";
};

// -----------------------------------------------------------------------------
// Storage keys
// Esta clave debe ser la MISMA que usa ProviderCatalog
// -----------------------------------------------------------------------------
const B2B_CATALOG_STORAGE_KEY = "mock:b2bCatalog"; // catálogo B2B
const PROFILE_KEY = "provider.profile"; // perfil comercial (B2B/B2C/Mixto)

// -----------------------------------------------------------------------------
// Mapea un producto del inventario al formato del catálogo B2B
// -----------------------------------------------------------------------------
const mapInventoryProductToCatalogItem = (product) => {
  if (!product) return null;

  return {
    // IDs y trazabilidad
    id: product.id,
    source: "inventory",
    sourceId: product.id,
    code: product.sku,

    // Info básica
    name: product.name,
    description: product.description || "",
    category: product.category || "",
    subcategory: product.subcategory || "",
    type: "product", // aquí sólo publicamos productos físicos

    // Precios pensados para B2B
    price:
      typeof product.unitPriceWholesale === "number"
        ? product.unitPriceWholesale
        : typeof product.unitPrice === "number"
        ? product.unitPrice
        : 0,

    // Stock
    stock: typeof product.stock === "number" ? product.stock : 0,
    minStock:
      typeof product.reorderPoint === "number" ? product.reorderPoint : 0,

    // Datos para B2B
    unit: product.unit || "unidades",
    moq: typeof product.moq === "number" ? product.moq : 1,
    supplier: product.supplier || "",
    targetAudience: "b2b",

    // Estado de publicación
    status: product.status === "Activo" ? "active" : "inactive",
    publishedAt: null, // luego se puede usar al “publicar en marketplace”
  };
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function ProviderInventory() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState(initialProducts);

  // ================================================================
  // 📦 Catálogo B2B en memoria (lo que verá ProviderCatalog)
  // ================================================================
  const [b2bCatalog, setB2bCatalog] = useState([]);

  // Cargar catálogo B2B desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setB2bCatalog(parsed);
        }
      }
    } catch (err) {
      console.error("Error leyendo catálogo B2B desde localStorage:", err);
    }
  }, []);

  // ================================================================
  // 🚀 Publicar producto del inventario al Catálogo B2B
  // ================================================================
  const publishToB2BCatalog = (product) => {
    if (!product) return;

    const mapped = mapInventoryProductToCatalogItem(product);
    if (!mapped) return;

    setB2bCatalog((prev) => {
      // Evitar duplicados por id o por código
      const alreadyExists = prev.some(
        (item) =>
          item.sourceId === product.id ||
          item.id === product.id ||
          item.code === product.sku
      );

      if (alreadyExists) {
        alert(`"${product.name}" ya está en tu catálogo B2B.`);
        return prev;
      }

      const updated = [...prev, mapped];

      try {
        localStorage.setItem(B2B_CATALOG_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error al guardar catálogo B2B:", error);
        alert("Ocurrió un error al guardar en el catálogo B2B.");
      }

      alert(`"${product.name}" se agregó a tu catálogo B2B.`);
      return updated;
    });
  };

  // ======= Perfil Comercial (modo + compras a proveedores) =======
  const [needsSupplies, setNeedsSupplies] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "Todas las categorías",
    stockStatus: "Todos los estados",
    status: "Todos",
    businessMode: "Mixto",
  });

  // Cargar perfil desde localStorage y URL al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.mode) {
          setFilters((f) => ({ ...f, businessMode: normalizeMode(saved.mode) }));
        }
        if (typeof saved?.needsSupplies === "boolean") {
          setNeedsSupplies(!!saved.needsSupplies);
        }
      }
    } catch {}

    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    if (modeParam) {
      setFilters((f) => ({ ...f, businessMode: normalizeMode(modeParam) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantener URL sincronizada cuando cambie el modo
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = normalizeMode(params.get("mode"));
    if (current !== filters.businessMode) {
      params.set("mode", filters.businessMode);
      navigate(
        { pathname: location.pathname, search: `?${params.toString()}` },
        { replace: true }
      );
    }
    // Guardar perfil
    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ mode: filters.businessMode, needsSupplies })
      );
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.businessMode, needsSupplies]);

  // ======= Selección de filas =======
  const [selectedIds, setSelectedIds] = useState([]);
  const selectOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const selectAll = (ids) =>
    setSelectedIds((prev) => (prev.length === ids.length ? [] : [...ids]));

  // ======= Modales y panel =======
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [productModal, setProductModal] = useState({
    isOpen: false,
    product: null,
    mode: "view",
  });
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    item: null,
  });

  const [isBulkPanelOpen, setIsBulkPanelOpen] = useState(false);
  useEffect(() => {
    setIsBulkPanelOpen(selectedIds.length > 0);
  }, [selectedIds]);

  // ======= Normalización de inventario =======
  const normalized = useMemo(
    () =>
      products.map((p) => {
        const on_hand = Number(p.stock ?? 0);
        const reserved = Number(p.reserved ?? 0);
        const reorder_point = Number(p.reorderPoint ?? 0);
        const invStatus = deriveStockStatus({ on_hand, reserved, reorder_point });
        return { ...p, on_hand, reserved, reorder_point, invStatus };
      }),
    [products]
  );

  // ======= Filtrado =======
  const filtered = useMemo(() => {
    const q = (filters.search || "").toLowerCase();
    return normalized.filter((p) => {
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      const matchCat =
        filters.category === "Todas las categorías" ||
        p.category === filters.category;
      const matchStatus =
        filters.status === "Todos" || p.status === filters.status;
      const matchStock =
        filters.stockStatus === "Todos los estados" ||
        (filters.stockStatus === "En Stock" &&
          p.invStatus === STOCK_STATUS.OK) ||
        (filters.stockStatus === "Bajo Stock" &&
          p.invStatus === STOCK_STATUS.LOW) ||
        (filters.stockStatus === "Sin Stock" &&
          p.invStatus === STOCK_STATUS.OUT);

      return matchSearch && matchCat && matchStatus && matchStock;
    });
  }, [normalized, filters]);

  // ======= Opciones =======
  const categories = useMemo(() => {
    const s = new Set(["Todas las categorías"]);
    normalized.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [normalized]);

  const stockStatuses = ["Todos los estados", "En Stock", "Bajo Stock", "Sin Stock"];
  const statusOptions = ["Todos", "Activo", "Inactivo", "Descontinuado"];

  const clearFilters = () =>
    setFilters({
      search: "",
      category: "Todas las categorías",
      stockStatus: "Todos los estados",
      status: "Todos",
      businessMode: "Mixto",
    });

  // ======= CRUD =======
  const viewProduct = (product) =>
    setProductModal({ isOpen: true, product, mode: "view" });

  const editProduct = (product) =>
    setProductModal({ isOpen: true, product, mode: "edit" });

  const createProduct = () =>
    setProductModal({ isOpen: true, product: null, mode: "create" });

  const saveProduct = (data) => {
    if (productModal.mode === "create") {
      setProducts((prev) => [{ id: Date.now(), ...data }, ...prev]);
    } else if (productModal.mode === "edit" && productModal.product) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productModal.product.id ? { ...p, ...data } : p
        )
      );
    }
    setProductModal({ isOpen: false, product: null, mode: "view" });
  };

  const deleteProduct = (product) => {
    if (!product) return;
    const ok = confirm(`¿Eliminar "${product.name}"?`);
    if (!ok) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setSelectedIds((prev) => prev.filter((id) => id !== product.id));
  };

  const changeStockInline = (id, value) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Number(value || 0) } : p))
    );

  // ======= Reorden / Export =======
  const bulkReorder = () => {
    const candidates = filtered.filter((p) => selectedIds.includes(p.id));
    const suggestions = buildReorderSuggestions(candidates, {
      mode: filters.businessMode,
      needsSupplies,
    });
    if (!suggestions.length) return alert("No hay artículos para reordenar.");
    const payload = summarizeReorderPayload(suggestions, {
      mode: filters.businessMode,
    });
    console.log("Reorden →", suggestions, payload);
    alert(
      `(${filters.businessMode}${needsSupplies ? " • Compras ON" : ""}) ` +
        `Generadas ${payload.total_items} sugerencias de compra.` +
        `${payload.total_cost ? `\nCosto estimado: $${payload.total_cost}` : ""}`
    );
  };

  const exportCSV = () => {
    const isB2B = filters.businessMode === "B2B";
    const isB2C = filters.businessMode === "B2C";
    const isMix = filters.businessMode === "Mixto";

    const headers = [
      "SKU",
      "Producto",
      "Categoría",
      "Stock",
      "Nivel mínimo",
      ...(isB2C || isMix ? ["Precio Unitario (USD)"] : []),
      ...(isB2B || isMix ? ["Precio Mayorista (USD)", "MOQ"] : []),
      "Estado",
      "Modo",
      "Compras",
    ];

    const rows = filtered.map((p) => {
      const wholesale = Number(
        p.unitPriceWholesale ?? (p.unitPrice != null ? p.unitPrice * 0.85 : 0)
      );
      const moq = Number(p.moq ?? 10);
      const base = [
        p.sku || "",
        p.name,
        p.category || "",
        p.on_hand ?? 0,
        p.reorder_point ?? 0,
      ];
      const b2cCols = isB2C || isMix ? [Number(p.unitPrice ?? 0)] : [];
      const b2bCols = isB2B || isMix ? [wholesale, moq] : [];
      const tail = [
        p.status || "Activo",
        filters.businessMode,
        needsSupplies ? "ON" : "OFF",
      ];
      return [...base, ...b2cCols, ...b2bCols, ...tail];
    });

    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((r) => r.map((x) => `"${x ?? ""}"`).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${filters.businessMode.toLowerCase()}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Acciones masivas desde el panel inferior
  const categoryOptionsForBulk = useMemo(
    () =>
      categories
        .filter((c) => c !== "Todas las categorías")
        .map((c) => ({ label: c, value: c })),
    [categories]
  );

  const handleBulkAction = async (actionId, payload) => {
    if (actionId === "activate") {
      setProducts((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, status: "Activo" } : p
        )
      );
    }
    if (actionId === "deactivate") {
      setProducts((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, status: "Inactivo" } : p
        )
      );
    }
    if (actionId === "category") {
      setProducts((prev) =>
        prev.map((p) =>
          selectedIds.includes(p.id)
            ? { ...p, category: payload.category }
            : p
        )
      );
    }
    if (actionId === "stock") {
      setProducts((prev) =>
        prev.map((p) => {
          if (!selectedIds.includes(p.id)) return p;
          const cur = Number(p.stock || 0);
          const qty = Number(payload.qty || 0);
          let next = cur;
          if (payload.type === "set") next = qty;
          if (payload.type === "add") next = cur + qty;
          if (payload.type === "sub") next = Math.max(0, cur - qty);
          return { ...p, stock: next };
        })
      );
    }
    if (actionId === "price") {
      setProducts((prev) =>
        prev.map((p) => {
          if (!selectedIds.includes(p.id)) return p;
          const cur = Number(p.unitPrice || 0);
          const amt = Number(payload.amount || 0);
          let next = cur;
          if (payload.type === "set") next = amt;
          if (payload.type === "inc_pct") next = cur * (1 + amt / 100);
          if (payload.type === "dec_pct") next = cur * (1 - amt / 100);
          if (payload.type === "inc_abs") next = cur + amt;
          if (payload.type === "dec_abs") next = Math.max(0, cur - amt);
          return { ...p, unitPrice: Number(next.toFixed(2)) };
        })
      );
    }
    if (actionId === "export") {
      exportCSV();
    }

    setSelectedIds([]);
  };

  const visibleIds = filtered.map((p) => p.id);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Gestión de Inventario" },
        ]}
      />
      <h1 className="text-2xl font-semibold mt-2 mb-1">
        Gestión de Inventario
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Configura tu perfil de ventas y compras y gestiona el stock según el
        modo <strong>B2C / B2B / Mixto</strong>.
      </p>

      {/* === Selector de Perfil Comercial === */}
      <div className="mb-4">
        <BusinessProfileSelector
          valueMode={filters.businessMode}
          valueNeedsSupplies={needsSupplies}
          onChangeMode={(m) => setFilters((f) => ({ ...f, businessMode: m }))}
          onChangeNeedsSupplies={setNeedsSupplies}
          persistKey={PROFILE_KEY}
        />
      </div>

      {/* Filtros + acciones */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3 flex-1">
            <div className="flex-1 min-w-[260px]">
              <label className="block text-xs text-gray-500 mb-1">
                Buscar producto
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar productos por nombre, código o categoría..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-9"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-xs text-gray-500 mb-1">
                Estado Stock
              </label>
              <Select
                options={stockStatuses.map((s) => ({
                  label: s,
                  value: s,
                }))}
                value={filters.stockStatus}
                onChange={(val) =>
                  setFilters({ ...filters, stockStatus: val })
                }
              />
            </div>

            <div className="min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Categoría
              </label>
              <Select
                options={categories.map((c) => ({ label: c, value: c }))}
                value={filters.category}
                onChange={(val) =>
                  setFilters({ ...filters, category: val })
                }
              />
            </div>

            <div className="min-w-[150px]">
              <label className="block text-xs text-gray-500 mb-1">
                Estado
              </label>
              <Select
                options={statusOptions.map((s) => ({
                  label: s,
                  value: s,
                }))}
                value={filters.status}
                onChange={(val) => setFilters({ ...filters, status: val })}
              />
            </div>

            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm text-gray-500"
            >
              Limpiar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button variant="outline" onClick={bulkReorder}>
                {filters.businessMode === "B2B"
                  ? `Sugerir Compras Mayoristas (${selectedIds.length})`
                  : `Sugerir Reorden (${selectedIds.length})`}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsBulkUploadModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" /> Importar
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
            <Button variant="default" onClick={createProduct}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Producto
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de inventario */}
      <InventoryTable
        products={filtered}
        selectedProducts={selectedIds}
        onSelectProduct={selectOne}
        onSelectAll={() => selectAll(visibleIds)}
        onChangeStock={changeStockInline}
        onViewProduct={viewProduct}
        onEditProduct={editProduct}
        onDeleteProduct={deleteProduct}
        businessMode={filters.businessMode}
        // 🔗 PUENTE Inventario → Catálogo B2B
        onPublishToB2BCatalog={publishToB2BCatalog}
      />

      {/* Modales */}
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onUploadComplete={(items) => {
          if (Array.isArray(items) && items.length)
            setProducts((prev) => [...items, ...prev]);
        }}
      />

      <ProductModal
        isOpen={productModal.isOpen}
        product={productModal.product}
        mode={productModal.mode}
        onClose={() =>
          setProductModal({ isOpen: false, product: null, mode: "view" })
        }
        onSave={saveProduct}
        onRequestEdit={() =>
          setProductModal((m) => ({ ...m, mode: "edit" }))
        }
        onRequestHistory={() =>
          setHistoryModal({ isOpen: true, item: productModal.product })
        }
      />

      <MovementHistoryModal
        isOpen={historyModal.isOpen}
        item={historyModal.item}
        onClose={() => setHistoryModal({ isOpen: false, item: null })}
      />

      {/* Panel de acciones masivas */}
      <BulkActionsPanel
        isVisible={isBulkPanelOpen}
        selectedCount={selectedIds.length}
        onClose={() => setSelectedIds([])}
        onAction={handleBulkAction}
        categoryOptions={categoryOptionsForBulk}
      />
    </div>
  );
}
