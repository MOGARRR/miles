import { createClient } from "@/utils/supabase/server";

// GET ALL EVENTS
export async function getAllEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// POST EVENTS
export async function createEvent(eventItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert([eventItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT EVENTS
export async function updateEvent(id: string, updatedEventItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedEventItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE EVENTS

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}
