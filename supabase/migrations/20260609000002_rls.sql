alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets      enable row level security;

-- profiles: users can only read/write their own row
create policy "profiles_self" on public.profiles
  for all using (auth.uid() = id);

-- categories: users can only access their own categories
create policy "categories_self" on public.categories
  for all using (auth.uid() = user_id);

-- transactions: users can only access their own transactions
create policy "transactions_self" on public.transactions
  for all using (auth.uid() = user_id);

-- budgets: users can only access their own budgets
create policy "budgets_self" on public.budgets
  for all using (auth.uid() = user_id);
