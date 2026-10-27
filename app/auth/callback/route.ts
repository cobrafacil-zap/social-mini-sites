import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Rota de callback para fluxos OAuth, magic links, recuperação de senha e
 * confirmação de email do Supabase Auth. O Supabase redireciona para cá com
 * ?code=... depois de o usuário confirmar / autenticar. Trocamos o code por
 * sessão e mandamos o usuário para `next` (ou /admin como padrão).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requested = searchParams.get("next") ?? "/admin";

  // Só aceitamos caminhos internos — evita usar o callback como redirecionador
  // para outro domínio.
  const safeNext =
    requested.startsWith("/") && !requested.startsWith("//") ? requested : "/admin";

  // Pedido de recuperação de senha feito por esta pessoa neste navegador.
  // O cookie é gravado em requestPasswordReset; o destino final é a tela de
  // criar a nova senha, não o painel.
  const jar = await cookies();
  const recovery = jar.get("ms_recovery")?.value === "1";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = recovery ? "/forgot-password?reset=1" : safeNext;
      const res = NextResponse.redirect(new URL(dest, origin));
      if (recovery) res.cookies.delete("ms_recovery");
      return res;
    }
  }

  // Sem code, ou troca falhou. Na recuperação, volta para pedir um novo link
  // (link expirado / aberto em outro navegador).
  const dest = recovery ? "/forgot-password?expired=1" : "/login?error=1";
  const res = NextResponse.redirect(new URL(dest, origin));
  if (recovery) res.cookies.delete("ms_recovery");
  return res;
}
