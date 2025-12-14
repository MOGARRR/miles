import { Event } from "@/src/types/event";

type EventCardProps = {
  event: Event;
}; 


const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="border border-gray-700 rounded p-4">
      <p>{event.title}</p>

      <p>{event.start_date} - {event.end_date}</p>

      {event.location}
      
    </div>
  )
};

export default EventCard;
