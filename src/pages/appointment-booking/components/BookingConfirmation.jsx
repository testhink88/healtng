import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingConfirmation = ({ 
  appointmentData, 
  doctor, 
  totalAmount, 
  onConfirm, 
  onCancel,
  isProcessing = false 
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Tarjeta de Crédito/Débito',
      description: 'Visa, Mastercard, American Express',
      icon: 'CreditCard',
      available: true
    },
    {
      id: 'pago-movil',
      name: 'Pago Móvil',
      description: 'Transferencia bancaria venezolana',
      icon: 'Smartphone',
      available: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pago seguro con PayPal',
      icon: 'Wallet',
      available: false
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleProceedToPayment = () => {
    if (selectedPaymentMethod) {
      onConfirm({
        ...appointmentData,
        paymentMethod: selectedPaymentMethod,
        totalAmount
      });
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-VE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAppointmentTypeLabel = (type) => {
    return type === 'in-person' ? 'Consulta Presencial' : 'Teleconsulta';
  };

  const getUrgencyLabel = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'Urgente';
      case 'follow-up': return 'Seguimiento';
      default: return 'Rutina';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Confirmar Cita Médica</h2>
        <p className="text-muted-foreground">
          Revisa los detalles de tu cita antes de proceder al pago
        </p>
      </div>
      {/* Appointment Details */}
      <div className="bg-muted/50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Detalles de la Cita</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Médico</label>
              <p className="font-medium text-foreground">Dr. {doctor?.name}</p>
              <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Fecha y Hora</label>
              <p className="font-medium text-foreground">{formatDate(appointmentData?.selectedDate)}</p>
              <p className="text-sm text-muted-foreground">{appointmentData?.selectedTime}</p>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Tipo de Consulta</label>
              <p className="font-medium text-foreground">
                {getAppointmentTypeLabel(appointmentData?.appointmentType)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Motivo de la Consulta</label>
              <p className="font-medium text-foreground">{appointmentData?.reasonForVisit}</p>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Nivel de Urgencia</label>
              <p className="font-medium text-foreground">
                {getUrgencyLabel(appointmentData?.urgencyLevel)}
              </p>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Contacto</label>
              <p className="font-medium text-foreground">{appointmentData?.contactPhone}</p>
              <p className="text-sm text-muted-foreground">{appointmentData?.contactEmail}</p>
            </div>
          </div>
        </div>

        {appointmentData?.symptoms && (
          <div className="mt-4 pt-4 border-t border-border">
            <label className="text-sm text-muted-foreground">Síntomas</label>
            <p className="font-medium text-foreground">{appointmentData?.symptoms}</p>
          </div>
        )}

        {appointmentData?.specialRequirements && (
          <div className="mt-4 pt-4 border-t border-border">
            <label className="text-sm text-muted-foreground">Requerimientos Especiales</label>
            <p className="font-medium text-foreground">{appointmentData?.specialRequirements}</p>
          </div>
        )}
      </div>
      {/* Insurance Information */}
      {appointmentData?.hasInsurance && (
        <div className="bg-success/10 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Shield" size={16} className="text-success" />
            <span className="font-medium text-success">Seguro Médico</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {appointmentData?.insuranceProvider} - Póliza: {appointmentData?.policyNumber}
          </p>
        </div>
      )}
      {/* Cost Breakdown */}
      <div className="bg-accent/20 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-foreground mb-4">Resumen de Costos</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Consulta {doctor?.specialty}</span>
            <span className="font-medium">${doctor?.consultationFee} USD</span>
          </div>
          
          {appointmentData?.urgencyLevel === 'urgent' && (
            <div className="flex justify-between text-warning">
              <span>Recargo por urgencia (50%)</span>
              <span>+${(doctor?.consultationFee * 0.5)?.toFixed(2)} USD</span>
            </div>
          )}
          
          {appointmentData?.hasInsurance && (
            <div className="flex justify-between text-success">
              <span>Descuento por seguro (20%)</span>
              <span>-${(totalAmount * 0.2)?.toFixed(2)} USD</span>
            </div>
          )}
          
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
            <span>Total a Pagar:</span>
            <span className="text-primary">${totalAmount?.toFixed(2)} USD</span>
          </div>
        </div>
      </div>
      {/* Payment Method Selection */}
      {!showPaymentOptions ? (
        <div className="text-center">
          <Button
            onClick={() => setShowPaymentOptions(true)}
            className="w-full sm:w-auto min-w-[200px]"
            disabled={isProcessing}
          >
            Proceder al Pago
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Selecciona Método de Pago</h3>
          
          <div className="space-y-3">
            {paymentMethods?.map((method) => (
              <div
                key={method?.id}
                onClick={() => method?.available && handlePaymentMethodSelect(method?.id)}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all duration-150
                  ${method?.available 
                    ? selectedPaymentMethod === method?.id
                      ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50 hover:bg-muted/50' :'border-border bg-muted/30 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === method?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Icon name={method?.icon} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{method?.name}</p>
                    <p className="text-sm text-muted-foreground">{method?.description}</p>
                  </div>
                  
                  {selectedPaymentMethod === method?.id && (
                    <Icon name="Check" size={20} className="text-primary" />
                  )}
                  
                  {!method?.available && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Próximamente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPaymentOptions(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Volver
            </Button>
            
            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedPaymentMethod || isProcessing}
              loading={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Procesando...' : `Pagar $${totalAmount?.toFixed(2)} USD`}
            </Button>
          </div>
        </div>
      )}
      {/* Cancel Option */}
      <div className="text-center mt-6 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancelar y volver
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;