/**
 * Product Type Definition
 * -----------------------
 * This interface describes the exact shape of a Product object returned 
 * by our `/api/products` endpoint and stored in our database. 
 * 
 * Having this type helps us get autocomplete, avoid typos,
 * and keep our product data consistent across the project.
 */

export interface Product {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  category_id: number | null;
  image_URL: string;
  sold_out: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
}