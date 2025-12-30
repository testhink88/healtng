import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// === Especialidades médicas basadas en SPECIALTY_DIAGNOSIS_SCHEMAS ===
const SPECIALTIES = [
  // Medicina general e interna
  { value: "GEN", label: "Medicina General / Médico Integral" },
  { value: "INT", label: "Medicina Interna" },
  { value: "FAM", label: "Medicina Familiar y Comunitaria" },
  { value: "PREV", label: "Medicina Preventiva y Salud Pública" },
  { value: "EME", label: "Urgencias / Emergenciología" },
  { value: "GERI", label: "Geriatría" },
  { value: "PALI", label: "Cuidados Paliativos" },

  // Especialidades quirúrgicas
  { value: "SURG", label: "Cirugía General" },
  { value: "ORTO", label: "Traumatología y Ortopedia" },
  { value: "CAR", label: "Cirugía Cardiovascular" },
  { value: "PEDSUR", label: "Cirugía Pediátrica" },
  { value: "ONCO_SURG", label: "Cirugía Oncológica" },
  { value: "PLAS", label: "Cirugía Plástica y Reconstructiva" },
  { value: "BARI", label: "Cirugía Bariátrica" },
  { value: "TORA", label: "Cirugía de Tórax" },
  { value: "COLO", label: "Coloproctología" },
  { value: "NEURO_SURG", label: "Neurocirugía" },
  { value: "MAX", label: "Cirugía Maxilofacial" },
  { value: "MANO", label: "Cirugía de Mano" },
  { value: "URO", label: "Urología" },

  // Ginecología y obstetricia
  { value: "GYN", label: "Ginecología" },
  { value: "OB", label: "Obstetricia" },
  { value: "REPRO", label: "Medicina Reproductiva / Fertilidad" },
  { value: "PERI", label: "Perinatología / Medicina Materno-Fetal" },

  // Pediatría y subespecialidades
  { value: "PED", label: "Pediatría General" },
  { value: "NEON", label: "Neonatología" },
  { value: "PEDCR", label: "Pediatría Crítica" },
  { value: "CARPED", label: "Cardiología Pediátrica" },
  { value: "NEUPED", label: "Neuropediatría" },
  { value: "ENDOPE", label: "Endocrinología Pediátrica" },
  { value: "GASTPED", label: "Gastroenterología Pediátrica" },
  { value: "NEFPED", label: "Nefrología Pediátrica" },
  { value: "NEUMOPED", label: "Neumonología Pediátrica" },
  { value: "HEMPED", label: "Hematología Pediátrica" },
  { value: "INFPE", label: "Infectología Pediátrica" },

  // Subespecialidades de adultos (Medicina interna)
  { value: "CARO", label: "Cardiología" },
  { value: "NEUMO", label: "Neumonología" },
  { value: "NEFRO", label: "Nefrología" },
  { value: "ENDO", label: "Endocrinología" },
  { value: "GASTRO", label: "Gastroenterología" },
  { value: "HEPA", label: "Hepatología" },
  { value: "REUM", label: "Reumatología" },
  { value: "INFEC", label: "Infectología" },
  { value: "HEMA", label: "Hematología" },
  { value: "INMUNO", label: "Inmunología Clínica" },
  { value: "ALER", label: "Alergología" },

  // Rehabilitación y función
  { value: "REHAB", label: "Medicina Física y Rehabilitación" },
  { value: "FISI", label: "Fisiatría" },
  { value: "DOLOR", label: "Terapia del Dolor / Algología" },

  // Psiquiatría y psicología
  { value: "PSIQ", label: "Psiquiatría" },
  { value: "PSIQUI_INF", label: "Psiquiatría Infantil y del Adolescente" },
  { value: "PSICO", label: "Psicogeriatría" },
  { value: "PSIC", label: "Psicología Clínica" },

  // Odontología
  { value: "ODON", label: "Odontología General" },
  { value: "ORTO_ODON", label: "Ortodoncia" },
  { value: "ODON_PED", label: "Odontopediatría" },
  { value: "ENDOD", label: "Endodoncia" },
  { value: "PERIODON", label: "Periodoncia" },
  { value: "ODON_MAX", label: "Cirugía Bucal / Maxilofacial" },
  { value: "REHABIL", label: "Rehabilitación Oral" },
  { value: "IMPLANT", label: "Implantología" },

  // Administración y salud pública
  { value: "MED_LAB", label: "Medicina del Trabajo" },
  { value: "MED_FOR", label: "Medicina Forense" },
  { value: "TOXICO", label: "Toxicología" },
  { value: "EPIDEMIO", label: "Epidemiología" },
  { value: "SALUD_OCUP", label: "Salud Ocupacional" },
  { value: "GESTION", label: "Gestión Sanitaria" },
];

const inputClasses =
  "w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary";

const DoctorOnboardingStep = ({ onComplete, onBack }) => {
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [category, setCategory] = useState("");      // reservado para futura lógica
  const [subcategory, setSubcategory] = useState(""); // reservado para futura lógica

  const handleSubmit = () => {
    const data = {
      name,
      specialty,      // aquí se guarda el código (ej: "CARO", "PED", "GEN")
      city,
      licenseNumber,
      category,
      subcategory,
    };

    localStorage.setItem("doctorProfile", JSON.stringify(data));
    onComplete?.();
  };

  return (
     <div className="space-y-4">
      <h3 className="text-sm font-regular text-foreground text-center">
        Configura tu especialidad y ubicación para que los pacientes
        puedan encontrarte y agendar citas.
      </h3>
      
      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Nombre completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClasses}
          placeholder="Nombre y apellido"
        />
      </div>

      {/* Especialidad (con las mismas del módulo de diagnóstico) */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Especialidad principal
        </label>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className={inputClasses}
        >
          <option value="">Selecciona una especialidad</option>
          {SPECIALTIES.map((sp) => (
            <option key={sp.value} value={sp.value}>
              {sp.label}
            </option>
          ))}
        </select>
      </div>

      {/* Ciudad / zona principal de atención */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Ciudad principal de atención
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClasses}
        >
          <option value="">Selecciona una ciudad</option>
          <option value="caracas">Amazonas</option>
          <option value="maracay">Anzoátegui</option>
          <option value="valencia">Apure</option>
          <option value="maracaibo">Aragua</option>
          <option value="maracaibo">Barinas</option>
          <option value="maracaibo">Bolívar</option>
          <option value="maracaibo">Carabobo</option>
          <option value="maracaibo">Cojedes</option>
          <option value="maracaibo">Delta Amacuro</option>
          <option value="maracaibo">Falcón</option>
          <option value="maracaibo">Guárico</option>
          <option value="maracaibo">Lara</option>
          <option value="maracaibo">Mérida</option>
          <option value="maracaibo">Miranda</option>
          <option value="maracaibo">Monagas</option>
          <option value="maracaibo">Nueva Esparta</option>
          <option value="maracaibo">Portuguesa</option>
          <option value="maracaibo">Sucre</option>
          <option value="maracaibo">Táchira</option>
          <option value="maracaibo">Trujillo</option>
          <option value="maracaibo">Vargas</option>
          <option value="maracaibo">Yaracuy</option>
          <option value="maracaibo">Zulia</option>
        </select>

      </div>

      {/* Número de colegiado */}
      <div>
        <label className="block text-sm font-medium text-foreground">
          Número de MPPS  
        </label>
        <input
          type="text"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className={inputClasses}
          placeholder="Ej: CM-12345"
        />
      </div>

      {/* Botones de navegación */}
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

export default DoctorOnboardingStep;
