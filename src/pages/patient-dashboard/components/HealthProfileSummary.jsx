import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthProfileSummary = ({ className = '' }) => {
  const [healthProfile] = useState({
    allergies: [
      { id: 1, name: 'Penicilina', severity: 'high', type: 'medication' },
      { id: 2, name: 'Mariscos', severity: 'medium', type: 'food' },
      { id: 3, name: 'Polen', severity: 'low', type: 'environmental' }
    ],
    chronicConditions: [
      { id: 1, name: 'Hipertensión Arterial', controlled: true, since: '2020' },
      { id: 2, name: 'Diabetes Tipo 2', controlled: true, since: '2018' }
    ],
    emergencyContacts: [
      { id: 1, name: 'Juan González', relationship: 'Esposo', phone: '+58 414-123-4567' },
      { id: 2, name: 'Ana González', relationship: 'Hija', phone: '+58 424-987-6543' }
    ],
    bloodType: 'O+',
    lastUpdate: '2025-08-01'
  });

  const [expandedSection, setExpandedSection] = useState(null);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error bg-error/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Desconocida';
    }
  };

  const getAllergyIcon = (type) => {
    switch (type) {
      case 'medication': return 'Pill';
      case 'food': return 'Apple';
      case 'environmental': return 'Leaf';
      default: return 'AlertTriangle';
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEditProfile = () => {
    window.location.href = '/profile/health';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('es-VE', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-card rounded-2xl border border-border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Perfil de Salud</h2>
        <Button
          variant="ghost"
          onClick={handleEditProfile}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Editar perfil
        </Button>
      </div>
      <div className="space-y-4">
        {/* Blood Type & Basic Info */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="Droplet" size={18} color="var(--color-error)" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Tipo de Sangre</h3>
                <p className="text-2xl font-bold text-error">{healthProfile?.bloodType}</p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Última actualización</p>
              <p>{formatDate(healthProfile?.lastUpdate)}</p>
            </div>
          </div>
        </div>

        {/* Allergies Section */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => toggleSection('allergies')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Alergias</h3>
                <p className="text-sm text-muted-foreground">
                  {healthProfile?.allergies?.length} registradas
                </p>
              </div>
            </div>
            <Icon 
              name={expandedSection === 'allergies' ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === 'allergies' && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.allergies?.map((allergy) => (
                <div key={allergy?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getAllergyIcon(allergy?.type)} 
                      size={16} 
                      className="text-muted-foreground"
                    />
                    <div>
                      <p className="font-medium text-foreground">{allergy?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{allergy?.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy?.severity)}`}>
                    {getSeverityText(allergy?.severity)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chronic Conditions Section */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => toggleSection('conditions')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="Activity" size={16} color="var(--color-primary)" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Condiciones Crónicas</h3>
                <p className="text-sm text-muted-foreground">
                  {healthProfile?.chronicConditions?.length} condiciones
                </p>
              </div>
            </div>
            <Icon 
              name={expandedSection === 'conditions' ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === 'conditions' && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.chronicConditions?.map((condition) => (
                <div key={condition?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${condition?.controlled ? 'bg-success' : 'bg-warning'}`}></div>
                    <div>
                      <p className="font-medium text-foreground">{condition?.name}</p>
                      <p className="text-xs text-muted-foreground">Desde {condition?.since}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    condition?.controlled ? 'text-success bg-success/10' : 'text-warning bg-warning/10'
                  }`}>
                    {condition?.controlled ? 'Controlada' : 'En tratamiento'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Contacts Section */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => toggleSection('contacts')}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="Phone" size={16} color="var(--color-error)" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Contactos de Emergencia</h3>
                <p className="text-sm text-muted-foreground">
                  {healthProfile?.emergencyContacts?.length} contactos
                </p>
              </div>
            </div>
            <Icon 
              name={expandedSection === 'contacts' ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>

          {expandedSection === 'contacts' && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {healthProfile?.emergencyContacts?.map((contact) => (
                <div key={contact?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{contact?.name}</p>
                      <p className="text-xs text-muted-foreground">{contact?.relationship}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{contact?.phone}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`tel:${contact?.phone}`)}
                      className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                    >
                      Llamar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/medical-history'}
            className="flex items-center justify-center space-x-2"
          >
            <Icon name="FileText" size={16} />
            <span>Historial Completo</span>
          </Button>
          
          <Button
            variant="default"
            onClick={handleEditProfile}
            className="flex items-center justify-center space-x-2"
          >
            <Icon name="Edit" size={16} />
            <span>Editar Perfil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthProfileSummary;