import React, { useState } from "react";
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

const inputClasses =
  "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary";

const PatientOnboardingStep = ({ onComplete, onBack }) => {
  const { fetchProfile } = useAuth();
  const [name, setName] = useState("");
  const [patientState, setPatientState] = useState("");
  const [dob, setDob] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const metadata = {
        state: patientState,
        dob,
        allergies,
        chronicConditions,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: name,
          metadata: metadata,
          onboarding_completed: true,
          role: 'patient'
        });

      if (error) throw error;

      if (fetchProfile) await fetchProfile(user.id);

      setTimeout(() => {
        onComplete?.();
      }, 600);
    } catch (err) {
      alert("Error al guardar perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-regular text-foreground text-center">
         Completa tu información para recibir la mejor atención personalizada.
      </h3>

      <div>
        <label className="block text-sm font-medium text-foreground">Nombre completo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          placeholder="Tu nombre real"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Fecha de nacimiento</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Estado donde vives</label>
        <select
          value={patientState}
          onChange={(e) => setPatientState(e.target.value)}
          className={inputClasses}
        >
          <option value="">Selecciona tu estado</option>
          {VZLA_STATES.map((st) => (
            <option key={st.value} value={st.value}>{st.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Condiciones crónicas / Alergias</label>
        <input
          type="text"
          value={chronicConditions}
          onChange={(e) => setChronicConditions(e.target.value)}
          className={inputClasses}
          placeholder="Ej: Hipertensión, Penicilina..."
        />
      </div>

      <div className="flex gap-4 pt-2">
        <Button variant="ghost" onClick={onBack} className="w-full py-2" type="button" disabled={loading}>
          Volver
        </Button>
        <Button variant="default" onClick={handleSubmit} className="w-full py-2" type="button" disabled={loading}>
          {loading ? "Guardando..." : "Finalizar Registro"}
        </Button>
      </div>
    </div>
  );
};

export default PatientOnboardingStep;
