// src/pages/new-prescription-form/components/MedicationSearch.jsx
import React, { useEffect, useMemo, useState } from "react";
import Icon from "@/components/AppIcon";
import Input from "@/components/ui/Input";

// Mini catálogo mock (luego lo reemplazas por src/mock/drugs.js o API)
const MOCK_DRUGS = [
  { id: "paracetamol_500", name: "Paracetamol", strength: "500mg", type: "Analgésico", compound: "paracetamol" },
  { id: "ibuprofeno_600", name: "Ibuprofeno", strength: "600mg", type: "AINE", compound: "ibuprofen" },
  { id: "amoxicilina_500", name: "Amoxicilina", strength: "500mg", type: "Antibiótico", compound: "amoxicillin" },
  { id: "metformina_850", name: "Metformina", strength: "850mg", type: "Antidiabético", compound: "metformin" },
  { id: "losartan_50", name: "Losartán", strength: "50mg", type: "Antihipertensivo", compound: "losartan" },
  { id: "omeprazol_20", name: "Omeprazol", strength: "20mg", type: "Gastroprotector", compound: "omeprazole" },
  { id: "atorvastatina_20", name: "Atorvastatina", strength: "20mg", type: "Estatina", compound: "atorvastatin" },
  { id: "amlodipino_5", name: "Amlodipino", strength: "5mg", type: "Antihipertensivo", compound: "amlodipine" },
];

// Interacciones mock (por compound). Luego lo conectas a un motor real.
const MOCK_INTERACTIONS = [
  { with: "metformin", severity: "moderate", message: "Puede potenciar el efecto hipoglucémico (vigilar glucemia)." },
  { with: "ibuprofen", severity: "moderate", message: "Riesgo renal si hay comorbilidad/edad; vigilar función renal." },
];

// Alergias mock por palabra (rápido y sucio; luego lo normalizas)
const ALLERGY_KEYWORDS = [
  { key: "penicilina", match: ["amoxicillin", "penicillin"] },
  { key: "sulfonamidas", match: ["sulfa"] },
];

export default function MedicationSearch({ value, onChange, patient }) {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [warnings, setWarnings] = useState([]);

  const currentMedsText = useMemo(
    () => (patient?.currentMedications || []).join(" | ").toLowerCase(),
    [patient]
  );

  useEffect(() => {
    const q = (value || "").trim().toLowerCase();
    if (q.length >= 2) {
      const filtered = MOCK_DRUGS.filter((d) =>
        `${d.name} ${d.strength}`.toLowerCase().includes(q)
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [value]);

  const buildWarnings = (drug) => {
    const w = [];

    // 1) Alergias (simple)
    const patientAllergies = (patient?.allergies || []).map((a) => String(a).toLowerCase());
    for (const rule of ALLERGY_KEYWORDS) {
      const hasAllergy = patientAllergies.some((a) => a.includes(rule.key));
      const matchesDrug = rule.match.includes(drug.compound);
      if (hasAllergy && matchesDrug) {
        w.push({
          type: "allergy",
          severity: "high",
          title: "Alergia detectada",
          message: `El paciente reporta alergia a ${rule.key}. Este fármaco puede estar relacionado.`,
        });
      }
    }

    // 2) Interacciones (mock contra meds actuales)
    for (const itx of MOCK_INTERACTIONS) {
      const matchesCurrent = currentMedsText.includes(itx.with);
      if (matchesCurrent) {
        w.push({
          type: "interaction",
          severity: itx.severity,
          title: "Posible interacción",
          message: itx.message,
        });
      }
    }

    return w;
  };

  const handleSelectMedication = (drug) => {
    const fullName = `${drug.name} ${drug.strength}`;
    onChange(fullName);
    setShowResults(false);

    const w = buildWarnings(drug);
    setWarnings(w);
  };

  const WarningBox = ({ items }) => {
    if (!items?.length) return null;

    const hasHigh = items.some((x) => x.severity === "high");
    return (
      <div className={`mt-3 p-3 rounded-lg border ${hasHigh ? "bg-destructive/10 border-destructive/20" : "bg-warning/10 border-warning/20"}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Icon name={hasHigh ? "ShieldAlert" : "AlertTriangle"} size={16} className={hasHigh ? "text-destructive" : "text-warning"} />
          <span className={`text-sm font-medium ${hasHigh ? "text-destructive" : "text-warning"}`}>
            Alertas clínicas (mock)
          </span>
        </div>

        <div className="space-y-2">
          {items.map((x, i) => (
            <div key={i} className="text-sm">
              <div className={`font-medium ${hasHigh ? "text-destructive" : "text-warning"}`}>{x.title}</div>
              <div className={`${hasHigh ? "text-destructive/90" : "text-warning/90"}`}>{x.message}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        Buscar Medicamento <span className="text-destructive">*</span>
      </label>

      <div className="relative">
        <Icon
          name="Search"
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e?.target?.value)}
          placeholder="Escriba el nombre del medicamento..."
          className="pl-10"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((drug) => (
            <button
              type="button"
              key={drug.id}
              onClick={() => handleSelectMedication(drug)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{drug.name} {drug.strength}</div>
                  <div className="text-sm text-muted-foreground">{drug.type}</div>
                </div>
                <Icon name="Plus" size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}

      <WarningBox items={warnings} />
    </div>
  );
}
