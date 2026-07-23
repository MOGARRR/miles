"use client";

// Client wrapper owns all interactive UI for products:
// - toggling create form
// - Available / Deleted tabs
// - soft-delete and restore

import { useState } from "react";
import type { Product } from "@/src/types/product";
import type { Category } from "@/src/types/category";
import CreateProductForm from "./ProductForm";
import { useRouter } from "next/navigation";
import { formatProductSizeLabel } from "@/src/helpers/formatProductSizeLabel";
import Button from "@/app/components/ui/Button";

type Props = {
  products: Product[];
  categories: Category[];
  categoryMap: Record<number, string>;
};

type ProductTab = "available" | "deleted";

const AdminProductsClient = ({ products, categories, categoryMap }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<ProductTab>("available");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const router = useRouter();

  const availableProducts = products.filter((product) => product.is_available);
  const deletedProducts = products.filter((product) => !product.is_available);
  const visibleProducts =
    activeTab === "available" ? availableProducts : deletedProducts;

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

      showSuccess("Product restored successfully");
      router.refresh();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setRestoringId(null);
    }
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
        <CreateProductForm
          product={editingProduct ?? undefined}
          categories={categories}
          onSuccess={closeForm}
          onClose={closeForm}
        />
      )}

      {actionSuccess && (
        <p className="text-sm text-emerald-600 mb-4">{actionSuccess}</p>
      )}

      {(actionError || editError) && (
        <p className="text-sm text-rose-500 mb-4">
          {actionError || editError}
        </p>
      )}

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
          {activeTab === "available"
            ? "No available products."
            : "No deleted products."}
        </p>
      ) : (
        <ul
          className="
        space-y-8 mt-6
        grid grid-cols-4
        gap-6
        "
        >
          {visibleProducts.map((product) => (
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
                <div className="flex items-center gap-2">
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

                  {(!product.categories || product.categories.length === 0) && (
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
                    <p className="font-medium">Variants</p>
                    <ul className="ml-4 list-disc space-y-1">
                      {product.product_sizes.map((size) => (
                        <li key={size.id}>
                          {formatProductSizeLabel(size.label)}: $
                          {(size.price_cents / 100).toFixed(2)}
                          {" · "}
                          <span
                            className={
                              size.stock === 0
                                ? "text-rose-500"
                                : size.stock < 5
                                  ? "text-amber-500"
                                  : "text-white"
                            }
                          >
                            Stock: {size.stock}
                          </span>
                        </li>
                      ))}
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductsClient;
