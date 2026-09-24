import { NextResponse, type NextRequest } from "next/server";

const ROOTS = ["smdigtal.com", "smdigital.com"];
const RESERVED = new Set(["www", "admin", "api", "cdn", "assets", "static", "app", "mail"]);

function rootFor(hostname: string): string | null {
  for (const r of ROOTS) {
    if (hostname === r || hostname.endsWith("." + r)) return r;
  }
  // também respeita env se for outro domínio
  const envRoot = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "").toLowerCase().replace(/^www\./, "").split(":")[0];
  if (envRoot && (hostname === envRoot || hostname.endsWith("." + envRoot))) return envRoot;
  return null;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  const root = rootFor(hostname);

  // 1) apex (smdigtal.com / smdigital.com) → redirect to www
  if (root && hostname === root) {
    return NextResponse.redirect(new URL("https://www." + root + url.pathname + url.search), 308);
  }

  // 2) admin host → passthrough
  if (
    (root && hostname === "www." + root) ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".lvh.me")
  ) {
    return NextResponse.next();
  }

  // 3) client subdomain: <slug>.<root> → rewrite to /sites/<slug>
  if (root && hostname.endsWith("." + root)) {
    const sub = hostname.slice(0, -(root.length + 1));
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
