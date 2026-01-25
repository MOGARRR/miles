"use client"; 

import React, { useState } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";
import SearchBar from "./ui/SearchBar";

// defines the type of props 
type ProductListClientProps = {
  products: Product[];
  categoryMap: Record<number, string>;
}; 

const ProductListClient: React.FC<ProductListClientProps> = ({ products, categoryMap, }) => {

  const [search, setSearch] = useState(""); 

  const filteredProducts = products.filter((product) => {
    // only show available products
    if (!product.is_available) return false;

    //lower case
    const title = product.title.toLowerCase(); 
    const term = search.toLowerCase(); 
    // get the category name from the map (if exists)
    const categoryName = categoryMap[product.category_id || 0]; 
    const category = categoryName ? categoryName.toLowerCase() : ""; 

    return title.includes(term) || category.includes(term);
  })


  return (
    <div >

      {/* Basic search input field  */}
      <SearchBar 
        value={search}
        onChange={setSearch}
        placeholder="Search by name or category"
      />
      

      {/* <p>Found {filteredProducts.length} results</p> */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        gap-12
        p-10
        
      ">
        {filteredProducts.map((product) => {
          const categoryName = product.category_id !== null
          ? categoryMap[product.category_id]
          : undefined;

          return (
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
              created_at={product.created_at}
              updated_at={product.updated_at}
              category_name={categoryName}
            />

          )
        })}

      </div>
      
    </div>
  )

}

export default ProductListClient;