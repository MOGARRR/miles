import { ShippingData } from "../types/shippingData";

const normalizePhone = (phone: string) =>
  phone.replace(/[^\d]/g, "").slice(0, 15);

const normalizePostal = (postal: string) =>
  postal.length === 6
    ? `${postal.slice(0, 3)} ${postal.slice(3)}`.toUpperCase()
    : postal.toUpperCase();

const getNormalizedShipping = (shipping: ShippingData) => ({
  ...shipping,
  phoneNumber: normalizePhone(shipping.phoneNumber),
  zip: normalizePostal(shipping.zip),
  state: shipping.state.toUpperCase(),
  country: shipping.country.toUpperCase(),
});

export { getNormalizedShipping, normalizePhone, normalizePostal };
