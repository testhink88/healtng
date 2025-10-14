import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';

const DiagnosisSearch = ({ value, onChange, label, placeholder, required = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Mock ICD-10 diagnosis database
  const mockDiagnoses = [
    { id: 1, code: 'I20.9', name: 'Angina de pecho no especificada', category: 'Cardiovascular' },
    { id: 2, code: 'J44.1', name: 'Enfermedad pulmonar obstructiva crónica con exacerbación aguda', category: 'Respiratorio' },
    { id: 3, code: 'E11.9', name: 'Diabetes mellitus tipo 2 sin complicaciones', category: 'Endocrino' },
    { id: 4, code: 'I10', name: 'Hipertensión esencial', category: 'Cardiovascular' },
    { id: 5, code: 'M79.3', name: 'Paniculitis no especificada', category: 'Musculoesquelético' },
    { id: 6, code: 'K21.9', name: 'Enfermedad por reflujo gastroesofágico sin esofagitis', category: 'Digestivo' },
    { id: 7, code: 'F32.9', name: 'Episodio depresivo no especificado', category: 'Mental' },
    { id: 8, code: 'N39.0', name: 'Infección de vías urinarias, sitio no especificado', category: 'Genitourinario' }
  ];

  useEffect(() => {
    if (searchTerm && searchTerm?.length >= 2) {
      const filtered = mockDiagnoses?.filter(diagnosis =>
        diagnosis?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        diagnosis?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleSelectDiagnosis = (diagnosis) => {
    const fullDiagnosis = `${diagnosis?.code} - ${diagnosis?.name}`;
    
    if (typeof onChange === 'function') {
      if (required) {
        // For primary diagnosis, pass the string
        onChange(fullDiagnosis);
      } else {
        // For secondary diagnosis, pass the object
        onChange({ ...diagnosis, id: Date.now() });
      }
    }
    
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            value={required ? value : searchTerm}
            onChange={(e) => {
              if (required) {
                onChange(e?.target?.value);
              } else {
                setSearchTerm(e?.target?.value);
              }
            }}
            placeholder={placeholder || "Buscar diagnóstico por nombre o código ICD-10..."}
            className="pl-10"
          />
        </div>
      </div>
      {/* Search Results Dropdown */}
      {showResults && searchResults?.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults?.map((diagnosis) => (
            <button
              key={diagnosis?.id}
              onClick={() => handleSelectDiagnosis(diagnosis)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                      {diagnosis?.code}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded">
                      {diagnosis?.category}
                    </span>
                  </div>
                  <div className="font-medium text-foreground text-sm">
                    {diagnosis?.name}
                  </div>
                </div>
                <Icon name="Plus" size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
      {/* No Results */}
      {showResults && searchTerm?.length >= 2 && searchResults?.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4">
          <div className="text-center text-muted-foreground">
            <Icon name="Search" size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No se encontraron diagnósticos</p>
            <p className="text-xs">Intente con otros términos de búsqueda</p>
          </div>
        </div>
      )}
      {/* Info about ICD-10 */}
      <div className="mt-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Info" size={12} />
          <span>Búsqueda basada en codificación ICD-10 internacional</span>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisSearch;