// SpecialtySelector.jsx
import React from 'react';

const SpecialtySelector = ({ selectedSpecialty, onSpecialtyChange }) => {
  const specialties = [
    { value: 'GEN', label: 'Medicina General / Médico Integral' },
    { value: 'INT', label: 'Medicina Interna' },
    { value: 'FAM', label: 'Medicina Familiar y Comunitaria' },
    { value: 'PREV', label: 'Medicina Preventiva y Salud Pública' },
    { value: 'EME', label: 'Urgencias / Emergenciología' },
    { value: 'GERI', label: 'Geriatría' },
    { value: 'PALI', label: 'Cuidados Paliativos' },
    { value: 'SURG', label: 'Cirugía General' },
    { value: 'ORTO', label: 'Traumatología y Ortopedia' },
    { value: 'CAR', label: 'Cirugía Cardiovascular' },
    { value: 'PEDSUR', label: 'Cirugía Pediátrica' },
    
    // CORRECCIÓN 1: ONCO -> ONCO_SURG (Cirugía Oncológica)
    { value: 'ONCO_SURG', label: 'Cirugía Oncológica' }, 
    
    { value: 'PLAS', label: 'Cirugía Plástica y Reconstructiva' },
    { value: 'BARI', label: 'Cirugía Bariátrica' },
    { value: 'TORA', label: 'Cirugía de Tórax' },
    { value: 'COLO', label: 'Coloproctología' },
    
    // CORRECCIÓN 2: NEURO -> NEURO_SURG (Neurocirugía)
    { value: 'NEURO_SURG', label: 'Neurocirugía' }, 
    
    { value: 'MAX', label: 'Cirugía Maxilofacial' },
    { value: 'MANO', label: 'Cirugía de Mano' },
    { value: 'URO', label: 'Urología' },
    { value: 'GYN', label: 'Ginecología' },
    { value: 'OB', label: 'Obstetricia' },
    { value: 'REPRO', label: 'Medicina Reproductiva / Fertilidad' },
    { value: 'PERI', label: 'Perinatología / Medicina Materno-Fetal' },
    { value: 'PED', label: 'Pediatría General' },
    { value: 'NEON', label: 'Neonatología' },
    { value: 'PEDCR', label: 'Pediatría Crítica' },
    { value: 'CARPED', label: 'Cardiología Pediátrica' },
    
    // CORRECCIÓN 3.1: NEUPED (Neuropediatría) mantiene su clave
    { value: 'NEUPED', label: 'Neuropediatría' }, 
    
    { value: 'ENDOPE', label: 'Endocrinología Pediátrica' },
    { value: 'GASTPED', label: 'Gastroenterología Pediátrica' },
    { value: 'NEFPED', label: 'Nefrología Pediátrica' },
    
    // CORRECCIÓN 3.2: NEUPED -> NEUMOPED (Neumonología Pediátrica)
    { value: 'NEUMOPED', label: 'Neumonología Pediátrica' }, 
    
    { value: 'HEMPED', label: 'Hematología Pediátrica' },
    { value: 'INFPE', label: 'Infectología Pediátrica' },
    { value: 'CARO', label: 'Cardiología' },
    { value: 'NEUMO', label: 'Neumonología' },
    { value: 'NEFRO', label: 'Nefrología' },
    { value: 'ENDO', label: 'Endocrinología' },
    { value: 'GASTRO', label: 'Gastroenterología' },
    { value: 'HEPA', label: 'Hepatología' },
    { value: 'REUM', label: 'Reumatología' },
    { value: 'INFEC', label: 'Infectología' },
    { value: 'HEMA', label: 'Hematología' },
    { value: 'INMUNO', label: 'Inmunología Clínica' },
    { value: 'ALER', label: 'Alergología' },
    
    // CORRECCIÓN 2.2: NEURO -> NEURO_MED (Neurología)
    { value: 'NEURO_MED', label: 'Neurología' }, 
    
    { value: 'NEUROF', label: 'Neurofisiología' },
    { value: 'SUEÑO', label: 'Medicina del Sueño' },
    { value: 'NEUREHAB', label: 'Neurorehabilitación' },
    { value: 'ORL', label: 'Otorrinolaringología' },
    { value: 'OFTAL', label: 'Oftalmología' },
    { value: 'AUDIOL', label: 'Audiología' },
    { value: 'DERM', label: 'Dermatología' },
    { value: 'DERM_ONCO', label: 'Dermatología Oncológica' },
    { value: 'DERM_PED', label: 'Dermatología Pediátrica' },
    
    // CORRECCIÓN 1.2: ONCO -> ONCO_MED (Oncología Médica)
    { value: 'ONCO_MED', label: 'Oncología Médica' }, 
    
    { value: 'ONCO_RAD', label: 'Oncología Radioterápica' },
    { value: 'HEM_ONCO', label: 'Hemato-Oncología' },
    { value: 'RADIO', label: 'Radiología / Imagenología' },
    { value: 'MED_NUC', label: 'Medicina Nuclear' },
    { value: 'PAT', label: 'Anatomía Patológica' },
    { value: 'LAB', label: 'Laboratorio Clínico' },
    { value: 'CITO', label: 'Citopatología' },
    { value: 'REHAB', label: 'Medicina Física y Rehabilitación' },
    { value: 'FISI', label: 'Fisiatría' },
    { value: 'DOLOR', label: 'Terapia del Dolor / Algología' },
    { value: 'PSIQUI', label: 'Psiquiatría' },
    { value: 'PSIQUI_INF', label: 'Psiquiatría Infantil y del Adolescente' },
    { value: 'PSICO', label: 'Psicogeriatría' },
    { value: 'PSIC', label: 'Psicología Clínica' },
    { value: 'ODON', label: 'Odontología General' },
    { value: 'ORTO_ODON', label: 'Ortodoncia' },
    { value: 'ODON_PED', label: 'Odontopediatría' },
    { value: 'ENDOD', label: 'Endodoncia' },
    { value: 'PERIODON', label: 'Periodoncia' },
    { value: 'ODON_MAX', label: 'Cirugía Bucal / Maxilofacial' },
    { value: 'REHABIL', label: 'Rehabilitación Oral' },
    { value: 'IMPLANT', label: 'Implantología' },
    { value: 'MED_LAB', label: 'Medicina del Trabajo' },
    { value: 'MED_FOR', label: 'Medicina Forense' },
    { value: 'TOXICO', label: 'Toxicología' },
    { value: 'EPIDEMIO', label: 'Epidemiología' },
    { value: 'SALUD_OCUP', label: 'Salud Ocupacional' },
    { value: 'GESTION', label: 'Gestión Sanitaria' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Especialidad</label>
      <select
        value={selectedSpecialty}
        onChange={(e) => onSpecialtyChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
      >
        {specialties.map((specialty) => (
          <option key={specialty.value} value={specialty.value}>
            {specialty.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpecialtySelector;