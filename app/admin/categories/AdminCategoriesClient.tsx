"use client";

// This component is responsible for all interactive UI related to categories.
// We render the categories list on the client because this page supports
// client-side interactions such as:
// - toggling the "Add New Category" form
// - closing the form after a successful submit
// - (future) inline edit/delete actions
//
// Keeping the list and form in the same client component avoids splitting
// interactive state across server and client boundaries and makes the UI
// easier to reason about as it grows.


import { useState } from "react";
import type { Category } from "@/src/types/category";
import CreateCategoryForm from "./CategoryForm";
import { useRouter } from "next/navigation";


type Props = {
  categories: Category[];
};

const AdminCategoriesClient = ({ categories }: Props) => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const router = useRouter();



  const handleDelete = async (categoryId: number) => {
    
    const confirmed = confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeletingId(categoryId);

      const res = await fetch(
        `/api/categories_products/${categoryId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      router.refresh();

    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            setIsFormOpen((prev) => !prev);
            setEditingCategory(null);
          }}
          className="rounded border px-3 py-1 text-sm"
        >
          {isFormOpen ? "Close" : "Add New Category"}
        </button>
      </div>

      {isFormOpen && (
        <CreateCategoryForm 
          category={editingCategory ?? undefined}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }} />
      )}

      {deleteError && (
        <p className="text-sm text-red-400 mb-4">
          {deleteError}
        </p>
      )}


      <h1>All Categories</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-4 mt-6">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded border p-4"
            >
              <p className="font-medium">{category.title}</p>

              {category.description && (
                <p className="mt-2 text-sm">{category.description}</p>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingCategory(category);
                  setIsFormOpen(true);
                }}
                className="mt-3 text-sm underline"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                className="mt-3 ml-4 text-sm text-red-400 underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
};

export default AdminCategoriesClient;
