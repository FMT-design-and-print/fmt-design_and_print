-- Create ratings table
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  user_id uuid not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  update_type text default 'original' check (update_type in ('original', 'update')),
  update_comment text,
  update_date timestamp with time zone,
  foreign key (user_id) references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.ratings enable row level security;

-- Create policies
create policy "Enable read access for all users"
  on public.ratings for select
  using (true);

create policy "Enable insert for users"
  on public.ratings for insert
  with check (true);

create policy "Enable update for users based on user_id"
  on public.ratings for update
  using (user_id = user_id);

create policy "Enable delete for users based on user_id"
  on public.ratings for delete
  using (user_id = user_id);

-- Create indexes
create index ratings_product_id_idx on public.ratings(product_id);
create index ratings_user_id_idx on public.ratings(user_id);
create index ratings_created_at_idx on public.ratings(created_at); 