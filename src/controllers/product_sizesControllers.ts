import { supabasePublic } from "@/utils/supabase/supabasePublic";

export async function getProductSizeForProduct(productSizeId: Number) {
  const { data, error } = await supabasePublic
    .from("product_sizes")
    .select("label")
    .eq("id", productSizeId); 

  if (error) throw new Error(error.message);
  console.log("Controller fetched data:", data);
  return data;
}