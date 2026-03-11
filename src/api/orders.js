import { supabase } from "@/lib/supabase";

/**
 * FETCH ORDERS
 */
export async function fetchOrders(filters = {}) {
  const { patient_id, provider_id, clinic_id, status } = filters;
  
  let query = supabase
    .from('orders')
    .select(`
      *,
      patient:profiles!orders_patient_id_fkey(id, full_name, email, metadata),
      provider:profiles!orders_provider_id_fkey(id, full_name, email),
      clinic:profiles!orders_clinic_id_fkey(id, full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (patient_id) query = query.eq('patient_id', patient_id);
  if (provider_id) query = query.eq('provider_id', provider_id);
  if (clinic_id) query = query.eq('clinic_id', clinic_id);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * GET ORDER BY ID
 */
export async function getOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, patient:profiles!orders_patient_id_fkey(*), provider:profiles!orders_provider_id_fkey(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * PLACE ORDER
 */
export async function placeOrder(payload) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ status: 'received', ...payload }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * UPDATE ORDER STATUS
 */
export async function updateOrderStatus(id, statusPatch) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: statusPatch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * HELPERS
 */
export const fetchOrdersByPatient = (patientId) => fetchOrders({ patient_id: patientId });
export const fetchOrdersByProvider = (providerId) => fetchOrders({ provider_id: providerId });
export const fetchOrdersByClinic = (clinicId) => fetchOrders({ clinic_id: clinicId });
