"use client";

// Client wrapper owns all interactive UI for products:
// - toggling create form
// - rendering the product list
// - future edit/delete actions

import { useState } from "react";
import type { Product } from "@/src/types/product";
import type { Category } from "@/src/types/category";
import CreateProductForm from "./ProductForm";
import { useRouter } from "next/navigation";

type Props = {
  products: Product[];
  categories: Category[];
  categoryMap: Record<number, string>;
};

const AdminProductsClient = ({
  products,
  categories,
  categoryMap,
}: Props) => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  

  const router = useRouter();

  const handleDelete = async (productId: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeleteSuccess(null);
      setDeletingId(productId);

      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setDeleteSuccess("Product deleted successfully");

      router.refresh();

      // auto-hide success message
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);

    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };
    

  return (
    <div>
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="rounded border px-3 py-1 text-sm"
        >
          {isFormOpen ? "Close" : "Add New Product"}
        </button>
      </div>

      {isFormOpen && (
        <CreateProductForm
          product={editingProduct ?? undefined}
          categories={categories}
          onSuccess={() => {
            setIsFormOpen(false); 
            setEditingProduct(null);
          }}
        />
      )}

      {deleteSuccess && (
        <p className="text-sm text-green-600 mb-4">
          {deleteSuccess}
        </p>
      )}

      {deleteError && (
        <p className="text-sm text-rose-500 mb-4">
          {deleteError}
        </p>
      )}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="space-y-8 mt-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="rounded border p-4"
            >
              <p className="font-medium">{product.title}</p>

              {product.image_URL && (
                <img
                  src={product.image_URL}
                  alt={product.title}
                  className="w-48 h-32 object-cover rounded border mt-3 mb-3"
                />
              )}
              
              {/* CATEGORIES */}
              <div className="flex flex-wrap gap-2 mt-2">
                {product.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-2 py-0.5 text-xs rounded border"
                  >
                    {cat.title}
                  </span>
                ))}

                {(!product.categories || product.categories.length === 0) && (
                  <span className="text-xs italic text-gray-500">
                    Uncategorized
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-2 text-sm">{product.description}</p>
              )}

              {/* PRICES */}
              {product.product_sizes && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Prices</p>
                  <ul className="ml-4 list-disc space-y-1">
                    {product.product_sizes.map((size) => (
                      <li key={size.id}>
                        {size.label}: ${(size.price_cents / 100).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-2 text-sm">
                Status:{" "}
                {product.is_available ? "Available" : "Not Available"}
              </p>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsFormOpen(true);
                  }}
                  className="text-sm underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-sm text-rose-600 underline"
                >
                  Delete
                </button>


              </div>

            
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductsClient;