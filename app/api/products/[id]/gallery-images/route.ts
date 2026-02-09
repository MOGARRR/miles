import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = Number(params.productId);

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const insertedRows = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const filePath = `${productId}/gallery/${Date.now()}-${file.name}`;

      // upload to existing bucket
      const { error: uploadError } = await supabaseAdmin.storage
        .from("product-images")
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // get public URL
      const { data } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(filePath);

      // insert DB row
      const { error: dbError } = await supabaseAdmin
        .from("product_images")
        .insert({
          product_id: productId,
          image_url: data.publicUrl,
          sort_order: i,
        });

      if (dbError) throw dbError;

      insertedRows.push(data.publicUrl);
    }

    return NextResponse.json(
      { images: insertedRows },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Gallery upload error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
