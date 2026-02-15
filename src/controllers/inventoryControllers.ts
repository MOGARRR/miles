import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

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
