import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  // Defaults seguros: se o Supabase não estiver configurado, devolvemos uma
  // resposta neutra e NÃO quebramos o middleware inteiro.
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Sem env vars — a página pública ainda carrega, mas o admin
    // não vai conseguir autenticar até as envs serem configuradas.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL/ANON_KEY ausentes — middleware segue sem refresh de sessão");
    }
    return response;
  }

  try {
    const supabase = createServerClient<Database>(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]),
          );
        },
      },
    });

    // CRÍTICO: getUser() valida o JWT no Supabase (não usar getSession()).
    // Envolvemos em try/catch para nunca quebrar o middleware.
    await supabase.auth.getUser();
  } catch (err) {
    // Não propagamos — isso é o que causa MIDDLEWARE_INVOCATION_FAILED.
    console.error("[supabase] updateSession falhou (seguindo sem refresh):", err);
  }

  return response;
}