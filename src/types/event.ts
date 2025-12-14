export interface Event {
  id: number;
  title: string;
  description: string | null;
  location: string;
  image_url: string;
  start_date: string; // "YYYY-MM-DD"
  end_date: string;
  hours: string;
};