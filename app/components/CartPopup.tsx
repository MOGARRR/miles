"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./CartContext";
import Link from "next/link";
import { CartProduct } from "./CartContext";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

// Floating mini-cart when there are items. Collapsible; links to full cart page.

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
      {/* Header: always shows count; when collapsed also shows subtotal */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2
          border-b border-[#3a3a41]
          bg-black/20 hover:bg-black/30
          transition-colors text-left
          focus:outline-none focus-visible:ring-2 focus-visible:ring-kilored/60 focus-visible:ring-offset-2 focus-visible:ring-offset-kilodarkgrey
          ${isOpen ? "px-4 py-3" : "px-3 py-2 max-sm:px-2 max-sm:py-1.5 sm:px-4 sm:py-3"}
        `}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse cart" : "Expand cart"}
      >
        <span className="font-semibold text-kilored truncate">Your Cart ({totalItems})</span>
        <span className="flex items-center gap-2 text-kilotextgrey shrink-0">
          {isOpen ? (
            <ChevronUp size={18} className="shrink-0" />
          ) : (
            <ChevronDown size={18} className="shrink-0" />
          )}
        </span>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="flex flex-col">
          <ul className="max-h-52 overflow-y-auto overflow-x-hidden py-2 px-3 flex-1">
            {groupedItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 py-2.5 px-1 border-b border-[#3a3a41]/80 last:border-0 rounded-sm hover:bg-white/[0.03] transition-colors"
              >
                <img
                  src={item.image_URL}
                  alt={item.title}
                  className="w-11 h-11 object-cover rounded-lg shrink-0 ring-1 ring-[#3a3a41]/50"
                />
                <div className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-kilotextlight">
                    {item.title}
                  </span>
                  <span className="text-kilotextgrey text-xs tabular-nums">
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-[#3a3a41] text-kilotextlight hover:bg-white/10 hover:border-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kilored/50"
                    aria-label={`Decrease qty of ${item.title}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-[#3a3a41] text-kilotextlight hover:bg-white/10 hover:border-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-kilored/50"
                    aria-label={`Increase qty of ${item.title}`}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 border-t border-[#3a3a41] bg-black/25 rounded-b-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-kilotextgrey text-sm">Subtotal</span>
              <span className="font-semibold text-kilored text-base">${subtotal}</span>
            </div>
            <Link
              href="/cart"
              className="block w-full text-center text-sm font-semibold px-4 py-3 rounded-lg bg-kilored text-white hover:bg-[#B53535] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-kilored focus-visible:ring-offset-2 focus-visible:ring-offset-kilodarkgrey"
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
