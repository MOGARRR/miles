"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/components/CartContext";

export default function StoreItemPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState<string | null>(null);


  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      console.log("PRODUCT FROM API:", data.product);
      
      setProduct(data.product);
      setActiveImage(data.product.image_URL);  // main image first 
      setLoading(false);
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-10">Loading…</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  const displayedPrice =
    selectedSize?.price_cents ?? product.price_cents;
  
  const canAddToCart =
    selectedSize && selectedSize.stock > 0;

  return (
    <section className="max-w-5xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex flex-col gap-4">
        {/* HERO IMAGE */}
        <div className="relative aspect-square">
          <Image
            src={activeImage || product.image_URL}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* THUMBNAILS */}
        {product.product_images?.length > 0 && (
          <div className="flex gap-2">
            {[product.image_URL, ...product.product_images.map((img: any) => img.image_url)].map(
              (img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-20 w-20 rounded overflow-hidden border
                    ${
                      activeImage === img
                        ? "border-kilored"
                        : "border-gray-300"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <p className="text-sm text-kilotextgrey">
          {product.description}
        </p>

        {/* PRICE */}
        <p className="text-xl font-semibold text-kilored">
          ${(displayedPrice / 100).toFixed(2)}
        </p>

        {/* SIZE SELECTOR */}
       <div className="mt-4">
        <p className="text-sm font-medium mb-2">Size</p>

        <div className="flex flex-col gap-2">
          {product.product_sizes.map((size: any) => {
            const isSoldOut = size.stock === 0;
            const isSelected = selectedSize?.id === size.id;

            return (
              <label
                key={size.id}
                className={`
                  flex items-center gap-3
                  px-4 py-3 rounded-md border cursor-pointer
                  ${
                    isSoldOut
                      ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "border-kilored"
                      : "border-gray-300 hover:border-kilored"
                  }
                `}
              >
                <input
                  type="radio"
                  name="product-size"
                  disabled={isSoldOut}
                  checked={isSelected}
                  onChange={() => setSelectedSize(size)}
                  className="accent-kilored"
                />

                <span className="text-sm font-medium">
                  {size.label}
                </span>

                {isSoldOut && (
                  <span className="text-xs text-rose-500 ml-auto">
                    Sold out
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

        {/* ADD TO CART */}
        <button
          disabled={!canAddToCart}
          onClick={() =>
            addToCart({
              id: product.id,
              title: product.title,
              description: product.description,
              image_URL: product.image_URL,
              category_id: product.category_id,
              price_cents: selectedSize.price_cents,
              product_size: {
                id: selectedSize.id,
                label: selectedSize.label,
                price_cents: selectedSize.price_cents,
                stock: selectedSize.stock, 
              },
            })
          }
          className={`mt-6 px-6 py-3 rounded-md font-semibold
            ${
              canAddToCart
                ? "bg-kilored text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}
