import { createClient } from "@/utils/supabase/server";

// GET ALL EVENTS
export async function getAllEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw new Error(error.message);
  return data;
};

// POST EVENTS


// PUT EVENTS


// DELETE EVENTS 


