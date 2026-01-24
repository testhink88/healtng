// src/mock/prescriptionTemplates.js
export const PRESCRIPTION_TEMPLATES = [
  {
    id: "rx_tpl_htn_v1",
    version: "1.0",
    dx_template_id: "tpl_cardio", // conecta con tu DIAGNOSIS_TEMPLATES
    name: "Hipertensión - Primera línea",
    suggested_meds: [
      {
        drug_id: "enalapril_tab_10",
        dose: "10 mg",
        route: "Oral",
        frequency: "1 vez al día",
        duration: "14 días",
        instructions: "Tomar por la mañana con agua. Control de TA en 14 días.",
      },
      {
        drug_id: "losartan_tab_50",
        dose: "50 mg",
        route: "Oral",
        frequency: "1 vez al día",
        duration: "14 días",
        instructions: "Alternativa si tos con IECA.",
      },
    ],
    followups: [
      { type: "checkup", in_days: 14, label: "Control de TA en 14 días" },
    ],
  },
  {
    id: "rx_tpl_general_v1",
    version: "1.0",
    dx_template_id: "tpl_general",
    name: "Consulta general - receta libre",
    suggested_meds: [],
    followups: [],
  },
];

export function getRxTemplateById(id) {
  return PRESCRIPTION_TEMPLATES.find((t) => String(t.id) === String(id));
}

export function getRxTemplateForDxTemplate(dxTemplateId) {
  return PRESCRIPTION_TEMPLATES.find((t) => t.dx_template_id === dxTemplateId) || null;
}
