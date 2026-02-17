"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import FormAlert from "@/app/components/FormAlert";
import { Event } from "@/src/types/event";

type Props = {
  event?: Event; // present = edit mode
  onSuccess?: () => void;
};

const EventsForm = ({ event, onSuccess }: Props) => {
  // state for form fields
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startDate, setStartDate] = useState(event?.start_date ?? "");
  const [endDate, setEndDate] = useState(event?.end_date ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [hours, setHours] = useState(event?.hours ?? "");
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(event?.is_active ?? false);

  // Check and set event Date validation
  const eventDateValidation = (eventDate: string) =>
    new Date() < new Date(eventDate);

  const handleDateValidation = (endDate: string) => {
    const isValidDate = eventDateValidation(endDate);
    setIsActive(isValidDate);
    setEndDate(endDate);
  };

  const [isLoading, setIsLoading] = useState(false);

  // prevent the form from starting with errors later
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //error and success messages
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detect edit vs create
  const isEditMode = Boolean(event);

  const router = useRouter();

  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");

  // Sync when switching which event is being edited
  useEffect(() => {
    if (!event) return;

    setTitle(event.title);
    setDescription(event.description ?? "");
    setStartDate(event.start_date);
    setEndDate(event.end_date);
    setLocation(event.location);
    setHours(event.hours);
    setImageUrl(event.image_url ?? "");
    setImageFile(null);
    setIsActive(event.is_active ?? false);
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!isImageValid) {
      return;
    }

    setIsLoading(true);
    setError(null); // clear previous errors
    setSuccessMessage(null);

    try {
      //RESOLVE FINAL IMAGE UPLOAD VS URL
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

      const endpoint = isEditMode ? `/api/events/${event!.id}` : "/api/events";

      const method = isEditMode ? "PUT" : "POST";

      //CREATE EVENT
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          hours,
          location,
          image_url: finalImageUrl,
          is_active: isActive,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      // Trigger a re-render of the Server Component
      router.refresh();

      setSuccessMessage(
        isEditMode
          ? "Event updated successfully!"
          : "New event created successfully!",
      );
      setTimeout(() => {
        onSuccess?.();
      }, 1500);

      // Reset form if NOT in edit mode
      if (!isEditMode) {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setHours("");
        setLocation("");
        setImageUrl("");
        setImageFile(null);
        setHasSubmitted(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className=" 
    w-2/4 
    bg-gray-800 
    p-4 mb-6
    rounded-md border
    "
    >
      <h2 className="
          text-xl font-medium text-center text-kilored
          border-b-1
          mb-4
          ">
        {isEditMode ? "Edit Event" : "Add New Event"}
      </h2>

      <form onSubmit={handleSubmit} className="text-center text-md">
        <div>
          <label>Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className=" rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div>
          <label>
            {" "}
            Image URL <i>OR </i>upload image
          </label>
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
                  hover:bg-gray-600
                  "
          />
          {imageFile && (
            <p className="text-sm text-gray-300 mt-1">
              Selected image: {imageFile.name}
            </p>
          )}

          {hasSubmitted && !isImageValid && (
            <p className="text-sm text-red-600 mt-1">
              Image URL must start with "/" or "http"
            </p>
          )}
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null); // URL wins
            }}
            className="rounded border w-full mt-1 p-2 text-sm"
          />
        </div>

        <div className="flex justify-center my-4">
          <div>
            <label>Start Date</label>
            <br />
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="
              rounded border 
              w-full 
              mt-1 p-2 
              text-md"
            />
          </div>

          <div>
            <label>End Date</label>
            <br />
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => handleDateValidation(e.target.value)}
              className="
              rounded border 
              w-full 
              mt-1 ml-4 p-2
              text-md"
            />
          </div>
        </div>

        <div>
          <label>Hours</label>
          <input
            type="text"
            required
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-md"
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded border w-full mt-1 p-2 text-md"
          />
        </div>

        {error && <FormAlert type="error" message={error} />}

        {successMessage && (
          <FormAlert type="success" message={successMessage} />
        )}

        <button
          type="submit"
          disabled={isLoading}
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
          disabled:cursor-not-allowed "
        >
          {isLoading ? (
            <LoadingAnimation />
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Create Event"
          )}
        </button>
      </form>
    </div>
  );
};

export default EventsForm;
