import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { kullaniciAdiSoyadi, email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("kullanicilar")
      .insert([{ kullaniciAdiSoyadi, email, password: hashedPassword }])
      .select();

    if (error) {
      console.log("supabase hatası ", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.log(data);

    return NextResponse.json(
      { message: "Kullanıcı başarıyla kaydedildi!", user: data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Kayıt başarısız!" }, { status: 500 });
  }
}
