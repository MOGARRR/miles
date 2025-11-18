import { createClient } from "@/utils/supabase/server";

// GET all Products
export async function getAllProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Products").select("*");
  if (error) throw new Error(error.message);
  return data;
}


// GET Product by id
export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST user
export async function createProduct(userItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Products")
    .insert([userItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT user
export async function updateProduct(id: string, updatedProductItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedProductItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("Products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE user
export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Products")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}