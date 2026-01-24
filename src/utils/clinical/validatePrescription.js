// src/utils/clinical/validatePrescription.js
import { DRUGS } from "@/mock/drugs";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

export function validatePrescription({ patient, meds }) {
  const warnings = [];
  const blocks = [];

  const allergies = (patient?.allergies || []).map(normalize);
  const currentMeds = (patient?.currentMedications || []).map(normalize);

  meds.forEach((m) => {
    const drug = DRUGS.find((d) => d.id === m.drug_id);
    if (!drug) return;

    // Alergias (hard block si coincide)
    const allergyTags = (drug.allergy_tags || []).map(normalize);
    const allergyHit = allergyTags.some((tag) => allergies.some((a) => a.includes(tag)));
    if (allergyHit) {
      blocks.push({
        code: "ALLERGY_BLOCK",
        message: `Alergia posible: ${drug.name}. Revisa alergias antes de prescribir.`,
        drug_id: drug.id,
        severity: "high",
      });
    }

    // Contraindicaciones (warning)
    const contra = (drug.contraindications || []).map(normalize);
    // ejemplo simple: si paciente está embarazada (si luego agregas ese dato)
    if (contra.includes("embarazo") && normalize(patient?.pregnancy_status) === "embarazada") {
      blocks.push({
        code: "CONTRA_PREGNANCY",
        message: `${drug.name} contraindicado en embarazo.`,
        drug_id: drug.id,
        severity: "high",
      });
    }

    // Interacciones (mock): si el paciente ya toma “metformina” y prescribes algo “X”
    // Aquí lo dejo como warning simple por string match (luego lo haces por ATC/compound).
    if (drug.name && currentMeds.some((cm) => cm.includes(normalize(drug.name)))) {
      warnings.push({
        code: "DUPLICATE_THERAPY",
        message: `Posible duplicidad: paciente ya usa ${drug.name}.`,
        drug_id: drug.id,
        severity: "medium",
      });
    }
  });

  return { warnings, blocks, ok: blocks.length === 0 };
}
