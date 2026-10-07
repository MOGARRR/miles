-- Add product type: print (default) | original
-- Already applied in Supabase production; kept in-repo for environments that replay migrations.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'print';

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('print', 'original'));

COMMENT ON COLUMN products.product_type IS
  'print = standard Small/Large sizes; original = single SKU, shipping included';
