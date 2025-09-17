import React from 'react';
import Select from 'components/ui/Select';

const SearchFilters = ({ filters, onFiltersChange }) => {
  const conditionOptions = [
    { value: '', label: 'Todas las condiciones' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hipertension', label: 'Hipertensión' },
    { value: 'asma', label: 'Asma' },
    { value: 'artritis', label: 'Artritis' },
    { value: 'obesidad', label: 'Obesidad' },
    { value: 'depresion', label: 'Depresión' }
  ];

  const lastVisitOptions = [
    { value: '', label: 'Cualquier fecha' },
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: '3months', label: 'Últimos 3 meses' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const handleFilterChange = (field, value) => {
    onFiltersChange?.({
      ...filters,
      [field]: value
    });
  };

  return (
    <>
      <Select
        value={filters?.condition}
        onValueChange={(value) => handleFilterChange('condition', value)}
        placeholder="Condición médica"
        options={conditionOptions}
      />
      <Select
        value={filters?.lastVisit}
        onValueChange={(value) => handleFilterChange('lastVisit', value)}
        placeholder="Última visita"
        options={lastVisitOptions}
      />
    </>
  );
};

export default SearchFilters;