import { headers } from "next/headers";

/**
 * Builds the absolute base URL for server-side fetch calls.
 */
export async function getBaseUrl() {
  const h = await headers();

  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to determine host for base URL");
  }

  return `${protocol}://${host}`;
}
