"use client";
import { useCart } from "../components/CartContext";
import { CartProduct } from "../components/CartContext";
import { useState } from "react";
import Link from "next/link";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";

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
            phone: shippingForm.phoneNumber,
            street1: shippingForm.street1,
            city: shippingForm.city,
            state: shippingForm.state,
            zip: shippingForm.zip,
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
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: checkoutCart,
        shipping: shippingForm,
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
    <div className="pt-24 px-6">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
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

      {/* SHIPPING INPUT */}
      {/* REFACTOR IF NECESSARY WHEN EVERYTHING IS WORKING */}
      <h1 className="text-xl">Shipping (Within Canada) </h1>
      {items.length > 0 && (
        <div>
          <label>Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={shippingForm.name}
            onChange={handleShippingChange}
            placeholder="Your name"
            className="m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />
          <br />
           <label>Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type='tel'
            value={shippingForm.phoneNumber}
            onChange={handleShippingChange}
            placeholder="Format: 123-456-7890"
            className="m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />
          <br />
          <label>Postal Code</label>
          <input
            id="zip"
            name="zip"
            type="text"
            value={shippingForm.zip}
            onChange={handleShippingChange}
            placeholder="e.g. M5V 2T6"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />
          <br />
          <label>City</label>
          <input
            id="city"
            name="city"
            type="text"
            value={shippingForm.city}
            onChange={handleShippingChange}
            placeholder="e.g. Toronto"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />
          <br />
          <label>Street Address</label>
          <input
            id="street1"
            name="street1"
            type="text"
            value={shippingForm.street1}
            onChange={handleShippingChange}
            placeholder="123 Queen St W"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600"
          />
          <br />
          <label>State / Province</label>
          <input
            id="state"
            name="state"
            type="text"
            value={shippingForm.state}
            onChange={handleShippingChange}
            placeholder="e.g. ON"
            className=" m-4 px-2 py-1 rounded bg-gray-900 border border-gray-600 "
          />
          <br />
          <button
            className=" rounded border p-2 cursor-pointer"
            onClick={handleShippingEstimate}
          >
            Estimate Shipping
          </button>
          <br /> <br />
          {/* render shipping cost on UI  */}
          {shippingEstimate !== null && (
            <p>Estimated Shipping Cost: ${shippingEstimate.toFixed(2)}</p>
          )}
        </div>
      )}

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
  );
};

export default CartPage;
