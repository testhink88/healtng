// src/features/provider/components/lots/LotReceiveModal.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { X } from "lucide-react";

/**
 * Modal: Recibir Lote
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onSave: (lot) => void   // lot normalizado
 * - products: Array<{ productId, productName, sku, unit, category, subcategory, supplier? }>
 */
export default function LotReceiveModal({ isOpen, onClose, onSave, products = [] }) {
  const emptyForm = {
    productId: "",
    lotCode: "",
    qty: "",
    unit: "",
    mfgDate: "",
    expDate: "",
    supplier: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Para autocompletar datos del producto seleccionado
  const productMap = useMemo(
    () => Object.fromEntries(products.map((p) => [p.productId, p])),
    [products]
  );

  // Reset al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setForm(emptyForm);
      setErrors({});
      return;
    }
    // Evita scroll del body mientras el modal está abierto
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, form]); // eslint-disable-line react-hooks/exhaustive-deps

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = useCallback(() => {
    const e = {};
    if (!form.productId) e.productId = "Seleccione un producto.";
    if (!form.lotCode.trim()) e.lotCode = "Código de lote requerido.";
    if (!form.qty || Number(form.qty) <= 0) e.qty = "Cantidad debe ser > 0.";
    if (!form.mfgDate) e.mfgDate = "Fecha de fabricación requerida.";
    if (!form.expDate) e.expDate = "Fecha de vencimiento requerida.";
    if (form.mfgDate && form.expDate) {
      const mfg = new Date(form.mfgDate);
      const exp = new Date(form.expDate);
      if (exp < mfg) e.expDate = "El vencimiento no puede ser anterior a la fabricación.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSave = () => {
    if (!validate()) return;
    const p = productMap[form.productId] || {};
    const payload = {
      id: `LOT-${Date.now()}`, // ID temporal (mock)
      productId: form.productId,
      productName: p.productName || "",
      sku: p.sku || "",
      category: p.category || "",
      subcategory: p.subcategory || "",
      lotCode: form.lotCode.trim(),
      qty: Number(form.qty),
      unit: form.unit || p.unit || "unidades",
      mfgDate: form.mfgDate,
      expDate: form.expDate,
      supplier: form.supplier || p.supplier || "",
    };
    onSave?.(payload);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-lg border bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Recibir Lote</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          <Select
            label="Producto *"
            placeholder="Seleccionar producto"
            options={products.map((p) => ({
              label: `${p.productName} · ${p.sku}`,
              value: p.productId,
            }))}
            value={form.productId}
            onChange={(v) => {
              const p = productMap[v] || {};
              setForm((f) => ({
                ...f,
                productId: v,
                unit: f.unit || p.unit || "unidades",
                supplier: f.supplier || p.supplier || "",
              }));
              if (errors.productId) setErrors((e) => ({ ...e, productId: undefined }));
            }}
            error={errors.productId}
            description="Producto al que pertenece el lote"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Código de Lote *"
              placeholder="Ej: AX250-2402-B"
              value={form.lotCode}
              onChange={(e) => setField("lotCode", e.target.value)}
              error={errors.lotCode}
              description="Identificador impreso en el empaque"
            />
            <Input
              label="Cantidad *"
              type="number"
              min="0"
              value={form.qty}
              onChange={(e) => setField("qty", e.target.value)}
              error={errors.qty}
              description="Unidades recibidas"
            />
            <Input
              label="Unidad"
              placeholder="unidades / litros / cajas…"
              value={form.unit}
              onChange={(e) => setField("unit", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="F. Fabricación *"
              type="date"
              value={form.mfgDate}
              onChange={(e) => setField("mfgDate", e.target.value)}
              error={errors.mfgDate}
            />
            <Input
              label="F. Vencimiento *"
              type="date"
              value={form.expDate}
              onChange={(e) => setField("expDate", e.target.value)}
              error={errors.expDate}
            />
            <Input
              label="Proveedor"
              placeholder="Opcional"
              value={form.supplier}
              onChange={(e) => setField("supplier", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}
