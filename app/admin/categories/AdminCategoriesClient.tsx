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
import CreateCategoryForm from "./CreateCategoryForm";

type Props = {
  categories: Category[];
};

const AdminCategoriesClient = ({ categories }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="rounded border px-3 py-1 text-sm"
        >
          {isFormOpen ? "Close" : "Add New Category"}
        </button>
      </div>

      {isFormOpen && (
        <CreateCategoryForm onSuccess={() => setIsFormOpen(false)} />
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminCategoriesClient;
