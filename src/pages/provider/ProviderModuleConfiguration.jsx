import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import { cn } from '../../utils/cn';
import { getBusinessContext } from '../../utils/mockData';

const ProviderModuleConfiguration = () => {
  const navigate = useNavigate();
  const [businessContext, setBusinessContext] = useState(getBusinessContext());
  const [isLoading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Module configuration state
  const [moduleConfiguration, setModuleConfiguration] = useState({
    inventario: true,
    agenda: true,
    pedidos: true,
    despacho: true,
    facturacion: true,
    marketplace: true,
    rx_intake: false,
    autorizaciones: false,
    analiticas: true
  });

  // Business type state
  const [businessType, setBusinessType] = useState('producto');
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState(['farmacia']);

  // Business type definitions based on normalized schema requirements
  const businessTypes = [
    {
      id: 'producto',
      name: 'Producto-Based',
      description: 'Farmacias, Droguerías, Distribuidores, Tiendas de Equipos Médicos',
      icon: 'Package',
      modules: ['inventario', 'pedidos', 'despacho', 'facturacion', 'marketplace', 'analiticas'],
      color: 'bg-blue-50 border-blue-200',
      examples: ['Farmacia', 'Droguería', 'Distribuidor', 'Tienda de Equipos Médicos']
    },
    {
      id: 'servicio',
      name: 'Service-Based',
      description: 'Clínicas, Laboratorios, Imagenología, Estética Médica, Vacunación',
      icon: 'Stethoscope',
      modules: ['agenda', 'pedidos', 'rx_intake', 'autorizaciones', 'analiticas'],
      color: 'bg-green-50 border-green-200',
      examples: ['Clínica', 'Laboratorio', 'Imagenología', 'Estética Médica', 'Telemedicina', 'Salud Ocupacional']
    },
    {
      id: 'mixto',
      name: 'Mixed Business',
      description: 'Ópticas, Centros de Rehabilitación Integral, Clínicas con farmacia interna',
      icon: 'Building',
      modules: ['inventario', 'agenda', 'pedidos', 'despacho', 'facturacion', 'rx_intake', 'autorizaciones', 'marketplace', 'analiticas'],
      color: 'bg-purple-50 border-purple-200',
      examples: ['Óptica', 'Centro de Rehabilitación Integral', 'Clínica con farmacia interna']
    }
  ];

  // Available modules with descriptions and integrations
  const availableModules = [
    {
      key: 'inventario',
      name: 'Inventory Management',
      description: 'Complete inventory control with product hierarchy, stock management, and reorder points',
      icon: 'Package',
      features: ['Product catalog', 'Stock tracking', 'Reorder alerts', 'Category management'],
      integrations: ['POS Systems', 'ERP Integration'],
      category: 'operations'
    },
    {
      key: 'agenda',
      name: 'Service Portfolio',
      description: 'Service management with appointment scheduling and resource allocation',
      icon: 'Calendar',
      features: ['Service catalog', 'Appointment booking', 'Resource scheduling', 'Availability management'],
      integrations: ['Calendar systems', 'Payment processors'],
      category: 'services'
    },
    {
      key: 'pedidos',
      name: 'Order Processing',
      description: 'Advanced order management with automated workflows and tracking',
      icon: 'ShoppingCart',
      features: ['Order queue', 'Workflow automation', 'Status tracking', 'Customer notifications'],
      integrations: ['Payment gateways', 'Shipping services'],
      category: 'operations'
    },
    {
      key: 'despacho',
      name: 'Dispatch Coordination',
      description: 'Shipping and logistics management with real-time tracking',
      icon: 'Truck',
      features: ['Shipment tracking', 'Route optimization', 'Delivery confirmation', 'Carrier integration'],
      integrations: ['Logistics providers', 'GPS tracking'],
      category: 'logistics'
    },
    {
      key: 'facturacion',
      name: 'Billing Operations',
      description: 'Comprehensive billing with automated invoicing and payment tracking',
      icon: 'Receipt',
      features: ['Invoice generation', 'Payment tracking', 'Tax calculation', 'Financial reports'],
      integrations: ['Accounting software', 'Tax systems'],
      category: 'financial'
    },
    {
      key: 'marketplace',
      name: 'B2B Marketplace',
      description: 'Business-to-business marketplace integration and management',
      icon: 'Building2',
      features: ['Marketplace listings', 'Bulk orders', 'Partner management', 'Commission tracking'],
      integrations: ['External marketplaces', 'Partner APIs'],
      category: 'sales'
    },
    {
      key: 'rx_intake',
      name: 'Rx Intake',
      description: 'Prescription processing and validation with medical order requirements',
      icon: 'FileText',
      features: ['Prescription validation', 'Medical order processing', 'Drug interactions', 'Compliance checks'],
      integrations: ['Pharmacy management software', 'Medical databases'],
      category: 'healthcare'
    },
    {
      key: 'autorizaciones',
      name: 'Authorizations',
      description: 'Medical authorizations and insurance claim processing',
      icon: 'Shield',
      features: ['Prior authorization', 'Insurance verification', 'Claim processing', 'Documentation management'],
      integrations: ['Insurance systems', 'Healthcare networks'],
      category: 'healthcare'
    },
    {
      key: 'analiticas',
      name: 'Analytics Dashboard',
      description: 'Business intelligence with KPIs, reports, and performance metrics',
      icon: 'BarChart3',
      features: ['KPI tracking', 'Custom reports', 'Performance metrics', 'Trend analysis'],
      integrations: ['BI tools', 'Data warehouses'],
      category: 'analytics'
    }
  ];

  // Handle module toggle
  const handleModuleToggle = (moduleKey) => {
    setModuleConfiguration(prev => {
      const newConfig = { ...prev, [moduleKey]: !prev?.[moduleKey] };
      setHasChanges(true);
      return newConfig;
    });
  };

  // Handle business type change
  const handleBusinessTypeChange = (typeId) => {
    setBusinessType(typeId);
    setHasChanges(true);
    
    // Auto-enable recommended modules for selected business type
    const selectedType = businessTypes?.find(type => type?.id === typeId);
    if (selectedType) {
      const newModuleConfig = { ...moduleConfiguration };
      
      // Reset all modules first
      Object.keys(newModuleConfig)?.forEach(key => {
        newModuleConfig[key] = false;
      });
      
      // Enable recommended modules
      selectedType?.modules?.forEach(module => {
        newModuleConfig[module] = true;
      });
      
      setModuleConfiguration(newModuleConfig);
    }
  };

  // Save configuration
  const handleSaveConfiguration = async () => {
    setSaving(true);
    
    try {
      // Simulate API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update business context
      setBusinessContext({
        ...businessContext,
        businessType: businessTypes?.find(type => type?.id === businessType)?.name || businessType
      });
      
      setHasChanges(false);
      
      // Show success notification (you could add a toast here)
      alert('Configuración guardada exitosamente');
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  // Get enabled modules for preview
  const getEnabledModules = () => {
    return availableModules?.filter(module => moduleConfiguration?.[module?.key]);
  };

  // Module category grouping
  const modulesByCategory = availableModules?.reduce((acc, module) => {
    if (!acc?.[module?.category]) {
      acc[module?.category] = [];
    }
    acc?.[module?.category]?.push(module);
    return acc;
  }, {});

  const categoryLabels = {
    operations: 'Operations',
    services: 'Services',
    logistics: 'Logistics',
    financial: 'Financial',
    sales: 'Sales',
    healthcare: 'Healthcare',
    analytics: 'Analytics'
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Provider Module Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your business capabilities and module activations for scalable provider operations
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              iconName="Eye"
            >
              {showPreview ? 'Hide Preview' : 'Preview Changes'}
            </Button>
            
            <Button
              onClick={handleSaveConfiguration}
              disabled={!hasChanges}
              loading={isLoading}
              iconName="Save"
            >
              Save Configuration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Configuration Panel */}
          <div className="xl:col-span-3 space-y-6">
            {/* Business Type Selection */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Building" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Business Type</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your primary business model to auto-configure recommended modules
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businessTypes?.map((type) => (
                  <div
                    key={type?.id}
                    className={cn(
                      "relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                      businessType === type?.id 
                        ? `${type?.color} border-primary shadow-md` 
                        : "bg-card border-border hover:border-primary/50"
                    )}
                    onClick={() => handleBusinessTypeChange(type?.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        businessType === type?.id ? "bg-primary/20" : "bg-muted"
                      )}>
                        <Icon name={type?.icon} size={18} className={
                          businessType === type?.id ? "text-primary" : "text-muted-foreground"
                        } />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">{type?.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{type?.description}</p>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                          <div className="flex flex-wrap gap-1">
                            {type?.examples?.slice(0, 2)?.map((example, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                              >
                                {example}
                              </span>
                            ))}
                            {type?.examples?.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                                +{type?.examples?.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {businessType === type?.id && (
                        <div className="absolute top-2 right-2">
                          <Icon name="CheckCircle" size={20} className="text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module Configuration */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Settings" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Module Activation</h2>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable specific business capabilities based on your operational needs
                  </p>
                </div>
              </div>

              {Object.entries(modulesByCategory)?.map(([category, modules]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-md font-medium text-foreground mb-4 flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary/20 rounded"></div>
                    {categoryLabels?.[category]}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules?.map((module) => (
                      <div
                        key={module?.key}
                        className={cn(
                          "border rounded-lg p-4 transition-all",
                          moduleConfiguration?.[module?.key] 
                            ? "border-primary/50 bg-primary/5" :"border-border bg-card hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon 
                              name={module?.icon} 
                              size={20} 
                              className={moduleConfiguration?.[module?.key] ? "text-primary" : "text-muted-foreground"} 
                            />
                            <div>
                              <h4 className="font-medium text-foreground">{module?.name}</h4>
                            </div>
                          </div>
                          
                          <Checkbox
                            checked={moduleConfiguration?.[module?.key]}
                            onChange={() => handleModuleToggle(module?.key)}
                          />
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {module?.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Key Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {module?.features?.slice(0, 3)?.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-muted/50 rounded text-muted-foreground"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {module?.integrations?.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Integrations:</p>
                              <div className="flex flex-wrap gap-1">
                                {module?.integrations?.map((integration, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-accent/50 rounded text-accent-foreground"
                                  >
                                    {integration}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Preview and Information */}
          <div className="space-y-6">
            {/* Configuration Summary */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Info" size={16} className="text-primary" />
                <h3 className="font-medium text-foreground">Configuration Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Business Type:</p>
                  <p className="text-sm text-foreground">
                    {businessTypes?.find(type => type?.id === businessType)?.name || 'Not selected'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Modules:</p>
                  <p className="text-sm text-foreground">
                    {getEnabledModules()?.length} of {availableModules?.length} enabled
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      hasChanges ? "bg-warning" : "bg-success"
                    )} />
                    <p className="text-sm text-foreground">
                      {hasChanges ? 'Unsaved changes' : 'Configuration saved'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Preview */}
            {showPreview && (
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Eye" size={16} className="text-primary" />
                  <h3 className="font-medium text-foreground">Sidebar Preview</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-primary/10 text-primary rounded">
                    <Icon name="Home" size={16} />
                    <span>Dashboard</span>
                  </div>
                  
                  {getEnabledModules()?.map((module) => (
                    <div key={module?.key} className="flex items-center gap-2 p-2 text-muted-foreground">
                      <Icon name={module?.icon} size={16} />
                      <span className="text-sm">{module?.name}</span>
                    </div>
                  ))}
                </div>
                
                {getEnabledModules()?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No modules enabled
                  </p>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-medium text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="RotateCcw"
                  onClick={() => {
                    setModuleConfiguration({
                      inventario: true,
                      agenda: true,
                      pedidos: true,
                      despacho: true,
                      facturacion: true,
                      marketplace: true,
                      rx_intake: false,
                      autorizaciones: false,
                      analiticas: true
                    });
                    setHasChanges(true);
                  }}
                >
                  Reset to Default
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="CheckSquare"
                  onClick={() => {
                    const allEnabled = {};
                    availableModules?.forEach(module => {
                      allEnabled[module?.key] = true;
                    });
                    setModuleConfiguration(allEnabled);
                    setHasChanges(true);
                  }}
                >
                  Enable All Modules
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Square"
                  onClick={() => {
                    const allDisabled = {};
                    availableModules?.forEach(module => {
                      allDisabled[module?.key] = false;
                    });
                    // Keep analytics always enabled
                    allDisabled.analiticas = true;
                    setModuleConfiguration(allDisabled);
                    setHasChanges(true);
                  }}
                >
                  Disable All (Keep Analytics)
                </Button>
              </div>
            </div>

            {/* Help and Documentation */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="HelpCircle" size={16} className="text-primary" />
                <h3 className="font-medium text-foreground">Need Help?</h3>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Book"
                  onClick={() => navigate('/docs/modules')}
                >
                  Module Documentation
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="MessageCircle"
                  onClick={() => navigate('/support')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderModuleConfiguration;