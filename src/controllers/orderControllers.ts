import { createClient } from "@/utils/supabase/server";

// GET all Orders
export async function getAllOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*");
  if (error) throw new Error(error.message);
  return data;
}


// GET Order by id
export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST Orders
export async function createOrder(orderItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([orderItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT Orders
export async function updateOrder(id: string, updatedProductItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedProductItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE Orders
export async function deleteOrder(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}