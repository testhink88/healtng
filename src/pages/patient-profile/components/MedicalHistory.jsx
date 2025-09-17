import React from 'react';
import Icon from 'components/AppIcon';

const MedicalHistory = ({ patient }) => {
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
      case 'firmado':
        return 'bg-success/10 text-success border-success/20';
      case 'borrador':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Diagnoses Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={20} className="mr-2" />
          Diagnósticos ({patient?.diagnoses?.length || 0})
        </h3>
        
        {patient?.diagnoses?.length > 0 ? (
          <div className="space-y-4">
            {patient?.diagnoses?.map((diagnosis) => (
              <div key={diagnosis?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{diagnosis?.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>Fecha: {formatDate(diagnosis?.date)}</span>
                      <span>Emitido por: {diagnosis?.doctorName}</span>
                      {diagnosis?.icd10 && <span>CIE-10: {diagnosis?.icd10}</span>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(diagnosis?.status)}`}>
                    {diagnosis?.status}
                  </span>
                </div>
                
                {diagnosis?.notes && (
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm text-foreground">{diagnosis?.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay diagnósticos registrados</p>
          </div>
        )}
      </div>

      {/* Referrals Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Share2" size={20} className="mr-2" />
          Derivaciones ({patient?.referrals?.length || 0})
        </h3>
        
        {patient?.referrals?.length > 0 ? (
          <div className="space-y-4">
            {patient?.referrals?.map((referral) => (
              <div key={referral?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{referral?.toSpecialty}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>Fecha: {formatDate(referral?.date)}</span>
                      {referral?.toProvider && <span>Derivado a: {referral?.toProvider}</span>}
                      <span>Firmado por: {referral?.signedBy}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    referral?.priority === 'Urgente' ? 'bg-error/10 text-error border-error/20' :
                    referral?.priority === 'Alta'? 'bg-warning/10 text-warning border-warning/20' : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {referral?.priority}
                  </span>
                </div>
                
                {referral?.reason && (
                  <div className="bg-background rounded-md p-3">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Motivo:</p>
                    <p className="text-sm text-foreground">{referral?.reason}</p>
                  </div>
                )}
                
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <Icon name="CheckCircle" size={14} className="mr-1" />
                  Firmado digitalmente por {referral?.signedBy}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Share2" size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay derivaciones registradas</p>
          </div>
        )}
      </div>

      {/* Medical Summary */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Resumen de Actividad Médica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {patient?.diagnoses?.length || 0}
            </div>
            <div className="text-sm text-primary font-medium">Diagnósticos</div>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-2">
              {patient?.prescriptions?.length || 0}
            </div>
            <div className="text-sm text-secondary font-medium">Recetas</div>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-2">
              {patient?.referrals?.length || 0}
            </div>
            <div className="text-sm text-accent font-medium">Derivaciones</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;