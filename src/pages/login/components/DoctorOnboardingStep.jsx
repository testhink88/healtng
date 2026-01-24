// src/pages/login/components/DoctorOnboardingStep.jsx
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import SpecialtyAutocomplete from "@/components/inputs/SpecialtyAutocomplete";
import { useProfessional } from "@/context/ProfessionalContext";

// Lista de Estados de Venezuela
const VENEZUELA_STATES = [
  "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar",
  "Carabobo", "Cojedes", "Delta Amacuro", "Distrito Capital", "Falcón",
  "Guárico", "La Guaira", "Lara", "Mérida", "Miranda", "Monagas",
  "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo",
  "Yaracuy", "Zulia"
];

// Estilos unificados para asegurar fondo blanco y texto oscuro
const inputStyle = "w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent";

const DoctorOnboardingStep = ({ onComplete, onBack }) => {
  const { login } = useProfessional();
  
  const [formData, setFormData] = useState({
    name: "",
    specialty_id: "",
    state: "", // Cambiamos 'city' por 'state'
    licenseNumber: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.specialty_id) return alert("Debes seleccionar una especialidad válida");
    if (!formData.name || !formData.state || !formData.licenseNumber) {
      return alert("Todos los campos son obligatorios.");
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = { ...formData, id: "doc_" + Date.now() };

      // Guardar sesión globalmente
      login(payload);
      
      // Continuar flujo
      onComplete(payload);  
    } catch (err) {
      setError("Ocurrió un error al guardar los datos. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
         <h3 className="text-sm text-gray-600">
           Configura tu perfil profesional
         </h3>
      </div>

      {/* Nombre Completo */}
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

      {/* Especialidad (Autocomplete) */}
      <div className="z-50 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad principal</label>
        {/* Nota: Asegúrate que SpecialtyAutocomplete acepte className o tenga estilos compatibles. 
            Si se ve oscuro, tendrás que editar ese componente también. */}
        <SpecialtyAutocomplete 
          onSelect={(id) => setFormData({ ...formData, specialty_id: id })} 
        />
      </div>

      {/* Selector de Estados de Venezuela */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado (Ubicación)</label>
        <div className="relative">
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className={`${inputStyle} appearance-none`} // appearance-none para estilizar mejor
          >
            <option value="" disabled>Selecciona un estado</option>
            {VENEZUELA_STATES.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {/* Flecha del select personalizada (opcional para mejor estética) */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Número de colegiado */}
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

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

      {/* Botones de navegación */}
      <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="w-full py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
          type="button"
        >
          Volver
        </Button>
        <Button 
          variant="default" 
          onClick={handleSubmit} 
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
          type="button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
};

export default DoctorOnboardingStep;