import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ShoppingCart = ({ items, isOpen, onToggle, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotalItems = () => {
    return items?.reduce((total, item) => total + item?.quantity, 0);
  };

  const getTotalPrice = () => {
    return items?.reduce((total, item) => {
      const itemPrice = item?.discount > 0 
        ? item?.price * (1 - item?.discount / 100)
        : item?.price;
      return total + (itemPrice * item?.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    await onCheckout(items);
    setTimeout(() => setIsProcessing(false), 1000);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId);
    } else {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40">
        <Button
          variant="default"
          onClick={onToggle}
          className="relative w-14 h-14 rounded-full shadow-lg"
        >
          <Icon name="ShoppingCart" size={24} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {getTotalItems() > 99 ? '99+' : getTotalItems()}
            </span>
          )}
        </Button>
      </div>
      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:bg-transparent lg:pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-xl lg:pointer-events-auto">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="ShoppingCart" size={20} />
                <h3 className="font-semibold text-foreground">
                  Carrito ({getTotalItems()})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            {/* Cart Content */}
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
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items?.map((item) => {
                      const itemPrice = item?.discount > 0 
                        ? item?.price * (1 - item?.discount / 100)
                        : item?.price;
                      
                      return (
                        <div key={item?.id} className="flex space-x-3 p-3 bg-muted/30 rounded-lg">
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
                                      ${itemPrice?.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-muted-foreground line-through">
                                      ${item?.price?.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm font-semibold text-foreground">
                                    ${itemPrice?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
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
                                  onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                                  className="w-6 h-6"
                                  disabled={item?.quantity >= item?.stock}
                                >
                                  <Icon name="Plus" size={12} />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-foreground">
                                Subtotal: ${(itemPrice * item?.quantity)?.toFixed(2)}
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

                  {/* Cart Summary */}
                  <div className="border-t border-border p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">${getTotalPrice()?.toFixed(2)}</span>
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
                            ${getTotalPrice()?.toFixed(2)} USD
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
                      <Button
                        variant="outline"
                        onClick={onToggle}
                        className="w-full"
                      >
                        Continuar comprando
                      </Button>
                    </div>

                    {/* Payment Methods */}
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">Métodos de pago aceptados:</p>
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
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;