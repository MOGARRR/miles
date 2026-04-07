"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./CartContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ShoppingCart, Trash2, X } from "lucide-react";

// Floating mini-cart when there are items. Collapsible; links to full cart page.

const CartPopup = () => {
  const pathname = usePathname();

  const {
    items,
    addToCart,
    decrementQuantity,
    removeFromCart,
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
        text-kilotextlight
        border rounded-xl
        text-sm
        z-[9999] shadow-xl shadow-black/30
        overflow-hidden
        transition-[width,background-color,border-color] duration-200
        bg-kilodarkgrey
        ${isOpen ? "w-72 border border-[#3a3a41]" : "w-fit border-2 border-gray-500"}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2
          transition-colors text-left
          ${isOpen ? "border-b border-[#3a3a41] bg-black/20 hover:bg-black/30 px-4 py-3" : "px-3 py-2 hover:bg-black/20"}
        `}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Collapse" : "Expand"} shopping cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
      >
        <span className="flex items-center gap-2 font-semibold text-kilored">
          <ShoppingCart size={18} className="shrink-0 text-kilored" aria-hidden />
          <span className="tabular-nums">{totalItems}</span>
        </span>
        {isOpen ? <X size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
      </button>

      {isOpen && (
        <div className="flex flex-col">
          <ul className="max-h-52 overflow-y-auto py-2 px-3">
            {items.map((item) => {
              const isMaxReached =
                item.quantity >= item.product_size.stock;

              return (
                
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

                  <div className="flex flex-col items-end gap-1">
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
                        disabled={isMaxReached}
                        className={`
                          w-7 h-7 border rounded
                          ${
                            isMaxReached
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "hover:bg-black/30"
                          }
                        `}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id, item.product_size.id)
                        }
                        className="p-1 ml-0.5 text-kilotextgrey hover:text-kilored"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isMaxReached && (
                      <p className="text-[11px] text-kilotextgrey">
                        Only {item.product_size.stock} available
                      </p>
                    )}
                  </div>

                </li>
              );
          })}
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
                block w-full text-center text-xs font-semibold
                px-3 py-2 rounded-md
                bg-kilored text-white border border-kilored
                hover:bg-[#B53535] hover:border-[#B53535]
                transition-colors
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
