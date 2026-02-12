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
      "Are you sure you want to delete this category? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleteError(null);
      setDeletingId(categoryId);

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

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
    <div className="flex flex-col">
      <div className="mb-6 ">
        <button
          type="button"
          onClick={() => {
            setIsFormOpen((prev) => !prev);
            setEditingCategory(null);
          }}
          className="
          bg-gray-500 
          rounded border 
          p-2 
          text-md 
          cursor-pointer
          hover:bg-gray-600 
          "
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
          }}
        />
      )}

      {deleteError && (
        <p
          className="
        text-sm text-red-400 
        mb-4"
        >
          {deleteError}
        </p>
      )}

      <h1 className="text-3xl">All Categories:</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul
          className="
        space-y-4 mt-6 
        grid grid-cols-4 gap-6 
        text-center 
        "
        >
          {categories.map((category) => (
            <li
              key={category.id}
              className="
              rounded-xl border 
              p-4  
              flex flex-col items-center 
              bg-gray-800
              "
            >
              <p
                className="
                 w-1/2 
                 p-2 
                 text-lg font-semibold
                 bg-kilored
                 rounded-full
                 "
              >
                {category.title}
              </p>

              <p className="mt-2 text-sm">
                <h2 className="text-lg">Description: </h2>
                {!category.description && "Empty"}
                {category.description}
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(category);
                    setIsFormOpen(true);
                  }}
                  className="
                  w-20 
                  mt-3  p-2 
                  text-md  
                  bg-gray-500 
                  rounded-full border
                  cursor-pointer
                  hover:bg-gray-600 
                  "
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="
                  w-20
                  mt-3 ml-4 p-2 
                  text-md  
                  bg-kilored  
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

export default AdminCategoriesClient;
