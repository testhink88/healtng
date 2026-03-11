import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { updateAppointment } from '@/api/appointments';

const RescheduleModal = ({ isOpen, appointment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        date: appointment.date || '',
        time: appointment.time || ''
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAppointment(appointment.id, {
        date: formData.date,
        time: formData.time
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Error rescheduling:", err);
      alert("Error al reprogramar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="Calendar" size={20} className="text-[#0E39B1]" />
            Reprogramar Cita
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon name="X" size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 mb-4">
             <p className="text-xs text-[#0E39B1] font-semibold uppercase tracking-wider mb-1">Paciente</p>
             <p className="text-sm font-medium text-gray-900">{appointment.patientName || appointment.patient_name || 'Paciente'}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nueva Fecha</label>
            <Input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="bg-gray-50 border-gray-100 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nueva Hora</label>
            <Input 
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="bg-gray-50 border-gray-100 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} loading={isLoading} iconName="Save">
            Reprogramar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
