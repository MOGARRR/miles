"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { Category } from "@/src/types/category";
import FormAlert from "@/app/components/FormAlert";

type Props = {
  categories: Category[];
};


const CreateProductForm = ({ categories }: Props) => {

  // state for form fields [ no image upload yet ]
  const [title, setTitle] = useState(""); 
  const [categoryId, setCategoryId] = useState<number | "">(""); 
  const [description, setDescription] = useState(""); 
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true); 
  const [imageUrl, setImageUrl] = useState(""); 
  const [imageFile, setImageFile] = useState<File | null>(null);

  // state for loading page
  const [isLoading, setIsLoading] = useState(false);

  // prevent the form from starting with errors later
  // “The user has attempted to submit the form at least once.”
  const [hasSubmitted, setHasSubmitted] = useState(false);
  

  // state for errors 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // guards for empty price, title, image or category
  const isPriceInvalid = Number(price) <= 0;
  const isCategoryInvalid = categoryId === "";
  const hasImage = imageUrl !== "" || imageFile !== null;

  // guard to prevent invalid image URL (would crash next image)
  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");

  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (
      isPriceInvalid ||
      !isImageValid || 
      isCategoryInvalid ||
      !hasImage
    ) {
      return;
    } 

    setIsLoading(true);
    setError(null); //clear previous errors
    setSuccessMessage(null);

    //create a new product
    try {
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


      const res = await fetch ("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category_id: categoryId,
          description,
          price_cents: Math.round(Number(price) * 100),
          image_URL: finalImageUrl, 
          is_available: isAvailable
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create product");
      }
    
      // Trigger a re-render of the Server Component 
      router.refresh();

      setSuccessMessage("New product created successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      // reset form
      setTitle("");
      setCategoryId("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);
      setIsAvailable(true);
      setHasSubmitted(false);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");

    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div>
      <div>
        <h1>Add a New Product</h1>
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

        <div>
          <label>Price</label>
          <input 
            type="number"
            required
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className=" rounded border w-full  mt-1 p-2 text-sm"
          />
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
            isPriceInvalid || 
            !isImageValid ||
            isCategoryInvalid ||
            !hasImage
          }
          className="rounded border p-3 my-6 text-sm disabled:opacity-50"
        >
          {isLoading ? <LoadingAnimation /> : "Create Product"}
        </button> 

      </form>
      
    </div>
  )
};

export default CreateProductForm;
