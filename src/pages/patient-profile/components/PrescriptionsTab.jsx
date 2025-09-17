import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const PrescriptionsTab = ({ prescriptions = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'emitida':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'dispensada':
        return 'bg-success/10 text-success border-success/20';
      case 'vencida':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'emitida': return 'Clock';
      case 'dispensada': return 'CheckCircle';
      case 'vencida': return 'XCircle';
      default: return 'Pill';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Pill" size={20} className="mr-2" />
          Recetas Médicas ({prescriptions?.length || 0})
        </h3>
        <Button 
          size="sm"
          onClick={() => {
            const patientId = new URLSearchParams(window.location.search)?.get('patientId') || 
                            window.location?.pathname?.split('/')?.pop();
            window.location.href = `/prescriptions/new?patientId=${patientId}`;
          }}
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Nueva Receta
        </Button>
      </div>
      {prescriptions?.length > 0 ? (
        <div className="space-y-6">
          {prescriptions?.map((prescription) => (
            <div key={prescription?.id} className="bg-muted/50 rounded-lg border border-border overflow-hidden">
              {/* Prescription Header */}
              <div className="p-4 bg-background border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon name="Pill" size={20} className="text-primary" />
                      <h4 className="font-medium text-foreground">
                        Receta #{prescription?.id?.toUpperCase()}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription?.status)}`}>
                        <Icon name={getStatusIcon(prescription?.status)} size={12} className="mr-1" />
                        {prescription?.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Fecha de emisión:</span>
                        <br />
                        {formatDate(prescription?.issueDate)}
                      </div>
                      <div>
                        <span className="font-medium">Válida hasta:</span>
                        <br />
                        {formatDate(prescription?.validUntil)}
                      </div>
                      <div>
                        <span className="font-medium">Farmacia:</span>
                        <br />
                        {prescription?.pharmacy || 'No especificada'}
                      </div>
                      <div>
                        <span className="font-medium">Firmada por:</span>
                        <br />
                        {prescription?.signedBy}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>

              {/* Medications List */}
              <div className="p-4">
                <h5 className="font-medium text-foreground mb-3 flex items-center">
                  <Icon name="List" size={16} className="mr-2" />
                  Medicamentos ({prescription?.meds?.length})
                </h5>
                
                <div className="space-y-3">
                  {prescription?.meds?.map((med, index) => (
                    <div key={index} className="bg-background rounded-md p-4 border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Medicamento</p>
                          <p className="font-medium text-foreground">{med?.drug}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Dosis</p>
                          <p className="text-foreground">{med?.dose}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Frecuencia</p>
                          <p className="text-foreground">{med?.freq}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duración</p>
                          <p className="text-foreground">{med?.duration}</p>
                        </div>
                      </div>
                      
                      {med?.instructions && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Instrucciones:</p>
                          <p className="text-sm text-foreground">{med?.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Digital Signature */}
                <div className="mt-4 pt-4 border-t border-border flex items-center text-xs text-muted-foreground">
                  <Icon name="Shield" size={14} className="mr-2" />
                  Firmado digitalmente por {prescription?.signedBy} el {formatDate(prescription?.issueDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Pill" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h4 className="text-lg font-medium text-foreground mb-2">No hay recetas registradas</h4>
          <p className="text-muted-foreground mb-4">
            Este paciente aún no tiene recetas médicas emitidas.
          </p>
          <Button 
            onClick={() => {
              const patientId = new URLSearchParams(window.location.search)?.get('patientId') || 
                              window.location?.pathname?.split('/')?.pop();
              window.location.href = `/prescriptions/new?patientId=${patientId}`;
            }}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Crear Primera Receta
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsTab;