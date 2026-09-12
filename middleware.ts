import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware minimal: apenas faz o rewrite por subdomínio.
 * NÃO importa Supabase — o refresh de sessão é feito nos layouts
 * (Server Components, Node runtime) via lib/supabase/server.ts.
 *
 * Esse split existe porque o Edge runtime da Vercel tem incompatibilidades
 * com algumas versões do @supabase/ssr; deixar o middleware puro elimina
 * MIDDLEWARE_INVOCATION_FAILED sem perder a funcionalidade.
 */
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

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();

  // 1) apex (smdigital.com sem sub) → 308 para https://www.smdigital.com
  if (hostname === ROOT) {
    return NextResponse.redirect(new URL(`https://${ROOT_WWW}${url.pathname}${url.search}`), 308);
  }

  // 2) admin/landing → segue direto, sem rewrite
  if (isAdminHost(hostname)) {
    return NextResponse.next();
  }

  // 3) Subdomínio de cliente: <slug>.<root> → rewrite para /sites/<slug>
  if (isClientHost(hostname)) {
    const sub = hostname.slice(0, -(ROOT.length + 1));
    if (!sub || sub.includes(".") || RESERVED.has(sub)) {
      return NextResponse.next();
    }
    url.pathname = `/sites/${sub}${url.pathname === "/" ? "" : url.pathname}`;
    const res = NextResponse.rewrite(url);
    res.headers.set("x-mini-site-slug", sub);
    return res;
  }

  // 4) qualquer outro host → segue direto
  return NextResponse.next();
}

export const config = {
  matcher: [
    // tudo, exceto arquivos estáticos e _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
