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
      .select(`
        id,
        title,
        description,
        image_URL,
        is_available,
        created_at,
        updated_at,

        product_sizes (
          id,
          label,
          price_cents
        ),

        products_categories (
          categories (
            id,
            title
          )
        )
      `)
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

  //Normalize categories into a flat array
  const normalized = data.map((product: any) => ({
    ...product,
    categories: product.products_categories?.map(
      (pc: any) => pc.categories
    ) ?? [],
  }));

  return normalized;
}

// GET Product by id
export async function getProductById(id: string) {
  const supabase = supabasePublic;
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      image_URL,
      is_available,
      created_at,
      updated_at,

      product_sizes (
        id,
        label,
        price_cents
      ),

      product_images (
        id,
        image_url,
        sort_order
      ),

      products_categories (
        categories (
          id,
          title
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // IMPORTANT: sort gallery images
  const sortedImages =
    data.product_images?.sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ) ?? [];


  return {
    ...data,
    product_images: sortedImages,
    categories:
      data.products_categories?.map(
        (pc: any) => pc.categories
      ) ?? [],
  };
}


// // POST
// export async function createProduct(userItem: any) {
//   const supabase = supabaseAdmin;
//   const { data, error } = await supabase
//     .from("products")
//     .insert([userItem])
//     .select()
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// }

// // PUT
// export async function updateProduct(id: string, updatedProductItem: any) {
//   const supabase = supabaseAdmin;
//   const updates = Object.fromEntries(
//     Object.entries(updatedProductItem).filter(([_, v]) => v !== undefined),
//   );
//   const { data, error } = await supabase
//     .from("products")
//     .update(updates)
//     .eq("id", id)
//     .select()
//     .single();
//   if (error) throw new Error(error.message);
//   return data;
// }

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



export async function createProductWithCategories(payload: {
  title: string;
  description?: string;
  image_URL: string;
  is_available: boolean;
  category_ids: number[];
  product_sizes: {
    label: string;
    price_cents: number;
  }[];
}) {
  const { category_ids, product_sizes, ...productData } = payload;

  // Create product
  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (productError) throw productError;

  // Insert categories (join table)
  const categoryRows = category_ids.map((category_id) => ({
    product_id: product.id,
    category_id,
  }));

  const { error: catError } = await supabaseAdmin
    .from("products_categories")
    .insert(categoryRows);

  if (catError) throw catError;

  // Insert product sizes
  const sizeRows = product_sizes.map((size) => ({
    product_id: product.id,
    ...size,
  }));

  const { error: sizeError } = await supabaseAdmin
    .from("product_sizes")
    .insert(sizeRows);

  if (sizeError) throw sizeError;

  return product;
}


export async function updateProductWithCategories(
  productId: number,
  payload: {
    title: string;
    description?: string;
    image_URL: string;
    is_available: boolean;
    category_ids: number[];
    product_sizes: {
      label: string;
      price_cents: number;
    }[];
  }
) {
  const { category_ids, product_sizes, ...productData } = payload;

  // 1. Update product core fields
  const { error: productError } = await supabaseAdmin
    .from("products")
    .update(productData)
    .eq("id", productId);

  if (productError) throw productError;

  // 2. Reset categories
  await supabaseAdmin
    .from("products_categories")
    .delete()
    .eq("product_id", productId);

  const categoryRows = category_ids.map((category_id) => ({
    product_id: productId,
    category_id,
  }));

  if (categoryRows.length > 0) {
    const { error: catError } = await supabaseAdmin
      .from("products_categories")
      .insert(categoryRows);

    if (catError) throw catError;
  }

  // 3. Reset sizes (same pattern)
  await supabaseAdmin
    .from("product_sizes")
    .delete()
    .eq("product_id", productId);

  const sizeRows = product_sizes.map((size) => ({
    product_id: productId,
    ...size,
  }));

  const { error: sizeError } = await supabaseAdmin
    .from("product_sizes")
    .insert(sizeRows);

  if (sizeError) throw sizeError;

  return { success: true };
}
