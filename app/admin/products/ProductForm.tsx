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
import AdminForm from "@/app/components/ui/AdminForm";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import AdminInput from "@/app/components/ui/AdminInput";
import AdminTextarea from "@/app/components/ui/AdminTextArea";
import FormAlert from "@/app/components/FormAlert";
import { formatProductSizeLabel } from "@/src/helpers/formatProductSizeLabel";


type Props = {
  product?: Product; // edit mode
  categories: Category[];
  onSuccess?: () => void;
  onClose?: () => void;
};

const ProductForm = ({ 
  categories, 
  product, 
  onSuccess,
  onClose,
 }: Props) => {
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

    const small = product.product_sizes?.find((s) => s.label === "Small");
    const large = product.product_sizes?.find((s) => s.label === "Large");

    setSmallPrice(small ? (small.price_cents / 100).toString() : "");
    setLargePrice(large ? (large.price_cents / 100).toString() : "");

    setSmallStock(
      typeof small?.stock === "number" ? small.stock.toString() : "",
    );

    setLargeStock(
      typeof large?.stock === "number" ? large.stock.toString() : "",
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
      const productId = isEditMode
        ? product!.id
        : (await res.json()).product.id;

      // Upload gallery images
      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();
        galleryFiles.forEach((file) => {
          galleryFormData.append("files", file);
        });

        await fetch(`/api/products/${productId}/gallery-images`, {
          method: "POST",
          body: galleryFormData,
        });
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
  };

  // DELETE GALLERY IMAGE
  const handleDeleteGalleryImage = async (imageId: number) => {
    if (!product) return;

    const confirmed = confirm("Delete this image?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/products/${product.id}/gallery-images/${imageId}`,
        { method: "DELETE" },
      );

      if (!res.ok) {
        throw new Error("Failed to delete image");
      }

      // update UI immediately
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      alert("Could not delete image");
    }
  };



  return (
    <AdminForm
      title={isEditMode ? "Edit Product" : "Create Product"}
      description="Manage product details, pricing, inventory, and images."
      onClose={onClose}
    >

      
      <form onSubmit={handleSubmit} className="text-center text-md">

        {/* PRODUCT INFO */}
        <AdminFormSection title="Product Information">
          <AdminInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <AdminTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </AdminFormSection>

        <br/><br/>

        {/* CATEGORIES */}
        <AdminFormSection
          title="Categories"
          description="Select one or more categories."
        >
           <div
            className="
              rounded-lg
              border border-[#3a3a41]
              bg-kiloblack
              p-6
              grid md:grid-cols-4 gap-4
            "
          >
  

            {categories.map((category) => {
              const checked = categoryIds.includes(category.id);

              return (
                <label
                  key={category.id}
                  className={`
                    flex items-center
                    gap-2
                    rounded-lg
                    border border-[#3a3a41]
                    bg-kilodarkgrey
                    px-3 py-2
                    cursor-pointer
                    hover:border-kilored
                    transition
                    ${checked ? "border-kilored" : ""}
                  `}
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
        </AdminFormSection>

        <br/><br/>

        {/* PRICE */}
        <AdminFormSection title="Pricing">
          <div className="grid md:grid-cols-2 gap-4">
            
            <AdminInput
              label={formatProductSizeLabel("Small")}
              type="number"
              step="0.01"
              value={smallPrice}
              onChange={(e) => setSmallPrice(e.target.value)}
              required
            />

            <AdminInput
              label={formatProductSizeLabel("Large")}
              type="number"
              step="0.01"
              value={largePrice}
              onChange={(e) => setLargePrice(e.target.value)}
              required
            />
          </div>
        </AdminFormSection>

        <br/><br/>


        {/* INVENTORY */}
          <AdminFormSection title="Inventory">
            <div className="grid md:grid-cols-2 gap-4">
              <AdminInput
                label={`${formatProductSizeLabel("Small")} Stock`}
                type="number"
                min={0}
                value={smallStock}
                onChange={(e) => setSmallStock(e.target.value)}
                required
              />

              <AdminInput
                label={`${formatProductSizeLabel("Large")} Stock`}
                type="number"
                min={0}
                value={largeStock}
                onChange={(e) => setLargeStock(e.target.value)}
                required
              />
            </div>
          </AdminFormSection>

        <br />
        <br />
        <br />

        {/* IMAGES */}
        <div>
          <label>Main Image URL </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null); // URL wins
            }}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>OR upload Main image</label>
          <br />
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

        <br />
        <br />
        <br />

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
        <br />

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
    </AdminForm>
  );
};

export default ProductForm;
