import {
  mockInventoryData,
  isLowStock,
  isExpiringSoon,
} from "@/utils/inventory";

import { delay, safeArray } from "./_mockBase";

// ✅ Traemos el dominio clínico
import {
  getClinicOperationsSnapshot,
  getClinicOperationsOverviewSnapshot,
  getClinicHeatmapSnapshot,
  getClinicPerformanceSnapshot,
  getClinicManagementSnapshot,
} from "./clinic";

const safeInventory = safeArray(mockInventoryData);

/**
 * KPIs genéricos por rol (mock)
 */
async function fetchKpisForRole({ role, roleId }) {
  await delay();
  return {
    role,
    role_id: roleId,
    total_appointments: 50,
    total_orders: 120,
    avg_ticket: 15.4,
  };
}

/**
 * Métricas de ventas para proveedor (mock)
 */
async function fetchSalesMetrics({ providerId, dateRange }) {
  await delay();
  return {
    provider_id: providerId,
    date_range: dateRange,
    series: [
      { date: "2025-01-01", value: 10 },
      { date: "2025-01-02", value: 15 },
      { date: "2025-01-03", value: 7 },
    ],
  };
}

/**
 * Métricas de booking para clínica (mock)
 */
async function fetchBookingMetrics({ clinicId, dateRange }) {
  await delay();
  return {
    clinic_id: clinicId,
    date_range: dateRange,
    series: [
      { date: "2025-01-01", value: 5 },
      { date: "2025-01-02", value: 8 },
    ],
  };
}

/**
 * Uso del paciente (mock)
 */
async function fetchPatientUsageMetrics({ patientId, dateRange }) {
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
 * Snapshot de KPIs para el ClinicDashboard.
 * Usa mocks de inventario y valores base hardcodeados.
 */
async function getClinicDashboardSnapshot(clinicId) {
  await delay();

  const lowStockCount = safeInventory.filter(isLowStock).length;
  const expiringCount = safeInventory.filter(isExpiringSoon).length;

  // --- NUEVOS KPIs GERENCIALES (mock para demo) ---
  const todayScheduled = 12;
  const todayAttended = 7;  // 👈 clave para “Atención efectiva”
  const todayCancelled = 1;

  const waitingTimeTarget = 10;
  const waitingTimeAvg = 18; // puedes alinear luego con operations snapshot

  return {
    clinicId: clinicId ?? null,

    // existentes
    lowStockItems: lowStockCount,
    expiringItems: expiringCount,
    openOrders: 3,
    todayAppointments: todayScheduled,
    monthlyRevenue: 45670,
    staffUtilization: 87,
    spaceOccupancy: 72,
    todayBookings: 8,
    spacesRevenue: 15240,

    // nuevos
    todayScheduled,
    todayAttended,
    todayCancelled,

    waitingTimeAvg,
    waitingTimeTarget,

    attentionRateTarget: 0.7,        // 70%
    spaceOccupancyTarget: 75,        // %
    staffUtilizationTarget: 80,      // %
  };
}


/**
 * ✅ Export único
 * analytics.js queda como fachada estable.
 * La lógica clínica vive en /clinic/*
 */
export {
  fetchKpisForRole,
  fetchSalesMetrics,
  fetchBookingMetrics,
  fetchPatientUsageMetrics,

  // dashboard general de clínica
  getClinicDashboardSnapshot,

  // operaciones
  getClinicOperationsSnapshot,
  getClinicOperationsOverviewSnapshot,
  getClinicHeatmapSnapshot,
  getClinicPerformanceSnapshot,

  // condominio
  getClinicManagementSnapshot,
};
