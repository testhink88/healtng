import React from 'react';
import Icon from '@/components/AppIcon';

const PaymentProgress = ({ currentStep = 1, isProcessing = false, className = '' }) => {
  const steps = [
    {
      id: 1,
      title: 'Método de Pago',
      description: 'Seleccionar forma de pago',
      icon: 'CreditCard'
    },
    {
      id: 2,
      title: 'Información',
      description: 'Completar datos de pago',
      icon: 'FileText'
    },
    {
      id: 3,
      title: 'Procesamiento',
      description: 'Verificando transacción',
      icon: 'Loader'
    },
    {
      id: 4,
      title: 'Confirmación',
      description: 'Pago completado',
      icon: 'CheckCircle'
    }
  ];

  const getStepStatus = (stepId) => {
    if (isProcessing && stepId === 3) return 'processing';
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return {
          circle: 'bg-success text-success-foreground',
          line: 'bg-success',
          text: 'text-success',
          description: 'text-muted-foreground'
        };
      case 'current':
        return {
          circle: 'bg-primary text-primary-foreground ring-4 ring-primary/20',
          line: 'bg-muted',
          text: 'text-primary font-medium',
          description: 'text-foreground'
        };
      case 'processing':
        return {
          circle: 'bg-warning text-warning-foreground animate-pulse',
          line: 'bg-muted',
          text: 'text-warning font-medium',
          description: 'text-foreground'
        };
      default:
        return {
          circle: 'bg-muted text-muted-foreground',
          line: 'bg-muted',
          text: 'text-muted-foreground',
          description: 'text-muted-foreground'
        };
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-6">Progreso del Pago</h3>
      <div className="space-y-4">
        {steps?.map((step, index) => {
          const status = getStepStatus(step?.id);
          const classes = getStepClasses(status);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.id} className="relative">
              <div className="flex items-center space-x-4">
                {/* Step Circle */}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${classes?.circle}`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : status === 'processing' ? (
                    <Icon name="Loader" size={16} className="animate-spin" />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm transition-colors duration-300 ${classes?.text}`}>
                    {step?.title}
                  </h4>
                  <p className={`text-xs transition-colors duration-300 ${classes?.description}`}>
                    {step?.description}
                  </p>
                </div>

                {/* Step Status Indicator */}
                {status === 'current' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs text-primary font-medium">Actual</span>
                  </div>
                )}
                
                {status === 'processing' && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Loader" size={12} className="text-warning animate-spin" />
                    <span className="text-xs text-warning font-medium">Procesando</span>
                  </div>
                )}
                
                {status === 'completed' && (
                  <div className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={12} className="text-success" />
                    <span className="text-xs text-success font-medium">Completado</span>
                  </div>
                )}
              </div>
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-5 top-10 w-0.5 h-6 transition-colors duration-300" 
                     style={{ backgroundColor: status === 'completed' ? 'var(--color-success)' : 'var(--color-muted)' }}>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Processing Message */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={16} color="var(--color-warning)" />
            <div>
              <p className="text-sm font-medium text-warning">Procesando Pago</p>
              <p className="text-xs text-muted-foreground">
                Por favor espere mientras verificamos su transacción...
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Estimated Time */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Tiempo estimado: {isProcessing ? '30-60 segundos' : '2-3 minutos'}
        </p>
      </div>
    </div>
  );
};

export default PaymentProgress;