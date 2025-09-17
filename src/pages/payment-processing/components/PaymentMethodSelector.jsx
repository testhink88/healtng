import React from 'react';
import Icon from '../../../components/AppIcon';


const PaymentMethodSelector = ({ selectedMethod, onMethodChange, className = '' }) => {
  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      description: 'Visa, Mastercard, American Express',
      icon: 'CreditCard',
      popular: true
    },
    {
      id: 'pago_movil',
      name: 'Pago Móvil',
      description: 'Sistema bancario venezolano',
      icon: 'Smartphone',
      popular: false
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Método de Pago</h3>
      {paymentMethods?.map((method) => (
        <div
          key={method?.id}
          onClick={() => onMethodChange(method?.id)}
          className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
            selectedMethod === method?.id
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20' :'border-border bg-card hover:border-primary/50 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedMethod === method?.id ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <Icon 
                name={method?.icon} 
                size={24} 
                color={selectedMethod === method?.id ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-foreground">{method?.name}</h4>
                {method?.popular && (
                  <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{method?.description}</p>
            </div>
            
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === method?.id
                ? 'border-primary bg-primary' :'border-muted-foreground'
            }`}>
              {selectedMethod === method?.id && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;