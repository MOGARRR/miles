-- Free-text size for original artworks (e.g. "16 × 20"). Null for prints.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS original_size text NULL;

COMMENT ON COLUMN products.original_size IS
  'Display size for original products only (e.g. 16 × 20). Null for prints.';
