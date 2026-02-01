"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import Link from "next/link";
import { CartProduct } from "./CartContext";
import { usePathname } from "next/navigation";

// This is a floating mini-cart that appears when there are items in the cart.
// It can be collapsed/expanded and has a button to go to the full cart page.

type GroupedCartItem = CartProduct & {
  quantity: number;
};

const CartPopup = () => {
  const pathname = usePathname();

  const { items, addToCart, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(true); // collapse/expand

  // clear cart when in after checkout page (Use Effect so it doesnt update while)
  useEffect(() => {
    if (pathname === "/checkout_success") {
      clearCart();
    }
  }, [pathname, clearCart]);

  // don't show the mini cart when we're already on the cart page
  if (pathname === "/cart") {
    return null;
  }

  const totalItems = items.length;

  // if cart is empty dont reurn anything
  if (totalItems === 0) {
    return null;
  }


  // --------- GROUPED ITEMS -----------

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

  // SUBTOTAL
  const subtotalCents = items.reduce((sum, item) => sum + item.price_cents, 0);
  const subtotal = (subtotalCents / 100).toFixed(2);

  return (
    <div
      className="
      fixed bottom-26 right-4 
      bg-black text-white 
      border border-gray-600 
      rounded-lg 
      px-3 py-2 
      text-sm
      z-50
    "
    >
      {/* Header row with title + collapse button */}
      <div className=" flex justify-between p-2">
        <p>Your Cart ({totalItems})</p>
        <button onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? "-" : "+"}
        </button>
      </div>

      {/* Collapsible content */}
      {isOpen && (
        <div>
          <ul className="mt-2 space-y-1 p-2">
            {groupedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2"
              >
                <img
                  src={item.image_URL}
                  alt={item.title}
                  className="w-10 h-10 object-cover rounded"
                />

                <span>{item.title}</span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="border px-2 rounded"
                    aria-label={`Decrease qty of ${item.title}`}
                  >
                    -
                  </button>

                  {item.quantity}

                  <button
                    onClick={() => addToCart(item)}
                    className="border px-2 rounded"
                    aria-label={`Increase qty of ${item.title}`}
                  >
                    +
                  </button>

                  <p>
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <br />

          <p>Subtotal: ${subtotal}</p>
          <br />

          <Link href="/cart" className=" border rounded p-1">
            Go to Checkout
          </Link>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default CartPopup;
