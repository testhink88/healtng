import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";

// ==========================================
// CONFIGURACIÓN Y STORAGE
// ==========================================
const STORAGE_KEY = "healtng_provider_dispatch_v1";

const MOCK_SHIPMENTS = [
  {
    id: "SHP-001",
    orderId: "ORD-1024",
    customer: "Farmacia Central",
    address: "Av. Bolívar, Edf. Azul, Piso 2",
    contactPhone: "0414-1234567",
    status: "pending",
    driver: null,
    vehicle: null,
    createdAt: "2024-01-14T08:00:00",
    dispatchedAt: null,
    deliveredAt: null,
    items: [
        { desc: "Paracetamol x50", qty: 50 },
        { desc: "Alcohol Absoluto x10", qty: 10 }
    ],
    proofOfDelivery: null,
  },
  {
    id: "SHP-002",
    orderId: "ORD-1025",
    customer: "Clínica San Bernardino",
    address: "Urb. San Bernardino, Calle 5",
    contactPhone: "0412-9876543",
    status: "in_transit",
    driver: "Juan Pérez",
    vehicle: "Moto Bera - AB123",
    createdAt: "2024-01-13T09:30:00",
    dispatchedAt: "2024-01-13T10:00:00",
    deliveredAt: null,
    items: [
        { desc: "Kit Quirúrgico x5", qty: 5 }
    ],
    proofOfDelivery: null,
  }
];

