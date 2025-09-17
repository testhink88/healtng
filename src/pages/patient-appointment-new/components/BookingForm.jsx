import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BookingForm = ({ doctor, selectedDate, selectedTime, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    appointmentType: 'in-person',
    reason: '',
    urgencyLevel: 'normal',
    symptoms: '',
    allergies: '',
    currentMedications: '',
    hasInsurance: false,
    insuranceProvider: '',
    policyNumber: '',
    emergencyContact: '',
    specialRequirements: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appointmentTypeOptions = [
    { value: 'in-person', label: 'Presencial - En el consultorio' },
    { value: 'teleconsultation', label: 'Teleconsulta - Videollamada' }
  ];

  const urgencyLevelOptions = [
    { value: 'normal', label: 'Normal - Consulta de rutina' },
    { value: 'urgent', label: 'Urgente - Requiere atención pronta' },
    { value: 'emergency', label: 'Emergencia - Atención inmediata' }
  ];

  const insuranceProviders = [
    { value: 'venezolana-seguros', label: 'Venezolana de Seguros' },
    { value: 'seguros-caracas', label: 'Seguros Caracas' },
    { value: 'mapfre', label: 'MAPFRE' },
    { value: 'seguros-venezuela', label: 'Seguros Venezuela' },
    { value: 'other', label: 'Otro' }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.reason?.trim()) {
      newErrors.reason = 'El motivo de la consulta es requerido';
    }

    if (formData?.hasInsurance) {
      if (!formData?.insuranceProvider) {
        newErrors.insuranceProvider = 'Selecciona tu aseguradora';
      }
      if (!formData?.policyNumber?.trim()) {
        newErrors.policyNumber = 'El número de póliza es requerido';
      }
    }

    if (!formData?.emergencyContact?.trim()) {
      newErrors.emergencyContact = 'El contacto de emergencia es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const calculateTotal = () => {
    let total = doctor?.consultationFee?.usd || 0;
    if (formData?.urgencyLevel === 'urgent') {
      total += total * 0.5; // 50% surcharge for urgent
    } else if (formData?.urgencyLevel === 'emergency') {
      total += total * 1; // 100% surcharge for emergency
    }
    
    if (formData?.hasInsurance) {
      total *= 0.8; // 20% discount with insurance
    }
    
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Doctor Summary */}
      <div className="bg-card rounded-xl border border-border p-6">
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
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {doctor?.name}
            </h2>
            <p className="text-muted-foreground mb-2">{doctor?.specialty}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Icon name="Calendar" size={14} className="text-muted-foreground" />
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span>{selectedTime}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={onBack} iconName="ArrowLeft">
            Cambiar fecha
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="FileText" size={20} />
                Información de la cita
              </h3>

              <div className="space-y-4">
                <Select
                  label="Tipo de consulta"
                  options={appointmentTypeOptions}
                  value={formData?.appointmentType}
                  onChange={(value) => handleInputChange('appointmentType', value)}
                  required
                />

                <Input
                  label="Motivo de la consulta"
                  placeholder="Describe brevemente el motivo de tu visita..."
                  value={formData?.reason}
                  onChange={(e) => handleInputChange('reason', e?.target?.value)}
                  error={errors?.reason}
                  required
                />

                <Select
                  label="Nivel de urgencia"
                  options={urgencyLevelOptions}
                  value={formData?.urgencyLevel}
                  onChange={(value) => handleInputChange('urgencyLevel', value)}
                  description="Esto puede afectar el costo y la prioridad de la cita"
                />

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Síntomas actuales (opcional)
                  </label>
                  <textarea
                    placeholder="Describe tus síntomas actuales si los tienes..."
                    value={formData?.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e?.target?.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Heart" size={20} />
                Información médica
              </h3>

              <div className="space-y-4">
                <Input
                  label="Alergias conocidas"
                  placeholder="Ej: Penicilina, mariscos, polen..."
                  value={formData?.allergies}
                  onChange={(e) => handleInputChange('allergies', e?.target?.value)}
                  description="Incluye alergias a medicamentos, alimentos o sustancias"
                />

                <Input
                  label="Medicamentos actuales"
                  placeholder="Ej: Losartán 50mg, Metformina 850mg..."
                  value={formData?.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e?.target?.value)}
                  description="Lista todos los medicamentos que tomas actualmente"
                />

                <Input
                  label="Contacto de emergencia"
                  placeholder="Nombre y teléfono: Ej. María Pérez +58 412 1234567"
                  value={formData?.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e?.target?.value)}
                  error={errors?.emergencyContact}
                  required
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Shield" size={20} />
                Información del seguro
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="has-insurance"
                    checked={formData?.hasInsurance}
                    onChange={(e) => handleInputChange('hasInsurance', e?.target?.checked)}
                    className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <label htmlFor="has-insurance" className="text-sm font-medium text-foreground cursor-pointer">
                    Tengo seguro médico
                  </label>
                </div>

                {formData?.hasInsurance && (
                  <>
                    <Select
                      label="Aseguradora"
                      options={insuranceProviders}
                      value={formData?.insuranceProvider}
                      onChange={(value) => handleInputChange('insuranceProvider', value)}
                      error={errors?.insuranceProvider}
                      required={formData?.hasInsurance}
                    />

                    <Input
                      label="Número de póliza"
                      placeholder="Ingresa tu número de póliza"
                      value={formData?.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e?.target?.value)}
                      error={errors?.policyNumber}
                      required={formData?.hasInsurance}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Special Requirements */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Requerimientos especiales
              </h3>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Necesidades especiales (opcional)
                </label>
                <textarea
                  placeholder="Ej: Acceso para silla de ruedas, intérprete de lenguaje de señas, etc."
                  value={formData?.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="DollarSign" size={20} />
                  Resumen de costos
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consulta base:</span>
                    <span className="font-medium">${doctor?.consultationFee?.usd}</span>
                  </div>

                  {formData?.urgencyLevel === 'urgent' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recargo urgente (50%):</span>
                      <span className="font-medium">+${(doctor?.consultationFee?.usd * 0.5)?.toFixed(2)}</span>
                    </div>
                  )}

                  {formData?.urgencyLevel === 'emergency' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recargo emergencia (100%):</span>
                      <span className="font-medium">+${doctor?.consultationFee?.usd}</span>
                    </div>
                  )}

                  {formData?.hasInsurance && (
                    <div className="flex justify-between text-success">
                      <span>Descuento seguro (20%):</span>
                      <span>-${((calculateTotal() / 0.8) * 0.2)?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">${calculateTotal()?.toFixed(2)} USD</span>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      ≈ ${(calculateTotal() * 36.8)?.toFixed(2)} VES
                    </div>
                  </div>
                </div>

                {formData?.appointmentType === 'teleconsultation' && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Icon name="Video" size={16} className="text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-primary">Teleconsulta</p>
                        <p className="text-muted-foreground">
                          Recibirás un enlace de videollamada 15 minutos antes de tu cita.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  loading={isSubmitting}
                  iconName={isSubmitting ? undefined : "ArrowRight"}
                >
                  {isSubmitting ? 'Procesando...' : 'Continuar al pago'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;