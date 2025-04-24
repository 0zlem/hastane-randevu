import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Randevu Id gerekli" },
        { status: 400 }
      );
    }
    const { error } = await supabase
      .from("randevular")
      .update({ durum: "iptal" })
      .eq("id", id);

    if (error) {
      console.log(error.message, "İptal etme hatası");
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
