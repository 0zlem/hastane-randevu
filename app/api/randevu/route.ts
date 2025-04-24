/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Yetkisiz erişim!" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      email: string;
    };
    console.log("Decoded UserID:", decoded.userId);

    if (!decoded?.userId) {
      return NextResponse.json({ error: "Geçersiz token!" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("randevular")
      .select(
        `
      id,
      durum,
      hastalar(fullname),
      randevuSaatleri ( saat, tarih ),
      doktorlar ( doktorAdiSoyadi ),
      klinikler ( klinik, klinikYeri )
    `
      )
      .eq("hastaId", decoded.userId);

    console.log("Supabase Randevu Data:", data);
    console.log("Supabase Randevu Error:", error);

    if (error) {
      console.error("Supabase randevu çekme hatası:", error.message);
      return NextResponse.json({ error: "Veri çekme hatası" }, { status: 500 });
    }

    return NextResponse.json({ randevular: data ?? [] }, { status: 200 });
  } catch (error: any) {
    console.error("Token doğrulama hatası:", error.message);
    return NextResponse.json(
      { error: "Token geçersiz veya süresi dolmuş!" },
      { status: 401 }
    );
  }
}
