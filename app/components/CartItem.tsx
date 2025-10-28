import React from "react";
import Image from "next/image";
import Link from "next/link";
import QuanityButton from "./QuantityButton";
import { usePathname } from "next/navigation";

interface CartItemProps {
  id: number;
  image: string;
  imageAlt: string;
  name: string;
  price: number;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  image,
  imageAlt,
  name,
  price,
}) => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between mt-2">
      <Link href={`/storeItem/${id}`} className="flex ">
        <img className="w-15 h-20 mr-2 border-2" src={image} alt={imageAlt} />
        <h1 className=" text-l mt-1">{name}</h1>
      </Link>
      <div className="flex justify-between w-1/2 text-center text-xl">
        <QuanityButton amount={1} classInfo="h-8 w-7 m-1 text-3xl" />

        <h1 className="m-1">${price}</h1>
      </div>
    </div>
  );
};

export default CartItem;
