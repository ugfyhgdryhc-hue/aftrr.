-- AFTR. 2.0 migration: run once in Supabase SQL Editor after the original setup.
alter table public.memories add column if not exists description text not null default '';
alter table public.memories add column if not exists emoji text not null default '🤍';
alter table public.memories add column if not exists tags text[] not null default '{}';
alter table public.memories add column if not exists frame text not null default 'none';
create index if not exists memories_user_created_idx on public.memories (user_id, created_at desc);
