"use client"

import { createContext, useState, useContext } from "react";
import { Product } from "@/src/types/product";


// Create an empty "box" (Context) to hold cart data
// it starts as null because we haven't built the cart yet
// Later, we will store the cart items and functions (addToCart, etc.) in here
export const CartContext = createContext(null); 


export const CartProvider = ({children}: { children: React.ReactNode }) => {

  // cart state 
  const [items, setItems] = useState([]); 

  const addToCart = (product: Product) => {
    // push the product into the array
    setItems((prevItems) => [...prevItems, product]);
  };


  return (
    //anything inside <CartProvider> ... </CartProvider> can now read items and addToCart using useContext(CartContext)
    <CartContext.Provider value={{ items, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};



// helper hook so other components can easily use the cart context
export const useCart = () => {
  const context = useContext(CartContext); 

  if (!context) {
    throw new Error("useCart must be used inside a cart provider")
  }

  return context;

};