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
      userType: string;
    };

    if (decoded.userType !== "hasta") {
      return NextResponse.json(
        { error: "Erişim yetkiniz yok!" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      {
        user: {
          id: decoded.userId,
          email: decoded.email,
          userType: decoded.userType,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Token geçersiz veya süresi dolmuş!" },
      { status: 401 }
    );
  }
}
