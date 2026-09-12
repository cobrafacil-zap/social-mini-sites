# Social Mini Sites

SaaS multi-tenant de mini sites por cliente. Cada cliente tem o próprio **subdomínio** (`slug.smdigital.com`), com painel admin único em `www.smdigital.com`. Stack: **Next.js 15 + TypeScript + Tailwind + Supabase (Postgres + Auth + Storage)**. Deploy na **Vercel** via `git push`.

## Visão geral da arquitetura

```
Host                          → Route
─────────────────────────────────────────────────
smdigital.com                 → 301 → https://www.smdigital.com
www.smdigital.com             → /admin (gate) + /login + /admin/*
villa-italia.smdigital.com    → /sites/villa-italia  ← mini-site público
```

O roteamento por subdomínio acontece em `middleware.ts`, que faz rewrite para `/sites/<slug>`. Cada mini-site é uma linha da tabela `sites` no Supabase. Eventos de clique/view são inseridos via `POST /api/event` (service-role).

## Setup no Supabase

1. Crie um projeto em https://supabase.com.
2. **SQL Editor** → New query → cole o conteúdo de `supabase/migrations/0001_init.sql` → Run.
3. **Authentication → Users → Add user** com e-mail + senha (será o login do admin).
4. **Project Settings → API** → copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ nunca exponha no client

## Setup na Vercel

1. Suba este repositório para o GitHub: `git push origin main`.
2. **Vercel → Add New Project** → importe o repositório. Framework: **Next.js**.
3. **Settings → Environment Variables**, adicione:

   | Nome | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service role key |
   | `NEXT_PUBLIC_ROOT_DOMAIN` | `smdigital.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.smdigital.com` |

4. **Deploy**.

## Configurar o wildcard `*.smdigital.com` (essencial)

Cada cliente vive em `<slug>.smdigital.com`, então o projeto Vercel precisa responder em qualquer subdomínio.

1. **Vercel → projeto → Settings → Domains** → adicione `*.smdigital.com`.
2. A Vercel retorna o alvo (geralmente `cname.vercel-dns.com`).
3. No provedor de DNS de `smdigital.com` (Registro.br, Cloudflare etc.):

   | Tipo | Host | Valor |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `*` | `cname.vercel-dns.com` |

4. Aguarde a propagação (5 min a 24 h). Vercel mostra ✓ verde.

## Primeiro acesso

1. Abra `https://www.smdigital.com/login`.
2. Logue com o e-mail/senha criados no Supabase.
3. Clique em **Criar mini site** → escolha o segmento (Restaurante, Loja, etc.).
4. Preencha os dados, publique.
5. O subdomínio `slug.smdigital.com` passa a responder o mini-site.

## Estrutura

```
app/
  layout.tsx                      # root layout (Inter + Fraunces)
  page.tsx                        # / → /admin
  login/                          # login admin
  (admin)/admin/                  # dashboard, editor, stats, delete (gate auth)
  sites/[slug]/                   # mini-site público (rewrite via middleware)
  api/{event,qr,upload}/         # APIs server-side
components/admin/                 # Editor, Dashboard, Steps, etc.
components/public/MiniSitePublic  # porta do mini-site original
lib/supabase/{client,server,middleware}.ts
lib/actions/{auth,sites}.ts       # server actions
supabase/migrations/0001_init.sql # schema + RLS + storage
middleware.ts                     # rewrite por subdomínio + refresh de sessão
```

## Segurança

- **Auth**: Supabase Auth (e-mail + senha). A senha hardcoded `admin123` do projeto original foi removida.
- **RLS**: público só lê sites com `status = 'published'`. Eventos só são inseridos via `service_role` em `/api/event`. Storage público para a galeria (necessário para o iframe e o `<img>` do mini-site).
- **Service role key**: NUNCA prefixe com `NEXT_PUBLIC_`. Está isolada em `lib/supabase/server.ts` (apenas funções server-side usam).

## Limites atuais / próximos passos

- Agregação de stats é client-side, cap em 5.000 eventos por site. Para volumes maiores, criar uma função RPC `stats_for_site(site_id uuid)`.
- Single-admin: qualquer usuário autenticado é admin. Para multi-admin, adicionar coluna `role` e ajustar as policies.
- Imagens vão para o bucket `gallery` com limite de 4 MB por arquivo (Vercel route handler).
- QR codes são gerados server-side em `/api/qr` — substitui o `api.qrserver.com` do projeto original.

## Troubleshooting

### `500: INTERNAL_SERVER_ERROR` / `MIDDLEWARE_INVOCATION_FAILED`

A Vercel mostra isso quando o **módulo do middleware** falha ao carregar — não dá para capturar com try/catch porque acontece antes do request handler rodar. As causas mais comuns em Next 15:

1. **CJS/ESM mismatch**: o Next 15 compila o middleware como ESM, mas a Vercel carrega via `___next_launcher.cjs` (CJS). Sintoma no log do function: `Cannot use import statement outside a module`. Fix: `"type": "module"` em `package.json`.
2. **`@supabase/ssr` antigo**: 0.5.x referencia `__dirname` que não existe no Edge. Fix: bumpar para 0.6.1+.
3. **Build em cache**: a Vercel pode estar servindo um build antigo. Vá em **Project Settings → General → Build & Development Settings → Clear Build Cache**, depois **Deployments → ⋯ → Redeploy**.

Antes de tentar qualquer outro fix, faça o passo 3 — resolve 90% dos casos onde "já tentei tudo e continua o mesmo erro".

### Apex `smdigital.com` dá erro de certificado

O apex precisa de um registro A (`76.76.21.21`) e o wildcard `*.smdigital.com` precisa de CNAME. Se você configurou só o wildcard, o apex fica sem cert. Adicione `smdigital.com` (sem `www`) também em **Vercel → Domains** — Vercel emite o cert automaticamente.

### O subdomínio do cliente abre 404

Confirme que o site está com `status = 'published'` no Supabase (o RLS esconde `draft` do público). Use o SQL Editor:

```sql
select slug, status from sites;
```

## Desenvolvimento local

Como os subdomínios precisam funcionar localmente, use `lvh.me` (resolve para `127.0.0.1`):

```bash
NEXT_PUBLIC_ROOT_DOMAIN=lvh.me:3000 npm run dev
# http://villa-italia.lvh.me:3000
```

> Não esqueça de setar as env vars em `.env.local` (copie de `.env.example`).