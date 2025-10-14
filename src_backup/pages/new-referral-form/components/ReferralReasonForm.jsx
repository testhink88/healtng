import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const ReferralReasonForm = ({ 
  reason, 
  clinicalNotes, 
  medicalHistory, 
  onReasonChange, 
  onClinicalNotesChange, 
  onMedicalHistoryChange 
}) => {
  const [activeTab, setActiveTab] = useState('reason');

  const tabs = [
    { id: 'reason', label: 'Motivo de Derivación', icon: 'FileText', required: true },
    { id: 'clinical', label: 'Notas Clínicas', icon: 'Stethoscope', required: false },
    { id: 'history', label: 'Historia Médica', icon: 'Clock', required: false }
  ];

  const commonReasons = [
    'Evaluación especializada',
    'Segunda opinión médica',
    'Tratamiento especializado',
    'Procedimiento diagnóstico',
    'Manejo de complicaciones',
    'Control post-tratamiento',
    'Valoración preoperatoria',
    'Seguimiento especializado'
  ];

  const handleReasonSelect = (selectedReason) => {
    if (reason?.includes(selectedReason)) {
      onReasonChange?.(reason?.replace(selectedReason, '')?.trim());
    } else {
      const newReason = reason ? `${reason}. ${selectedReason}` : selectedReason;
      onReasonChange?.(newReason);
    }
  };

  const getCharacterCount = (text, max) => {
    const current = text?.length || 0;
    const remaining = max - current;
    return { current, remaining, isOver: remaining < 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
          <Icon name="Edit3" size={20} className="text-info" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Información Clínica</h3>
          <p className="text-sm text-muted-foreground">Proporcione los detalles médicos relevantes</p>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.required && <span className="text-error">*</span>}
            </button>
          ))}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'reason' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Motivo de la Derivación *
              </label>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange?.(e?.target?.value)}
                placeholder="Describa el motivo principal de la derivación..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              {(() => {
                const charInfo = getCharacterCount(reason, 500);
                return (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Proporcione información específica y relevante
                    </span>
                    <span className={`text-xs ${charInfo?.isOver ? 'text-error' : 'text-muted-foreground'}`}>
                      {charInfo?.current}/500 caracteres
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Common Reasons Quick Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Motivos Comunes (Clic para añadir)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonReasons?.map(commonReason => (
                  <Button
                    key={commonReason}
                    type="button"
                    variant={reason?.includes(commonReason) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleReasonSelect(commonReason)}
                    className="text-xs h-8"
                  >
                    {commonReason}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clinical' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas Clínicas Adicionales
              </label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => onClinicalNotesChange?.(e?.target?.value)}
                placeholder="Incluya hallazgos clínicos relevantes, resultados de exámenes, síntomas específicos..."
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              {(() => {
                const charInfo = getCharacterCount(clinicalNotes, 1000);
                return (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Información detallada para el especialista
                    </span>
                    <span className={`text-xs ${charInfo?.isOver ? 'text-error' : 'text-muted-foreground'}`}>
                      {charInfo?.current}/1000 caracteres
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Clinical Guidelines */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Incluya información relevante:</p>
                  <ul className="text-muted-foreground space-y-1 ml-2">
                    <li>• Síntomas principales y duración</li>
                    <li>• Hallazgos del examen físico</li>
                    <li>• Resultados de laboratorio o estudios</li>
                    <li>• Respuesta a tratamientos previos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Historia Médica Relevante
              </label>
              <textarea
                value={medicalHistory}
                onChange={(e) => onMedicalHistoryChange?.(e?.target?.value)}
                placeholder="Antecedentes médicos, quirúrgicos, familiares o alergias relevantes para la consulta..."
                rows={6}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              {(() => {
                const charInfo = getCharacterCount(medicalHistory, 1000);
                return (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      Antecedentes médicos importantes
                    </span>
                    <span className={`text-xs ${charInfo?.isOver ? 'text-error' : 'text-muted-foreground'}`}>
                      {charInfo?.current}/1000 caracteres
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* History Guidelines */}
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Icon name="Clock" size={16} className="text-warning mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">Historia médica relevante:</p>
                  <ul className="text-muted-foreground space-y-1 ml-2">
                    <li>• Enfermedades crónicas o previas</li>
                    <li>• Cirugías o procedimientos anteriores</li>
                    <li>• Medicamentos actuales</li>
                    <li>• Alergias medicamentosas</li>
                    <li>• Antecedentes familiares relevantes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Progress Indicator */}
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Completitud del formulario:</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {tabs?.map(tab => {
                let isComplete = false;
                if (tab?.id === 'reason') isComplete = reason?.trim()?.length > 0;
                if (tab?.id === 'clinical') isComplete = true; // Optional field
                if (tab?.id === 'history') isComplete = true; // Optional field
                
                return (
                  <div
                    key={tab?.id}
                    className={`w-2 h-2 rounded-full ${
                      isComplete ? 'bg-success' : tab?.required ? 'bg-error' : 'bg-muted'
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-foreground font-medium">
              {tabs?.filter(tab => {
                if (tab?.id === 'reason') return reason?.trim()?.length > 0;
                return true; // Optional fields count as complete
              })?.length}/{tabs?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralReasonForm;