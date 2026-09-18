import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Rota de callback para fluxos OAuth, magic links e confirmação de email
 * do Supabase Auth. O Supabase redireciona para cá com ?code=... depois
 * de o usuário confirmar / autenticar. Trocamos o code por sessão e mandamos
 * o usuário para `next` (ou /admin como padrão).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Sem code, ou troca falhou: volta para o login com erro.
  return NextResponse.redirect(new URL("/login?error=1", origin));
}