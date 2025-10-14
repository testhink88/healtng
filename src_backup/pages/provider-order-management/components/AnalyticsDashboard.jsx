import React from 'react';
import { TrendingUp, Package, Clock, CheckCircle, AlertTriangle, DollarSign, Users, Calendar } from 'lucide-react';



const AnalyticsDashboard = ({ orders, businessType }) => {
  // Calculate metrics
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order?.status === 'delivered')?.length || 0;
  const pendingOrders = orders?.filter(order => ['received', 'processing']?.includes(order?.status))?.length || 0;
  const shippedOrders = orders?.filter(order => order?.status === 'shipped')?.length || 0;
  
  const totalRevenue = orders?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0;
  const completedRevenue = orders
    ?.filter(order => order?.status === 'delivered')
    ?.reduce((sum, order) => sum + (order?.totalAmount || 0), 0) || 0;
  
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  
  // Processing time calculation (mock data)
  const avgProcessingTime = 24; // hours
  
  // Customer metrics
  const uniqueCustomers = new Set(orders?.map(order => order?.customer?.name))?.size || 0;
  
  // Orders by status
  const ordersByStatus = {
    received: orders?.filter(o => o?.status === 'received')?.length || 0,
    processing: orders?.filter(o => o?.status === 'processing')?.length || 0,
    approved: orders?.filter(o => o?.status === 'approved')?.length || 0,
    shipped: orders?.filter(o => o?.status === 'shipped')?.length || 0,
    delivered: orders?.filter(o => o?.status === 'delivered')?.length || 0,
    rejected: orders?.filter(o => o?.status === 'rejected')?.length || 0
  };

  // Priority distribution
  const ordersByPriority = {
    high: orders?.filter(o => o?.priority === 'high')?.length || 0,
    normal: orders?.filter(o => o?.priority === 'normal')?.length || 0,
    low: orders?.filter(o => o?.priority === 'low')?.length || 0
  };

  // Top customers by revenue
  const customerRevenue = {};
  orders?.forEach(order => {
    const customerName = order?.customer?.name;
    if (customerName) {
      customerRevenue[customerName] = (customerRevenue?.[customerName] || 0) + (order?.totalAmount || 0);
    }
  });
  
  const topCustomers = Object.entries(customerRevenue)
    ?.sort(([,a], [,b]) => b - a)
    ?.slice(0, 5);

  // Most ordered products
  const productCount = {};
  orders?.forEach(order => {
    order?.products?.forEach(product => {
      const key = product?.name;
      if (key) {
        productCount[key] = (productCount?.[key] || 0) + (product?.quantity || 0);
      }
    });
  });
  
  const topProducts = Object.entries(productCount)
    ?.sort(([,a], [,b]) => b - a)
    ?.slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const MetricCard = ({ title, value, icon: IconComponent, color = 'blue', subtitle, trend }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Órdenes"
          value={totalOrders}
          icon={Package}
          color="blue"
          subtitle="Todas las órdenes"
        />
        
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="green"
          subtitle={`Completado: ${formatCurrency(completedRevenue)}`}
          trend="+12.5% vs mes anterior"
        />
        
        <MetricCard
          title="Valor Promedio de Orden"
          value={formatCurrency(avgOrderValue)}
          icon={TrendingUp}
          color="purple"
          subtitle="Por orden"
        />
        
        <MetricCard
          title="Tasa de Cumplimiento"
          value={`${completionRate?.toFixed(1)}%`}
          icon={CheckCircle}
          color="green"
          subtitle={`${completedOrders}/${totalOrders} órdenes`}
        />
      </div>
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Órdenes Pendientes"
          value={pendingOrders}
          icon={Clock}
          color="yellow"
          subtitle="Requieren atención"
        />
        
        <MetricCard
          title="En Tránsito"
          value={shippedOrders}
          icon={Package}
          color="blue"
          subtitle="Órdenes enviadas"
        />
        
        <MetricCard
          title="Clientes Únicos"
          value={uniqueCustomers}
          icon={Users}
          color="indigo"
          subtitle="Este periodo"
        />
        
        <MetricCard
          title="Tiempo Promedio"
          value={`${avgProcessingTime}h`}
          icon={Calendar}
          color="gray"
          subtitle="De procesamiento"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <div className="space-y-3">
            {Object.entries(ordersByStatus)?.map(([status, count]) => {
              const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              const getStatusInfo = (status) => {
                switch (status) {
                  case 'received': return { label: 'Recibidas', color: 'bg-yellow-500' };
                  case 'processing': return { label: 'En Proceso', color: 'bg-blue-500' };
                  case 'approved': return { label: 'Aprobadas', color: 'bg-green-500' };
                  case 'shipped': return { label: 'Enviadas', color: 'bg-purple-500' };
                  case 'delivered': return { label: 'Entregadas', color: 'bg-green-600' };
                  case 'rejected': return { label: 'Rechazadas', color: 'bg-red-500' };
                  default: return { label: status, color: 'bg-gray-500' };
                }
              };
              
              const statusInfo = getStatusInfo(status);
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full ${statusInfo?.color}`} />
                    <span className="text-sm text-gray-700">{statusInfo?.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusInfo?.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {percentage?.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
          <div className="space-y-4">
            {Object.entries(ordersByPriority)?.map(([priority, count]) => {
              const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              const getPriorityInfo = (priority) => {
                switch (priority) {
                  case 'high': return { label: 'Alta', color: 'bg-red-500', icon: AlertTriangle };
                  case 'normal': return { label: 'Normal', color: 'bg-blue-500', icon: Clock };
                  case 'low': return { label: 'Baja', color: 'bg-gray-500', icon: Clock };
                  default: return { label: priority, color: 'bg-gray-500', icon: Clock };
                }
              };
              
              const priorityInfo = getPriorityInfo(priority);
              const IconComponent = priorityInfo?.icon;
              
              return (
                <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${priority === 'high' ? 'text-red-600' : priority === 'normal' ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className="text-sm font-medium text-gray-900">{priorityInfo?.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{count} órdenes</span>
                    <span className="text-xs text-gray-500">
                      ({percentage?.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes por Ingresos</h3>
          <div className="space-y-3">
            {topCustomers?.length > 0 ? (
              topCustomers?.map(([customer, revenue], index) => (
                <div key={customer} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer}</p>
                      <p className="text-xs text-gray-500">
                        {orders?.filter(o => o?.customer?.name === customer)?.length} órdenes
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(revenue)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay datos de clientes disponibles</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Solicitados</h3>
          <div className="space-y-3">
            {topProducts?.length > 0 ? (
              topProducts?.map(([product, quantity], index) => (
                <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{product}</p>
                      <p className="text-xs text-gray-500">Producto</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <p className="text-xs text-gray-500">unidades</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay datos de productos disponibles</p>
            )}
          </div>
        </div>
      </div>
      {/* Business-Specific Insights */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Insights Específicos - {businessType || 'General'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Eficiencia de Procesamiento</h4>
            <p className="text-sm text-blue-800">
              Tiempo promedio de procesamiento: {avgProcessingTime} horas
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {completionRate >= 90 ? '✓ Excelente desempeño' : 
               completionRate >= 75 ? '⚠ Buen desempeño': '⚡ Requiere mejora'}
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Satisfacción del Cliente</h4>
            <p className="text-sm text-green-800">
              Órdenes completadas: {completedOrders}/{totalOrders}
            </p>
            <p className="text-sm text-green-600 mt-1">
              Tasa de cumplimiento: {completionRate?.toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Oportunidades</h4>
            <p className="text-sm text-purple-800">
              {pendingOrders > 0 
                ? `${pendingOrders} órdenes requieren atención` 
                : 'Todas las órdenes están procesadas'}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {ordersByPriority?.high > 0 && `${ordersByPriority?.high} órdenes de alta prioridad`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;