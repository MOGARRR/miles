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
    <div>
      <Link href={`/storeItem/${id}`}>
      <div>
        <Image
          src={image_URL}
          alt={title}
          width={200}
          height={200}
        />
        <h1>{title}</h1>

        {/* reference to categories table later to fetch title */}
        <h2>{category_id}</h2>

        <p>{description}</p>
        <p>{ price_cents / 100 }</p>
        {sold_out && <p>Sold Out</p>}

      </div>
      
      
      </Link>



    </div>
    
  );
};

export default ProductListItem;
