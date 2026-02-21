"use client";

import React, { useState, useEffect } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";
import SearchBar from "./ui/SearchBar";
import { useDebounce } from "@/src/hooks/useDebounce";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { RotateCw } from "lucide-react";

// defines the type of props
type ProductListClientProps = {};

const ProductListClient: React.FC = () => {
  //LAZY LOADING
  const PAGE_SIZE = 6;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Fetch products from the API using page-based pagination.
   * Page 1 replaces products, next pages append to the list.
   */

  const fetchProducts = async (
    pageToLoad: number,
    searchTerm?: string,
    searchType?: boolean,
  ) => {
    setIsLoading(true)
    const finalSearch = searchTerm ?? debouncedSearch;
    const finalSearchType = searchType ?? isCategorySearch;
    try {
      const res = await fetch(
        `/api/products?page=${pageToLoad}&limit=${PAGE_SIZE}&search=${encodeURIComponent(finalSearch)}&searchType=${finalSearchType}`,
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

  const fetchCategoties = async () => {
    try {
      const res = await fetch("/api/categories/");
      const data = await res.json();
      setCategories(data.categories);
    } catch (err: any) {
      console.error("Error fetching Categories", err);
    }
  };

  // Initial page load
  useEffect(() => {
    fetchProducts(1);
    fetchCategoties();
  }, []);

  // SEARCH
  // Raw input value (updates on keystroke)
  const [searchInput, setSearchInput] = useState("");
  // Debounced value used for filtering
  const debouncedSearch = useDebounce(searchInput, 300);
  // True while debounce delay is still running
  const isSearching = searchInput !== debouncedSearch;
  // True - filter for Category, False - filter for product
  const [isCategorySearch, setIsCategorySearch] = useState(false);

    // if no results
  const noResults =
    !isLoading &&
    debouncedSearch.length > 0 &&
    products.length === 0;

  //reset pagination when search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, debouncedSearch, isCategorySearch);
  }, [debouncedSearch, isCategorySearch]);

  const handleSearchType = () => setIsCategorySearch(!isCategorySearch);
  {
    /* {categories.map((category) => {
          return (
            <div key={category.id} className="m-2 cursor-pointer">
              {category.title}
            </div>
          );
        })} */
  }

  return (
    <section className="mt-20">
      {/* Basic search input field  */}
      <div
        className="
        px-10
      "
      >
        <div className="flex justify-center ">
          <div className="flex flex-col">
            <h2 className="text-xl text-center">
              Search by
              {isCategorySearch && " Category"}
              {!isCategorySearch && " Product"}
            </h2>
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Name or Category"
            />
          </div>
          <button
            onClick={handleSearchType}
            className="
            bg-gray-700 hover:bg-gray-800
            self-end
            rounded-full
            p-2 ml-2
            cursor-pointer
            "
          >
            <RotateCw />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 min-h-[20px] px-10">
        {isSearching && (
          <span className="text-xs text-kilotextlight italic">Searching…</span>
        )}
      </div>

     
      {noResults && (
        <div className="
          px-4
          sm:px-6
          md:px-10
          mt-6
          text-center
        ">
          <p className="text-sm text-kilotextlight">
            No results found for{" "}
            <span className="italic">“{debouncedSearch}”</span>
          </p>
        </div>
      )}

      {/* PRODUCT GRID  */}
      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        gap-8
        p-10
        
      "
      >
        {products.map((product) => {
          const categories = product.categories ?? [];

          const startingPriceCents =
            product.product_sizes && product.product_sizes.length > 0
              ? Math.min(...product.product_sizes.map((s) => s.price_cents))
              : undefined;

          const isSoldOut =
            Array.isArray(product.product_sizes) &&
            product.product_sizes.length > 0 &&
            product.product_sizes.every((size) => size.stock === 0);

          return (
            <ProductListItem
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              image_URL={product.image_URL}
              starting_price_cents={startingPriceCents}
              sold_out={isSoldOut}
              is_available={product.is_available}
              created_at={product.created_at}
              updated_at={product.updated_at}
              categories={categories}
            />
          );
        })}

        {/* Skeleton cards while loading */}
        {isLoading &&
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductSkeletonCard key={`skeleton-${index}`} />
          ))}
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
  );
};

export default ProductListClient;
