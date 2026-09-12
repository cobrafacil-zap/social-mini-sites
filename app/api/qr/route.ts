import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data") ?? "";
  const size = Math.min(Math.max(Number(req.nextUrl.searchParams.get("size") ?? 220), 80), 600);

  if (!data) {
    return NextResponse.json({ error: "missing ?data=" }, { status: 400 });
  }

  const png = await QRCode.toBuffer(data, {
    width: size,
    margin: 1,
    color: { dark: "#145C4B", light: "#FFFFFF" },
  });

  return new NextResponse(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}