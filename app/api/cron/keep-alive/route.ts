import { NextResponse } from "next/server";
import { supabasePublic } from "@/utils/supabase/supabasePublic";

/**
 * Lightweight DB ping so the free Supabase project does not pause from inactivity.
 * Invoked daily by Vercel Cron (see vercel.json).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { error } = await supabasePublic
      .from("categories")
      .select("id")
      .limit(1);

    if (error) {
      console.error("GET /api/cron/keep-alive error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/cron/keep-alive error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
