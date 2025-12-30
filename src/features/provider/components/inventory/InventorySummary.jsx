// src/features/provider/components/inventory/InventorySummary.jsx
import React from "react";
import Icon from "@/components/AppIcon";

const InventorySummary = ({ products }) => {
  const totalProducts = products?.length || 0;
  const lowStock = products?.filter((p) => p.stock < 50)?.length || 0;
  const totalValue = 1125.46; // Mock temporal

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  return (
    <div className="flex flex-col gap-4">
      {/* === BLOQUE VALOR TOTAL === */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Valor Total del Inventario
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {formatCurrency(totalValue)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Actualizado: {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      {/* === BLOQUE ALERTAS === */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Alertas de Stock
        </h3>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-md ${
            lowStock > 0
              ? "bg-yellow-50 border border-yellow-300"
              : "bg-green-50 border border-green-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Icon
              name="AlertTriangle"
              size={16}
              className={
                lowStock > 0 ? "text-yellow-500" : "text-green-500"
              }
            />
            <span className="text-sm font-medium text-gray-700">
              Bajo Stock / Sin Stock
            </span>
          </div>
          <span
            className={`text-lg font-semibold ${
              lowStock > 0 ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {lowStock}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <span>Total SKUs</span>
          <span className="font-medium text-gray-800">{totalProducts}</span>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
