// src/mock/templates.js
export const DIAGNOSIS_TEMPLATES = [
  {
    id: "tpl_general",
    specialty_id: "GEN_GP", // Medicina General
    name: "Consulta General Standard",
    schema: [
      { key: "reason", label: "Motivo de Consulta", type: "textarea", required: true },
      { key: "symptoms", label: "Sintomatología", type: "textarea" },
      { key: "requires_surgery", label: "¿Amerita procedimiento quirúrgico?", type: "boolean", trigger: "ACTIVATE_PREOP" }
    ]
  },
  {
    id: "tpl_cardio",
    specialty_id: "INT_CAR", // Cardiología
    name: "Evaluación Cardiovascular",
    schema: [
      { key: "reason", label: "Motivo: Dolor torácico / Disnea", type: "text", required: true },
      { key: "risk_factors", label: "Factores de Riesgo", type: "textarea", placeholder: "HTA, Diabetes, Tabaquismo..." },
      { key: "ekg_summary", label: "Resumen EKG", type: "textarea" },
      { key: "requires_surgery", label: "¿Requiere Cateterismo/Cirugía?", type: "boolean", trigger: "ACTIVATE_PREOP" }
    ]
  },
  // Fallback por defecto
  {
    id: "tpl_default",
    specialty_id: "DEFAULT",
    name: "Consulta Básica",
    schema: [
      { key: "notes", label: "Notas de evolución", type: "textarea" },
      { key: "requires_surgery", label: "¿Requiere Cirugía?", type: "boolean", trigger: "ACTIVATE_PREOP" }
    ]
  }
];