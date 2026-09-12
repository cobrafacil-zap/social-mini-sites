import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/update-session";

const ROOT = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();
const ROOT_WWW = `www.${ROOT}`;

// Subdomínios que NUNCA devem ser tratados como slug de cliente
const RESERVED = new Set(["www", "admin", "api", "cdn", "assets", "static", "app", "mail"]);

function isAdminHost(hostname: string): boolean {
  return (
    hostname === ROOT_WWW ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".lvh.me")
  );
}

function isClientHost(hostname: string): boolean {
  return hostname.endsWith(`.${ROOT}`);
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  // 1) apex (sem subdomínio) → força https://www.<root>
  if (hostname === ROOT) {
    return NextResponse.redirect(new URL(`https://${ROOT_WWW}${url.pathname}${url.search}`), 308);
  }

  // 2) admin/landing → fluxo normal (login + /admin)
  if (isAdminHost(hostname)) {
    return updateSession(request);
  }

  // 3) Subdomínio de cliente: <slug>.<root> → reescreve para /sites/<slug>
  if (isClientHost(hostname)) {
    const sub = hostname.slice(0, -(ROOT.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) {
      return updateSession(request);
    }
    url.pathname = `/sites/${sub}${url.pathname === "/" ? "" : url.pathname}`;
    const res = NextResponse.rewrite(url);
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