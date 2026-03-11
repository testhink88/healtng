import React, { useEffect, useMemo, useState } from "react";
import { Upload, Download, Plus, Search, RefreshCw } from "lucide-react"; 
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
import { getProducts, globalSync } from "../utils/inventorySync";
import { supabase } from "@/lib/supabase";

// -----------------------------------------------------------------------------
// KEYS DE ALMACENAMIENTO (Se mantienen los de perfil, pero inventario pasa a Supabase)
// -----------------------------------------------------------------------------
const B2B_CATALOG_STORAGE_KEY = "healtng_provider_b2b_catalog_v1";
const PROFILE_KEY = "providerProfile";

// -----------------------------------------------------------------------------
// MOCK DATA COMPLETA (Para inicializar Supabase si está vacío)
// -----------------------------------------------------------------------------
const initialProducts = [
  {
    sku: "HC20241201001",
    name: "Amoxicilina 250mg",
    category: "Medicamentos",
    subcategory: "Antibióticos",
    stock_actual: 75,
    stock_minimal: 30,
    unit_price: 0.45,
    unit_price_wholesale: 0.38,
    moq: 50,
    unit: "unidades",
    status: "Activo",
    location: "A-2-1",
    description: "Antibiótico de amplio espectro",
    supplier: "Farmacéutica Internacional",
  },
  {
    sku: "HC20241201002",
    name: "Desinfectante Hospitalario",
    category: "Limpieza y desinfección",
    subcategory: "Desinfectantes",
    stock_actual: 30,
    stock_minimal: 15,
    unit_price: 8.5,
    unit_price_wholesale: 7.2,
    moq: 6,
    unit: "litros",
    status: "Activo",
    location: "E-1-1",
  },
  {
    sku: "HC20241201003",
    name: "Gasas Estériles 10×10cm",
    category: "Material Médico",
    subcategory: "Gasas",
    stock_actual: 0,
    stock_minimal: 200,
    unit_price: 0.08,
    unit_price_wholesale: 0.07,
    moq: 200,
    unit: "unidades",
    status: "Inactivo",
    location: "C-1-2",
  }
];

const normalizeMode = (m) => {
  const x = String(m || "").toLowerCase();
  if (x === "b2b") return "B2B";
  if (x === "b2c") return "B2C";
  if (x === "mixto" || x === "mixed") return "Mixto";
  return "Mixto";
};

