-- =============================================================
-- Social Mini Sites — schema inicial
-- Rode este arquivo no Supabase → SQL Editor → New query → Run
-- =============================================================

create extension if not exists "pgcrypto";

-- =============================================================
-- Tabela principal: 1 linha por mini-site
-- =============================================================
create table if not exists public.sites (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  status        text not null default 'draft'
                check (status in ('draft','published','disabled')),
  template      text not null
                check (template in ('restaurante','loja','servicos','profissional')),

  company       jsonb not null default '{}'::jsonb,
  location      jsonb not null default '{}'::jsonb,
  hours         jsonb not null default '{}'::jsonb,
  gallery       jsonb not null default '[]'::jsonb,
  buttons       jsonb not null default '[]'::jsonb,
  customization jsonb not null default '{}'::jsonb,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  company_name  text generated always as (company->>'name') stored
);

create index if not exists sites_slug_idx on public.sites (slug);
create index if not exists sites_status_idx on public.sites (status);

-- =============================================================
-- Eventos (cliques e views) — uma linha por evento
-- =============================================================
create table if not exists public.events (
  id          bigserial primary key,
  site_id     uuid not null references public.sites(id) on delete cascade,
  event_type  text not null
              check (event_type in ('view','whatsapp','instagram','comoChegar','telefone','outro')),
  created_at  timestamptz not null default now()
);

create index if not exists events_site_type_idx
  on public.events (site_id, event_type, created_at);

-- =============================================================
-- Trigger: atualiza updated_at a cada UPDATE
-- =============================================================
create or replace function public.touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sites_touch_updated_at on public.sites;
create trigger sites_touch_updated_at
  before update on public.sites
  for each row execute function public.touch_updated_at();

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.sites enable row level security;
alter table public.events enable row level security;

-- limpa policies existentes (idempotente)
drop policy if exists "sites: public read published" on public.sites;
drop policy if exists "sites: admin all" on public.sites;
drop policy if exists "events: admin read" on public.events;

-- público lê só sites publicados
create policy "sites: public read published"
  on public.sites for select to anon, authenticated
  using (status = 'published');

-- admin (qualquer usuário autenticado) tem acesso total
create policy "sites: admin all"
  on public.sites for all to authenticated
  using (true) with check (true);

-- admin lê eventos (insert acontece via service-role em /api/event)
create policy "events: admin read"
  on public.events for select to authenticated
  using (true);

-- =============================================================
-- Storage: bucket 'gallery' para fotos da galeria
-- =============================================================
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "gallery: public read"  on storage.objects;
drop policy if exists "gallery: admin insert" on storage.objects;
drop policy if exists "gallery: admin delete" on storage.objects;
drop policy if exists "gallery: admin update" on storage.objects;

create policy "gallery: public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gallery');

create policy "gallery: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "gallery: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery');

create policy "gallery: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');

-- =============================================================
-- (Opcional) View materializada para estatísticas futuras
-- =============================================================
create or replace view public.event_daily as
  select
    site_id,
    event_type,
    created_at::date as day,
    count(*)         as total
  from public.events
  group by site_id, event_type, created_at::date;