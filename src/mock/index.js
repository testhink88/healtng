// src/mock/index.js
import { MOCK_PATIENTS } from './patients';

export const getPatientById = (id) => {
  // Forzamos a String ambos valores para evitar el error de Number vs String
  return MOCK_PATIENTS.find(p => String(p.id) === String(id));
};