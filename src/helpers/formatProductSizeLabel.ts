const SIZE_DISPLAY_MAP: Record<string, string> = {
  Small: "11 × 14″",
  Large: "24 × 36″",
  Original: "Original",
  Collection: "Collection",
};

/** Human-readable size (inches) for known labels; otherwise returns the label as-is. */
export function formatProductSizeLabel(label: string): string {
  return SIZE_DISPLAY_MAP[label] ?? label;
}

/** True when shipping within Canada is included in the artwork price (originals + collections). */
export function isShippingIncludedProduct(input: {
  product_type?: string | null;
  sizeLabel?: string | null;
}): boolean {
  return (
    input.product_type === "original" ||
    input.product_type === "collection" ||
    input.sizeLabel === "Original" ||
    input.sizeLabel === "Collection"
  );
}

/** Alias for isShippingIncludedProduct (originals + collections). */
export function isOriginalProduct(input: {
  product_type?: string | null;
  sizeLabel?: string | null;
}): boolean {
  return isShippingIncludedProduct(input);
}

/** Checkout / cart line title — originals use their custom size when set. */
export function formatCheckoutLineTitle(
  title: string,
  sizeLabel: string,
  originalSize?: string | null,
): string {
  if (sizeLabel === "Original") {
    const size = originalSize?.trim();
    return size ? `${title} (${size})` : `${title} (Original)`;
  }
  if (sizeLabel === "Collection") {
    return `${title} (Collection)`;
  }
  return `${title} (${formatProductSizeLabel(sizeLabel)})`;
}
