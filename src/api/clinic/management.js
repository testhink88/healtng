import { delay } from "@/api/_mockBase"


/**
 * Snapshot para Modo Condominio / Administración Clínica
 */
export async function getClinicManagementSnapshot(clinicId) {
  await delay();

  return {
    clinicId: clinicId ?? null,
    sites: 2,
    totalStaff: 48,
    complianceScore: 92,
    monthlyCost: 21000,
    procurementOpen: 5,
    occupancyGlobal: 0.74,
  };
}
