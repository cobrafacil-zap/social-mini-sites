import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing file" }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Arquivo maior que 4 MB" }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: `Tipo não permitido: ${file.type}` }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${user.id}/${nanoid(10)}.${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from("gallery").upload(path, buf, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("upload error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);
  return NextResponse.json({ url: pub.publicUrl });
}