/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("randevular").select(
      `
      id,
      durum,
      hastalar(fullname),
      randevuSaatleri ( saat, tarih ),
      doktorlar ( doktorAdiSoyadi ),
      klinikler ( klinik, klinikYeri )
    `
    );

    console.log("Supabase Randevu Data:", data);
    console.log("Supabase Randevu Error:", error);

    if (error) {
      console.error("Supabase randevu çekme hatası:", error.message);
      return NextResponse.json({ error: "Veri çekme hatası" }, { status: 500 });
    }

    return NextResponse.json({ randevular: data ?? [] }, { status: 200 });
  } catch (error: any) {
    console.error("Token doğrulama hatası:", error.message);
  }
}
