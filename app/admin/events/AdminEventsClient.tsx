"use client";

import { useState } from "react";
import type { Event } from "@/src/types/event";
import CreateEventsForm from "./CreateEventsForm";
import { formatDate } from "@/src/helpers/formatDate";

// Client wrapper owns all interactive UI for events:
// - toggling create form
// - rendering the event list
// - conditional UI (past events, badges, etc.)
type Props = {
  events: Event[];
};

const AdminEventsClient = ({ events }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const isPastEvent = (endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventEnd = new Date(endDate);
    eventEnd.setHours(0, 0, 0, 0);

    return eventEnd < today;
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="rounded border px-3 py-1 text-sm"
        >
          {isFormOpen ? "Close" : "Add New Event"}
        </button>
      </div>

      {isFormOpen && (
        <CreateEventsForm onSuccess={() => setIsFormOpen(false)} />
      )}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-8 mt-6">
          {events.map((event) => (
            <li key={event.id}>
              <div className="flex items-center gap-2">
                <p className="font-medium">{event.title}</p>

                {isPastEvent(event.end_date) && (
                  <span className="text-xs rounded bg-gray-600 px-2 py-0.5">
                    PAST
                  </span>
                )}
              </div>

              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-48 h-32 object-cover rounded border mt-3 mb-3"
                />
              )}

              {event.description && (
                <p className="mt-2 text-sm">{event.description}</p>
              )}

              <p className="mt-2 text-sm">
                📅{" "}
                {event.start_date === event.end_date
                  ? formatDate(event.start_date)
                  : `${formatDate(event.start_date)} - ${formatDate(
                      event.end_date
                    )}`}
              </p>

              <p className="mt-2 text-sm">{event.hours}</p>
              <p className="mt-2 text-sm">{event.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminEventsClient;