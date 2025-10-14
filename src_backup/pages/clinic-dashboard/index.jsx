import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { mockInventoryData, isLowStock, isExpiringSoon } from '../../utils/inventory';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock data for dashboard metrics
  const [dashboardData, setDashboardData] = useState({
    lowStockItems: 0,
    expiringItems: 0,
    openOrders: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    staffUtilization: 0,
    spaceOccupancy: 0,
    todayBookings: 0,
    spacesRevenue: 0
  });

  useEffect(() => {
    // Calculate inventory metrics
    const lowStockCount = mockInventoryData?.filter(isLowStock)?.length;
    const expiringCount = mockInventoryData?.filter(isExpiringSoon)?.length;

    setDashboardData({
      lowStockItems: lowStockCount,
      expiringItems: expiringCount,
      openOrders: 3,
      todayAppointments: 12,
      monthlyRevenue: 45670,
      staffUtilization: 87,
      spaceOccupancy: 72,
      todayBookings: 8,
      spacesRevenue: 15240
    });
  }, []);

  const handleNavigateToInventory = () => {
    navigate('/clinic-inventory-management');
  };

  const handleNavigateToOrders = () => {
    navigate('/clinic/purchase-orders');
  };

  const handleNavigateToB2B = () => {
    navigate('/marketplace/b2b');
  };

  const handleNavigateToSpaces = () => {
    navigate('/clinic/spaces');
  };

  const KPICard = ({ title, value, subtitle, icon, variant = 'default', onClick }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
        case 'danger':
          return 'bg-red-50 border-red-200 hover:bg-red-100';
        case 'success':
          return 'bg-green-50 border-green-200 hover:bg-green-100';
        default:
          return 'bg-white border-gray-200 hover:bg-gray-50';
      }
    };

    return (
      <div 
        className={`p-6 rounded-lg border transition-colors cursor-pointer ${getVariantClasses()}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon name={icon} size={24} className="text-primary" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Clínica</h1>
            <p className="text-gray-600">Gestión integral de la clínica y supervisión operativa</p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Volumen de Pacientes Hoy"
              value={dashboardData?.todayAppointments}
              subtitle="Citas programadas"
              icon="Users"
              variant="default"
              onClick={() => navigate('/appointment-booking')}
            />
            
            <KPICard
              title="Utilización del Personal"
              value={`${dashboardData?.staffUtilization}%`}
              subtitle="Eficiencia operativa"
              icon="Activity"
              variant="success"
              onClick={() => navigate('/staff-management')}
            />

            <KPICard
              title="Ocupación de Espacios"
              value={`${dashboardData?.spaceOccupancy}%`}
              subtitle="Utilización promedio"
              icon="Building"
              variant="success"
              onClick={handleNavigateToSpaces}
            />

            <KPICard
              title="Reservas de Hoy"
              value={dashboardData?.todayBookings}
              subtitle="Espacios reservados"
              icon="Calendar"
              variant="default"
              onClick={handleNavigateToSpaces}
            />
            
            <KPICard
              title="Ítems en Bajo Stock"
              value={dashboardData?.lowStockItems}
              subtitle="Requieren reposición"
              icon="AlertTriangle"
              variant="warning"
              onClick={handleNavigateToInventory}
            />
            
            <KPICard
              title="Próximos a Vencer"
              value={dashboardData?.expiringItems}
              subtitle="Próximos 60 días"
              icon="Clock"
              variant="danger"
              onClick={handleNavigateToInventory}
            />
          </div>

          {/* Revenue and Orders Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Ingresos Mensuales"
              value={`$${dashboardData?.monthlyRevenue?.toLocaleString()}`}
              subtitle="Facturación del mes actual"
              icon="DollarSign"
              variant="success"
              onClick={() => navigate('/financial-reports')}
            />

            <KPICard
              title="Ingresos de Espacios"
              value={`$${dashboardData?.spacesRevenue?.toLocaleString()}`}
              subtitle="Rentas del mes"
              icon="Building"
              variant="success"
              onClick={handleNavigateToSpaces}
            />
            
            <KPICard
              title="Órdenes de Compra Abiertas"
              value={dashboardData?.openOrders}
              subtitle="Pendientes de recibir"
              icon="ShoppingCart"
              variant="default"
              onClick={handleNavigateToOrders}
            />
          </div>

          {/* Quick Actions Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-20 space-x-3"
                onClick={handleNavigateToInventory}
              >
                <Icon name="Package" size={20} />
                <span>Ir a Inventario</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-20 space-x-3"
                onClick={handleNavigateToOrders}
              >
                <Icon name="FileText" size={20} />
                <span>Crear Orden de Compra</span>
              </Button>

              <Button 
                variant="outline" 
                className="flex items-center justify-center h-20 space-x-3"
                onClick={handleNavigateToSpaces}
              >
                <Icon name="Building" size={20} />
                <span>Alquilar Espacio</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center h-20 space-x-3"
                onClick={handleNavigateToB2B}
              >
                <Icon name="Store" size={20} />
                <span>Comprar en B2B</span>
              </Button>
            </div>
          </div>

          {/* Critical Alerts Panel */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Alertas Críticas</h2>
            <div className="space-y-4">
              {dashboardData?.lowStockItems > 0 && (
                <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Icon name="AlertTriangle" size={20} className="text-orange-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-orange-800">Bajo Stock</p>
                    <p className="text-sm text-orange-700">
                      {dashboardData?.lowStockItems} productos requieren reposición inmediata
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleNavigateToInventory}
                  >
                    Ver Detalles
                  </Button>
                </div>
              )}
              
              {dashboardData?.expiringItems > 0 && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="Clock" size={20} className="text-red-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Vencimientos Próximos</p>
                    <p className="text-sm text-red-700">
                      {dashboardData?.expiringItems} productos vencen en los próximos 60 días
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleNavigateToInventory}
                  >
                    Revisar
                  </Button>
                </div>
              )}
              
              <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Icon name="Calendar" size={20} className="text-blue-600 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Mantenimiento Programado</p>
                  <p className="text-sm text-blue-700">
                    Equipo de rayos X requiere mantenimiento el próximo martes
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/maintenance-schedule')}
                >
                  Programar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClinicDashboard;