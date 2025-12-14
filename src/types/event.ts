export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  start_date: string; // "YYYY-MM-DD"
  end_date: string;
  hours: string | null;
};