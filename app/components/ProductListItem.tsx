"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { CartProduct } from "./CartContext";


// the interface defines what props the component must receive
interface ProductListItemProps {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  category_id: number | null;
  category_name?: string;
  image_URL: string;
  sold_out: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
}



// React.FC means Functional Component
// ProductListItem is a functional component and its props must follow the ProductListItemProps interface.
const ProductListItem: React.FC<ProductListItemProps> = ({
  id,
  title,
  description,
  price_cents,
  category_id,
  category_name,
  image_URL,
  sold_out, 
  is_available,
  created_at,
  updated_at
}) => {

  const { addToCart } = useCart();

  // Build the product object to send to the cart
  const productToAdd: CartProduct = {
    id,
    title,
    description, 
    price_cents,
    category_id,
    image_URL,
  }

  
  return (

    <div className="
      flex flex-col
      rounded-lg border border-[#3a3a41]
      bg-kilodarkgrey
      "
    >

      {/* Clickable area: image + main content */}
      {/* <Link href={`/storeItem/${id}`}> */}
      
        {/* IMAGE */}
        <div className="pt-3 pb-3 bg-[#3F3F46] rounded-t-lg">
          <div className="
            relative w-full aspect-[1/1] overflow-hidden"
          >
            <Image
            src={image_URL}
            alt={title}
            fill
            className="object-cover"
            />
          </div>
        </div>
      

        {/* CONTENT */}
        <div className="flex flex-col py-4 px-6 gap-2">

          {/* reference to categories table later to fetch title */}
          {/* w-fit ensures the badge sizes to its content
            (prevents stretching when parent uses flex/grid) */}
          <span className=" 
            w-fit
            px-3 py-0.5
            text-sm font-semibold
            bg-kilored 
            rounded-full
            " 
          >
            {category_name}
          </span>

          <h1 className="
            mt-2 mb-2 text-lg md:text-xl font-bold">
            {title}
          </h1>

          <p className="
            text-xs md:text-sm text-kilotextgrey"
          >
            {description}
          </p>
        </div>
      {/* </Link> */}
      
      {/* PRICE AND BUY NOW BUTTON ROW*/}
      <div className="
        mt-auto
        flex items-center justify-between
        px-6 pb-6 pt-2
        
      ">
    
        {sold_out ? ( 
          <>
          <p className="text-kilored text-base font-semibold">
            Sold Out
            </p>
          </>
          
        ) : (
          <p className="text-kilored text-lg font-semibold">
          ${ price_cents / 100 }
          </p>)}

        <button
          type="button"
          disabled={sold_out}
          onClick={() => {
            addToCart(productToAdd);
          }}
          className={`
          bg-kilored
          px-4 py-2
          border border-[#3a3a41] rounded-lg
          font-semibold
          flex items-center gap-2
          transition-colors duration-200
          hover:bg-[#B53535]
          cursor-pointer
                
          ${sold_out ? "opacity-40 cursor-not-allowed" : ""}`}

        > 
          Add < ShoppingCart size={20} />
        </button>

      </div> 

    </div>
    
  );
};

export default ProductListItem;
