import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const OrderSummary = ({ orderData, showCurrencyToggle = true, className = '' }) => {
  const [showVES, setShowVES] = useState(false);
  const usdToVesRate = 36.5;

  const formatCurrency = (amount, currency = 'USD') =>
    currency === 'VES'
      ? `Bs. ${(amount * usdToVesRate)?.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
      : `$${amount?.toFixed(2)} USD`;

  const subtotal = orderData?.items?.reduce((s, i) => s + i?.price * i?.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax + orderData?.shipping;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Resumen del Pedido</h3>
        {showCurrencyToggle && (
          <Button variant="ghost" size="sm" onClick={() => setShowVES(!showVES)} className="text-xs">
            <Icon name="RefreshCw" size={14} className="mr-1" />
            {showVES ? 'USD' : 'VES'}
          </Button>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {orderData?.items?.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Icon name={item?.icon || 'Package'} size={20} color="var(--color-muted-foreground)" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{item?.name}</h4>
              <p className="text-sm text-muted-foreground">{item?.description || `Cantidad: ${item?.quantity}`}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{formatCurrency(item?.price * item?.quantity, showVES ? 'VES' : 'USD')}</p>
              {item?.quantity > 1 && (
                <p className="text-xs text-muted-foreground">{formatCurrency(item?.price, showVES ? 'VES' : 'USD')} c/u</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="text-foreground">{formatCurrency(subtotal, showVES ? 'VES' : 'USD')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">IVA (16%):</span>
          <span className="text-foreground">{formatCurrency(tax, showVES ? 'VES' : 'USD')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío:</span>
          <span className="text-foreground">{orderData?.shipping === 0 ? 'Gratis' : formatCurrency(orderData?.shipping, showVES ? 'VES' : 'USD')}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
          <span className="text-foreground">Total:</span>
          <span className="text-primary">{formatCurrency(total, showVES ? 'VES' : 'USD')}</span>
        </div>
        {showVES && <p className="text-xs text-muted-foreground text-center">Tasa de cambio: 1 USD = Bs. {usdToVesRate?.toFixed(2)}</p>}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pedido #:</span>
            <span className="text-foreground font-mono">{orderData?.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="text-foreground">{orderData?.date}</span>
          </div>
          {orderData?.deliveryAddress && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entrega:</span>
              <span className="text-foreground text-right max-w-32 truncate" title={orderData?.deliveryAddress}>
                {orderData?.deliveryAddress}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Código promocional"
            className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button variant="outline" size="sm">Aplicar</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
