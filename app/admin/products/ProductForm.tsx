"use client";

// Product
// ├─ id
// ├─ title
// ├─ description
// ├─ image_URL
// ├─ category_id
// ├─ is_available
// ├─ product_sizes[]  ← source of truth for prices

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { Category } from "@/src/types/category";
import { Product } from "@/src/types/product";
import FormAlert from "@/app/components/FormAlert";

type Props = {
  product?: Product; // edit mode
  categories: Category[];
  onSuccess?: () => void;
};

const ProductForm = ({ categories, product, onSuccess }: Props) => {
  // state for form fields [ no image upload yet ]
  const [title, setTitle] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");

  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const [smallPrice, setSmallPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");
  const [smallStock, setSmallStock] = useState("");
  const [largeStock, setLargeStock] = useState("");

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // prevent the form from starting with errors later
  // “The user has attempted to submit the form at least once.”
  const [hasSubmitted, setHasSubmitted] = useState(false);

  

  
  // state for errors 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // guards for empty price, title, image or category
  const isCategoryInvalid = categoryIds.length === 0;
  const hasImage = imageUrl !== "" || imageFile !== null;
  const smallPriceInvalid = Number(smallPrice) <= 0;
  const largePriceInvalid = Number(largePrice) <= 0;

  // guard to prevent invalid image URL (would crash next image)
  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");

  const isEditMode = Boolean(product);

  const router = useRouter();

  useEffect(() => {
    if (!product) return;

    //console.log("ADMIN PRODUCT PROP:", product);

    setTitle(product.title);
    setCategoryIds(product.categories?.map((c) => c.id) ?? []);
    setDescription(product.description ?? "");
    setImageUrl(product.image_URL ?? "");
    setImageFile(null);
    setIsAvailable(product.is_available);

    setExistingImages(product.product_images ?? []);

    const small = product.product_sizes?.find(s => s.label === "Small");
    const large = product.product_sizes?.find(s => s.label === "Large");

    setSmallPrice(small ? (small.price_cents / 100).toString() : "");
    setLargePrice(large ? (large.price_cents / 100).toString() : "");

    setSmallStock(
      typeof small?.stock === "number" ? small.stock.toString() : ""
    );

    setLargeStock(
      typeof large?.stock === "number" ? large.stock.toString() : ""
    );

  }, [product]);


  //HANDLE SUBMIT FORM 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (
      !isImageValid || 
      isCategoryInvalid ||
      !hasImage ||
      smallPriceInvalid ||
      largePriceInvalid
    ) {
      return;
    }

    setIsLoading(true);
    setError(null); //clear previous errors
    setSuccessMessage(null);

    try {
      //handle image upload
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Image upload failed");
        }

        const data = await uploadRes.json();
        finalImageUrl = data.publicUrl;
      }

      //create or edit mode ; define method
      const endpoint = isEditMode
        ? `/api/products/${product!.id}`
        : "/api/products";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category_ids: categoryIds,
          description,
          image_URL: finalImageUrl,
          is_available: isAvailable,
          product_sizes: [
            {
              label: "Small",
              price_cents: Math.round(Number(smallPrice) * 100),
              stock: Number(smallStock),
            },
            {
              label: "Large",
              price_cents: Math.round(Number(largePrice) * 100),
              stock: Number(largeStock),
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      // Determine product id (create vs edit)
      const productId =
        isEditMode ? product!.id : (await res.json()).product.id;

      // Upload gallery images
      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();
        galleryFiles.forEach((file) => {
          galleryFormData.append("files", file);
        });

        await fetch(
          `/api/products/${productId}/gallery-images`,
          {
            method: "POST",
            body: galleryFormData,
          }
        );
      }
    
      // Trigger a re-render of the Server Component 
      router.refresh();

      setSuccessMessage(
        isEditMode
          ? "Product updated successfully!"
          : "New product created successfully!",
      );

      setTimeout(() => {
        onSuccess?.();
      }, 1500);

      // reset form only when creating
      if (!isEditMode) {
        setTitle("");
        setCategoryIds([]);
        setDescription("");
        setImageUrl("");
        setImageFile(null);
        setIsAvailable(true);
        setHasSubmitted(false);
        setSmallPrice("");
        setLargePrice("");
        setGalleryFiles([]);
        setSmallStock("");
        setLargeStock("");
      }
      
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // DELETE GALLERY IMAGE
  const handleDeleteGalleryImage = async (imageId: number) => {
    if (!product) return;

    const confirmed = confirm("Delete this image?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/products/${product.id}/gallery-images/${imageId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete image");
      }

      // update UI immediately
      setExistingImages((prev) =>
        prev.filter((img) => img.id !== imageId)
      );
    } catch (err) {
      alert("Could not delete image");
    }
  };



  return (
    <div
      className=" 
    w-2/4 
    bg-gray-800 
    p-4 mb-6
    rounded-md border"
    >
      <div>
        <h2 className="
            text-xl font-medium text-center text-kilored
            border-b-1 
            mb-4
            ">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="text-center text-md">
        <div className="my-2">
          <label>Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" rounded border w-full mt-1 p-2 text-sm"
          />
        </div>
        <br/>

        {/* CATEGORIES */}
        <div>
          <label className="block mb-2">Categories</label>

          <div
            className="
          rounded border 
          p-6
          grid grid-cols-5 gap-4
          "
          >
            {categories.map((category) => {
              const checked = categoryIds.includes(category.id);

              return (
                <label
                  key={category.id}
                  className="
                  bg-gray-500 
                  flex items-center
                  gap-2 p-2 
                  cursor-pointer 
                  rounded-full border 
                  w-4/5
                  hover:bg-gray-600 
                  "
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setCategoryIds((prev) =>
                        checked
                          ? prev.filter((id) => id !== category.id)
                          : [...prev, category.id],
                      );
                    }}
                  />
                  <span>{category.title}</span>
                </label>
              );
            })}
          </div>
        </div>
        
        {/* DESCRIPTION */}
        <div className="my-2">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div className="my-4">
          <label className="block mb-2 font-medium">Prices</label>

          <div className="flex justify-evenly ">
            <div className="flex flex-col">
              <label className="text-md">Small</label>
              <input
                type="number"
                step="0.01"
                value={smallPrice}
                onChange={(e) => setSmallPrice(e.target.value)}
                className="border p-2 text-sm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-md">Large</label>
              <input
                type="number"
                step="0.01"
                value={largePrice}
                onChange={(e) => setLargePrice(e.target.value)}
                className="border p-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-2 font-medium">Inventory</label>

          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-sm">Small stock</label>
              <input
                type="number"
                min={0}
                value={smallStock}
                onChange={(e) => setSmallStock(e.target.value)}
                className="border p-2 text-sm"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm">Large stock</label>
              <input
                type="number"
                min={0}
                value={largeStock}
                onChange={(e) => setLargeStock(e.target.value)}
                className="border p-2 text-sm"
                required
              />
            </div>
          </div>
        </div>


        <br/><br/><br/>

        {/* IMAGES */}
        <div>
          <label>Main Image URL </label>
          <input 
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setImageFile(null); // URL wins
            }}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>OR upload Main image</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
                setImageUrl(""); // file wins
              }
            }}
            className="
                  text-md  
                  bg-gray-500 
                  p-2 
                  rounded-md border
                  cursor-pointer
                  hover:bg-gray-600"
          />

        </div>
        {imageFile && (
          <p className="text-sm text-gray-600 mt-1">
            Selected image: {imageFile.name}
          </p>
        )}


        <br/><br/><br/>

        <div>
          <label>Gallery images (optional)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setGalleryFiles(Array.from(e.target.files));
              }
            }}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        {isEditMode && (
          <div className="mt-8 border-t pt-6">
            {/* MAIN IMAGE PREVIEW */}
            {product?.image_URL && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Main image</p>

                <div className="relative w-24 h-24 border rounded overflow-hidden">
                  <img
                    src={product.image_URL}
                    alt="Main product image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* GALLERY IMAGES */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Gallery images</p>

                <div className="flex flex-wrap gap-4">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-24 h-24 border rounded overflow-hidden"
                    >
                      <img
                        src={img.image_url}
                        alt="Gallery image"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


            

        <br/> <br/> <br/>

        <div>
          <input 
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </div>

        <div className="my-4">
          <label
            className="
          w-1/4 
          p-2 
          text-md  
          bg-gray-500 
          rounded-full border
          cursor-pointer
          hover:bg-gray-600"
          >
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available
          </label>
        </div>

        {successMessage && (
          <FormAlert type="success" message={successMessage} />
        )}

        {error && <FormAlert type="error" message={error} />}

        <button
          type="submit"
          disabled={
            isLoading ||
            !isImageValid ||
            isCategoryInvalid ||
            !hasImage ||
            smallPriceInvalid ||
            largePriceInvalid
          }
          className="
          w-1/2 
          mt-3  p-2 
          text-md  
          bg-gray-500 
          rounded-full border
          cursor-pointer
          hover:bg-gray-600 
          disabled:opacity-50
          disabled:bg-gray-600 
          disabled:cursor-not-allowed
          "
          
        >
          {isLoading ? (
            <LoadingAnimation />
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
