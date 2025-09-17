import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BookingConfirmation = ({ 
  doctor, 
  selectedDate, 
  selectedTime, 
  bookingData, 
  onConfirm, 
  onBack, 
  isProcessing 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    email: true,
    sms: true,
    whatsapp: false
  });

  const paymentMethodOptions = [
    { value: 'credit-card', label: 'Tarjeta de crédito/débito' },
    { value: 'pago-movil', label: 'Pago Móvil' },
    { value: 'bank-transfer', label: 'Transferencia bancaria' },
    { value: 'cash', label: 'Pago en efectivo (en consulta)' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    let total = doctor?.consultationFee?.usd || 0;
    
    if (bookingData?.urgencyLevel === 'urgent') {
      total += total * 0.5;
    } else if (bookingData?.urgencyLevel === 'emergency') {
      total += total * 1;
    }
    
    if (bookingData?.hasInsurance) {
      total *= 0.8;
    }
    
    return total;
  };

  const handleConfirm = () => {
    if (termsAccepted) {
      onConfirm({
        paymentMethod,
        reminderSettings,
        termsAccepted
      });
    }
  };

  const getAppointmentTypeDetails = () => {
    if (bookingData?.appointmentType === 'teleconsultation') {
      return {
        icon: 'Video',
        label: 'Teleconsulta',
        description: 'Videollamada online',
        location: 'Desde tu hogar'
      };
    }
    return {
      icon: 'MapPin',
      label: 'Presencial',
      description: 'En el consultorio',
      location: doctor?.location
    };
  };

  const appointmentDetails = getAppointmentTypeDetails();
  let total = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Confirma tu cita médica
        </h2>
        <p className="text-muted-foreground">
          Revisa todos los detalles antes de proceder al pago
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor & Schedule Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Calendar" size={20} />
              Detalles de la cita
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={doctor?.photo || '/assets/images/no_image.png'}
                alt={doctor?.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-border"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-foreground mb-1">
                  {doctor?.name}
                </h4>
                <p className="text-muted-foreground mb-3">{doctor?.specialty}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={14} className="text-primary" />
                      <span className="font-medium">Fecha:</span>
                      <span>{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={14} className="text-primary" />
                      <span className="font-medium">Hora:</span>
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name={appointmentDetails?.icon} size={14} className="text-primary" />
                      <span className="font-medium">Tipo:</span>
                      <span>{appointmentDetails?.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-primary" />
                      <span className="font-medium">Ubicación:</span>
                      <span>{appointmentDetails?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="FileText" size={20} />
              Información médica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-foreground">Motivo:</span>
                  <p className="text-muted-foreground mt-1">{bookingData?.reason}</p>
                </div>
                {bookingData?.symptoms && (
                  <div>
                    <span className="font-medium text-foreground">Síntomas:</span>
                    <p className="text-muted-foreground mt-1">{bookingData?.symptoms}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {bookingData?.allergies && (
                  <div>
                    <span className="font-medium text-foreground">Alergias:</span>
                    <p className="text-muted-foreground mt-1">{bookingData?.allergies}</p>
                  </div>
                )}
                {bookingData?.currentMedications && (
                  <div>
                    <span className="font-medium text-foreground">Medicamentos:</span>
                    <p className="text-muted-foreground mt-1">{bookingData?.currentMedications}</p>
                  </div>
                )}
              </div>
            </div>

            {bookingData?.urgencyLevel !== 'normal' && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="font-medium text-warning">
                    Nivel de urgencia: {bookingData?.urgencyLevel === 'urgent' ? 'Urgente' : 'Emergencia'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="CreditCard" size={20} />
              Método de pago
            </h3>

            <Select
              options={paymentMethodOptions}
              value={paymentMethod}
              onChange={setPaymentMethod}
              className="mb-4"
            />

            {paymentMethod === 'teleconsultation' && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Video" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">Teleconsulta</p>
                    <p className="text-muted-foreground">
                      Recibirás un enlace de videollamada por email 15 minutos antes de tu cita.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reminder Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Bell" size={20} />
              Recordatorios
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email-reminder"
                  checked={reminderSettings?.email}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, email: e?.target?.checked }))}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="email-reminder" className="text-sm text-foreground cursor-pointer">
                  Recordatorio por email (24h y 1h antes)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sms-reminder"
                  checked={reminderSettings?.sms}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, sms: e?.target?.checked }))}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="sms-reminder" className="text-sm text-foreground cursor-pointer">
                  Recordatorio por SMS (1h antes)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="whatsapp-reminder"
                  checked={reminderSettings?.whatsapp}
                  onChange={(e) => setReminderSettings(prev => ({ ...prev, whatsapp: e?.target?.checked }))}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="whatsapp-reminder" className="text-sm text-foreground cursor-pointer">
                  Recordatorio por WhatsApp (30min antes)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="DollarSign" size={20} />
                Resumen de pago
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consulta base:</span>
                  <span className="font-medium">${doctor?.consultationFee?.usd}</span>
                </div>

                {bookingData?.urgencyLevel === 'urgent' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recargo urgente:</span>
                    <span className="font-medium">+${(doctor?.consultationFee?.usd * 0.5)?.toFixed(2)}</span>
                  </div>
                )}

                {bookingData?.urgencyLevel === 'emergency' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recargo emergencia:</span>
                    <span className="font-medium">+${doctor?.consultationFee?.usd}</span>
                  </div>
                )}

                {bookingData?.hasInsurance && (
                  <div className="flex justify-between text-success">
                    <span>Descuento seguro:</span>
                    <span>-${((total / 0.8) * 0.2)?.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total a pagar:</span>
                    <span className="text-primary">${total?.toFixed(2)} USD</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    ≈ ${(total * 36.8)?.toFixed(2)} VES
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e?.target?.checked)}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring mt-0.5"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                    Acepto los{' '}
                    <a href="#" className="text-primary underline">términos y condiciones</a>
                    {' '}y la{' '}
                    <a href="#" className="text-primary underline">política de privacidad</a>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleConfirm}
                  disabled={!termsAccepted}
                  loading={isProcessing}
                  className="w-full"
                  size="lg"
                  iconName={isProcessing ? undefined : "CreditCard"}
                >
                  {isProcessing ? 'Procesando...' : 'Proceder al pago'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={onBack}
                  disabled={isProcessing}
                  className="w-full"
                  iconName="ArrowLeft"
                >
                  Modificar detalles
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <Icon name="Shield" size={16} className="text-success mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium text-success mb-1">Pago seguro</p>
                    <p className="text-muted-foreground">
                      Todos los pagos son procesados de forma segura y encriptada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;