import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Icon from '@/components/AppIcon';
// ✅ Importamos las funciones exactas definidas en utils para asegurar la lógica de negocio
import { 
  generateTimeSlots, 
  isSlotAvailable, 
  calculateBookingCost, 
  formatCurrency 
} from '@/utils/spaces';

const BookingDrawer = ({
  isOpen = false,
  space,
  existingBookings = [],
  onConfirm,
  onClose
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    professional: '',
    purpose: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  // Bloquear scroll del cuerpo al abrir el drawer para mejorar la experiencia de usuario
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const timeSlots = generateTimeSlots();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.date) newErrors.date = 'Requerido';
    if (!formData?.startTime || !formData?.endTime) newErrors.time = 'Requerido';
    if (!formData?.professional?.trim()) newErrors.professional = 'Indica el profesional';
    if (!formData?.purpose?.trim()) newErrors.purpose = 'Indica el uso';

    if (formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Hora fin inválida';
    }

    if (formData.date && formData.startTime && formData.endTime && !newErrors.endTime) {
      const isAvailable = isSlotAvailable(space?.id, formData.date, formData.startTime, formData.endTime, existingBookings);
      if (!isAvailable) newErrors.timeSlot = 'Horario no disponible';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    const subtotal = calculateBookingCost(space?.hourlyRate, formData.startTime, formData.endTime);
    const commission = subtotal * 0.05;
    const total = subtotal - commission;

    onConfirm?.({ 
      ...formData, 
      subtotal,
      commission,
      totalAmount: total,
      spaceId: space?.id 
    });
  };

  // Cálculos en tiempo real para el resumen financiero del Airbnb médico
  const subtotal = (formData.startTime < formData.endTime) 
    ? calculateBookingCost(space?.hourlyRate, formData.startTime, formData.endTime) 
    : 0;
  const healtngFee = subtotal * 0.05;
  const netEarnings = subtotal - healtngFee;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gray-50/80">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registrar Alquiler</h2>
            <p className="text-sm text-gray-500">{space?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {errors?.timeSlot && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
              <Icon name="AlertCircle" size={18} />
              <p>{errors.timeSlot}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-primary" /> Fecha
              </label>
              <Input 
                type="date" 
                value={formData.date} 
                onChange={(e) => handleInputChange('date', e.target.value)} 
                error={errors.date} 
              />
            </div>

            {/* Rango de Horas - Diseño Corregido para legibilidad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Desde</label>
                <div className="relative">
                  <select 
                    className="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer appearance-none"
                    value={formData.startTime} 
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  >
                    {timeSlots.map(t => <option key={t} value={t} className="bg-white text-gray-900">{t}</option>)}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Icon name="ChevronDown" size={14} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Hasta</label>
                <div className="relative">
                  <select 
                    className={`w-full p-2 bg-white border rounded-md text-gray-900 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer appearance-none ${
                      errors.endTime ? 'border-red-500' : 'border-gray-300'
                    }`} 
                    value={formData.endTime} 
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  >
                    {timeSlots.map(t => <option key={t} value={t} className="bg-white text-gray-900">{t}</option>)}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Icon name="ChevronDown" size={14} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Especialista</label>
              <Input 
                placeholder="Nombre del médico" 
                value={formData.professional} 
                onChange={(e) => handleInputChange('professional', e.target.value)} 
                error={errors.professional} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Motivo</label>
              <Input 
                placeholder="Ej: Consulta pediátrica" 
                value={formData.purpose} 
                onChange={(e) => handleInputChange('purpose', e.target.value)} 
                error={errors.purpose} 
              />
            </div>
          </div>

          {/* Resumen Financiero con Comisión del 5% Healtng */}
          {subtotal > 0 && (
            <div className="mt-8 space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Alquiler ({ (subtotal/space?.hourlyRate).toFixed(1) }h)</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 italic">
                <span className="flex items-center gap-1.5">
                    Comisión Healtng (5%) 
                    <Icon name="Info" size={12} className="text-gray-400" />
                </span>
                <span>- {formatCurrency(healtngFee)}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingreso Neto Clínica</p>
                  <p className="text-2xl font-black text-primary">{formatCurrency(netEarnings)}</p>
                </div>
                <Icon name="TrendingUp" size={24} className="text-green-500 mb-1" />
              </div>
            </div>
          )}
        </form>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button variant="outline" className="flex-1 py-6 rounded-xl" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1 py-6 rounded-xl shadow-lg shadow-primary/20" onClick={handleSubmit}>
            Confirmar Reserva
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDrawer;