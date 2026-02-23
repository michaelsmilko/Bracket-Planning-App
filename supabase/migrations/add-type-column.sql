-- Run this in Supabase → SQL Editor if you get:
-- "Could not find the 'type' column of 'brackets' in the schema cache"
-- (You have an existing brackets table from before ranked list was added.)

alter table public.brackets
  add column if not exists type text not null default 'bracket'
  check (type in ('bracket', 'ranked_list'));
