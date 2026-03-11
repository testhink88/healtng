import React, { useState, useEffect } from "react";
import { Package, Truck, Filter, Search, Plus, List, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// API
import { fetchOrders, updateOrderStatus } from "@/api/orders";

import OrderCard from "@/pages/provider-order-management/components/OrderCard";
import OrderProcessingModal from "@/pages/provider-order-management/components/OrderProcessingModal";
import ShipmentTracker from "@/pages/provider-order-management/components/ShipmentTracker";
import AnalyticsDashboard from "@/pages/provider-order-management/components/AnalyticsDashboard";
import BatchProcessor from "@/pages/provider-order-management/components/BatchProcessor";

const ProviderOrderManagement = () => {
  const { profile } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const loadOrders = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      // Si el usuario es proveedor, filtramos por su ID
      const filters = {};
      if (profile.role === 'provider') filters.provider_id = profile.id;
      
      const data = await fetchOrders(filters);
      
      // Mapeo para compatibilidad con la UI de ProviderOrderManagement
      const mapped = (data || []).map(o => ({
         ...o,
         customer: {
            name: o.patient?.full_name || o.clinic?.full_name || "Cliente",
            email: o.patient?.email || o.clinic?.email,
            phone: o.patient?.metadata?.phone || o.metadata?.phone 
         },
         products: o.items || [],
         totalAmount: o.total_amount,
         orderDate: o.created_at,
         priority: o.priority || "normal"
      }));

      setOrders(mapped);
      setFilteredOrders(mapped);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [profile?.id]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered?.filter(
        (order) =>
          order?.customer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          order?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered?.filter((order) => order?.status?.toLowerCase() === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered?.filter((order) => order?.priority === priorityFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const handleOrderUpdate = async (orderId, updates) => {
    try {
        if (updates.status) {
            await updateOrderStatus(orderId, updates.status);
            loadOrders(); // Recargar datos frescos
        }
    } catch (err) {
        alert("Error al actualizar orden: " + err.message);
    }
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

  const statusCounts = getOrdersByStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Órdenes {profile?.full_name ? `- ${profile.full_name}` : ""}
              </h1>
              <p className="text-gray-600 mt-1">
                {profile?.role === 'provider' ? "Suministros Médicos y Equipamiento" : "Pedidos y Suministros en la nube."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadOrders}
                disabled={loading}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setBatchProcessorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Lote
              </button>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <List className="w-4 h-4" />
                {viewMode === "grid" ? "Lista" : "Grid"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {["queue", "fulfillment", "analytics"].map(tab => (
                 <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                   activeTab === tab
                     ? "border-blue-500 text-blue-600"
                     : "border-transparent text-gray-500 hover:text-gray-700"
                 }`}
               >
                 {tab === 'queue' ? 'Cola' : tab === 'fulfillment' ? 'Entregas' : 'Analítica'}
               </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab !== "analytics" && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 relative w-full max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="Buscar órdenes o clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e?.target?.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Todos los Estados</option>
                <option value="received">Recibidas</option>
                <option value="processing">En Proceso</option>
                <option value="shipped">Enviadas</option>
                <option value="delivered">Entregadas</option>
              </select>

              <div className="text-sm text-gray-600 font-medium">
                {filteredOrders?.length} órdenes
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        {loading ? (
             <div className="py-20 text-center flex flex-col items-center">
                 <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                 <p className="font-bold text-gray-500">Sincronizando con el servidor...</p>
             </div>
        ) : activeTab === "analytics" ? (
          <div>Analítica disponible próximamente con datos de Supabase.</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders?.map((order) => (
              <OrderCard
                key={order?.id}
                order={order}
                onViewDetails={(order) => {
                  setSelectedOrder(order);
                  setProcessingModalOpen(true);
                }}
                onUpdateStatus={(orderId, status) =>
                  handleOrderUpdate(orderId, { status })
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
             <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                         <th className="px-6 py-4">ID Orden</th>
                         <th className="px-6 py-3">Cliente</th>
                         <th className="px-6 py-3">Monto</th>
                         <th className="px-6 py-3">Estado</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredOrders?.map((order) => (
                      <tr key={order?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-blue-600">{order?.id.slice(0,13)}</td>
                        <td className="px-6 py-4">{order?.customer?.name}</td>
                        <td className="px-6 py-4 font-semibold">${order?.totalAmount}</td>
                        <td className="px-6 py-4 capitalize">{order?.status}</td>
                      </tr>
                    ))}
                 </tbody>
             </table>
          </div>
        )}

        {!loading && filteredOrders?.length === 0 && (
          <div className="text-center py-20 grayscale opacity-40">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No hay órdenes</h3>
            <p className="text-gray-500 mt-2">Los pedidos del marketplace aparecerán aquí.</p>
          </div>
        )}
      </div>

      {processingModalOpen && selectedOrder && (
        <OrderProcessingModal
          order={selectedOrder}
          onClose={() => setProcessingModalOpen(false)}
          onUpdate={(updates) => {
            handleOrderUpdate(selectedOrder?.id, updates);
            setProcessingModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProviderOrderManagement;
