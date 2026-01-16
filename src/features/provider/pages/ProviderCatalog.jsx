import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";

// 🔑 MISMA CLAVE QUE INVENTARIO
const B2B_CATALOG_STORAGE_KEY = "healtng_provider_b2b_catalog_v1";

export default function ProviderCatalog() {
  const navigate = useNavigate();
  
  // --- Estados ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Modal Estados ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  
  // Formulario enriquecido
  const [formData, setFormData] = useState({
    price: "",
    moq: "",
    description: "",
    status: "active",
    lab: "",          // Nuevo: Laboratorio
    expiryDate: "",   // Nuevo: Vencimiento
    image: null       // Nuevo: Foto (Base64)
  });

  // 1. Cargar Datos
  useEffect(() => {
    try {
      const raw = localStorage.getItem(B2B_CATALOG_STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Error cargando catálogo", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Guardar Datos (Persistencia)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(B2B_CATALOG_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loading]);

  // 3. Filtrado
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter]);

  // --- Handlers ---

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      price: item.price || 0,
      moq: item.moq || 1,
      description: item.description || "",
      status: item.status || "draft",
      lab: item.lab || "",
      expiryDate: item.expiryDate || "",
      image: item.image || null
    });
    setIsEditModalOpen(true);
  };

  // Convertir imagen a Base64 para guardarla localmente
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editingItem) return;

    const updatedItems = items.map(i => {
      if (i.id === editingItem.id) {
        return {
          ...i,
          price: Number(formData.price),
          moq: Number(formData.moq),
          description: formData.description,
          status: formData.status,
          lab: formData.lab,           // Guardar Lab
          expiryDate: formData.expiryDate, // Guardar Fecha
          image: formData.image        // Guardar Foto
        };
      }
      return i;
    });

    setItems(updatedItems);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (confirm("¿Eliminar del catálogo B2B?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Catálogo</h1>
          <p className="text-sm text-gray-500">Enriquece la información de tus productos para mejorar la conversión B2B.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/provider/b2b")}>
                <Icon name="ArrowLeft" size={16} className="mr-2"/> Dashboard
            </Button>
            <Button variant="default" onClick={() => navigate("/provider/inventory")}>
                <Icon name="Plus" size={16} className="mr-2"/> Traer de Inventario
            </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
            <Input 
                placeholder="Buscar por nombre, laboratorio o SKU..." 
                icon="Search" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 overflow-x-auto">
            {['all', 'active', 'draft', 'inactive'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        statusFilter === status 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {status === 'all' ? 'Todos' : status === 'active' ? 'Publicados' : status === 'draft' ? 'Borradores' : 'Inactivos'}
                </button>
            ))}
        </div>
      </div>

      {/* Tabla Enriquecida */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="px-4 py-3 w-16">Foto</th>
                        <th className="px-4 py-3">Producto / Laboratorio</th>
                        <th className="px-4 py-3">Stock / Vencimiento</th>
                        <th className="px-4 py-3">Precios (Bs.)</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Editar</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredItems.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">Sin resultados.</td></tr>
                    ) : (
                        filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                {/* Columna Foto */}
                                <td className="px-4 py-3">
                                    <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="mini" className="w-full h-full object-cover" />
                                        ) : (
                                            <Icon name="Image" size={16} className="text-gray-400" />
                                        )}
                                    </div>
                                </td>
                                
                                {/* Columna Detalles */}
                                <td className="px-4 py-3">
                                    <div className="font-bold text-gray-900">{item.name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-blue-600 font-mono bg-blue-50 px-1 rounded">{item.code}</span>
                                        {item.lab && <span className="text-xs text-gray-500">• {item.lab}</span>}
                                    </div>
                                </td>

                                {/* Columna Logística */}
                                <td className="px-4 py-3">
                                    <div className={item.stock <= item.minStock ? "text-red-600 font-bold" : "text-gray-700"}>
                                        {item.stock} {item.unit}
                                    </div>
                                    {item.expiryDate && (
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Icon name="Calendar" size={10} /> 
                                            Vence: {item.expiryDate}
                                        </div>
                                    )}
                                </td>

                                {/* Columna Precio */}
                                <td className="px-4 py-3">
                                    <div className="font-medium text-gray-900">
                                        {item.price > 0 ? `Bs. ${item.price.toLocaleString()}` : <span className="text-red-400 italic">--</span>}
                                    </div>
                                    {item.moq > 1 && <div className="text-xs text-gray-400">Min: {item.moq} un.</div>}
                                </td>

                                {/* Columna Estado */}
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'active' ? 'bg-green-100 text-green-800' :
                                        item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {item.status === 'active' ? 'Activo' : 'Borrador'}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    <Button size="xs" variant="outline" onClick={() => handleEditClick(item)}>
                                        <Icon name="Edit2" size={14} />
                                    </Button>
                                    <Button size="xs" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                        <Icon name="Trash2" size={14} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- MODAL DE EDICIÓN ENRIQUECIDO --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
            
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[95vh]">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Configurar Publicación</h3>
                        <p className="text-sm text-gray-500">{editingItem?.name}</p>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <Icon name="X" size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* COLUMNA IZQUIERDA: IMAGEN */}
                    <div className="md:col-span-1 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Fotografía del Producto</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative h-48">
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded" />
                                        <button 
                                            onClick={() => setFormData({...formData, image: null})}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:text-red-500"
                                        >
                                            <Icon name="Trash2" size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center">
                                        <Icon name="Image" size={32} className="text-gray-300 mb-2" />
                                        <span className="text-xs text-blue-600 font-medium">Subir Imagen</span>
                                        <span className="text-[10px] text-gray-400 mt-1">Máx 2MB</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1">
                                <Icon name="Info" size={12} /> Stock Actual
                            </h4>
                            <p className="text-sm text-blue-900">{editingItem?.stock} {editingItem?.unit}</p>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: DATOS */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Precio Unitario (Bs.)</label>
                                <Input 
                                    type="number" 
                                    value={formData.price} 
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Compra Mínima (MOQ)</label>
                                <Input 
                                    type="number" 
                                    value={formData.moq} 
                                    onChange={e => setFormData({...formData, moq: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Laboratorio / Marca</label>
                                <Input 
                                    value={formData.lab} 
                                    onChange={e => setFormData({...formData, lab: e.target.value})}
                                    placeholder="Ej. Genéricos de Vzla"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fecha Vencimiento</label>
                                <Input 
                                    type="date"
                                    value={formData.expiryDate} 
                                    onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Descripción Detallada</label>
                            <textarea 
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Composición, indicaciones, etc..."
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Estado</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="draft">Borrador (Solo yo lo veo)</option>
                                <option value="active">Activo (Visible en tienda)</option>
                                <option value="inactive">Pausado (No disponible)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={handleSave}>
                        Guardar y Publicar
                    </Button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}