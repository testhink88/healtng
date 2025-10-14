import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await onAddToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 500);
  };

  const getStockStatus = () => {
    if (product?.stock === 0) return { text: 'Agotado', color: 'text-error', bg: 'bg-error/10' };
    if (product?.stock <= 5) return { text: 'Pocas unidades', color: 'text-warning', bg: 'bg-warning/10' };
    return { text: 'Disponible', color: 'text-success', bg: 'bg-success/10' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product?.isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Nuevo
            </span>
          )}
          {product?.discount > 0 && (
            <span className="bg-error text-error-foreground text-xs font-medium px-2 py-1 rounded-full">
              -{product?.discount}%
            </span>
          )}
        </div>

        {/* Insurance Badge */}
        {product?.insuranceCompatible && (
          <div className="absolute top-2 right-2">
            <div className="bg-success/90 text-success-foreground p-1 rounded-full" title="Compatible con seguros">
              <Icon name="Shield" size={14} />
            </div>
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(product)}
            className="bg-card/90 backdrop-blur-sm"
          >
            <Icon name="Eye" size={16} className="mr-2" />
            Ver detalles
          </Button>
        </div>
      </div>
      {/* Product Info */}
      <div className="p-4">
        {/* Category & Provider */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {product?.category}
          </span>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={12} className="text-warning fill-current" />
            <span className="text-xs text-muted-foreground">{product?.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 min-h-[2.5rem]">
          {product?.name}
        </h3>

        {/* Provider */}
        <p className="text-sm text-muted-foreground mb-2 flex items-center">
          <Icon name="Building" size={14} className="mr-1" />
          {product?.provider}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product?.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-foreground">
                  ${(product?.price * (1 - product?.discount / 100))?.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product?.price?.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                ${product?.price?.toFixed(2)}
              </span>
            )}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${stockStatus?.bg} ${stockStatus?.color}`}>
            {stockStatus?.text}
          </span>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <Icon name="Truck" size={12} className="mr-1" />
          <span>Entrega: {product?.deliveryTime}</span>
        </div>

        {/* Quantity & Add to Cart */}
        {product?.stock > 0 ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8"
                disabled={quantity <= 1}
              >
                <Icon name="Minus" size={14} />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.min(product?.stock, quantity + 1))}
                className="w-8 h-8"
                disabled={quantity >= product?.stock}
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              loading={isAdding}
              className="flex-1"
              disabled={product?.stock === 0}
            >
              <Icon name="ShoppingCart" size={14} className="mr-2" />
              Agregar
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" disabled className="w-full">
            Agotado
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;