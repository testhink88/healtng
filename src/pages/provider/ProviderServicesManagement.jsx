import React, { useState, useEffect, useMemo } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

const ProviderServicesManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);

  // Mock business type
  const [businessType] = useState('mixto'); // pharmacy, laboratory, optical, mixto

  // Mock services data
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Consulta Farmacológica',
      category: 'pharmacy',
      priceUSD: 15.00,
      priceVES: 550.00,
      availability: 'active',
      rating: 4.8,
      completionTime: '30 min',
      satisfaction: 96,
      requiresOrder: true,
      certifications: ['Farmacología Clínica'],
      description: 'Revisión de medicamentos y asesoramiento farmacológico personalizado'
    },
    {
      id: 2,
      name: 'Examen Visual Completo',
      category: 'optical',
      priceUSD: 25.00,
      priceVES: 920.00,
      availability: 'active',
      rating: 4.9,
      completionTime: '45 min',
      satisfaction: 98,
      requiresOrder: false,
      certifications: ['Optometría'],
      description: 'Evaluación completa de la salud visual y refracción'
    },
    {
      id: 3,
      name: 'Análisis de Sangre Completo',
      category: 'laboratory',
      priceUSD: 35.00,
      priceVES: 1285.00,
      availability: 'active',
      rating: 4.7,
      completionTime: '2-4 hours',
      satisfaction: 94,
      requiresOrder: true,
      certifications: ['Laboratorio Clínico'],
      description: 'Hemograma completo con diferencial y química sanguínea básica'
    },
    {
      id: 4,
      name: 'Adaptación de Lentes de Contacto',
      category: 'optical',
      priceUSD: 20.00,
      priceVES: 735.00,
      availability: 'inactive',
      rating: 4.6,
      completionTime: '60 min',
      satisfaction: 92,
      requiresOrder: false,
      certifications: ['Contactología'],
      description: 'Evaluación y adaptación personalizada de lentes de contacto'
    },
    {
      id: 5,
      name: 'Perfil Lipídico',
      category: 'laboratory',
      priceUSD: 22.00,
      priceVES: 810.00,
      availability: 'active',
      rating: 4.8,
      completionTime: '1-2 hours',
      satisfaction: 97,
      requiresOrder: true,
      certifications: ['Bioquímica Clínica'],
      description: 'Análisis completo de colesterol, triglicéridos y lipoproteínas'
    }
  ]);

  // Filter services based on business type and availability
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by business type
    if (businessType !== 'mixto') {
      filtered = filtered?.filter(service => service?.category === businessType);
    }

    // Filter by availability tab
    filtered = filtered?.filter(service => {
      if (activeTab === 'active') return service?.availability === 'active';
      if (activeTab === 'catalog') return true; // Show all for catalog
      if (activeTab === 'pricing') return service?.availability === 'active';
      if (activeTab === 'analytics') return service?.availability === 'active';
      return true;
    });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered?.filter(service =>
        service?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        service?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(service => service?.category === selectedCategory);
    }

    return filtered;
  }, [services, businessType, activeTab, searchTerm, selectedCategory]);

  const getBusinessTypeServices = (type) => {
    switch (type) {
      case 'pharmacy':
        return ['Consultas Farmacológicas', 'Seguimiento Farmacoterapéutico'];
      case 'laboratory':
        return ['Análisis Clínicos', 'Toma de Muestras'];
      case 'optical':
        return ['Exámenes Visuales', 'Adaptación de Lentes'];
      default:
        return ['Servicios Farmacológicos', 'Análisis de Laboratorio', 'Servicios Ópticos'];
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'pharmacy': return 'Pill';
      case 'laboratory': return 'TestTube';
      case 'optical': return 'Eye';
      default: return 'Stethoscope';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'pharmacy': return 'Farmacia';
      case 'laboratory': return 'Laboratorio';
      case 'optical': return 'Óptica';
      default: return 'General';
    }
  };

  const handleServiceSelection = (serviceId) => {
    setSelectedServices(prev => 
      prev?.includes(serviceId) 
        ? prev?.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBulkPricing = () => {
    if (selectedServices?.length === 0) return;
    
    // Bulk pricing logic here
    alert(`Actualizando precios para ${selectedServices?.length} servicios seleccionados`);
  };

  const handleBulkAvailability = (availability) => {
    if (selectedServices?.length === 0) return;
    
    setServices(prev => prev?.map(service => 
      selectedServices?.includes(service?.id) 
        ? { ...service, availability }
        : service
    ));
    setSelectedServices([]);
  };

  const renderServiceCard = (service) => (
    <div key={service?.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={selectedServices?.includes(service?.id)}
            onChange={() => handleServiceSelection(service?.id)}
            className="mt-1 w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={getCategoryIcon(service?.category)} size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">{service?.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                service?.availability === 'active' ?'bg-green-100 text-green-800' :'bg-gray-100 text-gray-800'
              }`}>
                {service?.availability === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service?.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Icon name="Clock" size={12} className="mr-1" />
                {service?.completionTime}
              </span>
              <span className="flex items-center">
                <Icon name="Star" size={12} className="mr-1 text-yellow-500" />
                {service?.rating}
              </span>
              <span className="flex items-center">
                <Icon name="ThumbsUp" size={12} className="mr-1 text-green-500" />
                {service?.satisfaction}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="space-y-1">
            <p className="text-lg font-bold text-foreground">${service?.priceUSD}</p>
            <p className="text-sm text-muted-foreground">Bs. {service?.priceVES?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {service?.certifications?.map((cert, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {cert}
            </span>
          ))}
          {service?.requiresOrder && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              Requiere orden
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Edit" size={14} className="mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="BarChart3" size={14} className="mr-1" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={14} className="mr-1" />
            Config
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Gestión de Servicios</h1>
        <p className="text-muted-foreground">
          Administra tu portafolio de servicios - Negocio tipo: {businessType === 'mixto' ? 'Mixto' : getCategoryLabel(businessType)}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {[
            { key: 'active', label: 'Servicios Activos', icon: 'CheckCircle' },
            { key: 'catalog', label: 'Catálogo Completo', icon: 'Grid' },
            { key: 'pricing', label: 'Gestión de Precios', icon: 'DollarSign' },
            { key: 'analytics', label: 'Analíticas', icon: 'BarChart3' }
          ]?.map(tab => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab?.key
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          {businessType === 'mixto' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e?.target?.value)}
              className="px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todas las categorías</option>
              <option value="pharmacy">Farmacia</option>
              <option value="laboratory">Laboratorio</option>
              <option value="optical">Óptica</option>
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {selectedServices?.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-sm text-muted-foreground">
                {selectedServices?.length} seleccionados
              </span>
              <Button variant="outline" size="sm" onClick={handleBulkPricing}>
                <Icon name="DollarSign" size={14} className="mr-1" />
                Precios
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAvailability('active')}>
                <Icon name="CheckCircle" size={14} className="mr-1" />
                Activar
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAvailability('inactive')}>
                <Icon name="XCircle" size={14} className="mr-1" />
                Desactivar
              </Button>
            </div>
          )}
          
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-4">
        {filteredServices?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron servicios</h3>
            <p className="text-muted-foreground mb-4">
              Ajusta los filtros o crea un nuevo servicio para comenzar
            </p>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Agregar Primer Servicio
            </Button>
          </div>
        ) : (
          filteredServices?.map(renderServiceCard)
        )}
      </div>

      {/* Summary Stats */}
      {activeTab === 'analytics' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Servicios Activos</h4>
            <p className="text-2xl font-bold text-foreground">{services?.filter(s => s?.availability === 'active')?.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Rating Promedio</h4>
            <p className="text-2xl font-bold text-foreground">
              {(services?.reduce((acc, s) => acc + s?.rating, 0) / services?.length)?.toFixed(1)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Satisfacción Promedio</h4>
            <p className="text-2xl font-bold text-foreground">
              {Math.round(services?.reduce((acc, s) => acc + s?.satisfaction, 0) / services?.length)}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Precio Promedio</h4>
            <p className="text-2xl font-bold text-foreground">
              ${(services?.reduce((acc, s) => acc + s?.priceUSD, 0) / services?.length)?.toFixed(0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderServicesManagement;