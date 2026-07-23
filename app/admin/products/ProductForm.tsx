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
import { Category } from "@/src/types/category";
import { Product } from "@/src/types/product";
import AdminForm from "@/app/components/ui/AdminForm";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import AdminInput from "@/app/components/ui/AdminInput";
import AdminTextarea from "@/app/components/ui/AdminTextArea";
import Button from "@/app/components/ui/Button";
import FormAlert from "@/app/components/FormAlert";
import { formatProductSizeLabel } from "@/src/helpers/formatProductSizeLabel";
import {
  formatPriceFromCents,
  formatPriceInput,
  parsePriceToCents,
} from "@/src/helpers/formatPriceInput";


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

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(null);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);

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
  const smallPriceInvalid = parsePriceToCents(smallPrice) <= 0;
  const largePriceInvalid = parsePriceToCents(largePrice) <= 0;

  // guard to prevent invalid image URL (would crash next image)
  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");

  const isEditMode = Boolean(product);
  const mainImageSrc = mainPreviewUrl || imageUrl || null;

  const router = useRouter();

  useEffect(() => {
    if (!imageFile) {
      setMainPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setMainPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    const objectUrls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviewUrls(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);

  useEffect(() => {
    if (!product) return;

    setTitle(product.title);
    setCategoryIds(product.categories?.map((c) => c.id) ?? []);
    setDescription(product.description ?? "");
    setImageUrl(product.image_URL ?? "");
    setImageFile(null);

    setExistingImages(product.product_images ?? []);

    const small = product.product_sizes?.find((s) => s.label === "Small");
    const large = product.product_sizes?.find((s) => s.label === "Large");

    setSmallPrice(small ? formatPriceFromCents(small.price_cents) : "");
    setLargePrice(large ? formatPriceFromCents(large.price_cents) : "");

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
          // Availability is controlled by Delete / Restore on the admin list
          is_available: isEditMode ? product!.is_available : true,
          product_sizes: [
            {
              label: "Small",
              price_cents: parsePriceToCents(smallPrice),
              stock: Number(smallStock),
            },
            {
              label: "Large",
              price_cents: parsePriceToCents(largePrice),
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

      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-6">
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

        {/* IMAGES */}
        <AdminFormSection
          title="Images"
          description="Add a main cover image for the store, then optional gallery images for the product page."
        >
          {/* MAIN IMAGE */}
          <div
            className="
              rounded-lg
              border border-[#3a3a41]
              bg-kiloblack
              p-4 md:p-5
              space-y-4
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-kilotextlight">
                  Main image
                </p>
                <p className="text-xs text-kilotextgrey mt-1">
                  Shown on store cards and as the primary product photo.
                </p>
              </div>
              {hasSubmitted && (!hasImage || !isImageValid) && (
                <p className="text-xs text-kilored shrink-0">Required</p>
              )}
            </div>

            <div className="grid md:grid-cols-[180px_1fr] gap-4 items-start">
              <div
                className="
                  relative
                  aspect-square
                  w-full
                  max-w-[180px]
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kilodarkgrey
                  overflow-hidden
                "
              >
                {mainImageSrc ? (
                  <img
                    src={mainImageSrc}
                    alt="Main product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center px-3 text-center">
                    <p className="text-xs text-kilotextgrey">
                      No image selected
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 min-w-0">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wide text-kilotextgrey">
                    Upload file
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageFile(e.target.files[0]);
                        setImageUrl("");
                      }
                    }}
                    className="
                      w-full
                      text-sm
                      text-kilotextgrey
                      file:mr-4
                      file:rounded-md
                      file:border-0
                      file:bg-kilored
                      file:px-4
                      file:py-2
                      file:text-white
                      file:cursor-pointer
                      cursor-pointer
                    "
                  />
                  {imageFile && (
                    <p className="text-xs text-kilotextgrey mt-2 truncate">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#3a3a41]" />
                  <span className="text-xs uppercase tracking-wide text-kilotextgrey">
                    or
                  </span>
                  <div className="h-px flex-1 bg-[#3a3a41]" />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wide text-kilotextgrey">
                    Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageFile(null);
                    }}
                    className="
                      w-full
                      rounded-lg
                      border border-[#3a3a41]
                      bg-kilodarkgrey
                      px-3 py-2
                      text-sm
                      text-kilotextlight
                      outline-none
                      focus:border-kilored/60
                    "
                  />
                  {hasSubmitted && hasImage && !isImageValid && (
                    <p className="text-xs text-kilored mt-2">
                      URL must start with &quot;/&quot; or &quot;http&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* GALLERY */}
          <div
            className="
              rounded-lg
              border border-[#3a3a41]
              bg-kiloblack
              p-4 md:p-5
              space-y-4
            "
          >
            <div>
              <p className="text-sm font-semibold text-kilotextlight">
                Gallery images
              </p>
              <p className="text-xs text-kilotextgrey mt-1">
                Optional extra photos for the product detail page.
              </p>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wide text-kilotextgrey">
                Add images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setGalleryFiles(Array.from(e.target.files));
                  }
                }}
                className="
                  w-full
                  text-sm
                  text-kilotextgrey
                  file:mr-4
                  file:rounded-md
                  file:border-0
                  file:bg-kilored
                  file:px-4
                  file:py-2
                  file:text-white
                  file:cursor-pointer
                  cursor-pointer
                "
              />
              {galleryFiles.length > 0 && (
                <p className="text-xs text-kilotextgrey mt-2">
                  {galleryFiles.length} new image
                  {galleryFiles.length === 1 ? "" : "s"} ready to upload on save
                </p>
              )}
            </div>

            {(existingImages.length > 0 || galleryPreviewUrls.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="
                      relative
                      aspect-square
                      rounded-lg
                      border border-[#3a3a41]
                      overflow-hidden
                      bg-kilodarkgrey
                    "
                  >
                    <img
                      src={img.image_url}
                      alt="Gallery image"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className="
                        absolute top-2 right-2
                        rounded-md
                        border border-[#55555f]
                        bg-kiloblack/90
                        px-2 py-1
                        text-xs
                        text-kilotextlight
                        hover:border-kilored
                        hover:text-kilored
                        transition
                      "
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {galleryPreviewUrls.map((previewUrl, index) => (
                  <div
                    key={`pending-${index}`}
                    className="
                      relative
                      aspect-square
                      rounded-lg
                      border border-dashed border-kilored/50
                      overflow-hidden
                      bg-kilodarkgrey
                    "
                  >
                    <img
                      src={previewUrl}
                      alt={`New gallery image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className="
                        absolute bottom-2 left-2
                        rounded-md
                        bg-kiloblack/90
                        px-2 py-0.5
                        text-[10px]
                        uppercase
                        tracking-wide
                        text-kilotextlight
                      "
                    >
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isEditMode &&
              existingImages.length === 0 &&
              galleryPreviewUrls.length === 0 && (
                <p className="text-xs text-kilotextgrey">
                  No gallery images yet.
                </p>
              )}
          </div>
        </AdminFormSection>

        {/* CATEGORIES */}
        <AdminFormSection
          title="Categories"
          description="Select one or more categories."
        >
           <div
            className="
              rounded-lg
              border-2 border-[#55555f]
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
                    border-2 border-[#55555f]
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

        {/* PRICING + INVENTORY */}
        <AdminFormSection
          title="Pricing & Inventory"
          description="Set price and stock for each print size."
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 rounded-lg border border-[#3a3a41] bg-kiloblack p-4">
              <p className="text-sm font-semibold text-kilotextlight">
                {formatProductSizeLabel("Small")}
              </p>
              <AdminInput
                label="Price"
                type="text"
                inputMode="numeric"
                placeholder="$0.00"
                value={smallPrice}
                onChange={(e) => setSmallPrice(formatPriceInput(e.target.value))}
                required
              />
              <AdminInput
                label="Stock"
                type="number"
                min={0}
                value={smallStock}
                onChange={(e) => setSmallStock(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3 rounded-lg border border-[#3a3a41] bg-kiloblack p-4">
              <p className="text-sm font-semibold text-kilotextlight">
                {formatProductSizeLabel("Large")}
              </p>
              <AdminInput
                label="Price"
                type="text"
                inputMode="numeric"
                placeholder="$0.00"
                value={largePrice}
                onChange={(e) => setLargePrice(formatPriceInput(e.target.value))}
                required
              />
              <AdminInput
                label="Stock"
                type="number"
                min={0}
                value={largeStock}
                onChange={(e) => setLargeStock(e.target.value)}
                required
              />
            </div>
          </div>
        </AdminFormSection>

        {error && <FormAlert type="error" message={error} />}

        {successMessage && (
          <FormAlert type="success" message={successMessage} />
        )}

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            loadingText={isEditMode ? "Saving..." : "Creating..."}
            disabled={
              !isImageValid ||
              isCategoryInvalid ||
              !hasImage ||
              smallPriceInvalid ||
              largePriceInvalid
            }
          >
            {isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
        </fieldset>
      </form>
    </AdminForm>
  );
};

export default ProductForm;
