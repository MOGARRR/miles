import { createClient } from "@/utils/supabase/server";

// GET all Categories products
export async function getAllCategoriesProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Categories_products").select("*");
  if (error) throw new Error(error.message);
  return data;
}


// GET Categories products by id
export async function getCategorieProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Categories_products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST Categories products
export async function createCategoriesProducts(categoriesProductsItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Categories_products")
    .insert([categoriesProductsItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT Categories products
export async function updateCategoriesProducts(id: string, updatedCategoriesProductsItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedCategoriesProductsItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("Categories_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE Categories products
export async function deleteCategoriesProducts(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Categories_products")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}