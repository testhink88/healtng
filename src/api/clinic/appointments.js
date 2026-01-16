// src/api/clinic/appointments.js
export const fetchAppointmentsByClinic = async (clinicId) => {
  // Simulando la llamada API
  return [
    {
      id: "AP-2026-001",
      clinic_id: clinicId,
      patient_name: "Juan Pérez",
      professional_name: "Dr. Rafael",
      status: "confirmed",
      date: "2026-01-10",
      amount: 150.0,
    },
    {
      id: "AP-2026-002",
      clinic_id: clinicId,
      patient_name: "María González",
      professional_name: "Dra. Ana",
      status: "pending",
      date: "2026-01-15",
      amount: 200.0,
    },
  ];
};
