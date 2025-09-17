import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: 'Colegio de Médicos de Venezuela',
      icon: 'Shield',
      verified: true
    },
    {
      id: 2,
      name: 'Colegio de Enfermeras de Venezuela',
      icon: 'ShieldCheck',
      verified: true
    },
    {
      id: 3,
      name: 'Federación Odontológica Venezolana',
      icon: 'Award',
      verified: true
    }
  ];

  const securityFeatures = [
    {
      id: 1,
      name: 'Cifrado SSL 256-bit',
      icon: 'Lock',
      description: 'Conexión segura'
    },
    {
      id: 2,
      name: 'Datos Protegidos',
      icon: 'Database',
      description: 'Información médica segura'
    },
    {
      id: 3,
      name: 'Cumplimiento HIPAA',
      icon: 'FileCheck',
      description: 'Estándares internacionales'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Medical Certifications */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Certificaciones Médicas Oficiales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications?.map((cert) => (
            <div
              key={cert?.id}
              className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-md transition-shadow duration-150"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-success/10 rounded-full flex items-center justify-center">
                <Icon name={cert?.icon} size={20} color="var(--color-success)" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-2">{cert?.name}</h4>
              {cert?.verified && (
                <div className="flex items-center justify-center space-x-1">
                  <Icon name="CheckCircle" size={14} color="var(--color-success)" />
                  <span className="text-xs text-success">Verificado</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Security Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Seguridad y Privacidad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {securityFeatures?.map((feature) => (
            <div
              key={feature?.id}
              className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-md transition-shadow duration-150"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={feature?.icon} size={20} color="var(--color-primary)" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1">{feature?.name}</h4>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Indicators */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} color="var(--color-primary)" />
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-foreground">+10,000</p>
              <p className="text-xs text-muted-foreground">Profesionales Registrados</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Building2" size={20} color="var(--color-secondary)" />
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-foreground">+500</p>
              <p className="text-xs text-muted-foreground">Clínicas Afiliadas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Heart" size={20} color="var(--color-success)" />
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-foreground">+50,000</p>
              <p className="text-xs text-muted-foreground">Pacientes Atendidos</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Plataforma autorizada por el Ministerio de Salud de Venezuela
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Registro Sanitario: RS-2025-001234
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;