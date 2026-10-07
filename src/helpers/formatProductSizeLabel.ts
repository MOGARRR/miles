const SIZE_DISPLAY_MAP: Record<string, string> = {
  Small: "11 × 14″",
  Large: "24 × 36″",
  Original: "Original",
};

/** Human-readable size (inches) for known labels; otherwise returns the label as-is. */
export function formatProductSizeLabel(label: string): string {
  return SIZE_DISPLAY_MAP[label] ?? label;
}

/** True when the cart/product line is an original (shipping included). */
export function isOriginalProduct(input: {
  product_type?: string | null;
  sizeLabel?: string | null;
}): boolean {
  return (
    input.product_type === "original" || input.sizeLabel === "Original"
  );
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
  return `${title} (${formatProductSizeLabel(sizeLabel)})`;
}
