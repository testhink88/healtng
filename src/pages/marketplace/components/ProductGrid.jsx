// src/pages/marketplace/components/ProductGrid.jsx
import React from "react";
import ProductCard from "./ProductCard";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const ProductGrid = ({
  products = [],
  loading = false,
  onAddToCart,
  onViewDetails,
  onLoadMore,
  hasMore = false,
  currentPage = 1,
  totalPages = 1,
  marketplaceType = "b2c", // 'b2c' | 'b2b'
  onRequestQuote,
  onViewVendor,
}) => {
  const showLoadMore = Boolean(onLoadMore) && hasMore;

  if (!loading && (!products || products.length === 0)) {
    return (
      <div className="border border-dashed border-muted-foreground/40 rounded-lg p-10 text-center text-muted-foreground">
        <p className="font-medium mb-1">No se encontraron productos</p>
        <p className="text-sm">
          Ajusta los filtros o intenta con otra búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {loading && products.length === 0 ? (
          // Skeleton simple
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-muted rounded-xl animate-pulse"
            />
          ))
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              marketplaceType={marketplaceType}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
              onRequestQuote={onRequestQuote}
              onViewVendor={onViewVendor}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {showLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Icon
                name="Loader"
                size={16}
                className="animate-spin"
              />
            ) : (
              <Icon name="ChevronDown" size={16} />
            )}
            Ver más productos ({currentPage}/{totalPages})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
