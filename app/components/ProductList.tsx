import React from "react";
import ProductListClient from "./ProductListClient";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";

import { headers } from "next/headers";


const ProductList = async () => {

  // Build the absolute base URL on the server.
  // Server Components cannot reliably use relative URLs ("/api/..."),
  // so we read the request headers to determine the current protocol and host
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${protocol}://${host}`;


  //fetch PRODUCTS from the api route
  const productsRes = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });

  const productsData: { products: Product[] } = await productsRes.json();
  const products = productsData.products; // pulls out the PRODUCTS array

  //fetch CATEGORIES from the api route
  const categoriesRes = await fetch(`${baseUrl}/api/categories_products`, { cache: "no-store" });

  const categoriesData: { categories_products: Category[] } = await categoriesRes.json();
  const categories = categoriesData.categories_products;
  // console.log("categories", categories);

  //initiates categoryMap Object to store categoryId -> categoryName
  // Record<number, string> means the keys are numbers and the values are strings
  const categoryMap: Record<number, string> = {};

  // loop through categories and fill up categoryMap
  categories.forEach((c) => {
    categoryMap[c.id] = c.title;
  });


  return (
    <div>

      <ProductListClient
        products={products}
        categoryMap={categoryMap}
      />

    </div>
  )
}

export default ProductList;
