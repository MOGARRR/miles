import React from "react";
import ProductListItem from "./ProductListItem";
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
    <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      gap-12
      p-10
      
    ">
      {products
        .filter((product) => product.is_available) // only available products remain
        .map((product) => {

          //get category name for this product 
          const categoryName = product.category_id !== null 
            ? categoryMap[product.category_id]
            : undefined; 

          return (      
          
            <ProductListItem
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description}
              category_id={product.category_id}
              image_URL={product.image_URL}
              price_cents={product.price_cents}
              sold_out={product.sold_out}
              is_available={product.is_available}
              category_name={categoryName}
            />
          );
        })}
    </div>
  )
}

export default ProductList;
