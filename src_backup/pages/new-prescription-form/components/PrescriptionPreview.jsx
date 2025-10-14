import React from 'react';
import Icon from '@/components/AppIcon';

const PrescriptionPreview = ({ patient, appointment, medications, signature }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Eye" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Vista Previa</h2>
      </div>
      {/* Prescription Header */}
      <div className="border-b border-border pb-4 mb-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-foreground">RECETA MÉDICA</h3>
          <p className="text-sm text-muted-foreground">Prescripción Digital Verificada</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Médico:</span>
            <span className="font-medium text-foreground">
              {appointment?.doctorName || 'Dr. Carlos Rodríguez'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paciente:</span>
            <span className="font-medium text-foreground">{patient?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-medium text-foreground">
              {new Date()?.toLocaleDateString('es-VE')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Edad:</span>
            <span className="font-medium text-foreground">{patient?.age} años</span>
          </div>
        </div>
      </div>
      {/* Medications List */}
      <div className="mb-4">
        <h4 className="font-medium text-foreground mb-3">Medicamentos Prescritos:</h4>
        
        {medications?.length === 0 ? (
          <p className="text-muted-foreground italic text-sm">
            No se han agregado medicamentos
          </p>
        ) : (
          <div className="space-y-3">
            {medications?.map((medication, index) => (
              <div key={medication?.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-sm font-medium text-primary mt-0.5">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground text-sm">
                      {medication?.name}
                    </h5>
                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <div>Dosis: {medication?.dosage}</div>
                      <div>Frecuencia: {medication?.frequency}</div>
                      <div>Duración: {medication?.duration}</div>
                      {medication?.instructions && (
                        <div>Instrucciones: {medication?.instructions}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Signature Section */}
      <div className="border-t border-border pt-4">
        <h4 className="font-medium text-foreground mb-3">Firma Médica:</h4>
        
        {signature ? (
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <div className="w-full h-16 bg-background border border-border rounded flex items-center justify-center">
              <Icon name="FileSignature" size={24} className="text-success" />
            </div>
            <p className="text-xs text-success text-center mt-2">
              Firmado digitalmente
            </p>
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-4 bg-muted/10">
            <div className="text-center">
              <Icon name="PenTool" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Firma pendiente
              </p>
            </div>
          </div>
        )}
      </div>
      {/* QR Code Placeholder */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-dashed border-border rounded mx-auto flex items-center justify-center mb-2">
            <Icon name="QrCode" size={20} className="text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Código QR se generará al guardar
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPreview;