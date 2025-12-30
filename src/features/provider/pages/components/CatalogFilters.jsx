import React from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const CatalogFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  onBulkAction,
  selectedCount,
}) => {
  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-card border rounded-lg p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          label="Buscar"
          placeholder="Nombre, código o descripción"
          value={filters.search}
          onChange={handleChange("search")}
        />

        <Select
          label="Tipo"
          value={filters.type}
          placeholder="Todos"
          onChange={handleChange("type")}
          options={[
            { label: "Todos", value: "" },
            { label: "Productos", value: "product" },
            { label: "Servicios", value: "service" },
          ]}
        />

        <Select
          label="Estado"
          value={filters.status}
          placeholder="Todos"
          onChange={handleChange("status")}
          options={[
            { label: "Todos", value: "" },
            { label: "Activo", value: "active" },
            { label: "Inactivo", value: "inactive" },
            { label: "Sin stock", value: "out_of_stock" },
          ]}
        />

        <div className="flex items-end">
          <Button variant="outline" className="w-full" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{resultCount} resultado(s)</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedCount}
            onClick={() => onBulkAction("update_pricing")}
          >
            Cambiar precios
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedCount}
            onClick={() => onBulkAction("deactivate")}
          >
            Desactivar
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedCount}
            onClick={() => onBulkAction("export")}
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;
