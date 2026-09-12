import { createServerClient } from "@supabase/ssr";
import { createClient as createSbClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 * IMPORTANTE: sempre chame awaited cookies() no Next 15.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
            });
          } catch {
            // setAll a partir de um Server Component (read-only) — ignore.
          }
        },
      },
    },
  );
}

/**
 * Cliente com service role — APENAS para código server-side que precisa
 * ignorar RLS (ex.: /api/event). NUNCA importe em qualquer arquivo que seja
 * reachable pelo client.
 */
export function createServiceClient() {
  return createSbClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}