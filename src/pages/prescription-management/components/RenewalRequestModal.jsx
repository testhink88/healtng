import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const RenewalRequestModal = ({ isOpen, onClose, prescription }) => {
  const [formData, setFormData] = useState({
    reason: '',
    urgency: 'normal',
    additionalNotes: '',
    contactMethod: 'email'
  });

  const urgencyOptions = [
    { value: 'low', label: 'Baja - Tengo suficiente medicamento' },
    { value: 'normal', label: 'Normal - Necesito renovar pronto' },
    { value: 'high', label: 'Alta - Me queda poco medicamento' },
    { value: 'urgent', label: 'Urgente - Sin medicamento' }
  ];

  const contactOptions = [
    { value: 'email', label: 'Correo electrónico' },
    { value: 'phone', label: 'Llamada telefónica' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'app', label: 'Notificación en la app' }
  ];

  const reasonOptions = [
    { value: 'continuing_treatment', label: 'Continuación del tratamiento' },
    { value: 'chronic_condition', label: 'Condición crónica' },
    { value: 'preventive', label: 'Medicamento preventivo' },
    { value: 'maintenance', label: 'Medicamento de mantenimiento' },
    { value: 'other', label: 'Otro motivo' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Mock submission
    const requestData = {
      prescriptionId: prescription?.id,
      medicationName: prescription?.medicationName,
      doctorName: prescription?.doctorName,
      ...formData,
      requestDate: new Date()?.toISOString(),
      status: 'pending'
    };

    console.log('Renewal request submitted:', requestData);
    
    // Show success message
    alert(`Solicitud de renovación enviada al ${prescription?.doctorName}. Te contactaremos dentro de 24-48 horas.`);
    
    onClose();
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'normal':
        return 'text-primary';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Solicitar Renovación</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {prescription?.medicationName} - {prescription?.dosage}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Prescription Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Pill" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{prescription?.medicationName}</h3>
                <p className="text-sm text-muted-foreground">{prescription?.dosage} - {prescription?.frequency}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Médico:</span>
                <span className="ml-2 font-medium text-foreground">{prescription?.doctorName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expiró:</span>
                <span className="ml-2 font-medium text-foreground">
                  {new Date(prescription?.expiryDate)?.toLocaleDateString('es-VE')}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reason */}
            <div>
              <Select
                label="Motivo de la renovación"
                description="Selecciona el motivo principal para renovar esta receta"
                options={reasonOptions}
                value={formData?.reason}
                onChange={(value) => handleInputChange('reason', value)}
                required
              />
            </div>

            {/* Urgency */}
            <div>
              <Select
                label="Nivel de urgencia"
                description="Indica qué tan urgente es esta renovación"
                options={urgencyOptions}
                value={formData?.urgency}
                onChange={(value) => handleInputChange('urgency', value)}
                required
              />
              
              {formData?.urgency && (
                <div className={`mt-2 p-3 rounded-lg border ${
                  formData?.urgency === 'urgent' ? 'bg-error/5 border-error/20' :
                  formData?.urgency === 'high' ? 'bg-warning/5 border-warning/20' :
                  formData?.urgency === 'normal'? 'bg-primary/5 border-primary/20' : 'bg-success/5 border-success/20'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={
                        formData?.urgency === 'urgent' ? 'AlertTriangle' :
                        formData?.urgency === 'high' ? 'Clock' :
                        formData?.urgency === 'normal'? 'Info' : 'CheckCircle'
                      } 
                      size={16} 
                      className={getUrgencyColor(formData?.urgency)}
                    />
                    <span className={`text-sm font-medium ${getUrgencyColor(formData?.urgency)}`}>
                      {formData?.urgency === 'urgent' && 'Procesaremos tu solicitud de inmediato'}
                      {formData?.urgency === 'high' && 'Respuesta esperada en 24 horas'}
                      {formData?.urgency === 'normal' && 'Respuesta esperada en 24-48 horas'}
                      {formData?.urgency === 'low' && 'Respuesta esperada en 2-3 días'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas adicionales
              </label>
              <textarea
                value={formData?.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e?.target?.value)}
                placeholder="Proporciona información adicional que pueda ser útil para el médico..."
                rows={4}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional: Menciona cambios en síntomas, efectos secundarios, o cualquier información relevante
              </p>
            </div>

            {/* Contact Method */}
            <div>
              <Select
                label="Método de contacto preferido"
                description="¿Cómo prefieres que te contactemos con la respuesta?"
                options={contactOptions}
                value={formData?.contactMethod}
                onChange={(value) => handleInputChange('contactMethod', value)}
                required
              />
            </div>

            {/* Important Notice */}
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                <div>
                  <h4 className="font-medium text-warning mb-1">Información importante</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• La renovación debe ser aprobada por el médico tratante</li>
                    <li>• El tiempo de respuesta puede variar según la disponibilidad del médico</li>
                    <li>• Para urgencias médicas, contacta directamente al médico o servicios de emergencia</li>
                    <li>• Recibirás una notificación cuando la solicitud sea procesada</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} />
            <span>Información protegida por confidencialidad médica</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!formData?.reason}
              iconName="Send"
              iconPosition="left"
            >
              Enviar Solicitud
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalRequestModal;