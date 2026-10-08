"use client";

import React, { useState, useEffect } from "react";
import ProductListItem from "./ProductListItem";
import { Product, ProductType } from "@/src/types/product";
import { Category } from "@/src/types/category";
import SearchBar from "./ui/SearchBar";
import FilterMenu from "./FilterMenu";
import { useDebounce } from "@/src/hooks/useDebounce";
import ProductSkeletonCard from "./ProductSkeletonCard";
import { Funnel } from "lucide-react";

type GalleryTab = "all" | ProductType;

const GALLERY_TABS: { id: GalleryTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "print", label: "Prints" },
  { id: "original", label: "Specials" },
  { id: "collection", label: "Collections" },
];

const EMPTY_TAB_COPY: Record<
  Exclude<GalleryTab, "all">,
  { title: string; body: string }
> = {
  print: {
    title: "No prints here yet",
    body: "Check back soon — new prints land in the gallery regularly.",
  },
  original: {
    title: "No specials here yet",
    body: "One-of-a-kind pieces will show up in this tab when they’re available.",
  },
  collection: {
    title: "Collections coming soon",
    body: "Browse Prints or Specials in the meantime.",
  },
};

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
  const [activeTab, setActiveTab] = useState<GalleryTab>("all");

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const isSearching = searchInput !== debouncedSearch;

  const fetchProducts = async (
    pageToLoad: number,
    searchTerm?: string,
    categoryOverride?: number[],
    tabOverride?: GalleryTab,
  ) => {
    setIsLoading(true);
    const finalSearch = searchTerm ?? debouncedSearch;
    const finalCategories = categoryOverride ?? selectedCategories;
    const finalTab = tabOverride ?? activeTab;
    const categoryParam = finalCategories.join(",");
    const typeParam =
      finalTab === "all" ? "" : `&product_type=${encodeURIComponent(finalTab)}`;

    try {
      const res = await fetch(
        `/api/products?page=${pageToLoad}&limit=${PAGE_SIZE}&available=true&search=${encodeURIComponent(
          finalSearch,
        )}&categories=${categoryParam}${typeParam}`,
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
    fetchProducts(1, debouncedSearch, selectedCategories, activeTab);
  }, [debouncedSearch, selectedCategories, activeTab]);

  const noResults = !isLoading && products.length === 0;
  const isSearchOrFilterEmpty =
    debouncedSearch.length > 0 || selectedCategories.length > 0;
  const emptyTabCopy =
    activeTab !== "all" ? EMPTY_TAB_COPY[activeTab] : null;

  const handleFilterMenu = () => setFilterMenu(!filterMenu);

  return (
    <section className="mt-20">
      {/* TYPE TABS */}
      <div className="px-4 sm:px-6 md:px-10 mb-6">
        <div
          className="
            flex flex-wrap gap-2
            border-b border-[#3a3a41]
            pb-4"
          role="tablist"
          aria-label="Gallery product types"
        >
          {GALLERY_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 text-sm font-semibold tracking-wide
                  rounded-lg transition
                  ${
                    selected
                      ? "bg-kilored text-white"
                      : "text-kilotextlight hover:text-white hover:bg-black/30"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH BAR + FILTERS */}
      <div className="px-4 sm:px-6 md:px-10 mb-6">
        <div
          className="
            flex flex-col sm:flex-row
            gap-3
            sm:items-center sm:justify-between"
        >
          {/* SEARCH BAR */}
          <div className="flex-1">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search by name"
            />
          </div>
          {/* FILTER BUTTON */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleFilterMenu}
              className="
                flex items-center gap-2
                border border-gray-500
                text-gray-400 text-sm
                bg-black/20
                px-4 py-2
                rounded-lg
                transition
                hover:bg-gray-800
                w-auto"
            >
              <Funnel size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        {filterMenu && (
          <div className="w-full mt-4">
            <FilterMenu
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        )}
      </div>

      {/* Searching indicator */}
      <div className="flex items-center gap-2 min-h-[20px] px-6 md:px-10">
        {isSearching && (
          <span className="text-xs text-kilotextlight italic">Searching…</span>
        )}
      </div>

      {/* Empty state */}
      {noResults && (
        <div className="px-4 sm:px-6 md:px-10 mt-4 mb-16">
          <div
            className="
              mx-auto max-w-lg
              rounded-xl border-2 border-[#3a3a41]
              bg-kilodarkgrey/80
              px-6 py-12 sm:px-10
              text-center
            "
          >
            {isSearchOrFilterEmpty ? (
              <>
                <p className="text-lg font-semibold text-white">
                  No matches
                </p>
                <p className="mt-3 text-sm leading-relaxed text-kilotextlight">
                  {debouncedSearch.length > 0 ? (
                    <>
                      Nothing matched{" "}
                      <span className="italic text-white">
                        “{debouncedSearch}”
                      </span>
                      {selectedCategories.length > 0
                        ? " with the selected filters."
                        : "."}
                    </>
                  ) : (
                    "Nothing matches the selected category filters."
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSelectedCategories([]);
                  }}
                  className="
                    mt-6 inline-flex
                    px-5 py-2.5
                    text-sm font-semibold
                    rounded-lg
                    bg-kilored text-white
                    hover:bg-[#B53535] transition
                  "
                >
                  Clear search & filters
                </button>
              </>
            ) : emptyTabCopy ? (
              <>
                <p className="text-lg font-semibold text-white">
                  {emptyTabCopy.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-kilotextlight">
                  {emptyTabCopy.body}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="
                    mt-6 inline-flex
                    px-5 py-2.5
                    text-sm font-semibold
                    rounded-lg
                    bg-kilored text-white
                    hover:bg-[#B53535] transition
                  "
                >
                  Browse all work
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-white">
                  Gallery is empty
                </p>
                <p className="mt-3 text-sm leading-relaxed text-kilotextlight">
                  New work will show up here when it’s available.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Grid — hide when empty state is up */}
      {(!noResults || isLoading) && (
        <>
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
              gap-8 
              pb-10 
              md:p-10 "
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
                  image_URL={product.image_URL}
                  starting_price_cents={startingPriceCents}
                  is_original={
                    product.product_type === "original" ||
                    product.product_type === "collection"
                  }
                  sold_out={isSoldOut}
                  is_available={product.is_available}
                  created_at={product.created_at}
                  updated_at={product.updated_at}
                  categories={categories}
                />
              );
            })}

            {isLoading &&
              Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProductSkeletonCard key={`skeleton-${index}`} />
              ))}
          </div>

          {hasMore && (
            <div className="flex justify-center ">
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
                  border border-gray-500 rounded-lg
                  text-sm 
                  uppercase tracking-wide 
                  hover:bg-black hover:text-white transition 
                  disabled:opacity-50"
              >
                {isLoading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductListClient;