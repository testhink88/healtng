// src/features/provider/pages/ProviderCatalogInventory/index.jsx
import React, { useEffect, useMemo, useState } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getBusinessContext } from "@/utils/mockData";

// --- helper para elegir la llave de storage ---
const getCatalogStorageKey = () => {
  const ctx = getBusinessContext?.() || {};
  const businessType = ctx.businessType || "provider";
  return `mock:catalog:${businessType}`;
};

// ------------ pequeños componentes UI ------------

const StatusChip = ({ status }) => {
  if (!status || status === "good") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
        Saludable
      </span>
    );
  }
  if (status === "low") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-100">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" />
        Bajo
      </span>
    );
  }
  if (status === "critical") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-red-50 text-red-700 border border-red-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1" />
        Crítico
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground border border-border">
      {status}
    </span>
  );
};

const CategoryNavigation = ({
  selectedCategory,
  onCategoryChange,
  productType,
  onProductTypeChange,
  inventoryStatus,
  onInventoryStatusChange,
}) => {
  const categories = [
    { id: "all", label: "Todas las categorías" },
    { id: "medications", label: "Medicamentos" },
    { id: "medical-supplies", label: "Suministros" },
    { id: "medical-equipment", label: "Equipos" },
    { id: "diagnostics", label: "Diagnóstico" },
    { id: "services", label: "Servicios" },
  ];

  const typeFilters = [
    { id: "all", label: "Todos" },
    { id: "product", label: "Productos" },
    { id: "service", label: "Servicios" },
  ];

  const inventoryFilters = [
    { id: "all", label: "Todos" },
    { id: "critical", label: "Crítico" },
    { id: "low", label: "Bajo" },
    { id: "good", label: "Saludable" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Categorías</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Tipo</h3>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((t) => (
            <button
              key={t.id}
              onClick={() => onProductTypeChange(t.id)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                productType === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Estado de inventario</h3>
        <div className="flex flex-wrap gap-2">
          {inventoryFilters.map((s) => (
            <button
              key={s.id}
              onClick={() => onInventoryStatusChange(s.id)}
              className={`px-3 py-1 rounded-full text-xs border transition ${
                inventoryStatus === s.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchFilterToolbar = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  selectedCount,
  totalCount,
  onSelectAll,
}) => (
  <div className="bg-card border rounded-lg p-4 mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Icon
          name="Search"
          className="h-4 w-4 text-muted-foreground absolute left-2 top-2.5"
        />
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, descripción o SKU..."
          className="pl-8 w-64"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {selectedCount > 0 ? (
          <>
            <span className="font-semibold">{selectedCount}</span> ítems
            seleccionados de {totalCount}
          </>
        ) : (
          <>
            <span className="font-semibold">{totalCount}</span> ítems en este
            catálogo
          </>
        )}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3 justify-end">
      <div className="flex items-center gap-1 bg-muted rounded-full p-1 text-xs">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            viewMode === "grid"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Icon name="LayoutGrid" className="h-3 w-3" />
          Grid
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            viewMode === "list"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Icon name="Rows" className="h-3 w-3" />
          Lista
        </button>
        <button
          onClick={() => onViewModeChange("service")}
          className={`px-3 py-1 rounded-full flex items-center gap-1 ${
            viewMode === "service"
              ? "bg-background shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          <Icon name="Stethoscope" className="h-3 w-3" />
          Servicios
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="border rounded-md px-2 py-1 bg-background"
        >
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
          <option value="stock">Stock</option>
          <option value="status">Estado</option>
        </select>
        <button
          onClick={() =>
            onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
          }
          className="p-1 rounded-md border bg-background"
        >
          <Icon
            name={sortOrder === "asc" ? "ArrowDown01" : "ArrowUp10"}
            className="h-3 w-3"
          />
        </button>
      </div>

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          onChange={(e) => onSelectAll(e.target.checked)}
        />
        Seleccionar todos
      </label>
    </div>
  </div>
);

const BulkActionPanel = ({ selectedCount, onBulkAction, onClearSelection }) => {
  if (!selectedCount) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <Icon name="Info" className="h-4 w-4" />
        <span className="text-sm">
          {selectedCount} ítems seleccionados. Aplica una acción masiva.
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Button size="sm" variant="outline" onClick={() => onBulkAction("publish")}>
          Publicar
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBulkAction("unpublish")}>
          Ocultar
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBulkAction("mark-b2b")}>
          Marcar B2B
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBulkAction("mark-b2c")}>
          Marcar B2C
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="text-xs"
        >
          Limpiar selección
        </Button>
      </div>
    </div>
  );
};

const InventoryStatsPanel = ({ products }) => {
  const stats = useMemo(() => {
    if (!Array.isArray(products) || !products.length) {
      return { totalItems: 0, totalStock: 0, lowStock: 0, criticalStock: 0 };
    }
    let totalStock = 0;
    let lowStock = 0;
    let criticalStock = 0;
    products.forEach((p) => {
      const stock = Number(p.stock || 0);
      totalStock += stock;
      const min = Number(p.minStock || 0);
      if (min > 0) {
        if (stock === 0 || stock < min / 2) criticalStock += 1;
        else if (stock < min) lowStock += 1;
      }
    });
    return { totalItems: products.length, totalStock, lowStock, criticalStock };
  }, [products]);

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3 text-xs">
      <h3 className="text-sm font-semibold">Resumen de Inventario</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-muted-foreground">Ítems activos</p>
          <p className="font-semibold">{stats.totalItems}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stock total</p>
          <p className="font-semibold">{stats.totalStock}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stock bajo</p>
          <p className="font-semibold text-amber-600">{stats.lowStock}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Crítico / agotado</p>
          <p className="font-semibold text-red-600">
            {stats.criticalStock}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({
  products,
  viewMode,
  selectedProducts,
  onProductSelect,
  onProductEdit,
  loading,
}) => {
  const isSelected = (id) => selectedProducts.includes(id);

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
        Cargando catálogo...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
        No hay productos o servicios en este catálogo todavía.
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="py-2 px-3 text-left w-8" />
              <th className="py-2 px-3 text-left">Nombre</th>
              <th className="py-2 px-3 text-left hidden md:table-cell">
                Categoría
              </th>
              <th className="py-2 px-3 text-right">Precio</th>
              <th className="py-2 px-3 text-right hidden md:table-cell">
                Stock
              </th>
              <th className="py-2 px-3 text-left hidden lg:table-cell">
                Estado
              </th>
              <th className="py-2 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-muted/40 transition-colors"
              >
                <td className="py-2 px-3">
                  <input
                    type="checkbox"
                    checked={isSelected(p.id)}
                    onChange={(e) =>
                      onProductSelect(p.id, e.target.checked)
                    }
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    {p.sku && (
                      <span className="text-xs text-muted-foreground">
                        SKU: {p.sku}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell">
                  {p.category || "-"}
                </td>
                <td className="py-2 px-3 text-right whitespace-nowrap">
                  {p.price ? `$${Number(p.price).toFixed(2)}` : "-"}
                </td>
                <td className="py-2 px-3 text-right hidden md:table-cell">
                  {p.type === "service" ? "-" : p.stock ?? 0}
                </td>
                <td className="py-2 px-3 hidden lg:table-cell">
                  <StatusChip status={p.status} />
                </td>
                <td className="py-2 px-3 text-right">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => onProductEdit(p)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-card border rounded-lg p-4 flex flex-col justify-between"
        >
          <div className="flex items-start gap-3 mb-3">
            <input
              type="checkbox"
              checked={isSelected(p.id)}
              onChange={(e) =>
                onProductSelect(p.id, e.target.checked)
              }
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold leading-snug">
                    {p.name}
                  </p>
                  {p.sku && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      SKU: {p.sku}
                    </p>
                  )}
                </div>
                <StatusChip status={p.status} />
              </div>
              {p.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {p.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-primary">
                {p.price ? `$${Number(p.price).toFixed(2)}` : "-"}{" "}
                {p.unit && (
                  <span className="text-muted-foreground">/ {p.unit}</span>
                )}
              </p>
              {p.type !== "service" && (
                <p className="text-muted-foreground">
                  Stock:{" "}
                  <span
                    className={
                      p.stock === 0
                        ? "text-red-600"
                        : p.status === "critical"
                        ? "text-red-600"
                        : p.status === "low"
                        ? "text-amber-600"
                        : ""
                    }
                  >
                    {p.stock ?? 0}
                  </span>
                </p>
              )}
            </div>
            <Button
              size="xs"
              variant="outline"
              onClick={() => onProductEdit(p)}
            >
              Editar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(
    product || {
      name: "",
      description: "",
      category: "medications",
      type: "product",
      unit: "unidad",
      price: "",
      stock: 0,
      minStock: 0,
      status: "good",
      sku: "",
    }
  );

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      minStock: Number(form.minStock || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">
            {isEdit ? "Editar ítem" : "Agregar producto / servicio"}
          </h3>
          <button type="button" onClick={onClose}>
            <Icon name="X" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium mb-1">Nombre</label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Categoría
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
                className="w-full border rounded-md px-2 py-1 text-xs bg-background"
              >
                <option value="medications">Medicamentos</option>
                <option value="medical-supplies">Suministros</option>
                <option value="medical-equipment">Equipos</option>
                <option value="diagnostics">Diagnóstico</option>
                <option value="services">Servicios</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full border rounded-md px-2 py-1 text-xs bg-background"
              >
                <option value="product">Producto</option>
                <option value="service">Servicio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Precio (USD)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            {form.type === "product" && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Stock
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      handleChange("stock", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Stock mínimo
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={form.minStock}
                    onChange={(e) =>
                      handleChange("minStock", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">SKU</label>
            <Input
              value={form.sku || ""}
              onChange={(e) => handleChange("sku", e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Descripción
            </label>
            <textarea
              className="w-full border rounded-md px-2 py-1 text-xs bg-background resize-none"
              rows={3}
              value={form.description || ""}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              {isEdit ? "Guardar cambios" : "Guardar ítem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StockRulesPanel = () => (
  <div className="bg-card border rounded-lg p-4 mt-6 text-xs space-y-2">
    <h3 className="text-sm font-semibold flex items-center gap-2">
      <Icon name="SlidersHorizontal" className="h-4 w-4" />
      Reglas básicas de stock
    </h3>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      <li>Configura stock mínimo para recibir alertas internas.</li>
      <li>Marca productos críticos para priorizar reposición.</li>
      <li>Usa B2B/B2C para decidir en qué canal se ofrece cada ítem.</li>
    </ul>
  </div>
);

const ServiceCatalogSection = ({ services, onServiceEdit }) => {
  if (!services.length) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
        No tienes servicios configurados aún.
      </div>
    );
  }
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      {services.map((s) => (
        <div
          key={s.id}
          className="flex items-start justify-between gap-3 border-b last:border-b-0 pb-3 last:pb-0"
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{s.name}</p>
            {s.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {s.description}
              </p>
            )}
            <p className="text-xs text-primary mt-1">
              ${Number(s.price || 0).toFixed(2)}{" "}
              {s.duration && (
                <span className="text-muted-foreground">
                  • {s.duration} min
                </span>
              )}
            </p>
          </div>
          <Button
            size="xs"
            variant="outline"
            onClick={() => onServiceEdit(s)}
          >
            Editar
          </Button>
        </div>
      ))}
    </div>
  );
};

// ------------ COMPONENTE PRINCIPAL ------------

const ProviderCatalogInventoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [inventoryStatus, setInventoryStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const catalogKey = useMemo(() => getCatalogStorageKey(), []);

  useEffect(() => {
    setLoading(true);
    try {
      const stored = window.localStorage.getItem(catalogKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProducts(Array.isArray(parsed) ? parsed : []);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [catalogKey]);

  const persistCatalog = (next) => {
    setProducts(next);
    window.localStorage.setItem(catalogKey, JSON.stringify(next));
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const name = (product.name || "").toLowerCase();
        const desc = (product.description || "").toLowerCase();
        const sku = (product.sku || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch =
          !search ||
          name.includes(search) ||
          desc.includes(search) ||
          sku.includes(search);

        const matchesCategory =
          selectedCategory === "all" ||
          (product.category || "").toLowerCase() === selectedCategory;

        const type = product.type || "product";
        const matchesType =
          productType === "all" ||
          (productType === "service" ? type === "service" : type === "product");

        const status = product.status || "good";
        const matchesStatus =
          inventoryStatus === "all" || status === inventoryStatus;

        return matchesSearch && matchesCategory && matchesType && matchesStatus;
      }),
    [products, searchTerm, selectedCategory, productType, inventoryStatus]
  );

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    list.sort((a, b) => {
      let aValue;
      let bValue;
      switch (sortBy) {
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "price":
          aValue = Number(a.price || 0);
          bValue = Number(b.price || 0);
          break;
        case "stock":
          aValue = Number(a.stock || 0);
          bValue = Number(b.stock || 0);
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          return 0;
      }
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
    return list;
  }, [filteredProducts, sortBy, sortOrder]);

  const handleProductSelect = (productId, checked) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(sortedProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleProductSave = (productData) => {
    let next;
    if (editingProduct) {
      next = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...productData } : p
      );
    } else {
      const maxId = products.reduce(
        (max, p) => (p.id && p.id > max ? p.id : max),
        0
      );
      const newProduct = {
        ...productData,
        id: maxId + 1 || Date.now(),
        published: true,
      };
      next = [...products, newProduct];
    }
    persistCatalog(next);
    setEditingProduct(null);
    setIsProductModalOpen(false);
  };

  const handleBulkAction = (action) => {
    if (!selectedProducts.length) return;
    const ids = new Set(selectedProducts);
    const next = products.map((p) => {
      if (!ids.has(p.id)) return p;
      switch (action) {
        case "publish":
          return { ...p, published: true };
        case "unpublish":
          return { ...p, published: false };
        case "mark-b2b":
          return { ...p, b2b: true };
        case "mark-b2c":
          return { ...p, b2c: true };
        default:
          return p;
      }
    });
    persistCatalog(next);
    setSelectedProducts([]);
  };

  const servicesOnly = sortedProducts.filter((p) => p.type === "service");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Catálogo e Inventario
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Administra tus productos y servicios publicados en Healtng, controla
            el stock y define tus canales B2B/B2C desde un solo lugar.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
        >
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Agregar ítem
        </Button>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-3">
          <CategoryNavigation
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            productType={productType}
            onProductTypeChange={setProductType}
            inventoryStatus={inventoryStatus}
            onInventoryStatusChange={setInventoryStatus}
          />
          <div className="mt-6">
            <InventoryStatsPanel products={products} />
          </div>
        </div>

        <div className="xl:col-span-9">
          <SearchFilterToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            selectedCount={selectedProducts.length}
            totalCount={sortedProducts.length}
            onSelectAll={handleSelectAll}
          />

          <BulkActionPanel
            selectedCount={selectedProducts.length}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedProducts([])}
          />

          {viewMode === "service" ? (
            <ServiceCatalogSection
              services={servicesOnly}
              onServiceEdit={handleProductEdit}
            />
          ) : (
            <ProductGrid
              products={sortedProducts}
              viewMode={viewMode}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
              onProductEdit={handleProductEdit}
              loading={loading}
            />
          )}

          <StockRulesPanel />
        </div>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleProductSave}
      />
    </div>
  );
};

export default ProviderCatalogInventoryPage;
