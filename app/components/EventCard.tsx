import { Event } from "@/src/types/event";
import { formatDate } from "@/utils/date";
import { MapPin, Calendar1, Clock } from "lucide-react";


type EventCardProps = {
  event: Event;
}; 


const EventCard = ({ event }: EventCardProps) => {
  const isSingleDayEvent = event.start_date === event.end_date;

  return (
    <div className="border border-gray-700 rounded p-4 mt-12">
      <img 
        src={event.image_url}
        alt={event.title}
        className=" w-full h-48 object-cover rounded mb-3"
      />

      <div className="space-y-1">
        <p className="font-semibold">{event.title}</p>
        {event.description && (
          <p>{event.description}</p>
        )}
        
        <p className="text-sm text-gray-400">
          {isSingleDayEvent ? (
            <span className="flex items-center gap-1">
              <Calendar1 size={14} className="text-red-400" />
              {formatDate(event.start_date)}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Calendar1 size={14} className="text-red-400"/>
              {formatDate(event.start_date)} – {formatDate(event.end_date)}
            </span>
          )}
        </p>
        
        {event.hours && (
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <Clock size={14} className="text-red-400"/> Hours: {event.hours}
          </span>
        )}    

        <span className="flex items-center gap-1 text-sm text-gray-400">
          <MapPin size={14} className="text-red-400"/> {event.location}
        </span>

      </div>
      
      
    </div>
  )
};

export default EventCard;
