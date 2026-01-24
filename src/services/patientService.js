// src/services/patientService.js
import { MOCK_PATIENTS } from "@/mock/patients"; // Tu data inicial

const STORAGE_KEY = "MOCK_PATIENTS";

// 1. OBTENER PACIENTES (Mezcla LocalStorage con Mock inicial)
export const getPatients = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  if (!localData) {
    // Si está vacío, iniciamos con los mocks
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PATIENTS));
    return MOCK_PATIENTS;
  }
  return JSON.parse(localData);
};

// 2. CREAR NUEVO PACIENTE (Desde la Asistente)
export const createPatient = (patientData) => {
  const patients = getPatients();
  const newPatient = {
    id: `p-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "waiting", // El estado inicial clave
    ...patientData,
    // Aseguramos estructura mínima
    diagnoses: [],
    medications: []
  };
  
  const updatedList = [newPatient, ...patients];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  return newPatient;
};

// 3. CAMBIAR ESTATUS (El semáforo entre Secretaria y Médico)
// Status posibles: 'scheduled', 'waiting' (Sala Espera), 'in_progress' (Consultorio), 'finished'
export const updatePatientStatus = (id, newStatus) => {
  const patients = getPatients();
  const updatedList = patients.map(p => 
    String(p.id) === String(id) ? { ...p, status: newStatus } : p
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
};

// 4. BUSCAR (Para el check-in)
export const searchPatients = (query) => {
  const patients = getPatients();
  if (!query) return patients;
  
  const lowerQ = query.toLowerCase();
  return patients.filter(p => 
    p.fullName?.toLowerCase().includes(lowerQ) || 
    p.dni?.includes(query)
  );
};