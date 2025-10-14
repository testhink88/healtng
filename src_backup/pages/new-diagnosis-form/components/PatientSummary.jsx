import React from 'react';
import Icon from '@/components/AppIcon';

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
          <p className="text-sm text-muted-foreground">Datos precargados de la cita médica</p>
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

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Género
          </label>
          <p className="text-foreground font-medium">{patient?.gender}</p>
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

        {appointment && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Hora
            </label>
            <p className="text-foreground font-medium">{appointment?.time}</p>
          </div>
        )}

        {appointment && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Médico Tratante
            </label>
            <p className="text-foreground font-medium">{appointment?.doctorName}</p>
          </div>
        )}
      </div>
      {patient?.chiefComplaint && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MessageCircle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Motivo de Consulta</span>
          </div>
          <p className="text-foreground text-sm">{patient?.chiefComplaint}</p>
        </div>
      )}
      {patient?.medicalHistory && patient?.medicalHistory?.length > 0 && (
        <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} className="text-info" />
            <span className="text-sm font-medium text-info">Antecedentes Médicos</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {patient?.medicalHistory?.map((condition, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-info/20 text-info text-xs font-medium rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSummary;