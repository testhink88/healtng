import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const STORAGE_KEY_CATALOG = "mock:b2bCatalog";
const STORAGE_KEY_ORDERS = "mock:b2bOrders";

// Datos de ejemplo por defecto (si aún no hay catálogo guardado)
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    sku: "PAR-500-001",
    category: "Medicamentos",
    price: 2500,
    bulkPrice: 2200,
    minOrder: 100,
    quantity: 1500,
    description: "Analgésico y antipirético de venta libre",
    isPublished: true,
    status: "published",
  },
  {
    id: 2,
    name: "Tensiómetro Digital",
    sku: "TEN-DIG-002",
    category: "Equipos Médicos",
    price: 125000,
    bulkPrice: 115000,
    minOrder: 5,
    quantity: 25,
    description: "Monitor de presión arterial automático con pantalla LCD",
    isPublished: true,
    status: "published",
  },
];

const DEFAULT_ORDERS = [
  {
    id: "B2B-001",
    customerName: "Clínica San Rafael",
    customerType: "Clínica",
    date: "2024-01-15",
    status: "pending",
    total: 450000,
    items: [
      { name: "Paracetamol 500mg", quantity: 200, price: 2200 },
      { name: "Ibuprofeno 400mg", quantity: 100, price: 2500 },
    ],
  },
];

