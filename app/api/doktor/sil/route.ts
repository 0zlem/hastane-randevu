/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { doktorId } = await req.json();
    console.log("Silinecek Doktor ID:", doktorId);

    if (!doktorId) {
      return NextResponse.json({ error: "Doktor ID eksik!" }, { status: 400 });
    }

    const { error } = await supabase
      .from("doktorlar")
      .delete()
      .eq("id", doktorId);

    if (error) {
      console.error("Supabase Hatası:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Doktor başarıyla silindi!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Sunucu Hatası:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
