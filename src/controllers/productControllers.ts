import { supabasePublic } from "@/utils/supabase/supabasePublic";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

/**
 * Fetch products with pagination support.
 * This is used by the products gallery (infinite scroll / discovery view).
 *
 * @param limit  - number of products to fetch per request
 * @param offset - starting index (calculated from page)
 */

type GetAllProductsOptions = {
  limit: number;
  offset: number;
  search?: string;
};


// GET all Products PAGINATED
export async function getAllProducts({
  limit,
  offset,
  search = "",
}: GetAllProductsOptions) {
  const supabase = supabasePublic;

  let query = supabase
    .from("products")
    .select("*")
    // Stable ordering is required for pagination / infinite scroll
    .order("created_at", { ascending: false })

  // Apply search if provided
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  const { data, error } = await query.range(
    offset,
    offset + limit - 1
  )
    
  if (error) throw new Error(error.message);
  return data;
}

// GET Product by id
export async function getProductById(id: string) {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST
export async function createProduct(userItem: any) {
  const supabase = supabaseAdmin;
  const { data, error } = await supabase
    .from("products")
    .insert([userItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT
export async function updateProduct(id: string, updatedProductItem: any) {
  const supabase = supabaseAdmin;
  const updates = Object.fromEntries(
    Object.entries(updatedProductItem).filter(([_, v]) => v !== undefined),
  );
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE Product
export async function deleteProduct(id: string) {
  const supabase = supabaseAdmin;

  // 1. Check if product is associated with any order
  const { data: orderRefs, error: refError } = await supabase
    .from("order_products")
    .select("id")
    .eq("product_id", id)
    .limit(1);

  if (refError) throw new Error(refError.message);

  if (orderRefs && orderRefs.length > 0) {
    throw new Error(
      "Product cannot be deleted because it is associated with an order.",
    );
  }

  // 2. Safe to delete
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
