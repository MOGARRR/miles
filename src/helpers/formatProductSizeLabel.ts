const SIZE_DISPLAY_MAP: Record<string, string> = {
  Small: "11 × 14″",
  Large: "24 × 36″",
};

/** Human-readable size (inches) for known labels; otherwise returns the label as-is. */
export function formatProductSizeLabel(label: string): string {
  return SIZE_DISPLAY_MAP[label] ?? label;
}
