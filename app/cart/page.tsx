"use client";
import { useCart } from "../components/CartContext";
import { CartProduct } from "../components/CartContext";
import { useState } from "react";
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

type GroupedCartItem = CartProduct & {
  quantity: number;
};

const CartPage = () => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const { items, removeFromCart, addToCart } = useCart();

  // ------ GROUPED ITEMS --------
  const groupedItems: GroupedCartItem[] = [];

  for (const item of items) {
    const existing = groupedItems.find(
      (groupedItem) => groupedItem.id === item.id,
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      groupedItems.push({
        ...item,
        quantity: 1,
      });
    }
  }

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

  //store user input from the form into state
  const handleShippingChange = (event: any) => {
    const { name, value } = event.target;

    setShippingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressValid, setAddressValid] = useState(false);
  // TODO: replace parcel information when available
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
        body: JSON.stringify({
          addressTo,
        }),
      });

      const validateData = await validateRes.json();

      // if validateRes errors or is invalid create error message for shipping form
      if (
        !validateRes.ok ||
        !validateData.isValid
      ) {
        const msg =
          validateData.messages?.[0]?.text ??
          "Please enter a valid shipping address.";

        setAddressError(msg);
        return;
      }

      setAddressValid(true);
      setAddressError(null);
      
    } catch (err: any) {
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

      if (!rateRes.ok) {
        throw new Error("Failed to fetch shipping rates");
      }

      const data = await rateRes.json();
      setShippingEstimate(parseFloat(data.rate.amount));
    } catch (err) {
      console.error("Shipping estimate error:", err);
    }
  };

  // ----- CALCULATE TOTALS -------
  const subtotalCents = items.reduce((sum, item) => sum + item.price_cents, 0);
  const hst = (subtotalCents / 100) * 0.13;
  const total = subtotalCents / 100 + hst + shippingAmount;

  // ----- CALCULATE TOTALS CENTS -------
  // Convert total into cents for stripe price data
  const hstCents = Math.round(subtotalCents * 0.13);
  const shippingCents = Math.round(shippingAmount * 100);

  // ----- PROCEED TO CHECKOUT GUARD -------
  const canProceedToCheckout = shippingEstimate !== null && agreedToPrivacy;

  //--------Stripe Intergration------------
  const checkoutCart = groupedItems.map((item) => ({
    id: item.id,
    title: item.title,
    price_cents: item.price_cents,
    quantity: item.quantity,
  }));

  const handleCheckout = async () => {
    const normalizedShipping = getNormalizedShipping(shippingForm);

    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: checkoutCart,
        shipping: normalizedShipping,
        shippingCents,
        hstCents,
      }),
    });

    const data = await res.json();
    if (data.url) {
      // Redirect to stripe hosted page
      window.location.href = data.url;
    }
  };

  // console.log(groupedItems);

  return (
    <section
      className="
    "
    >
      {/* HERO */}
      <div className="bg-kilodarkgrey py-12">
        <div
          className="
          max-w-7xl mx-auto
          px-6 md:px-16 
          "
        >
          <h3 className="text-4xl font-semibold text-kilored">Your Cart</h3>
          <p className="text-base md:text-lg text-kilotextgrey mt-6">
            Review your selected items and complete your purchase
          </p>
        </div>
      </div>

      {/* SHIPPING + SUMMARY + ITEMS CONTAINER */}
      <div
        className="
        max-w-7xl mx-auto
        px-6 md:px-16 py-20 
        flex gap-8 items-start"
      >
        {/* LEFT SIDE — occupies remaining space */}
        <div className="flex-1">
          {/* SHIPPING FORM */}
          <ShippingForm
            shippingForm={shippingForm}
            onChange={handleShippingChange}
            onEstimate={handleShippingEstimate}
            shippingEstimate={shippingEstimate}
            addressError={addressError}
          />

          {/* LIST OF ITEMS  */}
          <div
            className="
            flex flex-col
            rounded-lg border border-[#3a3a41]
            bg-kilodarkgrey
            my-12 p-8"
          >
            <ul className="space-y-4 mt-4">
              {groupedItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-gray-700 pb-4"
                >
                  <img
                    src={item.image_URL}
                    alt={item.title}
                    className="w-30 h-30 object-cover rounded-md"
                  />

                  <div className="flex flex-col flex-1">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-gray-300 text-sm">
                      ${(item.price_cents / 100).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="
                    cursor-pointer
                    px-2 py-1 border rounded
                    hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="
                    cursor-pointer
                    px-2 py-1 border rounded
                    hover:bg-gray-700"
                  >
                    +
                  </button>

                  <p className="text-lg font-semibold w-[80px] text-right">
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.title} from cart`}
                    className="
                      ml-2
                      p-2
                      rounded-lg
                      border border-[#3a3a41]
                      text-kilotextgrey
                      hover:text-kilored
                      hover:border-kilored/50
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            {items.length === 0 && (
              <p className="text-base md:text-lg text-kilotextgrey text-center ">
                YOUR CART IS EMPTY!
              </p>
            )}

            <LinkButton href="/store" variant="secondary" className="mt-10">
              {items.length === 0 ? "GO TO GALLERY" : "CONTINUE SHOPPING"}
            </LinkButton>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div
          className="
        w-[400px]
        bg-kilodarkgrey
        rounded-lg border border-[#3a3a41]
        p-8"
        >
          <h3 className="text-xl mb-4">ORDER SUMMARY</h3>

          {/* SUBTOTAL */}
          {items.length > 0 && (
            <div className="">
              <div className="flex justify-between my-4">
                <p className="text-base ">Total Items: </p>
                <p>{items.length}</p>
              </div>

              <div className="flex justify-between my-4">
                <p>Subtotal: </p>
                <p>${(subtotalCents / 100).toFixed(2)}</p>
              </div>

              <div className="flex justify-between my-4">
                <p>HST (13%): </p>
                <p>${hst.toFixed(2)}</p>
              </div>

              <div className="flex justify-between my-4 border-b border-gray-700 pb-6">
                <p>Shipping</p>
                {shippingEstimate !== null && (
                  <p>${shippingAmount.toFixed(2)}</p>
                )}
              </div>

              <div className=" flex justify-between my-4">
                <h3 className="text-xl mb-4">Total:</h3>
                <h3 className="text-xl mb-4 text-kilored">
                  ${total.toFixed(2)}
                </h3>
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              />
              <span className="text-base text-kilotextgrey">
                I agree to the{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>
          <br />

          {shippingEstimate === null && (
            <p className="text-sm">
              Please calculate shipping before proceeding to checkout.
            </p>
          )}

          {/* TODO: redirect to stripe    */}
          <SubmitButton
            type="button"
            variant="primary"
            disabled={!canProceedToCheckout || !addressValid}
            onClick={handleCheckout}
            className="w-full"
          >
            PROCEED TO CHECKOUT
          </SubmitButton>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
