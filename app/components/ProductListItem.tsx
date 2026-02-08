"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductCategory } from "@/src/types/product";


// the interface defines what props the component must receive
interface ProductListItemProps {
  id: number;
  title: string;
  description: string;
  starting_price_cents?: number;
  categories?: ProductCategory[];

  image_URL: string;
  sold_out: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string | null;
}

// ProductListItem is a presentation-only component
// It no longer adds items to the cart directly
const ProductListItem: React.FC<ProductListItemProps> = ({
  id,
  title,
  description,
  starting_price_cents,
  categories,
  image_URL,
  sold_out,
  is_available,
  created_at,
  updated_at,
}) => {
  return (
    <div
      className="
        flex flex-col
        rounded-lg border border-[#3a3a41]
        bg-kilodarkgrey
      "
    >
      {/* Clickable area: image + main content */}
      <Link href={`/store/${id}`}>
        {/* IMAGE */}
        <div className="pt-3 pb-3 bg-[#3F3F46] rounded-t-lg">
          <div className="relative w-full aspect-[1/1] overflow-hidden">
            <Image
              src={image_URL}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col py-4 px-6 gap-2">
          {/* Category badge */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="
                    w-fit
                    px-3 py-0.5
                    text-sm font-semibold
                    bg-kilored
                    rounded-full
                  "
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          <h1 className="mt-2 mb-2 text-lg md:text-xl font-bold">
            {title}
          </h1>

          <p className="text-xs md:text-sm text-kilotextgrey">
            {description}
          </p>
        </div>
      </Link>

      {/* PRICE + CTA */}
      <div
        className="
          mt-auto
          flex items-center justify-between
          px-6 pb-6 pt-2
        "
      >
        {starting_price_cents !== undefined && (
          <p className="text-kilored text-sm font-semibold">
            Starting at ${(starting_price_cents / 100).toFixed(2)}
          </p>
        )}

        <Link
          href={`/store/${id}`}
          className="
            bg-kilored
            px-4 py-2
            border border-[#3a3a41]
            rounded-lg
            font-semibold
            transition-colors duration-200
            hover:bg-[#B53535]
            text-white
          "
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductListItem;
