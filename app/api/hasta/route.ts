import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ varMi: false });

  const { data } = await supabase
    .from("hastalar")
    .select("id")
    .eq("id", id)
    .single();

  return NextResponse.json({ varMi: !!data });
}
