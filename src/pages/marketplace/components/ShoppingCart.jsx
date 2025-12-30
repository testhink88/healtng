import React, { useMemo, useState } from "react";
import Icon from "@/components/AppIcon";
import Image from "@/components/AppImage";
import Button from "@/components/ui/Button";

/**
 * Botón flotante del carrito (FAB) — se exporta por separado
 * para montarlo UNA sola vez en la página contenedora.
 */
export const FloatingCartButton = ({
  count = 0,
  onClick = () => {},
  id = "healtng-cart-fab",
}) => {
  // Evita duplicados si accidentalmente se monta dos veces
  if (typeof window !== "undefined" && document.getElementById(id)) {
    return null;
  }

  return (
    <button
      id={id}
      onClick={onClick}
      className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
      aria-label="Abrir carrito"
    >
      <Icon name="ShoppingCart" size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};

/**
 * Panel del carrito (SIN FAB interno)
 */
const ShoppingCart = ({
  items = [],
  isOpen = false,
  onToggle = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onCheckout = async () => {},
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const totalItems = useMemo(
    () => items?.reduce((total, item) => total + (item?.quantity || 0), 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items?.reduce((total, item) => {
        const price =
          item?.discount > 0
            ? (item?.price || 0) * (1 - (item?.discount || 0) / 100)
            : item?.price || 0;
        return total + price * (item?.quantity || 0);
      }, 0) ?? 0,
    [items]
  );

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      await onCheckout(items);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handleQuantityChange = (id, nextQty) => {
    if (nextQty <= 0) onRemoveItem(id);
    else onUpdateQuantity(id, nextQty);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 lg:bg-transparent lg:pointer-events-none"
        onClick={onToggle}
        role="presentation"
      />
      {/* Panel */}
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-xl lg:pointer-events-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="ShoppingCart" size={20} />
            <h3 className="font-semibold text-foreground">Carrito ({totalItems})</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle} className="w-8 h-8">
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items?.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="ShoppingCart" size={32} className="text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Tu carrito está vacío</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Agrega productos para comenzar tu compra
                </p>
                <Button variant="outline" onClick={onToggle}>
                  Continuar comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => {
                  const price =
                    item?.discount > 0
                      ? (item?.price || 0) * (1 - (item?.discount || 0) / 100)
                      : item?.price || 0;

                  return (
                    <div
                      key={item?.id}
                      className="flex space-x-3 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                          {item?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item?.provider}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {item?.discount > 0 ? (
                              <>
                                <span className="text-sm font-semibold text-foreground">
                                  ${price.toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  ${(item?.price || 0).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-semibold text-foreground">
                                ${price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item?.id, (item?.quantity || 0) - 1)
                              }
                              className="w-6 h-6"
                            >
                              <Icon name="Minus" size={12} />
                            </Button>
                            <span className="text-sm font-medium px-2 min-w-[2rem] text-center">
                              {item?.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(item?.id, (item?.quantity || 0) + 1)
                              }
                              className="w-6 h-6"
                              disabled={(item?.quantity || 0) >= (item?.stock || Infinity)}
                            >
                              <Icon name="Plus" size={12} />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold text-foreground">
                            Subtotal: ${(price * (item?.quantity || 0)).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(item?.id)}
                            className="w-6 h-6 text-destructive hover:text-destructive"
                          >
                            <Icon name="Trash2" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="border-t border-border p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Envío:</span>
                    <span className="font-medium">Calculado en checkout</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Impuestos:</span>
                    <span className="font-medium">Incluidos</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className="text-lg font-bold text-primary">
                        ${totalPrice.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="default"
                    onClick={handleCheckout}
                    loading={isProcessing}
                    className="w-full"
                    disabled={items?.length === 0}
                  >
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Proceder al pago
                  </Button>
                  <Button variant="outline" onClick={onToggle} className="w-full">
                    Continuar comprando
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    Métodos de pago aceptados:
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                      <Icon name="CreditCard" size={12} className="text-muted-foreground" />
                    </div>
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                      <Icon name="Smartphone" size={12} className="text-muted-foreground" />
                    </div>
                    <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                      <Icon name="Shield" size={12} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ShoppingCart;
