import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PrescriptionFilters = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  filterBy, 
  onFilterChange,
  onClearFilters 
}) => {
  const sortOptions = [
    { value: 'date-desc', label: 'Fecha (Más reciente)' },
    { value: 'date-asc', label: 'Fecha (Más antigua)' },
    { value: 'medication', label: 'Medicamento (A-Z)' },
    { value: 'doctor', label: 'Médico (A-Z)' },
    { value: 'status', label: 'Estado' }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todos los medicamentos' },
    { value: 'antibiotics', label: 'Antibióticos' },
    { value: 'cardiovascular', label: 'Cardiovasculares' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'pain-relief', label: 'Analgésicos' },
    { value: 'vitamins', label: 'Vitaminas' },
    { value: 'other', label: 'Otros' }
  ];

  const hasActiveFilters = searchQuery || sortBy !== 'date-desc' || filterBy !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Buscar por medicamento, médico o número de receta..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-48">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Ordenar por"
          />
        </div>

        {/* Filter By Type */}
        <div className="w-full lg:w-52">
          <Select
            options={filterOptions}
            value={filterBy}
            onChange={onFilterChange}
            placeholder="Filtrar por tipo"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="default"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            className="lg:w-auto"
          >
            Limpiar
          </Button>
        )}
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Búsqueda: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange('')}
                  className="ml-1 w-4 h-4 hover:bg-primary/20"
                >
                  <Icon name="X" size={10} />
                </Button>
              </span>
            )}

            {sortBy !== 'date-desc' && (
              <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                Orden: {sortOptions?.find(opt => opt?.value === sortBy)?.label}
              </span>
            )}

            {filterBy !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                Tipo: {filterOptions?.find(opt => opt?.value === filterBy)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionFilters;