import React from "react";
import Image from "next/image";
import Link from "next/link";


interface ProductListItemProps {
  id: number;
  image: string;
  imageAlt: string;
  name: string;
  price: number;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
  id,
  image,
  imageAlt,
  name,
  price,
}) => {
  return (
    <Link href={`/storeItem/${id}`} replace className="card bg-base-100 w-5/6 shadow-sm m-4 h-[30vh] ">
      <figure >
        <Image  width={500} height={300} src={image} alt={imageAlt} priority />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-xl">{name}</h2>
        <h3 className="text-xl">${price}</h3>
      </div>
    </Link>
  );
};

export default ProductListItem;
