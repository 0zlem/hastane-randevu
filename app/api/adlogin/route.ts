/* eslint-disable @typescript-eslint/no-unused-vars */
import { supabase } from "@/lib/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const SECRET_KEY = process.env.JWT_KEY || "super-secret-key";
  try {
    const { email, password } = await req.json();

    const { data: user, error } = await supabase
      .from("kullanicilar")
      .select("kullaniciId,email,password ")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "kullanıcı bulunamadı!" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Şifre Hatalı!" }, { status: 401 });
    }
    const token = jwt.sign(
      { userId: user.kullaniciId, email: user.email, userType: "admin" },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Giriş başarılı!" });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; Secure=${
        process.env.NODE_ENV === "production"
      } SameSite=Lax; Max-Age=3600`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}
