import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import { getBusinessContext } from "@/utils/mockData";

// ==========================
// Constantes y Listas
// ==========================
const VENEZUELA_INSURERS = [
  { value: 'Seguros Caracas', label: 'Seguros Caracas' },
  { value: 'Seguros Mercantil', label: 'Seguros Mercantil' },
  { value: 'Mapfre', label: 'Mapfre' },
  { value: 'Seguros Universitas', label: 'Seguros Universitas' },
  { value: 'Seguros Constitución', label: 'Seguros Constitución' },
  { value: 'La Previsora', label: 'La Previsora' },
  { value: 'Pirámide Seguros', label: 'Pirámide Seguros' },
  { value: 'Oceanica de Seguros', label: 'Oceánica de Seguros' },
  { value: 'Estar Seguros', label: 'Estar Seguros' },
  { value: 'Otro', label: 'Otra / Particular' }
];

const PRIORITIES = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

// ==========================
// Helpers
// ==========================
const generateId = (prefix) => `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const ProviderAuthorizations = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  
  // Estado para el modal de "Registrar Respuesta de Aseguradora"
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseAction, setResponseAction] = useState(null); // 'approve' | 'deny'
  const [responseData, setResponseData] = useState({ approvalKey: '', denialReason: '' });

  // Detectar rol
  const businessContext = useMemo(() => getBusinessContext(), []);
  const isClinic = !businessContext?.businessType?.toLowerCase().includes("proveedor");

  // ==========================
  // Estado & Persistencia
  // ==========================
  const [authorizations, setAuthorizations] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("healtng_auths_v2");
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: 'AUTH-001',
        patientName: 'María González',
        patientId: 'V-12345678',
        insuranceCompany: 'Seguros Caracas',
        policyNumber: 'POL-789456',
        type: 'service',
        title: 'Cirugía Menor (Extirpación)',
        requestingDoctor: 'Dr. Carlos Mendoza',
        requestDate: '2024-01-15',
        status: 'pending', // Estado inicial
        priority: 'normal',
        estimatedCost: 150000,
        copay: 0,
        notes: 'Lesión pigmentada en brazo derecho',
        diagnosis: 'D22.3 - Nevo melanocítico',
        room: 'Q-02',
        documents: [
          { name: 'Informe Médico', type: 'PDF', uploaded: true },
          { name: 'Copia Cédula', type: 'IMG', uploaded: true }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("healtng_auths_v2", JSON.stringify(authorizations));
  }, [authorizations]);

  // ==========================
  // Formulario Nueva Solicitud
  // ==========================
  const [newAuthData, setNewAuthData] = useState({
    patientName: '',
    patientId: '',
    insuranceCompany: 'Seguros Caracas', // Default
    policyNumber: '',
    title: '',
    estimatedCost: '',
    priority: 'normal', // Default asegurado
    diagnosis: '',
    productSku: '',
  });

  const handleCreateAuth = () => {
    // Validación básica
    if (!newAuthData.patientName || !newAuthData.patientId || !newAuthData.title) {
        alert("Por favor complete los campos obligatorios (Paciente, Cédula, Procedimiento).");
        return;
    }

    const newAuth = {
      id: generateId(isClinic ? 'AUTH-CLI' : 'AUTH-PROV'),
      ...newAuthData,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'pending', // Siempre nace pendiente
      copay: 0,
      approvalKey: '',
      denialReason: '',
      type: isClinic ? 'service' : 'product',
      // Agregamos documentos vacíos por defecto para robustez
      documents: [
        { name: 'Informe Médico / Orden', type: 'PDF', uploaded: false },
        { name: 'Cédula de Identidad', type: 'IMG', uploaded: false }
      ],
      notes: 'Solicitud creada manualmente'
    };
    setAuthorizations(prev => [newAuth, ...prev]);
    setIsNewModalOpen(false);
    // Reset form
    setNewAuthData({ 
        patientName: '', patientId: '', insuranceCompany: 'Seguros Caracas', 
        policyNumber: '', title: '', estimatedCost: '', 
        priority: 'normal', diagnosis: '', productSku: '' 
    });
  };

  // Handler genérico para selects del formulario
  const handleNewAuthChange = (field, value) => {
      // Si el componente Select devuelve un objeto evento o el valor directo, manejamos ambos
      const val = value?.target ? value.target.value : value;
      setNewAuthData(prev => ({ ...prev, [field]: val }));
  };

  // ==========================
  // Gestión de Flujo (Simulación de Aseguradora)
  // ==========================
  
  // Paso 1: Clínica envía la solicitud
  const handleProcessRequest = (id) => {
      const confirmSend = window.confirm("¿Está seguro de enviar esta solicitud a la aseguradora? Pasará a estado 'En Revisión'.");
      if(confirmSend) {
          updateStatus(id, 'in_review');
          alert("Solicitud enviada exitosamente. Quedando a la espera de respuesta.");
      }
  };

  // Paso 2: Clínica recibe y registra la respuesta
  const openResponseModal = (action) => {
      setResponseAction(action);
      setResponseData({ approvalKey: '', denialReason: '' });
      setIsResponseModalOpen(true);
  };

  const handleRegisterResponse = () => {
      if (responseAction === 'approve' && !responseData.approvalKey) {
          alert("Debe ingresar la Clave de Aprobación dada por el seguro.");
          return;
      }
      if (responseAction === 'deny' && !responseData.denialReason) {
          alert("Debe ingresar el motivo del rechazo.");
          return;
      }

      const newStatus = responseAction === 'approve' ? 'approved' : 'denied';
      
      setAuthorizations(prev => prev.map(a => 
        a.id === selectedAuth.id 
          ? { 
              ...a, 
              status: newStatus,
              approvalKey: responseData.approvalKey,
              denialReason: responseData.denialReason,
              approvalDate: new Date().toISOString()
            } 
          : a
      ));
      
      // Actualizar vista actual
      setSelectedAuth(prev => ({
          ...prev,
          status: newStatus,
          approvalKey: responseData.approvalKey,
          denialReason: responseData.denialReason
      }));

      setIsResponseModalOpen(false);
      setIsModalOpen(false); // Cerramos también el detalle
  };

  const updateStatus = (id, newStatus) => {
    setAuthorizations(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedAuth && selectedAuth.id === id) {
        setSelectedAuth(prev => ({...prev, status: newStatus}));
    }
  };

  // ==========================
  // UI Helpers
  // ==========================
  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Borrador / Pendiente', class: 'bg-gray-100 text-gray-800 border-gray-200' },
      in_review: { label: 'Enviada / En Revisión', class: 'bg-blue-100 text-blue-800 border-blue-200' },
      approved: { label: 'Aprobada', class: 'bg-green-100 text-green-800 border-green-200' },
      denied: { label: 'Rechazada', class: 'bg-red-100 text-red-800 border-red-200' },
      expired: { label: 'Vencida', class: 'bg-orange-100 text-orange-800 border-orange-200' }
    }[status] || { label: status, class: 'bg-gray-100' };
    
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${config.class}`}>{config.label}</span>;
  };

  const filteredAuths = authorizations?.filter(auth => activeTab === 'all' ? true : auth?.status === activeTab);

  // ==========================
  // Componente de Tarjeta
  // ==========================
  const AuthorizationCard = ({ auth }) => (
    // CORRECCIÓN VISUAL: Fondo blanco y borde para resaltar sobre el fondo gris
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group" onClick={() => { setSelectedAuth(auth); setIsModalOpen(true); }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${auth.type === 'service' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
            <Icon name={auth.type === 'service' ? "Activity" : "Box"} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{auth.id}</h3>
            <p className="text-sm text-gray-600">{auth.patientName}</p>
          </div>
        </div>
        {getStatusBadge(auth.status)}
      </div>
      
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-sm"><span className="text-gray-500">Procedimiento:</span> <span className="font-medium text-gray-900">{auth.title}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Seguro:</span> <span className="text-gray-700">{auth.insuranceCompany}</span></div>
        <div className="flex justify-between text-sm"><span className="text-gray-500">Monto:</span> <span className="text-gray-900 font-mono">Bs. {Number(auth.estimatedCost).toLocaleString()}</span></div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
         <span className="text-xs text-gray-400">Creado: {auth.requestDate}</span>
         {auth.status === 'approved' && <span className="text-xs font-bold text-green-600 flex items-center"><Icon name="Check" size={12} className="mr-1"/> Con Clave</span>}
         {auth.status === 'denied' && <span className="text-xs font-bold text-red-600">Rechazada</span>}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isClinic ? "Autorizaciones Médicas" : "Autorizaciones de Despacho"}</h1>
          <p className="text-gray-500 text-sm">Gestión de solicitudes ante aseguradoras.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { localStorage.removeItem("healtng_auths_v2"); window.location.reload(); }} className="text-red-400 hover:text-red-600"><Icon name="Trash2" size={16} className="mr-2"/> Reset</Button>
            <Button onClick={() => setIsNewModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"><Icon name="Plus" size={16} className="mr-2" />Nueva Solicitud</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex space-x-4">
            {[{id:'all', l:'Todas'}, {id:'pending', l:'Borradores'}, {id:'in_review', l:'Enviadas'}, {id:'approved', l:'Aprobadas'}, {id:'denied', l:'Rechazadas'}].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    {t.l}
                </button>
            ))}
        </nav>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuths?.map(auth => <AuthorizationCard key={auth.id} auth={auth} />)}
      </div>
      {filteredAuths.length === 0 && <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300"><Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-30"/><p>No hay solicitudes en esta bandeja.</p></div>}

      {/* MODAL DETALLES */}
      {isModalOpen && selectedAuth && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 rounded-t-xl">
              <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{selectedAuth.title}</h2>
                    {getStatusBadge(selectedAuth.status)}
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Icon name="User" size={14}/> {selectedAuth.patientName} ({selectedAuth.patientId})</span>
                      <span className="flex items-center gap-1"><Icon name="Calendar" size={14}/> {selectedAuth.requestDate}</span>
                  </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><Icon name="X" size={24} /></button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 overflow-y-auto">
                {/* Columna Izquierda: Detalles */}
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Datos del Seguro</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-4">
                            <div><label className="text-xs text-gray-400">Aseguradora</label><p className="font-medium text-gray-900">{selectedAuth.insuranceCompany}</p></div>
                            <div><label className="text-xs text-gray-400">Nro. Póliza</label><p className="font-medium text-gray-900">{selectedAuth.policyNumber || "No especificado"}</p></div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detalles Clínicos / Económicos</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Diagnóstico / Motivo</span>
                                <span className="font-medium text-right">{selectedAuth.diagnosis || selectedAuth.notes}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-600">Monto Presupuestado</span>
                                <span className="font-bold text-gray-900">Bs. {Number(selectedAuth.estimatedCost).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Prioridad Solicitada</span>
                                <span className={`uppercase text-xs font-bold px-2 py-1 rounded ${selectedAuth.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{selectedAuth.priority}</span>
                            </div>
                        </div>
                    </section>

                    {/* Resultado de Aprobación (Solo visible si ya respondieron) */}
                    {(selectedAuth.status === 'approved' || selectedAuth.status === 'denied') && (
                        <section className={`p-4 rounded-lg border ${selectedAuth.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h3 className={`text-sm font-bold mb-2 ${selectedAuth.status === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
                                {selectedAuth.status === 'approved' ? 'Respuesta: APROBADA' : 'Respuesta: RECHAZADA'}
                            </h3>
                            {selectedAuth.status === 'approved' ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <Icon name="Key" size={16}/> <span>Clave de Aprobación: <strong>{selectedAuth.approvalKey}</strong></span>
                                </div>
                            ) : (
                                <div className="text-red-700 text-sm">
                                    <strong>Motivo:</strong> {selectedAuth.denialReason}
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Columna Derecha: Acciones */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Gestionar Solicitud</h3>
                        
                        {/* Estado 1: Pendiente (Borrador) */}
                        {selectedAuth.status === 'pending' && (
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 mb-2">La solicitud está en borrador. Verifique los datos antes de enviar a la aseguradora.</p>
                                <Button onClick={() => handleProcessRequest(selectedAuth.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm py-2">
                                    <Icon name="Send" size={16} className="mr-2"/> Procesar / Enviar
                                </Button>
                            </div>
                        )}

                        {/* Estado 2: En Revisión (Esperando respuesta) */}
                        {selectedAuth.status === 'in_review' && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded text-xs mb-2">
                                    <Icon name="Clock" size={14}/> Esperando respuesta del seguro...
                                </div>
                                <p className="text-xs text-gray-500">Si ya recibió respuesta por otro canal (Tlf/Portal), regístrela aquí:</p>
                                <Button onClick={() => openResponseModal('approve')} className="w-full bg-green-600 hover:bg-green-700 text-white mb-2">
                                    <Icon name="Check" size={16} className="mr-2"/> Registrar Aprobación
                                </Button>
                                <Button onClick={() => openResponseModal('deny')} className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50">
                                    <Icon name="X" size={16} className="mr-2"/> Registrar Rechazo
                                </Button>
                            </div>
                        )}

                        {/* Estado 3: Cerrado */}
                        {(selectedAuth.status === 'approved' || selectedAuth.status === 'denied') && (
                            <div className="text-center text-gray-400 text-xs italic">
                                Este caso está cerrado. No se pueden realizar más acciones.
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Adjuntos</h3>
                        <div className="space-y-2">
                            {selectedAuth.documents?.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <Icon name="FileText" size={14} className="text-gray-400 flex-shrink-0"/>
                                        <span className="truncate">{doc.name}</span>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${doc.uploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {doc.uploaded ? 'Listo' : 'Pendiente'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR RESPUESTA */}
      {isResponseModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                  <h3 className={`text-lg font-bold mb-4 ${responseAction === 'approve' ? 'text-green-700' : 'text-red-700'}`}>
                      {responseAction === 'approve' ? 'Registrar Aprobación' : 'Registrar Rechazo'}
                  </h3>
                  
                  {responseAction === 'approve' ? (
                      <div className="space-y-4">
                          <p className="text-sm text-gray-600">Ingrese la clave suministrada por la aseguradora para validar la cobertura.</p>
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">Clave de Aprobación / Nro Referencia</label>
                              <Input 
                                autoFocus 
                                placeholder="Ej: AP-99887766" 
                                value={responseData.approvalKey} 
                                onChange={(e) => setResponseData({...responseData, approvalKey: e.target.value})} 
                              />
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <p className="text-sm text-gray-600">Indique el motivo por el cual la aseguradora declinó la solicitud.</p>
                          <div>
                              <label className="block text-xs text-gray-500 mb-1">Motivo del Rechazo</label>
                              <Input 
                                autoFocus 
                                placeholder="Ej: Póliza inactiva, Cobertura agotada..." 
                                value={responseData.denialReason} 
                                onChange={(e) => setResponseData({...responseData, denialReason: e.target.value})} 
                              />
                          </div>
                      </div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                      <Button variant="ghost" onClick={() => setIsResponseModalOpen(false)}>Cancelar</Button>
                      <Button onClick={handleRegisterResponse} className={responseAction === 'approve' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                          Guardar Respuesta
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL NUEVA SOLICITUD */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Nueva Solicitud ({isClinic ? "Clínica" : "Proveedor"})</h3>
                    <button onClick={() => setIsNewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><Icon name="X" size={20}/></button>
                </div>
                
                <div className="space-y-4">
                    {/* Sección Paciente */}
                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase">Datos del Paciente</p>
                        <Input placeholder="Nombre Completo" value={newAuthData.patientName} onChange={e => handleNewAuthChange('patientName', e)} />
                        <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Cédula (V-xxx)" value={newAuthData.patientId} onChange={e => handleNewAuthChange('patientId', e)} />
                            <Input placeholder="Nro. Póliza" value={newAuthData.policyNumber} onChange={e => handleNewAuthChange('policyNumber', e)} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Aseguradora</label>
                            <Select options={VENEZUELA_INSURERS} value={newAuthData.insuranceCompany} onChange={e => handleNewAuthChange('insuranceCompany', e)} />
                        </div>
                    </div>

                    {/* Sección Procedimiento */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase pt-2">Detalles de la Solicitud</p>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">{isClinic ? "Procedimiento / Cirugía" : "Producto / Insumo"}</label>
                            <Input placeholder={isClinic ? "Ej: Apendicectomía" : "Ej: Clavos Titanio 5mm"} value={newAuthData.title} onChange={e => handleNewAuthChange('title', e)} />
                        </div>
                        
                        {isClinic ? (
                            <Input placeholder="Diagnóstico (CIE-10)" value={newAuthData.diagnosis} onChange={e => handleNewAuthChange('diagnosis', e)} />
                        ) : (
                            <Input placeholder="SKU / Código Referencia" value={newAuthData.productSku} onChange={e => handleNewAuthChange('productSku', e)} />
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Costo Estimado (Bs)</label>
                                <Input type="number" placeholder="0.00" value={newAuthData.estimatedCost} onChange={e => handleNewAuthChange('estimatedCost', e)} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Prioridad</label>
                                <Select options={PRIORITIES} value={newAuthData.priority} onChange={e => handleNewAuthChange('priority', e)} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                    <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreateAuth} className="bg-blue-600 hover:bg-blue-700 text-white">Crear Borrador</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAuthorizations;