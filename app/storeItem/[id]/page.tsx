"use client";
import React from "react";
import Image from "next/image";
import StoreItemListing from "@/app/components/StoreItemListing";

import productSetArray from "@/app/data/productData";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const productPage = ({ params }: ProductPageProps) => {
  
  const itemId = parseInt(params.id)
  console.log(itemId);
  const item = productSetArray.find((item) => item.id === itemId);

  if (!item) return notFound();

  return (
    <div className="py-15 bg-slate-500">

      <StoreItemListing
        image={item.image}
        imageAlt={item.imageAlt}
        name={item.name}
        price={item.price}
        description={item.description}
      />
    </div>
  );
};

export default productPage;
