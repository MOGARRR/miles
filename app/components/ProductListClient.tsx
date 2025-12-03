// client side component 
// 

"use client"; 

import React from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";

// defines the type of props 
type ProductListClientProps = {
  products: Product[];
  categoryMap: Record<number, string>;
}; 

const ProductListClient: React.FC<ProductListClientProps> = ({ products, categoryMap, }) => {
  return (
    <div>
      <p>Product List Client </p>
    </div>
  )


}

export default ProductListClient;