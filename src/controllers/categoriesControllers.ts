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

// DELETE category — detach from products first, then remove the category
export async function deleteCategoriesProducts(id: string) {
  const supabase = supabaseAdmin;

  // 1. Remove this category from all products (many-to-many join)
  const { error: junctionError } = await supabase
    .from("products_categories")
    .delete()
    .eq("category_id", id);

  if (junctionError) {
    throw new Error(junctionError.message);
  }

  // 2. Clear legacy single category_id on products, if any still point here
  const { error: clearLegacyError } = await supabase
    .from("products")
    .update({ category_id: null })
    .eq("category_id", id);

  if (clearLegacyError) {
    throw new Error(clearLegacyError.message);
  }

  // 3. Delete the category itself
  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
