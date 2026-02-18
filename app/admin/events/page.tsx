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
    <div>
      <div className="text-center">
        <h1 className=" text-3xl border-b-1">EVENTS ADMIN </h1>
        <p className="text-xl">Manage Events</p>
      </div>
      <br /> <br />
      <AdminEventsClient events={events} />
    </div>
  );
};

export default AdminEventsPage;
