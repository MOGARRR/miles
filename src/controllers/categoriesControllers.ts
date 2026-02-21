import { supabasePublic } from "@/utils/supabase/supabasePublic";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

// GET all Categories products
export async function getAllCategories() {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("categories")
    .select("*");
  if (error) throw new Error(error.message);
  return data;
}

// GET Categories products by id
export async function getCategorieProductById(id: string) {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST Categories products
export async function createCategoriesProducts(categoriesProductsItem: any) {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("categories")
    .insert([categoriesProductsItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT Categories products
export async function updateCategoriesProducts(
  id: string,
  updatedCategoriesProductsItem: any,
) {
  const supabase = supabaseAdmin;
  const updates = Object.fromEntries(
    Object.entries(updatedCategoriesProductsItem).filter(
      ([_, v]) => v !== undefined,
    ),
  );
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE Categories products
export async function deleteCategoriesProducts(id: string) {
  const supabase = supabaseAdmin;

  // 1. Check if there are products associated with this category
  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    throw new Error(countError.message);
  }

  // 2. Block deletion if products exist
  if (count && count > 0) {
    throw new Error(
      "This category cannot be deleted because it is associated with one or more products.",
    );
  }

  // 3. Safe to delete
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
