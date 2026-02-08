"use client"; 

import React, { useState, useEffect } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";
import SearchBar from "./ui/SearchBar";
import { useDebounce } from "@/src/hooks/useDebounce";
import ProductSkeletonCard from "./ProductSkeletonCard";


// defines the type of props 
type ProductListClientProps = {

  categoryMap: Record<number, string>;
}; 

const ProductListClient: React.FC<ProductListClientProps> = ({ categoryMap }) => {

  //LAZY LOADING 
  const PAGE_SIZE = 6;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch products from the API using page-based pagination.
   * Page 1 replaces products, next pages append to the list.
   */
  const fetchProducts = async (
    pageToLoad: number,
    searchTerm = debouncedSearch

  ) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `/api/products?page=${pageToLoad}&limit=${PAGE_SIZE}&search=${encodeURIComponent(searchTerm)}`
      );

      const data = await res.json();

      // First page replaces existing products
      if (pageToLoad === 1) {
        setProducts(data.products);
        setHasMore(true); // reset when starting fresh
      } else {
        // Next pages append to existing list (lazy loading)
        setProducts((prev) => [...prev, ...data.products]);
      }

      // If we received fewer than PAGE_SIZE items,
      // there are no more products to load
      if (data.products.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial page load
  useEffect(() => {
    fetchProducts(1);
  }, []);


  // SEARCH
  // Raw input value (updates on keystroke)
  const [searchInput, setSearchInput] = useState("");
  // Debounced value used for filtering
  const debouncedSearch = useDebounce(searchInput, 300);
  // True while debounce delay is still running
  const isSearching = searchInput !== debouncedSearch;

  //reset pagination when search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, debouncedSearch);
  }, [debouncedSearch]);
  


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
        {products.map((product) => {
          const categoryName = product.category_id !== null
          ? categoryMap[product.category_id]
          : undefined;

          const startingPriceCents =
            product.product_sizes && product.product_sizes.length > 0
              ? Math.min(...product.product_sizes.map((s) => s.price_cents))
              : undefined;

          return (
            <ProductListItem
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              category_id={product.category_id}
              image_URL={product.image_URL}
              starting_price_cents={startingPriceCents}
              sold_out={product.sold_out}
              is_available={product.is_available}
              created_at={product.created_at}
              updated_at={product.updated_at}
              category_name={categoryName}
            />

          )
        })}

        {/* Skeleton cards while loading */}
        {isLoading &&
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductSkeletonCard key={`skeleton-${index}`} />
          ))
        }

  
      </div>

      {hasMore && (
          <div className="flex justify-center pb-12">
            <button
              onClick={() => {
                if (isLoading) return;

                const nextPage = page + 1;
                setPage(nextPage);
                fetchProducts(nextPage);
              }}
              disabled={isLoading}
              className="
                px-6 py-2
                border border-black
                text-sm uppercase tracking-wide
                hover:bg-black hover:text-white
                transition
                disabled:opacity-50
              "
            >
              {isLoading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      
    </section>
  )

}

export default ProductListClient;