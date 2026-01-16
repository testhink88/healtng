import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// 🔑 CLAVE CORRECTA (La misma de Inventario y Catálogo)
const B2B_CATALOG_STORAGE_KEY = "healtng_provider_b2b_catalog_v1";
const STORAGE_KEY_ORDERS = "mock:b2bOrders";

// Datos Mock para Pedidos (ya que aún no conectamos módulo de órdenes real)
const DEFAULT_ORDERS = [
  {
    id: "B2B-001",
    customerName: "Clínica San Rafael",
    customerType: "Clínica",
    date: "2024-01-15",
    status: "pending",
    total: 450000,
    items: 2,
  },
  {
    id: "B2B-002",
    customerName: "Farmacia Ahorro",
    customerType: "Farmacia",
    date: "2024-01-14",
    status: "completed",
    total: 125000,
    items: 5,
  },
];

export default function ProviderB2B() {
  const navigate = useNavigate();

  // Estado
  const [catalogStats, setCatalogStats] = useState({ total: 0, active: 0, draft: 0, lowStock: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [orders, setOrders] = useState(DEFAULT_ORDERS);

  // 1. Cargar Datos Reales del Storage
  useEffect(() => {
    // --- Cargar Catálogo ---
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        setCatalogStats({
          total: items.length,
          active: items.filter((i) => i.status === "active" || i.isPublished).length,
          draft: items.filter((i) => i.status === "draft" || i.status === "inactive" || !i.status).length,
          lowStock: items.filter((i) => (i.stock || 0) <= (i.minStock || 0)).length,
        });
        // Tomar los últimos 3 para mostrar preview
        setRecentProducts(items.slice(0, 3));
      }
    } catch (err) {
      console.error("Error cargando stats catálogo:", err);
    }

    // --- Cargar Pedidos (Mock por ahora) ---
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (err) {
      console.error("Error pedidos:", err);
    }
  }, []);

  // Totales financieros (Mock)
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header Estratégico */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace B2B</h1>
          <p className="text-gray-500 mt-1">Visión general de tu canal de ventas corporativo.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => navigate("/marketplace/vendor/me")}>
              <Icon name="Store" size={16} className="mr-2"/> Vista de mi Tienda
           </Button>
           {/* CTA Principal: Lleva a la gestión real */}
           <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate("/provider/b2b/catalog")}>
              <Icon name="Settings" size={16} className="mr-2"/> Gestionar Catálogo
           </Button>
        </div>
      </div>

      {/* 2. KPIs de Alto Nivel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            title="Total Productos" 
            value={catalogStats.total} 
            icon="Package" 
            desc="En base de datos"
        />
        <MetricCard 
            title="Activos en Tienda" 
            value={catalogStats.active} 
            icon="CheckCircle" 
            color="text-green-600" 
            bg="bg-green-50"
            desc="Visibles para clientes"
        />
        <MetricCard 
            title="Pendientes / Borradores" 
            value={catalogStats.draft} 
            icon="FileEdit" 
            color="text-yellow-600" 
            bg="bg-yellow-50"
            desc="Requieren atención"
            onClick={() => navigate("/provider/b2b/catalog")} // Acceso rápido a corregir
        />
        <MetricCard 
            title="Ventas del Mes" 
            value={`Bs. ${totalSales.toLocaleString()}`} 
            icon="DollarSign" 
            color="text-blue-600" 
            bg="bg-blue-50"
            desc={`${orders.length} pedidos procesados`}
        />
      </div>

      {/* 3. Panel de Acciones (El "Hub") */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Accesos Directos Operativos */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Gestión Operativa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card: Catálogo */}
                <div 
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate("/provider/b2b/catalog")}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Icon name="List" size={24} className="text-blue-600" />
                        </div>
                        <Icon name="ArrowRight" size={20} className="text-gray-300 group-hover:text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Catálogo y Precios</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Edita productos, define precios mayoristas (MOQ), sube imágenes y activa items traídos del inventario.
                    </p>
                </div>

                {/* Card: Pedidos */}
                <div 
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate("/provider/orders")}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Icon name="ShoppingCart" size={24} className="text-purple-600" />
                        </div>
                        <Icon name="ArrowRight" size={20} className="text-gray-300 group-hover:text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Pedidos Recibidos</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Procesa órdenes de compra de Clínicas y Farmacias. Gestiona estados y facturación.
                    </p>
                </div>
            </div>

            {/* Lista Previa de Productos Recientes */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Últimos Productos Agregados</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/provider/b2b/catalog")}>Ver todos</Button>
                </div>
                {recentProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No hay productos en el catálogo B2B aún. 
                        <br/>
                        <span className="text-sm">Ve a Inventario para enviar productos aquí.</span>
                    </div>
                ) : (
                    <div className="divide-y">
                        {recentProducts.map((p) => (
                            <div key={p.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{p.name}</p>
                                    <p className="text-xs text-gray-500">{p.code} • {p.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        p.status === 'active' || p.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {p.status === 'active' || p.isPublished ? 'Activo' : 'Borrador'}
                                    </span>
                                    <p className="text-sm font-semibold">Bs. {p.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Columna Derecha: Resumen de Actividad (Pedidos) */}
        <div className="space-y-6">
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Últimos Pedidos</h3>
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                            <div>
                                <p className="font-bold text-sm text-gray-800">{order.customerName}</p>
                                <p className="text-xs text-gray-500">{order.id} • {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">Bs. {order.total.toLocaleString()}</p>
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/provider/orders")}>
                    Ver todos los pedidos
                </Button>
            </div>
            
            {/* Promo Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                <Icon name="TrendingUp" size={32} className="mb-4 text-blue-200" />
                <h3 className="font-bold text-lg mb-2">Aumenta tus ventas</h3>
                <p className="text-blue-100 text-sm mb-4">
                    Los proveedores con más de 10 productos activos reciben un 40% más de órdenes.
                </p>
                <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 border-none w-full" onClick={() => navigate("/provider/inventory")}>
                    Ir a Inventario
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

// Componente visual para tarjetas de métricas
const MetricCard = ({ title, value, icon, desc, color = "text-gray-600", bg = "bg-gray-100", onClick }) => (
    <div 
        className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-md transition-all' : ''}`}
        onClick={onClick}
    >
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
            </div>
            <div className={`p-2 rounded-lg ${bg}`}>
                <Icon name={icon} size={20} className={color} />
            </div>
        </div>
        <p className="text-xs text-gray-400">{desc}</p>
    </div>
);