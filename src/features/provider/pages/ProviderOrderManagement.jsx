import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const ProviderOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        type: 'product',
        customerName: 'Clínica San Rafael',
        customerId: 'CLI-001',
        date: '2024-01-15',
        status: 'pending',
        priority: 'high',
        total: 125000,
        items: [
          { name: 'Paracetamol 500mg', quantity: 100, price: 2500 },
          { name: 'Ibuprofeno 400mg', quantity: 50, price: 3000 }
        ],
        shippingAddress: 'Av. Principal, Caracas',
        notes: 'Entrega urgente solicitada',
        orderType: 'Pedido de Productos'
      },
      {
        id: 'ORD-002',
        type: 'service',
        customerName: 'María González',
        customerId: 'PAT-002',
        date: '2024-01-15',
        status: 'in_progress',
        priority: 'medium',
        total: 45000,
        items: [
          { name: 'Examen de Laboratorio - Hemograma', quantity: 1, price: 35000 },
          { name: 'Consulta Especializada', quantity: 1, price: 10000 }
        ],
        serviceDate: '2024-01-16',
        notes: 'Orden médica adjunta',
        orderType: 'Orden de Servicio'
      },
      {
        id: 'ORD-003',
        type: 'product',
        customerName: 'Farmacia Central',
        customerId: 'FAR-003',
        date: '2024-01-14',
        status: 'shipped',
        priority: 'low',
        total: 85000,
        items: [
          { name: 'Insulina Regular', quantity: 10, price: 8500 }
        ],
        shippingAddress: 'Centro Comercial, Valencia',
        trackingNumber: 'TRK-789456',
        orderType: 'Pedido de Productos'
      },
      {
        id: 'ORD-004',
        type: 'service',
        customerName: 'Carlos Rodríguez',
        customerId: 'PAT-004',
        date: '2024-01-14',
        status: 'completed',
        priority: 'medium',
        total: 30000,
        items: [
          { name: 'Examen Visual Completo', quantity: 1, price: 30000 }
        ],
        serviceDate: '2024-01-14',
        resultsUploaded: true,
        orderType: 'Orden de Servicio'
      },
      {
        id: 'ORD-005',
        type: 'product',
        customerName: 'Hospital General',
        customerId: 'HOS-005',
        date: '2024-01-13',
        status: 'cancelled',
        priority: 'high',
        total: 200000,
        items: [
          { name: 'Equipos de Protección', quantity: 500, price: 400 }
        ],
        cancelReason: 'Solicitud del cliente',
        orderType: 'Pedido de Productos'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'En Proceso', class: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Enviado', class: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
      completed: { label: 'Completado', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.class}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'Baja', class: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Media', class: 'bg-blue-100 text-blue-800' },
      high: { label: 'Alta', class: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.class}`}>
        {config?.label}
      </span>
    );
  };

  const filteredOrders = orders?.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'products') return order?.type === 'product';
    if (activeTab === 'services') return order?.type === 'service';
    return order?.status === activeTab;
  });

  const getOrderIcon = (order) => {
    if (order?.type === 'product') return 'Package';
    if (order?.type === 'service') return 'Activity';
    return 'FileText';
  };

  const OrderCard = ({ order }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getOrderIcon(order)} size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{order?.id}</h3>
            <p className="text-sm text-muted-foreground">{order?.orderType}</p>
            <p className="text-sm text-muted-foreground">{order?.customerName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusBadge(order?.status)}
          {getPriorityBadge(order?.priority)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="text-foreground">{new Date(order?.date)?.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total:</span>
          <span className="text-foreground font-medium">Bs. {order?.total?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Artículos:</span>
          <span className="text-foreground">{order?.items?.length}</span>
        </div>
        {order?.trackingNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seguimiento:</span>
            <span className="text-foreground font-mono">{order?.trackingNumber}</span>
          </div>
        )}
      </div>

      {order?.notes && (
        <p className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
          {order?.notes}
        </p>
      )}

      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => {
            setSelectedOrder(order);
            setIsDetailsModalOpen(true);
          }}
        >
          <Icon name="Eye" size={14} className="mr-2" />
          Ver Detalles
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Edit2" size={14} className="mr-2" />
          Procesar
        </Button>
        <Button variant="outline" size="sm">
          <Icon name="MoreHorizontal" size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Pedidos y Órdenes</h1>
          <p className="text-muted-foreground">
            Administra pedidos de productos y órdenes de servicios
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Exportar
          </Button>
          <Button variant="outline">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtros
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'Todas', count: orders?.length },
          { key: 'pending', label: 'Pendientes', count: orders?.filter(o => o?.status === 'pending')?.length },
          { key: 'in_progress', label: 'En Proceso', count: orders?.filter(o => o?.status === 'in_progress')?.length },
          { key: 'products', label: 'Productos', count: orders?.filter(o => o?.type === 'product')?.length },
          { key: 'services', label: 'Servicios', count: orders?.filter(o => o?.type === 'service')?.length }
        ]?.map(tab => (
          <Button
            key={tab?.key}
            variant={activeTab === tab?.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab?.key)}
          >
            {tab?.label} ({tab?.count})
          </Button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Órdenes</p>
              <p className="text-2xl font-bold text-foreground">{orders?.length}</p>
            </div>
            <Icon name="ShoppingCart" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders?.filter(o => o?.status === 'pending')?.length}
              </p>
            </div>
            <Icon name="Clock" size={24} className="text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders?.filter(o => o?.status === 'in_progress')?.length}
              </p>
            </div>
            <Icon name="RefreshCw" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-2xl font-bold text-green-600">
                {orders?.filter(o => o?.status === 'completed' || o?.status === 'delivered')?.length}
              </p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-foreground">
                Bs. {orders?.reduce((sum, o) => sum + o?.total, 0)?.toLocaleString()}
              </p>
            </div>
            <Icon name="DollarSign" size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders?.map(order => (
          <OrderCard key={order?.id} order={order} />
        ))}
      </div>

      {filteredOrders?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="ShoppingCart" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No se encontraron órdenes</p>
          <p className="text-muted-foreground">Intenta cambiar los filtros o crear una nueva orden</p>
        </div>
      )}

      {/* Order Details Modal */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{selectedOrder?.id}</h2>
                <p className="text-muted-foreground">{selectedOrder?.orderType}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente:</label>
                  <p className="text-foreground">{selectedOrder?.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado:</label>
                  <div className="mt-1">{getStatusBadge(selectedOrder?.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha:</label>
                  <p className="text-foreground">{new Date(selectedOrder?.date)?.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prioridad:</label>
                  <div className="mt-1">{getPriorityBadge(selectedOrder?.priority)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Artículos:</label>
                <div className="space-y-2">
                  {selectedOrder?.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="text-foreground">{item?.name}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item?.quantity}</p>
                      </div>
                      <p className="font-medium text-foreground">
                        Bs. {(item?.price * item?.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted rounded">
                <span className="font-medium text-foreground">Total:</span>
                <span className="text-xl font-bold text-foreground">
                  Bs. {selectedOrder?.total?.toLocaleString()}
                </span>
              </div>

              {selectedOrder?.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Notas:</label>
                  <p className="text-foreground p-2 bg-muted rounded">{selectedOrder?.notes}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button variant="default" className="flex-1">
                  <Icon name="Edit2" size={16} className="mr-2" />
                  Procesar Orden
                </Button>
                <Button variant="outline" className="flex-1">
                  <Icon name="MessageSquare" size={16} className="mr-2" />
                  Contactar Cliente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderOrderManagement;