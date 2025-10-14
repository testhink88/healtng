import React from 'react';
import Icon from '@/components/AppIcon';

const SecurityTrustSignals = ({ className = '' }) => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Encriptación SSL',
      description: 'Conexión segura de 256 bits'
    },
    {
      icon: 'Lock',
      title: 'PCI DSS',
      description: 'Cumplimiento de estándares'
    },
    {
      icon: 'Eye',
      title: 'Privacidad',
      description: 'No almacenamos datos de tarjetas'
    },
    {
      icon: 'CheckCircle',
      title: 'Verificado',
      description: 'Procesador autorizado'
    }
  ];

  const paymentLogos = [
    { name: 'Visa', icon: 'CreditCard' },
    { name: 'Mastercard', icon: 'CreditCard' },
    { name: 'American Express', icon: 'CreditCard' },
    { name: 'Pago Móvil', icon: 'Smartphone' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Shield" size={32} color="var(--color-success)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Pago 100% Seguro</h3>
        <p className="text-sm text-muted-foreground">
          Tu información está protegida con los más altos estándares de seguridad
        </p>
      </div>
      {/* Security Features */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name={feature?.icon} size={16} color="var(--color-success)" />
            </div>
            <h4 className="text-xs font-medium text-foreground">{feature?.title}</h4>
            <p className="text-xs text-muted-foreground">{feature?.description}</p>
          </div>
        ))}
      </div>
      {/* Payment Methods */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground text-center mb-3">
          Métodos de Pago Aceptados
        </p>
        <div className="flex justify-center space-x-4">
          {paymentLogos?.map((payment, index) => (
            <div
              key={index}
              className="w-12 h-8 bg-muted rounded flex items-center justify-center"
              title={payment?.name}
            >
              <Icon name={payment?.icon} size={16} className="text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>SSL Seguro</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} />
            <span>Datos Protegidos</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={12} />
            <span>Verificado</span>
          </div>
        </div>
      </div>
      {/* Money Back Guarantee */}
      <div className="mt-4 p-3 bg-success/5 rounded-lg border border-success/20">
        <div className="flex items-center space-x-2">
          <Icon name="RotateCcw" size={16} color="var(--color-success)" />
          <div>
            <p className="text-sm font-medium text-success">Garantía de Reembolso</p>
            <p className="text-xs text-muted-foreground">
              30 días para solicitar devolución completa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTrustSignals;