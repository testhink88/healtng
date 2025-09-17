import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Icon from "../../../../components/AppIcon";

export default function StockManagementPanel({ product, onStockAdjustment, onCreateOrder }) {
  const [type, setType] = useState("entry");
  const [qty, setQty] = useState(1);

  const available = Math.max(0, Number(product?.currentStock || 0) - Number(product?.reservedStock || 0));
  const progress = Math.min(100, Math.round((Number(product?.currentStock || 0) / Number(product?.maxStock || 1)) * 100));

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Icon name="Boxes" size={16}/> Gestión de Stock
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <KPI label="Stock Actual" value={product?.currentStock} suffix="unidades" />
        <KPI label="Stock Disponible" value={available} suffix="libres" />
        <KPI label="Stock Reservado" value={product?.reservedStock} suffix="reservadas" />
        <KPI label="Punto de Reorden" value={product?.reorderPoint} suffix="mínimas" />
      </div>

      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">Nivel de Stock</div>
        <div className="h-2 bg-muted rounded-md overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{progress}% de capacidad</div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="text-xs font-medium mb-2">Movimiento rápido</div>
        <div className="flex items-center gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded-md px-2 py-2 text-sm">
            <option value="entry">Entrada</option>
            <option value="exit">Salida</option>
          </select>
          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} className="w-24 border rounded-md px-2 py-2 text-sm" />
          <Button
            onClick={() => onStockAdjustment?.({ type, quantity: Number(qty || 0) })}
            iconName={type === "entry" ? "Plus" : "Minus"}
            iconPosition="left"
          >
            Aplicar
          </Button>
          <Button variant="outline" onClick={onCreateOrder} iconName="ShoppingCart" iconPosition="left">
            Crear Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, suffix }) {
  return (
    <div className="bg-muted/40 rounded-md p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">
        {Number(value || 0)} <span className="text-xs font-normal text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}
