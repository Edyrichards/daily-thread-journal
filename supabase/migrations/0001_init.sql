-- Threads of Grace — Supabase schema (auth, sync, community) with row-level security.
-- Run in the Supabase SQL editor (or `supabase db push`).

-- =============================== profiles ===============================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select using (true);
drop policy if exists "manage own profile" on public.profiles;
create policy "manage own profile" on public.profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ========================= private synced data =========================
create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date text,
  content text,
  mood text,
  verse jsonb,
  reflection text,
  created_at bigint,
  updated_at bigint default (extract(epoch from now()) * 1000)::bigint,
  deleted boolean default false
);
alter table public.journal_entries enable row level security;
drop policy if exists "own journal" on public.journal_entries;
create policy "own journal" on public.journal_entries for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists journal_entries_user_idx on public.journal_entries(user_id);

create table if not exists public.prayers (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text,
  status text,
  prayed_count int default 0,
  last_prayed_at bigint,
  answered_at bigint,
  answer_note text,
  created_at bigint,
  updated_at bigint default (extract(epoch from now()) * 1000)::bigint,
  deleted boolean default false
);
alter table public.prayers enable row level security;
drop policy if exists "own prayers" on public.prayers;
create policy "own prayers" on public.prayers for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists prayers_user_idx on public.prayers(user_id);

-- ====================== community prayer wall (UGC) =====================
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  text text not null check (char_length(text) between 1 and 1000),
  is_anonymous boolean default false,
  pray_count int default 0,
  is_hidden boolean default false,
  created_at timestamptz default now()
);
alter table public.prayer_requests enable row level security;
drop policy if exists "wall readable" on public.prayer_requests;
create policy "wall readable" on public.prayer_requests for select
  using (auth.role() = 'authenticated' and is_hidden = false);
drop policy if exists "insert own request" on public.prayer_requests;
create policy "insert own request" on public.prayer_requests for insert
  with check (auth.uid() = user_id);
drop policy if exists "update own request" on public.prayer_requests;
create policy "update own request" on public.prayer_requests for update
  using (auth.uid() = user_id);
drop policy if exists "delete own request" on public.prayer_requests;
create policy "delete own request" on public.prayer_requests for delete
  using (auth.uid() = user_id);
create index if not exists prayer_requests_created_idx on public.prayer_requests(created_at desc);

-- one "I prayed" per user per request
create table if not exists public.prayer_request_prayers (
  request_id uuid references public.prayer_requests(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (request_id, user_id)
);
alter table public.prayer_request_prayers enable row level security;
drop policy if exists "prayers readable" on public.prayer_request_prayers;
create policy "prayers readable" on public.prayer_request_prayers for select
  using (auth.role() = 'authenticated');
drop policy if exists "insert own pray" on public.prayer_request_prayers;
create policy "insert own pray" on public.prayer_request_prayers for insert
  with check (auth.uid() = user_id);
drop policy if exists "delete own pray" on public.prayer_request_prayers;
create policy "delete own pray" on public.prayer_request_prayers for delete
  using (auth.uid() = user_id);

-- maintain pray_count automatically
create or replace function public.bump_pray_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.prayer_requests set pray_count = pray_count + 1 where id = new.request_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.prayer_requests set pray_count = greatest(0, pray_count - 1) where id = old.request_id;
    return old;
  end if;
  return null;
end; $$;
drop trigger if exists trg_pray_count on public.prayer_request_prayers;
create trigger trg_pray_count
  after insert or delete on public.prayer_request_prayers
  for each row execute function public.bump_pray_count();

-- ============================ moderation =============================
-- Play requires UGC reporting. A request auto-hides after 3 distinct reports.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  request_id uuid references public.prayer_requests(id) on delete cascade,
  reason text,
  created_at timestamptz default now(),
  unique (reporter_id, request_id)
);
alter table public.reports enable row level security;
drop policy if exists "insert own report" on public.reports;
create policy "insert own report" on public.reports for insert
  with check (auth.uid() = reporter_id);

create or replace function public.auto_hide_reported()
returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from public.reports where request_id = new.request_id;
  if n >= 3 then
    update public.prayer_requests set is_hidden = true where id = new.request_id;
  end if;
  return new;
end; $$;
drop trigger if exists trg_auto_hide on public.reports;
create trigger trg_auto_hide
  after insert on public.reports for each row execute function public.auto_hide_reported();
