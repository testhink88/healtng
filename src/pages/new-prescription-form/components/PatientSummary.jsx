import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientSummary = ({ patient, appointment }) => {
  if (!patient) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="User" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Información del Paciente</h2>
          <p className="text-sm text-muted-foreground">Datos precargados de la cita</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Nombre del Paciente
          </label>
          <p className="text-foreground font-medium">{patient?.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Edad
          </label>
          <p className="text-foreground font-medium">{patient?.age} años</p>
        </div>

        {appointment && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Fecha de Consulta
            </label>
            <p className="text-foreground font-medium">
              {new Date(appointment?.date)?.toLocaleDateString('es-VE')}
            </p>
          </div>
        )}
      </div>
      {patient?.allergies && patient?.allergies?.length > 0 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Alergias Conocidas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient?.allergies?.map((allergy, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded-full"
              >
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}
      {patient?.currentMedications && patient?.currentMedications?.length > 0 && (
        <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Pill" size={16} className="text-info" />
            <span className="text-sm font-medium text-info">Medicamentos Actuales</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient?.currentMedications?.map((medication, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-info/20 text-info text-xs font-medium rounded-full"
              >
                {medication}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSummary;