/* eslint-disable prefer-const */
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { doktorId, klinikId, tarih, saat, hastaId } = body;

    if (!doktorId || !klinikId || !tarih || !saat || !hastaId) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik!" },
        { status: 400 }
      );
    }

    let { data: randevuSaat, error: saatError } = await supabase
      .from("randevuSaatleri")
      .select("id")
      .eq("doktorId", doktorId)
      .eq("tarih", tarih)
      .eq("saat", saat)
      .single();

    if (saatError && saatError.code !== "PGRST116") {
      return NextResponse.json({ error: saatError.message }, { status: 500 });
    }

    if (!randevuSaat) {
      const { data: yeniSaat, error: yeniSaatError } = await supabase
        .from("randevuSaatleri")
        .insert([{ doktorId, tarih, saat }])
        .select("id")
        .single();

      if (yeniSaatError) {
        return NextResponse.json(
          { error: yeniSaatError.message },
          { status: 500 }
        );
      }

      randevuSaat = yeniSaat;
    }

    const { data, error } = await supabase.from("randevular").insert([
      {
        doktorId,
        klinikId,
        hastaId,
        randevuSaatId: randevuSaat.id,
        durum: "oluştu",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Randevu ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
