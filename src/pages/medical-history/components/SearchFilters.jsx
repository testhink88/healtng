import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const SearchFilters = ({ onSearch, onFilter, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [recordType, setRecordType] = useState('all');
  const [doctor, setDoctor] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const dateRangeOptions = [
    { value: 'all', label: 'Todos los períodos' },
    { value: 'last_month', label: 'Último mes' },
    { value: 'last_3_months', label: 'Últimos 3 meses' },
    { value: 'last_6_months', label: 'Últimos 6 meses' },
    { value: 'last_year', label: 'Último año' },
    { value: 'custom', label: 'Rango personalizado' },
  ];

  const recordTypeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'diagnosis', label: 'Diagnósticos' },
    { value: 'treatment', label: 'Tratamientos' },
    { value: 'test', label: 'Exámenes' },
    { value: 'surgery', label: 'Cirugías' },
    { value: 'emergency', label: 'Emergencias' },
  ];

  const doctorOptions = [
    { value: 'all', label: 'Todos los médicos' },
    { value: 'dr_mendoza', label: 'Dr. Carlos Mendoza - Cardiólogo' },
    { value: 'dra_rodriguez', label: 'Dra. Ana Rodríguez - Dermatóloga' },
    { value: 'dr_garcia', label: 'Dr. Luis García - Internista' },
    { value: 'dra_martinez', label: 'Dra. María Martínez - Pediatra' },
    { value: 'dr_lopez', label: 'Dr. José López - Neurólogo' },
  ];

  const severityOptions = [
    { value: 'all', label: 'Todas las severidades' },
    { value: 'mild', label: 'Leve' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'severe', label: 'Grave' },
    { value: 'critical', label: 'Crítico' },
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    const filters = { query: searchQuery, dateRange, recordType, doctor, severity };
    onSearch?.(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateRange('all');
    setRecordType('all');
    setDoctor('all');
    setSeverity('all');
    onFilter?.({
      query: '',
      dateRange: 'all',
      recordType: 'all',
      doctor: 'all',
      severity: 'all',
    });
  };

  const hasActiveFilters =
    !!searchQuery || dateRange !== 'all' || recordType !== 'all' || doctor !== 'all' || severity !== 'all';

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Búsqueda */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Icon
            name="Search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Buscar diagnósticos, tratamientos, médicos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10 pr-12"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
            >
              <Icon name="X" size={14} />
            </Button>
          )}
        </div>
      </form>

      {/* Acciones rápidas */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAdvancedOpen((v) => !v)}>
            <Icon name="Filter" size={14} className="mr-2" />
            Filtros Avanzados
            <Icon name={isAdvancedOpen ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-2" />
          </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={14} className="mr-1" />
            Limpiar Filtros
          </Button>
        )}
        </div>

        {/* 🔕 Sin botones de export aquí */}
      </div>

      {/* Filtros avanzados */}
      {isAdvancedOpen && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Período" options={dateRangeOptions} value={dateRange} onChange={setDateRange} />
            <Select label="Tipo de Registro" options={recordTypeOptions} value={recordType} onChange={setRecordType} />
            <Select label="Médico" options={doctorOptions} value={doctor} onChange={setDoctor} searchable />
            <Select label="Severidad" options={severityOptions} value={severity} onChange={setSeverity} />
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <Input type="date" label="Fecha de Inicio" />
              <Input type="date" label="Fecha de Fin" />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {hasActiveFilters ? 'Filtros aplicados' : 'Sin filtros aplicados'}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearFilters} disabled={!hasActiveFilters}>
                Limpiar
              </Button>
              <Button variant="default" size="sm" onClick={handleSearch}>
                <Icon name="Search" size={14} className="mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chips de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">Filtros activos:</span>

            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                Búsqueda: “{searchQuery}”
                <Button variant="ghost" size="icon" onClick={() => setSearchQuery('')} className="w-4 h-4 ml-1">
                  <Icon name="X" size={10} />
                </Button>
              </span>
            )}

            {dateRange !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                {dateRangeOptions.find((o) => o.value === dateRange)?.label}
                <Button variant="ghost" size="icon" onClick={() => setDateRange('all')} className="w-4 h-4 ml-1">
                  <Icon name="X" size={10} />
                </Button>
              </span>
            )}

            {recordType !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                {recordTypeOptions.find((o) => o.value === recordType)?.label}
                <Button variant="ghost" size="icon" onClick={() => setRecordType('all')} className="w-4 h-4 ml-1">
                  <Icon name="X" size={10} />
                </Button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
