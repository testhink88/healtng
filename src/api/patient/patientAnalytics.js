// src/api/patientAnalytics.js

const LATENCY = 150;
const delay = () => new Promise((r) => setTimeout(r, LATENCY));

/**
 * Uso del paciente (mock)
 */
export async function fetchPatientUsageMetrics({ patientId, dateRange }) {
  await delay();
  return {
    patient_id: patientId,
    date_range: dateRange,
    logins: 5,
    appointments: 2,
    orders: 3,
  };
}

/**
 * Snapshot mini de paciente (opcional, listo para crecer)
 */
export async function getPatientDashboardSnapshot(patientId) {
  await delay();
  return {
    patientId: patientId ?? null,
    activeAppointments: 1,
    prescriptionsActive: 2,
    ordersInProgress: 1,
  };
}
