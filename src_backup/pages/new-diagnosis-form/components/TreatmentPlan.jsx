import React from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const TreatmentPlan = ({ 
  treatmentPlan, 
  onTreatmentPlanChange, 
  followUpDate, 
  onFollowUpDateChange,
  patientEducation,
  onPatientEducationChange 
}) => {
  const handleAddEducationItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      description: '',
      priority: 'medium'
    };
    onPatientEducationChange([...patientEducation, newItem]);
  };

  const handleUpdateEducationItem = (itemId, field, value) => {
    const updatedItems = patientEducation?.map(item =>
      item?.id === itemId
        ? { ...item, [field]: value }
        : item
    );
    onPatientEducationChange(updatedItems);
  };

  const handleRemoveEducationItem = (itemId) => {
    onPatientEducationChange(patientEducation?.filter(item => item?.id !== itemId));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Plan de Tratamiento</h2>
      <div className="space-y-6">
        {/* Treatment Plan */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Plan de Tratamiento
          </label>
          <textarea
            value={treatmentPlan}
            onChange={(e) => onTreatmentPlanChange(e?.target?.value)}
            placeholder="Describe el plan de tratamiento, medicamentos, procedimientos, y recomendaciones..."
            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fecha de Seguimiento
          </label>
          <Input
            type="date"
            value={followUpDate}
            onChange={(e) => onFollowUpDateChange(e?.target?.value)}
            min={new Date()?.toISOString()?.split('T')?.[0]}
          />
        </div>

        {/* Patient Education */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Icon name="BookOpen" size={20} className="text-primary" />
              <h3 className="font-medium text-foreground">Educación al Paciente</h3>
            </div>
            <Button
              onClick={handleAddEducationItem}
              iconName="Plus"
              iconPosition="left"
              size="sm"
            >
              Agregar Material
            </Button>
          </div>

          {patientEducation?.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-border rounded-lg">
              <Icon name="BookOpen" size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">No hay material educativo asignado</p>
              <p className="text-sm text-muted-foreground">
                Agregue información educativa para el paciente
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {patientEducation?.map((item) => (
                <div key={item?.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Título del Material
                          </label>
                          <Input
                            value={item?.title || ''}
                            onChange={(e) => handleUpdateEducationItem(item?.id, 'title', e?.target?.value)}
                            placeholder="ej. Cuidados post-operatorios"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Prioridad
                          </label>
                          <select
                            value={item?.priority || 'medium'}
                            onChange={(e) => handleUpdateEducationItem(item?.id, 'priority', e?.target?.value)}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                            <option value="critical">Crítica</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Descripción / Instrucciones
                        </label>
                        <textarea
                          value={item?.description || ''}
                          onChange={(e) => handleUpdateEducationItem(item?.id, 'description', e?.target?.value)}
                          placeholder="Instrucciones detalladas para el paciente..."
                          className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEducationItem(item?.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Info */}
        <div className="bg-info/5 border border-info/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Lightbulb" size={16} className="text-info mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-info mb-1">Sugerencias de Tratamiento</p>
              <p className="text-info/80 text-xs">
                Después de guardar el diagnóstico, podrás crear recetas médicas, 
                agendar seguimientos y derivar a especialistas de forma rápida.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlan;