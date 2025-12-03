"use client"

import { createContext } from "react";

// Create an empty "box" (Context) to hold cart data
// it starts as null because we haven't built the cart yet
// Later, we will store the cart items and functions (addToCart, etc.) in here
export const CartContext = createContext(null); 


// STEP 2: Create the CartProvider
// This component WRAPS part of the app and gives it access
// to whatever value we put inside CartContext.Provider.
//
// Right now, value={null} means:
//   "There is no cart data yet, but the structure exists."
//
// Later, this Provider will contain the real cart state.
export const CartProvider = ({children}: { children: React.ReactNode }) => {
  return (
    <CartContext.Provider value={null}>
      {children}
    </CartContext.Provider>
  );
};