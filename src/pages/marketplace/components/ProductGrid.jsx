import React from 'react';
import ProductCard from './ProductCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductGrid = ({ 
  products, 
  loading, 
  onAddToCart, 
  onViewDetails,
  onLoadMore,
  hasMore,
  currentPage,
  totalPages
}) => {
  
  if (loading && products?.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <Icon name="Package" size={48} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No se encontraron productos
        </h3>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          No hay productos que coincidan con tus filtros actuales. 
          Intenta ajustar los criterios de búsqueda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => window.location?.reload()}>
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Limpiar filtros
          </Button>
          <Button variant="default" onClick={() => window.location.href = '/doctor-discovery'}>
            <Icon name="Search" size={16} className="mr-2" />
            Buscar servicios médicos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product?.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      {/* Loading More Products */}
      {loading && products?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 })?.map((_, index) => (
            <div key={`loading-${index}`} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {products?.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Mostrando {products?.length} productos
            {totalPages > 1 && (
              <span> - Página {currentPage} de {totalPages}</span>
            )}
          </div>
          
          {hasMore && (
            <Button
              variant="outline"
              onClick={onLoadMore}
              loading={loading}
              className="min-w-[120px]"
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Cargar más
            </Button>
          )}
        </div>
      )}
      {/* Back to Top */}
      {products?.length > 12 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm"
          >
            <Icon name="ArrowUp" size={16} className="mr-2" />
            Volver arriba
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;