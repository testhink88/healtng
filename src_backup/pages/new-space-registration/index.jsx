import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import Icon from '@/components/AppIcon';
import { spaceTypes, amenitiesList } from '../../utils/spaces';

const NewSpaceRegistration = () => {
  const navigate = useNavigate();
  const [userRole] = useState(localStorage.getItem('userRole') || 'clinic');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev?.amenities?.includes(amenity)
        ? prev?.amenities?.filter(a => a !== amenity)
        : [...prev?.amenities, amenity]
    }));
  };

  const addCustomAmenity = () => {
    if (customAmenity?.trim() && !formData?.amenities?.includes(customAmenity?.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev?.amenities, customAmenity?.trim()]
      }));
      setCustomAmenity('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) newErrors.name = 'El nombre del espacio es requerido';
    if (!formData?.type) newErrors.type = 'El tipo de espacio es requerido';
    if (!formData?.capacity || formData?.capacity < 1) newErrors.capacity = 'La capacidad debe ser mayor a 0';
    if (!formData?.hourlyRate || formData?.hourlyRate < 0) newErrors.hourlyRate = 'La tarifa por hora es requerida';
    if (!formData?.location?.trim()) newErrors.location = 'La ubicación es requerida';
    if (!formData?.squareFootage || formData?.squareFootage < 1) newErrors.squareFootage = 'El área es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      // Here you would normally save to your backend
      console.log('Saving space:', formData);
      
      // Show success message and redirect
      alert('Espacio registrado exitosamente');
      navigate('/clinic/spaces');
    }
  };

  const equipmentOptions = [
    'Camilla',
    'Escritorio',
    'Sillas',
    'Monitor',
    'Mesa de procedimientos',
    'Equipo de esterilización',
    'Cámara',
    'Micrófono',
    'Camillas de fisioterapia',
    'Equipo de ejercicio',
    'Espejo',
    'Ecógrafo',
    'Electrocardiógrafo'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <span>Panel Principal</span>
            <Icon name="ChevronRight" size={16} />
            <button 
              onClick={() => navigate('/clinic/spaces')}
              className="hover:text-gray-700"
            >
              Gestión de Espacios
            </button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-gray-900 font-medium">Nuevo Espacio</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Nuevo Espacio</h1>
            <p className="text-gray-600">Complete la información del espacio médico</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Espacio <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Ej: Consultorio 1, Sala de Procedimientos"
                    value={formData?.name}
                    onChange={(e) => handleInputChange('name', e?.target?.value)}
                    className={errors?.name ? 'border-red-300' : ''}
                  />
                  {errors?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Espacio <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData?.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    className={errors?.type ? 'border-red-300' : ''}
                  >
                    <option value="">Seleccionar tipo</option>
                    {spaceTypes?.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  {errors?.type && (
                    <p className="mt-1 text-sm text-red-600">{errors?.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Número de personas"
                    value={formData?.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e?.target?.value))}
                    className={errors?.capacity ? 'border-red-300' : ''}
                  />
                  {errors?.capacity && (
                    <p className="mt-1 text-sm text-red-600">{errors?.capacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Metros cuadrados"
                    value={formData?.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e?.target?.value))}
                    className={errors?.squareFootage ? 'border-red-300' : ''}
                  />
                  {errors?.squareFootage && (
                    <p className="mt-1 text-sm text-red-600">{errors?.squareFootage}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación Interna <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Ej: Planta Baja - Ala Este"
                    value={formData?.location}
                    onChange={(e) => handleInputChange('location', e?.target?.value)}
                    className={errors?.location ? 'border-red-300' : ''}
                  />
                  {errors?.location && (
                    <p className="mt-1 text-sm text-red-600">{errors?.location}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    placeholder="Describa las características especiales del espacio..."
                    value={formData?.description}
                    onChange={(e) => handleInputChange('description', e?.target?.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Equipment and Amenities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Equipamiento y Amenidades</h2>
              
              {/* Equipment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Equipos Médicos
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {equipmentOptions?.map(equipment => (
                    <label key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData?.equipment?.includes(equipment)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('equipment', [...formData?.equipment, equipment]);
                          } else {
                            handleInputChange('equipment', formData?.equipment?.filter(e => e !== equipment));
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{equipment}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Input
                    placeholder="Agregar equipo personalizado"
                    value={formData?.customEquipment}
                    onChange={(e) => handleInputChange('customEquipment', e?.target?.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (formData?.customEquipment?.trim()) {
                        handleInputChange('equipment', [...formData?.equipment, formData?.customEquipment?.trim()]);
                        handleInputChange('customEquipment', '');
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenidades
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {amenitiesList?.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData?.amenities?.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Input
                    placeholder="Agregar amenidad personalizada"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e?.target?.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomAmenity}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            </div>

            {/* Pricing and Availability */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tarifas y Disponibilidad</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa por Hora (USD) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    value={formData?.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', parseFloat(e?.target?.value))}
                    className={errors?.hourlyRate ? 'border-red-300' : ''}
                  />
                  {errors?.hourlyRate && (
                    <p className="mt-1 text-sm text-red-600">{errors?.hourlyRate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración Mínima (horas)
                  </label>
                  <Select
                    value={formData?.minimumBookingDuration}
                    onValueChange={(value) => handleInputChange('minimumBookingDuration', value)}
                  >
                    <option value="0.5">30 minutos</option>
                    <option value="1">1 hora</option>
                    <option value="1.5">1.5 horas</option>
                    <option value="2">2 horas</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Buffer (minutos)
                  </label>
                  <Select
                    value={formData?.bufferTime}
                    onValueChange={(value) => handleInputChange('bufferTime', value)}
                  >
                    <option value="0">Sin buffer</option>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                  </Select>
                </div>
              </div>

              {/* Default Hours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario Predeterminado - Inicio
                  </label>
                  <Input
                    type="time"
                    value={formData?.defaultHours?.start}
                    onChange={(e) => handleInputChange('defaultHours', {
                      ...formData?.defaultHours,
                      start: e?.target?.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horario Predeterminado - Fin
                  </label>
                  <Input
                    type="time"
                    value={formData?.defaultHours?.end}
                    onChange={(e) => handleInputChange('defaultHours', {
                      ...formData?.defaultHours,
                      end: e?.target?.value
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/clinic/spaces')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Icon name="Save" size={16} className="mr-2" />
                Guardar Espacio
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewSpaceRegistration;