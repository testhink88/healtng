import React, { useState } from "react";
import Button from "@/components/ui/Button";
import SpecialtyAutocomplete from "@/components/inputs/SpecialtyAutocomplete";
import { useProfessional } from "@/context/ProfessionalContext";
import { supabase } from "@/lib/supabase";

import { useAuth } from "@/context/AuthContext";

const VENEZUELA_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "La Guaira", "Lara", "Mérida", "Miranda", "Monagas",
  "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Yaracuy", "Zulia"
];

const inputStyle = "w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";

const DoctorOnboardingStep = ({ onComplete, onBack }) => {
  const { fetchProfile } = useAuth();
  const { login } = useProfessional();
  
  const [formData, setFormData] = useState({
    name: "",
    specialty_id: "",
    state: "",
    licenseNumber: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!formData.specialty_id) return alert("Debes seleccionar una especialidad válida");
    if (!formData.name || !formData.state || !formData.licenseNumber) {
      return alert("Todos los campos son obligatorios.");
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no encontrada");

      const metadata = {
        specialty_id: formData.specialty_id,
        state: formData.state,
        license: formData.licenseNumber
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: formData.name,
          metadata: metadata,
          onboarding_completed: true,
          role: 'doctor' // Normalizado
        });

      if (updateError) throw updateError;

      // Sincronizar contexto de Auth para que RoleGuard no rebote
      if (fetchProfile) await fetchProfile(user.id);

      // Sync local context for UI
      login({ ...formData, id: user.id });
      
      // Pequeño delay para asegurar que el estado se propague
      setTimeout(() => {
        onComplete();
      }, 600);
    } catch (err) {
      setError("Error al guardar en Supabase: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
         <h3 className="text-sm text-gray-600">Configura tu perfil profesional</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputStyle}
          placeholder="Nombre y apellido"
        />
      </div>
      <div className="z-50 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad principal</label>
        <SpecialtyAutocomplete onSelect={(id) => setFormData({ ...formData, specialty_id: id })} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado (Ubicación)</label>
        <select
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className={inputStyle}
        >
          <option value="" disabled>Selecciona un estado</option>
          {VENEZUELA_STATES.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de colegiado</label>
        <input
          type="text"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          className={inputStyle}
          placeholder="Ej: CM-12345"
        />
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
      <div className="flex gap-4 pt-2 border-t mt-4">
        <Button variant="ghost" onClick={onBack} className="w-full py-2" type="button" disabled={isSubmitting}>Volver</Button>
        <Button variant="default" onClick={handleSubmit} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white" type="button" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
};

export default DoctorOnboardingStep;