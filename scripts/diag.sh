#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# diag.sh — captura erros de build (Vercel) e de runtime/banco (Supabase)
#
# Uso:
#   ./scripts/diag.sh build        # deploys + erros de compilacao
#   ./scripts/diag.sh db           # schema, RLS, eventos (Supabase)
#   ./scripts/diag.sh site <slug>  # diagnostico de um mini site publicado
#   ./scripts/diag.sh all
#
# Credenciais em .env.local (ja coberto pelo .gitignore):
#   VERCEL_TOKEN=...            obrigatorio para `build`
#   VERCEL_PROJECT=social-mini-sites   opcional
#   VERCEL_TEAM_SLUG=equipesocialmktdigital-1894s   opcional
#   SUPABASE_ACCESS_TOKEN=...   obrigatorio para `db` / `site`
#   NEXT_PUBLIC_ROOT_DOMAIN=smdigtal.com            opcional
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=".env.local"
[ -f "$ENV_FILE" ] || { echo "ERRO: $ENV_FILE nao encontrado."; exit 1; }
set -a; . "./$ENV_FILE"; set +a

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GRN=$'\033[32m'; YLW=$'\033[33m'; RST=$'\033[0m'
say()  { printf '%s\n' "$*"; }
head_() { printf '\n%s%s%s\n' "$BOLD" "$*" "$RST"; }
ok()   { printf '%s✔%s %s\n' "$GRN" "$RST" "$*"; }
bad()  { printf '%s✘%s %s\n' "$RED" "$RST" "$*"; }
warn() { printf '%s!%s %s\n' "$YLW" "$RST" "$*"; }

# ============================== VERCEL =====================================
V_API="https://api.vercel.com"

vget() { curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" "$V_API$1"; }

vercel_whoami() {
  [ -n "${VERCEL_TOKEN:-}" ] || { bad "VERCEL_TOKEN ausente em $ENV_FILE"; return 1; }
  local r; r=$(vget "/v2/user")
  echo "$r" | jq -e '.user.email' >/dev/null 2>&1 \
    && ok "Vercel: conectado como $(echo "$r" | jq -r '.user.email')" \
    || { bad "Vercel: token invalido"; echo "$r" | jq -r '.error.message' 2>/dev/null; return 1; }
}

# teamId e opcional; se passar VERCEL_TEAM_SLUG (ex.: equipesocialmktdigital-1894s),
# resolvemos o id via API para nao precisar colar nada alem do token.
vercel_team() {
  [ -n "${VERCEL_TEAM_ID:-}" ] && { echo "$VERCEL_TEAM_ID"; return; }
  [ -n "${VERCEL_TEAM_SLUG:-}" ] || return 0
  vget "/v2/teams?limit=50" | jq -r --arg s "$VERCEL_TEAM_SLUG" \
    '.teams[]? | select(.slug==$s) | .id' | head -1
}

vercel_project() {
  local name="${VERCEL_PROJECT:-social-mini-sites}" tid="$1"
  local q="/v9/projects?limit=100"
  [ -n "$tid" ] && q="$q&teamId=$tid"
  vget "$q" | jq -r --arg n "$name" '.projects[]? | select(.name==$n) | .id' | head -1
}

cmd_build() {
  head_ "BUILD — Vercel"
  vercel_whoami || return 1

  local tid; tid=$(vercel_team)
  local proj; proj=$(vercel_project "$tid")
  [ -n "$proj" ] || { bad "Projeto '${VERCEL_PROJECT:-social-mini-sites}' nao encontrado. Ajuste VERCEL_PROJECT ou VERCEL_TEAM_SLUG."; return 1; }
  ok "Projeto ${VERCEL_PROJECT:-social-mini-sites} -> $proj"

  local q="/v6/deployments?projectId=$proj&limit=8"
  [ -n "$tid" ] && q="$q&teamId=$tid"
  local deps; deps=$(vget "$q")
  echo "$deps" | jq -e '.deployments' >/dev/null 2>&1 || { bad "nao listei deployments"; echo "$deps" | jq -r '.error.message' 2>/dev/null; return 1; }

  say ""
  say "${DIM}SHA       ESTADO      QUANDO                 URL${RST}"
  echo "$deps" | jq -r '.deployments[]? | [ (.meta.githubCommitSha // "-")[0:7], (.state // "-"), ((.created // 0)|tostring), (.url // "-") ] | @tsv' \
  | while IFS=$'\t' read -r sha state ts url; do
      when=$(python3 -c "import datetime,sys;print(datetime.datetime.fromtimestamp(int(sys.argv[1])/1000).strftime('%d/%m %H:%M'))" "$ts" 2>/dev/null || echo "-")
      case "$state" in
        ERROR) col="$RED";; BUILDING|QUEUED) col="$YLW";; READY) col="$GRN";; *) col="$DIM";;
      esac
      printf '%s%s%s  %s%-9s%s  %s  %s\n' "$DIM" "$sha" "$RST" "$col" "$state" "$RST" "$when" "$url"
    done

  local did; did=$(echo "$deps" | jq -r '[.deployments[]? | select(.state=="ERROR")] | first | .uid // empty')
  [ -n "$did" ] || { ok "Nenhum deploy em ERROR — build mais recente passou."; return 0; }

  head_ "ERROS DE COMPILACAO (deploy $did)"
  # v3 devolve array plano de eventos; cada um tem .text
  local ev="/v3/deployments/$did/events?builds=1&logs=1&limit=800"
  [ -n "$tid" ] && ev="$ev&teamId=$tid"
  vget "$ev" > /tmp/_v_events.json
  local clean
  clean=$(jq -r '.[].text // empty' /tmp/_v_events.json 2>/dev/null | sed 's/\x1b\[[0-9;]*m//g')

  if [ -z "$clean" ]; then
    warn "payload sem eventos (deploy pode ter expirado o log)"
    return 0
  fi

  say ""
  printf '%s\n' "$clean" | grep -aE 'Type error|Failed to compile|error TS[0-9]+|Module not found|Cannot find (name|module)|does not exist on type|is not assignable to|requires parens|Attempted import' \
    | sed 's/^/  /' | tail -20

  say "\n${DIM}Contexto do log:${RST}"
  printf '%s\n' "$clean" | grep -av '^\s*$' | tail -22 | sed 's/^/  /'
}

