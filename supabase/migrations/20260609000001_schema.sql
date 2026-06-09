create extension if not exists "uuid-ossp";

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  language     text not null default 'th' check (language in ('th','en')),
  created_at   timestamptz not null default now()
);

create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('income','expense')),
  is_deleted  boolean not null default false,
  usage_count integer not null default 0,
  created_at  timestamptz not null default now()
);

create table public.transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('income','expense')),
  amount      numeric not null check (amount > 0),
  category_id uuid not null references public.categories(id),
  note        text,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

create table public.budgets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  amount      numeric not null default 0 check (amount >= 0),
  updated_at  timestamptz not null default now(),
  unique (user_id, category_id)
);

-- Helper function to increment category usage count safely
create or replace function public.increment_usage(cat_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.categories set usage_count = usage_count + 1 where id = cat_id;
end;
$$;
