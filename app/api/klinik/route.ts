import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("klinikler").select("*");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.log(error);
  }
}
