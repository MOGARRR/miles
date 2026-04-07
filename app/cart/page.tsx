"use client";

import { useCart } from "../components/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";
import ShippingForm from "../components/ShippingForm";
import { Trash2 } from "lucide-react";
import LinkButton from "../components/ui/LinkButton";
import SubmitButton from "../components/ui/SubmitButton";

import {
  normalizePhone,
  normalizePostal,
  getNormalizedShipping,
} from "@/src/helpers/normalizeShipping";

const CartPage = () => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [isStockValid, setIsStockValid] = useState(true);

  const { items, addToCart, decrementQuantity, removeFromCart } = useCart();

  // ----------STOCK---------
  const syncCartStock = async () => {
    try {
      // Collect unique product_size IDs from cart
      const sizeIds = Array.from(
        new Set(items.map((item) => item.product_size.id)),
      );

      if (sizeIds.length === 0) return;

      const res = await fetch("/api/product-sizes/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sizeIds }),
      });

      if (!res.ok) {
        console.error("Failed to sync stock");
        return;
      }

      const data = await res.json();

      let stockIsValid = true;

      /**
       * data.stock shape:
       * [{ id: number, stock: number }]
       */
      data.stock.forEach((latest: { id: number; stock: number }) => {
        const cartItem = items.find(
          (item) => item.product_size.id === latest.id,
        );

        if (!cartItem) return;

        // If cart quantity exceeds backend stock : clamp it
        if (cartItem.quantity > latest.stock) {
          stockIsValid = false;

          const diff = cartItem.quantity - latest.stock;

          // Reduce quantity until it matches stock
          for (let i = 0; i < diff; i++) {
            decrementQuantity(cartItem.id, cartItem.product_size.id);
          }
        }
      });
      setIsStockValid(stockIsValid);
    } catch (err) {
      console.error("Cart stock sync error:", err);
    }
  };

  // Sync only on /cart page load
  useEffect(() => {
    syncCartStock();
  }, []);

  // ------ SHIPPING --------
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phoneNumber: "",
    street1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "CA",
  });

  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);
  const shippingAmount = shippingEstimate ?? 0;

  const handleShippingChange = (event: any) => {
    const { name, value } = event.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  };

  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressValid, setAddressValid] = useState(false);

  const handleShippingEstimate = async () => {
    const addressTo = {
      name: shippingForm.name,
      phone: normalizePhone(shippingForm.phoneNumber),
      street1: shippingForm.street1,
      city: shippingForm.city,
      state: shippingForm.state,
      zip: normalizePostal(shippingForm.zip),
      country: shippingForm.country,
    };

    try {
      const validateRes = await fetch("/api/shipping/validateAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressTo }),
      });

      const validateData = await validateRes.json();

      if (!validateRes.ok || !validateData.isValid) {
        setAddressError(
          validateData.messages?.[0]?.text ??
            "Please enter a valid shipping address.",
        );
        return;
      }

      setAddressValid(true);
      setAddressError(null);
    } catch (err) {
      console.error("Shipping validation error:", err);
    }

    try {
      const rateRes = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressTo,
          parcel: {
            length: "10",
            width: "8",
            height: "4",
            weight: "2",
            distanceUnit: DistanceUnitEnum.In,
            massUnit: WeightUnitEnum.Lb,
          },
        }),
      });

      const data = await rateRes.json();
      setShippingEstimate(parseFloat(data.rate.amount));
      await syncCartStock();
    } catch (err) {
      console.error("Shipping estimate error:", err);
    }
  };

  // ----- TOTALS -----
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0,
  );

  const hst = (subtotalCents / 100) * 0.13;
  const total = subtotalCents / 100 + hst + shippingAmount;

  const hstCents = Math.round(subtotalCents * 0.13);
  const shippingCents = Math.round(shippingAmount * 100);

  // const canProceedToCheckout = shippingEstimate !== null && agreedToPrivacy && isStockValid;

  // ----- STRIPE PAYLOAD -----
  const checkoutCart = items.map((item) => ({
    id: item.id,
    title: `${item.title} (${item.product_size.label})`,
    price_cents: item.price_cents,
    quantity: item.quantity,
    productSizeId: item.product_size.id,
  }));

  const handleCheckout = async () => {
    const normalizedShipping = getNormalizedShipping(shippingForm);

    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: checkoutCart,
        shipping: normalizedShipping,
        shippingCents,
        hstCents,
      }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <section>
      <div className="bg-kilodarkgrey py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <h3 className="text-4xl font-semibold text-kilored">Your Cart</h3>
        </div>
      </div>

      <div
        className="
        max-w-7xl mx-auto 
        px-6 md:px-16 
        py-12 md:py-20 
        flex flex-col gap-8
        md:grid md:grid-cols-[1fr_400px] md:items-start md:gap-8
        "
      >
        {/* Mobile: items → shipping → summary. Desktop: shipping left; items + summary stacked right */}
        <div className="order-1 md:col-start-2 md:row-start-1 w-full rounded-lg border border-[#3a3a41] bg-kilodarkgrey p-4 md:p-8">
          <ul className="space-y-0 md:space-y-4">
            {items.map((item) => {
              const isMaxReached = item.quantity >= item.product_size.stock;

              const qtyBtn =
                "min-w-[2.25rem] h-9 flex items-center justify-center border border-[#3a3a41] rounded-md text-kilotextlight hover:bg-white/10 transition-colors";

              return (
                <li
                  key={`${item.id}-${item.product_size.id}`}
                  className="
                      flex flex-col gap-3
                      py-4 first:pt-0
                      border-b border-[#3a3a41] last:border-0
                      md:flex-row md:flex-wrap md:items-center md:gap-4
                      md:py-0 md:first:pt-0 md:pb-4 md:border-b md:border-gray-700 md:last:pb-0 md:last:border-0
                    "
                >
                  {/* Mobile: image + text row / Desktop: inline */}
                  <div className="flex gap-3 w-full md:contents">
                    <img
                      src={item.image_URL}
                      alt={item.title}
                      className="
                          w-16 h-16 shrink-0
                          object-cover rounded-lg ring-1 ring-[#3a3a41]/50
                          md:w-24 md:h-24 md:ring-0
                        "
                    />

                    <div className="flex-1 min-w-0 md:flex-1">
                      <p className="font-semibold text-sm md:text-base leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs md:text-sm text-kilotextgrey mt-0.5">
                        Size: {item.product_size.label}
                      </p>
                      <p className="text-xs text-kilotextgrey tabular-nums mt-0.5 md:hidden">
                        ${(item.price_cents / 100).toFixed(2)} each
                      </p>
                      <p className="text-sm hidden md:block">
                        ${(item.price_cents / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Mobile: qty + total + remove / Desktop: original row */}
                  <div
                    className="
                      flex items-center justify-between gap-3 w-full
                      md:w-auto md:justify-start md:flex-nowrap md:gap-4
                    "
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          decrementQuantity(item.id, item.product_size.id)
                        }
                        className={qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span className="w-8 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={isMaxReached}
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            image_URL: item.image_URL,
                            category_id: item.category_id,
                            price_cents: item.price_cents,
                            product_size: item.product_size,
                          })
                        }
                        className={`${qtyBtn} ${
                          isMaxReached
                            ? "opacity-40 cursor-not-allowed hover:bg-transparent"
                            : ""
                        }`}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold text-kilotextlight tabular-nums md:w-[80px] md:text-right md:text-kilotextlight">
                      ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.id, item.product_size.id)
                      }
                      className="p-2 rounded-lg border border-[#3a3a41] text-kilotextgrey hover:text-kilored hover:border-kilored/50 transition-colors shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {isMaxReached && (
                    <p className="text-[11px] text-kilotextgrey w-full basis-full md:text-center">
                      Only {item.product_size.stock} available
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          {items.length === 0 && (
            <p className="text-center text-kilotextgrey">YOUR CART IS EMPTY!</p>
          )}

          {items.length > 0 && (
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-700">
              <span className="text-kilotextgrey">Subtotal</span>
              <span className="font-semibold text-kilored">
                ${(subtotalCents / 100).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-center">
            <LinkButton href="/store" variant="secondary" className="mt-10">
              {items.length === 0 ? "GO TO GALLERY" : "CONTINUE SHOPPING"}
            </LinkButton>
          </div>
        </div>

        <div className="order-2 md:col-start-1 md:row-start-1 md:row-span-2 w-full min-w-0">
          <ShippingForm
            shippingForm={shippingForm}
            onChange={handleShippingChange}
            onEstimate={handleShippingEstimate}
            shippingEstimate={shippingEstimate}
            addressError={addressError}
          />
        </div>

        {/* ORDER SUMMARY */}
        <div
          className="
          order-3 md:col-start-2 md:row-start-2
          w-full
          bg-kilodarkgrey 
          rounded-lg border border-[#3a3a41]
          p-6 md:p-8"
        >
          <h3 className="text-xl mb-4">ORDER SUMMARY</h3>

          <div className="flex justify-between my-2">
            <p>Subtotal:</p>
            <p>${(subtotalCents / 100).toFixed(2)}</p>
          </div>

          <div className="flex justify-between my-2">
            <p>HST (13%):</p>
            <p>${hst.toFixed(2)}</p>
          </div>

          {shippingEstimate !== null && (
            <div className="flex justify-between my-2">
              <p>Shipping:</p>
              <p>${shippingAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-between my-4 text-xl">
            <p>Total:</p>
            <p className="text-kilored">${total.toFixed(2)}</p>
          </div>

          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
            />
            <span className="text-sm">
              I agree to the <Link href="/privacy">Privacy Policy</Link>
            </span>
          </label>

          {!isStockValid && (
            <p className="text-sm text-amber-400 mb-2">
              Some items were adjusted due to limited stock. Please review your
              cart.
            </p>
          )}

          <SubmitButton
            className="w-full mt-6"
            // disabled={!canProceedToCheckout || !addressValid}
            onClick={handleCheckout}
            disabled
          >
            PROCEED TO CHECKOUT
          </SubmitButton>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
