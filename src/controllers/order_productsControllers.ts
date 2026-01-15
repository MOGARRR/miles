import { createClient } from "@/utils/supabase/server";

// GET all OrderProducts
export async function getAllOrderProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("order_products").select("*");
  if (error) throw new Error(error.message);
  return data;
}


// GET OrderProducts by id
export async function getOrderProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST OrderProducts
export async function createOrderProduct(OrderProductItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_products")
    .insert([OrderProductItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT Orders
export async function updateOrderProducts(id: string, updatedOrderProductsItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedOrderProductsItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("order_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE Orders
export async function deleteOrderProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order_products")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}