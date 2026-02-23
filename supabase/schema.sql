-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) after creating a project.

-- Brackets: one row per bracket (type: 'bracket' = head-to-head, 'ranked_list' = order the list)
create table if not exists public.brackets (
  id text primary key,
  title text not null,
  options jsonb not null default '[]',
  matchups jsonb not null default '[]',
  type text not null default 'bracket' check (type in ('bracket', 'ranked_list')),
  created_at timestamptz not null default now()
);

-- If you already have the brackets table without type, run this in SQL Editor first:
-- alter table public.brackets add column if not exists type text not null default 'bracket' check (type in ('bracket', 'ranked_list'));

-- Submissions: one row per completed bracket submission
create table if not exists public.submissions (
  id text primary key,
  bracket_id text not null references public.brackets(id) on delete cascade,
  nickname text,
  picks jsonb not null default '[]',
  submitted_at timestamptz not null default now()
);

-- Index for listing submissions by bracket
create index if not exists submissions_bracket_id_idx on public.submissions(bracket_id);

-- Allow anonymous read/write for the app (optional: tighten with RLS later)
alter table public.brackets enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "Allow all on brackets" on public.brackets;
create policy "Allow all on brackets" on public.brackets for all using (true) with check (true);

drop policy if exists "Allow all on submissions" on public.submissions;
create policy "Allow all on submissions" on public.submissions for all using (true) with check (true);
