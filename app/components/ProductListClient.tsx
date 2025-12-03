// client side component 
// 

"use client"; 

import React, { useState } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";

// defines the type of props 
type ProductListClientProps = {
  products: Product[];
  categoryMap: Record<number, string>;
}; 

const ProductListClient: React.FC<ProductListClientProps> = ({ products, categoryMap, }) => {

  const [search, setSearch] = useState(""); 

  const filteredProducts = products.filter((product) => {
    const title = product.title.toLowerCase(); 
    const term = search.toLowerCase(); 

    return title.includes(term);
  })


  return (
    <div>
      <p>Product List Client </p>

      {/* Basic search input field  */}
      <input
        type="text"
        placeholder="Search by name or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}

      />

      <p>Found {filteredProducts.length} results</p>
    </div>
  )

}

export default ProductListClient;