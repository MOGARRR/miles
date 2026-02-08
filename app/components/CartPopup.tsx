"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

// Floating mini-cart when there are items. Collapsible; links to full cart page.

const CartPopup = () => {
  const pathname = usePathname();

  const {
    items,
    addToCart,
    decrementQuantity,
    clearCart,
  } = useCart();

  const [isOpen, setIsOpen] = useState(true);

  // Clear cart after successful checkout
  useEffect(() => {
    if (pathname === "/checkout_success") {
      clearCart();
    }
  }, [pathname, clearCart]);

  // Don’t show on cart page
  if (pathname === "/cart") return null;

  if (items.length === 0) return null;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotalCents = items.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0
  );

  const subtotal = (subtotalCents / 100).toFixed(2);

  const popup = (
    <div
      className={`
        fixed bottom-6 right-6
        max-w-[calc(100vw-3rem)]
        bg-kilodarkgrey text-kilotextlight
        border border-[#3a3a41] rounded-xl
        text-sm
        z-[9999] shadow-xl shadow-black/30
        overflow-hidden
        transition-[width] duration-200
        ${isOpen ? "w-72" : "w-fit"}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2
          border-b border-[#3a3a41]
          bg-black/20 hover:bg-black/30
          transition-colors text-left
          ${isOpen ? "px-4 py-3" : "px-3 py-2"}
        `}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-kilored truncate">
          Your Cart ({totalItems})
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="flex flex-col">
          <ul className="max-h-52 overflow-y-auto py-2 px-3">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.product_size.id}`}
                className="flex items-center gap-3 py-2.5 border-b border-[#3a3a41]/80 last:border-0"
              >
                <img
                  src={item.image_URL}
                  alt={item.title}
                  className="w-11 h-11 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">
                    {item.title}
                  </p>
                  <p className="text-xs text-kilotextgrey">
                    Size: {item.product_size.label}
                  </p>
                  <p className="text-xs tabular-nums">
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {/* DECREMENT */}
                  <button
                    onClick={() =>
                      decrementQuantity(item.id, item.product_size.id)
                    }
                    className="w-7 h-7 border rounded"
                  >
                    −
                  </button>

                  <span className="w-6 text-center">
                    {item.quantity}
                  </span>

                  {/* INCREMENT */}
                  <button
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
                    className="w-7 h-7 border rounded"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 border-t border-[#3a3a41] bg-black/25">
            <div className="flex justify-between mb-3">
              <span className="text-kilotextgrey">Subtotal</span>
              <span className="font-semibold text-kilored">
                ${subtotal}
              </span>
            </div>

            <Link
              href="/cart"
              className="
                block w-full text-center
                px-4 py-3 rounded-lg
                bg-kilored text-white
                hover:bg-[#B53535]
              "
            >
              Go to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(popup, document.body);
};

export default CartPopup;
