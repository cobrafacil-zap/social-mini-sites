import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/supabase/database.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID = new Set(["view", "whatsapp", "instagram", "comoChegar", "telefone", "outro"]);

export async function POST(req: NextRequest) {
  let body: { siteId?: string; type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.siteId || !body.type || !VALID.has(body.type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const admin = createServiceClient();
    const { error } = await admin.from("events").insert({
      site_id: body.siteId,
      event_type: body.type as EventRow["event_type"],
    } satisfies Partial<EventRow> as never);
    if (error) {
      console.error("event insert error", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  } catch (e) {
    console.error("event route crashed", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}