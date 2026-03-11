import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '@/components/AppIcon';
import { MOCK_PATIENTS } from '@/mock/patients';

// Reusamos colores de la marca
const BRAND_BLUE = "#0E39B1";

export default function PublicPrescriptionViewer() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga desde backend/localStorage
    const loadData = () => {
      const raw = localStorage.getItem("MOCK_PATIENTS");
      const allPatients = raw ? JSON.parse(raw) : MOCK_PATIENTS;
      const found = allPatients.find(p => String(p.id) === String(patientId));
      setPatient(found || null);
      setLoading(false);
    };
    loadData();
  }, [patientId]);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando receta...</div>;
  }

  if (!patient) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
              <Icon name="FileX" size={48} className="text-gray-300 mb-4" />
              <h1 className="text-xl font-bold text-gray-900">Receta no encontrada</h1>
              <p className="text-gray-500 mt-2">El enlace puede haber expirado o ser incorrecto.</p>
          </div>
      );
  }

  // Obtenemos la última evolución/diagnóstico para mostrar medicamentos
  const latestDiagnosis = patient.diagnoses && patient.diagnoses.length > 0 ? patient.diagnoses[0] : null;
  const medications = latestDiagnosis?.data?.medications || [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* HEADER MÉDICO */}
        <header className="bg-white border-b border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
            
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-4">
                    <Icon name="Stethoscope" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{latestDiagnosis?.doctorName || "Dr. Especialista"}</h1>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Licencia Médica: 554433-22</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Icon name="MapPin" size={14}/> Centro Médico Healtng</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Icon name="Phone" size={14}/> +58 212 555 9999</span>
                </div>
            </div>
        </header>

        {/* DATOS PACIENTE */}
        <div className="bg-gray-50 px-8 py-5 border-b border-gray-200 flex justify-between items-center">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paciente</p>
                <p className="font-bold text-gray-800 text-lg">{patient.fullName}</p>
                <p className="text-xs text-gray-500 mt-0.5">ID: {patient.dni}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha Emisión</p>
                <p className="font-medium text-gray-800">
                    {latestDiagnosis?.createdAt ? new Date(latestDiagnosis.createdAt).toLocaleDateString('es-VE') : new Date().toLocaleDateString('es-VE')}
                </p>
            </div>
        </div>

        {/* CONTENIDO RECETA */}
        <div className="p-8">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                <Icon name="Pill" className="text-emerald-500" />
                Indicaciones y Medicamentos
            </h2>

            {medications.length > 0 ? (
                <div className="space-y-6">
                    {medications.map((med, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                            <div className="mt-1 text-blue-600 font-bold text-lg">
                                {idx + 1}.
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{med.name} {med.concentration}</h3>
                                <p className="text-sm text-gray-600 mt-1 font-medium italic">
                                    "{med.instruction || 'Tomar según indicación médica'}"
                                </p>
                                <div className="flex gap-3 mt-3">
                                    <span className="text-xs px-2 py-1 bg-white border border-blue-200 rounded text-blue-700 font-medium">
                                        Frecuencia: {med.frequency}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-white border border-blue-200 rounded text-blue-700 font-medium">
                                        Duración: {med.duration}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 italic">No hay medicamentos registrados en esta evolución.</p>
                </div>
            )}

            {latestDiagnosis?.reportText && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Comentarios Adicionales</h3>
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {latestDiagnosis.reportText}
                    </p>
                </div>
            )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-900 text-white p-6 text-center text-xs">
            <p className="opacity-60 mb-2">Este documento es una copia digital válida generada por Healtng.</p>
            <div className="flex justify-center items-center gap-2 opacity-40">
                <Icon name="Shield" size={12} />
                <span>Verificado electrónicamente</span>
            </div>
        </div>
      </div>
    </div>
  );
}
