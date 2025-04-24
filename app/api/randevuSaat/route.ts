import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doktorId = searchParams.get("doktorId");
    const tarih = searchParams.get("tarih");

    if (!tarih) {
      return NextResponse.json({ error: "Tarih gereklidir!" }, { status: 400 });
    }

    let query = supabase
      .from("randevuSaatleri")
      .select("saat, doktorId")
      .eq("tarih", tarih);

    if (doktorId) {
      query = query.eq("doktorId", doktorId);
    }

    const { data: doluSaatler, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const tumSaatler: string[] = [];
    for (let saat = 8; saat < 17; saat++) {
      for (let dakika = 0; dakika < 60; dakika += 15) {
        const saatString = `${saat.toString().padStart(2, "0")}:${dakika
          .toString()
          .padStart(2, "0")}`;
        tumSaatler.push(saatString);
      }
    }

    const doluSaatSet = new Set(doluSaatler?.map((s) => s.saat));
    const uygunSaatler = tumSaatler.filter((saat) => !doluSaatSet.has(saat));

    return NextResponse.json({ tarih, uygunSaatler }, { status: 200 });
  } catch (error) {
    console.error(" API Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası!" }, { status: 500 });
  }
}
