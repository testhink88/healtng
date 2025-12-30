import React from "react";
import Icon from "@/components/AppIcon";

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, className = "" }) => {
  const paymentMethods = [
    { id: "credit_card", name: "Débito / Crédito", description: "Visa, Mastercard, American Express", icon: "CreditCard", popular: true },
    { id: "pago_movil", name: "Pago móvil", description: "Sistema bancario venezolano", icon: "Smartphone", popular: false },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-2">Seleccionar método</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods.map((m) => (
          <button
            type="button"
            key={m.id}
            onClick={() => onMethodChange(m.id)}
            className={`relative text-left p-3 border rounded-lg transition-all duration-200 focus:outline-none ${
              selectedMethod === m.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMethod === m.id ? "bg-primary/10" : "bg-muted"}`}>
                <Icon name={m.icon} size={18} color={selectedMethod === m.id ? "var(--color-primary)" : "var(--color-muted-foreground)"} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{m.name}</span>
                  {m.popular && <span className="bg-success text-success-foreground text-[10px] px-1.5 py-0.5 rounded-full">Popular</span>}
                </div>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedMethod === m.id ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                {selectedMethod === m.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
