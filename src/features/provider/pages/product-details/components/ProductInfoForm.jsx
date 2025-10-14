import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

export default function ProductInfoForm({ product, isEditing, onSave, onCancel }) {
  const [draft, setDraft] = useState(product || {});
  useEffect(() => setDraft(product || {}), [product]);

  const onChange = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Icon name="Info" size={16}/> Información del Producto
      </h3>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Field label="Nombre">{product?.name}</Field>
          <Field label="Código / SKU">{product?.id || product?.sku}</Field>
          <Field label="Categoría">{product?.category}</Field>
          <Field label="Subcategoría">{product?.subcategory || "—"}</Field>
          <Field label="Código de Barras">{product?.barcode || "—"}</Field>
          <Field label="Unidad de Medida">{product?.unitOfMeasure}</Field>
          <Field label="Precio Unitario">{`$ ${Number(product?.unitPrice || 0).toFixed(2)}`}</Field>
          <Field label="Precio Proveedor">{`$ ${Number(product?.supplierPrice || 0).toFixed(2)}`}</Field>
          <div className="md:col-span-2">
            <Field label="Descripción">{product?.description}</Field>
          </div>
        </div>
      ) : (
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave?.(draft);
          }}
        >
          <Input label="Nombre" value={draft?.name || ""} onChange={onChange("name")} />
          <Input label="Código / SKU" value={draft?.id || draft?.sku || ""} onChange={onChange("id")} />
          <Input label="Categoría" value={draft?.category || ""} onChange={onChange("category")} />
          <Input label="Subcategoría" value={draft?.subcategory || ""} onChange={onChange("subcategory")} />
          <Input label="Código de Barras" value={draft?.barcode || ""} onChange={onChange("barcode")} />
          <Input label="Unidad de Medida" value={draft?.unitOfMeasure || ""} onChange={onChange("unitOfMeasure")} />
          <Input type="number" step="0.01" label="Precio Unitario" value={draft?.unitPrice || 0} onChange={onChange("unitPrice")} />
          <Input type="number" step="0.01" label="Precio Proveedor" value={draft?.supplierPrice || 0} onChange={onChange("supplierPrice")} />
          <div className="md:col-span-2">
            <label className="block text-xs text-muted-foreground mb-1">Descripción</label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={3}
              value={draft?.description || ""}
              onChange={onChange("description")}
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-2 justify-end">
            <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-foreground">{children || "—"}</div>
    </div>
  );
}

function Input({ label, ...rest }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input {...rest} className="w-full border rounded-md px-3 py-2 text-sm" />
    </div>
  );
}
