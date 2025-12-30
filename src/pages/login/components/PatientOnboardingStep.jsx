import React, { useState } from "react";
import Button from "@/components/ui/Button";
import logo from "/assets/brand/logo-dark.svg"; // Importa el logo correctamente

// Lista de estados de Venezuela
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

const inputClasses =
  "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary";

// Este componente es para el onboarding de los pacientes
const PatientOnboardingStep = ({ onComplete, onBack }) => {
  const [name, setName] = useState("");
  const [patientState, setPatientState] = useState(""); // Estado donde se registra
  const [dob, setDob] = useState(""); // Para la fecha de nacimiento
  const [email, setEmail] = useState(""); // Para el correo electrónico
  const [allergies, setAllergies] = useState(""); // Alergias (si decides usar este campo)
  const [chronicConditions, setChronicConditions] = useState("");
  const [medications, setMedications] = useState("");

  const handleSubmit = () => {
    const data = {
      name,
      state: patientState,
      dob,
      email,
      allergies,
      chronicConditions,
      medications,
    };

    localStorage.setItem("patientProfile", JSON.stringify(data)); // Guarda temporalmente
    onComplete?.(); // Cuando termina el onboarding, redirige al dashboard
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-regular text-foreground text-center">
         Completa tu información para recibir la mejor atención personalizada
        y recomendaciones médicas.
      </h3>
     

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Nombre completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          placeholder="Nombre completo"
        />
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Fecha de nacimiento
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Correo electrónico */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          placeholder="Ej: ejemplo@correo.com"
        />
      </div>

      {/* Estado de Venezuela */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Estado donde vives
        </label>
        <select
          value={patientState}
          onChange={(e) => setPatientState(e.target.value)}
          className={inputClasses}
        >
          <option value="">Selecciona tu estado</option>
          {VZLA_STATES.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </div>

     

      {/* Enfermedades crónicas */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Enfermedades crónicas
        </label>
        <input
          type="text"
          value={chronicConditions}
          onChange={(e) => setChronicConditions(e.target.value)}
          className={inputClasses}
          placeholder="Ej: Hipertensión, diabetes..."
        />
      </div>

    
     

      <div className="flex gap-4 pt-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full py-2"
          type="button"
        >
          Volver
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          className="w-full py-2"
          type="button"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default PatientOnboardingStep;
