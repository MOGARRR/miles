"use client"

import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";

// -----------------------------
// PROPS TYPE
// -----------------------------
// This component receives from FeaturedProducts.tsx:
// - products: plain product data prepared by the server
// - categoryMap: a lookup table to resolve category names
type FeaturedProductsClientProps = {
  products : Product[];
  categoryMap: Record<number, string>;
}

// -----------------------------
// CLIENT COMPONENT
// -----------------------------
// This component is responsible ONLY for rendering UI
// and handling interactivity (cart, clicks, etc.).
// No data fetching or business logic happens here.
const FeaturedProductsClient = ({
  products,
  categoryMap,
}: FeaturedProductsClientProps) => {

  return (
    <div className=" grid grid-cols-3 gap-16">
      {products.map((product) => {
        // Resolve the category name using the category map
        // (only if the product has a category_id)
        const categoryName =
          product.category_id !== null
            ? categoryMap[product.category_id]
            : undefined;

        // Render the interactive product card
        // ProductListItem uses client-side hooks (useCart),
        // which is why this component must run on the client
        return (
          <ProductListItem
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            category_id={product.category_id}
            category_name={categoryName}
            image_URL={product.image_URL}
            price_cents={product.price_cents}
            sold_out={product.sold_out}
            is_available={product.is_available}
            created_at={product.created_at}
            updated_at={product.updated_at}
          />
        );
      })}
      
    </div>
  )
};

export default FeaturedProductsClient;
