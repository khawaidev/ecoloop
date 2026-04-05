-- =============================================
-- ECOLOOP DATABASE SCHEMA (SAFE RE-RUN VERSION)
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Profiles table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  location text,
  location_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Drop existing policies first to avoid conflicts
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );
create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );


-- 2. Activities table
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  plastic_types text[],
  plastic_count int default 0,
  weight_kg float default 0,
  impact_text text,
  time_spent_seconds int default 0,
  distance_km float default 0,
  area_covered_sqm float default 0,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.activities enable row level security;

drop policy if exists "Users can view own activities." on activities;
drop policy if exists "Users can insert own activities." on activities;

create policy "Users can view own activities."
  on activities for select using ( auth.uid() = user_id );
create policy "Users can insert own activities."
  on activities for insert with check ( auth.uid() = user_id );


-- 3. Missions table
create table if not exists public.missions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  mission_name text not null,
  mission_description text,
  target_count int default 10,
  current_count int default 0,
  status text default 'active' check (status in ('active', 'completed')),
  time_spent_seconds int default 0,
  distance_km float default 0,
  area_covered_sqm float default 0,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

alter table public.missions enable row level security;

drop policy if exists "Users can view own missions." on missions;
drop policy if exists "Users can insert own missions." on missions;
drop policy if exists "Users can update own missions." on missions;

create policy "Users can view own missions."
  on missions for select using ( auth.uid() = user_id );
create policy "Users can insert own missions."
  on missions for insert with check ( auth.uid() = user_id );
create policy "Users can update own missions."
  on missions for update using ( auth.uid() = user_id );