const ProviderB2B = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("catalog");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(DEFAULT_ORDERS);

  // Cargar catálogo y pedidos desde localStorage
  useEffect(() => {
    try {
      const storedCatalog = JSON.parse(
        localStorage.getItem(STORAGE_KEY_CATALOG) || "[]"
      );
      if (storedCatalog.length) {
        setProducts(storedCatalog);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch (err) {
      console.error("Error cargando catálogo B2B:", err);
      setProducts(DEFAULT_PRODUCTS);
    }

    try {
      const storedOrders = JSON.parse(
        localStorage.getItem(STORAGE_KEY_ORDERS) || "[]"
      );
      if (storedOrders.length) {
        setOrders(storedOrders);
      }
    } catch (err) {
      console.error("Error cargando pedidos B2B:", err);
    }
  }, []);

  // Persistir catálogo cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATALOG, JSON.stringify(products));
  }, [products]);

  // Persistir pedidos mock (por si luego los modificas)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const publishedProductsCount = useMemo(
    () =>
      products.filter(
        (p) => p?.isPublished || p?.status === "published"
      ).length,
    [products]
  );

  const totalB2BSales = useMemo(
    () => orders.reduce((sum, o) => sum + (o?.total || 0), 0),
    [orders]
  );

  const uniqueCustomers = useMemo(
    () => new Set(orders.map((o) => o?.customerName)).size,
    [orders]
  );

  const handleTogglePublish = (id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentlyPublished = p?.isPublished ?? p?.status === "published";
        return {
          ...p,
          isPublished: !currentlyPublished,
          status: currentlyPublished ? "draft" : "published",
        };
      })
    );
  };

  const handleEditProduct = (_product) => {
    // Opcional: aquí podrías guardar en localStorage el producto a editar
    // y leerlo en el wizard. Por ahora simplemente abrimos el wizard vacío.
    navigate("/provider/b2b/publish");
  };

  const handleViewInMarketplace = () => {
    // Por ahora usamos un vendorId mock; luego se reemplaza por el real del proveedor.
    const VENDOR_ID = "vendor-001";
    navigate(`/marketplace/vendor/${VENDOR_ID}`);
  };

  const handleOpenPublishingWizard = () => {
    navigate("/provider/b2b/publish");
  };

  const handleGoToB2BPurchases = () => {
    // Esto será tu pestaña "Compras B2B" → marketplace tipo B2C pero profesional
    navigate("/marketplace/b2b");
  };

  const ProductCard = ({ product }) => {
    const isPublished = product?.isPublished ?? product?.status === "published";

    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{product?.name}</h3>
            <p className="text-sm text-muted-foreground">
              SKU: {product?.sku || "—"}
            </p>
            {product?.category && (
              <p className="text-sm text-muted-foreground">
                {product?.category}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isPublished ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs text-muted-foreground">
              {isPublished ? "Publicado" : "Borrador"}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          {product?.price && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio unitario:</span>
              <span className="text-foreground">
                Bs. {Number(product?.price)?.toLocaleString("es-VE")}
              </span>
            </div>
          )}

          {product?.bulkPrice && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio mayorista:</span>
              <span className="text-foreground font-medium">
                Bs. {Number(product?.bulkPrice)?.toLocaleString("es-VE")}
              </span>
            </div>
          )}

          {product?.minOrder && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido mínimo:</span>
              <span className="text-foreground">
                {product?.minOrder} unidades
              </span>
            </div>
          )}

          {(product?.quantity || product?.stock) && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock:</span>
              <span className="text-foreground">
                {product?.quantity ?? product?.stock} unidades
              </span>
            </div>
          )}
        </div>

        {product?.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {product?.description}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handleEditProduct(product)}
          >
            <Icon name="Edit2" size={14} className="mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewInMarketplace}
          >
            <Icon name="Eye" size={14} className="mr-2" />
            Ver en Marketplace
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTogglePublish(product.id)}
          >
            <Icon
              name={isPublished ? "EyeOff" : "Upload"}
              size={14}
              className="mr-1"
            />
            {isPublished ? "Ocultar" : "Publicar"}
          </Button>
        </div>
      </div>
    );
  };

  const OrderCard = ({ order }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{order?.id}</h3>
          <p className="text-sm text-muted-foreground">{order?.customerName}</p>
          <p className="text-sm text-muted-foreground">
            {order?.customerType}
          </p>
        </div>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
          {order?.status === "pending" ? "Pendiente" : order?.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fecha:</span>
          <span className="text-foreground">
            {new Date(order?.date)?.toLocaleDateString("es-VE")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total:</span>
          <span className="text-foreground font-medium">
            Bs. {Number(order?.total)?.toLocaleString("es-VE")}
          </span>
        </div>
        <div className="flex justify-between">
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
          <Button variant="outline" onClick={handleViewInMarketplace}>
            <Icon name="ExternalLink" size={16} className="mr-2" />
            Ver Mi Tienda
          </Button>
          <Button variant="default" onClick={handleOpenPublishingWizard}>
            <Icon name="Plus" size={16} className="mr-2" />
            Publicar Producto
          </Button>
        </div>
      </div>

      {/* Tabs principales: Mi catálogo / Compras B2B */}
      <div className="flex space-x-1 mb-4 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "catalog" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("catalog")}
        >
          <Icon name="Package" size={16} className="mr-2" />
          Mi catálogo B2B
        </Button>
        <Button
          variant={activeTab === "orders" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("orders")}
        >
          <Icon name="ShoppingCart" size={16} className="mr-2" />
          Pedidos B2B ({orders?.length})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoToB2BPurchases}
        >
          <Icon name="Store" size={16} className="mr-2" />
          Compras B2B
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Productos Publicados</p>
              <p className="text-2xl font-bold text-foreground">
                {publishedProductsCount}
              </p>
            </div>
            <Icon name="Package" size={24} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos B2B</p>
              <p className="text-2xl font-bold text-foreground">
                {orders?.length}
              </p>
            </div>
            <Icon name="ShoppingCart" size={24} className="text-green-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clientes B2B</p>
              <p className="text-2xl font-bold text-foreground">
                {uniqueCustomers}
              </p>
            </div>
            <Icon name="Building2" size={24} className="text-purple-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas B2B</p>
              <p className="text-2xl font-bold text-foreground">
                Bs. {totalB2BSales.toLocaleString("es-VE")}
              </p>
            </div>
            <Icon name="DollarSign" size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* CONTENIDO: Mi catálogo / Pedidos */}
      {activeTab === "catalog" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Catálogo de Productos B2B
            </h2>
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
            {products?.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
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
            {orders?.map((order) => (
              <OrderCard key={order?.id} order={order} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderB2B;
