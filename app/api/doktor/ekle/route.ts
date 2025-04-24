import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { doktorAdiSoyadi, klinikId } = await req.json();

    const { data, error } = await supabase
      .from("doktorlar")
      .insert([{ doktorAdiSoyadi, klinikId }]);

    if (error) {
      console.log("Supabase Hatası:", error.message);

      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.log(error);
  }
}
