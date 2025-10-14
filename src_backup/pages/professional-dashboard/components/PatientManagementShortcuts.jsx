import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const PatientManagementShortcuts = ({ specialties = [], recentPatients = [], className = '' }) => {
  const defaultSpecialties = [
    {
      id: 1,
      name: 'Cardiología',
      icon: 'Heart',
      patientCount: 24,
      color: 'error'
    },
    {
      id: 2,
      name: 'Pediatría',
      icon: 'Baby',
      patientCount: 18,
      color: 'success'
    },
    {
      id: 3,
      name: 'Dermatología',
      icon: 'Eye',
      patientCount: 12,
      color: 'warning'
    },
    {
      id: 4,
      name: 'Neurología',
      icon: 'Brain',
      patientCount: 8,
      color: 'primary'
    }
  ];

  const defaultRecentPatients = [
    {
      id: 1,
      name: 'María González',
      lastVisit: '2025-09-01',
      condition: 'Hipertensión',
      status: 'stable'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      lastVisit: '2025-08-30',
      condition: 'Diabetes Tipo 2',
      status: 'monitoring'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      lastVisit: '2025-08-28',
      condition: 'Asma',
      status: 'follow-up'
    }
  ];

  const specialtiesData = specialties?.length > 0 ? specialties : defaultSpecialties;
  const patientsData = recentPatients?.length > 0 ? recentPatients : defaultRecentPatients;

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      error: 'bg-error/10 text-error'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'text-success';
      case 'monitoring':
        return 'text-warning';
      case 'follow-up':
        return 'text-primary';
      case 'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'stable':
        return 'Estable';
      case 'monitoring':
        return 'Monitoreo';
      case 'follow-up':
        return 'Seguimiento';
      case 'critical':
        return 'Crítico';
      default:
        return 'Normal';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', { 
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Gestión de Pacientes</h2>
          <Button 
            variant="ghost" 
            size="sm"
            iconName="Users"
            onClick={() => window.location.href = '/patient-management'}
          >
            Ver Todos
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Specialties Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Por Especialidad</h3>
          <div className="grid grid-cols-2 gap-3">
            {specialtiesData?.map((specialty) => (
              <div
                key={specialty?.id}
                onClick={() => window.location.href = `/patient-management?specialty=${specialty?.name?.toLowerCase()}`}
                className="p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(specialty?.color)}`}>
                    <Icon name={specialty?.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{specialty?.name}</p>
                    <p className="text-xs text-muted-foreground">{specialty?.patientCount} pacientes</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Pacientes Recientes</h3>
          <div className="space-y-3">
            {patientsData?.map((patient) => (
              <div
                key={patient?.id}
                onClick={() => window.location.href = `/patient-management?id=${patient?.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground truncate">{patient?.name}</p>
                    <span className={`text-xs font-medium ${getStatusColor(patient?.status)}`}>
                      {getStatusLabel(patient?.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="truncate">{patient?.condition}</span>
                    <span className="flex-shrink-0 ml-2">{formatDate(patient?.lastVisit)}</span>
                  </div>
                </div>
                
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="UserPlus"
              iconPosition="left"
              onClick={() => window.location.href = '/patient-management?action=new'}
              fullWidth
            >
              Nuevo Paciente
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              iconPosition="left"
              onClick={() => window.location.href = '/patient-management?action=search'}
              fullWidth
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagementShortcuts;