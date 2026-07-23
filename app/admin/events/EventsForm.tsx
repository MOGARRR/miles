"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/app/components/ui/AdminForm";
import AdminInput from "@/app/components/ui/AdminInput";
import AdminFormSection from "@/app/components/ui/AdminFormSection";
import Button from "@/app/components/ui/Button";
import FormAlert from "@/app/components/FormAlert";
import { Event } from "@/src/types/event";
import {
  addDaysToDateInput,
  formatHoursRange,
  getDefaultEventDates,
  parseHoursRange,
} from "@/src/helpers/formatEventSchedule";

type Props = {
  event?: Event; // present = edit mode
  onSuccess?: () => void;
  onClose?: () => void;
};

const dateInputClassName = `
  w-full
  rounded-lg
  border border-[#3a3a41]
  bg-kiloblack
  px-3 py-2
  text-sm
  text-kilotextlight
  [color-scheme:dark]
`;

const isFutureDate = (eventDate: string) => new Date() < new Date(eventDate);

const EventsForm = ({ event, onSuccess, onClose }: Props) => {
  const defaults = getDefaultEventDates();
  const initialHours = parseHoursRange(event?.hours ?? "");

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startDate, setStartDate] = useState(
    event?.start_date ?? defaults.startDate,
  );
  const [endDate, setEndDate] = useState(event?.end_date ?? defaults.endDate);
  const [location, setLocation] = useState(event?.location ?? "");
  const [startTime, setStartTime] = useState(initialHours.startTime || "10:00");
  const [endTime, setEndTime] = useState(initialHours.endTime || "18:00");
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(
    event?.is_active ?? isFutureDate(defaults.endDate),
  );

  const syncActiveFromEndDate = (nextEndDate: string) => {
    setIsActive(isFutureDate(nextEndDate));
  };

  const handleStartDateChange = (nextStartDate: string) => {
    setStartDate(nextStartDate);
    const nextEndDate = addDaysToDateInput(nextStartDate, 1);
    setEndDate(nextEndDate);
    syncActiveFromEndDate(nextEndDate);
  };

  const handleEndDateChange = (nextEndDate: string) => {
    setEndDate(nextEndDate);
    syncActiveFromEndDate(nextEndDate);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditMode = Boolean(event);
  const router = useRouter();

  const isImageValid =
    imageFile !== null ||
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("http");

  const hours = formatHoursRange(startTime, endTime);

  useEffect(() => {
    if (!event) return;

    const parsedHours = parseHoursRange(event.hours);

    setTitle(event.title);
    setDescription(event.description ?? "");
    setStartDate(event.start_date);
    setEndDate(event.end_date);
    setLocation(event.location);
    setStartTime(parsedHours.startTime || "10:00");
    setEndTime(parsedHours.endTime || "18:00");
    setImageUrl(event.image_url ?? "");
    setImageFile(null);
    setIsActive(event.is_active ?? false);
  }, [event]);

  const resetCreateForm = () => {
    const nextDefaults = getDefaultEventDates();
    setTitle("");
    setDescription("");
    setStartDate(nextDefaults.startDate);
    setEndDate(nextDefaults.endDate);
    setStartTime("10:00");
    setEndTime("18:00");
    setLocation("");
    setImageUrl("");
    setImageFile(null);
    setHasSubmitted(false);
    syncActiveFromEndDate(nextDefaults.endDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (!isImageValid) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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

      const endpoint = isEditMode ? `/api/events/${event!.id}` : "/api/events";
      const method = isEditMode ? "PUT" : "POST";

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

      router.refresh();

      setSuccessMessage(
        isEditMode
          ? "Event updated successfully!"
          : "New event created successfully!",
      );
      setTimeout(() => {
        onSuccess?.();
      }, 1500);

      if (!isEditMode) {
        resetCreateForm();
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

          <AdminFormSection
            title="Media"
            description="Upload an image or use an external URL."
          >
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
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className={dateInputClassName}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-kilotextlight">
                  End Date
                </label>

                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className={dateInputClassName}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 font-semibold text-kilotextlight">
                  Opens
                </label>

                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={dateInputClassName}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-kilotextlight">
                  Closes
                </label>

                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={dateInputClassName}
                />
              </div>
            </div>

            {hours && (
              <p className="text-sm text-kilotextgrey mt-2">
                Displayed as: {hours}
              </p>
            )}
          </AdminFormSection>

          <AdminFormSection title="Location">
            <AdminInput
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
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
