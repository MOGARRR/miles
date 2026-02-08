import { supabasePublic } from "@/utils/supabase/supabasePublic";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";


// GET categories for a product
export async function getCategoriesForProduct(productId: number) {
  const { data, error } = await supabasePublic
    .from("products_categories")
    .select("category_id")
    .eq("product_id", productId);

  if (error) throw new Error(error.message);
  return data;
}

// INSERT product → categories
export async function insertProductCategories(
  productId: number,
  categoryIds: number[]
) {
  const rows = categoryIds.map((category_id) => ({
    product_id: productId,
    category_id,
  }));

  const { error } = await supabaseAdmin
    .from("products_categories")
    .insert(rows);

  if (error) throw new Error(error.message);
}
