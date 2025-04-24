import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { klinikId } = await req.json();

    const { error } = await supabase
      .from("klinikler")
      .delete()
      .eq("id", klinikId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "silindi" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
  }
}
