// src/api/finance/billingSources.js
import { fetchAppointmentsByClinic } from "@/api/appointments";
import { fetchOrdersByClinic } from "@/api/orders";

/**
 * Normaliza “fuentes de origen” para vincular documentos (CxC) a:
 * - appointments (citas)
 * - orders (órdenes)
 * - authorizations (pre-autorizaciones)
 *
 * Hoy: mock/localStorage.
 * Mañana: se cambia el interior por llamadas HTTP reales sin tocar la UI.
 */

const safeJsonParse = (raw, fallback = null) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const ymd = (d = new Date()) => {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const buildOption = ({ entityType, entityId, ref, label, date }) => ({
  entityType,
  entityId,
  ref,
  date: date || null,
  label,
});

const seedIfEmpty = (arr, seed) => (Array.isArray(arr) && arr.length ? arr : seed);

/**
 * Devuelve un paquete listo para Select:
 * {
 *  appointments: [{...}],
 *  orders: [{...}],
 *  authorizations: [{...}],
 *  all: [{...}] // merge
 * }
 */
export async function fetchBillingSources({ clinicId } = {}) {
  const cid = clinicId || "clinic-1";

  // -----------------------
  // 1) Citas (appointments)
  // -----------------------
  let appts = await fetchAppointmentsByClinic(cid);
  appts = seedIfEmpty(appts, [
    {
      id: "APT-001",
      clinic_id: cid,
      date: ymd(),
      patient_name: "Juan Pérez",
      professional_name: "Dr. Rafael",
      status: "confirmed",
    },
    {
      id: "APT-002",
      clinic_id: cid,
      date: ymd(new Date(Date.now() + 86400000 * 2)),
      patient_name: "María González",
      professional_name: "Dra. Ana",
      status: "pending",
    },
  ]);

  const appointmentOptions = appts.map((a) =>
    buildOption({
      entityType: "appointment",
      entityId: a.id,
      ref: String(a.id),
      date: a.date,
      label: `Cita ${a.id} — ${a.patient_name || "Paciente"} — ${a.date || ""}`,
    })
  );

  // -----------------------
  // 2) Órdenes (orders)
  // -----------------------
  let orders = await fetchOrdersByClinic(cid);
  orders = seedIfEmpty(orders, [
    {
      id: "ORD-001",
      clinic_id: cid,
      created_at: ymd(),
      patient_name: "Juan Pérez",
      provider_name: "Farmacia Central",
      status: "pending",
      total_amount: 55.0,
    },
    {
      id: "ORD-002",
      clinic_id: cid,
      created_at: ymd(new Date(Date.now() - 86400000 * 3)),
      patient_name: "Luisa Rojas",
      provider_name: "Droguería Medicare",
      status: "delivered",
      total_amount: 120.0,
    },
  ]);

  const orderOptions = orders.map((o) =>
    buildOption({
      entityType: "order",
      entityId: o.id,
      ref: String(o.id),
      date: o.created_at || null,
      label: `Orden ${o.id} — ${o.patient_name || "Paciente"} — ${o.provider_name || "Proveedor"}`,
    })
  );

  // -----------------------
  // 3) Pre-autorizaciones
  //    (mock: localStorage healtng_auths_v2)
  // -----------------------
  const authRaw =
    typeof window !== "undefined" ? window.localStorage.getItem("healtng_auths_v2") : null;
  let auths = safeJsonParse(authRaw, []);
  auths = seedIfEmpty(auths, [
    {
      id: "AUTH-001",
      patientName: "María González",
      insuranceCompany: "Seguros Caracas",
      requestDate: ymd(new Date(Date.now() - 86400000 * 5)),
      status: "approved",
      title: "Cirugía Menor",
    },
  ]);

  const authOptions = auths.map((a) =>
    buildOption({
      entityType: "authorization",
      entityId: a.id,
      ref: String(a.id),
      date: a.requestDate || null,
      label: `Autorización ${a.id} — ${a.patientName || "Paciente"} — ${a.insuranceCompany || "Aseguradora"}`,
    })
  );

  const all = [...appointmentOptions, ...orderOptions, ...authOptions].sort((x, y) =>
    String(y.date || "").localeCompare(String(x.date || ""))
  );

  return {
    appointments: appointmentOptions,
    orders: orderOptions,
    authorizations: authOptions,
    all,
  };
}
