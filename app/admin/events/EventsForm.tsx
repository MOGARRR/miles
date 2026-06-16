"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import AdminForm from "@/app/components/ui/AdminForm";
import AdminInput from "@/app/components/ui/AdminInput";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import Button from "@/app/components/ui/Button";
import FormAlert from "@/app/components/FormAlert";
import { Event } from "@/src/types/event";

type Props = {
  event?: Event; // present = edit mode
  onSuccess?: () => void;
  onClose?: () => void;
};

const EventsForm = ({ event, onSuccess, onClose}: Props) => {
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
    <AdminForm
      title={isEditMode ? "Edit Event" : "Create Event"}
      description="Add event details, schedule, location, and media."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-6">
          {/* EVENT INFO */}
          <AdminFormSection title="Event Information">
            <AdminInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block mb-1 font-semibold text-kilotextlight">
                Description
              </label>

              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`
                  w-full
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kiloblack
                  px-3 py-2
                  text-sm
                  min-h-[120px]
                `}
              />
            </div>
          </AdminFormSection>

          {/* MEDIA */}
          <AdminFormSection
            title="Media"
            description="Upload an image or use an external URL."
          >
            {/* IMAGE PREVIEW  */}
            <div
              className="
              rounded-lg
              border-2 border-[#55555f]
              bg-kiloblack
              p-4
              space-y-4
            "
            >
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
                file:mr-4
                file:rounded-md
                file:border-0
                file:bg-kilored
                file:px-4
                file:py-2
                file:text-white
                cursor-pointer
              "
              />

              {imageFile && (
                <p className="text-sm text-kilotextgrey">
                  Selected image: {imageFile.name}
                </p>
              )}

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
                bg-kiloblack
                px-3 py-2
                text-sm
              "
              />

              {hasSubmitted && !isImageValid && (
                <p className="text-sm text-kilored">
                  Image URL must start with "/" or "http"
                </p>
              )}

              {(imageFile || imageUrl) && (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                  alt="Preview"
                  className="
                  mt-2
                  h-48
                  w-full
                  rounded-lg
                  object-cover
                  border-2 border-[#55555f]
                "
                />
              )}
            </div>
          </AdminFormSection>

          {/* SCHEDULE */}
          <AdminFormSection title="Schedule">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-kilotextlight">
                  Start Date
                </label>

                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="
                  w-full
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kiloblack
                  px-3 py-2
                  text-sm
                "
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-kilotextlight">
                  End Date
                </label>

                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => handleDateValidation(e.target.value)}
                  className="
                  w-full
                  rounded-lg
                  border border-[#3a3a41]
                  bg-kiloblack
                  px-3 py-2
                  text-sm
                "
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1 font-semibold text-kilotextlight">
                Hours
              </label>

              <input
                type="text"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="
                w-full
                rounded-lg
                border border-[#3a3a41]
                bg-kiloblack
                px-3 py-2
                text-sm
              "
              />
            </div>
          </AdminFormSection>

          <AdminFormSection title="Location">
            <AdminInput
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            ></AdminInput>
          </AdminFormSection>

          {/* ALERTS */}
          {error && <FormAlert type="error" message={error} />}

          {successMessage && (
            <FormAlert type="success" message={successMessage} />
          )}

          {/* SUBMIT BUTTON  */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText={isEditMode ? "Saving..." : "Creating..."}
            >
              {isEditMode ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </fieldset>
      </form>
    </AdminForm>
  );
};

export default EventsForm;
