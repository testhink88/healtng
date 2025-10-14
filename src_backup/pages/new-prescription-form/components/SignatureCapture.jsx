import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

const SignatureCapture = ({ signature, onSignatureChange }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleStartCapture = () => {
    setIsCapturing(true);
  };

  const handleSaveSignature = () => {
    // Mock signature capture
    const mockSignature = {
      id: Date.now(),
      timestamp: new Date()?.toISOString(),
      verified: true
    };
    
    onSignatureChange(mockSignature);
    setIsCapturing(false);
  };

  const handleClearSignature = () => {
    onSignatureChange(null);
    setIsCapturing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Firma Digital</h2>
      <div className="space-y-4">
        {!signature && !isCapturing && (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Icon name="PenTool" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              Firma requerida para validar la receta médica
            </p>
            <Button
              onClick={handleStartCapture}
              iconName="Edit"
              iconPosition="left"
            >
              Firmar Receta
            </Button>
          </div>
        )}

        {isCapturing && (
          <div className="border border-border rounded-lg p-4">
            <div className="w-full h-32 bg-background border border-border rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Signature" size={32} className="text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Área de firma (simulada)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSaveSignature}
                iconName="Check"
                iconPosition="left"
                size="sm"
              >
                Guardar Firma
              </Button>
              <Button
                variant="outline"
                onClick={handleClearSignature}
                iconName="X"
                iconPosition="left"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {signature && !isCapturing && (
          <div className="border border-success rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="font-medium text-success">Firma Verificada</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSignature}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Firmar Nuevamente
              </Button>
            </div>
            
            <div className="w-full h-20 bg-success/5 border border-success/20 rounded flex items-center justify-center">
              <Icon name="FileSignature" size={24} className="text-success" />
            </div>
            
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Firmado el: {new Date(signature.timestamp)?.toLocaleString('es-VE')}</p>
              <p>Estado: Verificado digitalmente</p>
            </div>
          </div>
        )}

        {/* Digital Signature Info */}
        <div className="bg-info/5 border border-info/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-info mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-info mb-1">Firma Digital Segura</p>
              <p className="text-info/80 text-xs">
                La firma digital cumple con los estándares del Colegio Médico de Venezuela y 
                garantiza la autenticidad e integridad de la prescripción médica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureCapture;