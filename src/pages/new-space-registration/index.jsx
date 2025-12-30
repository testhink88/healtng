import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import Icon from '@/components/AppIcon';
import { amenitiesList as initialAmenities } from '../../utils/spaces';

const NewSpaceRegistration = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Listas dinámicas para permitir agregar opciones personalizadas visualmente
  const [availableAmenities, setAvailableAmenities] = useState(initialAmenities || []);
  const [availableEquipment, setAvailableEquipment] = useState([
    'Camilla', 'Escritorio', 'Sillas', 'Monitor', 'Mesa de procedimientos',
    'Equipo de esterilización', 'Cámara', 'Micrófono', 'Camillas de fisioterapia',
    'Equipo de ejercicio', 'Espejo', 'Ecógrafo', 'Electrocardiógrafo'
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    squareFootage: '',
    description: '',
    location: '',
    hourlyRate: '',
    minimumBookingDuration: '1',
    bufferTime: '15',
    amenities: [],
    equipment: [],
    customEquipment: '',
    defaultHours: {
      start: '08:00',
      end: '18:00'
    },
    images: [],
    accessibility: [],
    safetyEquipment: []
  });

  const [errors, setErrors] = useState({});
  const [customAmenity, setCustomAmenity] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Opciones para los Selects (Restauradas)
  const spaceTypes = [
    'Consultorio de Especialidades',
    'Áreas de Diagnóstico y Tratamiento',
    'Rehabilitación y Bienestar',
    'Espacios Quirúrgicos y de Recuperación',
    'Educación y Coworking Médico',
    'Espacios de Odontología'
  ];

  const durationOptions = [
    { value: '0.5', label: '30 minutos' },
    { value: '1', label: '1 hora' },
    { value: '1.5', label: '1.5 horas' },
    { value: '2', label: '2 horas' },
  ];

  const bufferOptions = [
    { value: '0', label: 'Sin buffer' },
    { value: '15', label: '15 minutos' },
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
  ];

  // ✅ CORRECCIÓN CLAVE: Detecta si recibe un Evento o un Valor Directo
  // Esto arregla el Select para que guarde la opción elegida
  const handleInputChange = (field, valueOrEvent) => {
    let value = valueOrEvent;
    
    // Si es un objeto evento (tiene target), extraemos el valor. Si no, es el valor directo.
    if (valueOrEvent && typeof valueOrEvent === 'object' && valueOrEvent.target) {
      value = valueOrEvent.target.value;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Manejador de Checkboxes (Mantenemos el que funciona)
  const handleToggleCheckbox = (field, item) => {
    setFormData(prev => {
      const currentList = prev[field] || [];
      const newList = currentList.includes(item)
        ? currentList.filter(i => i !== item)
        : [...currentList, item];
      return { ...prev, [field]: newList };
    });
  };

  // Lógica de Imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Agregar Amenidad Personalizada
  const addCustomAmenity = () => {
    const trimmed = customAmenity?.trim();
    if (trimmed && !availableAmenities.includes(trimmed)) {
      setAvailableAmenities(prev => [...prev, trimmed]); // Agrega a la lista visual
      handleToggleCheckbox('amenities', trimmed); // Marca el check
      setCustomAmenity('');
    }
  };

  // Agregar Equipo Personalizado
  const addCustomEquipment = () => {
    const trimmed = formData.customEquipment?.trim();
    if (trimmed && !availableEquipment.includes(trimmed)) {
      setAvailableEquipment(prev => [...prev, trimmed]);
      handleToggleCheckbox('equipment', trimmed);
      handleInputChange('customEquipment', '');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.type) newErrors.type = 'El tipo es requerido';
    if (!formData.hourlyRate) newErrors.hourlyRate = 'La tarifa es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const storedSpaces = JSON.parse(localStorage.getItem('misEspacios') || '[]');
      const newSpace = { 
        ...formData, 
        id: Date.now(), 
        status: 'Disponible',
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('misEspacios', JSON.stringify([...storedSpaces, newSpace]));
      
      alert('¡Espacio publicado correctamente!');
      navigate('/clinic/spaces');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header userRole={userRole} onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Nuevo Espacio</h1>
            <p className="text-gray-600">Complete la información del activo médico</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Fotografía */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icon name="Camera" size={20} className="text-primary" /> Fotografía del Espacio
              </h2>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img src={imagePreview} alt="Vista previa" className="w-full h-48 object-cover rounded-lg shadow-md" />
                    <button 
                      type="button"
                      onClick={() => { setImagePreview(null); setFormData(prev => ({...prev, images: []})); }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center w-full">
                    <Icon name="UploadCloud" size={40} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600 font-medium">Clic para subir imagen</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Información Básica */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Icon name="Info" size={20} className="text-primary" /> Información Básica
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Espacio *</label>
                  <Input
                    placeholder="Ej: Consultorio A-102"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Espacio *</label>
                  {/* ✅ RESTAURADO: Usamos la prop 'options' como en tu versión original */}
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e)}
                    options={spaceTypes.map(type => ({ value: type, label: type }))}
                    placeholder="Seleccione tipo..."
                    className={errors.type ? 'border-red-500' : ''}
                  />
                  {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
                  <Input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', e)}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e)}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-gray-900 bg-white"
                    rows="3"
                    placeholder="Características del espacio..."
                  />
                </div>
              </div>
            </div>

            {/* Equipamiento y Amenidades */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Equipamiento y Servicios</h2>
              
              <div className="space-y-6">
                {/* Equipos */}
                <div>
                  <label className="block text-sm font-medium mb-3">Equipos Médicos</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableEquipment.map(item => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          id={item}
                          checked={formData.equipment.includes(item)}
                          onChange={() => handleToggleCheckbox('equipment', item)}
                        />
                        <label htmlFor={item} className="text-sm text-gray-600 cursor-pointer">{item}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input 
                      placeholder="Otro equipo..." 
                      value={formData.customEquipment}
                      onChange={(e) => handleInputChange('customEquipment', e)}
                    />
                    <Button type="button" variant="outline" onClick={addCustomEquipment}>Agregar</Button>
                  </div>
                </div>

                {/* Amenidades */}
                <div>
                  <label className="block text-sm font-medium mb-3">Amenidades</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleToggleCheckbox('amenities', amenity)}
                        />
                        <label htmlFor={amenity} className="text-sm text-gray-600 cursor-pointer">{amenity}</label>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input 
                      placeholder="Otra amenidad..." 
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={addCustomAmenity}>Agregar</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarifas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Tarifas y Horarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tarifa (USD/h) *</label>
                  <Input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e)}
                  />
                  {errors.hourlyRate && <p className="mt-1 text-xs text-red-600">{errors.hourlyRate}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duración Mínima</label>
                  {/* ✅ RESTAURADO: Usamos options prop */}
                  <Select
                    value={formData.minimumBookingDuration}
                    onChange={(e) => handleInputChange('minimumBookingDuration', e)}
                    options={durationOptions}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Buffer (Limpieza)</label>
                  {/* ✅ RESTAURADO: Usamos options prop */}
                  <Select
                    value={formData.bufferTime}
                    onChange={(e) => handleInputChange('bufferTime', e)}
                    options={bufferOptions}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Apertura</label>
                  <Input
                    type="time"
                    value={formData.defaultHours.start}
                    onChange={(e) => handleInputChange('defaultHours', { ...formData.defaultHours, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Cierre</label>
                  <Input
                    type="time"
                    value={formData.defaultHours.end}
                    onChange={(e) => handleInputChange('defaultHours', { ...formData.defaultHours, end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/clinic/spaces')}>Cancelar</Button>
              <Button type="submit">Publicar Ahora</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSpaceRegistration;