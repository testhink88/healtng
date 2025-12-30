import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

/* === Catálogos === */
const CATEGORY_OPTIONS = [
  { value: "Medicamentos", label: "Medicamentos" },
  { value: "Material Médico", label: "Material Médico" },
  { value: "Equipos", label: "Equipos" },
  { value: "Consumibles", label: "Consumibles" },
  { value: "Limpieza y Desinfección", label: "Limpieza y Desinfección" },
];

const SUBCATEGORY_BY_CATEGORY = {
  "Medicamentos": [
    { value: "Analgésicos", label: "Analgésicos" },
    { value: "Antibióticos", label: "Antibióticos" },
    { value: "Anti-inflamatorios", label: "Anti-inflamatorios" },
    { value: "Cardiovasculares", label: "Cardiovasculares" },
  ],
  "Material Médico": [
    { value: "Gasas", label: "Gasas" },
    { value: "Jeringas", label: "Jeringas" },
    { value: "Guantes", label: "Guantes" },
    { value: "Mascarillas", label: "Mascarillas" },
  ],
  "Equipos": [
    { value: "Diagnóstico", label: "Diagnóstico" },
    { value: "Monitoreo", label: "Monitoreo" },
    { value: "Terapia", label: "Terapia" },
    { value: "Esterilización", label: "Esterilización" },
  ],
  "Consumibles": [
    { value: "Alcohol", label: "Alcohol" },
    { value: "Soluciones", label: "Soluciones" },
    { value: "Agujas", label: "Agujas" },
  ],
  "Limpieza y Desinfección": [
    { value: "Desinfectantes", label: "Desinfectantes" },
    { value: "Detergentes", label: "Detergentes" },
    { value: "Esterilizantes", label: "Esterilizantes" },
  ],
};

const UNIT_OPTIONS = [
  { value: "Unidades", label: "Unidades" },
  { value: "Cajas", label: "Cajas" },
  { value: "Mililitros", label: "Mililitros" },
  { value: "Litros", label: "Litros" },
  { value: "Miligramos", label: "Miligramos" },
  { value: "Gramos", label: "Gramos" },
  { value: "Kilogramos", label: "Kilogramos" },
  { value: "Tabletas", label: "Tabletas" },
  { value: "Ampollas", label: "Ampollas" },
  { value: "Packs", label: "Packs" },
];

const STATUS_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
  { value: "Descontinuado", label: "Descontinuado" },
];

