create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  branch text not null,
  year smallint not null check (year between 1 and 4),
  subjects text[] not null default '{}'::text[],
  phone_number text not null,
  google_email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  subject text not null default '',
  due_at timestamptz not null,
  reminder_at timestamptz not null,
  add_to_calendar boolean not null default false,
  priority text not null check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.placement_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  notes text not null default '',
  type text not null check (type in ('company', 'assessment', 'mock-interview', 'resource')),
  due_at timestamptz,
  reminder_at timestamptz,
  add_to_calendar boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  subject text not null,
  branch text not null,
  year smallint not null check (year between 1 and 4),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (group_id, profile_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.study_groups(id) on delete cascade,
  agenda text not null,
  topic text not null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes between 15 and 480),
  availability text not null,
  add_to_calendar boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  module_key text not null,
  entity_id uuid not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null check (status in ('queued', 'sent', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_profile_due on public.tasks (profile_id, due_at);
create index if not exists idx_sessions_group_time on public.study_sessions (group_id, scheduled_at);
create index if not exists idx_automation_logs_event_time on public.automation_logs (event_type, created_at desc);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.placement_items enable row level security;
alter table public.study_groups enable row level security;
alter table public.study_group_members enable row level security;
alter table public.study_sessions enable row level security;
alter table public.automation_logs enable row level security;

create policy "profiles owner access" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "tasks owner access" on public.tasks for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "placement items owner access" on public.placement_items for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "study groups owner access" on public.study_groups for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "study group members self access" on public.study_group_members for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "study sessions access via group membership" on public.study_sessions for all using (exists (select 1 from public.study_group_members members where members.group_id = study_sessions.group_id and members.profile_id = auth.uid())) with check (exists (select 1 from public.study_group_members members where members.group_id = study_sessions.group_id and members.profile_id = auth.uid()));
create policy "automation logs owner access" on public.automation_logs for select using (true);