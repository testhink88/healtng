/**
 * INTERNAL_COMMON_OPTIONS:
 * Opciones de selección compartidas por múltiples especialidades.
 * Esto evita la necesidad de un archivo `commonOptions.js` separado para que este archivo sea autoejecutable.
 */
export const INTERNAL_COMMON_OPTIONS = {
  triageLevels: [
    { value: 'T1', label: 'T1 - Reanimación (Riesgo Vital)' },
    { value: 'T2', label: 'T2 - Emergencia (Riesgo Inminente)' },
    { value: 'T3', label: 'T3 - Urgencia (Potencial Riesgo)' },
    { value: 'T4', label: 'T4 - Menor (Poco Riesgo)' },
    { value: 'T5', label: 'T5 - Sin urgencia (Consulta Programada)' },
  ],
  anesthesiaTypes: [
    { value: 'GENERAL', label: 'General' },
    { value: 'REGIONAL', label: 'Regional (Espinal/Epidural)' },
    { value: 'LOCAL', label: 'Local' },
    { value: 'SEDATION', label: 'Sedación Consciente' },
  ],
  marginStatus: [
    { value: 'R0', label: 'R0 (Márgenes Negativos - Libre)' },
    { value: 'R1', label: 'R1 (Márgenes Microscópicamente Positivos)' },
    { value: 'R2', label: 'R2 (Márgenes Macroscópicamente Positivos)' },
    { value: 'UNKNOWN', label: 'No Evaluado/Desconocido' },
  ],
  bariatricProcedures: [
    { value: 'BYPASS', label: 'Bypass Gástrico' },
    { value: 'SLEEVE', label: 'Manga Gástrica' },
    { value: 'BALLOON', label: 'Balón Intragástrico' },
    { value: 'OTHER', label: 'Otro' },
  ],
  nyhaClasses: [
    { value: 'I', label: 'Clase I (Sin limitación)' },
    { value: 'II', label: 'Clase II (Limitación leve)' },
    { value: 'III', label: 'Clase III (Limitación marcada)' },
    { value: 'IV', label: 'Clase IV (Incapacidad en reposo)' },
  ],
  siiTypes: [
    { value: 'C', label: 'SII con Estreñimiento predominante (SII-C)' },
    { value: 'D', label: 'SII con Diarrea predominante (SII-D)' },
    { value: 'M', label: 'SII Mixto (SII-M)' },
    { value: 'U', label: 'SII No Clasificado (SII-U)' },
  ],
  childPughClasses: [
    { value: 'A', label: 'Clase A (Función Hepática Bien Compensada)' },
    { value: 'B', label: 'Clase B (Compromiso Funcional Moderado)' },
    { value: 'C', label: 'Clase C (Compromiso Funcional Grave)' },
  ],
  tannerStages: [
    { value: 'I', label: 'Estadio I (Preadolescente)' },
    { value: 'II', label: 'Estadio II (Inicio del Desarrollo)' },
    { value: 'III', label: 'Estadio III (Progresión)' },
    { value: 'IV', label: 'Estadio IV (Casi Adulto)' },
    { value: 'V', label: 'Estadio V (Madurez Adulta)' },
  ],
  suicideRisk: [
    { value: 'BAJO', label: 'Bajo' },
    { value: 'MODERADO', label: 'Moderado' },
    { value: 'ALTO', label: 'Alto' },
    { value: 'INMINENTE', label: 'Inminente/Activo' },
  ],
  malocclusionClass: [
    { value: 'CLASS_I', label: 'Clase I' },
    { value: 'CLASS_II', label: 'Clase II' },
    { value: 'CLASS_III', label: 'Clase III' },
  ]
};

/**
 * BASE_DIAGNOSIS_SECTIONS:
 * Define las secciones obligatorias del proceso diagnóstico (Flujo de 4 pasos).
 * Todas las especialidades heredarán estas secciones.
 */
