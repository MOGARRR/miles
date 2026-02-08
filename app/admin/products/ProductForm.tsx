"use client"

// Product
// ├─ id
// ├─ title
// ├─ description
// ├─ image_URL
// ├─ category_id
// ├─ is_available
// ├─ product_sizes[]  ← source of truth for prices

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { Category } from "@/src/types/category";
import { Product } from "@/src/types/product";
import FormAlert from "@/app/components/FormAlert";

type Props = {
  product?: Product;     // edit mode
  categories: Category[];
  onSuccess?: () => void;

};


const ProductForm = ({ categories, product, onSuccess }: Props) => {

  // state for form fields [ no image upload yet ]
  const [title, setTitle] = useState(""); 
  const [categoryId, setCategoryId] = useState<number | "">(""); 
  const [description, setDescription] = useState(""); 

  const [isAvailable, setIsAvailable] = useState(true); 
  const [imageUrl, setImageUrl] = useState(""); 
  const [imageFile, setImageFile] = useState<File | null>(null);

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // prevent the form from starting with errors later
  // “The user has attempted to submit the form at least once.”
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [smallPrice, setSmallPrice] = useState("");
  const [largePrice, setLargePrice] = useState("");

  // state for errors 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // guards for empty price, title, image or category
  const isCategoryInvalid = categoryId === "";
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

    setTitle(product.title);
    setCategoryId(product.category_id ?? "");
    setDescription(product.description ?? "");
    setImageUrl(product.image_URL ?? "");
    setImageFile(null);
    setIsAvailable(product.is_available);

    const small = product.product_sizes?.find(s => s.label === "Small");
    const large = product.product_sizes?.find(s => s.label === "Large");

    setSmallPrice(small ? (small.price_cents / 100).toString() : "");
    setLargePrice(large ? (large.price_cents / 100).toString() : "");
  }, [product]);


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

      const res = await fetch (endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category_id: categoryId,
          description,
          image_URL: finalImageUrl, 
          is_available: isAvailable,
          product_sizes: [
            {
              label: "Small",
              price_cents: Math.round(Number(smallPrice) * 100),
            },
            {
              label: "Large",
              price_cents: Math.round(Number(largePrice) * 100),
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }
    
      // Trigger a re-render of the Server Component 
      router.refresh();

      setSuccessMessage(
        isEditMode
          ? "Product updated successfully!"
          : "New product created successfully!"
      );

      setTimeout(() => {
        onSuccess?.();
      }, 1500);

     
      // reset form only when creating 
      if (!isEditMode) {
        setTitle("");
        setCategoryId("");
        setDescription("");
        setImageUrl("");
        setImageFile(null);
        setIsAvailable(true);
        setHasSubmitted(false);
        setSmallPrice("");
        setLargePrice("");
      }
      

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");

    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div>
      <div>
        <h2 className="text-lg font-medium">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Title</label>
          <input 
            type="text" 
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Category</label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="rounded border w-full mt-1 p-2 text-sm bg-black text-white"         
          >
            <option value="">Select a category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}

          </select>
        </div>

        {/* {isCategoryInvalid && (
          <p className="text-sm text-red-600 mt-1">
            Please select a category
          </p>
        )} */}

        <div>
          <label>Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 font-medium">Prices</label>

          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-sm">Small</label>
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
              <label className="text-sm">Large</label>
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


        <div>
          <label>Image URL </label>
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
          <label>OR upload image</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
                setImageUrl(""); // file wins
              }
            }}
            className="rounded border w-full mt-1 p-2 text-sm"
          />

        </div>

        {/* {!isImageValid && (
          <p className="text-sm text-red-600 mt-1">
            Image URL must start with "/" or "http"
          </p>
        )} */}

        {imageFile && (
          <p className="text-sm text-gray-600 mt-1">
            Selected image: {imageFile.name}
          </p>
        )}

        <div>
          <input 
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <label>Available</label>
        </div>

        {successMessage && (
          <FormAlert type="success" message={successMessage} />
        )}

        {error && (
          <FormAlert type="error" message={error} />
        )}

        

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
          className="rounded border p-3 my-6 text-sm disabled:opacity-50"
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
  )
};

export default ProductForm;
