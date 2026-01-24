import React from 'react';
import Icon from '@/components/AppIcon';
import { useNavigate } from 'react-router-dom';

const PrescriptionsTab = ({ patient, onOpenConsultation }) => {
  const navigate = useNavigate();

  // 1. FUENTE A: Recetas Directas (Array 'medications' en el root del paciente)
  const directPrescriptions = (patient?.medications || []).map(rx => ({
    ...rx,
    source: 'direct',
    date: rx.prescribedDate || new Date().toISOString(), // Asegurar fecha
    doctorName: "Dr. Tratante", // O el nombre del usuario actual
    // Normalización de campos (algunos formularios usan 'name', otros 'med')
    unifiedName: rx.name || rx.med,
    unifiedDose: rx.dose || rx.dosage,
    unifiedFreq: rx.freq || rx.frequency
  }));

  // 2. FUENTE B: Recetas de Evoluciones (Dentro de 'diagnoses')
  const evolutionPrescriptions = (patient?.diagnoses || [])
    .filter(d => d.data?.prescriptions && d.data.prescriptions.length > 0)
    .flatMap(d => d.data.prescriptions.map(rx => ({
      ...rx,
      source: 'evolution',
      diagnosisId: d.id, // Para el botón "Ver Origen"
      doctorName: d.doctorName,
      date: d.date,
      // Normalización
      unifiedName: rx.med || rx.name,
      unifiedDose: rx.dose || rx.dosage,
      unifiedFreq: rx.freq || rx.frequency
    })));

  // 3. FUSIÓN Y ORDENAMIENTO (Más recientes primero)
  const allPrescriptions = [...directPrescriptions, ...evolutionPrescriptions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // --- RENDERIZADO ---

  if (allPrescriptions.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <div className="h-16 w-16 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Icon name="Pill" size={32} />
        </div>
        <p className="text-gray-500 text-sm font-medium">No hay recetas activas</p>
        <p className="text-xs text-gray-400 mt-1 mb-6">El historial farmacológico está vacío.</p>
        <button 
          onClick={() => navigate(`/patients/${patient?.id}/prescriptions/new`)}
          className="text-[#0E39B1] text-xs font-bold uppercase tracking-widest hover:underline"
        >
          + Crear Primera Receta
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-normal text-gray-400 uppercase tracking-widest">
          Historial Farmacológico ({allPrescriptions.length})
        </h3>
        <button 
          onClick={() => navigate(`/patients/${patient?.id}/prescriptions/new`)}
          className="text-[#0E39B1] text-xs font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Nueva Receta
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {allPrescriptions.map((med, idx) => {
          const isDirect = med.source === 'direct';
          
          return (
            <div 
              key={`${med.source}-${idx}`} 
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#0E39B1] hover:shadow-sm transition-all gap-4"
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isDirect ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-[#0E39B1] border-blue-100'}`}>
                  <Icon name="Pill" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-normal text-gray-900 text-lg leading-tight">
                      {med.unifiedName}
                    </p>
                    {isDirect && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wide font-medium">
                        Directa
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 font-normal mt-1">
                    {med.unifiedDose} • {med.unifiedFreq}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-[10px] text-gray-400 font-normal uppercase tracking-tight">
                      {new Date(med.date).toLocaleDateString()}
                    </p>
                    {med.duration && (
                      <>
                        <span className="text-[10px] text-gray-300">•</span>
                        <p className="text-[10px] text-gray-400 font-normal">
                          Por {med.duration}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de Acción: Solo si viene de una evolución (Trazabilidad) */}
              {!isDirect && med.diagnosisId && (
                <button 
                  onClick={() => onOpenConsultation(med.diagnosisId)}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-normal text-[#0E39B1] bg-blue-50/50 hover:bg-[#0E39B1] hover:text-white rounded-lg border border-blue-100 transition-all whitespace-nowrap"
                >
                  <Icon name="FileText" size={14} />
                  VER CONSULTA
                </button>
              )}
              
              {/* Si es directa, podríamos mostrar opciones de reimprimir */}
              {isDirect && (
                <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-normal text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all whitespace-nowrap">
                  <Icon name="Printer" size={14} />
                  REIMPRIMIR
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrescriptionsTab;