import React from 'react';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const ClinicalFindings = ({ findings, onFindingsChange, vitalSigns, onVitalSignsChange }) => {
  const handleVitalSignChange = (field, value) => {
    onVitalSignsChange({
      ...vitalSigns,
      [field]: value
    });
  };

  const handleAddFinding = () => {
    const newFinding = {
      id: Date.now(),
      description: '',
      type: 'examination',
      timestamp: new Date()?.toISOString()
    };
    onFindingsChange([...findings, newFinding]);
  };

  const handleUpdateFinding = (findingId, field, value) => {
    const updatedFindings = findings?.map(finding =>
      finding?.id === findingId
        ? { ...finding, [field]: value }
        : finding
    );
    onFindingsChange(updatedFindings);
  };

  const handleRemoveFinding = (findingId) => {
    onFindingsChange(findings?.filter(finding => finding?.id !== findingId));
  };

  return (
    <div className="space-y-6">
      {/* Vital Signs */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="font-medium text-foreground">Signos Vitales</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Presión Arterial
            </label>
            <Input
              value={vitalSigns?.bloodPressure || ''}
              onChange={(e) => handleVitalSignChange('bloodPressure', e?.target?.value)}
              placeholder="ej. 120/80 mmHg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Frecuencia Cardíaca
            </label>
            <Input
              value={vitalSigns?.heartRate || ''}
              onChange={(e) => handleVitalSignChange('heartRate', e?.target?.value)}
              placeholder="ej. 80 lpm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Temperatura
            </label>
            <Input
              value={vitalSigns?.temperature || ''}
              onChange={(e) => handleVitalSignChange('temperature', e?.target?.value)}
              placeholder="ej. 36.5°C"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Saturación O₂
            </label>
            <Input
              value={vitalSigns?.oxygenSaturation || ''}
              onChange={(e) => handleVitalSignChange('oxygenSaturation', e?.target?.value)}
              placeholder="ej. 98%"
            />
          </div>
        </div>
      </div>
      {/* Clinical Findings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <h3 className="font-medium text-foreground">Hallazgos Clínicos</h3>
          </div>
          <Button
            onClick={handleAddFinding}
            iconName="Plus"
            iconPosition="left"
            size="sm"
          >
            Agregar Hallazgo
          </Button>
        </div>

        {findings?.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-border rounded-lg">
            <Icon name="Stethoscope" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No hay hallazgos clínicos registrados</p>
            <p className="text-sm text-muted-foreground">
              Agregue hallazgos del examen físico y pruebas diagnósticas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {findings?.map((finding) => (
              <div key={finding?.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de Hallazgo
                      </label>
                      <select
                        value={finding?.type || 'examination'}
                        onChange={(e) => handleUpdateFinding(finding?.id, 'type', e?.target?.value)}
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="examination">Examen Físico</option>
                        <option value="laboratory">Laboratorio</option>
                        <option value="imaging">Imagenología</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Descripción del Hallazgo
                      </label>
                      <textarea
                        value={finding?.description || ''}
                        onChange={(e) => handleUpdateFinding(finding?.id, 'description', e?.target?.value)}
                        placeholder="Describa el hallazgo clínico..."
                        className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFinding(finding?.id)}
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
    </div>
  );
};

export default ClinicalFindings;