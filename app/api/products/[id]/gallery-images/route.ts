import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

// UPLOAD GALLERY IMAGES
type Params = {
  id: string;
};

export async function POST(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    //console.log(" Gallery upload route hit");

    const { id } = await params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    //console.log("Files received:", files.length);

    if (!files.length) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const arrayBuffer = await file.arrayBuffer();
      const filePath = `${productId}/gallery/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("product-images")
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabaseAdmin
        .from("product_images")
        .insert({
          product_id: productId,
          image_url: data.publicUrl,
          sort_order: i,
        });

      if (dbError) throw dbError;

      //console.log("Inserted gallery image:", data.publicUrl);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Gallery upload error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
