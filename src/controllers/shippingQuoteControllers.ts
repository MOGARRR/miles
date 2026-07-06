import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export type ShippingQuoteLogInput = {
  destinationPostal: string;
  parcelCount: number;
  parcelsJson: unknown;
  rawResponseJson: unknown;
  selectedServiceCode: string;
  totalCents: number;
};

/**
 * Saves a Canada Post quote for later comparison against invoices.
 * Failures are logged but do not block checkout.
 */
export async function logShippingQuote(input: ShippingQuoteLogInput): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from("shipping_quotes").insert({
      destination_postal: input.destinationPostal,
      parcel_count: input.parcelCount,
      parcels_json: input.parcelsJson,
      raw_response_json: input.rawResponseJson,
      selected_service_code: input.selectedServiceCode,
      total_cents: input.totalCents,
    });

    if (error) {
      console.error("[shipping] failed to log quote:", error.message);
    }
  } catch (error) {
    console.error("[shipping] failed to log quote:", error);
  }
}
