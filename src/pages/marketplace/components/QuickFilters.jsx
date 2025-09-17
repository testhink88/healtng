import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickFilters = ({ activeFilters, onFilterChange, resultCount }) => {
  const quickFilterOptions = [
    {
      key: 'category',
      value: 'medications',
      label: 'Medicamentos',
      icon: 'Pill',
      color: 'bg-success/10 text-success border-success/20'
    },
    {
      key: 'category',
      value: 'medical-equipment',
      label: 'Equipos',
      icon: 'Stethoscope',
      color: 'bg-primary/10 text-primary border-primary/20'
    },
    {
      key: 'category',
      value: 'supplies',
      label: 'Suministros',
      icon: 'Package',
      color: 'bg-secondary/10 text-secondary border-secondary/20'
    },
    {
      key: 'category',
      value: 'emergency',
      label: 'Emergencia',
      icon: 'AlertTriangle',
      color: 'bg-error/10 text-error border-error/20'
    },
    {
      key: 'availability',
      value: 'in-stock',
      label: 'En Stock',
      icon: 'CheckCircle',
      color: 'bg-success/10 text-success border-success/20'
    },
    {
      key: 'insuranceCompatible',
      value: true,
      label: 'Con Seguro',
      icon: 'Shield',
      color: 'bg-warning/10 text-warning border-warning/20'
    },
    {
      key: 'onSale',
      value: true,
      label: 'En Oferta',
      icon: 'Tag',
      color: 'bg-error/10 text-error border-error/20'
    },
    {
      key: 'newProducts',
      value: true,
      label: 'Nuevos',
      icon: 'Sparkles',
      color: 'bg-accent text-accent-foreground border-accent'
    }
  ];

  const handleQuickFilter = (filterKey, filterValue) => {
    const newFilters = { ...activeFilters };
    
    if (filterKey === 'category') {
      newFilters.category = newFilters?.category === filterValue ? 'all' : filterValue;
    } else if (filterKey === 'availability') {
      newFilters.availability = newFilters?.availability === filterValue ? 'all' : filterValue;
    } else {
      newFilters[filterKey] = !newFilters?.[filterKey];
    }
    
    onFilterChange(newFilters);
  };

  const isFilterActive = (filterKey, filterValue) => {
    if (filterKey === 'category' || filterKey === 'availability') {
      return activeFilters?.[filterKey] === filterValue;
    }
    return activeFilters?.[filterKey] === filterValue;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={18} className="text-primary" />
          <h3 className="font-medium text-foreground">Filtros Rápidos</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {resultCount} productos encontrados
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickFilterOptions?.map((option) => {
          const isActive = isFilterActive(option?.key, option?.value);
          
          return (
            <Button
              key={`${option?.key}-${option?.value}`}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickFilter(option?.key, option?.value)}
              className={`flex items-center space-x-2 border transition-all duration-150 ${
                isActive 
                  ? option?.color
                  : 'border-border hover:border-primary/20 hover:bg-primary/5'
              }`}
            >
              <Icon name={option?.icon} size={14} />
              <span className="text-sm font-medium">{option?.label}</span>
              {isActive && (
                <Icon name="X" size={12} className="ml-1" />
              )}
            </Button>
          );
        })}
      </div>
      {/* Active Filters Summary */}
      {Object.values(activeFilters)?.some(value => 
        value !== 'all' && value !== '' && value !== false && 
        !(typeof value === 'object' && value?.min === 0 && value?.max === 1000)
      ) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Filtros activos aplicados
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange({
                category: 'all',
                provider: 'all',
                priceRange: { min: 0, max: 1000 },
                availability: 'all',
                insuranceCompatible: false,
                sortBy: 'relevance',
                search: '',
                freeShipping: false,
                newProducts: false,
                onSale: false
              })}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Icon name="X" size={12} className="mr-1" />
              Limpiar todos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickFilters;