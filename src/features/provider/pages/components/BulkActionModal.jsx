import React from "react";
import Button from "@/components/ui/Button";

const BulkActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  selectedItems,
  loading,
}) => {
  if (!isOpen) return null;

  const actionLabels = {
    export: "Exportar datos",
    update_pricing: "Actualizar precios",
    deactivate: "Desactivar artículos",
    delete: "Eliminar artículos",
  };

  const title = actionLabels[action] || "Acción masiva";

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Esta acción se aplicará a {selectedItems.length} artículo
          {selectedItems.length !== 1 ? "s" : ""}.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(action)} loading={loading}>
            Ejecutar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionModal;
