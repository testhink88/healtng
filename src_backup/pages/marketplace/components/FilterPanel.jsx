import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, resultCount, isOpen, onToggle }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'medications', label: 'Medicamentos' },
    { value: 'medical-equipment', label: 'Equipos Médicos' },
    { value: 'supplies', label: 'Suministros' },
    { value: 'diagnostics', label: 'Diagnósticos' },
    { value: 'wellness', label: 'Bienestar' },
    { value: 'emergency', label: 'Emergencia' }
  ];

  const providers = [
    { value: 'all', label: 'Todos los proveedores' },
    { value: 'farmacia-central', label: 'Farmacia Central' },
    { value: 'medisupply-ve', label: 'MediSupply VE' },
    { value: 'equipos-medicos-ca', label: 'Equipos Médicos CA' },
    { value: 'laboratorio-nacional', label: 'Laboratorio Nacional' },
    { value: 'wellness-store', label: 'Wellness Store' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'newest', label: 'Más Recientes' },
    { value: 'availability', label: 'Disponibilidad' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...localFilters?.priceRange, [type]: parseFloat(value) || 0 };
    handleFilterChange('priceRange', newPriceRange);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      provider: 'all',
      priceRange: { min: 0, max: 1000 },
      availability: 'all',
      insuranceCompatible: false,
      sortBy: 'relevance',
      search: ''
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return localFilters?.category !== 'all' ||
           localFilters?.provider !== 'all' ||
           localFilters?.availability !== 'all' ||
           localFilters?.insuranceCompatible ||
           localFilters?.priceRange?.min > 0 ||
           localFilters?.priceRange?.max < 1000 ||
           localFilters?.search?.length > 0;
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} />
            <span>Filtros</span>
            {hasActiveFilters() && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Activos
              </span>
            )}
          </div>
          <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {/* Filter Panel */}
      <div className={`bg-card border border-border rounded-lg p-4 space-y-6 ${
        isOpen ? 'block' : 'hidden lg:block'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <h3 className="font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {resultCount} productos
            </span>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={localFilters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Sort */}
        <div>
          <Select
            label="Ordenar por"
            options={sortOptions}
            value={localFilters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Categoría"
            options={categories}
            value={localFilters?.category}
            onChange={(value) => handleFilterChange('category', value)}
          />
        </div>

        {/* Provider */}
        <div>
          <Select
            label="Proveedor"
            options={providers}
            value={localFilters?.provider}
            onChange={(value) => handleFilterChange('provider', value)}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Rango de Precio (USD)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Mín"
              value={localFilters?.priceRange?.min}
              onChange={(e) => handlePriceChange('min', e?.target?.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Máx"
              value={localFilters?.priceRange?.max}
              onChange={(e) => handlePriceChange('max', e?.target?.value)}
              min="0"
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            ${localFilters?.priceRange?.min} - ${localFilters?.priceRange?.max}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Disponibilidad
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Todos los productos' },
              { value: 'in-stock', label: 'En stock' },
              { value: 'low-stock', label: 'Pocas unidades' },
              { value: 'pre-order', label: 'Pre-orden' }
            ]?.map((option) => (
              <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value={option?.value}
                  checked={localFilters?.availability === option?.value}
                  onChange={(e) => handleFilterChange('availability', e?.target?.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">{option?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Insurance Compatible */}
        <div>
          <Checkbox
            label="Compatible con seguros"
            description="Productos cubiertos por seguros médicos"
            checked={localFilters?.insuranceCompatible}
            onChange={(e) => handleFilterChange('insuranceCompatible', e?.target?.checked)}
          />
        </div>

        {/* Additional Features */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Características
          </label>
          <div className="space-y-2">
            <Checkbox
              label="Envío gratis"
              checked={localFilters?.freeShipping || false}
              onChange={(e) => handleFilterChange('freeShipping', e?.target?.checked)}
            />
            <Checkbox
              label="Productos nuevos"
              checked={localFilters?.newProducts || false}
              onChange={(e) => handleFilterChange('newProducts', e?.target?.checked)}
            />
            <Checkbox
              label="En oferta"
              checked={localFilters?.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="lg:hidden pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={onToggle}
            className="w-full"
          >
            Ver {resultCount} productos
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;