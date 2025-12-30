import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const AddItemModal = ({ isOpen, onClose, onSave, editItem }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "product",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name || "",
        code: editItem.code || "",
        type: editItem.type || "product",
        price: editItem.price ?? "",
        stock: editItem.stock ?? "",
      });
    } else {
      setForm({ name: "", code: "", type: "product", price: "", stock: "" });
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...editItem,
      ...form,
      price: form.price ? Number(form.price) : 0,
      stock: form.type === "product" ? Number(form.stock || 0) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center">
      <div className="bg-surface border border-border rounded-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editItem ? "Editar artículo" : "Agregar artículo"}
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            value={form.name}
            onChange={handleChange("name")}
            required
          />
          <Input
            label="Código"
            value={form.code}
            onChange={handleChange("code")}
          />
          <Select
            label="Tipo"
            value={form.type}
            onChange={handleChange("type")}
            options={[
              { label: "Producto", value: "product" },
              { label: "Servicio", value: "service" },
            ]}
          />
          <Input
            label="Precio"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange("price")}
          />
          {form.type === "product" && (
            <Input
              label="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange("stock")}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
