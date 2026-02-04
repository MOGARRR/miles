import { Product } from "./product";

export interface orderData {
  id: number,
  total_cents: number,
  stripe_session_id: string,
  status: string,
  created_at: string,
  updated_at: string,
  payment_status: string,
shipping_fee_cents: number,
tracking_number: string,
label_url: string,
estimated_delivery: any,
shipping_status: string,
full_name: string,
address_line_1: string,
address_line_2: string,
postal: string,
city: string,
province:string,
email: string,
phone_number: string
 order_products: OrderProduct[];
}

export type OrderProduct = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  created_at: string;
  products: Product;
};