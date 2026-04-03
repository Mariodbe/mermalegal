-- ============================================================
-- MermaLegal - Schema SQL
-- Ley 1/2025 Food Waste Compliance Platform
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Enums ──

create type plan_tier as enum ('free', 'pro', 'enterprise');
create type waste_category as enum ('bakery', 'protein', 'dairy', 'produce', 'prepared', 'other');
create type waste_destination as enum ('donation', 'compost', 'animal_feed', 'destruction');
create type location_type as enum ('restaurant', 'hotel', 'catering', 'bar');
create type plan_status as enum ('draft', 'complete');

-- ── Profiles ──

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan plan_tier not null default 'free',
  company_name text,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Locations ──

create table locations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  address text not null,
  type location_type not null default 'restaurant',
  created_at timestamptz not null default now()
);

alter table locations enable row level security;

create policy "Users can view own locations"
  on locations for select
  using (auth.uid() = user_id);

create policy "Users can insert own locations"
  on locations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own locations"
  on locations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own locations"
  on locations for delete
  using (auth.uid() = user_id);

-- ── Waste Entries ──

create table waste_entries (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid not null references locations(id) on delete cascade,
  category waste_category not null,
  weight_kg numeric(8,2) not null check (weight_kg > 0),
  destination waste_destination not null,
  notes text,
  recorded_by text not null,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table waste_entries enable row level security;

create policy "Users can view waste entries for own locations"
  on waste_entries for select
  using (
    exists (
      select 1 from locations
      where locations.id = waste_entries.location_id
      and locations.user_id = auth.uid()
    )
  );

create policy "Users can insert waste entries for own locations"
  on waste_entries for insert
  with check (
    exists (
      select 1 from locations
      where locations.id = waste_entries.location_id
      and locations.user_id = auth.uid()
    )
  );

create policy "Users can delete waste entries for own locations"
  on waste_entries for delete
  using (
    exists (
      select 1 from locations
      where locations.id = waste_entries.location_id
      and locations.user_id = auth.uid()
    )
  );

-- Index for performance on date-range queries
create index idx_waste_entries_location_date
  on waste_entries (location_id, recorded_at desc);

-- ── Prevention Plans ──

create table prevention_plans (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid not null references locations(id) on delete cascade,
  status plan_status not null default 'draft',
  company_name text,
  responsible_name text,
  responsible_role text,
  waste_types waste_category[] default '{}',
  measures text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table prevention_plans enable row level security;

create policy "Users can view own prevention plans"
  on prevention_plans for select
  using (
    exists (
      select 1 from locations
      where locations.id = prevention_plans.location_id
      and locations.user_id = auth.uid()
    )
  );

create policy "Users can insert prevention plans for own locations"
  on prevention_plans for insert
  with check (
    exists (
      select 1 from locations
      where locations.id = prevention_plans.location_id
      and locations.user_id = auth.uid()
    )
  );

create policy "Users can update own prevention plans"
  on prevention_plans for update
  using (
    exists (
      select 1 from locations
      where locations.id = prevention_plans.location_id
      and locations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from locations
      where locations.id = prevention_plans.location_id
      and locations.user_id = auth.uid()
    )
  );

-- ── Auto-create profile on user signup ──

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'company_name', null)
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Updated_at trigger ──

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function public.set_updated_at();

create trigger set_prevention_plans_updated_at
  before update on prevention_plans
  for each row execute function public.set_updated_at();

-- ── Storage bucket for plan documents (optional) ──

insert into storage.buckets (id, name, public)
values ('plan-documents', 'plan-documents', false)
on conflict do nothing;

create policy "Users can upload plan documents"
  on storage.objects for insert
  with check (
    bucket_id = 'plan-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own plan documents"
  on storage.objects for select
  using (
    bucket_id = 'plan-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
