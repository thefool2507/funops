-- FunOps Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  category text not null default 'other' check (category in ('work', 'personal', 'health', 'learning', 'other')),
  tags text[] default '{}',
  due_date date,
  estimated_minutes integer,
  actual_minutes integer,
  completed_at timestamptz,
  order_index integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Pomodoro sessions table
create table public.pomodoro_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete cascade not null,
  duration_minutes integer not null default 25,
  completed_at timestamptz default now() not null
);

-- User preferences table
create table public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  theme text default 'dark',
  pomodoro_duration integer default 25,
  short_break integer default 5,
  long_break integer default 15,
  default_view text default 'kanban',
  notification_enabled boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.tasks enable row level security;
alter table public.pomodoro_sessions enable row level security;
alter table public.user_preferences enable row level security;

-- RLS Policies for tasks
create policy "Users can view own tasks" on public.tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert own tasks" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update own tasks" on public.tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete own tasks" on public.tasks
  for delete using (auth.uid() = user_id);

-- RLS Policies for pomodoro_sessions
create policy "Users can view own sessions" on public.pomodoro_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on public.pomodoro_sessions
  for insert with check (auth.uid() = user_id);

-- RLS Policies for user_preferences
create policy "Users can manage own preferences" on public.user_preferences
  for all using (auth.uid() = user_id);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_tasks_updated
  before update on public.tasks
  for each row execute procedure public.handle_updated_at();

create trigger on_preferences_updated
  before update on public.user_preferences
  for each row execute procedure public.handle_updated_at();

-- Function to get task analytics
create or replace function public.get_task_analytics(p_user_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total', count(*),
    'completed', count(*) filter (where status = 'done'),
    'in_progress', count(*) filter (where status = 'in_progress'),
    'todo', count(*) filter (where status = 'todo'),
    'tasks_today', count(*) filter (where date(created_at) = current_date),
    'completed_today', count(*) filter (where status = 'done' and date(completed_at) = current_date),
    'overdue', count(*) filter (where due_date < current_date and status != 'done')
  )
  into result
  from public.tasks
  where user_id = p_user_id;
  
  return result;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_due_date on public.tasks(due_date);
create index idx_tasks_priority on public.tasks(priority);
create index idx_pomodoro_user_id on public.pomodoro_sessions(user_id);
create index idx_pomodoro_task_id on public.pomodoro_sessions(task_id);
