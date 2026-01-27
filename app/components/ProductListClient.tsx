"use client"; 

import React, { useState } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";
import SearchBar from "./ui/SearchBar";
import { useDebounce } from "@/src/hooks/useDebounce";

// defines the type of props 
type ProductListClientProps = {

  categoryMap: Record<number, string>;
}; 

const ProductListClient: React.FC<ProductListClientProps> = ({ categoryMap }) => {

  //LAZY LOADING 
  const PAGE_SIZE = 9;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  // SEARCH
  // Raw input value (updates on keystroke)
  const [searchInput, setSearchInput] = useState("");
  // Debounced value used for filtering
  const debouncedSearch = useDebounce(searchInput, 300);
  // True while debounce delay is still running
  const isSearching = searchInput !== debouncedSearch;

  const filteredProducts = products.filter((product) => {
    // only show available products
    if (!product.is_available) return false;

    //lower case
    const title = product.title.toLowerCase(); 
    const term = debouncedSearch.toLowerCase(); 

    // get the category name from the map (if exists)
    const categoryName = categoryMap[product.category_id || 0]; 
    const category = categoryName ? categoryName.toLowerCase() : ""; 

    return title.includes(term) || category.includes(term);
  })


  return (
    <section className="mt-20" >

      {/* Basic search input field  */}
      <div className="
        px-10
      ">
        <SearchBar 
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search by name or category"
        />

      </div>
      
      <div className="flex items-center gap-2 mt-2 min-h-[20px] px-10">
        {isSearching && (
          <span className="text-xs text-kilotextlight italic">
            Searching…
          </span>
        )}
      </div>
            

      {/* <p>Found {filteredProducts.length} results</p> */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        gap-8
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
      
    </section>
  )

}

export default ProductListClient;