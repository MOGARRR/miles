"use client";

// Client wrapper owns all interactive UI for products:
// - toggling create form
// - Available / Deleted tabs
// - search + category filter
// - soft-delete and restore

import { useMemo, useState, useEffect, useRef } from "react";
import type { Product } from "@/src/types/product";
import type { Category } from "@/src/types/category";
import CreateProductForm from "./ProductForm";
import { useRouter } from "next/navigation";
import { formatProductSizeLabel } from "@/src/helpers/formatProductSizeLabel";
import Button from "@/app/components/ui/Button";
import SearchBar from "@/app/components/ui/SearchBar";

type Props = {
  products: Product[];
  categories: Category[];
};

type ProductTab = "available" | "deleted";

const SIZE_ORDER = ["Small", "Large"] as const;

function sortProductSizes<T extends { label: string }>(sizes: T[]): T[] {
  return [...sizes].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.label as (typeof SIZE_ORDER)[number]);
    const bIndex = SIZE_ORDER.indexOf(b.label as (typeof SIZE_ORDER)[number]);
    const safeA = aIndex === -1 ? SIZE_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? SIZE_ORDER.length : bIndex;
    return safeA - safeB;
  });
}

const AdminProductsClient = ({ products, categories }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<ProductTab>("available");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredBySearchAndCategory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        product.title.toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategoryId === null ||
        product.categories?.some((cat) => cat.id === selectedCategoryId);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategoryId]);

  const availableProducts = filteredBySearchAndCategory.filter(
    (product) => product.is_available,
  );
  const deletedProducts = filteredBySearchAndCategory.filter(
    (product) => !product.is_available,
  );
  const visibleProducts =
    activeTab === "available" ? availableProducts : deletedProducts;

  useEffect(() => {
    if (!isFormOpen) return;

    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [isFormOpen, editingProduct]);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const showSuccess = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => {
      setActionSuccess(null);
    }, 3000);
  };

  const handleEdit = async (productId: number) => {
    try {
      setEditError(null);
      setIsLoadingEdit(true);

      const res = await fetch(`/api/products/${productId}`);

      if (!res.ok) {
        throw new Error("Failed to load product");
      }

      const data = await res.json();

      setEditingProduct(data.product);
      setIsFormOpen(true);
    } catch (err: any) {
      setEditError(err.message || "Could not load product");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDelete = async (productId: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product? It will not be available in the store, but it will be kept for order history.",
    );

    if (!confirmed) return;

    try {
      setActionError(null);
      setActionSuccess(null);
      setDeletingId(productId);

      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setActiveTab("deleted");
      showSuccess("Product deleted successfully");
      router.refresh();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = async (productId: number) => {
    const confirmed = confirm(
      "Are you sure you want to restore this product? It will be available in the store again.",
    );

    if (!confirmed) return;

    try {
      setActionError(null);
      setActionSuccess(null);
      setRestoringId(productId);

      const res = await fetch(`/api/products/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to restore product");
      }

      setActiveTab("available");
      showSuccess("Product restored successfully");
      router.refresh();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setRestoringId(null);
    }
  };

  const handleFormSuccess = () => {
    if (!editingProduct) {
      setActiveTab("available");
    }
    closeForm();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <Button
          type="button"
          variant={isFormOpen ? "secondary" : "primary"}
          onClick={() => (isFormOpen ? closeForm() : setIsFormOpen(true))}
        >
          {isFormOpen ? "Close" : "Add New Product"}
        </Button>
      </div>

      {isFormOpen && (
        <div ref={formSectionRef} className="scroll-mt-6 mb-8">
          <CreateProductForm
            product={editingProduct ?? undefined}
            categories={categories}
            onSuccess={handleFormSuccess}
            onClose={closeForm}
          />
        </div>
      )}

      {actionSuccess && (
        <p className="text-sm text-emerald-600 mb-4">{actionSuccess}</p>
      )}

      {(actionError || editError) && (
        <p className="text-sm text-rose-500 mb-4">
          {actionError || editError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name"
        />

        <select
          value={selectedCategoryId ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? Number(e.target.value) : null,
            )
          }
          className="
            rounded-lg
            border border-[#3a3a41]
            bg-kiloblack
            px-3 py-2
            text-sm
            text-kilotextlight
            outline-none
            focus:border-kilored/60
            min-w-[180px]
          "
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          type="button"
          variant={activeTab === "available" ? "primary" : "secondary"}
          className="mt-0"
          onClick={() => setActiveTab("available")}
        >
          Available ({availableProducts.length})
        </Button>
        <Button
          type="button"
          variant={activeTab === "deleted" ? "primary" : "secondary"}
          className="mt-0"
          onClick={() => setActiveTab("deleted")}
        >
          Deleted ({deletedProducts.length})
        </Button>
      </div>

      {visibleProducts.length === 0 ? (
        <p>
          {searchQuery.trim() || selectedCategoryId !== null
            ? "No products match your search."
            : activeTab === "available"
              ? "No available products."
              : "No deleted products."}
        </p>
      ) : (
        <ul
          className="
        space-y-8 mt-6
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-6
        "
        >
          {visibleProducts.map((product) => {
            return (
              <li
                key={product.id}
                className="
                flex flex-col
                h-full
                rounded-xl
                border-2 border-[#55555f]
                bg-kiloblack
                overflow-hidden
              "
              >
                {product.image_URL && (
                  <img
                    src={product.image_URL}
                    alt={product.title}
                    className="
                    w-full
                    h-48
                    object-cover
                    border-b-2 border-[#55555f]
                  "
                  />
                )}

                <div className="flex flex-col flex-1 px-6 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">{product.title}</h2>
                    {activeTab === "deleted" && (
                      <span
                        className="
                        text-xs
                        px-2 py-1
                        rounded-full
                        bg-kilored
                        text-gray-200
                      "
                      >
                        Deleted
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {product.categories?.map((cat) => (
                      <span
                        key={cat.id}
                        className="
                        text-xs
                        px-2 py-1
                        rounded-full
                        bg-kilored
                        text-gray-200
                      "
                      >
                        {cat.title}
                      </span>
                    ))}

                    {(!product.categories ||
                      product.categories.length === 0) && (
                      <span className="text-xs italic text-kilotextgrey">
                        Uncategorized
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p
                      className="
                      mt-3
                      text-sm
                      text-kilotextgrey
                      line-clamp-3
                    "
                    >
                      {product.description}
                    </p>
                  )}

                  {product.product_sizes && (
                    <div className="mt-4 space-y-2 text-sm text-kilotextlight">
                      <p className="font-medium">Options</p>
                      <ul className="space-y-2">
                        {sortProductSizes(product.product_sizes).map((size) => {
                          const stockBadgeClass =
                            size.stock === 0
                              ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
                              : size.stock >= 5
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/40";

                          return (
                            <li
                              key={size.id}
                              className="flex items-center justify-between gap-2"
                            >
                              <span>
                                {formatProductSizeLabel(size.label)}: $
                                {(size.price_cents / 100).toFixed(2)}
                              </span>
                              <span
                                className={`
                                  text-xs
                                  px-2 py-0.5
                                  rounded-full
                                  border
                                  font-medium
                                  tabular-nums
                                  ${stockBadgeClass}
                                `}
                              >
                                Stock: {size.stock}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto pt-6 flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1 mt-0"
                      onClick={() => handleEdit(product.id)}
                      disabled={isLoadingEdit}
                      isLoading={isLoadingEdit}
                      loadingText="Loading…"
                    >
                      Edit
                    </Button>

                    {activeTab === "available" ? (
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1 mt-0"
                        onClick={() => handleDelete(product.id)}
                        isLoading={deletingId === product.id}
                        loadingText="Deleting..."
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        className="flex-1 mt-0"
                        onClick={() => handleRestore(product.id)}
                        isLoading={restoringId === product.id}
                        loadingText="Restoring..."
                      >
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminProductsClient;
