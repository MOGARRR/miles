// Supabase Storage contains a bucket product-images (public)

import { NextResponse } from "next/server";
import { uploadProductImage } from "@/src/controllers/uploadControllers";

// POST /api/upload/image
export async function POST(req: Request) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    const file = formData.get("file");

    // Guard: ensure a file was provided
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Delegate upload logic to the controller
    const publicUrl = await uploadProductImage(file);

    // Success response
    return NextResponse.json(
      { publicUrl },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("POST /api/upload/image error:", error.message);

    return NextResponse.json(
      { error: error.message || "Image upload failed" },
      { status: 500 }
    );
  }
}