import { createClient } from "@/utils/supabase/server";

// GET all users
export async function getAllUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Users").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// GET user by id
export async function getUsersById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// POST user
export async function createUser(userItem: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Users")
    .insert([userItem])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// PUT user
export async function updateUser(id: string, updatedUserItem: any) {
  const supabase = await createClient();
  const updates = Object.fromEntries(
    Object.entries(updatedUserItem).filter(([_, v]) => v !== undefined)
  );
  const { data, error } = await supabase
    .from("Users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// DELETE user
export async function deleteUser(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Users")
    .delete()
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}