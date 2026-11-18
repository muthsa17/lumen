create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  course text,
  deadline date,
  created_at timestamptz not null default now()
);

create table micro_tasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  planned_date date not null,
  is_done boolean not null default false,
  position int not null default 0
);

create index micro_tasks_user_date on micro_tasks (user_id, planned_date);

create type energy_level as enum ('high', 'medium', 'low');

create table energy_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  date date not null,
  level energy_level not null,
  unique (user_id, date)
);

alter table tasks enable row level security;
alter table micro_tasks enable row level security;
alter table energy_checkins enable row level security;

create policy "own rows" on tasks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows" on micro_tasks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "own rows" on energy_checkins for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
