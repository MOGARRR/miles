"use client";

// Client wrapper owns all interactive UI for products:
// - toggling create form
// - rendering the product list
// - future edit/delete actions

import { useState } from "react";
import type { Product } from "@/src/types/product";
import type { Category } from "@/src/types/category";
import CreateProductForm from "./CreateProductForm";

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
          categories={categories}
          onSuccess={() => setIsFormOpen(false)}
        />
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

              <p>
                Category:{" "}
                {product.category_id
                  ? categoryMap[product.category_id]
                  : "Uncategorized"}
              </p>

              {product.description && (
                <p className="mt-2 text-sm">{product.description}</p>
              )}

              <p className="mt-2 text-sm">
                ${(product.price_cents / 100).toFixed(2)}
              </p>

              <p className="mt-2 text-sm">
                Status:{" "}
                {product.is_available ? "Available" : "Not Available"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductsClient;