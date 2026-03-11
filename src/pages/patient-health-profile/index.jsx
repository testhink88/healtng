import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { fetchTreatments } from "@/api/treatments";
import { fetchDiagnoses } from "@/api/diagnoses/diagnoses";

const PatientHealthProfilePage = () => {
  const { profile, fetchProfile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medications, setMedications] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState("allergy"); // allergy | condition
  const [modalInput, setModalInput] = useState("");

  // Health Data local state for editing
  const [healthData, setHealthData] = useState({
    bloodType: "—",
    allergies: [],
    chronicConditions: [],
    emergencyContacts: [],
    lastUpdate: new Date().toISOString()
  });

  const [defaultShareScope, setDefaultShareScope] = useState("clinical");
  const [includeSensitive, setIncludeSensitive] = useState(false);

  // Load data from profile
  useEffect(() => {
    if (profile?.metadata?.health_profile) {
      setHealthData(profile.metadata.health_profile);
    }
    if (profile?.metadata?.privacy_settings) {
      setDefaultShareScope(profile.metadata.privacy_settings.defaultShareScope || "clinical");
      setIncludeSensitive(profile.metadata.privacy_settings.includeSensitive || false);
    }
  }, [profile]);

  // Load medications and diagnoses
  useEffect(() => {
    if (profile?.id) {
      setIsLoadingHistory(true);
      Promise.all([
        fetchTreatments({ patient_id: profile.id, status: 'active' }),
        fetchDiagnoses({ patient_id: profile.id })
      ]).then(([medsData, diagnosesData]) => {
        setMedications(medsData);
        setDiagnoses(diagnosesData);
      }).catch(err => console.error("Error fetching patient data:", err))
      .finally(() => setIsLoadingHistory(false));
    }
  }, [profile?.id]);

  const handleSave = async () => {
    if (!profile?.id) return;
    setIsSaving(true);
    try {
      const updatedMetadata = {
        ...profile.metadata,
        health_profile: {
          ...healthData,
          lastUpdate: new Date().toISOString()
        },
        privacy_settings: {
          defaultShareScope,
          includeSensitive
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({ metadata: updatedMetadata })
        .eq('id', profile.id);

      if (error) throw error;
      
      await fetchProfile(); // Refresh context
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const addAllergy = () => {
    setModalType("allergy");
    setModalInput("");
    setShowAddModal(true);
  };

  const removeAllergy = (id) => {
    setHealthData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a.id !== id)
    }));
  };

  const addCondition = () => {
    setModalType("condition");
    setModalInput("");
    setShowAddModal(true);
  };

  const handleModalSubmit = () => {
    const items = modalInput
      .split(/,|\n/)
      .map(i => i.trim())
      .filter(i => i.length > 0);

    if (items.length === 0) {
      setShowAddModal(false);
      return;
    }

    if (modalType === "allergy") {
      const newAllergies = items.map((name, index) => ({
        id: Date.now() + index,
        name,
        type: 'environmental',
        severity: 'medium'
      }));
      setHealthData(prev => ({
        ...prev,
        allergies: [...prev.allergies, ...newAllergies]
      }));
    } else {
      const newConditions = items.map((name, index) => ({
        id: Date.now() + index,
        name,
        controlled: true,
        since: new Date().getFullYear().toString()
      }));
      setHealthData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, ...newConditions]
      }));
    }

    setShowAddModal(false);
  };

  const removeCondition = (id) => {
    setHealthData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter(c => c.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <Sidebar
        userRole="patient"
        isCollapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Header
          userRole="patient"
          isAuthenticated={true}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
          {/* TÍTULO */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Mi Perfil de Salud
              </h1>
              <p className="text-muted-foreground mt-1">
                Administra tu información médica y controla qué compartes con tus profesionales de salud.
              </p>
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Icon name="Edit" className="w-4 h-4 mr-2" />
                  Editar Mi Salud
                </Button>
              )}
            </div>
          </div>

          {/* FILA SUPERIOR: RESUMEN + PASAPORTE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resumen del paciente */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-1 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
              
              <h2 className="text-lg font-semibold mb-5 flex items-center text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="User" className="w-4 h-4 text-primary" />
                </div>
                Datos de Salud
              </h2>
              
              <div className="mb-6">
                <p className="text-2xl font-bold text-foreground">
                  {profile?.full_name || "Paciente Healtng"}
                </p>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                     <Icon name="Droplet" size={12} className="mr-1 text-red-500" />
                     {isEditing ? (
                       <select 
                         value={healthData.bloodType}
                         onChange={(e) => setHealthData(prev => ({ ...prev, bloodType: e.target.value }))}
                         className="bg-transparent border-none p-0 text-xs font-bold focus:ring-0 cursor-pointer"
                       >
                         {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "—"].map(type => (
                           <option key={type} value={type} className="bg-card text-foreground">{type}</option>
                         ))}
                       </select>
                     ) : (
                       <>Tipo: <span className="font-bold ml-1">{healthData.bloodType}</span></>
                     )}
                   </div>
                   <span className="text-[10px] text-muted-foreground opacity-70 uppercase tracking-tighter">
                     Actualizado: {new Date(healthData.lastUpdate).toLocaleDateString()}
                   </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      Alergias
                    </span>
                    {isEditing && (
                      <button onClick={addAllergy} className="text-primary hover:text-primary/80">
                        <Icon name="PlusCircle" size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {healthData.allergies.length > 0 ? (
                      healthData.allergies.map((a) => (
                        <div key={a.id} className="group relative">
                          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 border border-red-100 shadow-sm transition-all hover:bg-red-100">
                            {a.name}
                            {isEditing && (
                              <button onClick={() => removeAllergy(a.id)} className="ml-1.5 hover:text-red-900">
                                <Icon name="X" size={12} />
                              </button>
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Sin alergias registradas</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      Condiciones crónicas
                    </span>
                    {isEditing && (
                      <button onClick={addCondition} className="text-primary hover:text-primary/80">
                        <Icon name="PlusCircle" size={16} />
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {healthData.chronicConditions.length > 0 ? (
                      healthData.chronicConditions.map((c) => (
                        <li key={c.id} className="flex items-center justify-between text-sm text-foreground bg-muted/30 p-2 rounded-lg group">
                          <div className="flex items-center">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                             <span>{c.name}</span>
                          </div>
                          {isEditing && (
                            <button onClick={() => removeCondition(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Icon name="Trash" size={14} />
                            </button>
                          )}
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Sin condiciones crónicas</p>
                    )}
                  </ul>
                </div>

                <div>
                  <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">
                    Medicación actual
                  </span>
                  <div className="space-y-2">
                    {medications.length > 0 ? (
                      medications.map((m) => (
                        <div key={m.id} className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex items-start gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                             <Icon name="Pill" className="w-4 h-4 text-blue-600" />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-blue-900 leading-none">{m.name}</p>
                             <p className="text-[11px] text-blue-700 mt-1">{m.dosage} · {m.frequency}</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Sin medicación activa registrada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pasaporte de Salud (lo que se comparte) */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="Shield" className="w-5 h-5 text-primary mr-2" />
                Pasaporte de Salud que se comparte
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Esta es la información que se envía a los médicos cuando
                reservas una cita o compras un servicio. Puedes ajustar la
                privacidad más abajo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="border rounded-lg p-3 bg-muted/40">
                  <p className="font-medium mb-1">Siempre incluido</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Datos básicos del paciente</li>
                    <li>Alergias</li>
                    <li>Condiciones crónicas</li>
                    <li>Medicamentos habituales</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3 bg-muted/40">
                  <p className="font-medium mb-1">Opcional según tu elección</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Historial de diagnósticos</li>
                    <li>Resultados de laboratorio</li>
                    <li>Datos sensibles (salud mental, ITS, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* HISTORIAL CLÍNICO + DOCUMENTOS + PRIVACIDAD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Historial clínico */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold mb-6 flex items-center text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Icon name="ClipboardList" className="w-4 h-4 text-primary" />
                </div>
                Historial clínico de diagnósticos
              </h2>
              
              <div className="space-y-4">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground italic">Cargando tu historial...</p>
                  </div>
                ) : diagnoses.length > 0 ? (
                  diagnoses.map((d) => (
                    <div key={d.id} className="group border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-muted/30 transition-all">
                       <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                             <div className="p-2.5 rounded-xl bg-background border border-border group-hover:bg-primary/5 transition-colors">
                                <Icon name="Activity" size={20} className="text-primary/70" />
                             </div>
                             <div>
                                <h4 className="font-bold text-foreground">{d.condition}</h4>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                   <span className="text-xs text-muted-foreground flex items-center">
                                      <Icon name="User" size={12} className="mr-1" />
                                      {d.doctor?.full_name || 'Médico'}
                                   </span>
                                   <span className="text-xs text-muted-foreground flex items-center">
                                      <Icon name="Calendar" size={12} className="mr-1" />
                                      {new Date(d.diagnosis_date).toLocaleDateString()}
                                   </span>
                                   {d.type && (
                                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-bold uppercase border border-primary/10">
                                       {d.type}
                                     </span>
                                   )}
                                </div>
                             </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            d.status === 'Controlado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {d.status || 'Activo'}
                          </div>
                       </div>
                       
                       {d.findings && (
                         <div className="mt-3 pl-14">
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">"{d.findings}"</p>
                         </div>
                       )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                    <Icon name="Inbox" size={40} className="mx-auto text-muted-foreground opacity-20 mb-3" />
                    <p className="text-sm text-muted-foreground">Aún no tienes diagnósticos registrados en el historial.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacidad y compartir */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="Lock" className="w-5 h-5 text-primary mr-2" />
                Privacidad y Compartir
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ¿Qué se comparte por defecto?
                  </label>
                  <select
                    value={defaultShareScope}
                    onChange={(e) => setDefaultShareScope(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-input px-3 py-2 text-sm"
                  >
                    <option value="basic">
                      Solo información básica (alergias y condiciones crónicas)
                    </option>
                    <option value="clinical">
                      Historial clínico resumido (recomendado)
                    </option>
                  </select>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIncludeSensitive(!includeSensitive)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      includeSensitive ? "bg-primary" : "bg-muted"
                    }`}
                    aria-pressed={includeSensitive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                        includeSensitive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground text-sm">
                      Incluir datos sensibles cuando comparto mi historial
                    </p>
                    <p>
                      Esto puede incluir información sobre salud mental, ITS u
                      otras condiciones delicadas. Puedes cambiarlo cada vez que
                      reserves una cita.
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2" size="sm">
                  Ver y editar permisos por médico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE ADICIÓN MÚLTIPLE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-border bg-muted/30">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                       {modalType === 'allergy' ? 'Agregar Alergias' : 'Agregar Condiciones'}
                    </h3>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                       <Icon name="X" size={20} />
                    </button>
                 </div>
                 <p className="text-sm text-muted-foreground mt-1">
                    Puedes escribir varios elementos separados por comas o saltos de línea.
                 </p>
              </div>

              <div className="p-6">
                 <textarea
                    autoFocus
                    className="w-full h-40 bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    placeholder={modalType === 'allergy' ? "Ej: Penicilina, Polem, Maní..." : "Ej: Hipertensión, Asma, Diabetes..."}
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                 />
                 
                 <div className="mt-6 flex flex-col gap-2">
                    <Button 
                       onClick={handleModalSubmit}
                       disabled={!modalInput.trim()}
                       className="w-full"
                    >
                       Añadir a mi perfil
                    </Button>
                    <Button 
                       variant="ghost"
                       onClick={() => setShowAddModal(false)}
                       className="w-full"
                    >
                       Cancelar
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PatientHealthProfilePage;
