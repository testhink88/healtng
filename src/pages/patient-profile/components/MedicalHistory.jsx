import React from 'react';
import Icon from '@/components/AppIcon';

const MedicalHistory = ({ patient, onShowDetails }) => {
  const formatDate = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString('es-VE', { day:'2-digit', month:'short', year:'numeric' });
  };

  const diagnoses = [...(patient?.diagnoses || [])].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  if (diagnoses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl m-6">
        <Icon name="FileText" size={40} className="text-gray-200 mb-3" />
        <p className="text-gray-400 text-sm font-medium">No hay historial de consultas registrado.</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="relative">
        {/* Línea de tiempo minimalista */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100"></div>

        <div className="space-y-4">
          {diagnoses.map((diag) => (
            <div 
              key={diag.id} 
              onClick={() => onShowDetails && onShowDetails(diag)}
              className="relative pl-10 group cursor-pointer"
            >
              {/* Punto de la línea de tiempo */}
              <div className="absolute left-2.5 top-6 w-3 h-3 bg-white border-2 border-blue-600 rounded-full z-10"></div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                       <h4 className="font-bold text-gray-900">{diag.specialtyName}</h4>
                       <span className="hidden sm:inline text-gray-300">•</span>
                       <span className="text-[10px] text-gray-400 font-medium">
                         {formatDate(diag.date)}
                       </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{diag.doctorName}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold text-gray-400">Dx:</span> {diag.preview}
                    </p>
                  </div>
                  <Icon name="ChevronRight" size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                </div>

                {/* Indicadores de contenido rápidos (Solo iconos pequeños) */}
                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
                  {diag.data?.prescriptions?.length > 0 && (
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase">
                      <Icon name="Pill" size={12}/> {diag.data.prescriptions.length} RX
                    </div>
                  )}
                  {diag.data?.medicalReport && (
                    <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold uppercase">
                      <Icon name="FileText" size={12}/> Informe
                    </div>
                  )}
                  {diag.data?.followUpDate && (
                    <div className="flex items-center gap-1 text-purple-600 text-[10px] font-bold uppercase">
                      <Icon name="Calendar" size={12}/> Cita
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;