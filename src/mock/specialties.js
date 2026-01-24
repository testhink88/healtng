// src/mock/specialties.js

/**
 * Catálogo Maestro de Especialidades y Subespecialidades - Healtng 2026
 * Estructura: id (String), label (String), group (String), parent (String|null)
 */

export const SPECIALTIES = [
  // --- MEDICINA INTERNA Y SUBESPECIALIDADES ---
  { id: "INT_GEN", label: "Medicina Interna", group: "Médica", parent: null },
  { id: "INT_CAR", label: "Cardiología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_CAR_INT", label: "Cardiología Intervencionista", group: "Médica", parent: "INT_CAR" },
  { id: "INT_CAR_ELE", label: "Electrofisiología Cardíaca", group: "Médica", parent: "INT_CAR" },
  { id: "INT_END", label: "Endocrinología y Metabolismo", group: "Médica", parent: "INT_GEN" },
  { id: "INT_GAS", label: "Gastroenterología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_GAS_END", label: "Endoscopia Digestiva", group: "Médica", parent: "INT_GAS" },
  { id: "INT_GER", label: "Geriatría", group: "Médica", parent: "INT_GEN" },
  { id: "INT_HEM", label: "Hematología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_HEM_ONC", label: "Hematoncología", group: "Médica", parent: "INT_HEM" },
  { id: "INT_INF", label: "Infectología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_NEF", label: "Nefrología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_NEU", label: "Neurología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_NEU_EPI", label: "Epileptología", group: "Médica", parent: "INT_NEU" },
  { id: "INT_NEU_PUL", label: "Neumonología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_NEU_SOM", label: "Medicina del Sueño", group: "Médica", parent: "INT_GEN" },
  { id: "INT_ONC", label: "Oncología Médica", group: "Médica", parent: "INT_GEN" },
  { id: "INT_REU", label: "Reumatología", group: "Médica", parent: "INT_GEN" },
  { id: "INT_IMM", label: "Inmunología Clínica y Alergología", group: "Médica", parent: "INT_GEN" },

  // --- CIRUGÍA Y SUBESPECIALIDADES ---
  { id: "SUR_GEN", label: "Cirugía General", group: "Quirúrgica", parent: null },
  { id: "SUR_BAR", label: "Cirugía Bariátrica", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_COL", label: "Coloproctología / Cirugía de Colon y Recto", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_DIG", label: "Cirugía del Aparato Digestivo", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_HEP", label: "Cirugía Hepatobiliar y Pancreática", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_MAM", label: "Mastología / Cirugía de Mama", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_ONC", label: "Cirugía Oncológica", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_PED", label: "Cirugía Pediátrica", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_PLA", label: "Cirugía Plástica y Reconstructiva", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_PLA_EST", label: "Cirugía Estética", group: "Quirúrgica", parent: "SUR_PLA" },
  { id: "SUR_MAX", label: "Cirugía Maxilofacial", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_TOR", label: "Cirugía de Tórax (No Cardíaca)", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_VASC", label: "Cirugía Vascular y Angiología", group: "Quirúrgica", parent: "SUR_GEN" },
  { id: "SUR_CAR", label: "Cirugía Cardiovascular", group: "Quirúrgica", parent: null },
  { id: "SUR_NEU", label: "Neurocirugía", group: "Quirúrgica", parent: null },

  // --- TRAUMATOLOGÍA Y ORTOPEDIA ---
  { id: "ORT_GEN", label: "Traumatología y Ortopedia", group: "Quirúrgica", parent: null },
  { id: "ORT_COL", label: "Cirugía de Columna", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_CAD", label: "Cirugía de Cadera y Pelvis", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_ROD", label: "Cirugía de Rodilla", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_HOM", label: "Cirugía de Hombro y Codo", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_MAN", label: "Cirugía de Mano", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_PIE", label: "Cirugía de Pie y Tobillo", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_INF", label: "Ortopedia Infantil", group: "Quirúrgica", parent: "ORT_GEN" },
  { id: "ORT_ONC", label: "Ortopedia Oncológica", group: "Quirúrgica", parent: "ORT_GEN" },

  // --- GINECOLOGÍA Y OBSTETRICIA ---
  { id: "GOB_GEN", label: "Ginecología y Obstetricia", group: "Médico-Quirúrgica", parent: null },
  { id: "GOB_FER", label: "Especialista en Fertilidad / Endocrinología Reproductiva", group: "Médico-Quirúrgica", parent: "GOB_GEN" },
  { id: "GOB_ONC", label: "Ginecología Oncológica", group: "Médico-Quirúrgica", parent: "GOB_GEN" },
  { id: "GOB_PER", label: "Medicina Materno-Fetal (Perinatología)", group: "Médico-Quirúrgica", parent: "GOB_GEN" },
  { id: "GOB_Uro", label: "Uroginecología", group: "Médico-Quirúrgica", parent: "GOB_GEN" },
  { id: "GOB_ADO", label: "Ginecología Infanto-Juvenil", group: "Médico-Quirúrgica", parent: "GOB_GEN" },

  // --- PEDIATRÍA Y SUS SUBESPECIALIDADES ---
  { id: "PED_GEN", label: "Pediatría y Puericultura", group: "Pediatría", parent: null },
  { id: "PED_NEO", label: "Neonatología", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_CAR", label: "Cardiología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_END", label: "Endocrinología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_GAS", label: "Gastroenterología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_HEM", label: "Hematología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_INF", label: "Infectología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_NEF", label: "Nefrología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_NEU", label: "Neurología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_ONC", label: "Oncología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_NEU_PUL", label: "Neumonología Pediátrica", group: "Pediatría", parent: "PED_GEN" },
  { id: "PED_REU", label: "Reumatología Pediátrica", group: "Pediatría", parent: "PED_GEN" },

  // --- ESPECIALIDADES MÉDICO-QUIRÚRGICAS ---
  { id: "DERM", label: "Dermatología", group: "Médico-Quirúrgica", parent: null },
  { id: "DERM_ONC", label: "Dermatología Oncológica", group: "Médico-Quirúrgica", parent: "DERM" },
  { id: "DERM_PED", label: "Dermatología Pediátrica", group: "Médico-Quirúrgica", parent: "DERM" },
  { id: "URO", label: "Urología", group: "Médico-Quirúrgica", parent: null },
  { id: "URO_ONC", label: "Urología Oncológica", group: "Médico-Quirúrgica", parent: "URO" },
  { id: "URO_PED", label: "Urología Pediátrica", group: "Médico-Quirúrgica", parent: "URO" },
  { id: "OPH", label: "Oftalmología", group: "Médico-Quirúrgica", parent: null },
  { id: "OPH_RET", label: "Retinología", group: "Médico-Quirúrgica", parent: "OPH" },
  { id: "OPH_GLA", label: "Glaucoma", group: "Médico-Quirúrgica", parent: "OPH" },
  { id: "OPH_PED", label: "Oftalmología Pediátrica", group: "Médico-Quirúrgica", parent: "OPH" },
  { id: "OPH_COR", label: "Córnea y Segmento Anterior", group: "Médico-Quirúrgica", parent: "OPH" },
  { id: "OPH_OCU", label: "Oculoplastia", group: "Médico-Quirúrgica", parent: "OPH" },
  { id: "ORL", label: "Otorrinolaringología", group: "Médico-Quirúrgica", parent: null },
  { id: "ORL_PED", label: "Otorrinolaringología Pediátrica", group: "Médico-Quirúrgica", parent: "ORL" },
  { id: "ORL_RIN", label: "Rinología y Cirugía Facial", group: "Médico-Quirúrgica", parent: "ORL" },

  // --- SALUD MENTAL ---
  { id: "PSY_ADU", label: "Psiquiatría (Adultos)", group: "Salud Mental", parent: null },
  { id: "PSY_INF", label: "Psiquiatría Infantil y de la Adolescencia", group: "Salud Mental", parent: "PSY_ADU" },
  { id: "PSY_GER", label: "Psicogeriatría", group: "Salud Mental", parent: "PSY_ADU" },
  { id: "PSY_ADD", label: "Psiquiatría de las Adicciones", group: "Salud Mental", parent: "PSY_ADU" },
  { id: "PSYC_CLIN", label: "Psicología Clínica", group: "Salud Mental", parent: null },
  { id: "PSYC_NEU", label: "Neuropsicología", group: "Salud Mental", parent: "PSYC_CLIN" },

  // --- MEDICINA PRIMARIA Y EMERGENCIA ---
  { id: "GEN_GP", label: "Medicina General", group: "Primaria", parent: null },
  { id: "GEN_INT", label: "Medicina Integral Comunitario", group: "Primaria", parent: null },
  { id: "GEN_FAM", label: "Medicina Familiar", group: "Primaria", parent: null },
  { id: "EME", label: "Medicina de Emergencia y Desastres", group: "Primaria", parent: null },

  // --- APOYO DIAGNÓSTICO Y TERAPÉUTICO ---
  { id: "ANES", label: "Anestesiología", group: "Apoyo", parent: null },
  { id: "ANES_CAR", label: "Anestesiología Cardiovascular", group: "Apoyo", parent: "ANES" },
  { id: "ANES_PED", label: "Anestesiología Pediátrica", group: "Apoyo", parent: "ANES" },
  { id: "ANES_VIV", label: "Medicina del Dolor", group: "Apoyo", parent: "ANES" },
  { id: "RAD_GEN", label: "Radiología e Imagenología", group: "Apoyo", parent: null },
  { id: "RAD_INT", label: "Radiología Intervencionista", group: "Apoyo", parent: "RAD_GEN" },
  { id: "RAD_MAM", label: "Imagenología Mamaria", group: "Apoyo", parent: "RAD_GEN" },
  { id: "RAD_NEU", label: "Neuroradiología", group: "Apoyo", parent: "RAD_GEN" },
  { id: "RAD_PED", label: "Radiología Pediátrica", group: "Apoyo", parent: "RAD_GEN" },
  { id: "MED_NUC", label: "Medicina Nuclear", group: "Apoyo", parent: null },
  { id: "PAT_GEN", label: "Anatomía Patológica", group: "Apoyo", parent: null },
  { id: "PAT_CIT", label: "Citopatología", group: "Apoyo", parent: "PAT_GEN" },
  { id: "LAB_CLIN", label: "Medicina de Laboratorio / Bioanálisis", group: "Apoyo", parent: null },
  { id: "LAB_GEN", label: "Genética Médica", group: "Apoyo", parent: null },

  // --- ESPECIALIDADES DE REHABILITACIÓN Y OTRAS ---
  { id: "PHY", label: "Fisiatría y Rehabilitación", group: "Rehabilitación", parent: null },
  { id: "PHY_DEP", label: "Medicina del Deporte", group: "Rehabilitación", parent: null },
  { id: "NUT_CLIN", label: "Nutrición Clínica", group: "Otras", parent: null },
  { id: "PALI", label: "Medicina Paliativa", group: "Otras", parent: null },
  { id: "TOX", label: "Toxicología Clínica", group: "Otras", parent: null },
  { id: "MED_TRA", label: "Medicina del Trabajo / Ocupacional", group: "Otras", parent: null },
  { id: "MED_FOR", label: "Medicina Forense", group: "Otras", parent: null },
  { id: "MED_AER", label: "Medicina Aeroespacial", group: "Otras", parent: null },
  { id: "ADM_SAN", label: "Gerencia Pública y Administración de Salud", group: "Otras", parent: null }
];