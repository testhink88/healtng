// src/mock/patients.js
export const MOCK_PATIENTS = [
  { id: '1',  name: 'María Elena González',   docId: 'V-12345678', age: 39, gender: 'Femenino', specialty: 'Medicina General', doctor: 'Dr. Pérez', lastVisit: '2025-01-14', email: 'maria@email.com', bloodType: 'O+', dateOfBirth: '1985-03-15' },
  { id: '2',  name: 'Carlos López Martín',    docId: 'V-87654321', age: 58, gender: 'Masculino', specialty: 'Medicina General', doctor: 'Dr. Pérez', lastVisit: '2025-01-11', email: 'carlos@email.com' },
  // ... (Asegúrate de incluir los 16 registros aquí)
  { id: '11', name: 'Valentina Bravo',        docId: 'V-44556677', age: 22, gender: 'Femenino', specialty: 'Medicina General', doctor: 'Dr. Pérez', lastVisit: '2025-01-18', email: 'valentina@email.com', bloodType: 'A+', dateOfBirth: '2003-05-20' },
  { id: '16', name: 'Lucía Navarro',          docId: 'V-77889900', age: 6,  gender: 'Femenino', specialty: 'Pediatría', doctor: 'Dra. López', lastVisit: '2025-01-10' },
];

// Función de búsqueda robusta (compara strings siempre)
export const getPatientById = (id) => MOCK_PATIENTS.find(p => String(p.id) === String(id));