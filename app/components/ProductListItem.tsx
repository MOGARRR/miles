import React from "react";
import Image from "next/image";
import Link from "next/link";

// the interface defines what props the component must receive
interface ProductListItemProps {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  category_id: number | null;
  image_URL: string;
  sold_out: boolean;
  is_available: boolean;
}

// React.FC means Functional Component
// ProductListItem is a functional component and its props must follow the ProductListItemProps interface.
const ProductListItem: React.FC<ProductListItemProps> = ({
  id,
  title,
  description,
  price_cents,
  category_id,
  image_URL,
  sold_out, 
  is_available,
}) => {
  
  return (

    <div className="
      flex flex-col
      rounded-2xl
      bg-[#2E2E33]
      p-3
      "
    >

      {/* Clickable area: image + main content */}
      <Link href={`/storeItem/${id}`}>
      
        {/* IMAGE */}
        <div className="gap-2 p-4 pb-3">
          <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden">
            <Image
            src={image_URL}
            alt={title}
            fill
            className="object-cover"
            
          />

          </div>
        </div>
      

        {/* CONTENT */}
        <div className="flex flex-col gap-2 p-4 pb-3">
          <h1 className="">
            {title}
          </h1>

          {/* reference to categories table later to fetch title */}
          <h2>
            {category_id ?? "Category"}
          </h2>

          <p className="text-sm leading-snug">
            {description}
          </p>
        </div>
      </Link>
      
      {/* PRICE AND BUY NOW BUTTON ROW*/}
      <div className="
        mt-auto
        flex items-center justify-between
        px-4 pb-4 pt-2
        
      ">
    

        {sold_out ? ( 
          <>
          <p className="text-red-500 text-base font-semibold">
            Sold Out
            </p>
          </>
          
        ) : (
          <p className="text-base font-semibold">
          ${ price_cents / 100 }
          </p>)}

        <button
          type="button"
          className="
          bg-[#E14747]
          px-4 py-2
          rounded-full
          font-semibold"
        > 
          BUY NOW 
        </button>

      </div> 

    </div>
    
  );
};

export default ProductListItem;
