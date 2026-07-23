/** Formats cents as a dollar input value, e.g. 1299 → "$12.99". */
export function formatPriceFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Formats free typing into a dollar amount with cents.
 * Digits are treated as cents: "1299" → "$12.99".
 */
export function formatPriceInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (!digits) return "";
  return formatPriceFromCents(Number(digits));
}

/** Parses a formatted price like "$12.99" into a dollar number. */
export function parsePriceInput(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

/** Parses a formatted price into integer cents. */
export function parsePriceToCents(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits);
}
