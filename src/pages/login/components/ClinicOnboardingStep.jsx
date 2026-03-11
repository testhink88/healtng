import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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

const CLINIC_CATEGORIES = {
  primary: { label: "Atención Primaria", description: "Consultorios, Medicina Familiar, Triaje básico.", services: [{ id: "consultations_gen", label: "Consultas Medicina General", type: "base", tag: "consultation" }, { id: "nursing", label: "Enfermería (Inyecciones, Curas)", type: "base", tag: "nursing" }] },
  secondary: { label: "Atención Secundaria", description: "Clínica con Quirófanos y Hospitalización.", services: [{ id: "hospitalization", label: "Hospitalización (Piso)", type: "base", tag: "hospitalization" }, { id: "surgery", label: "Quirófanos", type: "base", tag: "surgery" }] },
  ambulatory: { label: "Atención Ambulatoria", description: "Especialidades médicas sin pernocta.", services: [{ id: "specialist_consultation", label: "Consultas Especializadas", type: "base", tag: "consultation" }] },
  emergency: { label: "Atención de Emergencia", description: "Atención inmediata 24/7.", services: [{ id: "emergency_room", label: "Sala de Emergencia", type: "base", tag: "emergency" }] }
};

const inputClasses = "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary";

const ClinicOnboardingStep = ({ onComplete, onBack }) => {
  const { fetchProfile } = useAuth();
  const [loading, setLoading] = useState(false);
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
    sellsTo: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (clinicProfile.selectedCategories.length === 0) {
        setClinicProfile(prev => ({ ...prev, availableServices: [] }));
        return;
    }
    const merged = [];
    clinicProfile.selectedCategories.forEach(cat => {
      if (CLINIC_CATEGORIES[cat]) merged.push(...CLINIC_CATEGORIES[cat].services);
    });
    setClinicProfile(prev => ({ ...prev, availableServices: merged }));
  }, [clinicProfile.selectedCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: clinicProfile.clinicName,
          metadata: clinicProfile,
          onboarding_completed: true,
          role: 'clinic'
        });

      if (error) throw error;

      if (fetchProfile) await fetchProfile(user.id);

      setTimeout(() => {
        onComplete(clinicProfile);
      }, 600);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">Configuración de Clínica</h3>
        <p className="text-sm text-gray-500">Mapeo de servicios y perfil comercial.</p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={clinicProfile.clinicName}
          onChange={(e) => setClinicProfile({ ...clinicProfile, clinicName: e.target.value })}
          className={inputClasses}
          placeholder="Nombre de la Institución"
        />
        <select
          value={clinicProfile.clinicState}
          onChange={(e) => setClinicProfile({ ...clinicProfile, clinicState: e.target.value })}
          className={inputClasses}
        >
          <option value="">Selecciona Estado</option>
          {VZLA_STATES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
        </select>
        <input
            type="text"
            value={clinicProfile.phone}
            onChange={(e) => setClinicProfile({ ...clinicProfile, phone: e.target.value })}
            className={inputClasses}
            placeholder="Teléfono de Contacto"
        />
      </div>

      <div className="pt-2">
          <p className="text-xs font-bold mb-2 uppercase text-gray-400">Tipo de Centro:</p>
          <div className="grid grid-cols-2 gap-2">
              {Object.entries(CLINIC_CATEGORIES).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                        const exists = clinicProfile.selectedCategories.includes(key);
                        setClinicProfile({
                            ...clinicProfile,
                            selectedCategories: exists 
                                ? clinicProfile.selectedCategories.filter(k => k !== key)
                                : [...clinicProfile.selectedCategories, key]
                        });
                    }}
                    className={`p-2 text-xs border rounded-lg transition-all ${clinicProfile.selectedCategories.includes(key) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600'}`}
                  >
                      {config.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button variant="ghost" onClick={onBack} className="w-1/3" disabled={loading}>Atrás</Button>
        <Button variant="default" onClick={handleSubmit} className="w-2/3" disabled={loading}>
            {loading ? "Sincronizando..." : "Finalizar Configuración"}
        </Button>
      </div>
    </div>
  );
};

export default ClinicOnboardingStep;