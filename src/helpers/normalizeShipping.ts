import { ShippingData } from "../types/shippingData";

const normalizePhone = (phone: string) =>
  phone.replace(/[^\d]/g, "").slice(0, 15);

const normalizePostal = (postal: string) =>
  postal.length === 6
    ? `${postal.slice(0, 3)} ${postal.slice(3)}`.toUpperCase()
    : postal.toUpperCase();

/** Formats as 123-456-7890 while typing. */
const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/** Formats as A1A 1A1 while typing. */
const formatPostal = (postal: string) => {
  const cleaned = postal
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 6);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
};

const getNormalizedShipping = (shipping: ShippingData) => ({
  ...shipping,
  phoneNumber: normalizePhone(shipping.phoneNumber),
  zip: normalizePostal(shipping.zip),
  state: shipping.state.toUpperCase(),
  country: shipping.country.toUpperCase(),
});

export {
  getNormalizedShipping,
  normalizePhone,
  normalizePostal,
  formatPhone,
  formatPostal,
};
