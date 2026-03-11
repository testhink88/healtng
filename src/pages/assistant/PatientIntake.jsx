import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Modal from "@/components/ui/Modal";
import { MOCK_PATIENTS } from "@/mock/patients";
import ParaclinicalUploader from "./components/ParaclinicalUploader";

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true);

  // Estado local para manejo de archivos (separado del objeto patient principal por reactividad)
  const [attachments, setAttachments] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const allPatients = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
      const merged = [...allPatients, ...MOCK_PATIENTS]; 
      const found = allPatients.find(p => String(p.id) === String(patientId)) || 
                    MOCK_PATIENTS.find(p => String(p.id) === String(patientId));
      
      if(found) {
        setPatient(found);
        setAttachments(found.attachments || []); // Cargar adjuntos si existen
      }
      setIsLoading(false);
    };
    loadData();
  }, [patientId]);

  // Manejador de persistencia de archivos
  const handleAttachmentsChange = (newFiles) => {
    setAttachments(newFiles);
    
    // Persistir en MOCK_PATIENTS (LocalStorage)
    const allPatients = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
    const updatedPatients = allPatients.map(p => 
      String(p.id) === String(patientId) ? { ...p, attachments: newFiles } : p
    );
    
    // Si no estaba en local storage (era mock estático), lo agregamos
    if (!allPatients.some(p => String(p.id) === String(patientId)) && patient) {
        updatedPatients.push({ ...patient, attachments: newFiles });
    }

    localStorage.setItem("MOCK_PATIENTS", JSON.stringify(updatedPatients));
  };

  if (isLoading) return <div className="p-20 text-center text-gray-500">Cargando perfil...</div>;
  if (!patient) return <div className="p-20 text-center text-red-500">Paciente no encontrado ({patientId})</div>;

  // Lógica de extracción de datos clínicos
  const diagnosesHistory = patient.diagnoses || [];
  
  // 1. Buscar última receta (type="prescription")
  const latestPrescription = diagnosesHistory.find(d => d.type === 'prescription');
  const medications = latestPrescription?.medications || [];

  // 2. Buscar última evolución (type="diagnosis") para ver el Plan/Exámenes
  const latestEvolution = diagnosesHistory.find(d => d.type === 'diagnosis');
  const medicalPlan = latestEvolution?.data?.plan; // Aquí suelen ir las órdenes de exámenes
  const specialtyName = latestEvolution?.specialtyName || "Medicina General";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* HEADER DE CENTRO DE MANDO (REPLICADO) */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-[#0E39B1]">Centro de Mando</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Perfil de Paciente</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Asistente</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">En línea</p>
                </div>
             </div>
             <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
                <Icon name="User" size={20} />
             </div>
          </div>
        </div>
      </header>

      <main className="pt-10 pb-10 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* HEADER DEL PERFIL */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-[#0E39B1] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-900/20">
                {patient.fullName?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{patient.fullName}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span className="font-mono bg-gray-100 px-1.5 rounded">{patient.dni}</span>
                  <span>•</span>
                  <span>{patient.age ? `${patient.age} años` : "Edad N/D"}</span>
                  {patient.birthDate && <><span>•</span><span>{new Date(patient.birthDate).toLocaleDateString()}</span></>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
               <Button variant="outline" onClick={() => navigate(-1)} className="border-gray-200 text-gray-600">
                 <Icon name="ArrowLeft" size={16} className="mr-2"/> Volver
               </Button>
            </div>
          </div>

          {/* NAVEGACIÓN TABS */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
             <button 
               onClick={() => setActiveTab("info")}
               className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-[#0E39B1] text-[#0E39B1]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               Información Personal
             </button>
             <button 
               onClick={() => setActiveTab("clinical")}
               className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'clinical' ? 'border-[#0E39B1] text-[#0E39B1]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               Recetas y Exámenes
             </button>
             <button 
               onClick={() => setActiveTab("results")}
               className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'results' ? 'border-[#0E39B1] text-[#0E39B1]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
               Resultados / Archivos
             </button>
          </div>

          {/* CONTENIDO TABS */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* TAB 1: INFO */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Contacto</h3>
                    <div>
                       <label className="text-xs text-gray-500 block">Teléfono / WhatsApp</label>
                       <p className="font-medium text-gray-900">{patient.phone || "—"}</p>
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 block">Correo Electrónico</label>
                       <p className="font-medium text-gray-900">{patient.email || "—"}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Detalles Personales</h3>
                    <div>
                       <label className="text-xs text-gray-500 block">Género</label>
                       <p className="font-medium text-gray-900">{patient.gender || "—"}</p>
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 block">Fecha de Nacimiento</label>
                       <p className="font-medium text-gray-900">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : "—"}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* TAB 2: CLÍNICO */}
            {activeTab === 'clinical' && (
               <div className="space-y-6">
                  
                  {/* MEDICAMENTOS */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                     <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-6">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Icon name="Pill" size={18}/></div>
                        Medicamentos Recetados (Última Receta)
                     </h3>
                     
                     {medications.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                           {medications.map((med, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <div>
                                    <p className="font-bold text-gray-900">{med.name} {med.dose}</p>
                                    <p className="text-sm text-gray-500 italic mt-1">
                                      {med.freq} {med.dur && `• ${med.dur}`}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay medicamentos recientes.</p>
                     )}
                  </div>

                  {/* PLAN / EXÁMENES (Desde Diagnóstico) */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                     <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon name="Activity" size={18}/></div>
                        Plan Médico / Exámenes Indicados
                     </h3>
                     <p className="text-xs text-blue-600 mb-4 uppercase tracking-wider font-semibold">
                       {specialtyName}
                     </p>

                     {medicalPlan ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                           {medicalPlan}
                        </div>
                     ) : (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay indicaciones registradas recientemente.</p>
                     )}
                  </div>

               </div>
            )}

            {/* TAB 3: RESULTADOS / ARCHIVOS */}
            {activeTab === 'results' && (
               <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Repositorio de Resultados</h3>
                        <p className="text-xs text-gray-500">Carga y visualización de paraclínicos (PDF, Imágenes)</p>
                     </div>
                     <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
                       {attachments.length} archivos
                     </span>
                  </div>

                  <ParaclinicalUploader 
                    files={attachments}
                    onChange={handleAttachmentsChange}
                    onPreview={(file) => setPreviewFile(file)}
                  />
                  
                  {attachments.length === 0 && (
                     <p className="text-xs text-gray-400 text-center pt-2">
                       No hay archivos cargados. Arrastra documentos arriba 👆
                     </p>
                  )}
               </div>
            )}

          </div>
        </div>
      </main>
      {previewFile && (
        <Modal 
          open={!!previewFile} 
          onClose={() => setPreviewFile(null)} 
          title={previewFile?.name || "Vista Previa"}
        >
          <div className="flex justify-center p-2 bg-gray-100 rounded-lg min-h-[300px] max-h-[80vh] overflow-auto">
            {previewFile?.type?.includes("pdf") ? (
              <iframe 
                src={previewFile.preview} 
                className="w-full h-[500px]" 
                title="Vista previa PDF"
              />
            ) : (
              <img 
                src={previewFile?.preview} 
                alt="Vista previa" 
                className="max-w-full h-auto object-contain" 
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
             <Button variant="outline" onClick={() => setPreviewFile(null)}>Cerrar</Button>
             <a 
               href={previewFile?.preview} 
               download={previewFile?.name} 
               className="px-4 py-2 bg-[#0E39B1] text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition flex items-center gap-2"
             >
               <Icon name="Download" size={16}/> Descargar
             </a>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default PatientProfile;