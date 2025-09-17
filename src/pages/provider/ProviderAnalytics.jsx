import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProviderAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [businessType, setBusinessType] = useState('mixto');
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    // Mock analytics data
    const mockData = {
      revenue: {
        current: 458000,
        previous: 421000,
        change: 8.8,
        trend: 'up'
      },
      orders: {
        total: 147,
        products: 89,
        services: 58,
        avgValue: 3116
      },
      customers: {
        total: 234,
        new: 23,
        returning: 211,
        satisfaction: 4.7
      },
      inventory: {
        turnover: 3.2,
        lowStock: 12,
        outOfStock: 3,
        valueTotal: 890000
      },
      appointments: {
        scheduled: 156,
        completed: 142,
        cancelled: 8,
        noShow: 6
      },
      performance: {
        deliveryTime: 2.3,
        orderFulfillment: 94.5,
        customerRetention: 87.2,
        profitMargin: 23.5
      }
    };
    setAnalyticsData(mockData);
  }, [timeRange]);

  const timeRangeOptions = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Año' }
  ];

  const renderMetricCard = (title, value, icon, change = null, unit = '', description = '') => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={16} className="text-primary" />
        </div>
        {change !== null && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={change > 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={12} 
              className={change > 0 ? 'text-green-600' : 'text-red-600'}
            />
            <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground mb-1">
        {typeof value === 'number' && value > 1000 ? value?.toLocaleString() : value}{unit}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );

  const chartData = [
    { month: 'Ene', revenue: 380000, orders: 45 },
    { month: 'Feb', revenue: 420000, orders: 52 },
    { month: 'Mar', revenue: 458000, orders: 50 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analíticas de Negocio</h1>
          <p className="text-muted-foreground">
            Panel de control con métricas clave de rendimiento
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            className="px-3 py-2 rounded-md border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
          >
            {timeRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar PDF
          </Button>
          <Button variant="default">
            <Icon name="FileBarChart" size={16} className="mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {renderMetricCard(
          "Ingresos del Período",
          analyticsData?.revenue?.current,
          "DollarSign",
          analyticsData?.revenue?.change,
          "",
          `Bs. ${analyticsData?.revenue?.current?.toLocaleString()}`
        )}
        {renderMetricCard(
          "Total de Órdenes",
          analyticsData?.orders?.total,
          "ShoppingCart",
          12.5,
          "",
          `Valor promedio: Bs. ${analyticsData?.orders?.avgValue?.toLocaleString()}`
        )}
        {renderMetricCard(
          "Clientes Activos",
          analyticsData?.customers?.total,
          "Users",
          5.2,
          "",
          `${analyticsData?.customers?.new} nuevos este período`
        )}
        {renderMetricCard(
          "Satisfacción",
          analyticsData?.customers?.satisfaction,
          "Star",
          2.1,
          "/5.0",
          "Calificación promedio de clientes"
        )}
      </div>

      {/* Business-Specific Metrics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Métricas por Tipo de Negocio</h2>
        
        {/* Product Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Gestión de Inventario</h3>
              <Icon name="Package" size={20} className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rotación:</span>
                <span className="text-foreground">{analyticsData?.inventory?.turnover}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock Bajo:</span>
                <span className="text-red-600">{analyticsData?.inventory?.lowStock} productos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agotados:</span>
                <span className="text-red-600">{analyticsData?.inventory?.outOfStock} productos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="text-foreground">Bs. {analyticsData?.inventory?.valueTotal?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Pedidos de Productos</h3>
              <Icon name="ShoppingBag" size={20} className="text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pedidos:</span>
                <span className="text-foreground">{analyticsData?.orders?.products}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cumplimiento:</span>
                <span className="text-green-600">{analyticsData?.performance?.orderFulfillment}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tiempo Entrega:</span>
                <span className="text-foreground">{analyticsData?.performance?.deliveryTime} días</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Margen Ganancia:</span>
                <span className="text-green-600">{analyticsData?.performance?.profitMargin}%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Servicios y Citas</h3>
              <Icon name="Calendar" size={20} className="text-purple-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Programadas:</span>
                <span className="text-foreground">{analyticsData?.appointments?.scheduled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completadas:</span>
                <span className="text-green-600">{analyticsData?.appointments?.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Canceladas:</span>
                <span className="text-red-600">{analyticsData?.appointments?.cancelled}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">No Show:</span>
                <span className="text-red-600">{analyticsData?.appointments?.noShow}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Órdenes de Servicio</h3>
              <Icon name="Activity" size={20} className="text-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Órdenes:</span>
                <span className="text-foreground">{analyticsData?.orders?.services}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Procesadas:</span>
                <span className="text-green-600">91.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resultados:</span>
                <span className="text-foreground">54 subidos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Promedio:</span>
                <span className="text-foreground">Bs. 42,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Benchmarking */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Comparación con Estándares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderMetricCard(
            "Retención de Clientes",
            analyticsData?.performance?.customerRetention,
            "UserCheck",
            3.2,
            "%",
            "Meta: 85% | Industria: 82%"
          )}
          {renderMetricCard(
            "Tiempo de Respuesta",
            "1.2",
            "Clock",
            -15.5,
            " horas",
            "Meta: <2h | Industria: 2.8h"
          )}
          {renderMetricCard(
            "Calidad del Servicio",
            "96.5",
            "CheckCircle",
            2.1,
            "%",
            "Meta: 95% | Industria: 92%"
          )}
          {renderMetricCard(
            "Eficiencia Operativa",
            "88.3",
            "Target",
            5.7,
            "%",
            "Meta: 85% | Industria: 79%"
          )}
        </div>
      </div>

      {/* Top Products/Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {[
              { name: 'Paracetamol 500mg', sales: 156, revenue: 390000 },
              { name: 'Ibuprofeno 400mg', sales: 134, revenue: 402000 },
              { name: 'Insulina Regular', sales: 89, revenue: 756500 },
              { name: 'Guantes de Nitrilo', sales: 67, revenue: 569500 }
            ]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="font-medium text-foreground">{item?.name}</p>
                  <p className="text-sm text-muted-foreground">{item?.sales} unidades vendidas</p>
                </div>
                <p className="text-foreground font-medium">Bs. {item?.revenue?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Servicios Más Solicitados</h2>
          <div className="space-y-3">
            {[
              { name: 'Consulta General', appointments: 87, revenue: 2175000 },
              { name: 'Examen de Laboratorio', appointments: 64, revenue: 2240000 },
              { name: 'Examen Visual Completo', appointments: 45, revenue: 2025000 },
              { name: 'Radiografía de Tórax', appointments: 38, revenue: 1520000 }
            ]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <p className="font-medium text-foreground">{item?.name}</p>
                  <p className="text-sm text-muted-foreground">{item?.appointments} citas completadas</p>
                </div>
                <p className="text-foreground font-medium">Bs. {item?.revenue?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Alertas y Recomendaciones</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded">
            <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Stock Crítico</p>
              <p className="text-sm text-red-700">12 productos están por debajo del punto de reorden mínimo.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <Icon name="TrendingUp" size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Oportunidad de Crecimiento</p>
              <p className="text-sm text-yellow-700">Los servicios de laboratorio han aumentado 25% este mes.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <Icon name="Users" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-800">Retención de Clientes</p>
              <p className="text-sm text-blue-700">87% de tus clientes han regresado, superando el promedio de la industria.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;