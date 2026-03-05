"use client";

import React, { useState, useEffect } from "react";
import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";
import SearchBar from "./ui/SearchBar";
import { useDebounce } from "@/src/hooks/useDebounce";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { Funnel, Check } from "lucide-react";

// defines the type of props
type ProductListClientProps = {};

const ProductListClient: React.FC<ProductListClientProps> = () => {
  const PAGE_SIZE = 6;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterMenu, setFilterMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const isSearching = searchInput !== debouncedSearch;

  const fetchProducts = async (
    pageToLoad: number,
    searchTerm?: string,
    categoryOverride?: number[],
  ) => {
    setIsLoading(true);
    const finalSearch = searchTerm ?? debouncedSearch;
    const finalCategories = categoryOverride ?? selectedCategories;
    const categoryParam = finalCategories.join(",");

    try {
      const res = await fetch(
        `/api/products?page=${pageToLoad}&limit=${PAGE_SIZE}&search=${encodeURIComponent(
          finalSearch,
        )}&categories=${categoryParam}`,
      );
      const data = await res.json();

      if (pageToLoad === 1) {
        setProducts(data.products);
        setHasMore(true);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }

      if (data.products.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories/");
      const data = await res.json();
      setCategories(data.categories);
    } catch (err: any) {
      console.error("Error fetching Categories", err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, debouncedSearch, selectedCategories);
  }, [debouncedSearch, selectedCategories]);

  const noResults =
    !isLoading && debouncedSearch.length > 0 && products.length === 0;

  const handleFilterMenu = () => setFilterMenu(!filterMenu);

  return (
    <section className="mt-20">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="flex flex-col">
          <h2 className="text-2xl text-center">Search by Product</h2>
          <div className="flex">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Name or Description"
            />
            <button
              onClick={handleFilterMenu}
              className="lg:flex hidden bg-gray-700 hover:bg-gray-800 self-end p-2 ml-2 rounded-full cursor-pointer"
            >
              <Funnel />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Menu */}
      <section
        className={`filter ${ filterMenu ? "open" : "closed"} lg:flex lg:absolute hidden left-38 mt-15`}
      > 
      {/* FIX FILTER MENU RESPONSIVENESS */}
        <div className="bg-kilodarkgrey p-5 w-42 border rounded-md">
          <div className="border-b-1 text-xl text-center mb-2">
            <h1>Filter By:</h1>
          </div>

          <div className="flex flex-col gap-2 justify-evenly">
            {categories.map((category) => {
              const isChecked = selectedCategories.includes(category.id);
              return (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(category.id)
                          ? prev.filter((id) => id !== category.id)
                          : [...prev, category.id],
                      );
                    }}
                    // Hides default style and is only visible by screen readers
                    className="sr-only"
                  />

                  {/* Custom checkbox */}
                  <span
                    className={`min-w-5 h-5 flex items-center justify-center border-2 rounded transition-colors ${
                      isChecked ? "bg-kilored border-none" : "border-gray-400"
                    }`}
                  >
                    {isChecked && <Check />}
                  </span>

                  <span>{category.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* Searching indicator */}
      <div className="flex items-center gap-2 min-h-[20px] px-6 md:px-10">
        {isSearching && (
          <span className="text-xs text-kilotextlight italic">Searching…</span>
        )}
      </div>

      {/* No results */}
      {noResults && (
        <div className="px-4 sm:px-6 md:px-10 mt-6 text-center">
          <p className="text-sm text-kilotextlight">
            No results found for{" "}
            <span className="italic">“{debouncedSearch}”</span>
          </p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:p-10">
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

      {/* Load More Button */}
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
            className="px-6 py-2 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white transition disabled:opacity-50"
          >
            {isLoading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductListClient;
