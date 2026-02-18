"use client"

import ProductListItem from "./ProductListItem";
import { Product } from "@/src/types/product";

// -----------------------------
// PROPS TYPE
// -----------------------------
type FeaturedProductsClientProps = {
  products: Product[];
};

// -----------------------------
// CLIENT COMPONENT
// -----------------------------
// This component is responsible ONLY for rendering UI
// and handling interactivity (cart, clicks, etc.).
// No data fetching or business logic happens here.
const FeaturedProductsClient = ({
  products,
}: FeaturedProductsClientProps) => {

  return (
    <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 ">
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




        // Render the interactive product card
        // ProductListItem uses client-side hooks (useCart),
        // which is why this component must run on the client
        return (
          <ProductListItem
            key={product.id}
            id={product.id}
            title={product.title}
            description={product.description}
            image_URL={product.image_URL}
            starting_price_cents={startingPriceCents}
            sold_out={isSoldOut}
            is_available={product.is_available}
            created_at={product.created_at}
            updated_at={product.updated_at}
            categories={categories}
          />
        );
      })}
      
    </div>
  )
};

export default FeaturedProductsClient;
