import React from 'react';
import Icon from '@/components/AppIcon';

// Catálogo simplificado para el piloto
const EXAMS_CATALOG = [
  { id: 'lab-01', name: 'Hematología Completa', category: 'Laboratorio' },
  { id: 'lab-02', name: 'Perfil 20', category: 'Laboratorio' },
  { id: 'img-01', name: 'Rayos X de Tórax', category: 'Imagenología' },
  { id: 'img-02', name: 'Eco Abdominal Renoprostático', category: 'Imagenología' }
];

const ServiceOrderSelector = ({ selectedItems = [], onChange }) => {
  const toggleItem = (exam) => {
    const isSelected = selectedItems.some(i => i.id === exam.id);
    const nextItems = isSelected 
      ? selectedItems.filter(i => i.id !== exam.id)
      : [...selectedItems, exam];
    onChange(nextItems);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXAMS_CATALOG.map((exam) => {
          const active = selectedItems.some(i => i.id === exam.id);
          return (
            <button
              key={exam.id}
              onClick={() => toggleItem(exam)}
              className={`flex items-center justify-between p-4 rounded-xl border text-sm font-normal transition-all ${
                active 
                ? 'border-[#0E39B1] bg-blue-50 text-[#0E39B1]' 
                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
              }`}
            >
              <span>{exam.name}</span>
              <Icon name={active ? "CheckCircle" : "Plus"} size={16} />
            </button>
          );
        })}
      </div>
      {selectedItems.length > 0 && (
        <p className="text-[10px] text-emerald-600 font-normal uppercase tracking-widest animate-pulse">
          {selectedItems.length} exámenes listos para presupuesto
        </p>
      )}
    </div>
  );
};

export default ServiceOrderSelector;