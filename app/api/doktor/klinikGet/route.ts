import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const klinikId = searchParams.get("klinikId");

  if (!klinikId) {
    return NextResponse.json({ error: "Klinik ID gerekli" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("doktorlar")
    .select("id, doktorAdiSoyadi, klinikId")
    .eq("klinikId", klinikId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
