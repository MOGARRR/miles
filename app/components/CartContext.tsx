"use client";

import { createContext, useState, useContext, useEffect, useCallback } from "react";

// Defining the type of a smaller version of Product that we store in the cart
export type CartProduct = {
  id: number;
  title: string;
  description: string;
  image_URL: string;
  category_id: number | null;


  price_cents: number; // price of the selected size

  product_size: {
    id: number;
    label: string;
    price_cents: number;
  };

  quantity: number;
  
  
};

type CartContextType = {
  items: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number, sizeId: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "kiloboy_cart";

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
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
      console.error("Error reading cart from localStorage");
    }
  }, []);

  // when items change, save update localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (product: CartProduct) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.product_size.id === product.product_size.id
      );

      // If same product + same size already exists → increment quantity
      if (existingIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return updatedItems;
      }

      // Otherwise add as new cart item
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // console.log("items", items);

  const removeFromCart = (productId: number, sizeId: number) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.product_size.id === sizeId
          )
      )
    );
  };


 // Set items to empty 
 const clearCart = useCallback(() => {
  setItems([]);
  // clear localstorage to so cart stay empty
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}, []);

  return (
    //anything inside <CartProvider> ... </CartProvider> can now read items and addToCart using useContext(CartContext)
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// helper hook so other components can easily use the cart context
export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used inside a cart provider");
  }

  return context;
};
