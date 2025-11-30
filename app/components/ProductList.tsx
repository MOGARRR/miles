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
    // <pre> is an HTML tag that preserves: whitespace, indentation, line breaks
    <pre>{JSON.stringify(products, null, 2)}</pre>
  );
}

export default ProductList;
