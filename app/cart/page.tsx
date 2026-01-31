"use client";
import { useCart } from "../components/CartContext";
import { CartProduct } from "../components/CartContext";
import { useState } from "react";
import Link from "next/link";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";
import ShippingForm from "../components/ShippingForm";

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
      (groupedItem) => groupedItem.id === item.id
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

  // TODO: replace parcel information when available
  const handleShippingEstimate = async () => {
    try {
      const response = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressTo: {
            name: shippingForm.name,
            phone: normalizePhone(shippingForm.phoneNumber),
            street1: shippingForm.street1,
            city: shippingForm.city,
            state: shippingForm.state,
            zip: normalizePostal(shippingForm.zip),
            country: shippingForm.country,
          },
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

      if (!response.ok) {
        throw new Error("Failed to fetch shipping rates");
      }

      const data = await response.json();
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

  return (
    <section className="
    "
    >
      <div className="bg-kilodarkgrey py-12">
        <div className="
          max-w-7xl mx-auto
          px-6 md:px-16 
          ">
          <h3 className="text-4xl font-semibold text-kilored">Your Cart</h3>
          <p className="text-base md:text-lg text-kilotextgrey mt-6">
            Review your selected items and complete your purchase
          </p>

        </div>

      </div>
    

      <div className="max-w-7xl mx-auto
      px-6 md:px-16 py-24 ">

        <div className="">
          

        </div>
      


      <p>Total Items: {items.length}</p>

      {items.length === 0 && <p>Your cart is empty! </p>}

      {/* LIST OF ITEMS  */}
      <ul className="space-y-4 mt-4">
        {groupedItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 border-b border-gray-700 pb-4"
          >
            <img
              src={item.image_URL}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-md"
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
              px-2 py-1 border rounded
              hover:bg-gray-700"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => addToCart(item)}
              className="
              px-2 py-1 border rounded
              hover:bg-gray-700"
            >
              +
            </button>
            ${((item.price_cents * item.quantity) / 100).toFixed(2)}
          </li>
        ))}
      </ul>
      
      <ShippingForm
        shippingForm={shippingForm}
        onChange={handleShippingChange}
        onEstimate={handleShippingEstimate}
        shippingEstimate={shippingEstimate}
      />
      

      <br />
      <br />

      {/* SUBTOTAL */}
      {items.length > 0 && (
        <div>
          <div>Subtotal: ${(subtotalCents / 100).toFixed(2)}</div>

          <div>HST (13%): ${hst.toFixed(2)}</div>

          {shippingEstimate !== null && (
            <div>Shipping: ${shippingAmount.toFixed(2)}</div>
          )}

          <div className="font-semibold text-xl">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
      <br />
      <br />

      <Link
        href="/store"
        aria-label="Back to Gallery"
        className=" rounded border p-2 cursor-pointer"
      >
        {" "}
        Continue Shopping{" "}
      </Link>

      <br />
      <br />

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
          />
          <span>
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

      <button
        className="rounded border p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canProceedToCheckout}
        onClick={handleCheckout}
      >
        Proceed To Checkout
      </button>

      <br />
      <br />
      <br />
      <br />

      </div>
      
    </section>
  );
};

export default CartPage;
