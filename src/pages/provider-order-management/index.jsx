import React, { useState, useEffect } from "react";
import { Package, Truck, Filter, Search, Plus, List } from "lucide-react";
import { getBusinessContext } from "@/utils/mockData";
import OrderCard from "@/pages/provider-order-management/components/OrderCard";
import OrderProcessingModal from "@/pages/provider-order-management/components/ShipmentTracker";
import BatchProcessor from "@/pages/provider-order-management/components/AnalyticsDashboard";

const ProviderOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processingModalOpen, setProcessingModalOpen] = useState(false);
  const [shipmentTrackerOpen, setShipmentTrackerOpen] = useState(false);
  const [batchProcessorOpen, setBatchProcessorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [businessContext, setBusinessContext] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // NUEVO: vista en cuadrícula o lista

  useEffect(() => {
    const context = getBusinessContext();
    setBusinessContext(context);

    // Datos simulados mejorados
    const mockOrders = getMockProviderOrders(context?.businessType);
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered?.filter(
        (order) =>
          order?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          order?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          order?.products?.some((p) =>
            p?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
          )
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered?.filter(
        (order) => order?.status?.toLowerCase() === statusFilter
      );
    }

    // Filtro por prioridad
    if (priorityFilter !== "all") {
      filtered = filtered?.filter((order) => order?.priority === priorityFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const handleOrderUpdate = (orderId, updates) => {
    setOrders((prev) =>
      prev?.map((order) =>
        order?.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const handleBulkAction = (orderIds, action) => {
    const updates = {};

    switch (action) {
      case "approve":
        updates.status = "approved";
        updates.processedAt = new Date()?.toISOString();
        break;
      case "reject":
        updates.status = "rejected";
        updates.processedAt = new Date()?.toISOString();
        break;
      case "ship":
        updates.status = "shipped";
        updates.shippedAt = new Date()?.toISOString();
        updates.trackingNumber = generateTrackingNumber();
        break;
      default:
        return;
    }

    setOrders((prev) =>
      prev?.map((order) =>
        orderIds?.includes(order?.id) ? { ...order, ...updates } : order
      )
    );
  };

  const generateTrackingNumber = () => {
    return "HLT-" + Math.random()?.toString(36)?.substr(2, 9)?.toUpperCase();
  };

  const getOrdersByStatus = () => {
    const statusCounts = {
      received: filteredOrders?.filter((o) => o?.status === "received")?.length || 0,
      processing: filteredOrders?.filter((o) => o?.status === "processing")?.length || 0,
      approved: filteredOrders?.filter((o) => o?.status === "approved")?.length || 0,
      shipped: filteredOrders?.filter((o) => o?.status === "shipped")?.length || 0,
      delivered: filteredOrders?.filter((o) => o?.status === "delivered")?.length || 0,
    };
    return statusCounts;
  };

  const getBusinessSpecificWorkflow = () => {
    const businessType = businessContext?.businessType?.toLowerCase() || "";

    if (businessType?.includes("farmacia")) {
      return {
        title: "Farmacia - Flujo de trabajo",
        steps: ["Verificación de receta", "Preparación de medicamento", "Control de calidad"],
        actions: ["Verificar prescripción", "Preparar medicamento", "Empacar"],
      };
    }

    if (businessType?.includes("laboratorio")) {
      return {
        title: "Laboratorio - Flujo de trabajo",
        steps: ["Programación de examen", "Recolección de muestra", "Procesamiento"],
        actions: ["Programar cita", "Recolectar muestra", "Procesar"],
      };
    }

    if (businessType?.includes("óptica")) {
      return {
        title: "Óptica - Flujo de trabajo",
        steps: ["Validación de prescripción", "Toma de medidas", "Fabricación"],
        actions: ["Validar prescripción", "Cita para medidas", "Fabricar"],
      };
    }

    return {
      title: "General - Flujo de trabajo",
      steps: ["Validación", "Preparación", "Control de calidad"],
      actions: ["Validar", "Preparar", "Controlar"],
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
              {/* NUEVO: botón de vista lista */}
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <List className="w-4 h-4" />
                {viewMode === "grid" ? "Enlistar Órdenes" : "Vista en Cuadrícula"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("queue")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "queue"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Cola de Órdenes ({statusCounts?.received + statusCounts?.processing})
            </button>
            <button
              onClick={() => setActiveTab("processing")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "processing"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              En Procesamiento ({statusCounts?.processing})
            </button>
            <button
              onClick={() => setActiveTab("fulfillment")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "fulfillment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Cumplimiento ({statusCounts?.shipped + statusCounts?.delivered})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Analítica
            </button>
          </nav>
        </div>
      </div>

      {/* Filtros */}
      {activeTab !== "analytics" && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar órdenes, clientes o productos..."
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

      {/* Contenido */}
      <div className="px-6 py-6">
        {activeTab === "analytics" ? (
          <AnalyticsDashboard
            orders={orders}
            businessType={businessContext?.businessType}
          />
        ) : viewMode === "grid" ? (
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
                onUpdateStatus={(orderId, status) =>
                  handleOrderUpdate(orderId, { status })
                }
                workflow={workflow}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders?.map((order) => (
              <div
                key={order?.id}
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{order?.id}</h3>
                  <p className="text-sm text-gray-600">{order?.customer?.name}</p>
                </div>
                <span className="text-sm text-blue-600">{order?.status}</span>
              </div>
            ))}
          </div>
        )}

        {filteredOrders?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No se encontraron órdenes
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay órdenes disponibles en este momento"}
            </p>
          </div>
        )}
      </div>

      {/* Modales */}
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
          orders={orders?.filter((o) =>
            ["shipped", "delivered"]?.includes(o?.status)
          )}
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

// Mock Data corregido
const getMockProviderOrders = (businessType = "") => {
  const baseOrders = [
    {
      id: "PO-2024-001",
      customer: {
        name: "Clínica San Rafael",
        contact: "Dra. María González",
        phone: "+58 212-555-0123",
        email: "compras@clinicasanrafael.com",
      },
      products: [
        { sku: "RX-100", name: "Omeprazol 20mg", quantity: 50, unitPrice: 4.9 },
        { sku: "RX-210", name: "Atorvastatina 40mg", quantity: 30, unitPrice: 7.2 },
      ],
      status: "received",
      priority: "high",
      totalAmount: 461.0,
      orderDate: "2024-12-14T08:30:00Z",
      requiredDate: "2024-12-16T17:00:00Z",
      urgencyLevel: "urgent",
      notes: "Paciente con condición crítica, necesita entrega urgente",
      fulfillmentStatus: "pending",
      paymentStatus: "pending",
      shippingAddress: "Av. Principal, Torre Médica, Piso 5, Caracas 1050",
    },
    {
      id: "PO-2024-002",
      customer: {
        name: "Farmacia La Esperanza",
        contact: "Sr. Carlos Méndez",
        phone: "+58 414-123-7890",
        email: "pedidos@laesperanza.com",
      },
      products: [
        { sku: "OT-540", name: "Alcohol 70%", quantity: 100, unitPrice: 1.2 },
        { sku: "OT-320", name: "Mascarillas N95", quantity: 200, unitPrice: 2.1 },
      ],
      status: "processing",
      priority: "normal",
      totalAmount: 540.0,
      orderDate: "2024-12-13T10:15:00Z",
      requiredDate: "2024-12-18T10:00:00Z",
      notes: "Pedido mensual institucional",
      fulfillmentStatus: "in-progress",
      paymentStatus: "pending",
      shippingAddress: "Calle Bolívar, Valencia",
    },
    {
      id: "PO-2024-003",
      customer: {
        name: "Laboratorio Clínico BioTest",
        contact: "Lic. Andreina Soto",
        phone: "+58 424-555-9988",
        email: "compras@biotestlab.com",
      },
      products: [
        { sku: "LB-200", name: "Reactivo Hematología", quantity: 10, unitPrice: 95 },
        { sku: "LB-205", name: "Tiras de Glucosa", quantity: 200, unitPrice: 0.9 },
      ],
      status: "approved",
      priority: "high",
      totalAmount: 1250.0,
      orderDate: "2024-12-10T14:00:00Z",
      requiredDate: "2024-12-15T09:00:00Z",
      fulfillmentStatus: "ready",
      paymentStatus: "paid",
      shippingAddress: "Zona Industrial Sur, Maracay",
    },
    {
      id: "PO-2024-004",
      customer: {
        name: "Óptica Visual Plus",
        contact: "Ing. Luis Cordero",
        phone: "+58 412-789-2211",
        email: "ventas@visualplus.com",
      },
      products: [
        { sku: "OP-100", name: "Lentes Blue Light", quantity: 25, unitPrice: 20 },
        { sku: "OP-205", name: "Monturas de titanio", quantity: 15, unitPrice: 45 },
      ],
      status: "shipped",
      priority: "normal",
      totalAmount: 1275.0,
      orderDate: "2024-12-11T09:30:00Z",
      requiredDate: "2024-12-20T09:00:00Z",
      trackingNumber: "HLT-89K3LQX2",
      fulfillmentStatus: "in-transit",
      paymentStatus: "paid",
      shippingAddress: "Av. Las Delicias, Maracaibo",
    },
    {
      id: "PO-2024-005",
      customer: {
        name: "Clínica Los Andes",
        contact: "Dra. Teresa Rivas",
        phone: "+58 424-113-4567",
        email: "admon@clinicaandes.com",
      },
      products: [
        { sku: "RX-350", name: "Amoxicilina 500mg", quantity: 100, unitPrice: 2.3 },
        { sku: "RX-700", name: "Paracetamol 500mg", quantity: 200, unitPrice: 1.1 },
      ],
      status: "delivered",
      priority: "low",
      totalAmount: 550.0,
      orderDate: "2024-12-05T13:00:00Z",
      requiredDate: "2024-12-09T12:00:00Z",
      deliveredAt: "2024-12-09T18:00:00Z",
      fulfillmentStatus: "completed",
      paymentStatus: "paid",
      shippingAddress: "Calle Real, Mérida",
    },
    {
      id: "PO-2024-006",
      customer: {
        name: "Laboratorio BioCheck",
        contact: "Lic. José Pinto",
        phone: "+58 412-606-7878",
        email: "logistica@biochecklab.com",
      },
      products: [
        { sku: "LB-501", name: "Kits PCR COVID", quantity: 40, unitPrice: 22 },
        { sku: "LB-520", name: "Tubo de ensayo estéril", quantity: 500, unitPrice: 0.3 },
      ],
      status: "processing",
      priority: "high",
      totalAmount: 1580.0,
      orderDate: "2024-12-12T11:45:00Z",
      requiredDate: "2024-12-17T11:00:00Z",
      notes: "Urgente para pruebas en campaña nacional",
      paymentStatus: "pending",
      shippingAddress: "Zona Norte, Barquisimeto",
    },
    {
      id: "PO-2024-007",
      customer: {
        name: "Farmacia Central 24h",
        contact: "Srta. Daniela Perdomo",
        phone: "+58 424-654-1111",
        email: "pedidos@farmaciacentral.com",
      },
      products: [
        { sku: "OT-900", name: "Gel antibacterial 250ml", quantity: 80, unitPrice: 2.2 },
        { sku: "OT-910", name: "Vitaminas C 500mg", quantity: 150, unitPrice: 0.8 },
      ],
      status: "received",
      priority: "normal",
      totalAmount: 376.0,
      orderDate: "2024-12-15T08:00:00Z",
      requiredDate: "2024-12-18T12:00:00Z",
      paymentStatus: "pending",
      shippingAddress: "Av. Libertador, Caracas",
    },
    {
      id: "PO-2024-008",
      customer: {
        name: "Clínica El Carmen",
        contact: "Dr. Pedro Suárez",
        phone: "+58 414-885-9988",
        email: "compras@clinicacarmen.com",
      },
      products: [
        { sku: "RX-800", name: "Metformina 850mg", quantity: 100, unitPrice: 3.5 },
        { sku: "RX-900", name: "Insulina Rápida", quantity: 60, unitPrice: 25 },
      ],
      status: "approved",
      priority: "high",
      totalAmount: 2250.0,
      orderDate: "2024-12-09T10:00:00Z",
      requiredDate: "2024-12-13T18:00:00Z",
      shippingAddress: "Av. Urdaneta, Caracas",
    },
    {
      id: "PO-2024-009",
      customer: {
        name: "Óptica Vista Clara",
        contact: "Téc. Mariana Vivas",
        phone: "+58 424-444-7788",
        email: "optica@vistaclara.com",
      },
      products: [
        { sku: "OP-300", name: "Lentes de contacto", quantity: 60, unitPrice: 15 },
        { sku: "OP-301", name: "Solución salina 250ml", quantity: 30, unitPrice: 6 },
      ],
      status: "delivered",
      priority: "normal",
      totalAmount: 1170.0,
      orderDate: "2024-12-02T14:45:00Z",
      requiredDate: "2024-12-07T10:00:00Z",
      deliveredAt: "2024-12-07T16:30:00Z",
      shippingAddress: "Centro Comercial El Sol, Caracas",
    },
    {
      id: "PO-2024-010",
      customer: {
        name: "Farmacia Popular",
        contact: "Sr. Gustavo Romero",
        phone: "+58 412-550-2233",
        email: "pedidos@farmaciapopular.com",
      },
      products: [
        { sku: "OT-1000", name: "Guantes de látex", quantity: 300, unitPrice: 0.5 },
        { sku: "OT-1005", name: "Hisopos estériles", quantity: 200, unitPrice: 0.2 },
      ],
      status: "received",
      priority: "low",
      totalAmount: 190.0,
      orderDate: "2024-12-16T09:00:00Z",
      requiredDate: "2024-12-20T17:00:00Z",
      shippingAddress: "Av. Bolívar, Puerto Ordaz",
    },
  ];

  return baseOrders;
};

export default ProviderOrderManagement;
