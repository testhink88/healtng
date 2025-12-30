import React, { useMemo, useState } from "react";
import { Eye, Edit3, Trash2, Check, X, Pencil, UploadCloud } from "lucide-react";

/**
 * props:
 * - products: [{ id, name, sku, category, subcategory, stock, reorderPoint, unitPrice, unitPriceWholesale?, moq?, unit, status, invStatus? }]
 * - selectedProducts: string[] | number[]
 * - onSelectProduct(id)
 * - onSelectAll()
 * - onChangeStock(id, value)
 * - onViewProduct(product)
 * - onEditProduct(product)
 * - onDeleteProduct(product)
 * - businessMode: "B2C" | "B2B" | "Mixto"
 * - onPublishToB2BCatalog(product)   👈 NUEVO
 */
export default function InventoryTable({
  products = [],
  selectedProducts = [],
  onSelectProduct,
  onSelectAll,
  onChangeStock,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  businessMode = "Mixto",
  onPublishToB2BCatalog, // 👈 NUEVO
}) {
  // Inline edit de stock
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(0);

  const fmtUSD = useMemo(
    () => new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }),
    []
  );

  const allSelected = products.length > 0 && selectedProducts.length === products.length;

  // Estado de stock derivado si no viene en p.invStatus
  const getStockState = (p) => {
    const onHand = Number(p.stock ?? 0);
    const reorder = Number(p.reorderPoint ?? 0);

    if (p.invStatus) {
      switch (p.invStatus) {
        case "in-stock":
        case "OK":
          return { label: "En Stock", tone: "text-emerald-600 bg-emerald-50" };
        case "low-stock":
        case "LOW":
          return { label: "Bajo Stock", tone: "text-amber-700 bg-amber-50" };
        case "out-of-stock":
        case "OUT":
          return { label: "Sin Stock", tone: "text-rose-700 bg-rose-50" };
        default:
          break;
      }
    }

    if (onHand === 0) return { label: "Sin Stock", tone: "text-rose-700 bg-rose-50" };
    if (onHand <= reorder) return { label: "Bajo Stock", tone: "text-amber-700 bg-amber-50" };
    return { label: "En Stock", tone: "text-emerald-600 bg-emerald-50" };
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setDraft(Number(row.stock ?? 0));
  };
  const cancelEdit = () => setEditingId(null);
  const confirmEdit = (row) => {
    const next = Number(draft || 0);
    onChangeStock?.(row.id, next);
    setEditingId(null);
  };

  // Definición dinámica de columnas
  const wantsB2C = businessMode === "B2C" || businessMode === "Mixto";
  const wantsB2B = businessMode === "B2B" || businessMode === "Mixto";

  const colDefs = useMemo(() => {
    const base = [
      { w: "w-[48px]" }, // checkbox
      { w: "" }, // producto
      { w: "w-[220px]" }, // categoría
      { w: "w-[160px]" }, // stock
      { w: "w-[160px]" }, // nivel mínimo
    ];
    if (wantsB2C) base.push({ w: "w-[150px]" }); // precio unitario
    if (wantsB2B) {
      base.push({ w: "w-[170px]" }); // precio mayorista
      base.push({ w: "w-[110px]" }); // MOQ
    }
    base.push({ w: "w-[110px]" }); // estado
    base.push({ w: "w-[140px]" }); // estado de stock
    base.push({ w: "w-[160px]" }); // acciones (un poco más ancho para el botón B2B)
    return base;
  }, [wantsB2B, wantsB2C]);

  return (
    <>
      {/* TABLE DESKTOP */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <colgroup>
              {colDefs.map((c, i) => (
                <col key={i} className={c.w || undefined} />
              ))}
            </colgroup>

            <thead className="text-xs text-gray-500 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  {/* Checkbox "seleccionar todo" custom blanco */}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => onSelectAll?.()}
                      className="peer sr-only"
                    />
                    <span
                      className="h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center
                                 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"
                    >
                      <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                    </span>
                  </label>
                </th>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Nivel mínimo</th>
                {wantsB2C && <th className="px-4 py-3 text-left">Precio Unitario</th>}
                {wantsB2B && <th className="px-4 py-3 text-left">Precio Mayorista</th>}
                {wantsB2B && <th className="px-4 py-3 text-left">MOQ</th>}
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Estado de Stock</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {products.map((row) => {
                const stockState = getStockState(row);
                const isEditing = editingId === row.id;
                const wholesale = Number(
                  row.unitPriceWholesale ?? (row.unitPrice != null ? row.unitPrice * 0.85 : 0)
                );
                const moq = Number(row.moq ?? 10);

                const canPublishToB2B =
                  typeof onPublishToB2BCatalog === "function" &&
                  wantsB2B &&
                  row.status === "Activo";

                return (
                  <tr key={row.id} className="border-t">
                    {/* select */}
                    <td className="px-4 py-3 align-top">
                      {/* Checkbox por fila custom blanco */}
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(row.id)}
                          onChange={() => onSelectProduct?.(row.id)}
                          className="peer sr-only"
                        />
                        <span
                          className="h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center
                                     peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"
                        >
                          <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                        </span>
                      </label>
                    </td>

                    {/* producto */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <span className="text-[10px]">▦</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{row.name}</div>
                          {row.sku && (
                            <div className="text-xs text-gray-500">SKU: {row.sku}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* categoría */}
                    <td className="px-4 py-3">
                      <div className="text-gray-800">{row.category || "-"}</div>
                      {row.subcategory && (
                        <div className="text-xs text-gray-500">{row.subcategory}</div>
                      )}
                    </td>

                    {/* stock (editable) */}
                    <td className="px-4 py-3">
                      {!isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800">
                            {Number(row.stock ?? 0)} {row.unit || "unidades"}
                          </span>
                          <button
                            onClick={() => startEdit(row)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Editar stock"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="h-8 w-20 rounded border border-gray-300 bg-white text-gray-900 px-2 text-sm
                                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => confirmEdit(row)}
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Confirmar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-rose-600 hover:text-rose-700"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* nivel mínimo */}
                    <td className="px-4 py-3 text-gray-800">
                      {Number(row.reorderPoint ?? 0)} {row.unit || "unidades"}
                    </td>

                    {/* precios según modo */}
                    {wantsB2C && (
                      <td className="px-4 py-3 text-gray-800">
                        {fmtUSD.format(Number(row.unitPrice ?? 0))}
                      </td>
                    )}
                    {wantsB2B && (
                      <td className="px-4 py-3 text-gray-800">
                        {fmtUSD.format(wholesale)}
                      </td>
                    )}
                    {wantsB2B && (
                      <td className="px-4 py-3 text-gray-800">{moq}</td>
                    )}

                    {/* estado (del producto) */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.status === "Activo"
                            ? "bg-emerald-50 text-emerald-700"
                            : row.status === "Inactivo"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status || "Activo"}
                      </span>
                    </td>

                    {/* estado de stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockState.tone}`}
                      >
                        {stockState.label}
                      </span>
                    </td>

                    {/* acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-gray-500">
                        <button
                          className="hover:text-blue-600"
                          title="Ver"
                          onClick={() => onViewProduct?.(row)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="hover:text-blue-600"
                          title="Editar"
                          onClick={() => onEditProduct?.(row)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="hover:text-rose-600"
                          title="Eliminar"
                          onClick={() =>
                            onDeleteProduct
                              ? onDeleteProduct(row)
                              : window.confirm(`¿Eliminar "${row.name}"?`) &&
                                console.log("Eliminar", row.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {canPublishToB2B && (
                          <button
                            className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                            title="Publicar en catálogo B2B"
                            onClick={() => onPublishToB2BCatalog?.(row)}
                          >
                            <UploadCloud className="h-4 w-4" />
                            <span className="text-xs">B2B</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-500">
                    No hay productos para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CARDS MOBILE */}
      <div className="md:hidden space-y-3">
        {products.map((row) => {
          const stockState = getStockState(row);
          const isEditing = editingId === row.id;
          const wholesale = Number(
            row.unitPriceWholesale ?? (row.unitPrice != null ? row.unitPrice * 0.85 : 0)
          );
          const moq = Number(row.moq ?? 10);
          const canPublishToB2B =
            typeof onPublishToB2BCatalog === "function" &&
            wantsB2B &&
            row.status === "Activo";

          return (
            <div key={row.id} className="rounded-lg border bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Checkbox mobile custom blanco */}
                  <label className="inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(row.id)}
                      onChange={() => onSelectProduct?.(row.id)}
                      className="peer sr-only"
                    />
                    <span
                      className="h-4 w-4 rounded border border-gray-300 bg-white flex items-center justify-center
                                 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"
                    >
                      <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                    </span>
                  </label>

                  <div className="mt-0.5 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-[10px]">▦</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    {row.sku && <div className="text-xs text-gray-500">SKU: {row.sku}</div>}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockState.tone}`}
                >
                  {stockState.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Categoría</div>
                <div className="text-gray-900">
                  {row.category || "-"}
                  {row.subcategory ? (
                    <span className="block text-xs text-gray-500">{row.subcategory}</span>
                  ) : null}
                </div>

                <div className="text-gray-500">Stock</div>
                <div className="text-gray-900">
                  {!isEditing ? (
                    <div className="inline-flex items-center gap-2">
                      {Number(row.stock ?? 0)} {row.unit || "unidades"}
                      <button
                        onClick={() => startEdit(row)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Editar stock"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-8 w-20 rounded border border-gray-300 bg-white text-gray-900 px-2 text-sm
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={() => confirmEdit(row)}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="Confirmar"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-rose-600 hover:text-rose-700"
                        title="Cancelar"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-gray-500">Nivel mínimo</div>
                <div className="text-gray-900">
                  {Number(row.reorderPoint ?? 0)} {row.unit || "unidades"}
                </div>

                {wantsB2C && (
                  <>
                    <div className="text-gray-500">Precio Unitario</div>
                    <div className="text-gray-900">
                      {fmtUSD.format(Number(row.unitPrice ?? 0))}
                    </div>
                  </>
                )}

                {wantsB2B && (
                  <>
                    <div className="text-gray-500">Precio Mayorista</div>
                    <div className="text-gray-900">{fmtUSD.format(wholesale)}</div>

                    <div className="text-gray-500">MOQ</div>
                    <div className="text-gray-900">{moq}</div>
                  </>
                )}

                <div className="text-gray-500">Estado</div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.status === "Activo"
                        ? "bg-emerald-50 text-emerald-700"
                        : row.status === "Inactivo"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {row.status || "Activo"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-500">
                <button
                  className="hover:text-blue-600 inline-flex items-center gap-1"
                  onClick={() => onViewProduct?.(row)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">Ver</span>
                </button>
                <button
                  className="hover:text-blue-600 inline-flex items-center gap-1"
                  onClick={() => onEditProduct?.(row)}
                >
                  <Edit3 className="h-4 w-4" />
                  <span className="text-xs">Editar</span>
                </button>
                <button
                  className="hover:text-rose-600 inline-flex items-center gap-1"
                  onClick={() =>
                    onDeleteProduct
                      ? onDeleteProduct(row)
                      : window.confirm(`¿Eliminar "${row.name}"?`) &&
                        console.log("Eliminar", row.id)
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs">Eliminar</span>
                </button>

                {canPublishToB2B && (
                  <button
                    className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                    onClick={() => onPublishToB2BCatalog?.(row)}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span className="text-xs">Publicar B2B</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">
            No hay productos para mostrar.
          </div>
        )}
      </div>
    </>
  );
}
