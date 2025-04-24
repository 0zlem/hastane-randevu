// /app/api/kullanici/varMi/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("kullaniciId");

  if (!userId) {
    return NextResponse.json({ varMi: false });
  }

  const { data, error } = await supabase
    .from("kullanicilar")
    .select("kullaniciId")
    .eq("kullaniciId", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ varMi: false });
  }

  return NextResponse.json({ varMi: true });
}
