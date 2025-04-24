/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { klinik, klinikYeri } = await req.json();

    if (!klinik || !klinikYeri) {
      return NextResponse.json(
        { message: "Eksik bilgi var! Klinik adı ve yeri zorunludur." },
        { status: 400 }
      );
    }

    console.log("Gelen Veri:", { klinik, klinikYeri });

    const { data, error } = await supabase.from("klinikler").insert([
      {
        klinik,
        klinikYeri,
      },
    ]);

    if (error) {
      console.error("Supabase Hatası:", error.message);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.log("Başarıyla Eklendi:", data);

    return NextResponse.json(
      { message: "Klinik başarıyla eklendi!", data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Sunucu Hatası:", error.message);
    return NextResponse.json(
      { message: "Sunucu hatası!", error: error.message },
      { status: 500 }
    );
  }
}
