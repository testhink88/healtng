import React, { useState, useEffect } from 'react';
import { Package, Truck, Filter, Search, Plus } from 'lucide-react';
import { getBusinessContext } from '../../utils/mockData';
import OrderCard from './components/OrderCard';
import OrderProcessingModal from './components/OrderProcessingModal';
import ShipmentTracker from './components/ShipmentTracker';
import BatchProcessor from './components/BatchProcessor';
import AnalyticsDashboard from './components/AnalyticsDashboard';

const ProviderOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingModalOpen, setProcessingModalOpen] = useState(false);
  const [shipmentTrackerOpen, setShipmentTrackerOpen] = useState(false);
  const [batchProcessorOpen, setBatchProcessorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [businessContext, setBusinessContext] = useState({});

  useEffect(() => {
    const context = getBusinessContext();
    setBusinessContext(context);
    
    // Enhanced mock orders with shipment data
    const mockOrders = getMockProviderOrders(context?.businessType);
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(order => 
        order?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        order?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        order?.products?.some(p => p?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(order => order?.status?.toLowerCase() === statusFilter);
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered?.filter(order => order?.priority === priorityFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const handleOrderUpdate = (orderId, updates) => {
    setOrders(prev => prev?.map(order => 
      order?.id === orderId ? { ...order, ...updates } : order
    ));
  };

  const handleBulkAction = (orderIds, action) => {
    const updates = {};
    
    switch (action) {
      case 'approve':
        updates.status = 'approved';
        updates.processedAt = new Date()?.toISOString();
        break;
      case 'reject':
        updates.status = 'rejected';
        updates.processedAt = new Date()?.toISOString();
        break;
      case 'ship':
        updates.status = 'shipped';
        updates.shippedAt = new Date()?.toISOString();
        updates.trackingNumber = generateTrackingNumber();
        break;
      default:
        return;
    }
    
    setOrders(prev => prev?.map(order => 
      orderIds?.includes(order?.id) ? { ...order, ...updates } : order
    ));
  };

  const generateTrackingNumber = () => {
    return 'HLT-' + Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase();
  };

  const getOrdersByStatus = () => {
    const statusCounts = {
      received: filteredOrders?.filter(o => o?.status === 'received')?.length || 0,
      processing: filteredOrders?.filter(o => o?.status === 'processing')?.length || 0,
      approved: filteredOrders?.filter(o => o?.status === 'approved')?.length || 0,
      shipped: filteredOrders?.filter(o => o?.status === 'shipped')?.length || 0,
      delivered: filteredOrders?.filter(o => o?.status === 'delivered')?.length || 0
    };
    return statusCounts;
  };

  const getBusinessSpecificWorkflow = () => {
    const businessType = businessContext?.businessType?.toLowerCase() || '';
    
    if (businessType?.includes('farmacia')) {
      return {
        title: 'Farmacia - Workflow',
        steps: ['Verificación de Receta', 'Preparación de Medicamento', 'Control de Calidad'],
        actions: ['Verificar Prescripción', 'Preparar Medicamento', 'Empacar']
      };
    }
    
    if (businessType?.includes('laboratorio')) {
      return {
        title: 'Laboratorio - Workflow', 
        steps: ['Programación de Examen', 'Recolección de Muestra', 'Procesamiento'],
        actions: ['Programar Cita', 'Recolectar Muestra', 'Procesar']
      };
    }
    
    if (businessType?.includes('óptica')) {
      return {
        title: 'Óptica - Workflow',
        steps: ['Validación de Prescripción', 'Toma de Medidas', 'Fabricación'],
        actions: ['Validar Prescripción', 'Cita para Medidas', 'Fabricar']
      };
    }
    
    return {
      title: 'General - Workflow',
      steps: ['Validación', 'Preparación', 'Control de Calidad'],
      actions: ['Validar', 'Preparar', 'Controlar']
    };
  };

  const statusCounts = getOrdersByStatus();
  const workflow = getBusinessSpecificWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Órdenes - {businessContext?.businessName}
              </h1>
              <p className="text-gray-600 mt-1">
                {businessContext?.operationCategory} • {workflow?.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBatchProcessorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Procesamiento en Lote
              </button>
              <button
                onClick={() => setShipmentTrackerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Truck className="w-4 h-4" />
                Seguimiento de Envíos
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'queue' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cola de Órdenes ({statusCounts?.received + statusCounts?.processing})
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'processing' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              En Procesamiento ({statusCounts?.processing})
            </button>
            <button
              onClick={() => setActiveTab('fulfillment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fulfillment' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cumplimiento ({statusCounts?.shipped + statusCounts?.delivered})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ?'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analítica
            </button>
          </nav>
        </div>
      </div>
      {/* Filters */}
      {activeTab !== 'analytics' && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar órdenes, clientes, productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="received">Recibidas</option>
                <option value="processing">En Proceso</option>
                <option value="approved">Aprobadas</option>
                <option value="shipped">Enviadas</option>
                <option value="delivered">Entregadas</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="high">Alta</option>
                <option value="normal">Normal</option>
                <option value="low">Baja</option>
              </select>
              
              <div className="flex items-center text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredOrders?.length} órdenes mostradas
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'analytics' ? (
          <AnalyticsDashboard 
            orders={orders}
            businessType={businessContext?.businessType}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders?.map((order) => (
              <OrderCard
                key={order?.id}
                order={order}
                businessType={businessContext?.businessType}
                onViewDetails={(order) => {
                  setSelectedOrder(order);
                  setProcessingModalOpen(true);
                }}
                onUpdateStatus={(orderId, status) => handleOrderUpdate(orderId, { status })}
                workflow={workflow}
              />
            ))}
            
            {filteredOrders?.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No se encontraron órdenes
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ?'Intenta ajustar los filtros de búsqueda' :'No hay órdenes disponibles en este momento'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Modals */}
      {processingModalOpen && selectedOrder && (
        <OrderProcessingModal
          order={selectedOrder}
          businessType={businessContext?.businessType}
          workflow={workflow}
          onClose={() => setProcessingModalOpen(false)}
          onUpdate={(updates) => {
            handleOrderUpdate(selectedOrder?.id, updates);
            setProcessingModalOpen(false);
          }}
        />
      )}
      {shipmentTrackerOpen && (
        <ShipmentTracker
          orders={orders?.filter(o => ['shipped', 'delivered']?.includes(o?.status))}
          onClose={() => setShipmentTrackerOpen(false)}
          onUpdate={handleOrderUpdate}
        />
      )}
      {batchProcessorOpen && (
        <BatchProcessor
          orders={orders}
          onClose={() => setBatchProcessorOpen(false)}
          onBulkAction={handleBulkAction}
        />
      )}
    </div>
  );
};

// Enhanced mock data generator
const getMockProviderOrders = (businessType = '') => {
  const baseOrders = [
    {
      id: 'PO-2024-001',
      customer: {
        name: 'Clínica San Rafael',
        contact: 'Dr. María González',
        phone: '+58 212-555-0123',
        email: 'compras@clinicasanrafael.com'
      },
      products: [
        { sku: 'RX-100', name: 'Omeprazol 20mg', quantity: 50, unitPrice: 4.9 },
        { sku: 'RX-210', name: 'Atorvastatina 40mg', quantity: 30, unitPrice: 7.2 }
      ],
      status: 'received',
      priority: 'high',
      totalAmount: 461.0,
      orderDate: '2024-12-14T08:30:00Z',
      requiredDate: '2024-12-16T17:00:00Z',
      urgencyLevel: 'urgent',
      notes: 'Paciente con condición crítica, necesita entrega urgente',
      fulfillmentStatus: 'pending',
      paymentStatus: 'pending',
      shippingAddress: 'Av. Principal, Torre Médica, Piso 5, Caracas 1050'
    },
    {
      id: 'PO-2024-002',
      customer: {
        name: 'Hospital Central',
        contact: 'Dra. Ana Rodríguez',
        phone: '+58 212-555-0456',
        email: 'farmacia@hospitalcentral.com'
      },
      products: [
        { sku: 'RX-301', name: 'Losartán 50mg', quantity: 100, unitPrice: 6.8 },
        { sku: 'VIT-001', name: 'Vitamina D3', quantity: 25, unitPrice: 12.5 }
      ],
      status: 'processing',
      priority: 'normal',
      totalAmount: 992.5,
      orderDate: '2024-12-14T09:15:00Z',
      requiredDate: '2024-12-17T12:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Orden de reposición mensual',
      fulfillmentStatus: 'in_progress',
      paymentStatus: 'approved',
      shippingAddress: 'Calle 23, Edificio Hospitalario, Maracaibo 4001'
    },
    {
      id: 'PO-2024-003',
      customer: {
        name: 'Centro Médico Norte',
        contact: 'Dr. Carlos López',
        phone: '+58 212-555-0789',
        email: 'pedidos@centromediconorte.com'
      },
      products: [
        { sku: 'LAB-CRP', name: 'Proteína C Reactiva', quantity: 5, unitPrice: 110 },
        { sku: 'LAB-GLU', name: 'Glucosa', quantity: 10, unitPrice: 65 }
      ],
      status: 'shipped',
      priority: 'normal',
      totalAmount: 1200.0,
      orderDate: '2024-12-13T14:20:00Z',
      requiredDate: '2024-12-15T10:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Reactivos para laboratorio mensual',
      fulfillmentStatus: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: 'Av. Libertador, Centro Comercial Norte, Valencia 2001',
      trackingNumber: 'HLT-TRK123456',
      shippedAt: '2024-12-14T16:30:00Z',
      estimatedDelivery: '2024-12-15T12:00:00Z',
      carrier: 'Transporte Healtng'
    }
  ];

  // Add business-specific orders
  if (businessType?.toLowerCase()?.includes('óptica')) {
    baseOrders?.push({
      id: 'PO-2024-004',
      customer: {
        name: 'Óptica Central',
        contact: 'María Fernández',
        phone: '+58 212-555-0321',
        email: 'inventario@opticacentral.com'
      },
      products: [
        { sku: 'OPT-GLS', name: 'Lente monofocal', quantity: 20, unitPrice: 60 },
        { sku: 'OPT-CTC', name: 'Lente de contacto', quantity: 15, unitPrice: 32 }
      ],
      status: 'approved',
      priority: 'normal',
      totalAmount: 1680.0,
      orderDate: '2024-12-14T11:00:00Z',
      requiredDate: '2024-12-18T15:00:00Z',
      urgencyLevel: 'normal',
      notes: 'Pedido especial para graduaciones específicas',
      fulfillmentStatus: 'approved',
      paymentStatus: 'approved',
      shippingAddress: 'Centro Comercial Las Mercedes, Local 45, Caracas 1060'
    });
  }

  return baseOrders;
};

export default ProviderOrderManagement;