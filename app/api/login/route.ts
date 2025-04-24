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
      .from("hastalar")
      .select("id,email,password ")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Hasta bulunamadı!" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Şifre Hatalı!" }, { status: 401 });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, userType: "hasta" },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
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
