import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// ==========================================
// 1. CONSTANTES: ESTADOS DE VENEZUELA
// ==========================================
const VZLA_STATES = [
  { value: "amazonas", label: "Amazonas" },
  { value: "anzoategui", label: "Anzoátegui" },
  { value: "apure", label: "Apure" },
  { value: "aragua", label: "Aragua" },
  { value: "barinas", label: "Barinas" },
  { value: "bolivar", label: "Bolívar" },
  { value: "carabobo", label: "Carabobo" },
  { value: "cojedes", label: "Cojedes" },
  { value: "delta-amacuro", label: "Delta Amacuro" },
  { value: "falcon", label: "Falcón" },
  { value: "guarico", label: "Guárico" },
  { value: "lara", label: "Lara" },
  { value: "merida", label: "Mérida" },
  { value: "miranda", label: "Miranda" },
  { value: "monagas", label: "Monagas" },
  { value: "nueva-esparta", label: "Nueva Esparta" },
  { value: "portuguesa", label: "Portuguesa" },
  { value: "sucre", label: "Sucre" },
  { value: "tachira", label: "Táchira" },
  { value: "trujillo", label: "Trujillo" },
  { value: "vargas", label: "Vargas / La Guaira" },
  { value: "yaracuy", label: "Yaracuy" },
  { value: "zulia", label: "Zulia" },
];

// ==========================================
// 2. CONFIGURACIÓN DE SERVICIOS
// ==========================================
const CLINIC_CATEGORIES = {
  primary: {
    label: "Atención Primaria",
    description: "Consultorios, Medicina Familiar, Triaje básico.",
    services: [
      { id: "consultations_gen", label: "Consultas Medicina General", type: "base", tag: "consultation" },
      { id: "nursing", label: "Enfermería (Inyecciones, Curas)", type: "base", tag: "nursing" },
      { id: "vaccination", label: "Vacunación", type: "extra", tag: "prevention" },
      { id: "home_care", label: "Atención Médica a Domicilio", type: "extra", tag: "visit" },
    ]
  },
  secondary: {
    label: "Atención Secundaria (Hospital General)",
    description: "Clínica con Quirófanos y Hospitalización.",
    services: [
      { id: "hospitalization", label: "Hospitalización (Piso)", type: "base", tag: "hospitalization" },
      { id: "surgery", label: "Quirófanos", type: "base", tag: "surgery" },
      { id: "lab_24h", label: "Laboratorio Clínico", type: "base", tag: "lab" },
      { id: "imaging", label: "Imagenología (Rayos X, Eco)", type: "base", tag: "imaging" },
    ]
  },
  tertiary: {
    label: "Atención Terciaria (Alta Especialidad)",
    description: "Unidades de alta complejidad (UCI, Oncología).",
    services: [
      { id: "icu", label: "Unidad de Cuidados Intensivos (UCI)", type: "base", tag: "hospitalization" },
      { id: "complex_surgery", label: "Cirugía de Alta Complejidad", type: "base", tag: "surgery" },
      { id: "hemodynamics", label: "Hemodinamia / Cardiología Interv.", type: "extra", tag: "surgery" },
      { id: "oncology", label: "Unidad de Oncología/Quimio", type: "extra", tag: "treatment" },
    ]
  },
  ambulatory: {
    label: "Atención Ambulatoria (Consultas Externas)",
    description: "Especialidades médicas sin pernocta.",
    services: [
      { id: "specialist_consultation", label: "Consultas Especializadas (Cardio, Gineco, etc.)", type: "base", tag: "consultation" },
      { id: "telemedicine", label: "Telemedicina / Consulta Virtual", type: "extra", tag: "digital" },
      { id: "dental", label: "Unidad Odontológica", type: "extra", tag: "consultation" },
      { id: "checkups", label: "Paquetes de Chequeo Preventivo (Check-ups)", type: "extra", tag: "business" },
    ]
  },
  inpatient: {
    label: "Atención Hospitalaria (Internamiento)",
    description: "Enfoque en estadía y recuperación.",
    services: [
      { id: "bed_management", label: "Gestión de Camas/Habitaciones", type: "base", tag: "admin" },
      { id: "clinical_nutrition", label: "Nutrición y Dietética Hospitalaria", type: "base", tag: "treatment" },
    ]
  },
  emergency: {
    label: "Atención de Emergencia y Urgencia",
    description: "Atención inmediata 24/7.",
    services: [
      { id: "emergency_room", label: "Sala de Emergencia y Shock Trauma", type: "base", tag: "emergency" },
      { id: "ambulance", label: "Traslados en Ambulancia", type: "extra", tag: "transport" },
      { id: "trauma_urgency", label: "Traumatología de Urgencia (Yesos)", type: "extra", tag: "surgery" },
    ]
  },
  "mental-health": {
    label: "Salud Mental",
    description: "Psiquiatría y Psicología.",
    services: [
      { id: "psychology", label: "Consultas Psicología/Psiquiatría", type: "base", tag: "consultation" },
      { id: "addictions", label: "Manejo de Adicciones", type: "extra", tag: "treatment" },
    ]
  },
  rehabilitation: {
    label: "Rehabilitación",
    description: "Recuperación física y terapias.",
    services: [
      { id: "physiotherapy", label: "Fisioterapia y Kinesiología", type: "base", tag: "rehab" },
      { id: "occupational", label: "Terapia Ocupacional", type: "extra", tag: "rehab" },
    ]
  },
  residential: {
    label: "Cuidado a Largo Plazo (Geriátrico)",
    description: "Residencias para adultos mayores.",
    services: [
      { id: "geriatric_nursing", label: "Enfermería Geriátrica 24h", type: "base", tag: "nursing" },
      { id: "assisted_living", label: "Alojamiento Asistido", type: "base", tag: "hospitalization" },
    ]
  },
  "social-community": {
    label: "Atención Social y Comunitaria",
    description: "Fundaciones y salud pública.",
    services: [
      { id: "social_work", label: "Trabajo Social", type: "base", tag: "admin" },
      { id: "health_drives", label: "Jornadas de Salud (Operativos)", type: "extra", tag: "prevention" },
    ]
  },
  private: {
    label: "Gestión Privada (Administrativa)",
    description: "Seguros, Alquileres y Negocios.",
    services: [
      { id: "insurance_agreements", label: "Gestión de Seguros y Baremos", type: "base", tag: "admin" },
      { id: "memberships", label: "Gestión de Membresías y Descuentos", type: "extra", tag: "business" },
      { id: "rental_spaces", label: "Alquiler de Consultorios a Terceros", type: "extra", tag: "real_estate" },
    ]
  },
  public: {
    label: "Gestión Pública",
    description: "Entes gubernamentales.",
    services: [
      { id: "epi_reports", label: "Reportes Epidemiológicos Oficiales", type: "base", tag: "admin" },
    ]
  }
};

const inputClasses =
  "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary";

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
const ClinicOnboardingStep = ({ onComplete, onBack }) => {
  const [clinicProfile, setClinicProfile] = useState({
    clinicName: '',
    phone: '',
    address: '',
    clinicState: '',
    selectedCategories: [],     
    selectedServiceIds: [],     
    availableServices: [], 
    actsAsProvider: false,
    actsAsBuyer: false,
    sellsTo: '' // Ahora es string vacío por defecto
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica de Fusión de Servicios
  useEffect(() => {
    if (clinicProfile.selectedCategories.length === 0) {
        setClinicProfile(prev => ({ ...prev, availableServices: [] }));
        return;
    }

    const mergedServices = [];
    const baseIdsToSelect = [];

    clinicProfile.selectedCategories.forEach((catKey) => {
      const config = CLINIC_CATEGORIES[catKey];
      if (config) {
        mergedServices.push(...config.services);
      }
    });

    const uniqueServicesMap = new Map();
    mergedServices.forEach((service) => {
      if (!uniqueServicesMap.has(service.id)) {
        uniqueServicesMap.set(service.id, service);
        if (service.type === 'base') {
          baseIdsToSelect.push(service.id);
        }
      }
    });

    setClinicProfile((prev) => ({
      ...prev,
      availableServices: Array.from(uniqueServicesMap.values()),
      selectedServiceIds: [...new Set([...prev.selectedServiceIds, ...baseIdsToSelect])],
    }));

  }, [clinicProfile.selectedCategories]);

  // Handlers
  const handleCategoryToggle = (catKey) => {
    setClinicProfile((prev) => {
      const newSelectedCategories = prev.selectedCategories.includes(catKey)
        ? prev.selectedCategories.filter((key) => key !== catKey)
        : [...prev.selectedCategories, catKey];
      return { ...prev, selectedCategories: newSelectedCategories };
    });
  };

  const removeCategory = (catKey, e) => {
      e.stopPropagation();
      handleCategoryToggle(catKey);
  }

  const handleServiceToggle = (serviceId) => {
    setClinicProfile((prev) => {
      const newSelectedServiceIds = prev.selectedServiceIds.includes(serviceId)
        ? prev.selectedServiceIds.filter((id) => id !== serviceId)
        : [...prev.selectedServiceIds, serviceId];
      return { ...prev, selectedServiceIds: newSelectedServiceIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedObjects = clinicProfile.availableServices.filter((s) =>
      clinicProfile.selectedServiceIds.includes(s.id)
    );
    
    const derivedFlags = {
      hasConsultations: selectedObjects.some((s) => s.tag === 'consultation'),
      hasTelemedicine: selectedObjects.some((s) => s.tag === 'digital'),
      hasLab: selectedObjects.some((s) => s.tag === 'lab'),
      hasImaging: selectedObjects.some((s) => s.tag === 'imaging'),
      hasSurgery: selectedObjects.some((s) => s.tag === 'surgery'),
      hasEmergency: selectedObjects.some((s) => s.tag === 'emergency'),
      hasBusinessServices: selectedObjects.some((s) => s.tag === 'business' || s.tag === 'real_estate'),
    };

    const finalProfile = {
      ...clinicProfile,
      ...derivedFlags,
    };

    localStorage.setItem("clinicProfile", JSON.stringify(finalProfile));
    onComplete(finalProfile);
  };

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div className="text-center pb-2">
        <h3 className="text-xl font-medium text-foreground">Configuración del Centro</h3>
        <p className="text-sm text-gray-500">Define el perfil operativo y comercial.</p>
      </div>

      {/* DATOS BÁSICOS */}
      <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
        <input
          type="text"
          value={clinicProfile.clinicName}
          onChange={(e) => setClinicProfile({ ...clinicProfile, clinicName: e.target.value })}
          className={inputClasses}
          placeholder="Nombre Legal o Comercial"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={clinicProfile.clinicState}
            onChange={(e) => setClinicProfile({ ...clinicProfile, clinicState: e.target.value })}
            className={inputClasses}
          >
            <option value="">Estado</option>
            {VZLA_STATES.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={clinicProfile.phone}
            onChange={(e) => setClinicProfile({ ...clinicProfile, phone: e.target.value })}
            className={inputClasses}
            placeholder="Teléfono"
          />
        </div>
        <input
            type="text"
            value={clinicProfile.address}
            onChange={(e) => setClinicProfile({ ...clinicProfile, address: e.target.value })}
            className={inputClasses}
            placeholder="Dirección"
          />
      </div>

      {/* SELECTOR DE CATEGORÍAS */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-foreground mb-1">
          Tipo de Centro (Selección Múltiple)
        </label>

        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            min-h-[46px] w-full px-3 py-2 rounded-md border bg-white cursor-pointer flex flex-wrap gap-2 items-center transition-all
            ${isDropdownOpen ? 'ring-2 ring-primary/60 border-primary' : 'border-border hover:border-gray-400'}
          `}
        >
          {clinicProfile.selectedCategories.length === 0 && (
            <span className="text-gray-400 text-sm italic">Selecciona opciones...</span>
          )}

          {clinicProfile.selectedCategories.map((catKey) => (
            <span key={catKey} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium px-2 py-1 rounded-full flex items-center">
              {CLINIC_CATEGORIES[catKey]?.label}
              <button
                onClick={(e) => removeCategory(catKey, e)}
                className="ml-1.5 text-blue-400 hover:text-red-500 focus:outline-none font-bold"
              >
                ×
              </button>
            </span>
          ))}

          <div className="ml-auto text-gray-400">
             <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-72 overflow-y-auto">
            {Object.entries(CLINIC_CATEGORIES).map(([key, config]) => {
              const isSelected = clinicProfile.selectedCategories.includes(key);
              return (
                <div
                  key={key}
                  onClick={() => handleCategoryToggle(key)}
                  className={`
                    px-4 py-2.5 text-sm cursor-pointer border-b last:border-0 flex justify-between items-center transition-colors
                    ${isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'}
                  `}
                >
                    <div>
                        <span className={`block ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                            {config.label}
                        </span>
                        <span className="text-xs text-gray-400">{config.description}</span>
                    </div>
                    {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LISTA DE SERVICIOS */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all">
        <div className="flex justify-between items-center mb-3">
             <label className="text-sm font-bold text-gray-700">Servicios a habilitar</label>
             <span className="text-xs bg-white px-2 py-0.5 rounded border text-gray-500">
                {clinicProfile.selectedServiceIds.length} activos
             </span>
        </div>
        
        {(!clinicProfile.availableServices || clinicProfile.availableServices.length === 0) ? (
            <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded bg-white/50">
                <p className="text-sm text-gray-400 italic">Define el tipo de centro arriba para ver las opciones.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {clinicProfile.availableServices.map((service) => (
                <label
                key={service.id}
                className={`
                    flex items-center p-2 rounded cursor-pointer text-sm border select-none transition-all
                    ${clinicProfile.selectedServiceIds.includes(service.id) 
                        ? 'bg-white border-primary shadow-sm' 
                        : 'border-transparent hover:bg-white hover:border-gray-200 text-gray-500'}
                `}
                >
                <input
                    type="checkbox"
                    checked={clinicProfile.selectedServiceIds.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    // AJUSTE CHECKBOX BLANCO: bg-white forzado y text-blue-600
                    className="rounded text-blue-600 focus:ring-blue-500 mr-2 h-4 w-4 border-gray-300 bg-white"
                />
                {service.label}
                </label>
            ))}
            </div>
        )}
      </div>

      {/* ROL COMERCIAL (AJUSTADO) */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
          <label className="text-sm text-gray-700 font-bold block">Perfil Comercial en Healtng:</label>
          
          <div className="space-y-2">
            {/* Opción VENDER + Dropdown */}
            <div className="flex flex-col">
                <label className="flex items-center text-sm cursor-pointer hover:text-primary transition-colors mb-1">
                    <input 
                        type="checkbox" 
                        checked={clinicProfile.actsAsProvider} 
                        onChange={() => setClinicProfile({ ...clinicProfile, actsAsProvider: !clinicProfile.actsAsProvider })} 
                        className="mr-2 rounded text-blue-600 border-gray-300 h-4 w-4 bg-white"
                    />
                    Vender productos o servicios (Proveedor)
                </label>
                
                {/* Dropdown condicional */}
                {clinicProfile.actsAsProvider && (
                    <div className="ml-6 animate-in fade-in slide-in-from-top-1">
                        <select
                            value={clinicProfile.sellsTo}
                            onChange={(e) => setClinicProfile({ ...clinicProfile, sellsTo: e.target.value })}
                            className="w-full text-sm border border-gray-300 rounded-md p-2 bg-gray-50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                            <option value="" disabled>Selecciona el tipo de cliente...</option>
                            <option value="b2c">Consumidor final (Pacientes)</option>
                            <option value="b2b">Empresas (Aseguradoras/Clínicas)</option>
                            <option value="both">Ambos (Mixto)</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Opción COMPRAR */}
            <label className="flex items-center text-sm cursor-pointer hover:text-primary transition-colors">
                <input 
                    type="checkbox" 
                    checked={clinicProfile.actsAsBuyer} 
                    onChange={() => setClinicProfile({ ...clinicProfile, actsAsBuyer: !clinicProfile.actsAsBuyer })} 
                    className="mr-2 rounded text-blue-600 border-gray-300 h-4 w-4 bg-white"
                />
                Comprar productos o servicios (Proveedores B2B)
            </label>
          </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack} className="w-1/3">Atrás</Button>
        <Button variant="default" onClick={handleSubmit} className="w-2/3">Guardar y Continuar</Button>
      </div>
    </div>
  );
};

export default ClinicOnboardingStep;