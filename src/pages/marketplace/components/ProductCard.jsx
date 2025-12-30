// src/pages/marketplace/components/ProductCard.jsx
import React, { useState, useMemo } from "react";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

const getEffectivePrice = (product) => {
  if (!product) return 0;
  if (product.discount && product.discount > 0) {
    return product.price * (1 - product.discount / 100);
  }
  return product.price;
};

const getTierForQuantity = (priceTiers = [], quantity = 1) => {
  if (!Array.isArray(priceTiers) || priceTiers.length === 0) return null;
  return (
    priceTiers.find((t) => quantity >= t.min && quantity <= t.max) ||
    priceTiers[priceTiers.length - 1]
  );
};

const ProductCard = ({
  product,
  marketplaceType = "b2c", // 'b2c' | 'b2b'
  onAddToCart,
  onViewDetails,
  onRequestQuote,
  onViewVendor,
}) => {
  const [quantity, setQuantity] = useState(1);

  const providerName = product.provider || product.vendor || "Proveedor";
  const hasDiscount = marketplaceType === "b2c" && product.discount > 0;
  const effectivePrice =
    marketplaceType === "b2c"
      ? getEffectivePrice(product)
      : product?.priceTiers?.[0]?.priceUSD ?? 0;

  const activeTier = useMemo(
    () =>
      marketplaceType === "b2b"
        ? getTierForQuantity(product.priceTiers, quantity)
        : null,
    [product.priceTiers, quantity, marketplaceType]
  );

  const handlePrimaryAction = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
  };

  const increment = () =>
    setQuantity((q) => Math.min(q + 1, product.stock || q + 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  // -------------------- RENDER B2C --------------------
  if (marketplaceType === "b2c") {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
        {/* Imagen + badges */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Nuevo
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="Building2" size={12} />
              <span>{providerName}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Icon
                name="Star"
                size={12}
                className="text-yellow-500"
              />
              <span className="text-muted-foreground">
                {product.rating?.toFixed(1) ?? "4.5"}
              </span>
            </div>
          </div>

          {/* Precio */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">
                ${effectivePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.price?.toFixed(2)}
                </span>
              )}
            </div>
            {product.priceVES && (
              <p className="text-xs text-muted-foreground">
                ≈ {product.priceVES.toFixed(2)} VES
              </p>
            )}
            {product.deliveryTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Entrega: {product.deliveryTime}
              </p>
            )}
          </div>

          {/* Controles */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={decrement}
                className="px-2 py-1 text-sm hover:bg-muted"
              >
                -
              </button>
              <span className="px-3 py-1 text-sm border-l border-r border-border">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increment}
                className="px-2 py-1 text-sm hover:bg-muted"
              >
                +
              </button>
            </div>
            <Button
              variant="default"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handlePrimaryAction}
            >
              <Icon name="ShoppingCart" size={16} />
              Agregar
            </Button>
          </div>

          {onViewDetails && (
            <button
              type="button"
              className="mt-2 text-xs text-primary hover:underline text-left"
              onClick={() => onViewDetails(product)}
            >
              Ver detalles
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------- RENDER B2B --------------------
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1">
          <div className="text-xs text-muted-foreground mb-1">
            {product.category}
          </div>
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {product.certification && (
              <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-1 rounded">
                {product.certification}
              </span>
            )}
            {product.minOrderQuantity && (
              <span className="bg-gray-100 text-gray-800 text-[11px] px-2 py-1 rounded">
                MOQ: {product.minOrderQuantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vendor + rating */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Icon name="Building2" size={12} />
          <span>{providerName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Icon name="Star" size={12} className="text-yellow-500" />
          <span>{product.rating?.toFixed(1) ?? "4.8"}</span>
          {product.leadTimeDays && (
            <span className="ml-2">
              Entrega: {product.leadTimeDays} días
            </span>
          )}
        </div>
      </div>

      {/* Price tiers */}
      {Array.isArray(product.priceTiers) && product.priceTiers.length > 0 && (
        <div className="bg-muted rounded-lg p-3 text-xs space-y-1">
          {product.priceTiers.map((tier, idx) => {
            const isActive =
              activeTier &&
              tier.min === activeTier.min &&
              tier.max === activeTier.max;
            return (
              <div
                key={idx}
                className={`flex justify-between ${
                  isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                <span>
                  {tier.min}-{tier.max === 999 ? "+" : tier.max} unidades
                </span>
                <span>${tier.priceUSD.toFixed(2)} + IVA</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={decrement}
            className="px-2 py-1 text-sm hover:bg-muted"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm border-l border-r border-border">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            className="px-2 py-1 text-sm hover:bg-muted"
          >
            +
          </button>
        </div>

        <Button
          variant="default"
          size="sm"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={handlePrimaryAction}
        >
          <Icon name="FileText" size={16} />
          Añadir a OC
        </Button>
      </div>

      {/* Acciones secundarias */}
      <div className="flex flex-col gap-2 mt-1">
        {onRequestQuote && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRequestQuote(product)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Icon name="Mail" size={14} />
            Solicitar cotización
          </Button>
        )}
        {onViewVendor && product.vendorId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewVendor(product.vendorId)}
            className="w-full flex items-center justify-center gap-2"
          >
            Ver proveedor
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
