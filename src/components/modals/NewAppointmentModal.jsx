import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";
import { createAppointment } from "@/api/appointments";

const MOCK_REASONS = [
  "Primera vez",
  "Seguimiento / Control",
  "Pre-operatorio",
  "Post-operatorio",
  "Emergencia",
  "Lectura de Exámenes"
];

export default function NewAppointmentModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("search"); 
  const [existingPatients, setExistingPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // CARGAR PACIENTES DESDE SUPABASE
  useEffect(() => {
    if (isOpen) {
      const fetchPatients = async () => {
        setLoadingPatients(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'patient');

        if (error) console.error("Error fetching patients:", error);
        else setExistingPatients(data || []);
        
        setLoadingPatients(false);
      };

      fetchPatients();
      setSearchTerm("");
      setSelectedPatient(null);
    }
  }, [isOpen]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    
    return existingPatients.filter(p => 
      (p.full_name && p.full_name.toLowerCase().includes(term)) || 
      (p.email && p.email.toLowerCase().includes(term))
    );
  }, [searchTerm, existingPatients]);

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.full_name); 
    setFormData(prev => ({
      ...prev,
      name: patient.full_name,
      email: patient.email || "",
      phone: patient.metadata?.phone || "",
      gender: patient.metadata?.gender || "Femenino",
      patientId: patient.id
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes estar autenticado");

      let patientId = formData.patientId;
      let patientName = formData.name;

      // Si es nuevo paciente y no seleccionamos uno existente
      if (activeTab === "create") {
         // En un sistema real, crearíamos un usuario/perfil aquí.
         // Por ahora, lo guardamos como texto denormalizado si no hay ID.
      }

      const appointmentPayload = {
        patient_id: patientId || null,
        professional_id: user.id, // El médico logueado
        date: formData.date,
        time: formData.time,
        status: "confirmed",
        patient_name: patientName,
        reason: formData.reason,
        metadata: {
          phone: formData.phone,
          email: formData.email,
          invite_sent: formData.sendInvite,
          invite_channel: formData.inviteChannel
        }
      };

      const savedApt = await createAppointment(appointmentPayload);
      
      if (onSave) onSave(savedApt);
      onClose();
    } catch (err) {
      alert("Error al guardar cita: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const inputBase = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none";
  const labelBase = "block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider";

  return (
    <Modal open={isOpen} onClose={onClose} title="Agendar Nueva Cita">
      <div className="flex flex-col max-h-[80vh] overflow-y-auto pr-1">
        
        {/* TABS */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-6 shadow-inner">
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'search' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Buscar Paciente
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'create' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:bg-gray-200'}`}
            onClick={() => setActiveTab("create")}
          >
            ✨ Nuevo Paciente
          </button>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px]">1</span>
              Paciente
            </h4>

            {activeTab === "search" ? (
              <div className="relative">
                <Input 
                  label="Buscar por nombre o correo"
                  placeholder="Ej. Maria Perez..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if(selectedPatient) setSelectedPatient(null);
                  }}
                  autoFocus
                />
                
                {searchTerm && !selectedPatient && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    {loadingPatients ? (
                      <div className="p-4 text-center text-gray-400 text-xs">Buscando en la nube...</div>
                    ) : filteredPatients.length > 0 ? (
                      filteredPatients.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => selectPatient(p)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 border-b border-gray-50 last:border-0 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-gray-800">{p.full_name}</p>
                            <p className="text-xs text-gray-500">{p.email || "Sin email"}</p>
                          </div>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">Registrado</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400 text-xs">No se encontraron pacientes.</div>
                    )}
                  </div>
                )}

                {selectedPatient && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{selectedPatient.full_name?.charAt(0)}</div>
                      <p className="text-sm font-bold text-blue-900">{selectedPatient.full_name}</p>
                    </div>
                    <button onClick={() => { setSelectedPatient(null); setSearchTerm(""); }} className="text-xs text-blue-600 hover:underline">Cambiar</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelBase}>Nombre del Paciente</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={inputBase} placeholder="Nombre Completo" />
                </div>
                <div>
                  <label className={labelBase}>Teléfono</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className={inputBase} placeholder="+58..." />
                </div>
                <div>
                  <label className={labelBase}>Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} className={inputBase} placeholder="paciente@email.com" />
                </div>
              </div>
            )}
          </section>

          <section className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 flex items-center justify-center bg-gray-400 text-white rounded-full text-[10px]">2</span>
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
                  {MOCK_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || (activeTab === 'search' && !selectedPatient)}
            className="flex-[2] py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            {isSaving ? "Agendando..." : "Confirmar Cita"}
          </button>
        </div>
      </div>
    </Modal>
  );
}