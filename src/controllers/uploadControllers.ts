// We use the low-level Supabase client here (NOT the auth-aware server helper)
// because image uploads are infrastructure-level operations.
// This client uses the service role key, has no cookies, and bypasses RLS.
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SECERT_KEY! 
); 

// -----------------------------------------------------------------------------
// Internal helper
// -----------------------------------------------------------------------------
// Upload an image file to the specified Supabase Storage bucket
// and return its public URL.
async function uploadImageToBucket(
  file: File,
  bucketName: string
): Promise<string> {

  if (!file) {
    throw new Error("No file provided");
  }

  // Only allow image files
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Extract file extension from original filename
  const fileExt = file.name.split(".").pop() || "jpg";

  // Generate a unique filename to avoid collisions 
  // UUID ensures multiple uploads never overwrite each other
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Generate a public URL for the uploaded file 
  // Since the bucket is public, this URL is immediately accessible
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error("Failed to generate public image URL");
  }
  // Return the final public URL 
  // This string is what gets stored in the DB (image_URL column)
  return data.publicUrl;
}


// -----------------------------------------------------------------------------
// Public controllers
// -----------------------------------------------------------------------------

// Upload a product image and return its public URL
export async function uploadProductImage(file: File): Promise<string> {
  return uploadImageToBucket(file, "product-images");
}

// Upload an event image and return its public URL
export async function uploadEventImage(file: File): Promise<string> {
  return uploadImageToBucket(file, "event-images");
}