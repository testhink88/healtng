import React from 'react';
import Icon from '@/components/AppIcon';

const PersonalInfo = ({ patient }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'O+': 'bg-red-100 text-red-800 border-red-200',
      'O-': 'bg-red-100 text-red-800 border-red-200',
      'A+': 'bg-blue-100 text-blue-800 border-blue-200',
      'A-': 'bg-blue-100 text-blue-800 border-blue-200',
      'B+': 'bg-green-100 text-green-800 border-green-200',
      'B-': 'bg-green-100 text-green-800 border-green-200',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors?.[bloodType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="User" size={20} className="mr-2" />
          Información Básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
            <p className="text-foreground font-medium">{patient?.fullName}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Documento de Identidad</label>
            <p className="text-foreground font-medium">{patient?.dni}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
            <p className="text-foreground font-medium">{formatDate(patient?.dateOfBirth)}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Edad</label>
            <p className="text-foreground font-medium">{patient?.age} años</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Género</label>
            <p className="text-foreground font-medium">{patient?.gender}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Grupo Sanguíneo</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getBloodTypeColor(patient?.bloodType)}`}>
              {patient?.bloodType}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Phone" size={20} className="mr-2" />
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
            <p className="text-foreground font-medium">{patient?.phone}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground font-medium">{patient?.email}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Dirección</label>
            <p className="text-foreground font-medium">{patient?.address}</p>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Heart" size={20} className="mr-2" />
          Información Médica
        </h3>
        
        <div className="space-y-4">
          {/* Allergies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Alergias</label>
            {patient?.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient?.allergies?.map((allergy, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-error/10 text-error text-sm rounded-full border border-error/20 font-medium"
                  >
                    <Icon name="AlertTriangle" size={12} className="mr-1" />
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin alergias registradas</p>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Condiciones Crónicas</label>
            {patient?.chronicConditions?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient?.chronicConditions?.map((condition, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20 font-medium"
                  >
                    <Icon name="Clock" size={12} className="mr-1" />
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin condiciones crónicas registradas</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="AlertCircle" size={20} className="mr-2" />
          Contacto de Emergencia
        </h3>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <p className="text-foreground font-medium">{patient?.emergencyContact?.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Relación</label>
              <p className="text-foreground font-medium">{patient?.emergencyContact?.relationship}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
              <p className="text-foreground font-medium">{patient?.emergencyContact?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Información del Seguro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Aseguradora</label>
            <p className="text-foreground font-medium">{patient?.insurance?.provider}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Número de Póliza</label>
            <p className="text-foreground font-medium">{patient?.insurance?.policyNumber}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Estado</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              patient?.insurance?.status === 'Vigente' ? 'bg-success/10 text-success border border-success/20': 'bg-error/10 text-error border border-error/20'
            }`}>
              {patient?.insurance?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;