const DRIVERS = [
  { id: 1, name: "Juan Pérez", vehicle: "Moto Bera - AB123" },
  { id: 2, name: "María Gomez", vehicle: "Panel Chevrolet - CD456" },
  { id: 3, name: "Carlos Ruiz", vehicle: "Camión 350 - EF789" },
];

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const ProviderDispatchManagement = () => {
  const [shipments, setShipments] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_SHIPMENTS;
  });

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- MODALES ---
  const [selectedShipment, setSelectedShipment] = useState(null); 
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // <--- NUEVO MODAL

  // --- ESTADOS DE FORMULARIOS ---
  const [deliveryData, setDeliveryData] = useState({ receiverName: "", notes: "" });
  const [deliveryImage, setDeliveryImage] = useState(null);

  // Estado para Nuevo Envío Manual
  const [newShipmentData, setNewShipmentData] = useState({
      customer: "",
      address: "",
      contactPhone: "",
      description: "", // Descripción general de la carga
      qty: 1
  });

  // Persistencia
  useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
  }, [shipments]);

  // Filtros
  const filteredShipments = shipments.filter((s) => {
    const matchesStatus = filter === "all" ? true : s.status === filter;
    const matchesSearch =
      s.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- LÓGICA DE NEGOCIO ---

  const handleCreateManualShipment = () => {
      // Validaciones básicas
      if (!newShipmentData.customer.trim()) return alert("El nombre del cliente es obligatorio.");
      if (!newShipmentData.address.trim()) return alert("La dirección es obligatoria.");
      if (!newShipmentData.description.trim()) return alert("Describe qué se va a enviar.");

      // Generar ID único simple
      const newId = `SHP-${Math.floor(Math.random() * 9000) + 1000}`;
      const now = new Date().toISOString();

      const newShipment = {
          id: newId,
          orderId: "MANUAL", // Indicador de que no viene de una orden del sistema
          customer: newShipmentData.customer,
          address: newShipmentData.address,
          contactPhone: newShipmentData.contactPhone || "N/A",
          status: "pending",
          driver: null,
          vehicle: null,
          createdAt: now,
          dispatchedAt: null,
          deliveredAt: null,
          items: [
              { desc: newShipmentData.description, qty: Number(newShipmentData.qty) || 1 }
          ],
          proofOfDelivery: null,
      };

      setShipments(prev => [newShipment, ...prev]);
      setShowCreateModal(false);
      setNewShipmentData({ customer: "", address: "", contactPhone: "", description: "", qty: 1 }); // Limpiar form
  };

  const handleAssignDriver = (driver) => {
    if (!selectedShipment) return;
    const now = new Date().toISOString();
    
    setShipments(prev => prev.map(s => s.id === selectedShipment.id ? {
        ...s,
        status: "in_transit",
        driver: driver.name,
        vehicle: driver.vehicle,
        dispatchedAt: now
    } : s));

    setShowAssignModal(false);
    setSelectedShipment(null);
  };

  const handleConfirmDelivery = () => {
    if (!selectedShipment) return;
    if (!deliveryData.receiverName) return alert("Debes indicar quién recibe.");
    if (!deliveryImage) return alert("Debes cargar una foto como prueba de entrega.");

    const now = new Date().toISOString();
    setShipments(prev => prev.map(s => s.id === selectedShipment.id ? {
        ...s,
        status: "delivered",
        deliveredAt: now,
        proofOfDelivery: { ...deliveryData, image: deliveryImage }
    } : s));

    setShowDeliveryModal(false);
    setSelectedShipment(null);
    setDeliveryData({ receiverName: "", notes: "" });
    setDeliveryImage(null);
  };

  const handlePrintGuide = (shipment) => {
    const w = window.open("", "_blank", "width=800,height=600");
    w.document.write(`
        <html>
            <head><title>Guía de Despacho ${shipment.id}</title></head>
            <body style="font-family: sans-serif; padding: 40px;">
                <div style="border: 2px solid #dddbff; padding: 20px;">
                    <h1 style="margin:0;">GUÍA DE DESPACHO</h1>
                    <p><b>ID:</b> ${shipment.id} | <b>Ref. Orden:</b> ${shipment.orderId}</p>
                    <hr/>
                    <table style="width:100%">
                        <tr>
                            <td><b>Cliente:</b><br/>${shipment.customer}</td>
                            <td><b>Dirección:</b><br/>${shipment.address}<br/>Tel: ${shipment.contactPhone}</td>
                        </tr>
                    </table>
                    <hr/>
                    <h3>Detalle de Carga</h3>
                    <ul>
                        ${shipment.items.map(i => `<li>${i.qty} x ${i.desc}</li>`).join('')}
                    </ul>
                    <hr/>
                    <div style="margin-top: 50px; display: flex; justify-content: space-between;">
                        <div style="border-top: 1px solid #dddbff; width: 40%; padding-top: 5px;">Firma Conductor (${shipment.driver || '_____________'})</div>
                        <div style="border-top: 1px solid #dddbff; width: 40%; padding-top: 5px;">Firma Recibido (Cliente)</div>
                    </div>
                </div>
                <script>window.print();</script>
            </body>
        </html>
    `);
    w.document.close();
  };

  // --- UI COMPONENTS ---

  const StatusBadge = ({ status }) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "En Almacén" },
      in_transit: { color: "bg-blue-100 text-blue-800", label: "En Ruta" },
      delivered: { color: "bg-green-100 text-green-800", label: "Entregado" },
      failed: { color: "bg-red-100 text-red-800", label: "Fallido" },
    };
    const c = config[status] || config.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.color}`}>{c.label}</span>;
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDeliveryImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Despachos</h1>
          <p className="text-sm text-gray-500">Logística de última milla y control de entregas.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={() => {
                if(confirm("¿Resetear datos?")) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                }
            }} className="text-red-500">
                Reset Demo
            </Button>
            {/* ACTIVADO: Ahora abre el modal */}
            <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
                <Icon name="Plus" size={16} className="mr-2" /> Crear Envío Manual
            </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {["all", "pending", "in_transit", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Por Salir' : f === 'in_transit' ? 'En Ruta' : 'Finalizados'}
            </button>
          ))}
        </div>
        <Input
            placeholder="Buscar por ID, Cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-white"
            icon="Search"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Envío / Orden</th>
                    <th className="px-4 py-3 whitespace-nowrap">Destino</th>
                    <th className="px-4 py-3 whitespace-nowrap">Logística</th>
                    <th className="px-4 py-3 whitespace-nowrap">Estado</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Gestión</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {filteredShipments.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-400">No hay envíos en esta vista.</td></tr>
                ) : (
                    filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">
                            <div className="font-bold text-gray-900">{s.id}</div>
                            <div className="text-xs text-blue-600 font-mono">{s.orderId}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(s.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                            <div className="font-medium text-gray-900 truncate">{s.customer}</div>
                            <div className="text-xs text-gray-500 truncate" title={s.address}>{s.address}</div>
                        </td>
                        <td className="px-4 py-3">
                            {s.driver ? (
                                <div>
                                    <div className="text-xs font-bold text-gray-700">{s.driver}</div>
                                    <div className="text-[10px] text-gray-500">{s.vehicle}</div>
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 italic">-- Sin asignar --</span>
                            )}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                                <Button size="xs" variant="outline" onClick={() => handlePrintGuide(s)} title="Imprimir Guía">
                                    <Icon name="Printer" size={14} />
                                </Button>
                                
                                {s.status === 'pending' && (
                                    <Button size="xs" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                                        setSelectedShipment(s);
                                        setShowAssignModal(true);
                                    }}>
                                        Asignar
                                    </Button>
                                )}
                                
                                {s.status === 'in_transit' && (
                                    <Button size="xs" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => {
                                        setSelectedShipment(s);
                                        setShowDeliveryModal(true);
                                    }}>
                                        Entregar
                                    </Button>
                                )}

                                {(s.status === 'delivered' || s.status === 'failed') && (
                                    <Button size="xs" variant="ghost" onClick={() => {
                                        setSelectedShipment(s);
                                        alert(`Entregado el: ${new Date(s.deliveredAt).toLocaleString()}\nRecibió: ${s.proofOfDelivery?.receiverName}`);
                                    }}>
                                        <Icon name="Eye" size={14} />
                                    </Button>
                                )}
                            </div>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL 1: ASIGNAR CONDUCTOR --- */}
      {showAssignModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={() => { setShowAssignModal(false); setSelectedShipment(null); }} />
            
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col z-10">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Asignar Logística</h3>
                    <p className="text-sm text-gray-600">Selecciona quién transportará el envío <b>{selectedShipment.id}</b></p>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-2">
                        {DRIVERS.map(driver => (
                            <button key={driver.id} onClick={() => handleAssignDriver(driver)}
                                className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-left group">
                                <div>
                                    <div className="font-bold text-sm text-gray-800">{driver.name}</div>
                                    <div className="text-xs text-gray-500">{driver.vehicle}</div>
                                </div>
                                <Icon name="ChevronRight" size={16} className="text-gray-300 group-hover:text-blue-600"/>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex justify-end">
                    <Button variant="ghost" onClick={() => { setShowAssignModal(false); setSelectedShipment(null); }}>Cancelar</Button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL 2: REGISTRAR ENTREGA (POD) --- */}
      {showDeliveryModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => { setShowDeliveryModal(false); setSelectedShipment(null); }} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col z-10 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                        <Icon name="CheckCircle" size={20} />
                        Confirmar Entrega
                    </h3>
                    <p className="text-sm text-gray-600">Registrar recepción para <b>{selectedShipment.customer}</b></p>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Recibido por (Nombre/Cargo)</label>
                        <Input 
                            value={deliveryData.receiverName} 
                            onChange={e => setDeliveryData({...deliveryData, receiverName: e.target.value})}
                            placeholder="Ej: María Perez - Recepción"
                            className="w-full bg-white text-gray-900 border-gray-300"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Notas de entrega</label>
                        <textarea 
                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none shadow-sm"
                            rows={3}
                            placeholder="Ej: Caja sellada, sin novedades."
                            value={deliveryData.notes}
                            onChange={e => setDeliveryData({...deliveryData, notes: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Foto de entrega (Obligatorio)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors bg-white">
                            <div className="space-y-1 text-center">
                                {deliveryImage ? (
                                    <div className="relative">
                                        <img src={deliveryImage} alt="Preview" className="mx-auto h-32 object-cover rounded-md" />
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setDeliveryImage(null); }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                                        >
                                            <Icon name="X" size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Icon name="Camera" className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span>Subir una foto</span>
                                                <input type="file" className="sr-only" onChange={handlePhotoUpload} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={() => { setShowDeliveryModal(false); setSelectedShipment(null); }}>Cancelar</Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={handleConfirmDelivery}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL 3: NUEVO ENVÍO MANUAL (NUEVO) --- */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={() => setShowCreateModal(false)} />
              
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col z-10 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Crear Envío Manual</h3>
                      <p className="text-sm text-gray-500">Para envíos fuera de órdenes (muestras, garantías, etc.)</p>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Cliente / Destinatario</label>
                              <Input 
                                  value={newShipmentData.customer}
                                  onChange={e => setNewShipmentData({...newShipmentData, customer: e.target.value})}
                                  placeholder="Ej: Farmacia Los Andes"
                                  className="w-full bg-white text-gray-900 border-gray-300"
                              />
                          </div>
                          <div className="col-span-2">
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Dirección de Entrega</label>
                              <Input 
                                  value={newShipmentData.address}
                                  onChange={e => setNewShipmentData({...newShipmentData, address: e.target.value})}
                                  placeholder="Ej: Av. Principal, Local 4"
                                  className="w-full bg-white text-gray-900 border-gray-300"
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Teléfono</label>
                              <Input 
                                  value={newShipmentData.contactPhone}
                                  onChange={e => setNewShipmentData({...newShipmentData, contactPhone: e.target.value})}
                                  placeholder="0414..."
                                  className="w-full bg-white text-gray-900 border-gray-300"
                              />
                          </div>
                          <div>
                               <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Cantidad Bultos</label>
                               <Input 
                                  type="number"
                                  value={newShipmentData.qty}
                                  onChange={e => setNewShipmentData({...newShipmentData, qty: e.target.value})}
                                  className="w-full bg-white text-gray-900 border-gray-300"
                              />
                          </div>
                          <div className="col-span-2">
                              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Contenido de la carga</label>
                              <textarea 
                                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm"
                                  rows={3}
                                  placeholder="Describe los productos a enviar..."
                                  value={newShipmentData.description}
                                  onChange={e => setNewShipmentData({...newShipmentData, description: e.target.value})}
                              />
                          </div>
                      </div>
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                      <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={handleCreateManualShipment}>
                          Crear Envío
                      </Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProviderDispatchManagement;