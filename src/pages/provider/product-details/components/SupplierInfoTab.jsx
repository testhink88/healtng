// src/pages/provider/product-details/components/SupplierInfoTab.jsx
import React, { useEffect, useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
// ajusta este import a tu fuente real de datos
import { getSuppliers } from "../../../../utils/mockData";

export default function SupplierInfoTab({ productId }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const all = getSuppliers?.() || [];
    const filtered = all.filter((s) => (s.productIds || []).includes(String(productId)));
    setSuppliers(filtered);
  }, [productId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Icon name="Building" size={18} /> Proveedores del Producto
        </h3>
        <Button iconName="Plus" iconPosition="left">Agregar Proveedor</Button>
      </div>

      {suppliers.length === 0 ? (
        <div className="text-muted-foreground">No hay proveedores asociados a este producto.</div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.contact || s.email}</div>
              </div>
              <Button variant="outline" size="sm">Ver detalles</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
