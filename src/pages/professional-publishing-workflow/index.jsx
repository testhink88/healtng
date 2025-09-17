import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { getBusinessContext } from "../../utils/mockData";

// Step Components
const DetailsStep = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!data?.title?.trim()) newErrors.title = "Título es requerido";
    if (!data?.category) newErrors.category = "Categoría es requerida";
    if (!data?.type) newErrors.type = "Tipo es requerido";
    if (!data?.price || data?.price <= 0) newErrors.price = "Precio debe ser mayor a 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Detalles del Producto/Servicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Título *</label>
            <Input
              value={data?.title || ""}
              onChange={(e) => onChange({ title: e?.target?.value })}
              placeholder="Ej: Consulta General, Omeprazol 20mg, Lente Monofocal"
              className={errors?.title ? "border-red-500" : ""}
            />
            {errors?.title && <p className="text-red-500 text-sm mt-1">{errors?.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Categoría *</label>
            <select
              value={data?.category || ""}
              onChange={(e) => onChange({ category: e?.target?.value })}
              className={`w-full px-3 py-2 border rounded-lg ${errors?.category ? "border-red-500" : "border-input"}`}
            >
              <option value="">Seleccionar categoría</option>
              <option value="Medicamento">Medicamento</option>
              <option value="Servicio">Servicio</option>
              <option value="Reactivo">Reactivo</option>
              <option value="Óptica">Óptica</option>
              <option value="Equipo">Equipo Médico</option>
              <option value="Insumo">Insumo</option>
              <option value="Plan">Plan de Seguro</option>
            </select>
            {errors?.category && <p className="text-red-500 text-sm mt-1">{errors?.category}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo *</label>
            <select
              value={data?.type || ""}
              onChange={(e) => onChange({ type: e?.target?.value })}
              className={`w-full px-3 py-2 border rounded-lg ${errors?.type ? "border-red-500" : "border-input"}`}
            >
              <option value="">Seleccionar tipo</option>
              <option value="Producto">Producto</option>
              <option value="Servicio">Servicio</option>
            </select>
            {errors?.type && <p className="text-red-500 text-sm mt-1">{errors?.type}</p>}
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">Unidad</label>
            <select
              value={data?.unit || ""}
              onChange={(e) => onChange({ unit: e?.target?.value })}
              className="w-full px-3 py-2 border border-input rounded-lg"
            >
              <option value="unidad">Unidad</option>
              <option value="blister">Blister</option>
              <option value="caja">Caja</option>
              <option value="frasco">Frasco</option>
              <option value="kit">Kit</option>
              <option value="par">Par</option>
              <option value="consulta">Consulta</option>
              <option value="examen">Examen</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Precio (USD) *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={data?.price || ""}
              onChange={(e) => onChange({ price: parseFloat(e?.target?.value) || 0 })}
              placeholder="0.00"
              className={errors?.price ? "border-red-500" : ""}
            />
            {errors?.price && <p className="text-red-500 text-sm mt-1">{errors?.price}</p>}
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Disponibilidad</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data?.negotiable || false}
                  onChange={(e) => onChange({ negotiable: e?.target?.checked })}
                  className="mr-2"
                />
                Precio negociable
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data?.available || true}
                  onChange={(e) => onChange({ available: e?.target?.checked })}
                  className="mr-2"
                />
                Disponible ahora
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleNext}>
          Siguiente: Medios
          <Icon name="ChevronRight" className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const MediaStep = ({ data, onChange, onNext, onBack }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const validFiles = files?.filter(file => 
      file?.type?.startsWith('image/') && file?.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    onChange({ 
      images: [...(data?.images || []), ...validFiles?.slice(0, 5 - (data?.images?.length || 0))]
    });
  };

  const handleFileInput = (e) => {
    const files = Array.from(e?.target?.files);
    const validFiles = files?.filter(file => 
      file?.type?.startsWith('image/') && file?.size <= 5 * 1024 * 1024
    );
    
    onChange({ 
      images: [...(data?.images || []), ...validFiles?.slice(0, 5 - (data?.images?.length || 0))]
    });
  };

  const removeImage = (index) => {
    const newImages = [...(data?.images || [])];
    newImages?.splice(index, 1);
    onChange({ images: newImages });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Medios y Documentación</h2>
        
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Imágenes (máx. 5)</label>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Icon name="Upload" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              PNG, JPG hasta 5MB cada una
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              Seleccionar Archivos
            </Button>
          </div>
        </div>

        {/* Image Preview */}
        {data?.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {data?.images?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            value={data?.description || ""}
            onChange={(e) => onChange({ description: e?.target?.value })}
            placeholder="Describe tu producto o servicio..."
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-lg resize-none"
          />
        </div>

        {/* Basic validations */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <Icon name="CheckCircle" className="h-4 w-4 text-green-600 mr-2" />
            Validaciones Básicas
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>✓ Imágenes en formato válido</li>
            <li>✓ Tamaño de archivos dentro del límite</li>
            <li>✓ Información completa del producto/servicio</li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <Icon name="ChevronLeft" className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button onClick={onNext}>
          Siguiente: Inventario
          <Icon name="ChevronRight" className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const InventoryStep = ({ data, onChange, onNext, onBack }) => {
  const isProduct = data?.type === "Producto";
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {isProduct ? "Inventario y Políticas" : "Agenda y Configuración"}
        </h2>
        
        {isProduct ? (
          // Product Configuration
          (<div className="space-y-6">
            {/* Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Disponible</label>
                <Input
                  type="number"
                  min="0"
                  value={data?.stock || 0}
                  onChange={(e) => onChange({ stock: parseInt(e?.target?.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock Mínimo</label>
                <Input
                  type="number"
                  min="0"
                  value={data?.minStock || 0}
                  onChange={(e) => onChange({ minStock: parseInt(e?.target?.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            {/* Sales Channels */}
            <div>
              <label className="block text-sm font-medium mb-2">Canales de Venta</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data?.b2c || false}
                    onChange={(e) => onChange({ b2c: e?.target?.checked })}
                    className="mr-2"
                  />
                  B2C - Venta directa al público
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data?.b2b || false}
                    onChange={(e) => onChange({ b2b: e?.target?.checked })}
                    className="mr-2"
                  />
                  B2B - Venta a empresas/clínicas
                </label>
              </div>
            </div>
            {/* Policies */}
            <div>
              <label className="block text-sm font-medium mb-2">Políticas</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Tiempo de entrega (días)</label>
                  <Input
                    type="number"
                    min="0"
                    value={data?.deliveryDays || 1}
                    onChange={(e) => onChange({ deliveryDays: parseInt(e?.target?.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Descuento máximo (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={data?.maxDiscount || 0}
                    onChange={(e) => onChange({ maxDiscount: parseFloat(e?.target?.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            {/* Taxes */}
            <div>
              <label className="block text-sm font-medium mb-2">Impuestos</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data?.taxIncluded || false}
                    onChange={(e) => onChange({ taxIncluded: e?.target?.checked })}
                    className="mr-2"
                  />
                  Precio incluye impuestos
                </label>
                {data?.taxIncluded && (
                  <div className="ml-6">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={data?.taxRate || 16}
                      onChange={(e) => onChange({ taxRate: parseFloat(e?.target?.value) || 16 })}
                      placeholder="16.00"
                      className="w-32"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">%</span>
                  </div>
                )}
              </div>
            </div>
          </div>)
        ) : (
          // Service Configuration
          (<div className="space-y-6">
            {/* Service Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duración (minutos)</label>
                <select
                  value={data?.duration || 30}
                  onChange={(e) => onChange({ duration: parseInt(e?.target?.value) })}
                  className="w-full px-3 py-2 border border-input rounded-lg"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1.5 horas</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Precio Promocional</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={data?.promoPrice || ""}
                  onChange={(e) => onChange({ promoPrice: parseFloat(e?.target?.value) || null })}
                  placeholder="Precio con descuento"
                />
              </div>
            </div>
            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium mb-2">Horarios Disponibles</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]?.map((time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data?.availableSlots?.includes(time) || false}
                      onChange={(e) => {
                        const slots = data?.availableSlots || [];
                        if (e?.target?.checked) {
                          onChange({ availableSlots: [...slots, time] });
                        } else {
                          onChange({ availableSlots: slots?.filter(s => s !== time) });
                        }
                      }}
                      className="mr-2"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>
            {/* Professionals */}
            <div>
              <label className="block text-sm font-medium mb-2">Profesionales Elegibles</label>
              <div className="space-y-2">
                {["Dr. María García", "Dr. Carlos López", "Dra. Ana Rodríguez"]?.map((prof) => (
                  <label key={prof} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data?.eligibleProfessionals?.includes(prof) || false}
                      onChange={(e) => {
                        const profs = data?.eligibleProfessionals || [];
                        if (e?.target?.checked) {
                          onChange({ eligibleProfessionals: [...profs, prof] });
                        } else {
                          onChange({ eligibleProfessionals: profs?.filter(p => p !== prof) });
                        }
                      }}
                      className="mr-2"
                    />
                    {prof}
                  </label>
                ))}
              </div>
            </div>
          </div>)
        )}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <Icon name="ChevronLeft" className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button onClick={onNext}>
          Siguiente: Revisión
          <Icon name="ChevronRight" className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const ReviewStep = ({ data, onBack, onPublish }) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage mock catalog
      const businessContext = getBusinessContext();
      const existingCatalog = JSON.parse(localStorage.getItem(`mock:catalog:${businessContext?.businessType}`) || "[]");
      
      const newProduct = {
        id: `PUB-${Date.now()}`,
        sku: `${data?.type === 'Producto' ? 'PROD' : 'SERV'}-${String(existingCatalog?.length + 1)?.padStart(3, '0')}`,
        name: data?.title,
        category: data?.category,
        unit: data?.unit,
        price: data?.price,
        stock: data?.stock || 0,
        b2c: data?.b2c || false,
        b2b: data?.b2b || false,
        published: true,
        createdAt: new Date()?.toISOString()
      };
      
      const updatedCatalog = [...existingCatalog, newProduct];
      localStorage.setItem(`mock:catalog:${businessContext?.businessType}`, JSON.stringify(updatedCatalog));
      
      onPublish(newProduct);
    } catch (error) {
      console.error("Error publishing:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Revisión y Publicar</h2>
        
        {/* Summary Card */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{data?.title}</h3>
              <p className="text-muted-foreground">{data?.category} • {data?.type}</p>
              <p className="text-2xl font-bold text-primary mt-2">${data?.price} / {data?.unit}</p>
            </div>
            {data?.images?.length > 0 && (
              <img
                src={URL.createObjectURL(data?.images?.[0])}
                alt="Product preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
          </div>

          {data?.description && (
            <div>
              <h4 className="font-medium mb-2">Descripción</h4>
              <p className="text-muted-foreground">{data?.description}</p>
            </div>
          )}

          {/* Configuration Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {data?.type === "Producto" ? (
              <>
                <div>
                  <p className="text-sm font-medium">Stock Disponible</p>
                  <p className="text-muted-foreground">{data?.stock || 0} unidades</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Canales de Venta</p>
                  <p className="text-muted-foreground">
                    {[data?.b2c && "B2C", data?.b2b && "B2B"]?.filter(Boolean)?.join(", ") || "Ninguno"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tiempo de Entrega</p>
                  <p className="text-muted-foreground">{data?.deliveryDays || 1} días</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Precio Negociable</p>
                  <p className="text-muted-foreground">{data?.negotiable ? "Sí" : "No"}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium">Duración</p>
                  <p className="text-muted-foreground">{data?.duration || 30} minutos</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Horarios Disponibles</p>
                  <p className="text-muted-foreground">
                    {data?.availableSlots?.length || 0} slots configurados
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Profesionales</p>
                  <p className="text-muted-foreground">
                    {data?.eligibleProfessionals?.length || 0} asignados
                  </p>
                </div>
                {data?.promoPrice && (
                  <div>
                    <p className="text-sm font-medium">Precio Promocional</p>
                    <p className="text-muted-foreground">${data?.promoPrice}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Publication Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start">
            <Icon name="Info" className="h-5 w-5 text-primary mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-primary">Listo para Publicar</h4>
              <p className="text-sm text-primary/80 mt-1">
                Tu {data?.type?.toLowerCase()} será visible en la tienda una vez publicado. 
                Podrás editarlo o desactivarlo en cualquier momento desde el panel de productos.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isPublishing}>
          <Icon name="ChevronLeft" className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing}>
          {isPublishing ? (
            <>
              <Icon name="Loader" className="h-4 w-4 mr-2 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Icon name="Upload" className="h-4 w-4 mr-2" />
              Publicar en Tienda
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Main Component
const ProfessionalPublishingWorkflow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    unit: "unidad",
    price: 0,
    negotiable: false,
    available: true,
    images: [],
    description: "",
    stock: 0,
    minStock: 0,
    b2c: false,
    b2b: false,
    deliveryDays: 1,
    maxDiscount: 0,
    taxIncluded: false,
    taxRate: 16,
    duration: 30,
    promoPrice: null,
    availableSlots: [],
    eligibleProfessionals: []
  });

  const steps = [
    { key: "details", title: "Detalles", icon: "FileText" },
    { key: "media", title: "Medios", icon: "Image" },
    { key: "inventory", title: "Configuración", icon: "Package" },
    { key: "review", title: "Revisar", icon: "CheckCircle" }
  ];

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = (publishedProduct) => {
    // Show success message and redirect
    navigate("/provider/products", {
      state: { 
        message: `${publishedProduct?.name} se ha publicado exitosamente`,
        type: "success"
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <DetailsStep
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <MediaStep
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <InventoryStep
            data={formData}
            onChange={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ReviewStep
            data={formData}
            onBack={prevStep}
            onPublish={handlePublish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            {id ? "Editar Publicación" : "Nueva Publicación"}
          </h1>
          <p className="text-muted-foreground">
            Workflow profesional para publicar productos y servicios
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/provider/products")}>
          <Icon name="X" className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps?.map((step, index) => (
            <div
              key={step?.key}
              className={`flex items-center ${
                index < steps?.length - 1 ? "flex-1" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground bg-background text-muted-foreground"
                }`}
              >
                <Icon name={step?.icon} className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step?.title}
                </p>
              </div>
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? "bg-primary" : "bg-border"
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
          />
        </div>
      </div>
      {/* Step Content */}
      <div className="bg-card rounded-lg border p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default ProfessionalPublishingWorkflow;