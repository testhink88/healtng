import React from "react";
import BulkUploadSection from "./BulkUploadSection";

/**
 * Modal de carga masiva de productos para el inventario del proveedor.
 *
 * Recibe:
 * - isOpen: boolean → controla si el modal se muestra.
 * - onClose: () => void → cierra el modal.
 * - onUploadComplete: (products[]) => void → devuelve el array de productos parseados.
 */
const BulkUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  if (!isOpen) return null;

  const handleFileUpload = (file) => {
    if (!file) return;

    // MVP: solo CSV. Más adelante puedes agregar soporte real para XLS/XLSX.
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (ext !== ".csv") {
      alert("Por ahora solo soportamos archivos CSV. Más adelante sumamos Excel 😉");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;

      // Primera fila: encabezados
      const [headerLine, ...rows] = lines;
      const headers = headerLine.split(",").map((h) => h.trim().toLowerCase());

      // Helper para buscar índice de columna por posibles nombres
      const find = (...keys) => headers.findIndex((h) => keys.includes(h));

      const idxName = find("name", "nombre", "producto");
      const idxSku = find("sku", "codigo", "código", "codigo_barras", "barcode");
      const idxCat = find("category", "categoria", "categoría");
      const idxSub = find("subcategory", "subcategoria", "subcategoría");
      const idxStock = find("stock", "existencias", "cantidad");
      const idxMin = find("reorderpoint", "nivel_minimo", "minimo", "mínimo");
      const idxPrice = find("unitprice", "precio", "precio_unitario");
      const idxUnit = find("unit", "unidad", "unidad_medida");
      const idxWholesale = find("unitpricewholesale", "precio_mayorista");
      const idxMoq = find("moq", "minimo_pedido", "pedido_minimo");

      const products = rows.map((line, i) => {
        const cols = line.split(",").map((c) => c.trim());

        const get = (idx, fallback = "") =>
          idx >= 0 && idx < cols.length && cols[idx] !== "" ? cols[idx] : fallback;

        return {
          id: Date.now() + i,
          sku: get(idxSku),
          name: get(idxName, `Producto importado ${i + 1}`),
          category: get(idxCat, "Sin categoría"),
          subcategory: get(idxSub, ""),
          stock: Number(get(idxStock, 0)),
          reorderPoint: Number(get(idxMin, 0)),
          unitPrice: Number(get(idxPrice, 0)),
          unitPriceWholesale: Number(get(idxWholesale, 0)),
          moq: Number(get(idxMoq, 10)),
          unit: get(idxUnit, "unidades"),
          status: "Activo",
        };
      });

      const validProducts = products.filter((p) => p.name || p.sku);

      if (validProducts.length) {
        onUploadComplete?.(validProducts);
        onClose?.();
      } else {
        alert("El archivo no tiene filas válidas de productos.");
      }
    };

    reader.readAsText(file, "utf-8");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            Importar catálogo de productos (CSV)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Sube tu archivo de productos para agregarlos al inventario. Lo ideal es
            que tu CSV tenga columnas como:
            <br />
            <span className="font-mono text-xs">
              sku, nombre, categoría, subcategoría, stock, nivel_mínimo, precio,
              precio_mayorista, moq, unidad
            </span>
          </p>

          <BulkUploadSection onFileUpload={handleFileUpload} />

          <p className="text-xs text-gray-400 mt-4">
            Tip: si usas otro sistema, exporta tu catálogo a CSV y súbelo aquí. Nosotros
            intentamos mapear los nombres de las columnas automáticamente.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
