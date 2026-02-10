import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

type Params = {
  id: string;
  imageId: string;
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id, imageId } = await params;

    const productId = Number(id);
    const imageIdNum = Number(imageId);

    if (Number.isNaN(productId) || Number.isNaN(imageIdNum)) {
      return NextResponse.json(
        { error: "Invalid ids" },
        { status: 400 }
      );
    }

    // Fetch image record
    const { data: image, error: fetchError } = await supabaseAdmin
      .from("product_images")
      .select("image_url")
      .eq("id", imageIdNum)
      .eq("product_id", productId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Extract storage path from public URL
    const filePath = image.image_url.split("/product-images/")[1];

    // Delete from storage
    await supabaseAdmin.storage
      .from("product-images")
      .remove([filePath]);

    // Delete DB record
    await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("id", imageIdNum);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete gallery image error:", error.message);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
