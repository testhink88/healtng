import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const SearchFilters = ({ filters, onFilterChange, onClearFilters, className }) => {
  const specialtyOptions = [
    { value: 'Cardiología', label: 'Cardiología' },
    { value: 'Dermatología', label: 'Dermatología' },
    { value: 'Neurología', label: 'Neurología' },
    { value: 'Ginecología', label: 'Ginecología' },
    { value: 'Pediatría', label: 'Pediatría' },
    { value: 'Medicina General', label: 'Medicina General' },
    { value: 'Psiquiatría', label: 'Psiquiatría' },
    { value: 'Ortopedia', label: 'Ortopedia' }
  ];

  const appointmentTypeOptions = [
    { value: 'in-person', label: 'Presencial' },
    { value: 'teleconsultation', label: 'Teleconsulta' }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'no-show', label: 'No asistió' },
    { value: 'rescheduled', label: 'Reprogramada' }
  ];

  const hasActiveFilters = Boolean(
    filters?.searchTerm ||
    filters?.dateRange?.start ||
    filters?.dateRange?.end ||
    filters?.specialty ||
    filters?.appointmentType ||
    filters?.status
  );

  return (
    <div className={cn("bg-card rounded-xl border border-border p-6", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Search" size={20} />
          Filtros de búsqueda
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
          >
            Limpiar filtros
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Buscar por doctor, especialidad, motivo o ubicación..."
            value={filters?.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e?.target?.value })}
            className="pl-10"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Fecha desde</label>
            <Input
              type="date"
              value={filters?.dateRange?.start}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...filters?.dateRange, start: e?.target?.value }
              })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Fecha hasta</label>
            <Input
              type="date"
              value={filters?.dateRange?.end}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...filters?.dateRange, end: e?.target?.value }
              })}
            />
          </div>

          {/* Specialty */}
          <Select
            label="Especialidad"
            placeholder="Todas las especialidades"
            options={specialtyOptions}
            value={filters?.specialty}
            onChange={(value) => onFilterChange({ specialty: value })}
            clearable
          />

          {/* Appointment Type */}
          <Select
            label="Tipo de cita"
            placeholder="Todos los tipos"
            options={appointmentTypeOptions}
            value={filters?.appointmentType}
            onChange={(value) => onFilterChange({ appointmentType: value })}
            clearable
          />

          {/* Status */}
          <Select
            label="Estado"
            placeholder="Todos los estados"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => onFilterChange({ status: value })}
            clearable
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground flex items-center">
            Filtros rápidos:
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({ 
              dateRange: { 
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0],
                end: new Date()?.toISOString()?.split('T')?.[0]
              }
            })}
          >
            Últimos 30 días
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({ status: 'completed' })}
          >
            Solo completadas
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({ appointmentType: 'teleconsultation' })}
          >
            Solo teleconsultas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;