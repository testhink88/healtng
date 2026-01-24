import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

// UI
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// COMPONENTES DE CARGA
import SpecialtyDiagnosisCore from "../new-diagnosis-form/components/SpecialtyDiagnosisCore";
import ParaclinicalUploader from "./components/ParaclinicalUploader";

// LÓGICA DE PERSISTENCIA
import { encounterStorage } from "../new-diagnosis-form/utils/encounterStorage";
import { MOCK_PATIENTS } from "@/mock/patients";

const PatientIntake = () => {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const encounterId = searchParams.get("encounterId");

  const [encounter, setEncounter] = useState(null);
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CARGA DE CONTEXTO
  useEffect(() => {
    const loadContext = () => {
      // Cargar paciente
      const locals = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
      const found = locals.find(p => String(p.id) === String(patientId)) || 
                    MOCK_PATIENTS.find(p => String(p.id) === String(patientId));
      setPatient(found);

      // Cargar borrador de consulta
      const draft = encounterStorage.load(patientId);
      if (draft && draft.encounterId === encounterId) {
        setEncounter(draft);
      }
      setIsLoading(false);
    };
    loadContext();
  }, [patientId, encounterId]);

  // 2. ACTUALIZACIÓN DE DATOS (AUTO-GUARDADO)
  const handleUpdateData = (updater) => {
    setEncounter((prev) => {
      const nextData = typeof updater === "function" ? updater(prev.data) : { ...prev.data, ...updater };
      const nextEncounter = { ...prev, data: nextData, updatedAt: new Date().toISOString() };
      encounterStorage.save(nextEncounter);
      return nextEncounter;
    });
  };

  const handleFinishIntake = () => {
    // Marcamos el borrador como listo para el médico
    const finalizedIntake = { ...encounter, status: 'ready_for_doctor' };
    encounterStorage.save(finalizedIntake);
    alert("✅ Preparación completada. El paciente ya aparece en la lista del médico.");
    navigate("/assistant/dashboard");
  };

  if (isLoading || !encounter) return <div className="p-20 text-center font-normal text-gray-400">Cargando expediente...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      <Header userRole="assistant" />
      <Sidebar userRole="assistant" />

      <main className="pt-20 pb-10 lg:ml-64 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* CABECERA DE ADMISIÓN (FLAT) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#0E39B1] rounded-xl flex items-center justify-center text-xl font-normal border border-blue-100">
                {patient?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Preparación de Consulta</p>
                <h2 className="text-lg font-normal text-gray-900">{patient?.name}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate(-1)} className="font-normal border-none shadow-none">Cancelar</Button>
              <Button onClick={handleFinishIntake} className="bg-[#0E39B1] text-white font-normal px-8 border-none shadow-none">
                Finalizar Ingreso
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            
            {/* SECCIÓN 1: ANTECEDENTES (Puntos 2 y 3) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
              <h3 className="text-xs font-normal text-[#0E39B1] uppercase tracking-widest border-b border-gray-100 pb-3">
                Antecedentes Quirúrgicos y Médicos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm font-normal text-gray-500 mb-3 block">¿Posee antecedentes quirúrgicos?</label>
                  <SpecialtyDiagnosisCore 
                    specialtyCode="INTAKE"
                    diagnosisData={encounter.data}
                    setDiagnosisData={handleUpdateData}
                    // Aquí el core renderizará los componentes antecedente_toggle
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: PARACLÍNICOS (Punto 4) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
              <h3 className="text-xs font-normal text-[#0E39B1] uppercase tracking-widest border-b border-gray-100 pb-3">
                Carga de Paraclínicos (PDF / Fotos)
              </h3>
              <p className="text-sm text-gray-400 font-normal">Suba los resultados de laboratorio o imágenes que el paciente traiga a la consulta.</p>
              
              <ParaclinicalUploader 
                files={encounter.data.attachments || []}
                onChange={(newFiles) => handleUpdateData({ attachments: newFiles })}
              />
            </div>

          </div>

          <div className="pt-6 flex justify-center">
             <button 
              onClick={() => navigate(-1)}
              className="text-xs font-normal text-gray-400 uppercase tracking-widest hover:text-[#0E39B1] transition-colors"
             >
               Volver al listado de pacientes
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientIntake;