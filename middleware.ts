import { NextResponse, type NextRequest } from "next/server";

const ROOT = "smdigital.com";
const ROOT_WWW = "www." + ROOT;
const RESERVED = new Set(["www", "admin", "api", "cdn", "assets", "static", "app", "mail"]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  // 1) apex (smdigital.com) → redirect to www
  if (hostname === ROOT) {
    return NextResponse.redirect(new URL("https://" + ROOT_WWW + url.pathname + url.search), 308);
  }

  // 2) admin host → passthrough
  if (
    hostname === ROOT_WWW ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".lvh.me")
  ) {
    return NextResponse.next();
  }

  // 3) client subdomain: <slug>.<root> → rewrite to /sites/<slug>
  if (hostname.endsWith("." + ROOT)) {
    const sub = hostname.slice(0, -(ROOT.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) {
      return NextResponse.next();
    }
    url.pathname = "/sites/" + sub + (url.pathname === "/" ? "" : url.pathname);
    const res = NextResponse.rewrite(url);
    res.headers.set("x-mini-site-slug", sub);
    return res;
  }

  // 4) any other host → passthrough
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
