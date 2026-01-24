import React from 'react';
import Icon from "@/components/AppIcon";

const PatientStickyHeader = ({ patient }) => {
  // BLINDAJE: Si patient es null o undefined, no renderiza nada (o renderiza un placeholder)
  if (!patient || !patient.name) {
    return (
      <div className="sticky top-0 z-40 bg-gray-50 border-b border-gray-200 px-6 py-3">
         <span className="text-gray-500 text-sm">Sin paciente seleccionado</span>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-blue-100 shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {/* Aquí estaba el error: ahora usamos ?. para seguridad */}
          {patient.name?.charAt(0) || "?"}
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{patient.name}</h2>
          <p className="text-xs text-gray-500">
             {patient.age ? `${patient.age} años` : 'Edad N/A'} • {patient.gender || 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Alertas Críticas (Seguridad opcional) */}
      <div className="flex items-center gap-2">
         {patient.medicalHistory?.allergies?.length > 0 && (
             <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center">
                 <Icon name="AlertCircle" size={12} className="mr-1"/>
                 Alergias: {patient.medicalHistory.allergies.join(', ')}
             </span>
         )}
      </div>
    </div>
  );
};

export default PatientStickyHeader;