import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// --- WIDGETS AUXILIARES (VISUALES) ---

const TaskManager = ({ tasks }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lista de Pendientes</h3>
      <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold">Activos</span>
    </div>
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl border bg-white border-gray-100 hover:border-blue-200 transition-all">
          <div className={`mt-1 w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-blue-400'}`} />
          <div className="flex-1">
             <p className="text-sm text-gray-700">{task.text}</p>
          </div>
          <button className="text-gray-300 hover:text-blue-600"><Icon name="CheckCircle" size={16} /></button>
        </div>
      ))}
    </div>
  </div>
);

const FinanceWidget = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full shadow-sm">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Cierre de Caja</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Efectivo ($)</span>
        <span className="font-mono font-bold text-gray-900">$320.00</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Zelle</span>
        <span className="font-mono font-bold text-gray-900">$850.00</span>
      </div>
      <div className="pt-3 border-t border-gray-100 mt-2">
         <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition">
            <Icon name="DollarSign" size={14} /> Declarar Cierre
         </button>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><Icon name="X" size={18}/></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- MODAL DE PERFIL ---
const ProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState(() => localStorage.getItem("assistant-name") || "Asistente");
  const [role, setRole] = useState(() => localStorage.getItem("assistant-role") || "Recepción");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("assistant-avatar") || null);
  const fileRef = useRef();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("assistant-name", name);
    localStorage.setItem("assistant-role", role);
    if (avatar) localStorage.setItem("assistant-avatar", avatar);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Mi Perfil</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><Icon name="X" size={18}/></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-400 transition-colors"
            >
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : <Icon name="Camera" size={28} className="text-blue-300" />
              }
            </div>
            <button onClick={() => fileRef.current?.click()} className="text-xs text-[#0E39B1] font-semibold hover:underline">
              Cambiar foto
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-[#0E39B1] outline-none transition"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          {/* Cargo */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cargo</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:border-[#0E39B1] outline-none transition"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Ej: Recepción, Triaje..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 justify-center" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1 bg-[#0E39B1] text-white justify-center" onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (CENTRO DE MANDO) ---

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flow");
  const [search, setSearch] = useState("");
  
  // ESTADO DE PACIENTES (Conectado a LocalStorage directamente para sincronizar)
  const [patients, setPatients] = useState([]);
  
  // MODALES
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [newPatientForm, setNewPatientForm] = useState({
    name: "", 
    dni: "", 
    gender: "Femenino", 
    birthDate: "", 
    phone: "", 
    email: "" 
  });

  // Datos perfil reactivos
  const [assistantName, setAssistantName] = useState(() => localStorage.getItem("assistant-name") || "Asistente");
  const [assistantAvatar, setAssistantAvatar] = useState(() => localStorage.getItem("assistant-avatar") || null);

  // Cierra dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleOpenProfile = () => {
    setIsDropdownOpen(false);
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    // Refresca los datos del header al cerrar el modal
    setAssistantName(localStorage.getItem("assistant-name") || "Asistente");
    setAssistantAvatar(localStorage.getItem("assistant-avatar") || null);
    setIsProfileOpen(false);
  };

  // MOCKS
  const MOCK_TASKS = [
    { id: 1, text: "Llamar a Sr. Juan (Resultados Lab)", priority: "high", done: false },
    { id: 2, text: "Confirmar cirugías del Martes", priority: "normal", done: true },
  ];

  // CARGA DE DATOS
  useEffect(() => {
    const loadData = () => {
      try {
        const raw = localStorage.getItem("MOCK_PATIENTS");
        let data = raw ? JSON.parse(raw) : [];
        
        // Si no hay datos, inicializamos con mocks para que la UI no se rompa
        if (data.length === 0) {
          data = [
             { id: "p-demo-1", fullName: "Ana García", dni: "V-15.444.333", status: "waiting", createdAt: new Date().toISOString() },
             { id: "p-demo-2", fullName: "Pedro Pérez", dni: "V-4.000.111", status: "active", createdAt: new Date().toISOString() }
          ];
          localStorage.setItem("MOCK_PATIENTS", JSON.stringify(data));
        }
        setPatients(data);
      } catch (e) {
        console.error("Error cargando pacientes", e);
      }
    };
    
    loadData(); // Carga inicial

    // Event listener para cambios en otras pestañas (Inmediato)
    window.addEventListener("storage", loadData);

    // Polling más agresivo para asegurar sincronización (1s)
    const interval = setInterval(loadData, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // FILTRO
  const filteredPatients = patients.filter(p => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (p.fullName || "").toLowerCase().includes(term) || (p.dni || "").toLowerCase().includes(term);
  });

  // --- ACCIONES REALES ---

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleRegisterPatient = () => {
    if(!newPatientForm.name || !newPatientForm.dni) return;
    
    const newP = {
      id: `p-${Date.now()}`,
      fullName: newPatientForm.name,
      dni: newPatientForm.dni,
      // Nuevos campos vinculados
      gender: newPatientForm.gender || "Femenino", // Default si no se selecciona
      birthDate: newPatientForm.birthDate,
      age: calculateAge(newPatientForm.birthDate),
      phone: newPatientForm.phone,
      email: newPatientForm.email,
      
      status: "waiting", // Entra directo a sala de espera
      createdAt: new Date().toISOString()
    };

    const updated = [newP, ...patients];
    setPatients(updated);
    localStorage.setItem("MOCK_PATIENTS", JSON.stringify(updated));
    
    setIsRegisterOpen(false);
    setNewPatientForm({ name: "", dni: "", gender: "Femenino", birthDate: "", phone: "", email: "" });
  };

  const handleCheckIn = (id) => {
    const updated = patients.map(p => p.id === id ? { ...p, status: 'waiting' } : p);
    setPatients(updated);
    localStorage.setItem("MOCK_PATIENTS", JSON.stringify(updated));
  };

  const handleStartIntake = (id) => navigate(`/assistant/intake/${id}`);
  
  const handleConcierge = (id) => navigate(`/marketplace?concierge=true&patientId=${id}`);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* HEADER DE CENTRO DE MANDO */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-[#0E39B1]">Centro de Mando</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Recepción y Triaje</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{assistantName}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">En línea</p>
                </div>
             </div>
             {/* Avatar + Dropdown */}
             <div className="relative" ref={dropdownRef}>
               <button
                 onClick={() => setIsDropdownOpen(v => !v)}
                 className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 hover:border-[#0E39B1] hover:ring-2 hover:ring-blue-100 transition-all overflow-hidden focus:outline-none"
               >
                 {assistantAvatar
                   ? <img src={assistantAvatar} alt="avatar" className="w-full h-full object-cover" />
                   : <Icon name="User" size={20} />
                 }
               </button>

               {/* Dropdown menu */}
               {isDropdownOpen && (
                 <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                   <button
                     onClick={handleOpenProfile}
                     className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0E39B1] transition-colors"
                   >
                     <Icon name="UserCircle" size={16} />
                     Mi Perfil
                   </button>
                   <div className="my-1 border-t border-gray-100" />
                   <button
                     onClick={handleLogout}
                     className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                   >
                     <Icon name="LogOut" size={16} />
                     Cerrar Sesión
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">

        {/* NAVEGACIÓN (TABS) */}
        <div className="flex p-1 bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-sm">
          {[
            { id: 'flow', label: 'Flujo de Pacientes', icon: 'Users' },
            { id: 'tasks', label: 'Pendientes', icon: 'Clipboard' },
            { id: 'finance', label: 'Caja', icon: 'DollarSign' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-[#0E39B1] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- VISTA FLUJO DE PACIENTES --- */}
        {activeTab === 'flow' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-6">
            
            {/* BARRA DE BÚSQUEDA Y ACCIÓN */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Check-In / Búsqueda</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o cédula..." 
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-10 text-sm outline-none focus:border-[#0E39B1] focus:bg-white transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Icon name="Search" className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>
              </div>
              
              <Button 
                onClick={() => setIsRegisterOpen(true)}
                className="h-12 px-6 bg-[#0E39B1] text-white rounded-xl shadow-lg shadow-blue-900/20 whitespace-nowrap"
              >
                <Icon name="Plus" className="mr-2" size={18} /> Nuevo Registro
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LISTA DE PACIENTES (TARJETAS) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-end px-1">
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">En Sala de Espera / Resultados</h3>
                   <span className="text-[10px] text-gray-400">{filteredPatients.length} pacientes</span>
                </div>
                
                {filteredPatients.length === 0 && (
                   <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-gray-400 text-sm">No se encontraron pacientes.</p>
                   </div>
                )}

                {filteredPatients.map(patient => (
                  <div key={patient.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden group">
                    {/* Indicador de Estado Lateral */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        patient.status === 'waiting' ? 'bg-emerald-500' : 
                        patient.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-3">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 text-[#0E39B1] rounded-xl flex items-center justify-center font-bold text-lg uppercase border border-blue-100">
                            {patient.fullName ? patient.fullName.charAt(0) : "?"}
                         </div>
                         <div>
                            <h4 className="text-base font-bold text-gray-900 leading-tight">{patient.fullName}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 font-mono">{patient.dni}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                   patient.status === 'waiting' ? 'bg-emerald-100 text-emerald-700' : 
                                   patient.status === 'active' ? 'bg-blue-100 text-blue-700' : 
                                   'bg-gray-100 text-gray-600'
                                }`}>
                                   {patient.status === 'waiting' ? 'En Sala' : patient.status === 'active' ? 'Ya Atendido' : 'Registrado'}
                                </span>
                            </div>
                         </div>
                      </div>

                      {/* BOTONERA DE ACCIONES (CONCIERGE) */}
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                         {patient.status !== 'waiting' && patient.status !== 'active' && (
                           <Button 
                              onClick={() => handleCheckIn(patient.id)}
                              className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                           >
                              Check-In
                           </Button>
                         )}
                         
                         <Button 
                            onClick={() => handleStartIntake(patient.id)}
                            className="bg-[#0E39B1] text-white text-xs px-4 py-2 rounded-lg shadow-sm"
                         >
                            Perfil
                         </Button>
                         
                         <div className="w-px h-8 bg-gray-200 mx-1"></div>

                         <button 
                           onClick={() => handleConcierge(patient.id)}
                           title="Compra Asistida"
                           className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-200 transition"
                         >
                           <Icon name="ShoppingCart" size={16} />
                         </button>
                         <button 
                           onClick={() => setQrData(patient)}
                           title="Imprimir QR"
                           className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-200 transition"
                         >
                           <Icon name="Printer" size={16} />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* BARRA LATERAL DERECHA */}
              <div className="space-y-6">
                 <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
                    <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
                       <Icon name="AlertTriangle" size={16} /> Alertas del Dr.
                    </h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                       Verificar pólizas de Seguros Mercantil antes de ingresar a consulta.
                    </p>
                 </div>
                 
                 {/* Mini Resumen */}
                 <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumen Hoy</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pacientes Vistos</span>
                          <span className="font-bold text-gray-900">{filteredPatients.filter(p => p.status === 'active').length}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-gray-600">En Espera</span>
                          <span className="font-bold text-emerald-600">{filteredPatients.filter(p => p.status === 'waiting').length}</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- OTRAS VISTAS --- */}
        {activeTab === 'tasks' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95">
              <TaskManager tasks={MOCK_TASKS} />
           </div>
        )}

        {activeTab === 'finance' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95">
              <FinanceWidget />
           </div>
        )}
      </main>

      {/* --- MODALES --- */}

      {/* 1. Modal Nuevo Paciente */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Nuevo Paciente">
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-bold mb-1 uppercase">Nombre Completo</label>
               <input 
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
                  placeholder="Ej: Juan Pérez"
                  value={newPatientForm.name}
                  onChange={e => setNewPatientForm({...newPatientForm, name: e.target.value})}
               />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
               <label className="block text-xs font-bold mb-1 uppercase">Cédula / Identificación</label>
               <input 
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
                  placeholder="Ej: V-12345678"
                  value={newPatientForm.dni}
                  onChange={e => setNewPatientForm({...newPatientForm, dni: e.target.value})}
               />
               </div>
               <div>
                <label className="text-xs font-bold mb-1 block uppercase">Género</label>
                <select className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" value={newPatientForm.gender} onChange={(e) => setNewPatientForm({...newPatientForm, gender: e.target.value})}>
                  <option>Femenino</option>
                  <option>Masculino</option>
                </select>
                </div>
            </div>
            <div>
               <label className="block text-xs font-bold mb-1 uppercase">Fecha de Nacimiento</label>
               <input 
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
                  placeholder="Ej: 01/01/2000"
                  value={newPatientForm.birthDate}
                  onChange={e => setNewPatientForm({...newPatientForm, birthDate: e.target.value})}
               />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
               <label className="block text-xs font-bold mb-1 uppercase">telefono (whatsapp)</label>
               <input 
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
                  placeholder="Ej: +58 414 123 4567"
                  value={newPatientForm.phone}
                  onChange={e => setNewPatientForm({...newPatientForm, phone: e.target.value})}
               />
               </div>
               <div>
                <label className="text-xs font-bold mb-1 uppercase">E-mail</label>
                <input 
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition" 
                  placeholder="Ej: example@example.com"
                  value={newPatientForm.email}
                  onChange={e => setNewPatientForm({...newPatientForm, email: e.target.value})}
                />
                </div>
            </div>




            <div className="pt-4 flex gap-3">
               <Button variant="outline" className="flex-1 justify-center border-gray-300" onClick={() => setIsRegisterOpen(false)}>Cancelar</Button>
               <Button className="flex-1 bg-[#0E39B1] text-white justify-center shadow-lg shadow-blue-900/10" onClick={handleRegisterPatient}>Registrar y Admitir</Button>
            </div>
         </div>
      </Modal>

      <Modal isOpen={!!qrData} onClose={() => setQrData(null)} title="Receta Digital (QR)">
         <div className="text-center space-y-6">
            <p className="text-sm text-gray-600 px-4">
               Escanee para ver la receta digital de <strong>{qrData?.fullName}</strong>.
            </p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 w-56 h-56 mx-auto flex items-center justify-center overflow-hidden">
               {qrData && (
                 <img 
                   src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/public/prescription/${qrData.id}`)}`} 
                   alt="QR Code" 
                   className="w-full h-full object-contain"
                 />
               )}
            </div>
            <div className="flex gap-2 justify-center pt-2">
               <a 
                 href={`/public/prescription/${qrData?.id}`} 
                 target="_blank"
                 className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
               >
                  <Icon name="ExternalLink" size={16}/> Abrir Enlace
               </a>
               <Button className="bg-[#0E39B1] text-white" onClick={() => window.print()}>
                  <Icon name="Printer" size={16} className="mr-2"/> Imprimir
               </Button>
            </div>
         </div>
      </Modal>

      {/* MODAL DE PERFIL */}
      <ProfileModal isOpen={isProfileOpen} onClose={handleProfileClose} />

    </div>
  );
};

export default AssistantDashboard;