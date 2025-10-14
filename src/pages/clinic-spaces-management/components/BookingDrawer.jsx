import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import { generateTimeSlots, isSlotAvailable, calculateBookingCost } from '../../../utils/spaces';

const BookingDrawer = ({
  isOpen = false,             // 🔹 NUEVO: control de visibilidad
  space,
  existingBookings = [],
  onConfirm,
  onClose
}) => {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    professional: '',
    purpose: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // 🔹 Si no está abierto, NO renderizamos nada (no hay backdrop bloqueando)
  if (!isOpen) return null;

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const timeSlots = generateTimeSlots();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.date) newErrors.date = 'La fecha es requerida';
    if (!formData?.startTime) newErrors.startTime = 'La hora de inicio es requerida';
    if (!formData?.endTime) newErrors.endTime = 'La hora de fin es requerida';
    if (!formData?.professional) newErrors.professional = 'El profesional es requerido';
    if (!formData?.purpose) newErrors.purpose = 'El uso previsto es requerido';

    if (formData?.startTime && formData?.endTime && formData?.startTime >= formData?.endTime) {
      newErrors.endTime = 'La hora de fin debe ser posterior a la de inicio';
    }

    if (formData?.date && formData?.startTime && formData?.endTime) {
      const ok = isSlotAvailable(
        space?.id,
        formData?.date,
        formData?.startTime,
        formData?.endTime,
        existingBookings
      );
      if (!ok) newErrors.timeSlot = 'El horario seleccionado no está disponible';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    const cost = calculateBookingCost(space?.hourlyRate, formData?.startTime, formData?.endTime);
    onConfirm?.({ ...formData, cost, spaceId: space?.id });
  };

  const estimatedCost =
    formData?.startTime && formData?.endTime
      ? calculateBookingCost(space?.hourlyRate, formData?.startTime, formData?.endTime)
      : 0;

  // Cerrar si el clic fue en el backdrop (no dentro del drawer)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Nueva Reserva</h2>
            <p className="text-sm text-gray-500">{space?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Space Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">{space?.name}</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Tipo: {space?.type}</p>
              <p>Capacidad: {space?.capacity} personas</p>
              <p>Tarifa: ${space?.hourlyRate}/hora</p>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              className={errors?.date ? 'border-red-300' : ''}
            />
            {errors?.date && <p className="mt-1 text-sm text-red-600">{errors?.date}</p>}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Inicio <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData?.startTime}
                onValueChange={(v) => handleInputChange('startTime', v)}
                className={errors?.startTime ? 'border-red-300' : ''}
              >
                <option value="">Seleccionar</option>
                {timeSlots?.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
              {errors?.startTime && <p className="mt-1 text-sm text-red-600">{errors?.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Fin <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData?.endTime}
                onValueChange={(v) => handleInputChange('endTime', v)}
                className={errors?.endTime ? 'border-red-300' : ''}
              >
                <option value="">Seleccionar</option>
                {timeSlots?.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
              {errors?.endTime && <p className="mt-1 text-sm text-red-600">{errors?.endTime}</p>}
            </div>
          </div>

          {errors?.timeSlot && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{errors?.timeSlot}</p>
            </div>
          )}

          {/* Professional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profesional <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nombre del profesional"
              value={formData?.professional}
              onChange={(e) => handleInputChange('professional', e?.target?.value)}
              className={errors?.professional ? 'border-red-300' : ''}
            />
            {errors?.professional && (
              <p className="mt-1 text-sm text-red-600">{errors?.professional}</p>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uso Previsto <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Describe el uso del espacio"
              value={formData?.purpose}
              onChange={(e) => handleInputChange('purpose', e?.target?.value)}
              className={errors?.purpose ? 'border-red-300' : ''}
            />
            {errors?.purpose && (
              <p className="mt-1 text-sm text-red-600">{errors?.purpose}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              placeholder="Información adicional o requerimientos especiales"
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
              rows="3"
            />
          </div>

          {/* Cost Summary */}
          {estimatedCost > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Resumen de Costo</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex justify-between"><span>Tarifa por hora:</span><span>${space?.hourlyRate}</span></div>
                <div className="flex justify-between">
                  <span>Duración estimada:</span>
                  <span>{(estimatedCost / (space?.hourlyRate || 1)).toFixed(2)} horas</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-green-300 pt-2">
                  <span>Total estimado:</span><span>${estimatedCost}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1">Confirmar Reserva</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDrawer;