# ============================= SUPABASE ====================================
supa_who() {
  [ -n "${SUPABASE_ACCESS_TOKEN:-}" ] || { bad "SUPABASE_ACCESS_TOKEN ausente"; return 1; }
  local r; r=$(curl -sS -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        "https://api.supabase.com/v1/projects")
  echo "$r" | jq -e 'type=="array"' >/dev/null 2>&1 \
    && ok "Supabase: Management API ok" \
    || { bad "Supabase: token invalido"; echo "$r" | jq -r '.message // .error_description' 2>/dev/null; return 1; }
}

supa_ref() {
  if [ -n "${SUPABASE_PROJECT_REF:-}" ]; then echo "$SUPABASE_PROJECT_REF"; return; fi
  curl -sS -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" "https://api.supabase.com/v1/projects" \
    | jq -r '.[0].id'
}

supa_sql() {
  local ref="$1" sql="$2"
  [ -n "${SUPABASE_ACCESS_TOKEN:-}" ] || { bad "SUPABASE_ACCESS_TOKEN ausente"; return 1; }
  curl -sS -X POST "https://api.supabase.com/v1/projects/$ref/database/query" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg q "$sql" '{query:$q}')"
}

cmd_db() {
  head_ "BANCO — Supabase"
  supa_who || return 1
  local ref; ref=$(supa_ref); [ -n "$ref" ] || { bad "project ref nao resolvido"; return 1; }
  ok "Projeto: $ref"

  head_ "sites por status"
  supa_sql "$ref" "select status, count(*)::int as total from public.sites group by status order by 2 desc" \
    | jq -r 'if type=="array" then .[] | "  \(.status): \(.total)" else . end'

  head_ "layout de cada site"
  supa_sql "$ref" "select slug, status, template, coalesce(customization->>'layout','(fallback)') as layout, updated_at::date as atualizado from public.sites order by updated_at desc limit 20" \
    | jq -r 'if type=="array" then (.[] | "  \(.slug)\t\(.status)\t\(.template)\t\(.layout)\t\(.atualizado)") else . end'

  head_ "eventos (ultimos 7 dias)"
  supa_sql "$ref" "select event_type, count(*)::int as total from public.events where created_at > now() - interval '7 days' group by 1 order by 2 desc" \
    | jq -r 'if type=="array" then (.[] | "  \(.event_type): \(.total)") else . end'

  head_ "total de eventos (cap de 5000 por consulta)"
  supa_sql "$ref" "select count(*)::int as total, min(created_at)::date as de, max(created_at)::date as ate from public.events" \
    | jq -r 'if type=="array" then (.[] | "  total=\(.total)  periodo=\(.de) .. \(.ate)") else . end'

  head_ "policies RLS ativas"
  supa_sql "$ref" "select tablename, policyname, cmd from pg_policies where schemaname='public' order by tablename, policyname" \
    | jq -r 'if type=="array" then (.[] | "  \(.tablename)\t\(.policyname)\t\(.cmd)") else . end'
}

# ========================== MINI SITE PÚBLICO ===============================
cmd_site() {
  local slug="${1:?informe o slug}"
  local root="${NEXT_PUBLIC_ROOT_DOMAIN:-smdigtal.com}"
  head_ "MINI SITE — $slug.$root"

  say "${DIM}DNS${RST}"
  host "$slug.$root" 2>/dev/null | sed 's/^/  /' || warn "dig indisponivel"
  printf '\n'
  if command -v dig >/dev/null; then
    printf "  A: %s\n" "$(dig +short A "$slug.$root" | tr '\n' ' ')"
    printf "  CNAME: %s\n" "$(dig +short CNAME "$slug.$root" | tr '\n' ' ')"
  fi

  say "\n${DIM}HTTP${RST}"
  curl -sS -o /dev/null -w '  status=%{http_code} redirect=%{redirect_url} tls=%{ssl_verify_result}\n' \
    "https://$slug.$root/" 2>&1 | sed 's/^/ /'

  say "\n${DIM}TRACKING DE EVENTOS${RST}"
  local sid; sid=$(supa_sql "$(supa_ref)" \
      "select id from public.sites where slug='$slug' limit 1" 2>/dev/null | jq -r '.[0].id // empty')
  if [ -n "$sid" ]; then
    curl -sS -X POST "https://$slug.$root/api/event" -H 'Content-Type: application/json' \
      -d "{\"siteId\":\"$sid\",\"type\":\"view\"}" | jq -c . 2>/dev/null | sed 's/^/  resposta: /'
    say "  ${DIM}(se nao retornar {\"ok\":true} o tracking esta quebrado)${RST}"
  else
    warn "site nao encontrado no banco (slug='$slug')"
  fi
}

case "${1:-all}" in
  build) cmd_build ;;
  db)    cmd_db ;;
  site)  shift; cmd_site "${1:-}" ;;
  all)   cmd_build; cmd_db ;;
  *)     say "uso: $0 {build|db|site <slug>|all}"; exit 1 ;;
esac