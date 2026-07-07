const FREE_SHIPPING_ENV_KEY = "FREE_SHIPPING";

/** Read at request time so Vercel env changes apply without a rebuild. */
export function isFreeShippingEnabled(): boolean {
  const value = process.env[FREE_SHIPPING_ENV_KEY]?.trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes";
}

export const FREE_SHIPPING_RATE = {
  amountCents: 0,
  serviceCode: "FREE",
  serviceName: "Free Shipping (testing)",
} as const;
