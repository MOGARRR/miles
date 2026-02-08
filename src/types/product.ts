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

export type ProductSize = {
  id: number;
  label: "Small" | "Large";
  price_cents: number;
};

export interface Product {
  id: number;
  title: string;
  description: string;
  image_URL: string;

  // legacy — keep for now so nothing breaks
  category_id?: number | null; 

  sold_out: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;

  categories?: ProductCategory[];

  product_sizes?: ProductSize[];
}