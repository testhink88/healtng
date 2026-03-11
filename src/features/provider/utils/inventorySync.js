// src/features/provider/utils/inventorySync.js
import { supabase } from "@/lib/supabase";

/**
 * Fetches all products from Supabase
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });
  
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

/**
 * Fetches all lots from Supabase
 */
export async function getLots() {
  const { data, error } = await supabase
    .from("lots")
    .select("*")
    .order("exp_date", { ascending: true });
  
  if (error) {
    console.error("Error fetching lots:", error);
    return [];
  }
  return data;
}

/**
 * Syncs the total stock of a specific product based on the sum of its lots in Supabase.
 */
export async function syncProductStockFromLots(productId) {
  // 1. Sum up all lot quantities for this product
  const { data: lots, error: lotError } = await supabase
    .from("lots")
    .select("qty")
    .eq("product_id", productId);
  
  if (lotError) {
    console.error("Error calculating stock from lots:", lotError);
    return null;
  }

  const totalQty = lots.reduce((acc, lot) => acc + (lot.qty || 0), 0);

  // 2. Update the product's stock_actual
  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({ stock_actual: totalQty })
    .eq("id", productId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating product stock:", updateError);
    return null;
  }

  return updatedProduct;
}

/**
 * Adds or updates a lot and initiates stock sync for the product.
 */
export async function upsertLotAndSync(lot) {
  const { data: savedLot, error: lotError } = await supabase
    .from("lots")
    .upsert(lot)
    .select()
    .single();

  if (lotError) {
    console.error("Error saving lot:", lotError);
    throw lotError;
  }

  // After saving the lot, sync the product stock
  if (savedLot.product_id) {
    await syncProductStockFromLots(savedLot.product_id);
  }

  return savedLot;
}

/**
 * Deletes a lot and updates product stock.
 */
export async function deleteLotAndSync(lotId, productId) {
  const { error } = await supabase
    .from("lots")
    .delete()
    .eq("id", lotId);

  if (error) {
    console.error("Error deleting lot:", error);
    throw error;
  }

  if (productId) {
    await syncProductStockFromLots(productId);
  }
}

/**
 * Batch sync for all products (useful for initial migration or deep cleaning)
 */
export async function globalSync() {
  const products = await getProducts();
  const results = [];
  
  for (const product of products) {
    const updated = await syncProductStockFromLots(product.id);
    if (updated) results.push(updated);
  }
  
  return results;
}
