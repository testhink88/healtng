// src/utils/persistence.js
export const saveToSystem = (newPatient, newAppointment) => {
  // 1. Guardar en Directorio
  const patients = JSON.parse(localStorage.getItem("HEALTNG_PATIENTS") || "[]");
  if (!patients.find(p => p.docId === newPatient.docId)) {
    localStorage.setItem("HEALTNG_PATIENTS", JSON.stringify([...patients, newPatient]));
  }
  
  // 2. Guardar en Agenda
  const appointments = JSON.parse(localStorage.getItem("HEALTNG_APPOINTMENTS") || "[]");
  localStorage.setItem("HEALTNG_APPOINTMENTS", JSON.stringify([...appointments, newAppointment]));
};