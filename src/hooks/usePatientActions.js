// src/hooks/usePatientActions.js
export const usePatientActions = () => {
  const savePatientAndAppointment = (payload) => {
    // 1. Extraer o crear paciente
    const allPatients = JSON.parse(localStorage.getItem("HEALTNG_PATIENTS") || "[]");
    
    const patientExists = allPatients.find(p => p.docId === payload.docId);
    
    if (!patientExists) {
      const newPatient = {
        id: payload.patientId,
        name: payload.name,
        docId: payload.docId,
        age: payload.age,
        gender: payload.gender,
        history: [] // Iniciamos historia clínica vacía
      };
      localStorage.setItem("HEALTNG_PATIENTS", JSON.stringify([...allPatients, newPatient]));
    }

    // 2. Registrar Cita
    const allAppointments = JSON.parse(localStorage.getItem("HEALTNG_APPOINTMENTS") || "[]");
    localStorage.setItem("HEALTNG_APPOINTMENTS", JSON.stringify([...allAppointments, payload]));
    
    return true;
  };

  return { savePatientAndAppointment };
};