import React from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";


const ProductList = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  //fetch from the api route
  const res = await fetch(`${baseUrl}/api/products`, {cache: "no-store"});

  //parse the JSON
  const data: { products: Product[] } = await res.json();
  const products = data.products; // pulls out the array

  return (
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      gap-12
      p-10
      
    ">
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          id={product.id}
          title={product.title}
          description={product.description}
          category_id={product.category_id}
          image_URL={product.image_URL}
          price_cents={product.price_cents}
          sold_out={product.sold_out}
          is_available={product.is_available}
        />
      ))}
    </div>
  )
}

export default ProductList;
