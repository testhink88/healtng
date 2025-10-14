import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';


const DoctorSearch = ({ filters, onFiltersChange }) => {
  const specialtyOptions = [
    { value: 'Cardiología', label: 'Cardiología' },
    { value: 'Dermatología', label: 'Dermatología' },
    { value: 'Neurología', label: 'Neurología' },
    { value: 'Ginecología', label: 'Ginecología' },
    { value: 'Pediatría', label: 'Pediatría' },
    { value: 'Medicina General', label: 'Medicina General' },
    { value: 'Psiquiatría', label: 'Psiquiatría' },
    { value: 'Ortopedia', label: 'Ortopedia' },
    { value: 'Oftalmología', label: 'Oftalmología' },
    { value: 'Endocrinología', label: 'Endocrinología' }
  ];

  const locationOptions = [
    { value: 'Caracas', label: 'Caracas' },
    { value: 'Maracaibo', label: 'Maracaibo' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Barquisimeto', label: 'Barquisimeto' },
    { value: 'Maracay', label: 'Maracay' },
    { value: 'San Cristóbal', label: 'San Cristóbal' }
  ];

  const appointmentTypeOptions = [
    { value: 'in-person', label: 'Presencial' },
    { value: 'teleconsultation', label: 'Teleconsulta' }
  ];

  const availabilityOptions = [
    { value: 'any', label: 'Cualquier momento' },
    { value: 'today', label: 'Hoy' },
    { value: 'tomorrow', label: 'Mañana' },
    { value: 'this-week', label: 'Esta semana' },
    { value: 'next-week', label: 'Próxima semana' }
  ];

  const hasActiveFilters = Boolean(
    filters?.specialty ||
    filters?.location ||
    filters?.insuranceCompatible ||
    filters?.appointmentType ||
    filters?.availability !== 'any' ||
    filters?.priceRange?.min > 0 ||
    filters?.priceRange?.max < 200
  );

  const handleClearFilters = () => {
    onFiltersChange({
      specialty: '',
      location: '',
      insuranceCompatible: false,
      appointmentType: '',
      availability: 'any',
      priceRange: { min: 0, max: 200 }
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Search" size={20} />
          Buscar médico
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            iconName="X"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Main Search Bar */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Buscar por especialidad, nombre del médico o ubicación..."
            value={filters?.searchTerm || ''}
            onChange={(e) => onFiltersChange({ searchTerm: e?.target?.value })}
            className="pl-10 text-base h-12"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Specialty */}
          <Select
            label="Especialidad"
            placeholder="Todas las especialidades"
            options={specialtyOptions}
            value={filters?.specialty}
            onChange={(value) => onFiltersChange({ specialty: value })}
            clearable
            searchable
          />

          {/* Location */}
          <Select
            label="Ubicación"
            placeholder="Todas las ubicaciones"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => onFiltersChange({ location: value })}
            clearable
            searchable
          />

          {/* Appointment Type */}
          <Select
            label="Tipo de consulta"
            placeholder="Presencial y teleconsulta"
            options={appointmentTypeOptions}
            value={filters?.appointmentType}
            onChange={(value) => onFiltersChange({ appointmentType: value })}
            clearable
          />

          {/* Availability */}
          <Select
            label="Disponibilidad"
            placeholder="Cualquier momento"
            options={availabilityOptions}
            value={filters?.availability}
            onChange={(value) => onFiltersChange({ availability: value })}
          />
        </div>

        {/* Advanced Filters */}
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Filtros adicionales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Insurance */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Seguro médico</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="insurance-compatible"
                  checked={filters?.insuranceCompatible}
                  onChange={(e) => onFiltersChange({ insuranceCompatible: e?.target?.checked })}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label htmlFor="insurance-compatible" className="text-sm text-foreground cursor-pointer">
                  Solo médicos que aceptan seguro
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Rango de precio (USD): ${filters?.priceRange?.min} - ${filters?.priceRange?.max}
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">Min:</span>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={filters?.priceRange?.min}
                    onChange={(e) => onFiltersChange({
                      priceRange: { ...filters?.priceRange, min: Number(e?.target?.value) }
                    })}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">Max:</span>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={filters?.priceRange?.max}
                    onChange={(e) => onFiltersChange({
                      priceRange: { ...filters?.priceRange, max: Number(e?.target?.value) }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Filtros rápidos</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    specialty: 'Medicina General',
                    priceRange: { min: 0, max: 80 }
                  })}
                  className="text-xs"
                >
                  Medicina general
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    appointmentType: 'teleconsultation',
                    availability: 'today'
                  })}
                  className="text-xs"
                >
                  Teleconsulta hoy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFiltersChange({ 
                    location: 'Caracas',
                    insuranceCompatible: true
                  })}
                  className="text-xs"
                >
                  Con seguro en Caracas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;