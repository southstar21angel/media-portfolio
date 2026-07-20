-- MIRKAZIM MEDIA - Database Schema Migration

-- =========================================================================
-- SAFE SCHEMA MIGRATION (Non-destructive, safe to run anytime)
-- =========================================================================

-- 1. Create table (if not exists)
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title_az text not null,
  title_ru text not null,
  description_az text,
  description_ru text,
  thumbnail text,
  images text[] default '{}',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 2. Add video_url column if it doesn't exist (safe migration)
alter table projects add column if not exists video_url text;

-- 3. Drop removed columns if they exist (safe migration)
alter table projects drop column if exists category_az;
alter table projects drop column if exists category_ru;
alter table projects drop column if exists year;

-- 4. Enable RLS
alter table projects enable row level security;

-- 5. Create RLS Policies for projects (Conditional to avoid DROP keywords)
-- Drop old public write policies if they exist
drop policy if exists "Public insert" on projects;
drop policy if exists "Public update" on projects;
drop policy if exists "Public delete" on projects;

do $$
begin
  -- Public Read (Anyone can view projects)
  if not exists (
    select 1 from pg_policies 
    where tablename = 'projects' and policyname = 'Public read'
  ) then
    create policy "Public read" on projects for select using (true);
  end if;

  -- Authenticated Insert (Only logged-in admin can create projects)
  if not exists (
    select 1 from pg_policies 
    where tablename = 'projects' and policyname = 'Authenticated insert'
  ) then
    create policy "Authenticated insert" on projects for insert to authenticated with check (true);
  end if;

  -- Authenticated Update (Only logged-in admin can edit projects)
  if not exists (
    select 1 from pg_policies 
    where tablename = 'projects' and policyname = 'Authenticated update'
  ) then
    create policy "Authenticated update" on projects for update to authenticated using (true);
  end if;

  -- Authenticated Delete (Only logged-in admin can remove projects)
  if not exists (
    select 1 from pg_policies 
    where tablename = 'projects' and policyname = 'Authenticated delete'
  ) then
    create policy "Authenticated delete" on projects for delete to authenticated using (true);
  end if;
end
$$;

-- 5. Storage Bucket and Policies
-- Create the public bucket for storing thumbnails and videos (if not exists)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Enable RLS for storage
alter table storage.objects enable row level security;

-- Drop old storage write policies if they exist
drop policy if exists "Allow Upload" on storage.objects;
drop policy if exists "Allow Delete" on storage.objects;

-- Create Storage policies conditionally
do $$
begin
  -- Public Access (Anyone can view thumbnails)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Access'
  ) then
    create policy "Public Access" on storage.objects for select using (bucket_id = 'portfolio-media');
  end if;

  -- Authenticated Upload (Only logged-in admin can upload thumbnails)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated Upload'
  ) then
    create policy "Authenticated Upload" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media');
  end if;

  -- Authenticated Delete (Only logged-in admin can delete thumbnails)
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated Delete'
  ) then
    create policy "Authenticated Delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media');
  end if;
end
$$;