export default function ProductModal({
  isOpen,
  product,
  mode = "view", // 'view' | 'edit' | 'create'
  onClose,
  onSave,
  onRequestEdit,
  onRequestHistory,
}) {
  if (!isOpen) return null; // ✅ mantiene las reglas de hooks

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";
  const readOnly = isView;

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    subcategory: "",
    stock: 0,
    reorderPoint: 0,
    unitPrice: 0, // USD
    unit: "Unidades",
    status: "Activo",
    description: "",
    supplier: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const currentSubcats = SUBCATEGORY_BY_CATEGORY[form.category] || [];

  useEffect(() => {
    setErrors({});
    if (product && (isView || isEdit)) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        stock: Number(product.stock ?? 0),
        reorderPoint: Number(product.reorderPoint ?? 0),
        unitPrice: Number(product.unitPrice ?? 0),
        unit: product.unit || "Unidades",
        status: product.status || "Activo",
        description: product.description || "",
        supplier: product.supplier || "",
        location: product.location || "",
      });
    } else if (isCreate) {
      setForm({
        name: "",
        sku: "",
        category: "",
        subcategory: "",
        stock: 0,
        reorderPoint: 0,
        unitPrice: 0,
        unit: "Unidades",
        status: "Activo",
        description: "",
        supplier: "",
        location: "",
      });
    }
  }, [product, isView, isEdit, isCreate]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleCategoryChange = (val) => {
    set("category", val);
    set("subcategory", "");
  };

  const generateSKU = () => {
    const t = Date.now().toString().slice(-6);
    const r = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    set("sku", `HC${t}${r}`);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "El nombre del producto es obligatorio";
    if (!form.sku.trim()) e.sku = "El código/sku es obligatorio";
    if (!form.category) e.category = "La categoría es obligatoria";
    if (!form.subcategory) e.subcategory = "La subcategoría es obligatoria";
    if (form.stock < 0) e.stock = "El stock no puede ser negativo";
    if (form.reorderPoint < 0) e.reorderPoint = "El nivel mínimo no puede ser negativo";
    if (form.unitPrice <= 0) e.unitPrice = "El precio debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    if (readOnly) return;
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave?.({ ...form, unitPrice: Number(form.unitPrice || 0) });
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const stockState =
    form.stock === 0 ? "out" : form.stock <= form.reorderPoint ? "low" : "ok";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-lg border">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {isCreate ? "Agregar Nuevo Producto" : isEdit ? "Editar Producto" : "Detalles del Producto"}
            </h3>
            <p className="text-xs text-gray-500">
              {isCreate
                ? "Complete la información del nuevo producto"
                : isEdit
                ? "Modifique los datos del producto"
                : "Información detallada del producto"}
            </p>
          </div>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="p-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna 1: básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nombre del Producto *</label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} readOnly={readOnly} />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Código de Barras / SKU *</label>
                  <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} readOnly={readOnly} />
                  {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku}</p>}
                </div>
                {!readOnly && (
                  <div className="flex items-end">
                    <Button variant="outline" onClick={generateSKU}>Generar</Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Categoría *</label>
                  <Select
                    placeholder="Seleccionar opción"
                    options={CATEGORY_OPTIONS}
                    value={form.category}
                    onChange={handleCategoryChange}
                    disabled={readOnly}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Seleccione la categoría del producto</p>
                  {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subcategoría *</label>
                  <Select
                    placeholder="Seleccionar opción"
                    options={currentSubcats}
                    value={form.subcategory}
                    onChange={(v) => set("subcategory", v)}
                    disabled={readOnly || !form.category}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Seleccione la subcategoría específica</p>
                  {errors.subcategory && <p className="text-xs text-red-600 mt-1">{errors.subcategory}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                <Input value={form.description} onChange={(e) => set("description", e.target.value)} readOnly={readOnly} />
                <p className="text-[11px] text-gray-400 mt-1">Descripción detallada del producto</p>
              </div>
            </div>

            {/* Columna 2: stock y precio */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Stock Actual *</label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => set("stock", Number(e.target.value))}
                    readOnly={readOnly}
                    min="0"
                  />
                  {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nivel mínimo *</label>
                  <Input
                    type="number"
                    value={form.reorderPoint}
                    onChange={(e) => set("reorderPoint", Number(e.target.value))}
                    readOnly={readOnly}
                    min="0"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Cuando el stock ≤ este nivel, sugerimos comprar.</p>
                  {errors.reorderPoint && <p className="text-xs text-red-600 mt-1">{errors.reorderPoint}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Precio Unitario (USD) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.unitPrice}
                    onChange={(e) => set("unitPrice", Number(e.target.value))}
                    readOnly={readOnly}
                    min="0"
                  />
                  {errors.unitPrice && <p className="text-xs text-red-600 mt-1">{errors.unitPrice}</p>}
                  <p className="text-[11px] text-gray-400 mt-1">Valor: {usd.format((form.unitPrice || 0))}</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unidad de Medida *</label>
                  <Select
                    options={UNIT_OPTIONS}
                    value={form.unit}
                    onChange={(v) => set("unit", v)}
                    disabled={readOnly}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Unidad de medida para el inventario</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Proveedor</label>
                <Input value={form.supplier} onChange={(e) => set("supplier", e.target.value)} readOnly={readOnly} />
                <p className="text-[11px] text-gray-400 mt-1">Nombre del proveedor principal</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ubicación en Almacén</label>
                  <Input value={form.location} onChange={(e) => set("location", e.target.value)} readOnly={readOnly} />
                  <p className="text-[11px] text-gray-400 mt-1">Pasillo, estante, nivel, etc.</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Estado *</label>
                  <Select
                    options={STATUS_OPTIONS}
                    value={form.status}
                    onChange={(v) => set("status", v)}
                    disabled={readOnly}
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Estado actual del producto</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de stock */}
          <div className="mt-6 p-4 rounded-lg border bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {stockState === "out" ? (
                  <span className="text-sm font-medium text-red-600">Sin Stock</span>
                ) : stockState === "low" ? (
                  <span className="text-sm font-medium text-amber-600">Bajo Stock</span>
                ) : (
                  <span className="text-sm font-medium text-emerald-600">Stock Adecuado</span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Valor total: {usd.format((form.stock || 0) * (form.unitPrice || 0))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-gray-50 flex items-center justify-between">
          {!isCreate && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onRequestHistory}>Historial</Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              {isView ? "Cerrar" : "Cancelar"}
            </Button>
            {isView && <Button variant="default" onClick={onRequestEdit}>Editar</Button>}
            {(isEdit || isCreate) && (
              <Button variant="default" onClick={submit} disabled={saving}>
                {isCreate ? (saving ? "Creando..." : "Crear Producto") : (saving ? "Guardando..." : "Guardar Cambios")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
