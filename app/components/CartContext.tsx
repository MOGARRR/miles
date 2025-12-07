"use client"

import { createContext, useState, useContext, useEffect } from "react";


// Defining the type of a smaller version of Product that we store in the cart
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

const STORAGE_KEY = "kiloboy_cart";


export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({children}: { children: React.ReactNode }) => {

  // cart state 
  const [items, setItems] = useState<CartProduct[]>([]); 

  // runs once when the app loads
  useEffect(() => {

    // If window doesn’t exist → stop the function
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY); 

      // if cart exists, load it 
      if (stored) {
        // localStorage only stores strings
        // convert string back into an array of objects
        const parsed: CartProduct[] = JSON.parse(stored);
        setItems(parsed);
      }  
    } catch (error) {
      console.error("Error reading cart from localStorage")
    }
    
  },[]);

  // when items change, save update localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }

  }, [items]);



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