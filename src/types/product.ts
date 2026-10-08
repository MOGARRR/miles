/**
 * Product Type Definition
 * -----------------------
 * This interface describes the exact shape of a Product object returned
 * by our `/api/products` endpoint and stored in our database.
 *
 * Having this type helps us get autocomplete, avoid typos,
 * and keep our product data consistent across the project.
 */
export type ProductCategory = {
  id: number;
  title: string;
};

export type ProductType = "print" | "original" | "collection";

export type ProductSizeLabel = "Small" | "Large" | "Original" | "Collection";

export type ProductSize = {
  id: number;
  label: ProductSizeLabel;
  price_cents: number;
  stock: number;
};

export type ProductImages = {
  id: number;
  image_url: string;
  sort_order: number;
};

export interface Product {
  id: number;
  title: string;
  description: string;

  // -- primary / cover image
  image_URL: string;

  // print = Small/Large; original/collection = single SKU, shipping within Canada included
  product_type: ProductType;

  /** Display size for originals only (e.g. "16 × 20"). Null for prints. */
  original_size?: string | null;

  // legacy — keep for now so nothing breaks
  category_id?: number | null;

  sold_out: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;

  categories?: ProductCategory[];

  product_sizes?: ProductSize[];

  // -- gallery images (optional)
  product_images?: ProductImages[];
}
