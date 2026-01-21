-- Create a table for public profiles using Supabase Auth
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Create a table for blog posts
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  image_url text,
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies for posts
create policy "Posts are viewable by everyone."
  on public.posts for select
  using ( true );

-- Enable storage
insert into storage.buckets (id, name, public)
values ('imgs', 'imgs', true)
on conflict (id) do nothing;

-- Storage Policies for 'imgs' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'imgs' );

create policy "Authenticated users can upload images"
on storage.objects
for insert
with check (
  bucket_id = 'imgs'
  and auth.role() = 'authenticated'
);

create policy "Users can update their own images"
on storage.objects
for update
using (
  bucket_id = 'imgs'
  and auth.uid() = owner
);


-- Refine Posts Policies
drop policy if exists "Authenticated users can create posts." on public.posts;
create policy "Users can create their own posts."
  on public.posts for insert
  with check ( auth.uid() = author_id );

drop policy if exists "Users can update their own posts." on public.posts;
create policy "Users can update their own posts."
  on public.posts for update
  using ( auth.uid() = author_id );
drop policy if exists "Users can delete their own posts." on public.posts;
create policy "Users can delete their own posts."
  on public.posts for delete
  using ( auth.uid() = author_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger to automatically create a public user profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
