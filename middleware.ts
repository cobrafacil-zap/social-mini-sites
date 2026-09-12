import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";

const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();

// Subdomínios que NUNCA devem ser tratados como slug de cliente
const RESERVED = new Set(["www", "admin", "api", "cdn", "assets", "static", "app", "mail"]);

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  // 1) apex (sem subdomínio) → força https://www.<root>
  if (hostname === ROOT) {
    const target = url.clone();
    target.protocol = "https:";
    target.host = `www.${ROOT}`;
    return NextResponse.redirect(target, 308);
  }

  // 2) admin/landing: www.<root>, localhost, lvh.me → fluxo normal (login + /admin)
  if (
    hostname === `www.${ROOT}` ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".lvh.me")
  ) {
    return updateSession(request);
  }

  // 3) Subdomínio de cliente: <slug>.<root> → reescreve para /sites/<slug>
  if (hostname.endsWith(`.${ROOT}`)) {
    const sub = hostname.slice(0, -(ROOT.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) {
      return updateSession(request);
    }
    const target = url.clone();
    target.pathname = `/sites/${sub}${url.pathname === "/" ? "" : url.pathname}`;
    const res = NextResponse.rewrite(target);
    res.headers.set("x-mini-site-slug", sub);
    return res;
  }

  // 4) Qualquer outro host → admin normal
  return updateSession(request);
}

export const config = {
  matcher: [
    // tudo, exceto arquivos estáticos e _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};