"use client"

import { createContext, useState, useContext } from "react";
import { Product } from "@/src/types/product";

// Smaller version of Product that we store in the cart
export type CartProduct = {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  category_id: number | null;
  image_URL: string;
};

type CartContextType = {
  items: CartProduct[];
  addToCart: (product: CartProduct) => void;
}


// Create an empty "box" (Context) to hold cart data
export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children}: { children: React.ReactNode }) => {

  // cart state 
  const [items, setItems] = useState<CartProduct[]>([]); 

  const addToCart = (product: CartProduct) => {
    // push the product into the array
    console.log("ADDING TO CART:", product);
    setItems((prevItems) => [...prevItems, product]);
  };

  console.log("items", items);


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

  if (context === null) {
    throw new Error("useCart must be used inside a cart provider")
  }

  return context;

};