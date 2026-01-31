import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

// GET all Orders
export async function getAllOrders() {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// GET Order by id
export async function getOrderById(id: string) {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

//Get Orders and its Products
export async function getOrderWithProducts(orderId: string) {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_products (
        *,
        products (*)
      )
    `
    )
    .eq("id", orderId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// GET Order by Stripe Session id
export async function getOrderByStripeSessionId(sessionId: string) {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

// POST Orders
export async function createOrder(orderItem: any) {
  const supabase = supabaseAdmin;
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
  const supabase = supabaseAdmin;
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
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
