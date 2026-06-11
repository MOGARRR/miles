import { getBaseUrl } from "@/src/helpers/getBaseUrl";
import { Event } from "@/src/types/event";
import AdminEventsClient from "./AdminEventsClient";

const AdminEventsPage = async () => {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/events`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json();
  const events: Event[] = data.events ?? [];

  return (
    // HEADING
    <div className="py-12 ">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">EVENTS</h1>
        <p className="
          max-w-[800px] mx-auto mt-8
          text-base md:text-lg text-gray-200  text-center"
        >
          Create and manage events to highlight new work, launches, and important moments.
        </p>
      </div>

      
      <br /> <br />
      <AdminEventsClient events={events} />
    </div>
  );
};

export default AdminEventsPage;
