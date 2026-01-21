-- Create a table for comments
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Policies for comments
create policy "Comments are viewable by everyone."
  on public.comments for select
  using ( true );

create policy "Authenticated users can create comments."
  on public.comments for insert
  with check ( auth.uid() = author_id );

create policy "Users can delete their own comments."
  on public.comments for delete
  using ( auth.uid() = author_id );
