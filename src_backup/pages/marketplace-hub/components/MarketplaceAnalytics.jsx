import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Heart, 
  DollarSign,
  ArrowRight,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react';

const MarketplaceAnalytics = ({ data, userRole, onNavigate }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Entregado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'En proceso';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Statistics Cards */}
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Resumen de Actividad</h2>
            <button
              onClick={() => onNavigate('/orders')}
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Pedidos Totales
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {data?.recentPurchases?.length || 0}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Total Gastado
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(data?.totalSpent || 0)}
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Productos Guardados
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {data?.savedItems || 0}
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Pedidos Recientes</h3>
            <div className="space-y-3">
              {data?.recentPurchases?.map((purchase) => (
                <div key={purchase?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(purchase?.status)}
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {purchase?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {purchase?.date} • {getStatusText(purchase?.status)}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-foreground">
                    {formatCurrency(purchase?.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recomendados</h2>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-4">
          {data?.recommendations?.map((product) => (
            <div key={product?.id} className="group cursor-pointer">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {product?.name}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {formatCurrency(product?.price)}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate(userRole === 'patient' ? '/marketplace/b2c' : '/marketplace/b2b')}
          className="
            w-full mt-6 px-4 py-3 bg-primary text-primary-foreground
            font-medium rounded-lg hover:bg-primary/90 transition-colors
            flex items-center justify-center gap-2
          "
        >
          Ver Más Productos
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MarketplaceAnalytics;