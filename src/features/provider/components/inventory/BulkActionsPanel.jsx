import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle, XCircle, Boxes, DollarSign, Tag, Download, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { createPortal } from "react-dom";

/**
 * Props
 * - isVisible: boolean
 * - selectedCount: number
 * - onClose: () => void
 * - onAction: (actionId, payload) => Promise<void> | void
 * - categoryOptions: Array<{label, value}>
 * - withBackdrop?: boolean         // ⟵ por defecto false (sin overlay)
 * - usePortal?: boolean            // ⟵ por defecto true (monta en <body>)
 */
export default function BulkActionsPanel({
  isVisible,
  selectedCount = 0,
  onClose,
  onAction,
  categoryOptions = [],
  withBackdrop = false,
  usePortal = true,
}) {
  const [step, setStep] = useState("menu");
  const [loading, setLoading] = useState(false);

  const [stockForm, setStockForm] = useState({ type: "", qty: "", reason: "" });
  const [priceForm, setPriceForm] = useState({ type: "", amount: "" });
  const [categoryForm, setCategoryForm] = useState({ category: "" });

  // reset al abrir/cerrar
  useEffect(() => {
    if (!isVisible) {
      setStep("menu");
      setLoading(false);
      setStockForm({ type: "", qty: "", reason: "" });
      setPriceForm({ type: "", amount: "" });
      setCategoryForm({ category: "" });
    }
  }, [isVisible]);

  // Cerrar con Esc
  const escHandler = useCallback((e) => {
    if (e.key === "Escape" && isVisible) onClose?.();
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible) return;
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [isVisible, escHandler]);

  const actions = useMemo(
    () => [
      { id: "activate",  label: "Activar Productos",    icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,  hint: "Marcar productos seleccionados como activos" },
      { id: "deactivate",label: "Desactivar Productos", icon: <XCircle className="w-4 h-4 text-amber-600" />,        hint: "Marcar productos seleccionados como inactivos" },
      { id: "stock",     label: "Actualizar Stock",     icon: <Boxes className="w-4 h-4 text-blue-600" />,           hint: "Ajustar stock de productos seleccionados" },
      { id: "price",     label: "Actualizar Precios",   icon: <DollarSign className="w-4 h-4 text-indigo-600" />,    hint: "Modificar precios de productos seleccionados" },
      { id: "category",  label: "Cambiar Categoría",    icon: <Tag className="w-4 h-4 text-sky-600" />,              hint: "Reasignar categoría a productos seleccionados" },
      { id: "export",    label: "Exportar Datos",       icon: <Download className="w-4 h-4 text-gray-700" />,         hint: "Descargar información de productos seleccionados" },
    ],
    []
  );

  const run = async (actionId, payload = {}) => {
    setLoading(true);
    try {
      await onAction?.(actionId, payload);
      setStep("menu");
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const Header = ({ title }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center gap-3">
        {step !== "menu" && (
          <button
            onClick={() => setStep("menu")}
            className="p-2 -ml-2 rounded hover:bg-gray-100"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-500">
            Esta acción se aplicará a {selectedCount} producto{selectedCount === 1 ? "" : "s"}.
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Cerrar">✕</button>
    </div>
  );

  // --- Click fuera para cerrar (sin backdrop) ---
  const boxRef = useRef(null);
  useEffect(() => {
    if (!isVisible || withBackdrop) return;
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isVisible, withBackdrop, onClose]);

  // Si tu Select soporta portal del menú (react-select / headless)
  const selectPortalProps = {
    menuPortalTarget: typeof document !== "undefined" ? document.body : undefined,
    menuPosition: "fixed",
    dropdownClassName: "max-h-80 overflow-auto",
  };

  if (!isVisible) return null;

  const Panel = (
    <div className="fixed inset-0 z-[140] pointer-events-none">
      {/* SIN overlay: solo lo pinto si withBackdrop === true */}
      {withBackdrop && (
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={onClose} />
      )}

      {/* Caja del panel */}
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        className="
          pointer-events-auto
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[96vw] max-w-3xl bg-white rounded-lg shadow-2xl border
          min-h-[560px] max-h-[92vh] overflow-hidden
        "
      >
        {/* MENÚ */}
        {step === "menu" && (
          <>
            <Header title="Acciones Masivas" />
            <div className="px-6 py-3 text-xs text-gray-500 border-b bg-white">
              {selectedCount} producto{selectedCount === 1 ? "" : "s"} seleccionado{selectedCount === 1 ? "" : "s"}
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-160px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setStep(a.id)}
                    className="text-left border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/30 transition"
                  >
                    <div className="flex items-center gap-2">
                      {a.icon}
                      <div className="font-medium">{a.label}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{a.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ACTIVAR */}
        {step === "activate" && (
          <>
            <Header title="Activar Productos" />
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-160px)]">
              <p className="text-sm text-gray-600 mb-6">
                Confirmá para marcar como <b>activos</b> los productos seleccionados.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button loading={loading} onClick={() => run("activate")}>Ejecutar Acción</Button>
              </div>
            </div>
          </>
        )}

        {/* DESACTIVAR */}
        {step === "deactivate" && (
          <>
            <Header title="Desactivar Productos" />
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-160px)]">
              <p className="text-sm text-gray-600 mb-6">
                Confirmá para marcar como <b>inactivos</b> los productos seleccionados.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button loading={loading} onClick={() => run("deactivate")}>Ejecutar Acción</Button>
              </div>
            </div>
          </>
        )}

        {/* STOCK */}
        {step === "stock" && (
          <>
            <Header title="Actualizar Stock" />
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-160px)]">
              <Select
                {...selectPortalProps}
                label="Tipo de Actualización *"
                placeholder="Seleccionar opción"
                value={stockForm.type}
                onChange={(v) => setStockForm((s) => ({ ...s, type: v }))}
                options={[
                  { label: "Establecer cantidad exacta", value: "set" },
                  { label: "Agregar al stock actual", value: "add" },
                  { label: "Restar del stock actual", value: "sub" },
                ]}
              />
              <Input
                label="Cantidad *"
                type="number"
                value={stockForm.qty}
                onChange={(e) => setStockForm((s) => ({ ...s, qty: e.target.value }))}
              />
              <Input
                label="Motivo del Ajuste"
                placeholder="Opcional: Razón del cambio de stock"
                value={stockForm.reason}
                onChange={(e) => setStockForm((s) => ({ ...s, reason: e.target.value }))}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button
                  loading={loading}
                  onClick={() => {
                    if (!stockForm.type || stockForm.qty === "") return;
                    run("stock", {
                      type: stockForm.type,
                      qty: Number(stockForm.qty),
                      reason: stockForm.reason || undefined,
                    });
                  }}
                >
                  Ejecutar Acción
                </Button>
              </div>
            </div>
          </>
        )}

        {/* PRECIOS */}
        {step === "price" && (
          <>
            <Header title="Actualizar Precios" />
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-160px)]">
              <Select
                {...selectPortalProps}
                label="Tipo de Actualización *"
                placeholder="Seleccionar opción"
                value={priceForm.type}
                onChange={(v) => setPriceForm((s) => ({ ...s, type: v }))}
                options={[
                  { label: "Establecer precio exacto", value: "set" },
                  { label: "Aumentar porcentaje", value: "inc_pct" },
                  { label: "Reducir porcentaje", value: "dec_pct" },
                  { label: "Aumentar cantidad fija", value: "inc_abs" },
                  { label: "Reducir cantidad fija", value: "dec_abs" },
                ]}
              />
              <Input
                label="Cantidad (USD) *"
                type="number"
                step="0.01"
                value={priceForm.amount}
                onChange={(e) => setPriceForm((s) => ({ ...s, amount: e.target.value }))}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button
                  loading={loading}
                  onClick={() => {
                    if (!priceForm.type || priceForm.amount === "") return;
                    run("price", { type: priceForm.type, amount: Number(priceForm.amount) });
                  }}
                >
                  Ejecutar Acción
                </Button>
              </div>
            </div>
          </>
        )}

        {/* CATEGORÍA */}
        {step === "category" && (
          <>
            <Header title="Cambiar Categoría" />
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-160px)]">
              <Select
                {...selectPortalProps}
                label="Nueva Categoría *"
                placeholder="Seleccionar opción"
                value={categoryForm.category}
                onChange={(v) => setCategoryForm({ category: v })}
                options={categoryOptions}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button
                  loading={loading}
                  onClick={() => {
                    if (!categoryForm.category) return;
                    run("category", { category: categoryForm.category });
                  }}
                >
                  Ejecutar Acción
                </Button>
              </div>
            </div>
          </>
        )}

        {/* EXPORTAR */}
        {step === "export" && (
          <>
            <Header title="Exportar Datos" />
            <div className="p-6 overflow-y-auto max-h-[calc(92vh-160px)]">
              <p className="text-sm text-gray-600 mb-6">
                Se generará un archivo con los productos seleccionados.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("menu")}>Cancelar</Button>
                <Button loading={loading} onClick={() => run("export")}>Ejecutar Acción</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Montaje
  return usePortal ? createPortal(Panel, document.body) : Panel;
}
