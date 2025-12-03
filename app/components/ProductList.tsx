import React from "react";
import ProductListClient from "./ProductListClient";
import { Product } from "@/src/types/product";
import { Category } from "@/src/types/category";


const ProductList = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  //fetch PRODUCTS from the api route
  const productsRes = await fetch(`${baseUrl}/api/products`, {cache: "no-store"});

  const productsData: { products: Product[] } = await productsRes.json();
  const products = productsData.products; // pulls out the PRODUCTS array

  //fetch CATEGORIES from the api route
  const categoriesRes = await fetch(`${baseUrl}/api/categories_products`, {cache: "no-store"});

  const categoriesData: { categories_products: Category[] } = await categoriesRes.json();
  const categories = categoriesData.categories_products;
  //console.log("categories", categories);

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
