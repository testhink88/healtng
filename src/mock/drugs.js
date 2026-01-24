// src/mock/drugs.js
export const DRUGS = [
  { id: "paracetamol_500_tab", name: "Paracetamol", strength: "500mg", form: "Tabletas", atc: "N02BE01" },
  { id: "ibuprofeno_600_tab", name: "Ibuprofeno", strength: "600mg", form: "Tabletas", atc: "M01AE01" },
  { id: "amoxicilina_500_cap", name: "Amoxicilina", strength: "500mg", form: "Cápsulas", atc: "J01CA04", allergyTag: "penicilina" },
  { id: "metformina_850_tab", name: "Metformina", strength: "850mg", form: "Tabletas", atc: "A10BA02" },
  { id: "losartan_50_tab", name: "Losartán", strength: "50mg", form: "Tabletas", atc: "C09CA01" },
  { id: "amlodipino_5_tab", name: "Amlodipino", strength: "5mg", form: "Tabletas", atc: "C08CA01" },
];

// Interacciones mock por ATC (simplificado)
export const DRUG_INTERACTIONS = [
  {
    a_atc: "A10BA02", // metformina
    b_atc: "C09CA01", // losartan
    severity: "moderate",
    message: "Monitorizar función renal y riesgo de hipotensión/hipoglucemia en ajustes."
  }
];

// Contraindicaciones mock por “tags”
export const DRUG_CONTRAINDICATIONS = [
  {
    drug_id: "amoxicilina_500_cap",
    contraindication: "Alergia a penicilinas",
    tag: "penicilina",
    severity: "high",
  }
];
