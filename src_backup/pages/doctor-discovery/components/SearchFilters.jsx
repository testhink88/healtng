import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';

const SearchFilters = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange, 
  resultCount = 0,
  onClearFilters,
  isMobile = false,
  isOpen = false,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const specialtyOptions = [
    { value: '', label: 'Todas las especialidades' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'ginecologia', label: 'Ginecología' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'traumatologia', label: 'Traumatología' },
    { value: 'psiquiatria', label: 'Psiquiatría' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'otorrinolaringologia', label: 'Otorrinolaringología' },
    { value: 'urologia', label: 'Urología' },
    { value: 'endocrinologia', label: 'Endocrinología' }
  ];

  const locationOptions = [
    { value: '', label: 'Todas las ubicaciones' },
    { value: 'caracas', label: 'Caracas' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'maracaibo', label: 'Maracaibo' },
    { value: 'barquisimeto', label: 'Barquisimeto' },
    { value: 'maracay', label: 'Maracay' },
    { value: 'ciudad_guayana', label: 'Ciudad Guayana' },
    { value: 'san_cristobal', label: 'San Cristóbal' },
    { value: 'cumana', label: 'Cumaná' },
    { value: 'merida', label: 'Mérida' }
  ];

  const availabilityOptions = [
    { value: '', label: 'Cualquier disponibilidad' },
    { value: 'today', label: 'Disponible hoy' },
    { value: 'tomorrow', label: 'Disponible mañana' },
    { value: 'this_week', label: 'Esta semana' },
    { value: 'next_week', label: 'Próxima semana' }
  ];

  const insuranceOptions = [
    { value: '', label: 'Todos los seguros' },
    { value: 'seguros_caracas', label: 'Seguros Caracas' },
    { value: 'seguros_venezuela', label: 'Seguros Venezuela' },
    { value: 'mapfre', label: 'MAPFRE' },
    { value: 'banesco_seguros', label: 'Banesco Seguros' },
    { value: 'mercantil_seguros', label: 'Mercantil Seguros' },
    { value: 'particular', label: 'Pago particular' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Mejor calificación' },
    { value: 'price_low', label: 'Precio: menor a mayor' },
    { value: 'price_high', label: 'Precio: mayor a menor' },
    { value: 'availability', label: 'Disponibilidad más próxima' },
    { value: 'distance', label: 'Distancia' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      specialty: '',
      location: '',
      availability: '',
      insurance: '',
      sortBy: 'rating',
      licenseVerified: false,
      teleconsultation: false,
      minRating: 0,
      maxPrice: 1000
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const activeFiltersCount = Object.values(localFilters)?.filter(value => 
    value !== '' && value !== false && value !== 0 && value !== 1000
  )?.length;

  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
            <div 
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
              onClick={(e) => e?.stopPropagation()}
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
                {resultCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {resultCount} médicos encontrados
                  </p>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Search */}
                <Input
                  type="search"
                  placeholder="Buscar por nombre del médico..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e?.target?.value)}
                />

                {/* Specialty */}
                <Select
                  label="Especialidad"
                  options={specialtyOptions}
                  value={localFilters?.specialty}
                  onChange={(value) => handleFilterChange('specialty', value)}
                />

                {/* Location */}
                <Select
                  label="Ubicación"
                  options={locationOptions}
                  value={localFilters?.location}
                  onChange={(value) => handleFilterChange('location', value)}
                />

                {/* Availability */}
                <Select
                  label="Disponibilidad"
                  options={availabilityOptions}
                  value={localFilters?.availability}
                  onChange={(value) => handleFilterChange('availability', value)}
                />

                {/* Insurance */}
                <Select
                  label="Seguro médico"
                  options={insuranceOptions}
                  value={localFilters?.insurance}
                  onChange={(value) => handleFilterChange('insurance', value)}
                />

                {/* Sort */}
                <Select
                  label="Ordenar por"
                  options={sortOptions}
                  value={localFilters?.sortBy}
                  onChange={(value) => handleFilterChange('sortBy', value)}
                />

                {/* Additional Filters */}
                <div className="space-y-3">
                  <Checkbox
                    label="Solo médicos con licencia verificada"
                    checked={localFilters?.licenseVerified}
                    onChange={(e) => handleFilterChange('licenseVerified', e?.target?.checked)}
                  />
                  <Checkbox
                    label="Disponible para teleconsulta"
                    checked={localFilters?.teleconsultation}
                    onChange={(e) => handleFilterChange('teleconsultation', e?.target?.checked)}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Precio máximo: ${localFilters?.maxPrice} USD
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={localFilters?.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e?.target?.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    className="flex-1"
                    disabled={activeFiltersCount === 0}
                  >
                    Limpiar filtros
                  </Button>
                  <Button
                    variant="default"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Aplicar filtros
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Filters
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Buscar médicos</h2>
        {resultCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {resultCount} médicos encontrados
          </span>
        )}
      </div>
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Buscar por nombre del médico..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
        />
      </div>
      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Especialidad"
          options={specialtyOptions}
          value={localFilters?.specialty}
          onChange={(value) => handleFilterChange('specialty', value)}
        />

        <Select
          label="Ubicación"
          options={locationOptions}
          value={localFilters?.location}
          onChange={(value) => handleFilterChange('location', value)}
        />

        <Select
          label="Disponibilidad"
          options={availabilityOptions}
          value={localFilters?.availability}
          onChange={(value) => handleFilterChange('availability', value)}
        />

        <Select
          label="Seguro médico"
          options={insuranceOptions}
          value={localFilters?.insurance}
          onChange={(value) => handleFilterChange('insurance', value)}
        />
      </div>
      {/* Advanced Filters */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Select
            label="Ordenar por"
            options={sortOptions}
            value={localFilters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Precio máximo: ${localFilters?.maxPrice} USD
            </label>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={localFilters?.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e?.target?.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <Checkbox
              label="Licencia verificada"
              checked={localFilters?.licenseVerified}
              onChange={(e) => handleFilterChange('licenseVerified', e?.target?.checked)}
            />
            <Checkbox
              label="Teleconsulta disponible"
              checked={localFilters?.teleconsultation}
              onChange={(e) => handleFilterChange('teleconsultation', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleClearAll}
              iconName="X"
              iconPosition="left"
            >
              Limpiar filtros ({activeFiltersCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;