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
        new Set(items.map((item) => item.product_size.id))
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
          (item) => item.product_size.id === latest.id
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
            "Please enter a valid shipping address."
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
    0
  );

  const hst = (subtotalCents / 100) * 0.13;
  const total = subtotalCents / 100 + hst + shippingAmount;

  const hstCents = Math.round(subtotalCents * 0.13);
  const shippingCents = Math.round(shippingAmount * 100);

  const canProceedToCheckout = shippingEstimate !== null && agreedToPrivacy && isStockValid;

  // ----- STRIPE PAYLOAD -----
  const checkoutCart = items.map((item) => ({
    id: item.id,
    title: `${item.title} (${item.product_size.label})`,
    price_cents: item.price_cents,
    quantity: item.quantity,
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

      <div className="
        max-w-7xl mx-auto 
        px-6 md:px-16 
        py-12 md:py-20 
        flex flex-col
        md:flex-row
        gap-8 
        items-start">

        {/* SHIPPING FORM */}
        <div className="flex-1">
          <ShippingForm
            shippingForm={shippingForm}
            onChange={handleShippingChange}
            onEstimate={handleShippingEstimate}
            shippingEstimate={shippingEstimate}
            addressError={addressError}
          />


          <div className="rounded-lg border bg-kilodarkgrey my-12 p-8">
            <ul className="space-y-4">
              {items.map((item) => {
                const isMaxReached =
                  item.quantity >= item.product_size.stock;

                return (
                  <li
                    key={`${item.id}-${item.product_size.id}`}
                    className="
                      flex flex-col
                      md:flex-row
                      items-center 
                      gap-4 
                      pb-4"
                  >
                    <img
                      src={item.image_URL}
                      alt={item.title}
                      className="
                        w-20 h-20 md:w-24 md:h-24 
                        object-cover rounded-md
                      "
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-400">
                        Size: {item.product_size.label}
                      </p>
                      <p className="text-sm">
                        ${(item.price_cents / 100).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.product_size.id)
                      }
                      className="px-2 py-1 border rounded hover:bg-gray-700"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <div className="flex flex-col items-center">
                      <button
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
                        className={`
                          px-2 border rounded
                          ${isMaxReached
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-700"}
                        `}
                      >
                        +
                      </button>

                      
                    </div>
                    

                    <p className="w-[80px] text-right font-semibold">
                      ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                    </p>


                    <div>
                      {isMaxReached && (
                      <p className="text-[11px] text-kilotextgrey mt-1 text-center">
                        Only {item.product_size.stock} available
                      </p>
                    )}

                    </div>
                    
                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.product_size.id)
                      }
                      className="p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                  
                  
                );
              })}
              
            </ul>

            {items.length === 0 && (
              <p className="text-center text-kilotextgrey">
                YOUR CART IS EMPTY!
              </p>
            )}

        
            <div className="flex justify-center">
              <LinkButton href="/store" variant="secondary" className="mt-10">
                {items.length === 0 ? "GO TO GALLERY" : "CONTINUE SHOPPING"}
              </LinkButton>

            </div>
            


          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="
          w-full
          md:w-[400px] 
          bg-kilodarkgrey 
          rounded-lg border 
          p-6 md:p-8">
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
              Some items were adjusted due to limited stock. Please review your cart.
            </p>
          )}

          <SubmitButton
            className="w-full mt-6"
            // disabled={!canProceedToCheckout || !addressValid}
            // onClick={handleCheckout}
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
