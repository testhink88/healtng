import React from "react";
import Button from "@/components/ui/Button";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, item, loading }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Eliminar artículo</h2>
        <p className="text-sm text-muted-foreground mb-4">
          ¿Seguro que deseas eliminar <strong>{item.name}</strong> de tu
          catálogo B2B?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(item)}
            loading={loading}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
