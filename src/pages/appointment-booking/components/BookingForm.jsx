import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingForm = ({ 
  selectedDate, 
  selectedTime, 
  doctor, 
  onSubmit, 
  isLoading = false,
  patientInfo 
}) => {
  const [formData, setFormData] = useState({
    appointmentType: 'in-person',
    reasonForVisit: '',
    symptoms: '',
    urgencyLevel: 'routine',
    hasInsurance: false,
    insuranceProvider: '',
    policyNumber: '',
    specialRequirements: '',
    contactPhone: patientInfo?.phone || '',
    contactEmail: patientInfo?.email || '',
    emergencyContact: patientInfo?.emergencyContact || '',
    allergies: patientInfo?.allergies || '',
    currentMedications: patientInfo?.medications || '',
    agreedToTerms: false,
    agreedToPrivacy: false
  });

  const [errors, setErrors] = useState({});

  const appointmentTypeOptions = [
    { value: 'in-person', label: 'Consulta Presencial', description: 'Visita en el consultorio médico' },
    { value: 'teleconsultation', label: 'Teleconsulta', description: 'Consulta virtual por video llamada' }
  ];

  const urgencyLevelOptions = [
    { value: 'routine', label: 'Rutina', description: 'Consulta de control regular' },
    { value: 'urgent', label: 'Urgente', description: 'Requiere atención prioritaria' },
    { value: 'follow-up', label: 'Seguimiento', description: 'Consulta de seguimiento' }
  ];

  const insuranceProviders = [
    { value: 'seguros-caracas', label: 'Seguros Caracas' },
    { value: 'mapfre', label: 'MAPFRE Venezuela' },
    { value: 'mercantil-seguros', label: 'Mercantil Seguros' },
    { value: 'la-previsora', label: 'La Previsora' },
    { value: 'other', label: 'Otro proveedor' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.reasonForVisit?.trim()) {
      newErrors.reasonForVisit = 'El motivo de la consulta es requerido';
    }

    if (!formData?.contactPhone?.trim()) {
      newErrors.contactPhone = 'El teléfono de contacto es requerido';
    }

    if (!formData?.contactEmail?.trim()) {
      newErrors.contactEmail = 'El email de contacto es requerido';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }

    if (formData?.hasInsurance && !formData?.insuranceProvider) {
      newErrors.insuranceProvider = 'Selecciona tu proveedor de seguros';
    }

    if (formData?.hasInsurance && !formData?.policyNumber?.trim()) {
      newErrors.policyNumber = 'El número de póliza es requerido';
    }

    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = 'Debes aceptar los términos y condiciones';
    }

    if (!formData?.agreedToPrivacy) {
      newErrors.agreedToPrivacy = 'Debes aceptar la política de privacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        selectedDate,
        selectedTime,
        doctorId: doctor?.id
      });
    }
  };

  const calculateTotal = () => {
    let total = doctor?.consultationFee;
    if (formData?.urgencyLevel === 'urgent') {
      total += doctor?.consultationFee * 0.5; // 50% surcharge for urgent
    }
    return total;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Detalles de la Cita</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Appointment Summary */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-2">Resumen de la Cita</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha:</span>
              <span className="font-medium">
                {selectedDate?.toLocaleDateString('es-VE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hora:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Médico:</span>
              <span className="font-medium">Dr. {doctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Especialidad:</span>
              <span className="font-medium">{doctor?.specialty}</span>
            </div>
          </div>
        </div>

        {/* Appointment Type */}
        <Select
          label="Tipo de Consulta"
          description="Selecciona el formato de tu consulta"
          options={appointmentTypeOptions}
          value={formData?.appointmentType}
          onChange={(value) => handleInputChange('appointmentType', value)}
          required
        />

        {/* Reason for Visit */}
        <Input
          label="Motivo de la Consulta"
          type="text"
          placeholder="Describe brevemente el motivo de tu consulta"
          value={formData?.reasonForVisit}
          onChange={(e) => handleInputChange('reasonForVisit', e?.target?.value)}
          error={errors?.reasonForVisit}
          required
        />

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Síntomas (Opcional)
          </label>
          <textarea
            placeholder="Describe tus síntomas actuales..."
            value={formData?.symptoms}
            onChange={(e) => handleInputChange('symptoms', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        {/* Urgency Level */}
        <Select
          label="Nivel de Urgencia"
          description="Indica la prioridad de tu consulta"
          options={urgencyLevelOptions}
          value={formData?.urgencyLevel}
          onChange={(value) => handleInputChange('urgencyLevel', value)}
        />

        {/* Insurance Information */}
        <div className="space-y-4">
          <Checkbox
            label="Tengo seguro médico"
            checked={formData?.hasInsurance}
            onChange={(e) => handleInputChange('hasInsurance', e?.target?.checked)}
          />

          {formData?.hasInsurance && (
            <div className="space-y-4 pl-6 border-l-2 border-primary/20">
              <Select
                label="Proveedor de Seguros"
                options={insuranceProviders}
                value={formData?.insuranceProvider}
                onChange={(value) => handleInputChange('insuranceProvider', value)}
                error={errors?.insuranceProvider}
                required
              />

              <Input
                label="Número de Póliza"
                type="text"
                placeholder="Ingresa tu número de póliza"
                value={formData?.policyNumber}
                onChange={(e) => handleInputChange('policyNumber', e?.target?.value)}
                error={errors?.policyNumber}
                required
              />
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Teléfono de Contacto"
            type="tel"
            placeholder="+58 412 123 4567"
            value={formData?.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e?.target?.value)}
            error={errors?.contactPhone}
            required
          />

          <Input
            label="Email de Contacto"
            type="email"
            placeholder="tu@email.com"
            value={formData?.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
            error={errors?.contactEmail}
            required
          />
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <Input
            label="Alergias (Opcional)"
            type="text"
            placeholder="Medicamentos, alimentos, etc."
            value={formData?.allergies}
            onChange={(e) => handleInputChange('allergies', e?.target?.value)}
          />

          <Input
            label="Medicamentos Actuales (Opcional)"
            type="text"
            placeholder="Lista de medicamentos que tomas actualmente"
            value={formData?.currentMedications}
            onChange={(e) => handleInputChange('currentMedications', e?.target?.value)}
          />
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Requerimientos Especiales (Opcional)
          </label>
          <textarea
            placeholder="Accesibilidad, idioma, etc."
            value={formData?.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        {/* Cost Summary */}
        <div className="bg-accent/20 rounded-lg p-4">
          <h3 className="font-medium text-foreground mb-3">Resumen de Costos</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Consulta {doctor?.specialty}</span>
              <span>${doctor?.consultationFee} USD</span>
            </div>
            {formData?.urgencyLevel === 'urgent' && (
              <div className="flex justify-between text-warning">
                <span>Recargo por urgencia (50%)</span>
                <span>+${(doctor?.consultationFee * 0.5)?.toFixed(2)} USD</span>
              </div>
            )}
            {formData?.hasInsurance && (
              <div className="flex justify-between text-success">
                <span>Descuento por seguro</span>
                <span>-${(calculateTotal() * 0.2)?.toFixed(2)} USD</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between font-semibold text-lg">
              <span>Total a Pagar:</span>
              <span className="text-primary">
                ${formData?.hasInsurance ? (calculateTotal() * 0.8)?.toFixed(2) : calculateTotal()?.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <Checkbox
            label="Acepto los términos y condiciones del servicio médico"
            checked={formData?.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
            error={errors?.agreedToTerms}
            required
          />

          <Checkbox
            label="Acepto la política de privacidad y manejo de datos médicos"
            checked={formData?.agreedToPrivacy}
            onChange={(e) => handleInputChange('agreedToPrivacy', e?.target?.checked)}
            error={errors?.agreedToPrivacy}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history?.back()}
            className="flex-1"
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            loading={isLoading}
            disabled={!selectedDate || !selectedTime || isLoading}
            className="flex-1"
          >
            {isLoading ? 'Procesando...' : 'Confirmar Cita'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;