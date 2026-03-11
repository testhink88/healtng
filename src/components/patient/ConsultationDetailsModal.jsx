import React from "react";
import Icon from "@/components/AppIcon";

const ConsultationDetailsModal = ({ isOpen, diagnosis, onClose }) => {
  if (!isOpen || !diagnosis) return null;

  // BLINDAJE: Si diagnosis.data no existe, usamos un objeto vacío para evitar el crash
  const data = diagnosis.data || {};
  const specialty = diagnosis.specialtyName || diagnosis.specialtyCode || "Medicina General";
  
  // Extracción segura de datos (Safe Access)
  const mainDx = data.main_diagnosis_cie10?.name || "Diagnóstico no registrado";
  const mainCode = data.main_diagnosis_cie10?.code || "---";
  
  const findings = data.clinical_findings || [];
  const symptoms = data.symptoms_list || [];
  const plan = data.treatment_plan || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <Icon name="FileText" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Detalle de Consulta</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {new Date(diagnosis.date || Date.now()).toLocaleDateString()} • {specialty}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* Diagnóstico Principal */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Diagnóstico Principal</h4>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                {mainCode}
              </span>
              <p className="text-sm text-gray-800 font-medium">{mainDx}</p>
            </div>
          </div>

          {/* Síntomas y Hallazgos */}
          {(symptoms.length > 0 || findings.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {symptoms.length > 0 && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Síntomas Reportados</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {symptoms.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              {findings.length > 0 && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Hallazgos Clínicos</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {findings.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Plan de Tratamiento */}
          {plan && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Plan y Conducta</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                {plan}
              </p>
            </div>
          )}

          {/* Recetas Asociadas (Si existen dentro de la data) */}
          {data.prescriptions && data.prescriptions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Recetas Emitidas</h4>
              <div className="space-y-2">
                {data.prescriptions.map((rx, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg text-sm">
                    <Icon name="Pill" size={16} className="text-emerald-500" />
                    <span className="font-medium text-gray-900">{rx.med || rx.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{rx.dose || rx.dosage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <button 
            onClick={() => {
              const clinicSuffix = window.location.search.includes('scope=clinic') ? '?scope=clinic' : '';
              window.location.href = `/patients/${diagnosis.patient_id}/diagnosis/${diagnosis.id}/edit${clinicSuffix}`;
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0E39B1] hover:bg-blue-50 rounded-xl transition-colors"
          >
            <Icon name="Edit3" size={16} />
            Editar Consulta
          </button>
          
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailsModal;