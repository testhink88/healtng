import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  space, 
  onConfirmBooking, 
  selectedDate,
  className = '' 
}) => {
  const [bookingData, setBookingData] = useState({
    date: selectedDate ? selectedDate?.toISOString()?.split('T')?.[0] : '',
    startTime: '',
    duration: '',
    equipment: [],
    specialRequirements: '',
    patientName: '',
    patientPhone: '',
    procedure: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ]?.map(time => ({ value: time, label: time }));

  const durationOptions = [
    { value: '1', label: '1 hora' },
    { value: '1.5', label: '1.5 horas' },
    { value: '2', label: '2 horas' },
    { value: '2.5', label: '2.5 horas' },
    { value: '3', label: '3 horas' },
    { value: '4', label: '4 horas' },
    { value: '6', label: '6 horas' },
    { value: '8', label: '8 horas' }
  ];

  const equipmentOptions = space?.equipment?.map(item => ({
    value: item,
    label: item
  })) || [];

  const procedureOptions = [
    { value: 'consulta-general', label: 'Consulta General' },
    { value: 'consulta-especializada', label: 'Consulta Especializada' },
    { value: 'procedimiento-menor', label: 'Procedimiento Menor' },
    { value: 'cirugia-ambulatoria', label: 'Cirugía Ambulatoria' },
    { value: 'diagnostico', label: 'Procedimiento Diagnóstico' },
    { value: 'terapia', label: 'Sesión de Terapia' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
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

    if (!bookingData?.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!bookingData?.startTime) {
      newErrors.startTime = 'La hora de inicio es requerida';
    }

    if (!bookingData?.duration) {
      newErrors.duration = 'La duración es requerida';
    }

    if (!bookingData?.patientName?.trim()) {
      newErrors.patientName = 'El nombre del paciente es requerido';
    }

    if (!bookingData?.patientPhone?.trim()) {
      newErrors.patientPhone = 'El teléfono del paciente es requerido';
    }

    if (!bookingData?.procedure) {
      newErrors.procedure = 'El tipo de procedimiento es requerido';
    }

    // Validate minimum duration
    const minDuration = space?.minDuration || 1;
    if (bookingData?.duration && parseFloat(bookingData?.duration) < minDuration) {
      newErrors.duration = `La duración mínima es ${minDuration} hora(s)`;
    }

    // Validate date is not in the past
    if (bookingData?.date) {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'No se puede reservar en fechas pasadas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const calculateTotalCost = () => {
    if (!bookingData?.duration || !space?.pricePerHour) return 0;
    return parseFloat(bookingData?.duration) * space?.pricePerHour;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const reservationData = {
        ...bookingData,
        spaceId: space?.id,
        spaceName: space?.name,
        clinicName: space?.clinic?.name,
        totalCost: calculateTotalCost(),
        status: space?.policies?.approval === 'Inmediata' ? 'APPROVED' : 'PENDING'
      };

      await onConfirmBooking(reservationData);
      onClose();
    } catch (error) {
      console.error('Error creating reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !space) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Reservar Espacio</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {space?.name} - {space?.clinic?.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha de Reserva"
              value={bookingData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
            
            <Select
              label="Hora de Inicio"
              options={timeSlots}
              value={bookingData?.startTime}
              onChange={(value) => handleInputChange('startTime', value)}
              error={errors?.startTime}
              placeholder="Seleccionar hora"
              required
            />
          </div>

          {/* Duration and Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Duración"
              description={`Duración mínima: ${space?.minDuration} hora(s)`}
              options={durationOptions}
              value={bookingData?.duration}
              onChange={(value) => handleInputChange('duration', value)}
              error={errors?.duration}
              placeholder="Seleccionar duración"
              required
            />
            
            <Select
              label="Equipamiento Adicional"
              description="Equipamiento especial requerido"
              options={equipmentOptions}
              value={bookingData?.equipment}
              onChange={(value) => handleInputChange('equipment', value)}
              multiple
              placeholder="Seleccionar equipamiento"
            />
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Información del Paciente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Nombre Completo del Paciente"
                value={bookingData?.patientName}
                onChange={(e) => handleInputChange('patientName', e?.target?.value)}
                error={errors?.patientName}
                placeholder="Nombre del paciente"
                required
              />
              
              <Input
                type="tel"
                label="Teléfono del Paciente"
                value={bookingData?.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e?.target?.value)}
                error={errors?.patientPhone}
                placeholder="+58 412 123 4567"
                required
              />
            </div>
          </div>

          {/* Procedure Information */}
          <div className="space-y-4">
            <Select
              label="Tipo de Procedimiento"
              options={procedureOptions}
              value={bookingData?.procedure}
              onChange={(value) => handleInputChange('procedure', value)}
              error={errors?.procedure}
              placeholder="Seleccionar procedimiento"
              required
            />
            
            <Input
              type="textarea"
              label="Requerimientos Especiales"
              description="Describe cualquier requerimiento especial o preparación necesaria"
              value={bookingData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
              placeholder="Ej: Paciente con movilidad reducida, requiere silla de ruedas..."
              rows={3}
            />
            
            <Input
              type="textarea"
              label="Notas Adicionales"
              description="Información adicional relevante para la reserva"
              value={bookingData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Notas adicionales..."
              rows={2}
            />
          </div>

          {/* Cost Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-foreground mb-3">Resumen de Costos</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precio por hora:</span>
                <span className="text-foreground">${space?.pricePerHour} USD</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duración:</span>
                <span className="text-foreground">
                  {bookingData?.duration ? `${bookingData?.duration} hora(s)` : '-'}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">${calculateTotalCost()} USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-accent/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2">Políticas de Reserva</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Icon name="Clock" size={12} className="mr-2" />
                <span>Cancelación: {space?.policies?.cancellation}</span>
              </div>
              <div className="flex items-center">
                <Icon name="Shield" size={12} className="mr-2" />
                <span>Aprobación: {space?.policies?.approval}</span>
              </div>
              <div className="flex items-center">
                <Icon name="AlertCircle" size={12} className="mr-2" />
                <span>Tiempo de buffer: 15 minutos entre reservas</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              loading={isSubmitting}
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
            >
              {space?.policies?.approval === 'Inmediata' ? 'Confirmar Reserva' : 'Solicitar Reserva'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;