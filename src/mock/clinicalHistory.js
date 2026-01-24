// src/mock/clinicalHistory.js
export const MOCK_DIAGNOSES = [
  // Diagnósticos de María Elena (ID: 1)
  { id: 'DX-001', patientId: '1', condition: 'Hipertensión Arterial', status: 'Descompensado', severity: 'high', diagnosisDate: '2025-01-14', type: 'Crónico' },
  // Diagnósticos de Carlos López (ID: 2)
  { id: 'DX-002', patientId: '2', condition: 'Diabetes Mellitus Tipo 2', status: 'Controlado', severity: 'medium', diagnosisDate: '2025-01-11', type: 'Crónico' },
  // Diagnósticos de Elena Martínez (ID: 3)
  { id: 'DX-003', patientId: '3', condition: 'Asma Bronquial', status: 'Controlado', severity: 'low', diagnosisDate: '2025-01-17', type: 'Crónico' },
  // Diagnósticos de Roberto Fernández (ID: 4)
  { id: 'DX-004', patientId: '4', condition: 'Cardiopatía Isquémica', status: 'Seguimiento', severity: 'high', diagnosisDate: '2025-01-19', type: 'Crónico' },
];

export const MOCK_TREATMENTS = [
  { id: 'TX-001', patientId: '1', name: 'Losartán Potásico', dosage: '50mg', status: 'Activo', adherenceRate: 65, nextRefill: '2025-02-14', startDate: '2025-01-14' },
  { id: 'TX-002', patientId: '2', name: 'Metformina', dosage: '850mg', status: 'Activo', adherenceRate: 92, nextRefill: '2025-02-11', startDate: '2025-01-11' },
];