export const BASE_DIAGNOSIS_SECTIONS = [
  {
    key: 'anamnesis',
    label: '1. Anamnesis y Motivo de Consulta',
    fields: [
      { key: 'chief_complaint', label: 'Motivo de Consulta y Tiempo de Evolución', type: 'textarea' },
      { key: 'history_disease', label: 'Historial de Enfermedad Actual (Detalle de Síntomas)', type: 'textarea' },
      { key: 'medical_history', label: 'Antecedentes Patológicos, Quirúrgicos y Familiares', type: 'textarea' },
      { key: 'medication_current', label: 'Medicamentos y Alergias Actuales', type: 'textarea' },
    ],
  },

  {
    key: 'exam_vitals',
    label: '2. Examen Físico y Signos Vitales',
    fields: [
      { key: 'vital_signs_ta', label: 'Tensión Arterial (TA)', type: 'text' },
      { key: 'vital_signs_fc', label: 'Frecuencia Cardíaca (FC)', type: 'number' },
      { key: 'vital_signs_temp', label: 'Temperatura (°C)', type: 'number' },
      { key: 'vital_signs_spo2', label: 'Saturación O₂ (So2) (%)', type: 'number' },
      { key: 'physical_exam_notes', label: 'Hallazgos Clave de la Exploración Física (Por sistemas)', type: 'textarea' },
    ],
  },

  // La sección 3 se reserva para la especialidad específica (ver combineSchemas)

  {
    key: 'evaluation_diagnosis',
    label: '4. Evaluación, Diagnóstico Final y Resultados',
    fields: [
      { key: 'differential_diagnosis', label: 'Diagnóstico Diferencial (Listado de Hipótesis)', type: 'textarea' },
      { key: 'tests_results', label: 'Resultados e Interpretación de Pruebas Complementarias', type: 'textarea' },
      { key: 'final_diagnosis', label: 'Conclusión Diagnóstica Final', type: 'textarea' },
      { key: 'icd10_codes', label: 'Códigos CIE-10 / ICD-10 (Separados por coma)', type: 'text' },
    ],
  },

  {
    key: 'action_plan',
    label: '5. Plan de Acción y Comunicación',
    fields: [
      { key: 'prognosis_followup', label: 'Pronóstico y Conducta a Seguir / Seguimiento', type: 'textarea' },
      { key: 'treatment_plan', label: 'Plan de Tratamiento (Farmacológico, Terapéutico, Quirúrgico)', type: 'textarea' },
      { key: 'communication', label: 'Comunicación con el Paciente y Consentimiento', type: 'textarea' },
    ],
  },
];

/**
 * Función de utilidad para combinar las secciones base con las específicas de la especialidad.
 * La sección específica siempre se inserta después de la '2. Examen Físico' y antes de '4. Evaluación'.
 */
const combineSchemas = (name, specificSections = []) => {
  // Asegurarse de que las secciones específicas tengan la llave '3' si solo se proporciona una.
  const specificSectionWithNumber = specificSections.map(section => {
    if (section.label.startsWith("3.") || specificSections.length > 1) {
      return section;
    }
    return { ...section, label: `3. ${section.label.replace(/^(\d+\.\s*)?/, '')}` };
  });

  // Encuentra el índice después de la sección 'exam_vitals' (2.)
  const indexAfterExamVitals = BASE_DIAGNOSIS_SECTIONS.findIndex(s => s.key === 'exam_vitals') + 1;

  // Crea una copia de las secciones base y splice las específicas en el lugar correcto
  const finalSections = [...BASE_DIAGNOSIS_SECTIONS];
  finalSections.splice(indexAfterExamVitals, 0, ...specificSectionWithNumber);

  return {
    name: name,
    sections: finalSections
  };
};

/**
 * SPECIALTY_DIAGNOSIS_SCHEMAS:
 * Contiene el esquema completo de secciones y campos para cada especialidad.
 */
export const SPECIALTY_DIAGNOSIS_SCHEMAS = {
  GEN: combineSchemas("Medicina General / Médico Integral", []),

  // 1. Medicina Interna y Subespecialidades
  INT: combineSchemas("Medicina Interna", [
    {
      key: "int_specifics",
      label: "3. Evaluación de Comorbilidades",
      fields: [
        { key: "comorbidities", label: "Comorbilidades Crónicas (Detalle)", type: 'textarea' },
        { key: "medication_list", label: "Detalle de Fármacos, Dosis y Frecuencia", type: 'textarea' },
      ]
    },
  ]),

  FAM: combineSchemas("Medicina Familiar y Comunitaria", [
    {
      key: "fam_specifics",
      label: "3. Historial Familiar y Social",
      fields: [
        { key: "familyDiseases", label: "Enfermedades Hereditarias/Familiares", type: 'textarea' },
        { key: "socialDeterminants", label: "Determinantes Sociales (Hacinamiento, Servicios, Red de apoyo)", type: 'textarea' }
      ]
    },
  ]),

  PREV: combineSchemas("Medicina Preventiva y Salud Pública", [
    {
      key: "prev_specifics",
      label: "3. Estrategia Preventiva y Promoción de Salud",
      fields: [
        { key: "screening", label: "Exámenes de Detección (Cáncer, ETS) Planificados", type: 'textarea' },
        { key: "healthEducation", label: "Consejería de Estilos de Vida/Riesgo", type: 'textarea' }
      ]
    },
  ]),

  EME: combineSchemas("Urgencias / Emergenciología", [
    {
      key: "eme_specifics",
      label: "3. Datos de Emergencia y Triaje",
      fields: [
        { key: "trauma", label: "Mecanismo/Tipo de Lesión o Patología Aguda", type: 'text' },
        { key: "severity", label: "Nivel de Triaje (Severidad)", type: 'select', options: INTERNAL_COMMON_OPTIONS.triageLevels },
        { key: "glasgow", label: "Escala de Glasgow", type: 'number' }
      ]
    },
  ]),

  GERI: combineSchemas("Geriatría", [
    {
      key: "geri_specifics",
      label: "3. Evaluación Geriátrica Integral",
      fields: [
        { key: "cognitiveStatus", label: "Estado Cognitivo (MMSE, MoCA, etc.)", type: 'text' },
        { key: "mobilityStatus", label: "Estado de Movilidad (Barthel, Tinetti)", type: 'text' },
        { key: "polypharmacy", label: "Polifarmacia", type: 'checkbox' }
      ]
    },
  ]),

  PALI: combineSchemas("Cuidados Paliativos", [
    {
      key: "pali_specifics",
      label: "3. Manejo Paliativo de Síntomas",
      fields: [
        { key: "painLevel", label: "Nivel de Dolor (EVA 0-10)", type: 'number' },
        { key: "symptomManagement", label: "Manejo de Síntomas (Náuseas, Disnea, etc.)", type: 'textarea' },
        { key: "emotionalSupport", label: "Soporte Emocional y Familiar", type: 'textarea' }
      ]
    },
  ]),

  // 2. Especialidades Quirúrgicas
  SURG: combineSchemas("Cirugía General", [
    {
      key: "surg_specifics",
      label: "3. Evaluación Pre/Post-Quirúrgica",
      fields: [
        { key: "surgeryType", label: "Procedimiento Propuesto/Realizado", type: 'text' },
        { key: "surgeryDate", label: "Fecha de Cirugía", type: 'date' },
        { key: "anesthesiaType", label: "Tipo de Anestesia", type: 'select', options: INTERNAL_COMMON_OPTIONS.anesthesiaTypes }
      ]
    },
  ]),

  ORTO: combineSchemas("Traumatología y Ortopedia", [
    {
      key: "orto_specifics",
      label: "3. Lesiones Osteomusculares",
      fields: [
        { key: "fractureType", label: "Tipo de Lesión/Fractura (Clasificación)", type: 'text' },
        { key: "location", label: "Ubicación (Hueso, Articulación)", type: 'text' },
        { key: "mechanism", label: "Mecanismo de Lesión", type: 'text' }
      ]
    },
  ]),

  CAR: combineSchemas("Cirugía Cardiovascular", [
    {
      key: "car_specifics",
      label: "3. Evaluación Cardíaca Quirúrgica",
      fields: [
        { key: "surgeryDetails", label: "Detalles del Procedimiento (Bypass, Válvula, Aorta)", type: 'textarea' },
        { key: "ef", label: "Fracción de Eyección (FE) (%)", type: 'number' }
      ]
    },
  ]),

  PEDSUR: combineSchemas("Cirugía Pediátrica", [
    {
      key: "pedsur_specifics",
      label: "3. Parámetros Quirúrgicos Pediátricos",
      fields: [
        { key: "weight", label: "Peso (kg)", type: 'number' },
        { key: "congenitalDefect", label: "Defecto Congénito a Corregir", type: 'text' }
      ]
    },
  ]),

  ONCO_SURG: combineSchemas("Cirugía Oncológica", [
    {
      key: "oncosurg_specifics",
      label: "3. Evaluación Oncológica Quirúrgica",
      fields: [
        { key: "tumorLocation", label: "Localización del Tumor (TNM)", type: 'text' },
        { key: "marginStatus", label: "Estado de Márgenes Quirúrgicos (Post-Op)", type: 'select', options: INTERNAL_COMMON_OPTIONS.marginStatus }
      ]
    },
  ]),

  PLAS: combineSchemas("Cirugía Plástica y Reconstructiva", [
    {
      key: "plas_specifics",
      label: "3. Procedimiento Plástico/Estético",
      fields: [
        { key: "reason", label: "Motivo (Estético/Reconstructivo)", type: 'text' },
        { key: "graftType", label: "Tipo de Injerto/Colgajo/Expansor", type: 'text' }
      ]
    },
  ]),

  BARI: combineSchemas("Cirugía Bariátrica", [
    {
      key: "bari_specifics",
      label: "3. Evaluación Bariátrica",
      fields: [
        { key: "bmi", label: "IMC Pre-Quirúrgico", type: 'number' },
        { key: "procedure", label: "Procedimiento (Bypass, Manga, etc.)", type: 'select', options: INTERNAL_COMMON_OPTIONS.bariatricProcedures }
      ]
    },
  ]),

  TORA: combineSchemas("Cirugía de Tórax", [
    {
      key: "tora_specifics",
      label: "3. Evaluación Torácica Quirúrgica",
      fields: [
        { key: "pulmonaryFunction", label: "Pruebas de Función Pulmonar (FEV1) Pre-Op", type: 'text' },
        { key: "pathology", label: "Patología Torácica (Ej. Nódulo, Derrame)", type: 'text' }
      ]
    },
  ]),

  COLO: combineSchemas("Coloproctología", [
    {
      key: "colo_specifics",
      label: "3. Evaluación Coloproctológica",
      fields: [
        { key: "chiefComplaint", label: "Síntoma Principal (Sangrado, Dolor, Alteración del ritmo)", type: 'text' },
        { key: "endoscopyResult", label: "Resultado de Colonoscopia/Rectosigmoidoscopia", type: 'textarea' }
      ]
    },
  ]),

  NEURO_SURG: combineSchemas("Neurocirugía", [
    {
      key: "neurosurg_specifics",
      label: "3. Parámetros Neuroquirúrgicos",
      fields: [
        { key: "icp", label: "Presión Intracraneal (PIC) si aplica", type: 'text' },
        { key: "location", label: "Localización y Tipo de Lesión/Tumor", type: 'text' }
      ]
    },
  ]),

  MAX: combineSchemas("Cirugía Maxilofacial", [
    {
      key: "max_specifics",
      label: "3. Evaluación Oral y Maxilofacial",
      fields: [
        { key: "dentalStatus", label: "Estado Dental y Oclusal (Clase de Angle)", type: 'text' },
        { key: "traumaType", label: "Tipo de Trauma Facial/Fractura", type: 'text' }
      ]
    },
  ]),

  MANO: combineSchemas("Cirugía de Mano", [
    {
      key: "mano_specifics",
      label: "3. Evaluación de la Mano",
      fields: [
        { key: "functionalStatus", label: "Estado Funcional (Agarre, Pinza, Test de Sensibilidad)", type: 'text' },
        { key: "nerveDamage", label: "Lesión Tendinosa/Nerviosa Asociada", type: 'text' }
      ]
    },
  ]),

  URO: combineSchemas("Urología", [
    {
      key: "uro_specifics",
      label: "3. Evaluación Urológica",
      fields: [
        { key: "symptoms", label: "Síntomas Urinarios (Disuria, Hematuria, Frecuencia)", type: 'text' },
        { key: "psa", label: "Antígeno Prostático Específico (PSA) - Valor", type: 'text' }
      ]
    },
  ]),

  // 3. Ginecología y Obstetricia
  GYN: combineSchemas("Ginecología", [
    {
      key: "gyn_specifics",
      label: "3. Historial Ginecológico y Prevención",
      fields: [
        { key: "lmp", label: "Fecha de Última Menstruación (FUM)", type: 'date' },
        { key: "papSmear", label: "Último Papanicolaou (Fecha y Resultado)", type: 'text' },
        { key: "sexualHistory", label: "Historial Sexual y de ETS", type: 'text' }
      ]
    },
  ]),

  OB: combineSchemas("Obstetricia", [
    {
      key: "ob_specifics",
      label: "3. Control Prenatal",
      fields: [
        { key: "gestationalAge", label: "Edad Gestacional (Semanas)", type: 'number' },
        { key: "g_p_a_l", label: "Fórmula Obstétrica (G P A L)", type: 'text' },
        { key: "riskFactors", label: "Factores de Riesgo Obstétrico", type: 'textarea' }
      ]
    },
  ]),

  REPRO: combineSchemas("Medicina Reproductiva / Fertilidad", [
    {
      key: "repro_specifics",
      label: "3. Evaluación de Fertilidad",
      fields: [
        { key: "infertilityTime", label: "Tiempo de Infertilidad (años)", type: 'number' },
        { key: "spermAnalysis", label: "Resultado del Espermograma (Concentración, Motilidad)", type: 'text' },
        { key: "ovarianReserve", label: "Reserva Ovárica (AMH)", type: 'text' }
      ]
    },
  ]),

  PERI: combineSchemas("Perinatología / Medicina Materno-Fetal", [
    {
      key: "peri_specifics",
      label: "3. Monitoreo Materno-Fetal",
      fields: [
        { key: "fetalGrowth", label: "Crecimiento Fetal (Percentil y Peso Estimado)", type: 'text' },
        { key: "maternalComorbidity", label: "Comorbilidad Materna de Alto Riesgo", type: 'text' },
        { key: "doppler", label: "Hallazgos de Doppler Fetal/Uterino", type: 'text' }
      ]
    },
  ]),

  // 4. Pediatría y Subespecialidades
  PED: combineSchemas("Pediatría General", [
    {
      key: "ped_specifics",
      label: "3. Crecimiento y Desarrollo",
      fields: [
        { key: "weight_percentile", label: "Peso (kg) / Percentil", type: 'text' },
        { key: "height_percentile", label: "Estatura (cm) / Percentil", type: 'text' },
        { key: "developmentalMilestones", label: "Hitos del Desarrollo (Cumplidos/Retrasos)", type: 'textarea' }
      ]
    },
  ]),

  NEON: combineSchemas("Neonatología", [
    {
      key: "neon_specifics",
      label: "3. Evaluación Neonatal y Transición",
      fields: [
        { key: "apgar", label: "Puntuación de Apgar (1 y 5 minutos)", type: 'text' },
        { key: "gestationalAgeBirth", label: "Edad Gestacional al Nacimiento (Semanas)", type: 'number' },
        { key: "bilirubin", label: "Nivel de Bilirrubina (Ictericia)", type: 'text' }
      ]
    },
  ]),

  PEDCR: combineSchemas("Pediatría Crítica", [
    {
      key: "pedcr_specifics",
      label: "3. Parámetros UCI Pediátrica",
      fields: [
        { key: "pews", label: "Puntuación PEWS / PIM", type: 'text' },
        { key: "ventilationStatus", label: "Estado de Ventilación/Oxigenación (FiO2, PEEP)", type: 'text' },
      ]
    },
  ]),

  CARPED: combineSchemas("Cardiología Pediátrica", [
    {
      key: "carped_specifics",
      label: "3. Evaluación Cardíaca Infantil",
      fields: [
        { key: "congenitalHeartDisease", label: "Cardiopatía Congénita (Diagnóstico y Clasificación)", type: 'text' },
        { key: "echoFinding", label: "Hallazgos Ecocardiográficos Clave (Shunts, Válvulas)", type: 'textarea' }
      ]
    },
  ]),

  NEUPED: combineSchemas("Neuropediatría", [
    {
      key: "neuped_specifics",
      label: "3. Evaluación Neurodesarrollo",
      fields: [
        { key: "seizureType", label: "Tipo y Frecuencia de Crisis Epiléptica", type: 'text' },
        { key: "eegResult", label: "Resultado de EEG (Focos de Actividad)", type: 'text' },
      ]
    },
  ]),

  ENDOPE: combineSchemas("Endocrinología Pediátrica", [
    {
      key: "endope_specifics",
      label: "3. Evaluación Hormonal y de Crecimiento Infantil",
      fields: [
        { key: "tannerStage", label: "Estadio de Tanner", type: 'select', options: INTERNAL_COMMON_OPTIONS.tannerStages },
        { key: "boneAge", label: "Edad Ósea (Resultado)", type: 'text' }
      ]
    },
  ]),

  GASTPED: combineSchemas("Gastroenterología Pediátrica", [
    {
      key: "gastped_specifics",
      label: "3. Evaluación Gastrointestinal Infantil",
      fields: [
        { key: "feedingTolerence", label: "Tolerancia a la Alimentación/Fórmula", type: 'text' },
        { key: "allergy", label: "Alergias Alimentarias Comprobadas", type: 'text' },
      ]
    },
  ]),

  NEFPED: combineSchemas("Nefrología Pediátrica", [
    {
      key: "nefped_specifics",
      label: "3. Evaluación Renal Infantil",
      fields: [
        { key: "urineOutput", label: "Gasto Urinario (ml/kg/h)", type: 'text' },
        { key: "kidneyFunction", label: "Función Renal (Creatinina, TFG)", type: 'text' },
      ]
    },
  ]),

  NEUMOPED: combineSchemas("Neumonología Pediátrica", [
    {
      key: "neumoped_specifics",
      label: "3. Evaluación Pulmonar Infantil",
      fields: [
        { key: "asthmaControl", label: "Control de Asma (Clasificación GINA)", type: 'text' },
        { key: "spirometry", label: "Resultado de Espirometría (si aplica)", type: 'text' },
      ]
    },
  ]),

  HEMPED: combineSchemas("Hematología Pediátrica", [
    {
      key: "hemped_specifics",
      label: "3. Evaluación Hematológica Infantil",
      fields: [
        { key: "cbc", label: "Hemograma Completo (Valores Anormales)", type: 'textarea' },
        { key: "coagulation", label: "Perfil de Coagulación (TP, TPTT)", type: 'text' }
      ]
    },
  ]),

  INFPE: combineSchemas("Infectología Pediátrica", [
    {
      key: "infpe_specifics",
      label: "3. Manejo de Infecciones Infantiles",
      fields: [
        { key: "source", label: "Foco de Infección (Ej. ITU, Neumonía)", type: 'text' },
        { key: "antibioticUsed", label: "Antibiótico Usado y Días de Tratamiento", type: 'text' }
      ]
    },
  ]),

  // 5. Medicina Interna: Subespecialidades de Adultos
  CARO: combineSchemas("Cardiología", [
    {
      key: "caro_specifics",
      label: "3. Evaluación Cardiovascular Específica",
      fields: [
        { key: "ekgResult", label: "Resultado de Electrocardiograma (Ritmo, Bloqueos)", type: 'text' },
        { key: "chfClass", label: "Clase NYHA (Insuficiencia Cardíaca)", type: 'select', options: INTERNAL_COMMON_OPTIONS.nyhaClasses },
        { key: "echocardiogram", label: "Hallazgos de Ecocardiograma", type: 'textarea' }
      ]
    },
  ]),

  NEUMO: combineSchemas("Neumonología", [
    {
      key: "neumo_specifics",
      label: "3. Evaluación Pulmonar",
      fields: [
        { key: "fev1", label: "FEV1 (%)", type: 'number' },
        { key: "smokingHistory", label: "Historial de Tabaquismo (Paquetes/año)", type: 'number' }
      ]
    },
  ]),

  NEFRO: combineSchemas("Nefrología", [
    {
      key: "nefro_specifics",
      label: "3. Evaluación Renal",
      fields: [
        { key: "gfr", label: "Tasa de Filtración Glomerular (TFG)", type: 'number' },
        { key: "dialysis", label: "¿En Diálisis?", type: 'checkbox' }
      ]
    },
  ]),

  ENDO: combineSchemas("Endocrinología", [
    {
      key: "endo_specifics",
      label: "3. Evaluación Metabólica y Hormonal",
      fields: [
        { key: "hba1c", label: "HbA1c (%)", type: 'number' },
        { key: "thyroidFunction", label: "Pruebas de Función Tiroidea (TSH, T4L)", type: 'text' }
      ]
    },
  ]),

  GASTRO: combineSchemas("Gastroenterología", [
    {
      key: "gastro_specifics",
      label: "3. Evaluación Digestiva",
      fields: [
        { key: "endoscopy", label: "Resultado de Endoscopia Digestiva Alta", type: 'text' },
        { key: "ibsType", label: "Tipo de SII (si aplica)", type: 'select', options: INTERNAL_COMMON_OPTIONS.siiTypes }
      ]
    },
  ]),

  HEPA: combineSchemas("Hepatología", [
    {
      key: "hepa_specifics",
      label: "3. Evaluación Hepática",
      fields: [
        { key: "childPugh", label: "Clasificación de Child-Pugh", type: 'select', options: INTERNAL_COMMON_OPTIONS.childPughClasses },
        { key: "viralHepatitis", label: "Hepatitis Viral (Tipo)", type: 'text' }
      ]
    },
  ]),

  REUM: combineSchemas("Reumatología", [
    {
      key: "reum_specifics",
      label: "3. Evaluación Reumatológica",
      fields: [
        { key: "painJoints", label: "Articulaciones Dolorosas/Inflamadas", type: 'text' },
        { key: "autoantibodies", label: "Autoanticuerpos (FAN, FR, ACPA)", type: 'text' }
      ]
    },
  ]),

  INFEC: combineSchemas("Infectología", [
    {
      key: "infec_specifics",
      label: "3. Manejo de Infecciones",
      fields: [
        { key: "cultureResult", label: "Resultado de Cultivo y Antibiograma", type: 'text' },
        { key: "travelHistory", label: "Historial de Viajes Recientes", type: 'text' }
      ]
    },
  ]),

  HEMA: combineSchemas("Hematología", [
    {
      key: "hema_specifics",
      label: "3. Evaluación de Sangre y Médula",
      fields: [
        { key: "bloodSmear", label: "Frotis de Sangre Periférica", type: 'text' },
        { key: "transfusionHistory", label: "Historial de Transfusiones", type: 'text' }
      ]
    },
  ]),

  INMUNO: combineSchemas("Inmunología Clínica", [
    {
      key: "inmuno_specifics",
      label: "3. Evaluación del Sistema Inmune",
      fields: [
        { key: "immunodeficiency", label: "Inmunodeficiencia (Tipo)", type: 'text' },
        { key: "autoimmunityTest", label: "Pruebas de Autoinmunidad", type: 'text' }
      ]
    },
  ]),

  ALER: combineSchemas("Alergología", [
    {
      key: "aler_specifics",
      label: "3. Evaluación de Alergias",
      fields: [
        { key: "allergenTest", label: "Pruebas Cutáneas/IgE Específica", type: 'text' },
        { key: "drugAllergies", label: "Alergias a Medicamentos", type: 'text' }
      ]
    },
  ]),

  // 6. Especialidades de Rehabilitación y Función
  REHAB: combineSchemas("Medicina Física y Rehabilitación", [
    {
      key: "rehab_specifics",
      label: "3. Evaluación Funcional",
      fields: [
        { key: "motorDeficit", label: "Déficit Motor (Ej. Hemiparesia)", type: 'text' },
        { key: "rehabPlan", label: "Plan de Terapia (Física, Ocupacional, Lenguaje)", type: 'textarea' }
      ]
    },
  ]),

  FISI: combineSchemas("Fisiatría", [
    {
      key: "fisi_specifics",
      label: "3. Evaluación del Movimiento",
      fields: [
        { key: "jointRange", label: "Rango Articular (ROM)", type: 'text' },
        { key: "muscleStrength", label: "Fuerza Muscular (Escala de Daniels)", type: 'text' }
      ]
    },
  ]),

  DOLOR: combineSchemas("Terapia del Dolor / Algología", [
    {
      key: "dolor_specifics",
      label: "3. Manejo del Dolor Crónico",
      fields: [
        { key: "painScore", label: "Puntuación de Dolor (NRS 0-10)", type: 'number' },
        { key: "painType", label: "Tipo de Dolor (Neuropático, Nociceptivo)", type: 'text' }
      ]
    },
  ]),

  // 7. Especialidades Psicológicas y Psiquiátricas
  PSIQ: combineSchemas("Psiquiatría", [
    {
      key: "psiqui_specifics",
      label: "3. Evaluación de Salud Mental",
      fields: [
        { key: "axis1Diagnosis", label: "Diagnóstico Principal (DSM-5)", type: 'text' },
        { key: "suicideRisk", label: "Riesgo Suicida", type: 'select', options: INTERNAL_COMMON_OPTIONS.suicideRisk }
      ]
    },
  ]),

  PSIQUI_INF: combineSchemas("Psiquiatría Infantil y del Adolescente", [
    {
      key: "psiquiinf_specifics",
      label: "3. Evaluación Psiquiátrica Infantil",
      fields: [
        { key: "developmentalStage", label: "Etapa de Desarrollo", type: 'text' },
        { key: "schoolPerformance", label: "Rendimiento Escolar/Problemas de Conducta", type: 'text' }
      ]
    },
  ]),

  PSICO: combineSchemas("Psicogeriatría", [
    {
      key: "psico_specifics",
      label: "3. Evaluación de Salud Mental Geriátrica",
      fields: [
        { key: "dementiaType", label: "Tipo de Demencia (si aplica)", type: 'text' },
        { key: "behavioralSymptoms", label: "Síntomas Conductuales (Agitación, Apatía)", type: 'text' }
      ]
    },
  ]),

  PSIC: combineSchemas("Psicología Clínica", [
    {
      key: "psic_specifics",
      label: "3. Evaluación Psicológica",
      fields: [
        { key: "testing", label: "Pruebas Aplicadas (Ej. Beck, WAIS)", type: 'text' },
        { key: "therapyType", label: "Tipo de Terapia (TCC, Dinámica)", type: 'text' }
      ]
    },
  ]),

  // 8. Especialidades Odontológicas
  ODON: combineSchemas("Odontología General", [
    {
      key: "odon_specifics",
      label: "3. Evaluación Dental General",
      fields: [
        { key: "caries", label: "Índice de Caries (CEO-D/CPOD)", type: 'text' },
        { key: "hygieneScore", label: "Índice de Higiene Oral", type: 'text' }
      ]
    },
  ]),

  ORTO_ODON: combineSchemas("Ortodoncia", [
    {
      key: "ortoodon_specifics",
      label: "3. Evaluación de Oclusión",
      fields: [
        { key: "malocclusionClass", label: "Clase de Maloclusión (Angle)", type: 'select', options: INTERNAL_COMMON_OPTIONS.malocclusionClass },
        { key: "treatmentDevice", label: "Aparato de Ortodoncia", type: 'text' }
      ]
    },
  ]),

  ODON_PED: combineSchemas("Odontopediatría", [
    {
      key: "odonped_specifics",
      label: "3. Evaluación Dental Infantil",
      fields: [
        { key: "eruptionStatus", label: "Estado de Erupción Dental", type: 'text' },
        { key: "fluorideApplied", label: "Aplicación de Flúor", type: 'checkbox' }
      ]
    },
  ]),

  ENDOD: combineSchemas("Endodoncia", [
    {
      key: "endod_specifics",
      label: "3. Evaluación Endodóntica",
      fields: [
        { key: "toothNumber", label: "Pieza Dental Afectada (FDI)", type: 'number' },
        { key: "pulpalDiagnosis", label: "Diagnóstico Pulpar", type: 'text' }
      ]
    },
  ]),

  PERIODON: combineSchemas("Periodoncia", [
    {
      key: "periodon_specifics",
      label: "3. Evaluación Periodontal",
      fields: [
        { key: "pocketDepth", label: "Profundidad de Sondaje (mm)", type: 'text' },
        { key: "gingivalStatus", label: "Estado Gingival (Índice de Sangrado)", type: 'text' }
      ]
    },
  ]),

  ODON_MAX: combineSchemas("Cirugía Bucal / Maxilofacial", [
    {
      key: "odonmax_specifics",
      label: "3. Evaluación de Cirugía Bucal",
      fields: [
        { key: "procedurePlanned", label: "Procedimiento a realizar (Extracción, Implante, Quiste)", type: 'text' },
        { key: "boneAvailability", label: "Disponibilidad Ósea (Implantes)", type: 'text' }
      ]
    },
  ]),

  REHABIL: combineSchemas("Rehabilitación Oral", [
    {
      key: "rehabil_specifics",
      label: "3. Plan de Rehabilitación Oral",
      fields: [
        { key: "edentulismType", label: "Tipo de Edentulismo", type: 'text' },
        { key: "prosthesisType", label: "Tipo de Prótesis (Fija, Removible, Implantes)", type: 'text' }
      ]
    },
  ]),

  IMPLANT: combineSchemas("Implantología", [
    {
      key: "implant_specifics",
      label: "3. Plan de Implantología",
      fields: [
        { key: "implantLocation", label: "Ubicación del Implante (Número de Pieza)", type: 'text' },
        { key: "boneGrafting", label: "Necesidad de Injerto Óseo", type: 'checkbox' }
      ]
    },
  ]),

  // 9. Administración y Salud Pública
  MED_LAB: combineSchemas("Medicina del Trabajo", [
    {
      key: "medlab_specifics",
      label: "3. Evaluación Ocupacional",
      fields: [
        { key: "jobExposure", label: "Exposición a Riesgos Laborales", type: 'text' },
        { key: "fitToWork", label: "Apto para el Trabajo (Si/No/Restricciones)", type: 'text' }
      ]
    },
  ]),

  MED_FOR: combineSchemas("Medicina Forense", [
    {
      key: "medfor_specifics",
      label: "3. Evaluación Legal y Causa",
      fields: [
        { key: "injuries", label: "Hallazgos de Lesiones (Tipo y Causa Presunta)", type: 'textarea' },
        { key: "causeOfDeath", label: "Causa de Muerte (si aplica)", type: 'text' }
      ]
    },
  ]),

  TOXICO: combineSchemas("Toxicología", [
    {
      key: "toxico_specifics",
      label: "3. Evaluación Toxicológica",
      fields: [
        { key: "substance", label: "Sustancia o Toxina Identificada", type: 'text' },
        { key: "concentration", label: "Concentración en Sangre/Orina", type: 'text' }
      ]
    },
  ]),

  EPIDEMIO: combineSchemas("Epidemiología", [
    {
      key: "epidemio_specifics",
      label: "3. Análisis Epidemiológico",
      fields: [
        { key: "caseDefinition", label: "Definición de Caso (Sospechoso/Confirmado)", type: 'text' },
        { key: "incidence", label: "Tasa de Incidencia/Prevalencia", type: 'text' }
      ]
    },
  ]),

  SALUD_OCUP: combineSchemas("Salud Ocupacional", [
    {
      key: "saludocup_specifics",
      label: "3. Vigilancia de la Salud",
      fields: [
        { key: "riskAssessment", label: "Evaluación de Riesgos Ergonómicos/Psicosociales", type: 'text' },
        { key: "preventionMeasures", label: "Medidas Preventivas Sugeridas", type: 'textarea' }
      ]
    },
  ]),

  GESTION: combineSchemas("Gestión Sanitaria", [
    {
      key: "gestion_specifics",
      label: "3. Evaluación de Procesos",
      fields: [
        { key: "qualityIndicator", label: "Indicador de Calidad Relevante (Ej. Tiempos de espera)", type: 'text' },
        { key: "resourceAllocation", label: "Asignación de Recursos", type: 'text' }
      ]
    },
  ]),
};