export default function ProviderInventory() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial desde Supabase
  const loadData = async () => {
    setLoading(true);
    let data = await getProducts();
    
    // Si no hay productos, sembrar mock inicial
    if (data.length === 0) {
      const { error } = await supabase.from("products").insert(initialProducts);
      if (!error) data = await getProducts();
    }
    
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const [b2bCatalog, setB2bCatalog] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) setB2bCatalog(JSON.parse(raw));
    } catch (err) {
      console.error("Error leyendo catálogo B2B:", err);
    }
  }, []);

  const [needsSupplies, setNeedsSupplies] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "Todas las categorías",
    stockStatus: "Todos los estados",
    status: "Todos",
    businessMode: "Mixto",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.mode) setFilters((f) => ({ ...f, businessMode: normalizeMode(saved.mode) }));
        if (typeof saved?.needsSupplies === "boolean") setNeedsSupplies(!!saved.needsSupplies);
      }
    } catch {}
  }, []);

  const [selectedIds, setSelectedIds] = useState([]);
  const selectOne = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const selectAll = (ids) => setSelectedIds((prev) => (prev.length === ids.length ? [] : [...ids]));

  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [productModal, setProductModal] = useState({ isOpen: false, product: null, mode: "view" });
  const [historyModal, setHistoryModal] = useState({ isOpen: false, item: null });
  const [isBulkPanelOpen, setIsBulkPanelOpen] = useState(false);

  useEffect(() => setIsBulkPanelOpen(selectedIds.length > 0), [selectedIds]);

  // Normalizar datos para los componentes UI que esperan camelCase
  const normalized = useMemo(() => products.map((p) => ({
    ...p,
    stock: p.stock_actual,
    reorderPoint: p.stock_minimal,
    unitPrice: p.unit_price,
    unitPriceWholesale: p.unit_price_wholesale,
    on_hand: Number(p.stock_actual ?? 0),
    reserved: Number(p.reserved ?? 0),
    reorder_point: Number(p.stock_minimal ?? 0),
    invStatus: deriveStockStatus({ 
      on_hand: Number(p.stock_actual ?? 0), 
      reserved: Number(p.reserved ?? 0), 
      reorder_point: Number(p.stock_minimal ?? 0) 
    })
  })), [products]);

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

  const categories = useMemo(() => {
    const s = new Set(["Todas las categorías"]);
    normalized.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [normalized]);

  const viewProduct = (product) => setProductModal({ isOpen: true, product, mode: "view" });
  const editProduct = (product) => setProductModal({ isOpen: true, product, mode: "edit" });
  const createProduct = () => setProductModal({ isOpen: true, product: null, mode: "create" });

  const saveProduct = async (data) => {
    const dbData = {
      name: data.name,
      sku: data.sku,
      category: data.category,
      subcategory: data.subcategory,
      stock_actual: Number(data.stock || 0),
      stock_minimal: Number(data.reorderPoint || 0),
      unit_price: Number(data.unitPrice || 0),
      unit_price_wholesale: Number(data.unitPriceWholesale || 0),
      moq: Number(data.moq || 1),
      unit: data.unit,
      status: data.status,
      location: data.location,
      description: data.description,
      supplier: data.supplier
    };

    if (productModal.mode === "create") {
      const { error } = await supabase.from("products").insert(dbData);
      if (error) alert("Error al crear producto");
    } else if (productModal.mode === "edit" && productModal.product) {
      const { error } = await supabase.from("products").update(dbData).eq("id", productModal.product.id);
      if (error) alert("Error al editar producto");
    }
    
    setProductModal({ isOpen: false, product: null, mode: "view" });
    loadData();
  };

  const deleteProduct = async (product) => {
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    await supabase.from("products").delete().eq("id", product.id);
    loadData();
    setSelectedIds((prev) => prev.filter((id) => id !== product.id));
  };

  const changeStockInline = async (id, value) => {
    await supabase.from("products").update({ stock_actual: Number(value || 0) }).eq("id", id);
    loadData();
  };

  const handleResetDemo = async () => {
      if(confirm("Esto borrará los datos en Supabase y restaurará el inventario inicial. ¿Continuar?")) {
          setLoading(true);
          await supabase.from("lots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          await supabase.from("products").insert(initialProducts);
          await loadData();
      }
  };

  const exportCSV = () => {
    const isMix = filters.businessMode === "Mixto";
    const headers = ["SKU", "Producto", "Categoría", "Stock", "Nivel mínimo", "Estado"];
    const rows = filtered.map((p) => [p.sku || "", p.name, p.category || "", p.on_hand ?? 0, p.reorder_point ?? 0, p.status || "Activo"]);
    const csv = headers.join(",") + "\n" + rows.map((r) => r.map((x) => `"${x ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario_supabase_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryOptionsForBulk = useMemo(() => categories.filter((c) => c !== "Todas las categorías").map((c) => ({ label: c, value: c })), [categories]);

  const handleBulkAction = async (actionId) => {
    if (actionId === "activate" || actionId === "deactivate") {
        const newStatus = actionId === "activate" ? "Activo" : "Inactivo";
        await supabase.from("products").update({ status: newStatus }).in("id", selectedIds);
        loadData();
    }
    if (actionId === "export") exportCSV();
    setSelectedIds([]);
  };

  const visibleIds = filtered.map((p) => p.id);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Gestión de Inventario" }]} />
      <div className="flex justify-between items-end mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Gestión de Inventario</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Sincronizando con Supabase..." : "Datos sincronizados con la nube."}
          </p>
        </div>
        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={handleResetDemo}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Resetear Todo (DB)
        </Button>
      </div>

      <div className="mb-4">
        <BusinessProfileSelector valueMode={filters.businessMode} valueNeedsSupplies={needsSupplies} onChangeMode={(m) => setFilters((f) => ({ ...f, businessMode: m }))} onChangeNeedsSupplies={setNeedsSupplies} persistKey={PROFILE_KEY} />
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex-1 w-full">
                <Input placeholder="Buscar por nombre o SKU..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} icon="Search" />
            </div>
            <div className="flex items-center gap-2">
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

      {loading ? (
        <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-50">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-gray-500">Cargando inventario desde Supabase...</p>
          </div>
        </div>
      ) : (
        <InventoryTable products={filtered} selectedProducts={selectedIds} onSelectProduct={selectOne} onSelectAll={() => selectAll(visibleIds)} onChangeStock={changeStockInline} onViewProduct={viewProduct} onEditProduct={editProduct} onDeleteProduct={deleteProduct} businessMode={filters.businessMode} />
      )}

      <BulkUploadModal isOpen={isBulkUploadModalOpen} onClose={() => setIsBulkUploadModalOpen(false)} onUploadComplete={loadData} />
      <ProductModal isOpen={productModal.isOpen} product={productModal.product} mode={productModal.mode} onClose={() => setProductModal({ isOpen: false, product: null, mode: "view" })} onSave={saveProduct} onRequestEdit={() => setProductModal((m) => ({ ...m, mode: "edit" }))} onRequestHistory={() => setHistoryModal({ isOpen: true, item: productModal.product })} />
      <MovementHistoryModal isOpen={historyModal.isOpen} item={historyModal.item} onClose={() => setHistoryModal({ isOpen: false, item: null })} />
      <BulkActionsPanel isVisible={isBulkPanelOpen} selectedCount={selectedIds.length} onClose={() => setSelectedIds([])} onAction={handleBulkAction} categoryOptions={categoryOptionsForBulk} />
    </div>
  );
}