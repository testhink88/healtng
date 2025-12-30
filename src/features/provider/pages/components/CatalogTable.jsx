import React from "react";
import Button from "@/components/ui/Button";

const CatalogTable = ({
  items,
  selectedItems,
  onSelectionChange,
  onEdit,
  onDelete,
  loading,
}) => {
  const allSelected =
    items.length > 0 && selectedItems.length === items.length;

  const toggleAll = (checked) => {
    if (checked) {
      onSelectionChange(items.map((i) => i.id));
    } else {
      onSelectionChange([]);
    }
  };

  const toggleOne = (id) => {
    if (selectedItems.includes(id)) {
      onSelectionChange(selectedItems.filter((x) => x !== id));
    } else {
      onSelectionChange([...selectedItems, id]);
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-6 text-sm text-muted-foreground">
        Cargando catálogo...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="border rounded-lg p-6 text-sm text-muted-foreground">
        No hay artículos en tu catálogo B2B.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-3 py-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleAll(e.target.checked)}
              />
            </th>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2 text-left">Código</th>
            <th className="px-3 py-2 text-left">Tipo</th>
            <th className="px-3 py-2 text-right">Precio</th>
            <th className="px-3 py-2 text-right">Stock</th>
            <th className="px-3 py-2 text-left">Estado</th>
            <th className="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(it.id)}
                  onChange={() => toggleOne(it.id)}
                />
              </td>
              <td className="px-3 py-2">{it.name}</td>
              <td className="px-3 py-2">{it.code}</td>
              <td className="px-3 py-2">
                {it.type === "service" ? "Servicio" : "Producto"}
              </td>
              <td className="px-3 py-2 text-right">
                {typeof it.price === "number" ? `$ ${it.price.toFixed(2)}` : "-"}
              </td>
              <td className="px-3 py-2 text-right">
                {it.type === "product" ? it.stock ?? 0 : "—"}
              </td>
              <td className="px-3 py-2">
                {it.status === "inactive" ? "Inactivo" : "Activo"}
              </td>
              <td className="px-3 py-2 text-right space-x-2">
                <Button size="xs" variant="outline" onClick={() => onEdit(it)}>
                  Editar
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => onDelete(it)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogTable;
