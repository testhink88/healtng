import React, { useEffect, useMemo, useState } from "react";
import { Upload, Download, Plus, Search, RefreshCw } from "lucide-react"; // Icono RefreshCw nuevo
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

// -----------------------------------------------------------------------------
// KEYS DE ALMACENAMIENTO
// -----------------------------------------------------------------------------
const INVENTORY_STORAGE_KEY = "healtng_provider_inventory_v1";
const B2B_CATALOG_STORAGE_KEY = "healtng_provider_b2b_catalog_v1";
const PROFILE_KEY = "provider.profile";

// -----------------------------------------------------------------------------
// MOCK DATA COMPLETA (8 Productos)
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

const normalizeMode = (m) => {
  const x = String(m || "").toLowerCase();
  if (x === "b2b") return "B2B";
  if (x === "b2c") return "B2C";
  if (x === "mixto" || x === "mixed") return "Mixto";
  return "Mixto";
};

// -----------------------------------------------------------------------------
// MAPPER: Inventario -> Catálogo
// -----------------------------------------------------------------------------
const mapInventoryProductToCatalogItem = (product) => {
  if (!product) return null;

  return {
    id: product.id,
    source: "inventory",
    sourceId: product.id,
    code: product.sku || `SKU-${product.id}`,
    name: product.name,
    description: product.description || "Descripción pendiente...",
    category: product.category || "General",
    subcategory: product.subcategory || "",
    type: "product",
    price:
      typeof product.unitPriceWholesale === "number"
        ? product.unitPriceWholesale
        : typeof product.unitPrice === "number"
        ? product.unitPrice
        : 0,
    stock: typeof product.stock === "number" ? product.stock : 0,
    minStock:
      typeof product.reorderPoint === "number" ? product.reorderPoint : 0,
    unit: product.unit || "unidades",
    moq: typeof product.moq === "number" ? product.moq : 1,
    supplier: product.supplier || "",
    targetAudience: "b2b",
    status: "draft", 
    publishedAt: null,
  };
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function ProviderInventory() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Cargar Inventario con Persistencia
  const [products, setProducts] = useState(() => {
      const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialProducts;
  });

  // Persistir cambios en inventario
  useEffect(() => {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // 2. Lógica de Catálogo B2B
  const [b2bCatalog, setB2bCatalog] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) setB2bCatalog(JSON.parse(raw));
    } catch (err) {
      console.error("Error leyendo catálogo B2B:", err);
    }
  }, []);

  const publishToB2BCatalog = (product) => {
    if (!product) return;

    const currentCatalogRaw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
    const currentCatalog = currentCatalogRaw ? JSON.parse(currentCatalogRaw) : [];

    const alreadyExists = currentCatalog.some(
        (item) => item.sourceId === product.id || item.id === product.id
    );

    if (alreadyExists) {
        if(confirm(`"${product.name}" ya existe en el catálogo.\n¿Quieres ir al Catálogo para editarlo?`)) {
            navigate("/provider/b2b/catalog");
        }
        return;
    }

    const newItem = mapInventoryProductToCatalogItem(product);
    const updatedCatalog = [newItem, ...currentCatalog];

    localStorage.setItem(B2B_CATALOG_STORAGE_KEY, JSON.stringify(updatedCatalog));
    setB2bCatalog(updatedCatalog);

    if(confirm(`✅ "${product.name}" enviado como BORRADOR.\n¿Quieres ir al Catálogo B2B para activarlo ahora?`)) {
        navigate("/provider/b2b/catalog");
    }
  };

  // ======= Perfil Comercial =======
  const [needsSupplies, setNeedsSupplies] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "Todas las categorías",
    stockStatus: "Todos los estados",
    status: "Todos",
    businessMode: "Mixto",
  });

  // Cargar perfil
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.mode) setFilters((f) => ({ ...f, businessMode: normalizeMode(saved.mode) }));
        if (typeof saved?.needsSupplies === "boolean") setNeedsSupplies(!!saved.needsSupplies);
      }
    } catch {}

    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    if (modeParam) {
      setFilters((f) => ({ ...f, businessMode: normalizeMode(modeParam) }));
    }
  }, []);

  // Sincronizar URL y Storage de Perfil
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const current = normalizeMode(params.get("mode"));
    if (current !== filters.businessMode) {
      params.set("mode", filters.businessMode);
      navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ mode: filters.businessMode, needsSupplies }));
  }, [filters.businessMode, needsSupplies, location.pathname, location.search, navigate]);

  // ======= Selección =======
  const [selectedIds, setSelectedIds] = useState([]);
  const selectOne = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectAll = (ids) => setSelectedIds((prev) => (prev.length === ids.length ? [] : [...ids]));

  // ======= Modales =======
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [productModal, setProductModal] = useState({ isOpen: false, product: null, mode: "view" });
  const [historyModal, setHistoryModal] = useState({ isOpen: false, item: null });
  const [isBulkPanelOpen, setIsBulkPanelOpen] = useState(false);

  useEffect(() => setIsBulkPanelOpen(selectedIds.length > 0), [selectedIds]);

  // ======= Normalización =======
  const normalized = useMemo(() => products.map((p) => {
    const on_hand = Number(p.stock ?? 0);
    const reserved = Number(p.reserved ?? 0);
    const reorder_point = Number(p.reorderPoint ?? 0);
    const invStatus = deriveStockStatus({ on_hand, reserved, reorder_point });
    return { ...p, on_hand, reserved, reorder_point, invStatus };
  }), [products]);

  // ======= Filtrado =======
  const filtered = useMemo(() => {
    const q = (filters.search || "").toLowerCase();
    return normalized.filter((p) => {
      const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      const matchCat = filters.category === "Todas las categorías" || p.category === filters.category;
      const matchStatus = filters.status === "Todos" || p.status === filters.status;
      const matchStock = filters.stockStatus === "Todos los estados" ||
        (filters.stockStatus === "En Stock" && p.invStatus === STOCK_STATUS.OK) ||
        (filters.stockStatus === "Bajo Stock" && p.invStatus === STOCK_STATUS.LOW) ||
        (filters.stockStatus === "Sin Stock" && p.invStatus === STOCK_STATUS.OUT);
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

  const clearFilters = () => setFilters({
    search: "", category: "Todas las categorías", stockStatus: "Todos los estados", status: "Todos", businessMode: "Mixto",
  });

  // ======= CRUD =======
  const viewProduct = (product) => setProductModal({ isOpen: true, product, mode: "view" });
  const editProduct = (product) => setProductModal({ isOpen: true, product, mode: "edit" });
  const createProduct = () => setProductModal({ isOpen: true, product: null, mode: "create" });

  const saveProduct = (data) => {
    if (productModal.mode === "create") {
      setProducts((prev) => [{ id: Date.now(), ...data }, ...prev]);
    } else if (productModal.mode === "edit" && productModal.product) {
      setProducts((prev) => prev.map((p) => p.id === productModal.product.id ? { ...p, ...data } : p));
    }
    setProductModal({ isOpen: false, product: null, mode: "view" });
  };

  const deleteProduct = (product) => {
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setSelectedIds((prev) => prev.filter((id) => id !== product.id));
  };

  const changeStockInline = (id, value) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Number(value || 0) } : p)));

  // ======= CSV EXPORT =======
  const exportCSV = () => {
    const isB2B = filters.businessMode === "B2B";
    const isB2C = filters.businessMode === "B2C";
    const isMix = filters.businessMode === "Mixto";

    const headers = [
      "SKU", "Producto", "Categoría", "Stock", "Nivel mínimo",
      ...(isB2C || isMix ? ["Precio Unitario (USD)"] : []),
      ...(isB2B || isMix ? ["Precio Mayorista (USD)", "MOQ"] : []),
      "Estado", "Modo", "Compras",
    ];

    const rows = filtered.map((p) => {
      const wholesale = Number(p.unitPriceWholesale ?? (p.unitPrice != null ? p.unitPrice * 0.85 : 0));
      const moq = Number(p.moq ?? 10);
      const base = [p.sku || "", p.name, p.category || "", p.on_hand ?? 0, p.reorder_point ?? 0];
      const b2cCols = isB2C || isMix ? [Number(p.unitPrice ?? 0)] : [];
      const b2bCols = isB2B || isMix ? [wholesale, moq] : [];
      const tail = [p.status || "Activo", filters.businessMode, needsSupplies ? "ON" : "OFF"];
      return [...base, ...b2cCols, ...b2bCols, ...tail];
    });

    const csv = headers.join(",") + "\n" + rows.map((r) => r.map((x) => `"${x ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_${filters.businessMode.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ======= Reset Data (FIX) =======
  const handleResetDemo = () => {
      if(confirm("Esto borrará los cambios locales y restaurará los 8 productos originales. ¿Continuar?")) {
          localStorage.removeItem(INVENTORY_STORAGE_KEY);
          window.location.reload();
      }
  };

  // ======= Bulk Actions =======
  const categoryOptionsForBulk = useMemo(() => categories.filter((c) => c !== "Todas las categorías").map((c) => ({ label: c, value: c })), [categories]);

  const handleBulkAction = async (actionId, payload) => {
    if (actionId === "activate" || actionId === "deactivate") {
        const newStatus = actionId === "activate" ? "Activo" : "Inactivo";
        setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p));
    }
    if (actionId === "export") exportCSV();
    setSelectedIds([]);
  };

  const visibleIds = filtered.map((p) => p.id);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Gestión de Inventario" }]} />
      <h1 className="text-2xl font-semibold mt-2 mb-1">Gestión de Inventario</h1>
      <p className="text-sm text-gray-500 mb-6">Administra tu stock y publica productos hacia tu catálogo B2B.</p>

      {/* Selector Perfil */}
      <div className="mb-4">
        <BusinessProfileSelector
          valueMode={filters.businessMode}
          valueNeedsSupplies={needsSupplies}
          onChangeMode={(m) => setFilters((f) => ({ ...f, businessMode: m }))}
          onChangeNeedsSupplies={setNeedsSupplies}
          persistKey={PROFILE_KEY}
        />
      </div>

      {/* Filtros */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1 w-full">
                <Input placeholder="Buscar por nombre o SKU..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} icon="Search" />
            </div>
            
            <div className="flex items-center gap-2">
                {/* BOTÓN RESET NUEVO */}
                <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleResetDemo}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Resetear Demo
                </Button>

                <Button variant="outline" onClick={() => setIsBulkUploadModalOpen(true)}>
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

      {/* Tabla */}
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
        onPublishToB2BCatalog={publishToB2BCatalog}
      />

      {/* Modales */}
      <BulkUploadModal isOpen={isBulkUploadModalOpen} onClose={() => setIsBulkUploadModalOpen(false)} onUploadComplete={(items) => setProducts((prev) => [...items, ...prev])} />
      <ProductModal isOpen={productModal.isOpen} product={productModal.product} mode={productModal.mode} onClose={() => setProductModal({ isOpen: false, product: null, mode: "view" })} onSave={saveProduct} onRequestEdit={() => setProductModal((m) => ({ ...m, mode: "edit" }))} onRequestHistory={() => setHistoryModal({ isOpen: true, item: productModal.product })} />
      <MovementHistoryModal isOpen={historyModal.isOpen} item={historyModal.item} onClose={() => setHistoryModal({ isOpen: false, item: null })} />
      <BulkActionsPanel isVisible={isBulkPanelOpen} selectedCount={selectedIds.length} onClose={() => setSelectedIds([])} onAction={handleBulkAction} categoryOptions={categoryOptionsForBulk} />
    </div>
  );
}