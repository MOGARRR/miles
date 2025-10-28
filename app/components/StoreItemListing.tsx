import React from "react";
import QuanityButton from "./QuantityButton";

interface StoreItemListingProps {
  image: string;
  imageAlt: string;
  name: string;
  description: string;
  price: number;
}

const StoreItemListing: React.FC<StoreItemListingProps> = ({
  image,
  imageAlt,
  name,
  description,
  price,
}) => {
  
  
  return (
    <div>
      {" "}
      <div className="bg-base-100 w-5/6 shadow-sm m-8 h-[30vh] ">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="m-4 p-5">
        <h1 className="text-4xl">{name}</h1>
        <h2 className="text-xl">${price}</h2>
      </div>
      <div className="m-8 p-4">
        <h1 className="text-2xl mb-2">Quanity *</h1>
        <div className="border-2 w-1/4 flex text-xl justify-evenly" id="total">
          <QuanityButton amount={0} classInfo="m-1 text-xl"/>
        </div>
        <div className="mt-4">
          <button className=" text-2xl text-white btn btn-neutral btn-outline rounded-xl border-white w-full m-1">
            Add to Cart
          </button>
          <button className="text-2xl text-white bg-slate-800 btn btn-neutral btn-outline rounded-xl border-white w-full m-1">
            Buy Now
          </button>
        </div>
        <div className="mt-8 ">
          <h1 className="text-2xl border-b-2 mb-2">Product Description</h1>
          <p className="text-lg"> {description}</p>
        </div>
      </div>
    </div>
  );
};

export default StoreItemListing;
