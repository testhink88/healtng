import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";

// 1. IMPORTAMOS LA BASE DE DATOS ESTÁTICA (La misma que usa el Directorio)
// Asegúrate de que esta ruta sea correcta según tu proyecto
import { MOCK_PATIENTS } from "@/mock/patients"; 

export default function NewAppointmentModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("search"); 
  const [existingPatients, setExistingPatients] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    docId: "",
    email: "",
    phone: "",
    gender: "Femenino",
    birthDate: "",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    reason: "Primera vez",
    sendInvite: true,
    inviteChannel: "whatsapp"
  });

  // 2. CARGA UNIFICADA DE DATOS (Mocks + LocalStorage)
  useEffect(() => {
    if (isOpen) {
      // A. Leemos los pacientes nuevos creados por ti
      const localData = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
      
      // B. Leemos los pacientes "de fábrica" (Mock)
      const staticData = MOCK_PATIENTS || [];

      // C. Fusionamos ambas listas (Evitando duplicados por ID si fuera necesario)
      // Nota: Si un paciente nuevo tiene el mismo ID que uno mock, el nuevo sobreescribe
      const unifiedList = [...staticData, ...localData];

      // D. Eliminamos duplicados visuales (opcional, por seguridad)
      const uniquePatients = Array.from(new Map(unifiedList.map(item => [item.id, item])).values());

      setExistingPatients(uniquePatients);

      // Resetear estados
      setSearchTerm("");
      setSelectedPatient(null);
    }
  }, [isOpen]);

  // Lógica de Filtrado (Buscador insensible a mayúsculas/minúsculas)
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    
    return existingPatients.filter(p => 
      (p.name && p.name.toLowerCase().includes(term)) || 
      (p.docId && p.docId.includes(term))
    );
  }, [searchTerm, existingPatients]);

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name); 
    setFormData(prev => ({
      ...prev,
      name: patient.name,
      docId: patient.docId || "", // Protección contra undefined
      email: patient.email || "",
      phone: patient.phone || "",
      gender: patient.gender || "Femenino",
      patientId: patient.id
    }));
  };

  const handleSave = () => {
    const patientId = formData.patientId || `p-${Date.now()}`;
    
    const patientProfile = {
      id: patientId,
      name: formData.name,
      docId: formData.docId,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      status: formData.sendInvite ? "invited" : "provisional",
      lastVisit: new Date().toISOString().split('T')[0],
      reason: formData.reason
    };

    if (formData.sendInvite) {
      if (formData.inviteChannel === "whatsapp") {
        alert(`[DEMO] Enviando WhatsApp a ${formData.phone}:\n"Hola ${formData.name}, bienvenido a Healtng. Tu código es..."`);
      } else {
        alert(`[DEMO] Enviando Email a ${formData.email}:\n"Bienvenido a Healtng..."`);
      }
    }

    // Persistencia
    const currentLocalPatients = JSON.parse(localStorage.getItem("MOCK_PATIENTS") || "[]");
    
    if (activeTab === "create") {
      // Guardamos en LocalStorage
      localStorage.setItem("MOCK_PATIENTS", JSON.stringify([...currentLocalPatients, patientProfile]));
    } else {
      // Si el paciente venía del Mock estático, AHORA lo guardamos en LocalStorage para persistir cambios
      // Esto "promueve" un dato estático a un dato dinámico editable
      const existsInLocal = currentLocalPatients.find(p => p.id === patientId);
      
      let updatedList;
      if (existsInLocal) {
        updatedList = currentLocalPatients.map(p => p.id === patientId ? {...p, lastVisit: patientProfile.lastVisit} : p);
      } else {
        // Si no estaba en local (era del mock), lo agregamos al local con los datos nuevos
        updatedList = [...currentLocalPatients, patientProfile];
      }
      localStorage.setItem("MOCK_PATIENTS", JSON.stringify(updatedList));
    }

    if (onSave) onSave(patientProfile);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Clases CSS
  const inputBase = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all";
  const labelBase = "block text-xs font-semibold text-gray-600 uppercase mb-1.5 tracking-wide";
  const tabBase = "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";
  const tabActive = "bg-white text-blue-600 shadow-sm ring-1 ring-black/5";
  const tabInactive = "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50";

  return (
    <Modal open={isOpen} onClose={onClose} title="Gestión de Admisión">
      <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto pr-1">
        
        {/* TABS */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl mb-6">
          <button 
            className={`${tabBase} ${activeTab === 'search' ? tabActive : tabInactive}`}
            onClick={() => { setActiveTab("search"); setFormData(prev => ({...prev, patientId: null, name: ""})); setSearchTerm(""); setSelectedPatient(null); }}
          >
            <span>🔍</span> Buscar Paciente
          </button>
          <button 
            className={`${tabBase} ${activeTab === 'create' ? tabActive : tabInactive}`}
            onClick={() => setActiveTab("create")}
          >
            <span>✨</span> Nuevo Ingreso
          </button>
        </div>

        <div className="space-y-6">
          
          {/* SECCIÓN 1: IDENTIDAD */}
          <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100">1</span>
              Datos del Paciente
            </h4>

            {activeTab === "search" ? (
              <div className="relative animate-in fade-in duration-300">
                <label className={labelBase}>Buscar por Nombre o Cédula</label>
                <div className="relative">
                  <input 
                    type="text"
                    className={inputBase}
                    placeholder="Escribe 'Maria', 'Jose'..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if(selectedPatient) setSelectedPatient(null);
                    }}
                    autoFocus
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>

                {/* RESULTADOS DE BÚSQUEDA */}
                {searchTerm && !selectedPatient && filteredPatients.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {filteredPatients.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => selectPatient(p)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex justify-between items-center border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <span className="font-semibold text-gray-900 block">{p.name}</span>
                          <span className="text-xs text-gray-500">{p.email || "Sin email"}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{p.docId || "S/I"}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* PACIENTE SELECCIONADO */}
                {selectedPatient && (
                   <div className="mt-4 p-3 bg-blue-50/50 text-blue-800 text-sm rounded-lg border border-blue-100 flex items-center gap-3 animate-in zoom-in-95">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {selectedPatient.name.charAt(0)}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold">{selectedPatient.name}</p>
                        <p className="text-xs opacity-80">{selectedPatient.email || "Email no registrado"} • {selectedPatient.phone || "Sin tlf"}</p>
                     </div>
                     <button 
                       onClick={() => { setSelectedPatient(null); setSearchTerm(""); }}
                       className="text-xs text-blue-600 hover:text-blue-800 underline"
                     >
                       Cambiar
                     </button>
                   </div>
                )}

                {searchTerm && filteredPatients.length === 0 && !selectedPatient && (
                  <div className="mt-2 text-xs text-gray-500 text-center py-2 bg-gray-50 rounded-lg">
                    No encontramos a "{searchTerm}". <span className="text-blue-600 cursor-pointer hover:underline font-bold" onClick={() => setActiveTab("create")}>Crear nuevo paciente</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                {/* FORMULARIO CREAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelBase}>Nombre Completo <span className="text-red-500">*</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} className={inputBase} placeholder="Ej. Ana García" />
                  </div>
                  <div>
                    <label className={labelBase}>Cédula / DNI <span className="text-red-500">*</span></label>
                    <input name="docId" value={formData.docId} onChange={handleChange} className={inputBase} placeholder="V-12345678" />
                  </div>
                  <div>
                    <label className={labelBase}>Género</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputBase}>
                      <option>Femenino</option>
                      <option>Masculino</option>
                      <option>Otro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Contacto Digital (Onboarding)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelBase}>Teléfono (WhatsApp) <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputBase} placeholder="+58 414-0000000" />
                    </div>
                    <div>
                      <label className={labelBase}>Email (Opcional)</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputBase} placeholder="correo@ejemplo.com" />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <strong className="text-sm text-emerald-900 block">Enviar Acceso a Healtng</strong>
                      <p className="text-xs text-emerald-700/80">El paciente recibirá credenciales.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="sendInvite" checked={formData.sendInvite} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  
                  {formData.sendInvite && (
                    <div className="flex gap-4 pt-2 border-t border-emerald-100/50">
                      <label className="flex items-center gap-2 text-xs text-emerald-800 cursor-pointer">
                        <input type="radio" name="inviteChannel" value="whatsapp" checked={formData.inviteChannel === "whatsapp"} onChange={handleChange} className="text-emerald-600 focus:ring-emerald-500" />
                        <span>Vía WhatsApp</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-emerald-800 cursor-pointer">
                        <input type="radio" name="inviteChannel" value="email" checked={formData.inviteChannel === "email"} onChange={handleChange} className="text-emerald-600 focus:ring-emerald-500" />
                        <span>Vía Email</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* SECCIÓN 2: DETALLES CITA */}
          <section className="bg-gray-50/80 rounded-xl border border-gray-200 p-4 sm:p-5">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-gray-500 flex items-center justify-center text-xs border border-gray-200 shadow-sm">2</span>
              Detalles de la Cita
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelBase}>Fecha</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label className={labelBase}>Hora</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className={inputBase} />
              </div>
              <div className="md:col-span-2">
                <label className={labelBase}>Motivo de Consulta</label>
                <select name="reason" value={formData.reason} onChange={handleChange} className={inputBase}>
                  <option>Primera vez</option>
                  <option>Seguimiento / Control</option>
                  <option>Pre-operatorio</option>
                  <option>Post-operatorio</option>
                  <option>Emergencia</option>
                  <option>Lectura de Exámenes</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={activeTab === 'search' && !selectedPatient}
            className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'search' && !selectedPatient 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-500/20'
            }`}
          >
            {activeTab === 'create' ? 'Registrar y Agendar' : 'Confirmar Cita'}
          </button>
        </div>
      </div>
    </Modal>
  );
}