import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// Importamos la lógica del núcleo clínico (Fase 1)
import { createEncounterDraft } from "../new-diagnosis-form/utils/encounterModel";
import { encounterStorage } from "../new-diagnosis-form/utils/encounterStorage";

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // --- LÓGICA DE ADMISIÓN (SECRETARIA) ---
  const handleStartIntake = (patientId) => {
    // 1. Verificamos si ya existe un borrador hoy para evitar duplicados
    let encounter = encounterStorage.load(patientId);
    
    // 2. Si no existe, creamos el "pegamento" (Encounter)
    if (!encounter) {
      encounter = createEncounterDraft({ patientId, doctorId: "dr-001" });
      encounterStorage.save(encounter);
    }

    // 3. Navegamos al Intake (Admisión) pasando el ID de consulta
    navigate(`/assistant/intake/${patientId}?encounterId=${encounter.encounterId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER FLAT HEALTNG */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-normal text-[#0E39B1]">Panel de Recepción</h1>
            <p className="text-sm text-gray-400 font-normal uppercase tracking-widest">Admisión y Preparación de Pacientes</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-xs font-normal text-gray-900">Secretaría Central</p>
                <p className="text-[10px] text-emerald-500 font-normal uppercase">En línea</p>
             </div>
             <div className="w-10 h-10 bg-gray-200 rounded-full border border-gray-100 flex items-center justify-center">
                <Icon name="User" size={20} className="text-gray-400" />
             </div>
          </div>
        </header>

        {/* BUSCADOR Y RESULTADOS */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="flex-1">
              <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-3 block">
                Identificación del Paciente
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="DNI o Nombre completo..." 
                  className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-12 text-sm font-normal outline-none focus:border-[#0E39B1] transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Icon name="Search" className="absolute left-4 top-4 text-gray-300" size={20} />
              </div>
            </div>
            <Button className="h-14 bg-white border border-gray-200 text-gray-600 font-normal px-6 rounded-2xl hover:bg-gray-50">
              <Icon name="UserPlus" className="mr-2" size={18} /> Nuevo Registro
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-2">Resultados de Búsqueda</h4>
            
            {/* ITEM DE PACIENTE (EJEMPLO) */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-[#0E39B1] transition-all gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 text-[#0E39B1] rounded-xl flex items-center justify-center text-xl font-normal">
                  L
                </div>
                <div>
                  <p className="text-lg font-normal text-gray-900 leading-tight">Luis Oswaldo Vera</p>
                  <p className="text-sm text-gray-500 font-normal mt-1">V-12.345.678 • 32 años</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="text-[10px] font-normal text-[#0E39B1] uppercase tracking-widest hover:underline px-4">
                  Invitar a Healtng
                </button>
                <Button 
                  onClick={() => handleStartIntake("p-123")}
                  className="bg-[#0E39B1] text-white font-normal text-xs px-8 py-3 rounded-xl border-none shadow-none active:scale-95"
                >
                  Iniciar Pre-consulta
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MÉTRICAS RÁPIDAS (OPERATIVIDAD CLÍNICA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-normal tracking-widest">En Espera</p>
              <p className="text-2xl font-normal text-gray-900 mt-1">4 Pacientes</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-normal tracking-widest">Paraclínicos Pendientes</p>
              <p className="text-2xl font-normal text-amber-500 mt-1">2 Estudios</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase font-normal tracking-widest">Completados Hoy</p>
              <p className="text-2xl font-normal text-emerald-500 mt-1">12 Consultas</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;