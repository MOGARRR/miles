"use client"

import { useState } from "react";
import { useCart } from "./CartContext";
import Link from "next/link";
import { CartProduct } from "./CartContext";


// This is a floating mini-cart that appears when there are items in the cart.
// It can be collapsed/expanded and has a button to go to the full cart page.

type GroupedCartItem = CartProduct & {
  quantity: number;
};

const CartPopup = () => {

  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(true); // collapse/expand 

  const totalItems = items.length; 

  // if cart is empty dont reurn anything
  if (totalItems === 0) {
    return null;
  }


  // --------- GROUPED ITEMS -----------

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
        quantity:1
      });
    }
  }; 
 
  // SUBTOTAL
  const subtotalCents = items.reduce((sum, item) => sum + item.price_cents, 0); 
  const subtotal = (subtotalCents / 100).toFixed(2);


  

  return (
    <div className="
      fixed bottom-4 right-4 
      bg-black text-white 
      border border-gray-600 
      rounded-lg 
      px-3 py-2 
      text-sm
      z-50
    ">

      {/* Header row with title + collapse button */}
      <div>
        <p>Your Cart ({totalItems})</p>
        <button onClick={() => setIsOpen(prev => !prev)}>
          {isOpen ? "-" : "+"}
        </button>

      </div>

      {/* Collapsible content */}
      {isOpen && (
        <div>
          <p>{totalItems} item{totalItems > 1 ? "s" : ""} in your cart.</p>
          <ul className="mt-2 space-y-1">
            {groupedItems.map((item) => (
            <li key={item.id}>
              {item.title} x {item.quantity}

            </li>
          ))}
            
          </ul>
          
          <p>Subtotal: ${subtotal}</p>
          <Link href="/cart">
            <button>
              Go to Checkout
            </button>
          
          </Link>

        </div>
      )}
       
    </div>
  )
};

export default CartPopup;
