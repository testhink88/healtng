import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientContext = ({ patient, appointment }) => {
  if (!patient || !appointment) return null;

  return (
    <div className="bg-muted/30 rounded-lg p-3">
      <div className="flex items-start space-x-3">
        {/* Patient Avatar */}
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {patient?.avatarUrl ? (
            <img 
              src={patient?.avatarUrl} 
              alt={patient?.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Icon name="User" size={20} color="var(--color-primary)" />
          )}
        </div>

        {/* Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground text-sm truncate">
              {patient?.fullName}
            </h4>
            <span className="text-xs text-muted-foreground">
              {patient?.age} años
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="flex items-center space-x-1">
              <Icon name="CreditCard" size={12} />
              <span>{patient?.dni}</span>
              <span className="mx-1">•</span>
              <span>Tipo {patient?.bloodType}</span>
            </p>
            
            {appointment?.time && (
              <p className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Cita: {appointment?.time}</span>
              </p>
            )}
            
            {patient?.allergies?.length > 0 && (
              <p className="flex items-start space-x-1">
                <Icon name="AlertTriangle" size={12} className="mt-0.5 text-warning" />
                <span className="text-warning">
                  Alergias: {patient?.allergies?.join(', ')}
                </span>
              </p>
            )}
            
            {patient?.chronicConditions?.length > 0 && (
              <p className="flex items-start space-x-1">
                <Icon name="Info" size={12} className="mt-0.5 text-info" />
                <span className="text-info">
                  Condiciones: {patient?.chronicConditions?.join(', ')}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Reason */}
      {appointment?.reason && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Motivo de consulta:</span> {appointment?.reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientContext;