-- 0002: kolom tugas baru, durasi langkah, riwayat sesi fokus, bucket avatars.
-- Additive: data lama tetap valid. Aman dijalankan ulang.

alter table tasks
  add column if not exists category text not null default 'lainnya'
    check (category in ('belajar', 'skripsi', 'pekerjaan', 'kreatif', 'pribadi', 'lainnya')),
  add column if not exists priority text not null default 'santai'
    check (priority in ('santai', 'penting', 'mendesak')),
  add column if not exists notes text,
  add column if not exists status text not null default 'active'
    check (status in ('draft', 'active'));

-- NOT VALID: baris lama yang judulnya lebih panjang tidak ikut diperiksa.
alter table tasks drop constraint if exists tasks_title_len;
alter table tasks add constraint tasks_title_len check (char_length(title) <= 60) not valid;

alter table micro_tasks
  add column if not exists minutes int not null default 15
    check (minutes between 1 and 180),
  add column if not exists done_at timestamptz;

create table if not exists focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  micro_task_id uuid references micro_tasks(id) on delete set null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  minutes int not null check (minutes > 0)
);

create index if not exists focus_sessions_user_started on focus_sessions (user_id, started_at);

alter table focus_sessions enable row level security;

drop policy if exists "own rows" on focus_sessions;
create policy "own rows" on focus_sessions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Bucket publik: file dibaca lewat URL publik, jadi tidak ada policy select.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/jpeg', 'image/gif', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars insert own folder" on storage.objects;
create policy "avatars insert own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "avatars update own folder" on storage.objects;
create policy "avatars update own folder" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "avatars delete own folder" on storage.objects;
create policy "avatars delete own folder" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Rollback (jalankan manual). Bucket tidak bisa dihapus lewat SQL (Supabase memblokirnya):
-- kosongkan lalu hapus bucket `avatars` di dashboard Storage setelah baris ini.
-- drop policy if exists "avatars delete own folder" on storage.objects;
-- drop policy if exists "avatars update own folder" on storage.objects;
-- drop policy if exists "avatars insert own folder" on storage.objects;
-- drop table if exists focus_sessions;
-- alter table micro_tasks drop column if exists done_at, drop column if exists minutes;
-- alter table tasks drop constraint if exists tasks_title_len;
-- alter table tasks drop column if exists status, drop column if exists notes,
--   drop column if exists priority, drop column if exists category;
