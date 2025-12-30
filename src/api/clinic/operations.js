import { delay, safeArray } from "@/api/_mockBase"

/**
 * Snapshot detallado (conceptual)
 * Ideal si luego quieres una vista más "control room"
 */
export async function getClinicOperationsOverviewSnapshot(clinicId) {
  await delay();

  return {
    clinicId: clinicId ?? null,
    livePatientsInFlow: 6,
    avgWaitMins: 18,
    roomsInUse: 4,
    roomsTotal: 7,
    kpisLive: {
      revenueToday: 1200,
      appointmentsToday: 12,
      noShowRate: 0.08,
    },
    alerts: [
      { type: "queue", label: "Pico de demanda en Rayos X" },
      { type: "staff", label: "Falta 1 enfermero en triage" },
    ],
  };
}

/**
 * ✅ Snapshot compatible con tu UI actual:
 * ClinicOperationsOverviewDashboard espera:
 * liveRevenue, waitingTimeAvg, patientsInFlow, roomsHeatmap, appointmentsFeed
 */
export async function getClinicOperationsSnapshot(clinicId) {
  await delay();

  const base = await getClinicOperationsOverviewSnapshot(clinicId);

  return {
    clinicId: clinicId ?? null,

    liveRevenue: base?.kpisLive?.revenueToday ?? 1200,
    waitingTimeAvg: base?.avgWaitMins ?? 18,
    patientsInFlow: base?.livePatientsInFlow ?? 6,

    roomsHeatmap: [
      { name: "Emergencia", occupancy: 80 },
      { name: "Imagenología", occupancy: 60 },
      { name: "Laboratorio", occupancy: 50 },
      { name: "Consulta", occupancy: 90 },
    ],

    appointmentsFeed: [
      { patient: "María G.", service: "Consulta General", status: "En espera" },
      { patient: "José R.", service: "Rayos X", status: "En proceso" },
      { patient: "Ana P.", service: "Laboratorio", status: "Finalizado" },
    ],
  };
}

/**
 * ✅ Nuevo mock específico para Heatmap
 * Más "escalable" para cuando crees visuales reales luego
 */
export async function getClinicHeatmapSnapshot(clinicId) {
  await delay();

  const rooms = [
    { id: "triage", name: "Triage" },
    { id: "er", name: "Emergencia" },
    { id: "img", name: "Imagenología" },
    { id: "lab", name: "Laboratorio" },
    { id: "gen", name: "Consulta General" },
    { id: "peds", name: "Pediatría" },
    { id: "obs", name: "Observación" },
    { id: "adm", name: "Admisión" },
  ];

  // Ocupación pseudo-dinámica
  const data = rooms.map((r, i) => ({
    ...r,
    occupancy:
      40 +
      ((Date.now() / 1000 + i * 13) % 60), // 40-100 aprox simulación simple
  })).map((r) => ({
    ...r,
    occupancy: Math.min(100, Math.round(r.occupancy)),
  }));

  return {
    clinicId: clinicId ?? null,
    rooms: safeArray(data),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * ✅ Mock ligero para Performance Analytics
 * Perfecto para un bloque simple o una mini vista
 */
export async function getClinicPerformanceSnapshot(clinicId, dateRange = "7d") {
  await delay();

  return {
    clinicId: clinicId ?? null,
    dateRange,
    kpis: {
      avgWaitMins: 17,
      noShowRate: 0.07,
      throughputPatients: 142,
      staffUtilization: 0.86,
    },
    series: [
      { label: "Lun", value: 18 },
      { label: "Mar", value: 16 },
      { label: "Mié", value: 20 },
      { label: "Jue", value: 15 },
      { label: "Vie", value: 19 },
      { label: "Sáb", value: 12 },
      { label: "Dom", value: 10 },
    ],
  };
}
