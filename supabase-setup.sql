-- AFTR. private memory archive
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  file_path text not null,
  media_type text not null,
  created_at timestamptz not null default now()
);
alter table public.memories enable row level security;

drop policy if exists "Users can read their own memories" on public.memories;
create policy "Users can read their own memories" on public.memories for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can add their own memories" on public.memories;
create policy "Users can add their own memories" on public.memories for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own memories" on public.memories;
create policy "Users can delete their own memories" on public.memories for delete to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can update their own memories" on public.memories;
create policy "Users can update their own memories" on public.memories for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('aftr-memories', 'aftr-memories', false)
on conflict (id) do nothing;

drop policy if exists "Users can read their own files" on storage.objects;
create policy "Users can read their own files" on storage.objects for select to authenticated using (bucket_id = 'aftr-memories' and (storage.foldername(name))[1] = (auth.uid())::text);
drop policy if exists "Users can upload their own files" on storage.objects;
create policy "Users can upload their own files" on storage.objects for insert to authenticated with check (bucket_id = 'aftr-memories' and (storage.foldername(name))[1] = (auth.uid())::text);
drop policy if exists "Users can delete their own files" on storage.objects;
create policy "Users can delete their own files" on storage.objects for delete to authenticated using (bucket_id = 'aftr-memories' and (storage.foldername(name))[1] = (auth.uid())::text);
