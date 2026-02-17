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
import Link from "next/link";

type Props = {
  products: Product[];
  categories: Category[];
  categoryMap: Record<number, string>;
};

const AdminProductsClient = ({ products, categories, categoryMap }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const router = useRouter();

  // HANDLE EDIT PRODUCT 
  const handleEdit = async (productId: number) => {
    try {
      setEditError(null);
      setIsLoadingEdit(true);

      const res = await fetch(`/api/products/${productId}`);

      if (!res.ok) {
        throw new Error("Failed to load product");
      }

      const data = await res.json();

      // This is the FULL product (includes product_images)
      setEditingProduct(data.product);
      setIsFormOpen(true);
    } catch (err: any) {
      setEditError(err.message || "Could not load product");
    } finally {
      setIsLoadingEdit(false);
    }
  };


  // HANDLE DELETE PRODUCT
  const handleDelete = async (productId: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
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
          id="edit-form"
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="
          bg-gray-500 
          rounded border 
          p-2 
          text-md 
          cursor-pointer
          hover:bg-gray-600
          "
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
        <p className="text-sm text-green-600 mb-4">{deleteSuccess}</p>
      )}

      {deleteError && (
        <p className="text-sm text-rose-500 mb-4">{deleteError}</p>
      )}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="
        space-y-8 mt-6 
        grid grid-cols-4 
        gap-6 
        ">
          {products.map((product) => (
            <li key={product.id} className="
            flex flex-col justify-around items-center
            rounded-xl border
            bg-gray-800
            p-4
            ">
              <p className="text-xl text-center ">{product.title}</p>

             {product.image_URL && (
                <img
                  src={product.image_URL}
                  alt={product.title}
                  className="
                  w-48 h-32 object-cover 
                  rounded border 
                  mt-3 mb-3
                  "
                />
              )}

              {/* CATEGORIES */}
              <div className="
              flex flex-wrap
              gap-2 mt-2
              ">
                {product.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="
                    px-2 py-0.5
                    h-7
                    bg-kilored
                    text-md font-semibold 
                    rounded border"
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
                <p className="mt-2 text-md">{product.description}</p>
              )}

              {/* PRICES AND STOCK COUNT*/}
              {product.product_sizes && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Variants</p>
                  <ul className="ml-4 list-disc space-y-1">
                    {product.product_sizes.map((size) => (
                      <li key={size.id}>
                        {size.label}: ${(size.price_cents / 100).toFixed(2)}
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

              <p className="mt-2 text-md">
                Status: {product.is_available ? "Available" : "Not Available"}
              </p>

              <div className="flex gap-4 mt-3">
                <Link href="#edit-form"  >
                <button
                  onClick={() => handleEdit(product.id)}
                  disabled={isLoadingEdit}
                  className="
                  w-20
                  mt-3 text-md  
                  bg-gray-500 
                  p-2 
                  rounded-full border
                  cursor-pointer
                  hover:bg-gray-600
                  "
                >
                  {isLoadingEdit ? "Loading…" : "Edit"}
                </button>
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="
                  w-20
                  mt-3 ml-4 
                  text-md  
                  bg-kilored  
                  p-2 
                  rounded-full border
                  cursor-pointer
                  hover:bg-red-700
                  "
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
