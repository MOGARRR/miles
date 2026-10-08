-- Allow product_type: print | original | collection
-- Apply in Supabase SQL editor if migrations are not replayed automatically.

ALTER TABLE products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('print', 'original', 'collection'));

COMMENT ON COLUMN products.product_type IS
  'print = Small/Large sizes; original = single SKU, shipping included; collection = single SKU set, shipping included';
