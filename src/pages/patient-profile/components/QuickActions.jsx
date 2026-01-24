// src/pages/patient-profile/components/QuickActions.jsx
import React from 'react';
import Icon from '@/components/AppIcon';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'prescription', label: 'Nueva Receta', sub: 'Prescribir medicamento', icon: 'Pill', color: 'bg-blue-600' },
    { id: 'diagnosis', label: 'Nuevo Diagnóstico', sub: 'Registrar hallazgos', icon: 'Stethoscope', color: 'bg-emerald-600' },
    { id: 'referral', label: 'Derivar', sub: 'A especialista', icon: 'ArrowRightLeft', color: 'bg-purple-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
        <Icon name="Zap" size={12} className="text-amber-500" /> Acciones Rápidas
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="group flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-transparent hover:bg-gray-50 transition-all text-left w-full"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
              <Icon name={action.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{action.label}</p>
              <p className="text-[10px] text-gray-500 truncate">{action.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;