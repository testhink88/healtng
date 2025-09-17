import React, { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ClinicMarketplaceHub = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock analytics data específica para clínica
  const analyticsData = useMemo(() => ({
    recentPurchases: [
      { id: 1, name: 'Jeringas desechables 10ml', date: '2025-09-01', amount: 250.00, status: 'delivered' },
      { id: 2, name: 'Guantes de látex caja x100', date: '2025-08-28', amount: 85.50, status: 'delivered' },
      { id: 3, name: 'Equipo de sutura', date: '2025-08-25', amount: 420.00, status: 'pending' }
    ],
    totalSpent: 2450.75,
    activeOrders: 3,
    preferredproviders: [
      { id: 1, name: 'MediSupply Pro', discount: '15%', rating: 4.8 },
      { id: 2, name: 'LabEquip CA', discount: '12%', rating: 4.6 },
      { id: 3, name: 'PharmaPlus', discount: '10%', rating: 4.7 }
    ]
  }), []);

  const SubNavigation = () => (
    <div className="bg-card border-b border-border">
      <div className="flex items-center space-x-6 px-6 py-3 overflow-x-auto">
        <button
          onClick={() => navigate("/clinic-dashboard")}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors whitespace-nowrap"
        >
          <Icon name="Home" size={16} />
          <span>Panel Principal</span>
        </button>
        
        <button
          onClick={() => navigate("/clinic/purchase-orders")}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors whitespace-nowrap"
        >
          <Icon name="ShoppingCart" size={16} />
          <span>Órdenes de Compra</span>
        </button>
        
        <button
          onClick={() => navigate("/clinic-appointments-management")}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors whitespace-nowrap"
        >
          <Icon name="Calendar" size={16} />
          <span>Gestión de Consultas</span>
        </button>
        
        <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-md transition-colors whitespace-nowrap">
          <Icon name="Store" size={16} />
          <span>Marketplace</span>
        </button>
      </div>
    </div>
  );

  const handleB2BAccess = () => {
    navigate('/marketplace/b2b');
  };

  const handleQuotationRequest = () => {
    navigate('/marketplace/b2b?tab=quotations');
  };

  const handleInventoryReorder = () => {
    navigate('/clinic/inventory?filter=low-stock');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <SubNavigation />
        
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Marketplace Profesional</h1>
                <p className="text-lg text-muted-foreground">
                  Acceso directo a proveedores B2B y gestión de compras institucionales
                </p>
              </div>
            </div>
          </div>

          {/* Main B2B Card */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Building2 className="h-12 w-12 mb-4 opacity-90" />
                    <h2 className="text-2xl font-bold mb-2">Marketplace Profesional (B2B)</h2>
                    <p className="text-white/90 mb-4">
                      Acceso a catálogo especializado de insumos médicos y equipos profesionales
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-white/70 mb-1">Insumos</div>
                    <div className="text-lg font-semibold">5,000+</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-white/70 mb-1">Proveedores</div>
                    <div className="text-lg font-semibold">80+</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-white/70 mb-1">Descuentos</div>
                    <div className="text-lg font-semibold">Hasta 30%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-xs text-white/70 mb-1">Entrega</div>
                    <div className="text-lg font-semibold">24-48h</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-300" />
                    <span>Precios por volumen y mayoreo</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-300" />
                    <span>Equipos médicos certificados</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-300" />
                    <span>Órdenes de compra empresariales</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Icon name="Check" size={16} className="text-green-300" />
                    <span>Soporte técnico especializado</span>
                  </li>
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleB2BAccess}
                    className="bg-white text-purple-600 hover:bg-white/90 font-medium"
                  >
                    Comprar en B2B
                  </Button>
                  <Button 
                    onClick={handleQuotationRequest}
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                  >
                    Solicitar Cotización
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Shortcuts */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Accesos Rápidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/marketplace/b2b?category=medical-supplies')}
                className="h-auto p-4 justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Insumos Médicos</div>
                    <div className="text-sm text-muted-foreground">Jeringas, guantes, material quirúrgico</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/marketplace/b2b?category=equipment')}
                className="h-auto p-4 justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="font-medium">Equipos Médicos</div>
                    <div className="text-sm text-muted-foreground">Monitores, bombas, ventiladores</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={handleInventoryReorder}
                className="h-auto p-4 justify-start text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                  </div>
                  <div>
                    <div className="font-medium">Reposición Automática</div>
                    <div className="text-sm text-muted-foreground">Productos con stock bajo</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Procurement Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Purchases */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compras Recientes</h3>
              <div className="space-y-3">
                {analyticsData?.recentPurchases?.map((purchase) => (
                  <div key={purchase?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{purchase?.name}</div>
                      <div className="text-sm text-muted-foreground">{purchase?.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">${purchase?.amount?.toFixed(2)}</div>
                      <div className={`text-xs ${
                        purchase?.status === 'delivered' ? 'text-success' : 'text-warning'
                      }`}>
                        {purchase?.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred providers */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Proveedores Preferidos</h3>
              <div className="space-y-3">
                {analyticsData?.preferredproviders?.map((provider) => (
                  <div key={provider?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{provider?.name}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Star" size={14} className="text-warning fill-current" />
                        <span>{provider?.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-success">-{provider?.discount}</div>
                      <div className="text-xs text-muted-foreground">descuento</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Gasto Total (30 días)</div>
              <div className="text-2xl font-semibold text-foreground mt-1">
                ${analyticsData?.totalSpent?.toFixed(2)}
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Órdenes Activas</div>
              <div className="text-2xl font-semibold text-primary mt-1">
                {analyticsData?.activeOrders}
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Ahorro Promedio</div>
              <div className="text-2xl font-semibold text-success mt-1">
                18%
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClinicMarketplaceHub;