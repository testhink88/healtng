import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const PatientCard = ({ patient, onAction }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No programada';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No programada';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ')
      ?.map(word => word?.[0])
      ?.join('')
      ?.toUpperCase()
      ?.slice(0, 2) || 'P';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'inactive': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getUrgencyLevel = (patient) => {
    const hasChronicConditions = patient?.chronicConditions?.length > 0;
    const hasAllergies = patient?.allergies?.length > 0;
    const lastVisit = new Date(patient?.lastVisit);
    const daysSinceVisit = Math.floor((new Date() - lastVisit) / (1000 * 60 * 60 * 24));
    
    if (daysSinceVisit > 90 && hasChronicConditions) {
      return { level: 'high', label: 'Seguimiento Urgente', color: 'text-error' };
    } else if (daysSinceVisit > 60) {
      return { level: 'medium', label: 'Seguimiento Requerido', color: 'text-warning' };
    } else {
      return { level: 'low', label: 'Al Día', color: 'text-success' };
    }
  };

  const urgency = getUrgencyLevel(patient);

  return (
    <div className="bg-card rounded-lg border border-border hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Patient Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {patient?.avatarUrl ? (
                <img 
                  src={patient?.avatarUrl} 
                  alt={patient?.fullName}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`${patient?.avatarUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-primary font-medium text-sm`}>
                {getInitials(patient?.fullName)}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{patient?.fullName}</h3>
              <p className="text-sm text-muted-foreground">{patient?.dni}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient?.status)}`}>
              {patient?.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActions(!showActions)}
                className="w-8 h-8"
              >
                <Icon name="MoreVertical" size={16} />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10 animate-fade-in">
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onAction?.(patient?.id, 'view');
                        setShowActions(false);
                      }}
                    >
                      <Icon name="Eye" size={16} className="mr-2" />
                      Ver Perfil
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onAction?.(patient?.id, 'prescription');
                        setShowActions(false);
                      }}
                    >
                      <Icon name="FileText" size={16} className="mr-2" />
                      Nueva Receta
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onAction?.(patient?.id, 'diagnosis');
                        setShowActions(false);
                      }}
                    >
                      <Icon name="Stethoscope" size={16} className="mr-2" />
                      Nuevo Diagnóstico
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-sm"
                      onClick={() => {
                        onAction?.(patient?.id, 'referral');
                        setShowActions(false);
                      }}
                    >
                      <Icon name="Share2" size={16} className="mr-2" />
                      Derivar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mt-2 text-xs font-medium ${urgency?.color}`}>
          {urgency?.label}
        </div>
      </div>

      {/* Patient Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Última Visita</p>
            <p className="font-medium text-foreground">{formatDate(patient?.lastVisit)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Próxima Cita</p>
            <p className="font-medium text-foreground">{formatDateTime(patient?.nextAppointment)}</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-1">Contacto</p>
          <p className="text-sm font-medium text-foreground">{patient?.phone}</p>
          <p className="text-sm text-muted-foreground">{patient?.email}</p>
        </div>

        {patient?.chronicConditions?.length > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Condiciones Crónicas</p>
            <div className="flex flex-wrap gap-1">
              {patient?.chronicConditions?.slice(0, 2)?.map((condition, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-md"
                >
                  {condition}
                </span>
              ))}
              {patient?.chronicConditions?.length > 2 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  +{patient?.chronicConditions?.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}

        {patient?.allergies?.length > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Alergias</p>
            <div className="flex flex-wrap gap-1">
              {patient?.allergies?.slice(0, 2)?.map((allergy, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-error/10 text-error text-xs rounded-md"
                >
                  {allergy}
                </span>
              ))}
              {patient?.allergies?.length > 2 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                  +{patient?.allergies?.length - 2} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAction?.(patient?.id, 'view')}
          >
            <Icon name="Eye" size={14} className="mr-1" />
            Ver Perfil
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onAction?.(patient?.id, 'prescription')}
          >
            <Icon name="FileText" size={14} className="mr-1" />
            Recetar
          </Button>
        </div>
      </div>

      {/* Click outside handler */}
      {showActions && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default PatientCard;