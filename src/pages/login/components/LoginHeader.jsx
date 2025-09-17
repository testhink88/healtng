import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-12">
      {/* Logo and Brand */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Heart" size={32} color="white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Healtng
      </h1>
      
      <p className="text-xl text-muted-foreground mb-2">
        Plataforma Integral de Salud
      </p>
      
      <p className="text-base text-muted-foreground max-w-2xl mx-auto">
        Conectando pacientes, profesionales médicos, clínicas y proveedores en Venezuela 
        con tecnología avanzada y pagos en USD
      </p>

      {/* Key Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-success)" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Citas Médicas</h3>
          <p className="text-xs text-muted-foreground text-center">
            Agenda y gestiona citas con profesionales verificados
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Pill" size={20} color="var(--color-primary)" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Recetas Digitales</h3>
          <p className="text-xs text-muted-foreground text-center">
            Prescripciones seguras con firma digital verificada
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
            <Icon name="DollarSign" size={20} color="var(--color-warning)" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Pagos USD</h3>
          <p className="text-xs text-muted-foreground text-center">
            Transacciones seguras en dólares americanos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;