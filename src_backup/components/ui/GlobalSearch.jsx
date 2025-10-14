import React, { useState, useEffect, useRef } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalSearch = ({ 
  userRole = 'patient', 
  placeholder = 'Buscar médicos, servicios, medicamentos...',
  className = '',
  onSearchResult,
  variant = 'default' // 'default', 'compact', 'hero'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search data based on user role
  const getSearchData = () => {
    const baseData = {
      patient: [
        { type: 'doctor', title: 'Dr. Carlos Mendoza', subtitle: 'Cardiólogo - Caracas', icon: 'User', href: '/doctor-discovery' },
        { type: 'doctor', title: 'Dra. Ana Rodríguez', subtitle: 'Dermatóloga - Valencia', icon: 'User', href: '/doctor-discovery' },
        { type: 'service', title: 'Consulta Cardiológica', subtitle: 'Evaluación cardiovascular completa', icon: 'Heart', href: '/appointment-booking' },
        { type: 'service', title: 'Examen Dermatológico', subtitle: 'Revisión de piel y lunares', icon: 'Eye', href: '/appointment-booking' },
        { type: 'medication', title: 'Losartán 50mg', subtitle: 'Antihipertensivo - 30 tabletas', icon: 'Pill', href: '/prescription-management' },
        { type: 'medication', title: 'Metformina 850mg', subtitle: 'Antidiabético - 60 tabletas', icon: 'Pill', href: '/prescription-management' },
        { type: 'product', title: 'Tensiómetro Digital', subtitle: 'Monitor de presión arterial', icon: 'Activity', href: '/marketplace' },
        { type: 'product', title: 'Glucómetro', subtitle: 'Medidor de glucosa en sangre', icon: 'Zap', href: '/marketplace' }
      ],
      doctor: [
        { type: 'patient', title: 'María González', subtitle: 'Paciente - Última cita: 15/08/2025', icon: 'User', href: '/patient-management' },
        { type: 'patient', title: 'José Martínez', subtitle: 'Paciente - Próxima cita: 18/08/2025', icon: 'User', href: '/patient-management' },
        { type: 'appointment', title: 'Cita 10:00 AM', subtitle: 'María González - Consulta de control', icon: 'Calendar', href: '/appointment-booking' },
        { type: 'appointment', title: 'Cita 2:30 PM', subtitle: 'José Martínez - Primera consulta', icon: 'Calendar', href: '/appointment-booking' },
        { type: 'space', title: 'Consultorio A', subtitle: 'Disponible hoy 3:00 PM - 6:00 PM', icon: 'Building', href: '/space-reservation' },
        { type: 'medication', title: 'Atorvastatina', subtitle: 'Medicamento cardiovascular', icon: 'Pill', href: '/prescription-management' },
        { type: 'supply', title: 'Estetoscopio Littmann', subtitle: 'Equipo médico profesional', icon: 'Stethoscope', href: '/marketplace' }
      ],
      specialist: [
        { type: 'patient', title: 'Carmen Silva', subtitle: 'Paciente especializada - Cardiología', icon: 'User', href: '/patient-management' },
        { type: 'procedure', title: 'Ecocardiograma', subtitle: 'Procedimiento diagnóstico', icon: 'Activity', href: '/procedures' },
        { type: 'appointment', title: 'Consulta Especializada', subtitle: 'Evaluación cardiovascular - 11:00 AM', icon: 'Calendar', href: '/appointment-booking' },
        { type: 'space', title: 'Sala de Procedimientos', subtitle: 'Equipada para ecocardiogramas', icon: 'Building', href: '/space-reservation' },
        { type: 'equipment', title: 'Ecógrafo Portátil', subtitle: 'Equipo de diagnóstico por imágenes', icon: 'Monitor', href: '/marketplace' }
      ]
    };

    return baseData?.[userRole] || baseData?.patient;
  };

  // Simulate search with debouncing
  useEffect(() => {
    if (!query?.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const searchData = getSearchData();
      const filteredResults = searchData?.filter(item =>
        item?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
        item?.subtitle?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setResults(filteredResults?.slice(0, 6));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, userRole]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setActiveIndex(prev => (prev < results?.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e?.preventDefault();
        if (activeIndex >= 0 && results?.[activeIndex]) {
          handleResultClick(results?.[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  const handleResultClick = (result) => {
    onSearchResult?.(result);
    window.location.href = result?.href;
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'doctor': return 'UserCheck';
      case 'patient': return 'User';
      case 'service': return 'Stethoscope';
      case 'medication': return 'Pill';
      case 'product': return 'Package';
      case 'appointment': return 'Calendar';
      case 'space': return 'Building';
      case 'procedure': return 'Activity';
      case 'equipment': return 'Monitor';
      case 'supply': return 'Package2';
      default: return 'Search';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'doctor': return 'var(--color-primary)';
      case 'patient': return 'var(--color-secondary)';
      case 'service': return 'var(--color-success)';
      case 'medication': return 'var(--color-warning)';
      case 'appointment': return 'var(--color-primary)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  if (variant === 'compact') {
    return (
      <div ref={searchRef} className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef?.current?.focus(), 100);
          }}
          className="min-w-touch min-h-touch"
        >
          <Icon name="Search" size={20} />
        </Button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
            <div className="p-4">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e?.target?.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsOpen(true)}
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Search Results */}
            {(query?.trim() || results?.length > 0) && (
              <div className="border-t border-border max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-pulse-slow">
                      <Icon name="Search" size={24} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Buscando...</p>
                    </div>
                  </div>
                ) : results?.length > 0 ? (
                  results?.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0 ${
                        index === activeIndex ? 'bg-accent/50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Icon name={getTypeIcon(result?.type)} size={16} color={getTypeColor(result?.type)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{result?.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{result?.subtitle}</p>
                        </div>
                        <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                      </div>
                    </div>
                  ))
                ) : query?.trim() ? (
                  <div className="p-4 text-center">
                    <Icon name="SearchX" size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div ref={searchRef} className={`relative ${className}`}>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e?.target?.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>
        {/* Search Results */}
        {isOpen && (query?.trim() || results?.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg animate-fade-in z-50">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-pulse-slow">
                  <Icon name="Search" size={32} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Buscando...</p>
                </div>
              </div>
            ) : results?.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results?.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result)}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0 ${
                      index === activeIndex ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon name={getTypeIcon(result?.type)} size={20} color={getTypeColor(result?.type)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{result?.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{result?.subtitle}</p>
                      </div>
                      <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : query?.trim() ? (
              <div className="p-6 text-center">
                <Icon name="SearchX" size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No se encontraron resultados para "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con términos diferentes o verifica la ortografía
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e?.target?.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>
      {/* Search Results */}
      {isOpen && (query?.trim() || results?.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg animate-fade-in z-50">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-pulse-slow">
                <Icon name="Search" size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Buscando...</p>
              </div>
            </div>
          ) : results?.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results?.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0 ${
                    index === activeIndex ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon name={getTypeIcon(result?.type)} size={14} color={getTypeColor(result?.type)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{result?.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result?.subtitle}</p>
                    </div>
                    <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ) : query?.trim() ? (
            <div className="p-4 text-center">
              <Icon name="SearchX" size={20} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No se encontraron resultados</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;