import React from 'react';
import { Users, Building2, ToggleRight } from 'lucide-react';

const RoleSwitcher = ({ currentRole, onRoleSwitch }) => {
  const roles = [
    {
      id: 'professional',
      label: 'Profesional',
      description: 'Vista para profesionales médicos',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 'clinic',
      label: 'Clínica',
      description: 'Vista para centros médicos',
      icon: Building2,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            {currentRole === 'professional' ? (
              <Users className="h-4 w-4 text-primary" />
            ) : (
              <Building2 className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <div className="font-medium text-foreground">
              Modo Actual: {currentRole === 'professional' ? 'Profesional' : 'Clínica'}
            </div>
            <div className="text-sm text-muted-foreground">
              Cambia tu vista para acceder a diferentes experiencias
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {roles?.map((role) => (
            <button
              key={role?.id}
              onClick={() => onRoleSwitch(role?.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${currentRole === role?.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <role.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{role?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Marketplace Mode Indicator */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Experiencia de Marketplace:</span>
            <span className="font-medium text-foreground">
              B2B (Profesional) + B2C (Pacientes)
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ToggleRight className="h-4 w-4 text-green-500" />
            Ambos modos disponibles
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSwitcher;