import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProviderB2B = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg',
      sku: 'PAR-500-001',
      category: 'Medicamentos',
      price: 2500,
      bulkPrice: 2200,
      minOrder: 100,
      stock: 1500,
      image: null,
      description: 'Analgésico y antipirético de venta libre',
      isPublished: true
    },
    {
      id: 2,
      name: 'Tensiómetro Digital',
      sku: 'TEN-DIG-002',
      category: 'Equipos Médicos',
      price: 125000,
      bulkPrice: 115000,
      minOrder: 5,
      stock: 25,
      image: null,
      description: 'Monitor de presión arterial automático con pantalla LCD',
      isPublished: true
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'B2B-001',
      customerName: 'Clínica San Rafael',
      customerType: 'Clínica',
      date: '2024-01-15',
      status: 'pending',
      total: 450000,
      items: [
        { name: 'Paracetamol 500mg', quantity: 200, price: 2200 },
        { name: 'Ibuprofeno 400mg', quantity: 100, price: 2500 }
      ]
    }
  ]);

  const ProductCard = ({ product }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{product?.name}</h3>
          <p className="text-sm text-muted-foreground">SKU: {product?.sku}</p>
          <p className="text-sm text-muted-foreground">{product?.category}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`w-3 h-3 rounded-full ${product?.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs text-muted-foreground">
            {product?.isPublished ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Precio unitario:</span>
          <span className="text-foreground">Bs. {product?.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Precio mayorista:</span>
          <span className="text-foreground font-medium">Bs. {product?.bulkPrice?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pedido mínimo:</span>
          <span className="text-foreground">{product?.minOrder} unidades</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stock:</span>
          <span className="text-foreground">{product?.stock} unidades</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {product?.description}
      </p>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Edit2" size={14} className="mr-2" />
          Editar
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Eye" size={14} className="mr-2" />
          Ver en Marketplace
        </Button>
        <Button variant="outline" size="sm">
          <Icon name="MoreHorizontal" size={14} />
        </Button>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{order?.id}</h3>
          <p className="text-sm text-muted-foreground">{order?.customerName}</p>
          <p className="text-sm text-muted-foreground">{order?.customerType}</p>
        </div>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
          Pendiente
        </span>
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
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="Eye" size={14} className="mr-2" />
          Ver Detalles
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          <Icon name="CheckCircle" size={14} className="mr-2" />
          Procesar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace B2B</h1>
          <p className="text-muted-foreground">
            Gestiona tu presencia en el marketplace empresarial
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Ver Mi Tienda
          </Button>
          <Button variant="default">
            <Icon name="Plus" size={16} className="mr-2" />
            Publicar Producto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Productos Publicados</p>
              <p className="text-2xl font-bold text-foreground">
                {products?.filter(p => p?.isPublished)?.length}
              </p>
            </div>
            <Icon name="Package" size={24} className="text-blue-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos B2B</p>
              <p className="text-2xl font-bold text-foreground">{orders?.length}</p>
            </div>
            <Icon name="ShoppingCart" size={24} className="text-green-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clientes B2B</p>
              <p className="text-2xl font-bold text-foreground">47</p>
            </div>
            <Icon name="Building2" size={24} className="text-purple-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas B2B</p>
              <p className="text-2xl font-bold text-foreground">Bs. 2.1M</p>
            </div>
            <Icon name="DollarSign" size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'catalog' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('catalog')}
        >
          <Icon name="Package" size={16} className="mr-2" />
          Catálogo ({products?.length})
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('orders')}
        >
          <Icon name="ShoppingCart" size={16} className="mr-2" />
          Pedidos B2B ({orders?.length})
        </Button>
        <Button
          variant={activeTab === 'customers' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('customers')}
        >
          <Icon name="Building2" size={16} className="mr-2" />
          Clientes B2B (47)
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
        >
          <Icon name="BarChart3" size={16} className="mr-2" />
          Analíticas B2B
        </Button>
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Catálogo de Productos B2B</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Filter" size={16} className="mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Upload" size={16} className="mr-2" />
                Importar Catálogo
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map(product => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Pedidos B2B</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Filter" size={16} className="mr-2" />
                Filtrar por Estado
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders?.map(order => (
              <OrderCard key={order?.id} order={order} />
            ))}
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Clientes B2B</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Invitar Cliente
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Exportar Lista
              </Button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-center py-12">
              <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Gestión de Clientes B2B</p>
              <p className="text-muted-foreground mb-4">
                Administra tus relaciones con clientes empresariales
              </p>
              <Button variant="default">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Agregar Primer Cliente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Analíticas B2B</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Calendar" size={16} className="mr-2" />
                Último Mes
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-medium text-foreground mb-4">Productos Más Vendidos B2B</h3>
              <div className="space-y-3">
                {[
                  { name: 'Paracetamol 500mg', sales: 'Bs. 440,000', units: '200 unidades' },
                  { name: 'Ibuprofeno 400mg', sales: 'Bs. 250,000', units: '100 unidades' },
                  { name: 'Tensiómetro Digital', sales: 'Bs. 575,000', units: '5 unidades' }
                ]?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div>
                      <p className="font-medium text-foreground">{item?.name}</p>
                      <p className="text-sm text-muted-foreground">{item?.units}</p>
                    </div>
                    <p className="text-foreground font-medium">{item?.sales}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-medium text-foreground mb-4">Clientes B2B Top</h3>
              <div className="space-y-3">
                {[
                  { name: 'Clínica San Rafael', orders: 12, total: 'Bs. 1,200,000' },
                  { name: 'Hospital Central', orders: 8, total: 'Bs. 890,000' },
                  { name: 'Farmacia Los Andes', orders: 15, total: 'Bs. 650,000' }
                ]?.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div>
                      <p className="font-medium text-foreground">{client?.name}</p>
                      <p className="text-sm text-muted-foreground">{client?.orders} pedidos</p>
                    </div>
                    <p className="text-foreground font-medium">{client?.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderB2B;