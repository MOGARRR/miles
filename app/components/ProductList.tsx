import React from "react";
import ProductListItem from "./ProductListItem";
import productSetArray from "../data/productData";


const ProductList = () => {
  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl mb-5"> All Products</h1>
        <div className="flex justify-between">
          <h2 className="text-xl">{productSetArray.length} Products</h2>
          <h2 className="text-xl underline">Filter & Sort</h2>
        </div>
      </div>

      <div className="flex flex-col justify-evenly items-center justify-evenly m-8">
        {productSetArray.map((set) => (
          <ProductListItem
            key={set.id}
            id={set.id}
            image={set.image}
            imageAlt={set.imageAlt}
            name={set.name}
            price={set.price}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;
