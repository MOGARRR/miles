// Admin client = what ONLY server is allowed to do
// uses anon key 
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin"; 

//Public client = what users are allowed to see/do
// users publickey
import { supabasePublic } from "@/utils/supabase/supabasePublic"; 


/**
 * Decrement stock for a specific product size.
 *
 * IMPORTANT:
 * - Inventory is tracked at the product_sizes level
 * - This function must only be called after a successful payment
 * - Uses a database-level atomic operation to prevent overselling
 */
export async function decrementProductSizeStock(
  productSizeId: number,
  quantity: number
) {
  const { error } = await supabaseAdmin.rpc(
    "decrement_product_size_stock",
    {
      p_product_size_id: productSizeId,
      p_quantity: quantity,
    }
  );

  if (error) {
    throw new Error(
      `Failed to decrement stock for product_size ${productSizeId}: ${error.message}`
    );
  }
}


/**
 * Fetch latest stock for multiple product sizes
 * Used to sync cart quantities with backend stock
 */
export async function getProductSizesStock(
  sizeIds: number[]
): Promise<{ id: number; stock: number }[]> {
  if (sizeIds.length === 0) return [];

  const { data, error } = await supabasePublic
    .from("product_sizes")
    .select("id, stock")
    .in("id", sizeIds);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}