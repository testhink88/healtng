import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DEFAULT_FILTERS = {
  cohort: 'all',
  diagnosis: 'all',
  timePeriod: '90days',
  provider: 'all',
  searchTerm: ''
};

const PatientFiltersHeader = ({ onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(DEFAULT_FILTERS);

  // Mock options (puedes reemplazar por props o data real)
  const cohortOptions = useMemo(() => ([
    { value: 'all', label: 'Todos los pacientes' },
    { value: 'chronic', label: 'Crónicos' },
    { value: 'post-op', label: 'Post-operatorio' },
    { value: 'high-risk', label: 'Alto riesgo' },
    { value: 'new', label: 'Nuevos' }
  ]), []);

  const diagnosisOptions = useMemo(() => ([
    { value: 'all', label: 'Todos los diagnósticos' },
    { value: 'cardio', label: 'Cardiología' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'resp', label: 'Respiratorio' },
    { value: 'neuro', label: 'Neurología' }
  ]), []);

  const timeOptions = useMemo(() => ([
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: '90days', label: 'Últimos 90 días' },
    { value: '180days', label: 'Últimos 180 días' },
    { value: '1year', label: 'Último año' }
  ]), []);

  const providerOptions = useMemo(() => ([
    { value: 'all', label: 'Todos los proveedores' },
    { value: 'team-a', label: 'Equipo A' },
    { value: 'team-b', label: 'Equipo B' },
    { value: 'team-c', label: 'Equipo C' }
  ]), []);

  // Notify parent on any change
  useEffect(() => {
    onFiltersChange && onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  const update = (patch) => {
    setLocalFilters(prev => ({ ...prev, ...patch }));
  };

  const handleClear = () => {
    setLocalFilters(DEFAULT_FILTERS);
  };

  const activePills = useMemo(() => {
    const pills = [];
    if (localFilters.cohort !== 'all') pills.push({ key: 'cohort', label: 'Cohorte' });
    if (localFilters.diagnosis !== 'all') pills.push({ key: 'diagnosis', label: 'Diagnóstico' });
    if (localFilters.provider !== 'all') pills.push({ key: 'provider', label: 'Proveedor' });
    if (localFilters.timePeriod !== '90days') pills.push({ key: 'timePeriod', label: 'Periodo' });
    if (localFilters.searchTerm?.trim()) pills.push({ key: 'searchTerm', label: 'Búsqueda' });
    return pills;
  }, [localFilters]);

  return (
    <div className="bg-card border border-border rounded-lg healthcare-shadow p-6 mb-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left: Title */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon name="Filter" size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Filtros de Cohorte</h2>
            <p className="text-sm text-muted-foreground">
              Segmenta resultados y alinea la vista con objetivos clínicos y operativos.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {activePills.length > 0 && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              {activePills.map(p => (
                <span
                  key={p.key}
                  className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {p.label}
                </span>
              ))}
            </div>
          )}
          <Button variant="outline" onClick={handleClear} className="text-xs">
            Limpiar
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Cohorte</label>
          <select
            value={localFilters.cohort}
            onChange={(e) => update({ cohort: e.target.value })}
            className="w-full mt-1 text-sm border border-border rounded-lg px-3 py-2 bg-input"
          >
            {cohortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Diagnóstico</label>
          <select
            value={localFilters.diagnosis}
            onChange={(e) => update({ diagnosis: e.target.value })}
            className="w-full mt-1 text-sm border border-border rounded-lg px-3 py-2 bg-input"
          >
            {diagnosisOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Periodo</label>
          <select
            value={localFilters.timePeriod}
            onChange={(e) => update({ timePeriod: e.target.value })}
            className="w-full mt-1 text-sm border border-border rounded-lg px-3 py-2 bg-input"
          >
            {timeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Proveedor</label>
          <select
            value={localFilters.provider}
            onChange={(e) => update({ provider: e.target.value })}
            className="w-full mt-1 text-sm border border-border rounded-lg px-3 py-2 bg-input"
          >
            {providerOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Buscar paciente</label>
          <div className="mt-1 flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input">
            <Icon name="Search" size={14} className="text-muted-foreground" />
            <input
              value={localFilters.searchTerm}
              onChange={(e) => update({ searchTerm: e.target.value })}
              placeholder="Nombre, ID, condición..."
              className="w-full text-sm bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFiltersHeader;
