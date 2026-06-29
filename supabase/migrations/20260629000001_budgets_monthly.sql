-- Add year and month to budgets table so each month can have its own budget.
-- DEFAULT values populate existing rows, then are dropped for a clean schema.
ALTER TABLE public.budgets
  ADD COLUMN year  integer NOT NULL DEFAULT 2026,
  ADD COLUMN month integer NOT NULL DEFAULT 6;

-- Replace the per-category unique constraint with a per-category-per-month one
ALTER TABLE public.budgets DROP CONSTRAINT budgets_user_id_category_id_key;
ALTER TABLE public.budgets
  ADD CONSTRAINT budgets_user_id_category_id_year_month_key
  UNIQUE (user_id, category_id, year, month);

-- Guard against invalid values
ALTER TABLE public.budgets
  ADD CONSTRAINT budgets_month_check CHECK (month BETWEEN 1 AND 12),
  ADD CONSTRAINT budgets_year_check  CHECK (year  BETWEEN 2020 AND 2100);

-- Clean up the defaults (data is already populated from above)
ALTER TABLE public.budgets
  ALTER COLUMN year  DROP DEFAULT,
  ALTER COLUMN month DROP DEFAULT;
