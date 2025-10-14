import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const SpaceFilters = ({ filters, onFiltersChange, onClearFilters, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clinicOptions = [
    { value: '', label: 'Todas las clínicas' },
    { value: 'clinica-caracas', label: 'Clínica Caracas' },
    { value: 'hospital-universitario', label: 'Hospital Universitario' },
    { value: 'centro-medico-valencia', label: 'Centro Médico Valencia' },
    { value: 'clinica-maracaibo', label: 'Clínica Maracaibo' },
    { value: 'hospital-militar', label: 'Hospital Militar' }
  ];

  const spaceTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'consultorio', label: 'Consultorio General' },
    { value: 'consultorio-especializado', label: 'Consultorio Especializado' },
    { value: 'sala-procedimientos', label: 'Sala de Procedimientos' },
    { value: 'sala-cirugia', label: 'Sala de Cirugía' },
    { value: 'sala-emergencia', label: 'Sala de Emergencia' },
    { value: 'laboratorio', label: 'Laboratorio' },
    { value: 'sala-imagenes', label: 'Sala de Imágenes' }
  ];

  const equipmentOptions = [
    { value: '', label: 'Sin requisitos específicos' },
    { value: 'basico', label: 'Equipamiento Básico' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'ginecologia', label: 'Ginecología' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'imagenes', label: 'Diagnóstico por Imágenes' }
  ];

  const capacityOptions = [
    { value: '', label: 'Cualquier capacidad' },
    { value: '1-2', label: '1-2 personas' },
    { value: '3-5', label: '3-5 personas' },
    { value: '6-10', label: '6-10 personas' },
    { value: '10+', label: 'Más de 10 personas' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Cualquier disponibilidad' },
    { value: 'inmediata', label: 'Disponible ahora' },
    { value: 'hoy', label: 'Disponible hoy' },
    { value: 'esta-semana', label: 'Esta semana' },
    { value: 'proximo-mes', label: 'Próximo mes' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden p-4 border-b border-border">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Filtros de Búsqueda
          {hasActiveFilters && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Activos
            </span>
          )}
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Filter" size={20} className="mr-2" />
            Filtros de Búsqueda
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Clinic Selection */}
          <Select
            label="Clínica"
            options={clinicOptions}
            value={filters?.clinic || ''}
            onChange={(value) => handleFilterChange('clinic', value)}
            placeholder="Seleccionar clínica"
          />

          {/* Space Type */}
          <Select
            label="Tipo de Espacio"
            options={spaceTypeOptions}
            value={filters?.spaceType || ''}
            onChange={(value) => handleFilterChange('spaceType', value)}
            placeholder="Seleccionar tipo"
          />

          {/* Required Equipment */}
          <Select
            label="Equipamiento Requerido"
            options={equipmentOptions}
            value={filters?.equipment || ''}
            onChange={(value) => handleFilterChange('equipment', value)}
            placeholder="Seleccionar equipamiento"
          />

          {/* Capacity */}
          <Select
            label="Capacidad"
            options={capacityOptions}
            value={filters?.capacity || ''}
            onChange={(value) => handleFilterChange('capacity', value)}
            placeholder="Seleccionar capacidad"
          />

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio por Hora (USD)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Mín"
                value={filters?.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e?.target?.value)}
                min="0"
                step="5"
              />
              <Input
                type="number"
                placeholder="Máx"
                value={filters?.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e?.target?.value)}
                min="0"
                step="5"
              />
            </div>
          </div>

          {/* Availability */}
          <Select
            label="Disponibilidad"
            options={availabilityOptions}
            value={filters?.availability || ''}
            onChange={(value) => handleFilterChange('availability', value)}
            placeholder="Seleccionar disponibilidad"
          />
        </div>

        {/* Date Range Filter */}
        <div className="mt-6 pt-6 border-t border-border">
          <label className="text-sm font-medium text-foreground mb-3 block">Rango de Fechas</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha de Inicio"
              value={filters?.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
            <Input
              type="date"
              label="Fecha de Fin"
              value={filters?.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
              min={filters?.startDate || new Date()?.toISOString()?.split('T')?.[0]}
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 pt-6 border-t border-border">
          <label className="text-sm font-medium text-foreground mb-3 block">Filtros Rápidos</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters?.quickFilter === 'disponible-ahora' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('quickFilter', 
                filters?.quickFilter === 'disponible-ahora' ? '' : 'disponible-ahora'
              )}
            >
              <Icon name="Clock" size={14} className="mr-1" />
              Disponible Ahora
            </Button>
            <Button
              variant={filters?.quickFilter === 'mejor-precio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('quickFilter', 
                filters?.quickFilter === 'mejor-precio' ? '' : 'mejor-precio'
              )}
            >
              <Icon name="DollarSign" size={14} className="mr-1" />
              Mejor Precio
            </Button>
            <Button
              variant={filters?.quickFilter === 'mejor-calificado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('quickFilter', 
                filters?.quickFilter === 'mejor-calificado' ? '' : 'mejor-calificado'
              )}
            >
              <Icon name="Star" size={14} className="mr-1" />
              Mejor Calificado
            </Button>
            <Button
              variant={filters?.quickFilter === 'aprobacion-inmediata' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('quickFilter', 
                filters?.quickFilter === 'aprobacion-inmediata' ? '' : 'aprobacion-inmediata'
              )}
            >
              <Icon name="Zap" size={14} className="mr-1" />
              Aprobación Inmediata
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Filtros Activos</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                iconSize={12}
              >
                Limpiar Todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters)?.map(([key, value]) => {
                if (!value || value === '') return null;
                
                let displayValue = value;
                if (key === 'clinic') {
                  displayValue = clinicOptions?.find(opt => opt?.value === value)?.label || value;
                } else if (key === 'spaceType') {
                  displayValue = spaceTypeOptions?.find(opt => opt?.value === value)?.label || value;
                } else if (key === 'equipment') {
                  displayValue = equipmentOptions?.find(opt => opt?.value === value)?.label || value;
                } else if (key === 'capacity') {
                  displayValue = capacityOptions?.find(opt => opt?.value === value)?.label || value;
                } else if (key === 'availability') {
                  displayValue = availabilityOptions?.find(opt => opt?.value === value)?.label || value;
                } else if (key === 'minPrice') {
                  displayValue = `Min: $${value}`;
                } else if (key === 'maxPrice') {
                  displayValue = `Max: $${value}`;
                }

                return (
                  <span
                    key={key}
                    className="inline-flex items-center bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                  >
                    {displayValue}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1 w-4 h-4 hover:bg-primary/20"
                    >
                      <Icon name="X" size={10} />
                    </Button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceFilters;