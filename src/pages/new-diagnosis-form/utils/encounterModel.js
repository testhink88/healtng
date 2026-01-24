export function createEncounterDraft({ patientId, doctorId = "dr-001" }) {
  return {
    encounterId: `enc-${Date.now()}`,
    patientId: patientId || null,
    doctorId: doctorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialtyCode: "Medicina General", 
    
    data: {
      // Núcleo Clínico
      main_diagnosis_cie10: null,
      prescriptions: [],
      medicalReport: "",
      followUpDate: "",
      
      // ANTECEDENTES (Puntos 2 y 3)
      surgicalHistory: { hasHistory: false, detail: "" },
      currentMedications: { hasHistory: false, detail: "" }, // Punto 2
      
      // PARACLÍNICOS (Punto 4)
      attachments: [], // Array de { id, name, type, url, uploadedBy: 'assistant' }
      
      // ONCOLOGÍA (Punto 9)
      tnm_staging: { t: "", n: "", m: "" }
    },

    status: "draft",
    createdBy: "assistant", // o 'doctor'
  };
}