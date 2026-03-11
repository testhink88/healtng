import React from 'react';
import Icon from '@/components/AppIcon';
import { useNavigate } from 'react-router-dom';
import PrescriptionCard from '@/pages/prescription-management/components/PrescriptionCard';

const PrescriptionsTab = ({ patient, onOpenConsultation }) => {
  const navigate = useNavigate();

  // Helper para normalizar fechas para el sort
  const getSortDate = (rx) => {
    const d = rx.created_at || rx.issueDate || rx.date || rx.prescribedDate;
    if (!d) return 0;
    return new Date(d).getTime();
  };

  // 0. FUENTE NUEVA: Tratamientos de Supabase (Unificados)
  const supabasePrescriptions = (patient?.treatments || []).map(p => ({
    ...p,
    medicationName: p.name || "Medicamento",
    dosage: p.dosage || p.dose || "Dosis N/D",
    quantity: p.quantity || "1",
    frequency: p.frequency || p.freq || "Frecuencia N/D",
    doctorName: p.doctor?.full_name || "Dr. Tratante",
    specialty: p.doctor?.metadata?.specialty_label || "Especialista",
    issueDate: p.created_at,
    expiryDate: p.end_date || new Date(new Date(p.created_at || Date.now()).getTime() + 90*24*60*60*1000).toISOString(),
    status: p.status === 'active' ? 'issued' : (p.status || 'issued'),
    source: 'supabase'
  }));

  // 1. FUENTE A: Recetas Directas (Legacy de la plataforma)
  const directPrescriptions = (patient?.medications || []).map(rx => ({
    ...rx,
    source: 'direct',
    medicationName: rx.name || rx.med || "Medicamento",
    dosage: rx.dose || rx.dosage || "Dosis N/D",
    frequency: rx.freq || rx.frequency || "Frecuencia N/D",
    issueDate: rx.prescribedDate || new Date().toISOString(),
    doctorName: "Dr. Tratante",
    status: rx.status || 'issued'
  }));

  // 2. FUENTE B: Recetas de Evoluciones (Legacy)
  const evolutionPrescriptions = (patient?.diagnoses || [])
    .filter(d => d.data?.prescriptions && d.data.prescriptions.length > 0)
    .flatMap(d => d.data.prescriptions.map(rx => ({
      ...rx,
      source: 'evolution',
      diagnosisId: d.id,
      doctorName: d.doctorName || "Dr. Tratante",
      issueDate: d.date,
      medicationName: rx.med || rx.name || "Medicamento",
      dosage: rx.dose || rx.dosage || "Dosis N/D",
      frequency: rx.freq || rx.frequency || "Frecuencia N/D",
      status: 'issued'
    })));

  // 3. FUSIÓN Y ORDENAMIENTO (Más recientes primero)
  const allPrescriptions = [...supabasePrescriptions, ...directPrescriptions, ...evolutionPrescriptions].sort(
    (a, b) => getSortDate(b) - getSortDate(a)
  );

  // --- RENDERIZADO ---

  if (allPrescriptions.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
        <div className="h-16 w-16 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Icon name="Pill" size={32} />
        </div>
        <p className="text-gray-500 text-sm font-medium">No hay recetas registradas</p>
        <p className="text-xs text-gray-400 mt-1 mb-6">El historial farmacológico de este paciente está vacío.</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPrescriptions.map((rx) => (
           <PrescriptionCard 
              key={rx.id || `${rx.source}-${rx.medicationName}-${rx.issueDate}`}
              prescription={rx}
              onDownload={() => alert("Generando PDF de la receta...")}
              onShare={() => alert("Opción de compartir habilitada.")}
              onOpenConsultation={rx.diagnosisId ? () => onOpenConsultation(rx.diagnosisId) : null}
           />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsTab;