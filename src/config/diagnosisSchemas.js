/**
 * src/config/diagnosisSchemas.js
 * CEREBRO CLÍNICO UNIFICADO - HEALTNG
 * Contiene: Opciones Comunes, Secciones Base y Esquemas por Especialidad.
 */

// ==========================================
// 1. OPCIONES CLÍNICAS ESTANDARIZADAS (CONSTANTES)
// ==========================================
export const INTERNAL_COMMON_OPTIONS = {
  triageLevels: [
    { value: "T1", label: "T1 - Reanimación (Riesgo Vital Inmediato)" },
    { value: "T2", label: "T2 - Emergencia (Riesgo Vital Inminente - <10min)" },
    { value: "T3", label: "T3 - Urgencia (Potencial Riesgo - <30min)" },
    { value: "T4", label: "T4 - Menor (Poco Riesgo - <60min)" },
    { value: "T5", label: "T5 - No Urgente (Consulta General)" },
  ],
  nyhaClasses: [
    { value: "I", label: "NYHA I - Sin limitación física" },
    { value: "II", label: "NYHA II - Limitación leve (Disnea grandes esfuerzos)" },
    { value: "III", label: "NYHA III - Limitación marcada (Disnea mínimos esfuerzos)" },
    { value: "IV", label: "NYHA IV - Incapacidad / Disnea en reposo" },
  ],
  glasgowComa: [
    { value: "15", label: "15 - Consciente y Orientado" },
    { value: "13-14", label: "13-14 - Confusión Leve" },
    { value: "9-12", label: "9-12 - Moderado" },
    { value: "3-8", label: "3-8 - Grave (Coma)" },
  ],
  muscleStrength: [
    { value: "5", label: "5/5 - Fuerza Normal" },
    { value: "4", label: "4/5 - Movimiento contra resistencia parcial" },
    { value: "3", label: "3/5 - Movimiento contra gravedad" },
    { value: "2", label: "2/5 - Movimiento sin gravedad" },
    { value: "1", label: "1/5 - Contracción visible sin movimiento" },
    { value: "0", label: "0/5 - Parálisis total" },
  ],
  bristolScale: [
    { value: "1", label: "Tipo 1 - Trozos duros separados" },
    { value: "2", label: "Tipo 2 - Forma de salchicha grumosa" },
    { value: "3", label: "Tipo 3 - Salchicha con grietas" },
    { value: "4", label: "Tipo 4 - Salchicha lisa y suave (Normal)" },
    { value: "5", label: "Tipo 5 - Trozos blandos bordes definidos" },
    { value: "6", label: "Tipo 6 - Pedazos blandos bordes deshechos" },
    { value: "7", label: "Tipo 7 - Acuosa, sin sólidos" },
  ],
  dyspneaScaleMMRC: [
    { value: "0", label: "Grado 0 - Solo al ejercicio intenso" },
    { value: "1", label: "Grado 1 - Al andar rápido o subir pendiente" },
    { value: "2", label: "Grado 2 - Incapacidad de mantener paso de otros" },
    { value: "3", label: "Grado 3 - Parar a descansar cada 100m" },
    { value: "4", label: "Grado 4 - Al vestirse o desvestirse" },
  ],
  fitzpatrickSkin: [
    { value: "I", label: "Tipo I - Siempre se quema, nunca se broncea" },
    { value: "II", label: "Tipo II - Generalmente se quema" },
    { value: "III", label: "Tipo III - A veces se quema" },
    { value: "IV", label: "Tipo IV - Rara vez se quema" },
    { value: "V", label: "Tipo V - Piel oscura moderada" },
    { value: "VI", label: "Tipo VI - Piel negra, nunca se quema" },
  ],
  tannerStages: [
    { value: "I", label: "Estadio I (Prepuberal)" },
    { value: "II", label: "Estadio II (Botón mamario / Aumento testicular)" },
    { value: "III", label: "Estadio III (Crecimiento vello oscuro)" },
    { value: "IV", label: "Estadio IV (Tipo adulto menor cantidad)" },
    { value: "V", label: "Estadio V (Adulto maduro)" },
  ],
  painScale: [
    { value: "0", label: "0 - Sin dolor" },
    { value: "2", label: "2 - Leve" },
    { value: "4", label: "4 - Moderado" },
    { value: "6", label: "6 - Severo" },
    { value: "8", label: "8 - Muy Severo" },
    { value: "10", label: "10 - Insoportable" },
  ],
  contraceptiveMethods: [
    { value: "NONE", label: "Ninguno" },
    { value: "ORAL", label: "Anticonceptivos Orales" },
    { value: "IUD", label: "DIU (Cobre/Hormonal)" },
    { value: "IMPLANT", label: "Implante Subdérmico" },
    { value: "CONDOM", label: "Preservativo" },
    { value: "SURGICAL", label: "Quirúrgico (Ligadura/Vasectomía)" },
  ],
  childPughClasses: [
    { value: "A", label: "Clase A (Función Hepática Bien Compensada)" },
    { value: "B", label: "Clase B (Compromiso Funcional Moderado)" },
    { value: "C", label: "Clase C (Compromiso Funcional Grave)" },
  ],
  anesthesiaTypes: [
    { value: "GENERAL", label: "General" },
    { value: "REGIONAL", label: "Regional (Espinal/Epidural)" },
    { value: "LOCAL", label: "Local" },
    { value: "SEDATION", label: "Sedación Consciente" },
  ],

  // =========================================================
  // Opciones TNM (Obligatorio)
  // =========================================================
  tnmStaging: {
    t: ["X", "0", "is", "1", "2", "3", "4"],
    n: ["X", "0", "1", "2", "3"],
    m: ["X", "0", "1"],
  },

  // ECOG (Oncología Médica)
  ecogStatus: [
    { value: "0", label: "ECOG 0 - Asintomático / totalmente activo" },
    { value: "1", label: "ECOG 1 - Limitación leve, deambula" },
    { value: "2", label: "ECOG 2 - Ambulatorio >50% del día, no trabaja" },
    { value: "3", label: "ECOG 3 - En cama/silla >50% del día" },
    { value: "4", label: "ECOG 4 - Postrado" },
  ],
};

// ==========================================
// 2. SECCIONES BASE (OBLIGATORIAS PARA TODOS)
// ==========================================
export const BASE_DIAGNOSIS_SECTIONS = [
  {
    key: "evolution",
    label: "Nota de Evolución y Hallazgos",
    fields: [
      { 
        key: "clinical_note", 
        label: "Evolución Médica", 
        type: "textarea", 
        placeholder: "Describe libremente la evolución del paciente, síntomas y hallazgos físicos. Usa el micrófono para dictado rápido con IA...",
        rows: 15,
        fullWidth: true,
        required: true
      },
    ]
  },
  {
    key: "diagnosis_plan",
    label: "Conclusión y Tratamiento",
    fields: [
      { key: "main_diagnosis_cie10", label: "Diagnóstico Principal (CIE-10)", type: "cie10_search", required: true },
      { 
        key: "treatment_plan", 
        label: "Indicaciones y Plan", 
        type: "textarea", 
        rows: 4, 
        placeholder: "Medicamentos, dosis, estudios solicitados...",
        fullWidth: true
      },
    ],
  },
];

// Inserta secciones específicas antes de diagnosis_plan
const combineSchemas = (name, specificSections = []) => {
  const finalSections = [...BASE_DIAGNOSIS_SECTIONS];
  finalSections.splice(1, 0, ...specificSections);
  return { name, sections: finalSections };
};

// ==========================================
// 3. PLANTILLAS GENÉRICAS (FALLBACKS)
// ==========================================
const STANDARD_CLINICAL = (name) =>
  combineSchemas(name, [
    {
      key: "std_clinical",
      label: `3. Evaluación Específica de ${name}`,
      fields: [{ key: "specific_findings", label: "Hallazgos Clínicos Relevantes", type: "textarea", rows: 4 }],
    },
  ]);

// Se mantiene para cirugías de baja prioridad tumoral (NO se usa en las especialidades que actualizamos abajo)
const STANDARD_SURGICAL = (name) =>
  combineSchemas(name, [
    {
      key: "std_surgical",
      label: `3. Evaluación Quirúrgica - ${name}`,
      fields: [
        { key: "surgical_indication", label: "Indicación Quirúrgica", type: "checkbox", description: "Paciente candidato a cirugía" },
        { key: "local_exam", label: "Examen Local / Zona Afectada", type: "textarea", rows: 3 },
      ],
    },
  ]);

// ==========================================
// 3.1 HELPERS ONCO (TNM)
// ==========================================
const TNM_SECTION = (label = "Clasificación Tumoral (TNM)") => ({
  key: "tnm_staging",
  label,
  fields: [
    {
      key: "tnm",
      label: "TNM (T / N / M)",
      type: "tnm_staging",
      options: INTERNAL_COMMON_OPTIONS.tnmStaging,
      helperText: "Selecciona T, N y M según el estadio clínico. (X = no evaluable)",
      fullWidth: true, // IMPORTANTE: debe ocupar toda la fila
    },
  ],
});

// ==========================================
// 4. MAPEO MAESTRO (SQL -> SCHEMA)
// ==========================================
export const SPECIALTY_DIAGNOSIS_SCHEMAS = {
  // --- GRUPO 1: CLÍNICO GENERAL ---
  "Medicina Interna": STANDARD_CLINICAL("Medicina Interna"),
  "Medicina General": combineSchemas("Medicina General"),
  "Medicina Familiar": STANDARD_CLINICAL("Medicina Familiar"),
  "Geriatría": combineSchemas("Geriatría", [
    {
      key: "geri_eval",
      label: "3. Valoración Geriátrica",
      fields: [
        { key: "functionality", label: "Funcionalidad/Barthel", type: "text" },
        { key: "cognitive", label: "Cognitivo/Minimental", type: "text" },
      ],
    },
  ]),
  "Medicina Preventiva": STANDARD_CLINICAL("Medicina Preventiva"),
  "Cuidados Paliativos": combineSchemas("Cuidados Paliativos", [
    {
      key: "pali_eval",
      label: "3. Control de Síntomas",
      fields: [{ key: "pain_level", label: "Escala EVA", type: "select", options: INTERNAL_COMMON_OPTIONS.painScale }],
    },
  ]),

  // --- GRUPO 2: ESPECIALIDADES MÉDICAS ---
  "Cardiología": combineSchemas("Cardiología", [
    {
      key: "cardio_eval",
      label: "3. Cardiovascular",
      fields: [
        { key: "nyha", label: "Clase NYHA", type: "select", options: INTERNAL_COMMON_OPTIONS.nyhaClasses },
        { key: "ekg", label: "Electrocardiograma", type: "textarea", placeholder: "Ritmo, eje, isquemia..." },
        {
          key: "edema",
          label: "Edemas",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "+", value: "1" },
            { label: "++", value: "2" },
            { label: "+++", value: "3" },
          ],
        },
      ],
    },
  ]),

  // Neumología: auscultación + TNM
  "Neumología": combineSchemas("Neumología", [
    {
      key: "neumo_eval",
      label: "3. Pulmonar",
      fields: [
        {
          key: "auscultation",
          label: "Auscultación",
          type: "select",
          options: [
            { label: "Normal", value: "OK" },
            { label: "Sibilantes", value: "SIB" },
            { label: "Crepitantes", value: "CREP" },
          ],
        },
        { key: "dyspnea", label: "Disnea (mMRC)", type: "select", options: INTERNAL_COMMON_OPTIONS.dyspneaScaleMMRC },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Torácicos/Pulmonares"),
  ]),

  // Gastroenterología: palpación abdominal + TNM
  "Gastroenterología": combineSchemas("Gastroenterología", [
    {
      key: "gastro_eval",
      label: "3. Digestivo",
      fields: [
        { key: "abdomen_palpation", label: "Palpación Abdominal", type: "textarea", placeholder: "Dolor, masas, defensa, visceromegalias..." },
        { key: "rectal_exam", label: "Tacto Rectal", type: "text" },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Digestivos"),
  ]),

  "Endocrinología": combineSchemas("Endocrinología", [
    {
      key: "endo_eval",
      label: "3. Metabólico",
      fields: [
        { key: "bmi", label: "IMC Calculado", type: "number" },
        { key: "thyroid", label: "Palpación Tiroides", type: "text" },
      ],
    },
  ]),
  "Nefrología": STANDARD_CLINICAL("Nefrología"),
  "Neurología": combineSchemas("Neurología", [
    {
      key: "neuro_eval",
      label: "3. Neurológico",
      fields: [
        { key: "glasgow", label: "Glasgow", type: "select", options: INTERNAL_COMMON_OPTIONS.glasgowComa },
        { key: "motor", label: "Fuerza Motor", type: "select", options: INTERNAL_COMMON_OPTIONS.muscleStrength },
        { key: "reflexes", label: "Reflejos", type: "text" },
      ],
    },
  ]),
  "Reumatología": STANDARD_CLINICAL("Reumatología"),
  "Hematología": STANDARD_CLINICAL("Hematología"),
  "Infectología": STANDARD_CLINICAL("Infectología"),
  "Inmunología y Alergología": STANDARD_CLINICAL("Inmunología y Alergología"),

  // Dermatología: tipo de lesión + TNM
  "Dermatología": combineSchemas("Dermatología", [
    {
      key: "derma_eval",
      label: "3. Piel y Faneras",
      fields: [
        { key: "lesion_type", label: "Tipo de Lesión", type: "text", placeholder: "Mácula, pápula, placa, nódulo, vesícula..." },
        { key: "lesion_morphology", label: "Morfología / Bordes / Pigmento", type: "textarea", rows: 2 },
        { key: "location", label: "Localización", type: "text" },
      ],
    },
    TNM_SECTION("4. TNM - Lesiones Cutáneas (cuando aplique)"),
  ]),

  // Oncología Médica: TNM + ECOG
  "Oncología Médica": combineSchemas("Oncología Médica", [
    {
      key: "onco_eval",
      label: "3. Estado Funcional y Oncológico",
      fields: [
        { key: "ecog", label: "ECOG", type: "select", options: INTERNAL_COMMON_OPTIONS.ecogStatus, fullWidth: true },
        { key: "tumor_primary_site", label: "Sitio primario / órgano", type: "text" },
        { key: "tumor_notes", label: "Notas oncológicas", type: "textarea", rows: 3 },
      ],
    },
    TNM_SECTION("4. Clasificación Tumoral (TNM)"),
  ]),

  "Medicina Física y Rehabilitación": STANDARD_CLINICAL("Medicina Física y Rehabilitación"),

  // --- GRUPO 3: QUIRÚRGICO ---
  "Cirugía General": STANDARD_SURGICAL("Cirugía General"),
  "Traumatología y Ortopedia": combineSchemas("Traumatología y Ortopedia", [
    {
      key: "trauma_eval",
      label: "3. Osteomuscular",
      fields: [
        { key: "affected_limb", label: "Miembro Afectado", type: "text", required: true },
        { key: "fracture_signs", label: "Signos de Fractura", type: "checkbox" },
        { key: "rom", label: "Arcos de Movimiento", type: "text" },
      ],
    },
  ]),

  // =========================================================
  // ACTUALIZACIÓN FINAL: REEMPLAZAR STANDARD_SURGICAL
  // en cirugías con alta incidencia tumoral + TNM_SECTION
  // =========================================================

  // Neurocirugía: Localización SNC + TNM
  "Neurocirugía": combineSchemas("Neurocirugía", [
    {
      key: "neurosurg_eval",
      label: "3. Hallazgos Neuroquirúrgicos",
      fields: [
        {
          key: "snc_lesion_location",
          label: "Localización de lesión (SNC)",
          type: "text",
          placeholder: "Ej: Frontal izquierdo, cerebelo, tronco, médula (nivel)...",
        },
        {
          key: "neuro_deficits",
          label: "Déficit neurológico / focalidad",
          type: "textarea",
          rows: 2,
          placeholder: "Pares craneales, motor, sensitivo, lenguaje, marcha...",
        },
        {
          key: "neurosurg_plan",
          label: "Plan quirúrgico / conducta",
          type: "textarea",
          rows: 3,
        },
      ],
    },
    TNM_SECTION("4. TNM - Lesiones Tumorales SNC (cuando aplique)"),
  ]),

  "Cirugía Cardiovascular": STANDARD_SURGICAL("Cirugía Cardiovascular"),

  // Cirugía Torácica: Hallazgos pleuro-pulmonares + TNM
  "Cirugía Torácica": combineSchemas("Cirugía Torácica", [
    {
      key: "thoracic_eval",
      label: "3. Hallazgos Torácicos",
      fields: [
        {
          key: "pleuro_pulmonary_findings",
          label: "Hallazgos pleuro-pulmonares",
          type: "textarea",
          rows: 3,
          placeholder: "Masas, derrame, atelectasia, bullas, adenopatías, etc.",
        },
        {
          key: "thoracic_surgical_notes",
          label: "Notas quirúrgicas torácicas",
          type: "textarea",
          rows: 2,
        },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Torácicos"),
  ]),

  // Urología: tacto prostático + TNM
  "Urología": combineSchemas("Urología", [
    {
      key: "uro_eval",
      label: "3. Urogenital",
      fields: [
        { key: "giordano", label: "Giordano (Puñopercusión)", type: "checkbox" },
        { key: "prostate_dre", label: "Tacto Prostático (DRE)", type: "textarea", rows: 2, placeholder: "Tamaño, consistencia, nódulos, dolor..." },
        { key: "uro_notes", label: "Hallazgos urológicos", type: "textarea", rows: 2 },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Urológicos"),
  ]),

  "Otorrinolaringología": combineSchemas("Otorrinolaringología", [
    {
      key: "orl_eval",
      label: "3. Examen ORL Completo",
      fields: [
        { key: "otoscopy_r", label: "Otoscopia Oído Der.", type: "text" },
        { key: "otoscopy_l", label: "Otoscopia Oído Izq.", type: "text" },
        { key: "rhinoscopy", label: "Rinoscopia Anterior", type: "text" },
        { key: "oropharynx", label: "Orofaringe/Amígdalas", type: "text" },
      ],
    },
  ]),
  "Oftalmología": combineSchemas("Oftalmología", [
    {
      key: "oft_eval",
      label: "3. Examen Ocular",
      fields: [
        { key: "av_od", label: "Agudeza Visual OD", type: "text" },
        { key: "av_os", label: "Agudeza Visual OI", type: "text" },
        { key: "fundoscopy", label: "Fondo de Ojo", type: "textarea" },
      ],
    },
  ]),
  "Cirugía Plástica y Reconstructiva": STANDARD_SURGICAL("Cirugía Plástica y Reconstructiva"),

  // Cirugía Pediátrica: Anomalía/Masa palpable + TNM
  "Cirugía Pediátrica": combineSchemas("Cirugía Pediátrica", [
    {
      key: "pedsurg_eval",
      label: "3. Hallazgos Quirúrgicos Pediátricos",
      fields: [
        {
          key: "palpable_anomaly_mass",
          label: "Anomalía / Masa palpable",
          type: "textarea",
          rows: 2,
          placeholder: "Describe localización, tamaño, consistencia, dolor, movilidad...",
        },
        {
          key: "pedsurg_notes",
          label: "Notas quirúrgicas pediátricas",
          type: "textarea",
          rows: 3,
        },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Pediátricos (cuando aplique)"),
  ]),

  // Coloproctología: Hallazgos colon/recto + TNM
  "Coloproctología": combineSchemas("Coloproctología", [
    {
      key: "coloproct_eval",
      label: "3. Hallazgos Coloproctológicos",
      fields: [
        {
          key: "colon_rectum_findings",
          label: "Hallazgos en colon/recto",
          type: "textarea",
          rows: 3,
          placeholder: "Dolor, sangrado, masas, fisuras, hemorroides, tumoración, etc.",
        },
        {
          key: "proctology_exam",
          label: "Examen proctológico / tacto / anoscopia (si aplica)",
          type: "textarea",
          rows: 2,
        },
      ],
    },
    TNM_SECTION("4. TNM - Tumores Colorrectales"),
  ]),

  "Angiología y Cirugía Vascular": combineSchemas("Angiología y Cirugía Vascular", [
    {
      key: "vasc_eval",
      label: "3. Vascular Periférico",
      fields: [
        { key: "pulses", label: "Pulsos Periféricos", type: "text" },
        { key: "varicose", label: "Várices / Flebopatía", type: "text" },
      ],
    },
  ]),
  "Cirugía Oral y Maxilofacial": STANDARD_SURGICAL("Cirugía Oral y Maxilofacial"),
  "Cirugía Bariátrica y Metabólica": STANDARD_SURGICAL("Cirugía Bariátrica y Metabólica"),

  // Mastología: palpación + TNM
  "Mastología": combineSchemas("Mastología", [
    {
      key: "masto_eval",
      label: "3. Examen Mamario",
      fields: [
        { key: "breast_palpation", label: "Palpación / Nódulos", type: "textarea", rows: 3 },
        { key: "nipple_complex", label: "Complejo Areola-Pezón", type: "text" },
        { key: "axillary_nodes", label: "Adenopatías Axilares", type: "text" },
      ],
    },
    TNM_SECTION("4. TNM - Cáncer de Mama"),
  ]),

  // --- GRUPO 4: MATERNO INFANTIL ---
  "Ginecología y Obstetricia": combineSchemas("Ginecología y Obstetricia", [
    {
      key: "gyn_eval",
      label: "3. Gineco-Obstétrico",
      fields: [
        { key: "fum", label: "FUM", type: "date" },
        { key: "gpa", label: "G-P-A-C", type: "text", placeholder: "G0 P0 A0 C0" },
        { key: "fcf", label: "Frecuencia Cardíaca Fetal", type: "number" },
      ],
    },
  ]),
  "Reproducción Humana": STANDARD_CLINICAL("Reproducción Humana"),
  "Pediatría": combineSchemas("Pediatría", [
    {
      key: "ped_eval",
      label: "3. Puericultura",
      fields: [
        { key: "percentiles", label: "Percentiles", type: "text" },
        { key: "vaccines", label: "Esquema Vacunación", type: "select", options: [{ label: "Completo", value: "OK" }, { label: "Incompleto", value: "NO" }] },
      ],
    },
  ]),
  "Neonatología": combineSchemas("Neonatología", [
    {
      key: "neo_eval",
      label: "3. Neonatal",
      fields: [
        { key: "apgar", label: "Apgar", type: "text" },
        { key: "reflexes_neo", label: "Reflejos Arcaicos", type: "text" },
      ],
    },
  ]),

  // --- GRUPO 5: SALUD MENTAL ---
  "Psiquiatría": combineSchemas("Psiquiatría", [
    {
      key: "psiq_eval",
      label: "3. Examen Mental",
      fields: [
        { key: "mood", label: "Estado de Ánimo", type: "text" },
        { key: "thought", label: "Curso del Pensamiento", type: "text" },
        { key: "risk", label: "Riesgo Suicida", type: "checkbox" },
      ],
    },
  ]),
  "Psicología Clínica": STANDARD_CLINICAL("Psicología Clínica"),
  "Psiquiatría Infantil": STANDARD_CLINICAL("Psiquiatría Infantil"),

  // --- GRUPO 6: DIAGNÓSTICO Y SOPORTE ---
  "Anestesiología y Reanimación": combineSchemas("Anestesiología y Reanimación", [
    {
      key: "anest_eval",
      label: "3. Pre-Anestesia",
      fields: [
        { key: "asa", label: "Clasificación ASA", type: "select", options: [{ label: "I", value: "1" }, { label: "II", value: "2" }, { label: "III", value: "3" }, { label: "IV", value: "4" }] },
        { key: "mallampati", label: "Mallampati", type: "text" },
      ],
    },
  ]),
  "Radiología e Imagenología": STANDARD_CLINICAL("Radiología e Imagenología"),
  "Patología Clínica": STANDARD_CLINICAL("Patología Clínica"),
  "Medicina Nuclear": STANDARD_CLINICAL("Medicina Nuclear"),
  "Genética Médica": STANDARD_CLINICAL("Genética Médica"),
  "Medicina de Urgencias": combineSchemas("Medicina de Urgencias", [
    {
      key: "er_eval",
      label: "3. Emergencia",
      fields: [{ key: "triage", label: "Triaje", type: "select", options: INTERNAL_COMMON_OPTIONS.triageLevels }],
    },
  ]),
  "Medicina Intensiva (UCI)": STANDARD_CLINICAL("Medicina Intensiva (UCI)"),

  // --- GRUPO 7: APOYO Y BIENESTAR ---
  "Nutriología y Nutrición": combineSchemas("Nutriología y Nutrición", [
    {
      key: "nutri_eval",
      label: "3. Estado Nutricional",
      fields: [
        { key: "diet_anamnesis", label: "Recordatorio 24h", type: "textarea" },
        { key: "goals", label: "Metas Calóricas", type: "text" },
      ],
    },
  ]),
  "Fonoaudiología": STANDARD_CLINICAL("Fonoaudiología"),
  "Fisioterapia": STANDARD_CLINICAL("Fisioterapia"),
  "Medicina del Deporte": STANDARD_CLINICAL("Medicina del Deporte"),
  "Medicina del Sueño": STANDARD_CLINICAL("Medicina del Sueño"),
  "Medicina del Dolor (Algología)": STANDARD_CLINICAL("Medicina del Dolor (Algología)"),
  "Sexología Médica": STANDARD_CLINICAL("Sexología Médica"),
  "Medicina Estética": STANDARD_CLINICAL("Medicina Estética"),
  "Salud Ocupacional": STANDARD_CLINICAL("Salud Ocupacional"),
};

// ==========================================
// 5. AGRUPACIÓN PARA EL SELECTOR (UI)
// ==========================================
export const SPECIALTY_GROUPS_UI = [
  {
    label: "Clínica General (Adultos)",
    keys: ["Medicina Interna", "Medicina General", "Medicina Familiar", "Geriatría", "Medicina Preventiva", "Cuidados Paliativos"],
  },
  {
    label: "Especialidades Médicas",
    keys: [
      "Cardiología",
      "Neumología",
      "Gastroenterología",
      "Endocrinología",
      "Nefrología",
      "Neurología",
      "Reumatología",
      "Hematología",
      "Infectología",
      "Inmunología y Alergología",
      "Dermatología",
      "Oncología Médica",
      "Medicina Física y Rehabilitación",
    ],
  },
  {
    label: "Bloque Quirúrgico",
    keys: [
      "Cirugía General",
      "Traumatología y Ortopedia",
      "Neurocirugía",
      "Cirugía Cardiovascular",
      "Cirugía Torácica",
      "Urología",
      "Otorrinolaringología",
      "Oftalmología",
      "Cirugía Plástica y Reconstructiva",
      "Cirugía Pediátrica",
      "Coloproctología",
      "Angiología y Cirugía Vascular",
      "Cirugía Oral y Maxilofacial",
      "Cirugía Bariátrica y Metabólica",
      "Mastología",
    ],
  },
  { label: "Materno Infantil", keys: ["Ginecología y Obstetricia", "Reproducción Humana", "Pediatría", "Neonatología"] },
  { label: "Salud Mental", keys: ["Psiquiatría", "Psicología Clínica", "Psiquiatría Infantil"] },
  {
    label: "Diagnóstico y Soporte",
    keys: ["Anestesiología y Reanimación", "Radiología e Imagenología", "Patología Clínica", "Medicina Nuclear", "Genética Médica", "Medicina de Urgencias", "Medicina Intensiva (UCI)"],
  },
  {
    label: "Apoyo y Bienestar",
    keys: [
      "Nutriología y Nutrición",
      "Fonoaudiología",
      "Fisioterapia",
      "Medicina del Deporte",
      "Medicina del Sueño",
      "Medicina del Dolor (Algología)",
      "Sexología Médica",
      "Medicina Estética",
      "Salud Ocupacional",
    ],
  },
];
