# TongJod Web App — Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement task-by-task.

**Goal:** Build TongJod — a Thai personal income/expense tracker with Google OAuth, dynamic budget-status gradient themes, 6-step entry form, and dashboard charts, deployed on Vercel + Supabase.

**Architecture:** Next.js 15 App Router, fully client-side Supabase SDK (no custom API routes — RLS handles isolation). A React `ThemeProvider` computes budget status from live data and injects CSS custom properties globally so the gradient and accent color shift in real time across all pages.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS, Supabase JS v2 + SSR, Recharts, Lucide React, Vitest + Testing Library

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                      Browser                        │
│   ┌─────────────────────────────────────────────┐   │
│   │           TongJod Next.js App               │   │
│   │  /        /dashboard   /form    /budget     │   │
│   └──────────────────┬──────────────────────────┘   │
└──────────────────────│──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│                  Vercel Edge                         │
│           middleware.ts (auth guard)                 │
│        CDN + Edge Network                           │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
┌─────────▼──────────┐   ┌─────────▼──────────────┐
│   Supabase Auth    │   │  Supabase PostgreSQL    │
│   Google OAuth     │   │  profiles               │
│   Session tokens   │   │  categories             │
└────────────────────┘   │  transactions           │
                         │  budgets                │
                         │  (RLS on all tables)    │
                         └────────────────────────┘
```

---

## Database Schema Diagram

```
PROFILES ──┬──< CATEGORIES ──< TRANSACTIONS
           │         │
           │         └──< BUDGETS
           ├──< TRANSACTIONS
           └──< BUDGETS

profiles
  id          uuid PK  (= auth.uid())
  email       text
  display_name text
  language    text  ('th' | 'en')
  created_at  timestamp

categories
  id          uuid PK
  user_id     uuid FK → profiles.id
  name        text
  type        text  ('income' | 'expense')
  is_deleted  bool  default false
  usage_count int   default 0
  created_at  timestamp

transactions
  id          uuid PK
  user_id     uuid FK → profiles.id
  type        text  ('income' | 'expense')
  amount      numeric
  category_id uuid FK → categories.id
  note        text nullable
  date        date
  created_at  timestamp

budgets
  id          uuid PK
  user_id     uuid FK → profiles.id
  category_id uuid FK → categories.id  (expense only)
  amount      numeric
  updated_at  timestamp
```

---

## Form Flow Diagram

```
Open /form
    │
    ├─── [Edit last entry link] ──→ pre-fill all steps
    │
    ▼
Step 1: Type          → Income / Expense
    ▼
Step 2: Amount        → number input (currency formatted)
    ▼
Step 3: Category      → chip grid sorted by usage_count desc
    ▼
Step 4: Note          → text input  [Skip →]
    ▼
Step 5: Date          → date picker, default today
    ▼
Step 6: Confirm       → summary card
    │
    └──→ [Save] → INSERT transaction + increment usage_count → /dashboard ✓
```

---

## Budget Status Logic Diagram

```
Load /dashboard
    │
    ▼
budgets table empty?
    ├── YES → theme = default (grey)  →  "ยังไม่ได้ตั้งงบ"
    └── NO
         │
         ▼
    expectedPct = (daysElapsed / daysInMonth) × 100
    actualPct   = (totalExpense / totalBudget) × 100
    diff        = actualPct − expectedPct
         │
         ├── diff ≤ −10  →  🟢 Excellent  →  green gradient  →  random Thai phrase
         ├── diff ≤  10  →  🟡 On Track   →  yellow gradient →  random Thai phrase
         └── diff >  10  →  🔴 Over Budget →  red gradient   →  random Thai phrase
```

---

## Page Navigation Flow

```
/ (Login)
    │
    └── [Continue with Google]
            │
            ▼
        First login?
            ├── YES → seed preset categories → /dashboard
            └── NO  → /dashboard
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          /dashboard    /form      /budget
              │           │           │
              └───────────┴───────────┘
                      (bottom nav)

Any unauthenticated route → redirect to /
```

---

## File Map

```
(root: C:\Users\peach\OneDrive\เดสก์ท็อป\TongJod)
├── src/
│   ├── app/
│   │   ├── globals.css              # CSS variables + base styles
│   │   ├── layout.tsx               # Root layout: fonts + ThemeProvider
│   │   ├── page.tsx                 # Login page
│   │   ├── dashboard/page.tsx
│   │   ├── form/page.tsx
│   │   └── budget/page.tsx
│   ├── middleware.ts                 # Auth guard → redirect to /
│   ├── components/
│   │   ├── AppShell.tsx             # Phone-frame wrapper (max-w-[480px])
│   │   ├── BottomNav.tsx            # 3-tab fixed bottom nav
│   │   ├── LangToggle.tsx           # TH · EN pill
│   │   ├── ThemeProvider.tsx        # Budget status → CSS vars context
│   │   ├── Toast.tsx                # "บันทึกแล้ว!" notification
│   │   ├── dashboard/
│   │   │   ├── BudgetProgress.tsx   # Status pill + progress bar
│   │   │   ├── SummaryCards.tsx     # Income + Expense side by side
│   │   │   ├── DailyChart.tsx       # Recharts bar chart
│   │   │   └── TopCategories.tsx    # Horizontal bars top 5
│   │   ├── form/
│   │   │   ├── FormShell.tsx        # Header + dots + slide animation
│   │   │   ├── StepType.tsx
│   │   │   ├── StepAmount.tsx
│   │   │   ├── StepCategory.tsx
│   │   │   ├── StepNote.tsx
│   │   │   ├── StepDate.tsx
│   │   │   └── StepConfirm.tsx
│   │   └── budget/
│   │       ├── BudgetCategoryRow.tsx
│   │       └── AddCategorySheet.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # createBrowserClient singleton
│   │   │   └── server.ts            # createServerClient (middleware only)
│   │   ├── theme.ts                 # THEMES config + computeStatus()
│   │   ├── i18n.ts                  # STR dictionary + t() helper
│   │   ├── types.ts                 # TS interfaces
│   │   └── db.ts                    # Typed query helpers
│   └── hooks/
│       ├── useLang.ts
│       ├── useTransactions.ts
│       ├── useCategories.ts
│       └── useBudgets.ts
├── supabase/
│   └── migrations/
│       ├── 20260609000001_schema.sql
│       └── 20260609000002_rls.sql
├── tests/
│   ├── lib/theme.test.ts
│   └── lib/i18n.test.ts
├── next.config.ts
└── vitest.config.ts
```

---

## Task 1: Scaffold Project

**Files:** `package.json`, `next.config.ts`, `vitest.config.ts`, `tsconfig.json`

- [ ] Run in `C:\Users\peach\OneDrive\เดสก์ท็อป\TongJod`:
  ```bash
  npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --yes
  ```
- [ ] Install runtime deps:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr lucide-react recharts
  ```
- [ ] Install dev deps:
  ```bash
  npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] Create `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  import path from 'path'

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
    },
    resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  })
  ```
- [ ] Create `tests/setup.ts`:
  ```ts
  import '@testing-library/jest-dom'
  ```
- [ ] Add to `package.json` scripts: `"test": "vitest"`
- [ ] Commit:
  ```bash
  git init && git add -A && git commit -m "chore: scaffold Next.js project with Supabase + Recharts"
  ```

---

## Task 2: Supabase Schema Migrations

**Files:** `supabase/migrations/20260609000001_schema.sql`, `supabase/migrations/20260609000002_rls.sql`

- [ ] Create `supabase/migrations/20260609000001_schema.sql`:
  ```sql
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
  ```

- [ ] Create `supabase/migrations/20260609000002_rls.sql`:
  ```sql
  alter table public.profiles    enable row level security;
  alter table public.categories  enable row level security;
  alter table public.transactions enable row level security;
  alter table public.budgets     enable row level security;

  -- profiles: own row only
  create policy "profiles_self" on public.profiles
    for all using (auth.uid() = id);

  -- categories: own rows only
  create policy "categories_self" on public.categories
    for all using (auth.uid() = user_id);

  -- transactions: own rows only
  create policy "transactions_self" on public.transactions
    for all using (auth.uid() = user_id);

  -- budgets: own rows only
  create policy "budgets_self" on public.budgets
    for all using (auth.uid() = user_id);
  ```

- [ ] Apply via Supabase dashboard SQL editor or CLI (`supabase db push`)
- [ ] Commit:
  ```bash
  git add supabase/ && git commit -m "feat: add database schema and RLS policies"
  ```

---

## Task 3: Shared Types + Theme Lib + i18n

**Files:** `src/lib/types.ts`, `src/lib/theme.ts`, `src/lib/i18n.ts`, `tests/lib/theme.test.ts`, `tests/lib/i18n.test.ts`

- [ ] Create `src/lib/types.ts`:
  ```ts
  export interface Profile {
    id: string
    email: string
    display_name: string | null
    language: 'th' | 'en'
    created_at: string
  }

  export interface Category {
    id: string
    user_id: string
    name: string
    type: 'income' | 'expense'
    is_deleted: boolean
    usage_count: number
    created_at: string
  }

  export interface Transaction {
    id: string
    user_id: string
    type: 'income' | 'expense'
    amount: number
    category_id: string
    note: string | null
    date: string
    created_at: string
  }

  export interface Budget {
    id: string
    user_id: string
    category_id: string
    amount: number
    updated_at: string
  }

  export type Lang = 'th' | 'en'
  export type StatusKey = 'excellent' | 'onTrack' | 'over' | 'default'

  export interface Theme {
    key: StatusKey
    gradient: string
    accent: string
    accentLight: string
    cardTint: string
    bar: string
    pillBg: string
    pillText: string
    focusRing: string
  }
  ```

- [ ] Create `src/lib/theme.ts`:
  ```ts
  import type { StatusKey, Theme } from './types'

  export const THEMES: Record<StatusKey, Theme> = {
    excellent: {
      key: 'excellent',
      gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 40%, #6EE7B7 100%)',
      accent: '#059669',
      accentLight: '#34D399',
      cardTint: 'rgba(16, 185, 129, 0.08)',
      bar: '#10B981',
      pillBg: '#D1FAE5',
      pillText: '#065F46',
      focusRing: 'rgba(5, 150, 105, 0.15)',
    },
    onTrack: {
      key: 'onTrack',
      gradient: 'linear-gradient(135deg, #FEF9C3 0%, #FDE68A 40%, #FCD34D 100%)',
      accent: '#D97706',
      accentLight: '#FBBF24',
      cardTint: 'rgba(245, 158, 11, 0.08)',
      bar: '#F59E0B',
      pillBg: '#FEF3C7',
      pillText: '#92400E',
      focusRing: 'rgba(217, 119, 6, 0.15)',
    },
    over: {
      key: 'over',
      gradient: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 40%, #FDA4AF 100%)',
      accent: '#DC2626',
      accentLight: '#FB7185',
      cardTint: 'rgba(239, 68, 68, 0.08)',
      bar: '#EF4444',
      pillBg: '#FFE4E6',
      pillText: '#9F1239',
      focusRing: 'rgba(220, 38, 38, 0.15)',
    },
    default: {
      key: 'default',
      gradient: 'linear-gradient(135deg, #F7F5F1 0%, #EDE9E3 100%)',
      accent: '#78716C',
      accentLight: '#A8A29E',
      cardTint: 'rgba(120, 113, 108, 0.06)',
      bar: '#A8A29E',
      pillBg: '#F0EDE8',
      pillText: '#57534E',
      focusRing: 'rgba(120, 113, 108, 0.15)',
    },
  }

  /** Returns StatusKey based on actual vs expected spending percentages. */
  export function computeStatus(
    actualPct: number,
    expectedPct: number,
    hasBudget: boolean,
  ): StatusKey {
    if (!hasBudget) return 'default'
    const diff = actualPct - expectedPct
    if (diff <= -10) return 'excellent'
    if (diff <= 10) return 'onTrack'
    return 'over'
  }

  export const STATUS_MESSAGES: Record<StatusKey, string[]> = {
    excellent: [
      'เก่งมาก ประหยัดได้เยอะสุดๆ',
      'ยอดเยี่ยม! ประหยัดกว่าแผนมาก',
      'สุดยอด! เงินเหลือเยอะเลย',
    ],
    onTrack: [
      'ทำได้ตามแผนเลย ดีมาก!',
      'ยังอยู่ในงบ สู้ต่อไป!',
      'เป๊ะมากเลย ไปได้สวย!',
    ],
    over: [
      'ใช้เงินเยอะเกินไปแล้วนะ!',
      'ระวังด้วย! งบเกินแล้ว',
      'โอ้โห ใช้หนักไปหน่อยนะเดือนนี้',
    ],
    default: ['ยังไม่ได้ตั้งงบประมาณเดือนนี้'],
  }

  export function randomMessage(key: StatusKey): string {
    const msgs = STATUS_MESSAGES[key]
    return msgs[Math.floor(Math.random() * msgs.length)]
  }

  export function fmt(n: number): string {
    return Math.round(n).toLocaleString('en-US')
  }
  ```

- [ ] Create `src/lib/i18n.ts`:
  ```ts
  import type { Lang } from './types'

  type Entry = Record<Lang, string>
  const STR: Record<string, Entry> = {
    tagline:        { th: 'จดทุกบาท ใช้ชีวิตสบายใจ', en: 'Track every baht, live at ease' },
    continueGoogle: { th: 'เข้าสู่ระบบด้วย Google',  en: 'Continue with Google' },
    baht:           { th: 'บาท',      en: 'THB' },
    income:         { th: 'รายรับ',   en: 'Income' },
    expense:        { th: 'รายจ่าย',  en: 'Expense' },
    avgPerDay:      { th: 'เฉลี่ย {n} บาท/วัน', en: 'Avg {n} THB/day' },
    expected:       { th: 'คาดการณ์ {n}%', en: 'Expected {n}%' },
    actual:         { th: 'จริง {n}%',     en: 'Actual {n}%' },
    dailyExpense:   { th: 'รายจ่ายรายวัน', en: 'Daily spending' },
    topCategories:  { th: 'หมวดหมู่ที่ใช้มากสุด', en: 'Top categories' },
    navHome:        { th: 'หน้าหลัก',   en: 'Home' },
    navAdd:         { th: 'เพิ่ม',      en: 'Add' },
    navBudget:      { th: 'งบประมาณ',   en: 'Budget' },
    formType:       { th: 'วันนี้เป็น...', en: 'Today is a...' },
    formAmount:     { th: 'จำนวนเท่าไหร่?', en: 'How much?' },
    formCategory:   { th: 'หมวดหมู่ไหน?', en: 'Which category?' },
    formNote:       { th: 'มีอะไรเพิ่มเติมไหม?', en: 'Anything to add?' },
    formDate:       { th: 'วันที่?',    en: 'Which date?' },
    formConfirm:    { th: 'ตรวจสอบอีกครั้ง', en: 'Review once more' },
    continue:       { th: 'ต่อไป',     en: 'Continue' },
    skip:           { th: 'ข้ามได้เลย', en: 'Skip' },
    today:          { th: 'วันนี้',     en: 'Today' },
    save:           { th: 'บันทึก',    en: 'Save' },
    edit:           { th: 'แก้ไข',     en: 'Edit' },
    editLast:       { th: 'แก้ไขรายการล่าสุด', en: 'Edit last entry' },
    saved:          { th: 'บันทึกแล้ว!', en: 'Saved!' },
    budgetTitle:    { th: 'ตั้งงบประมาณ', en: 'Set budget' },
    totalBudget:    { th: 'งบรวม',     en: 'Total budget' },
    notSet:         { th: 'ยังไม่ได้ตั้ง', en: 'Not set' },
    addCategory:    { th: 'เพิ่มหมวดหมู่', en: 'Add category' },
    newCategory:    { th: 'เพิ่มหมวดหมู่ใหม่', en: 'New category' },
    categoryName:   { th: 'ชื่อหมวดหมู่', en: 'Category name' },
    notePlaceholder:{ th: 'เช่น ข้าวกลางวันกับเพื่อน', en: 'e.g. lunch with friends' },
    fType:          { th: 'ประเภท',   en: 'Type' },
    fAmount:        { th: 'จำนวน',    en: 'Amount' },
    fCategory:      { th: 'หมวดหมู่', en: 'Category' },
    fNote:          { th: 'โน้ต',     en: 'Note' },
    fDate:          { th: 'วันที่',   en: 'Date' },
    noNote:         { th: '—',        en: '—' },
  }

  export function t(key: string, lang: Lang, vars?: Record<string, string | number>): string {
    const entry = STR[key]
    let s = entry ? entry[lang] : key
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, String(v)) })
    }
    return s
  }
  ```

- [ ] Write `tests/lib/theme.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { computeStatus, THEMES } from '@/lib/theme'

  describe('computeStatus', () => {
    it('returns default when no budget', () => {
      expect(computeStatus(50, 50, false)).toBe('default')
    })
    it('returns excellent when 10%+ below expected', () => {
      expect(computeStatus(20, 40, true)).toBe('excellent') // diff = -20
    })
    it('returns onTrack when within 10% of expected', () => {
      expect(computeStatus(35, 40, true)).toBe('onTrack')   // diff = -5
      expect(computeStatus(48, 40, true)).toBe('onTrack')   // diff = +8
    })
    it('returns over when more than 10% above expected', () => {
      expect(computeStatus(55, 40, true)).toBe('over')      // diff = +15
    })
  })

  describe('THEMES', () => {
    it('has all four keys', () => {
      expect(Object.keys(THEMES)).toEqual(['excellent','onTrack','over','default'])
    })
  })
  ```

- [ ] Write `tests/lib/i18n.test.ts`:
  ```ts
  import { describe, it, expect } from 'vitest'
  import { t } from '@/lib/i18n'

  describe('t()', () => {
    it('returns Thai string', () => {
      expect(t('income', 'th')).toBe('รายรับ')
    })
    it('returns English string', () => {
      expect(t('income', 'en')).toBe('Income')
    })
    it('substitutes variables', () => {
      expect(t('avgPerDay', 'th', { n: 500 })).toBe('เฉลี่ย 500 บาท/วัน')
    })
    it('returns key for unknown strings', () => {
      expect(t('unknown_key', 'th')).toBe('unknown_key')
    })
  })
  ```

- [ ] Run tests: `npm test` — expect all 7 tests to pass
- [ ] Commit:
  ```bash
  git add src/lib/ tests/ && git commit -m "feat: add types, theme logic, and i18n helper"
  ```

---

## Task 4: Supabase Clients + Auth Middleware

**Files:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/middleware.ts`

- [ ] Add `.env.local` (never commit this file):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

- [ ] Create `src/lib/supabase/client.ts`:
  ```ts
  import { createBrowserClient } from '@supabase/ssr'

  let client: ReturnType<typeof createBrowserClient> | null = null

  export function getSupabase() {
    if (!client) {
      client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
    }
    return client
  }
  ```

- [ ] Create `src/lib/supabase/server.ts`:
  ```ts
  import { createServerClient } from '@supabase/ssr'
  import { type NextRequest, NextResponse } from 'next/server'

  export function createMiddlewareClient(request: NextRequest) {
    const response = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      },
    )
    return { supabase, response }
  }
  ```

- [ ] Create `src/middleware.ts`:
  ```ts
  import { type NextRequest, NextResponse } from 'next/server'
  import { createMiddlewareClient } from '@/lib/supabase/server'

  const PUBLIC_PATHS = ['/']

  export async function middleware(request: NextRequest) {
    const { supabase, response } = createMiddlewareClient(request)
    const { data: { session } } = await supabase.auth.getSession()
    const { pathname } = request.nextUrl

    if (!session && !PUBLIC_PATHS.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (session && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  }
  ```

- [ ] Commit:
  ```bash
  git add src/lib/supabase/ src/middleware.ts .env.local.example && git commit -m "feat: add Supabase clients and auth middleware"
  ```

---

## Task 5: Global CSS Design System

**Files:** `src/app/globals.css`, `src/app/layout.tsx`

- [ ] Replace `src/app/globals.css` entirely:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    --bg-base: #F7F5F1;
    --surface: #FFFFFF;
    --surface-secondary: #F0EDE8;
    --text-primary: #1C1917;
    --text-secondary: #78716C;
    --text-muted: #A8A29E;
    --border: #E7E2D9;

    /* theme vars — overridden at runtime by ThemeProvider */
    --accent: #78716C;
    --accent-light: #A8A29E;
    --bar: #A8A29E;
    --pill-bg: #F0EDE8;
    --pill-text: #57534E;
    --card-tint: rgba(120,113,108,0.06);
    --focus-ring: rgba(120,113,108,0.15);
    --app-gradient: linear-gradient(135deg, #F7F5F1 0%, #EDE9E3 100%);

    /* spacing */
    --xs: 4px;  --sm: 8px;  --md: 16px;
    --lg: 24px; --xl: 32px; --2xl: 48px;

    /* radius */
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-full: 9999px;

    /* shadows */
    --sh-card: 0px 2px 12px rgba(28,25,23,0.07);
    --sh-card-hover: 0px 4px 20px rgba(28,25,23,0.12);
    --sh-button: 0px 2px 8px rgba(28,25,23,0.10);
    --sh-nav: 0px -2px 16px rgba(28,25,23,0.06);

    --font-display: 'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif;
    --font-body: 'Inter', 'Noto Sans Thai', sans-serif;
    --font-thai: 'Noto Sans Thai', 'Plus Jakarta Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: var(--font-body);
    color: var(--text-primary);
    background: var(--bg-base);
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  /* Typography helpers */
  .font-display { font-family: var(--font-display); }
  .font-thai    { font-family: var(--font-thai); }

  /* Scrollbars hidden */
  .scroll-hidden { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .scroll-hidden::-webkit-scrollbar { display: none; }

  /* Shared card */
  .tj-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: var(--md);
    box-shadow: var(--sh-card);
  }

  /* Buttons */
  .tj-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    border: none; cursor: pointer; appearance: none;
    background: var(--accent); color: #fff;
    border-radius: var(--r-md); padding: 14px 24px;
    font-family: var(--font-body); font-weight: 600; font-size: 16px;
    box-shadow: var(--sh-button);
    transition: transform 120ms ease-out, filter 150ms ease-out;
  }
  .tj-btn-primary:hover { filter: brightness(0.92); }
  .tj-btn-primary:active { transform: scale(0.97); }
  .tj-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .tj-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; appearance: none;
    background: transparent; color: var(--text-secondary);
    border: 1px solid var(--border); border-radius: var(--r-md);
    padding: 12px 20px; font-family: var(--font-body); font-weight: 500; font-size: 15px;
    transition: transform 120ms ease-out, background 150ms;
  }
  .tj-btn-ghost:hover { background: rgba(0,0,0,0.03); }
  .tj-btn-ghost:active { transform: scale(0.97); }

  .tj-input {
    width: 100%; background: var(--surface);
    border: 1.5px solid var(--border); border-radius: var(--r-md);
    padding: 14px 16px; font-family: var(--font-body); font-size: 16px;
    color: var(--text-primary); transition: border-color 150ms, box-shadow 150ms;
  }
  .tj-input::placeholder { color: var(--text-muted); }
  .tj-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--focus-ring); }

  /* Animations */
  @keyframes cardIn    { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideInR  { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }
  @keyframes slideInL  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: none; } }
  @keyframes sheetUp   { from { transform: translateY(100%); } to { transform: none; } }

  .anim-card   { animation: cardIn   240ms ease-out both; }
  .anim-fade   { animation: fadeIn   200ms ease-out both; }
  .anim-in-r   { animation: slideInR 280ms ease-out both; }
  .anim-in-l   { animation: slideInL 280ms ease-out both; }
  .anim-sheet  { animation: sheetUp  300ms ease-out both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
  ```

- [ ] Update `src/app/layout.tsx`:
  ```tsx
  import type { Metadata } from 'next'
  import './globals.css'

  export const metadata: Metadata = {
    title: 'TongJod — ต้องจด',
    description: 'จดทุกบาท ใช้ชีวิตสบายใจ',
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="th">
        <body>{children}</body>
      </html>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/app/ && git commit -m "feat: add global CSS design system"
  ```

---

## Task 6: Login Page

**Files:** `src/app/page.tsx`

- [ ] Create `src/app/page.tsx`:
  ```tsx
  'use client'
  import { useRouter } from 'next/navigation'
  import { getSupabase } from '@/lib/supabase/client'

  export default function LoginPage() {
    const router = useRouter()

    async function handleGoogleSignIn() {
      const supabase = getSupabase()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/dashboard` },
      })
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--app-gradient)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 16px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48,
            color: 'var(--text-primary)', letterSpacing: '-0.02em',
          }}>
            TongJod
          </h1>
          <p style={{ fontFamily: 'var(--font-thai)', color: 'var(--text-secondary)', marginTop: 8, fontSize: 16 }}>
            จดทุกบาท ใช้ชีวิตสบายใจ
          </p>
        </div>
        <button
          onClick={handleGoogleSignIn}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: '14px 28px',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16,
            color: 'var(--text-primary)', cursor: 'pointer',
            boxShadow: 'var(--sh-card)', width: 280, justifyContent: 'center',
            transition: 'box-shadow 150ms',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v8.51h12.93c-.56 2.84-2.24 5.25-4.79 6.87v5.71h7.75c4.54-4.18 7.09-10.35 7.09-17.54z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.15 15.9-5.84l-7.75-5.71c-2.15 1.44-4.9 2.29-8.15 2.29-6.26 0-11.57-4.23-13.47-9.91H2.52v5.9C6.48 42.57 14.69 48 24 48z"/>
            <path fill="#FBBC05" d="M10.53 28.83A14.88 14.88 0 0 1 9.5 24c0-1.68.29-3.31.81-4.83v-5.9H2.52A23.93 23.93 0 0 0 0 24c0 3.87.93 7.54 2.52 10.73l8.01-5.9z"/>
            <path fill="#EA4335" d="M24 9.52c3.53 0 6.69 1.21 9.18 3.59l6.87-6.87C35.93 2.38 30.48 0 24 0 14.69 0 6.48 5.43 2.52 13.27l8.01 5.9C12.43 13.75 17.74 9.52 24 9.52z"/>
          </svg>
          เข้าสู่ระบบด้วย Google
        </button>
      </div>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/app/page.tsx && git commit -m "feat: add login page with Google OAuth"
  ```

---

## Task 7: ThemeProvider + AppShell + BottomNav

**Files:** `src/components/ThemeProvider.tsx`, `src/components/AppShell.tsx`, `src/components/BottomNav.tsx`

- [ ] Create `src/components/ThemeProvider.tsx`:
  ```tsx
  'use client'
  import { createContext, useContext, useEffect, useRef, useState } from 'react'
  import { THEMES, computeStatus, randomMessage } from '@/lib/theme'
  import type { Theme, StatusKey } from '@/lib/types'

  interface ThemeCtx {
    theme: Theme
    statusKey: StatusKey
    statusMessage: string
    setSpendingData: (totalExpense: number, totalBudget: number) => void
  }

  const ThemeContext = createContext<ThemeCtx>({
    theme: THEMES.default,
    statusKey: 'default',
    statusMessage: '',
    setSpendingData: () => {},
  })

  export function useTheme() { return useContext(ThemeContext) }

  export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const today = new Date()
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const daysElapsed = today.getDate()
    const expectedPct = Math.round((daysElapsed / daysInMonth) * 100)

    const [totalExpense, setTotalExpense] = useState(0)
    const [totalBudget, setTotalBudget] = useState(0)

    const hasBudget = totalBudget > 0
    const actualPct = hasBudget ? Math.round((totalExpense / totalBudget) * 100) : 0
    const statusKey = computeStatus(actualPct, expectedPct, hasBudget)
    const theme = THEMES[statusKey]
    const msgRef = useRef(randomMessage(statusKey))

    useEffect(() => { msgRef.current = randomMessage(statusKey) }, [statusKey])

    // Inject CSS variables on the document root
    useEffect(() => {
      const r = document.documentElement.style
      r.setProperty('--accent', theme.accent)
      r.setProperty('--accent-light', theme.accentLight)
      r.setProperty('--bar', theme.bar)
      r.setProperty('--pill-bg', theme.pillBg)
      r.setProperty('--pill-text', theme.pillText)
      r.setProperty('--card-tint', theme.cardTint)
      r.setProperty('--focus-ring', theme.focusRing)
      r.setProperty('--app-gradient', theme.gradient)
    }, [theme])

    function setSpendingData(expense: number, budget: number) {
      setTotalExpense(expense)
      setTotalBudget(budget)
    }

    return (
      <ThemeContext.Provider value={{ theme, statusKey, statusMessage: msgRef.current, setSpendingData }}>
        {children}
      </ThemeContext.Provider>
    )
  }
  ```

- [ ] Update `src/app/layout.tsx` to wrap with ThemeProvider:
  ```tsx
  import type { Metadata } from 'next'
  import './globals.css'
  import { ThemeProvider } from '@/components/ThemeProvider'

  export const metadata: Metadata = {
    title: 'TongJod — ต้องจด',
    description: 'จดทุกบาท ใช้ชีวิตสบายใจ',
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="th">
        <body>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    )
  }
  ```

- [ ] Create `src/components/AppShell.tsx`:
  ```tsx
  'use client'
  import { useTheme } from './ThemeProvider'

  export function AppShell({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme()
    return (
      <>
        {/* Desktop full-page gradient backdrop */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: theme.gradient,
          transition: 'background 600ms ease-out',
        }} />
        {/* Desktop scrim */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: 'rgba(28,25,23,0.22)',
          backdropFilter: 'blur(6px)',
          opacity: 0,
          pointerEvents: 'none',
        }} className="desktop-scrim" />
        {/* Phone frame */}
        <div style={{
          position: 'relative', zIndex: 2,
          minHeight: '100vh', display: 'flex',
          alignItems: 'stretch', justifyContent: 'center',
        }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: 480,
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            background: 'var(--bg-base)', overflow: 'hidden',
          }}>
            {/* Gradient tint behind content */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: theme.gradient,
              transition: 'background 500ms ease-out',
              opacity: 0.35,
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </div>
        </div>
        <style>{`
          @media (min-width: 640px) {
            .desktop-scrim { opacity: 1 !important; }
          }
        `}</style>
      </>
    )
  }
  ```

- [ ] Create `src/components/BottomNav.tsx`:
  ```tsx
  'use client'
  import { useRouter, usePathname } from 'next/navigation'
  import { LayoutDashboard, Plus, Wallet } from 'lucide-react'
  import { useTheme } from './ThemeProvider'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  export function BottomNav({ lang }: { lang: Lang }) {
    const router = useRouter()
    const pathname = usePathname()
    const { theme } = useTheme()

    const tabs = [
      { path: '/dashboard', Icon: LayoutDashboard, label: t('navHome', lang) },
      { path: '/form',      Icon: Plus,            label: t('navAdd', lang), primary: true },
      { path: '/budget',    Icon: Wallet,           label: t('navBudget', lang) },
    ]

    return (
      <div style={{
        height: 64, flexShrink: 0, background: 'var(--surface)',
        borderTop: '1px solid var(--border)', boxShadow: 'var(--sh-nav)',
        display: 'flex', alignItems: 'stretch',
      }}>
        {tabs.map(({ path, Icon, label, primary }) => {
          const active = pathname === path
          if (primary) return (
            <div key={path} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={() => router.push(path)} aria-label={label} style={{
                width: 52, height: 52, borderRadius: 18, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${theme.accentLight}, ${theme.accent})`,
                boxShadow: `0 6px 16px ${theme.cardTint}, var(--sh-button)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={26} color="#fff" strokeWidth={2.4} />
              </button>
            </div>
          )
          return (
            <button key={path} onClick={() => router.push(path)} style={{
              flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, position: 'relative',
            }}>
              {active && <span style={{
                position: 'absolute', top: 9, width: 16, height: 3,
                borderRadius: 999, background: theme.accent,
              }} />}
              <Icon size={22} color={active ? theme.accent : 'var(--text-muted)'} strokeWidth={active ? 2.3 : 2} />
              {active && (
                <span style={{ fontFamily: 'var(--font-thai)', fontSize: 12, fontWeight: 600, color: theme.accent }}>
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/components/ src/app/layout.tsx && git commit -m "feat: add ThemeProvider, AppShell, and BottomNav"
  ```

---

## Task 8: Data Hooks

**Files:** `src/hooks/useLang.ts`, `src/hooks/useTransactions.ts`, `src/hooks/useCategories.ts`, `src/hooks/useBudgets.ts`, `src/lib/db.ts`

- [ ] Create `src/lib/db.ts`:
  ```ts
  import { getSupabase } from './supabase/client'
  import type { Transaction, Category, Budget, Profile } from './types'

  export async function getOrCreateProfile(userId: string, email: string, displayName: string): Promise<Profile> {
    const sb = getSupabase()
    const { data: existing } = await sb.from('profiles').select('*').eq('id', userId).single()
    if (existing) return existing as Profile
    const { data, error } = await sb.from('profiles').insert({
      id: userId, email, display_name: displayName,
    }).select().single()
    if (error) throw error
    return data as Profile
  }

  export async function seedCategories(userId: string) {
    const sb = getSupabase()
    const expenseNames = ['อาหาร','เดินทาง','ช้อปปิ้ง','บิล/ค่าใช้จ่าย','สุขภาพ','บันเทิง','กาแฟ','อื่นๆ']
    const incomeNames  = ['เงินเดือน','ฟรีแลนซ์','โบนัส','อื่นๆ']
    const rows = [
      ...expenseNames.map((name, i) => ({ user_id: userId, name, type: 'expense', usage_count: 0 })),
      ...incomeNames.map((name, i)  => ({ user_id: userId, name, type: 'income',  usage_count: 0 })),
    ]
    await sb.from('categories').insert(rows)
  }

  export async function fetchTransactions(userId: string, year: number, month: number): Promise<Transaction[]> {
    const from = `${year}-${String(month).padStart(2,'0')}-01`
    const to   = `${year}-${String(month).padStart(2,'0')}-${new Date(year, month, 0).getDate()}`
    const sb = getSupabase()
    const { data, error } = await sb.from('transactions')
      .select('*').eq('user_id', userId)
      .gte('date', from).lte('date', to)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Transaction[]
  }

  export async function insertTransaction(tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'> & { user_id: string }): Promise<Transaction> {
    const sb = getSupabase()
    const { data, error } = await sb.from('transactions').insert(tx).select().single()
    if (error) throw error
    await sb.from('categories').update({ usage_count: sb.rpc('increment', { row_id: tx.category_id }) })
    // increment usage_count
    await sb.rpc('increment_usage', { cat_id: tx.category_id })
    return data as Transaction
  }

  export async function updateTransaction(id: string, tx: Partial<Transaction>): Promise<void> {
    const sb = getSupabase()
    const { error } = await sb.from('transactions').update(tx).eq('id', id)
    if (error) throw error
  }

  export async function fetchCategories(userId: string): Promise<Category[]> {
    const sb = getSupabase()
    const { data, error } = await sb.from('categories')
      .select('*').eq('user_id', userId).eq('is_deleted', false)
      .order('usage_count', { ascending: false })
    if (error) throw error
    return data as Category[]
  }

  export async function insertCategory(userId: string, name: string, type: 'income' | 'expense'): Promise<Category> {
    const sb = getSupabase()
    const { data, error } = await sb.from('categories').insert({ user_id: userId, name, type }).select().single()
    if (error) throw error
    return data as Category
  }

  export async function softDeleteCategory(id: string): Promise<void> {
    const sb = getSupabase()
    const { error } = await sb.from('categories').update({ is_deleted: true }).eq('id', id)
    if (error) throw error
  }

  export async function fetchBudgets(userId: string): Promise<Budget[]> {
    const sb = getSupabase()
    const { data, error } = await sb.from('budgets').select('*').eq('user_id', userId)
    if (error) throw error
    return data as Budget[]
  }

  export async function upsertBudget(userId: string, categoryId: string, amount: number): Promise<void> {
    const sb = getSupabase()
    const { error } = await sb.from('budgets').upsert(
      { user_id: userId, category_id: categoryId, amount, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,category_id' }
    )
    if (error) throw error
  }
  ```

  > Note: Add a Supabase DB function for `increment_usage`:
  > ```sql
  > create or replace function increment_usage(cat_id uuid)
  > returns void language plpgsql as $$
  > begin
  >   update categories set usage_count = usage_count + 1 where id = cat_id;
  > end; $$;
  > ```
  > Run this in the Supabase SQL editor.

- [ ] Create `src/hooks/useLang.ts`:
  ```ts
  'use client'
  import { useState, useEffect } from 'react'
  import type { Lang } from '@/lib/types'

  export function useLang(): [Lang, (l: Lang) => void] {
    const [lang, setLangState] = useState<Lang>('th')

    useEffect(() => {
      const stored = localStorage.getItem('tj_lang') as Lang | null
      if (stored) setLangState(stored)
    }, [])

    function setLang(l: Lang) {
      setLangState(l)
      localStorage.setItem('tj_lang', l)
    }

    return [lang, setLang]
  }
  ```

- [ ] Create `src/hooks/useTransactions.ts`:
  ```ts
  'use client'
  import { useState, useEffect, useCallback } from 'react'
  import { fetchTransactions, insertTransaction, updateTransaction } from '@/lib/db'
  import type { Transaction } from '@/lib/types'

  export function useTransactions(userId: string | null, year: number, month: number) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
      if (!userId) return
      setLoading(true)
      const data = await fetchTransactions(userId, year, month)
      setTransactions(data)
      setLoading(false)
    }, [userId, year, month])

    useEffect(() => { load() }, [load])

    async function addTransaction(tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
      if (!userId) return
      const saved = await insertTransaction({ ...tx, user_id: userId })
      setTransactions(prev => [saved, ...prev])
    }

    async function editTransaction(id: string, tx: Partial<Transaction>) {
      await updateTransaction(id, tx)
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...tx } : t))
    }

    return { transactions, loading, addTransaction, editTransaction, reload: load }
  }
  ```

- [ ] Create `src/hooks/useCategories.ts`:
  ```ts
  'use client'
  import { useState, useEffect } from 'react'
  import { fetchCategories, insertCategory, softDeleteCategory } from '@/lib/db'
  import type { Category } from '@/lib/types'

  export function useCategories(userId: string | null) {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
      if (!userId) return
      fetchCategories(userId).then(setCategories)
    }, [userId])

    async function addCategory(name: string, type: 'income' | 'expense') {
      if (!userId) return
      const cat = await insertCategory(userId, name, type)
      setCategories(prev => [...prev, cat])
    }

    async function deleteCategory(id: string) {
      await softDeleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
    }

    return { categories, addCategory, deleteCategory }
  }
  ```

- [ ] Create `src/hooks/useBudgets.ts`:
  ```ts
  'use client'
  import { useState, useEffect } from 'react'
  import { fetchBudgets, upsertBudget } from '@/lib/db'
  import type { Budget } from '@/lib/types'

  export function useBudgets(userId: string | null) {
    const [budgets, setBudgets] = useState<Budget[]>([])

    useEffect(() => {
      if (!userId) return
      fetchBudgets(userId).then(setBudgets)
    }, [userId])

    async function setBudget(categoryId: string, amount: number) {
      if (!userId) return
      await upsertBudget(userId, categoryId, amount)
      setBudgets(prev => {
        const exists = prev.find(b => b.category_id === categoryId)
        if (exists) return prev.map(b => b.category_id === categoryId ? { ...b, amount } : b)
        return [...prev, { id: '', user_id: userId, category_id: categoryId, amount, updated_at: '' }]
      })
    }

    const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)

    return { budgets, setBudget, totalBudget }
  }
  ```

- [ ] Commit:
  ```bash
  git add src/lib/db.ts src/hooks/ && git commit -m "feat: add data access layer and hooks"
  ```

---

## Task 9: Dashboard Page

**Files:** `src/app/dashboard/page.tsx`, `src/components/dashboard/BudgetProgress.tsx`, `src/components/dashboard/SummaryCards.tsx`, `src/components/dashboard/DailyChart.tsx`, `src/components/dashboard/TopCategories.tsx`

- [ ] Create `src/components/dashboard/BudgetProgress.tsx`:
  ```tsx
  'use client'
  import { useTheme } from '@/components/ThemeProvider'
  import { t } from '@/lib/i18n'
  import { fmt } from '@/lib/theme'
  import type { Lang } from '@/lib/types'

  interface Props {
    expectedPct: number
    actualPct: number
    lang: Lang
  }

  export function BudgetProgress({ expectedPct, actualPct, lang }: Props) {
    const { theme, statusKey, statusMessage } = useTheme()
    const statusLabel = { excellent: '🌿 ยอดเยี่ยม', onTrack: '✓ อยู่ในงบ', over: '⚠ เกินงบ', default: '—' }[statusKey]

    return (
      <div className="tj-card anim-card" style={{ background: `color-mix(in srgb, var(--surface) 85%, ${theme.pillBg})` }}>
        {/* Status pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <span style={{
            background: theme.pillBg, color: theme.pillText,
            borderRadius: 'var(--r-full)', padding: '6px 14px',
            fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-thai)',
          }}>
            {statusLabel}
          </span>
        </div>

        {/* Status message */}
        <p style={{
          textAlign: 'center', marginBottom: 16,
          fontFamily: 'var(--font-thai)', fontSize: 15, color: 'var(--text-primary)',
        }}>
          {statusMessage}
        </p>

        {/* Label row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>{t('expected', lang, { n: expectedPct })}</span>
          <span>{t('actual', lang, { n: actualPct })}</span>
        </div>

        {/* Progress bar */}
        <div style={{ position: 'relative', height: 12, borderRadius: 'var(--r-full)', background: 'var(--surface-secondary)', overflow: 'hidden' }}>
          {/* Actual fill */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${Math.min(actualPct, 100)}%`,
            background: `linear-gradient(90deg, ${theme.accentLight}, ${theme.bar})`,
            borderRadius: 'var(--r-full)',
            transition: 'width 600ms ease-out',
          }} />
          {/* Expected marker */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${Math.min(expectedPct, 100)}%`,
            width: 2, background: '#fff',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            transform: 'translateX(-50%)',
          }} />
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/components/dashboard/SummaryCards.tsx`:
  ```tsx
  import { TrendingUp, TrendingDown } from 'lucide-react'
  import { t } from '@/lib/i18n'
  import { fmt } from '@/lib/theme'
  import type { Lang, Transaction } from '@/lib/types'

  interface Props { transactions: Transaction[]; daysElapsed: number; lang: Lang }

  export function SummaryCards({ transactions, daysElapsed, lang }: Props) {
    const totalIncome  = transactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0)
    const totalExpense = transactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0)
    const avgIncome  = daysElapsed > 0 ? Math.round(totalIncome  / daysElapsed) : 0
    const avgExpense = daysElapsed > 0 ? Math.round(totalExpense / daysElapsed) : 0

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="tj-card anim-card" style={{ background: 'rgba(16,185,129,0.06)', animationDelay: '60ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <TrendingUp size={16} color="#059669" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-thai)' }}>{t('income', lang)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
            {fmt(totalIncome)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>บาท</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-thai)' }}>
            {t('avgPerDay', lang, { n: fmt(avgIncome) })}
          </div>
        </div>

        <div className="tj-card anim-card" style={{ background: 'rgba(239,68,68,0.06)', animationDelay: '120ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <TrendingDown size={16} color="#DC2626" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-thai)' }}>{t('expense', lang)}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>
            {fmt(totalExpense)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>บาท</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-thai)' }}>
            {t('avgPerDay', lang, { n: fmt(avgExpense) })}
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/components/dashboard/DailyChart.tsx`:
  ```tsx
  'use client'
  import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
  import { useTheme } from '@/components/ThemeProvider'
  import { t } from '@/lib/i18n'
  import type { Lang, Transaction } from '@/lib/types'

  interface Props { transactions: Transaction[]; daysInMonth: number; lang: Lang }

  export function DailyChart({ transactions, daysInMonth, lang }: Props) {
    const { theme } = useTheme()

    const data = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, '0')
      const total = transactions
        .filter(tx => tx.type === 'expense' && tx.date.endsWith(`-${day}`))
        .reduce((s, tx) => s + tx.amount, 0)
      return { day: i + 1, amount: total }
    })

    return (
      <div className="tj-card anim-card">
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
          {t('dailyExpense', lang)}
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} barSize={6} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
              formatter={(v: number) => [`฿${v.toLocaleString()}`, '']}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Bar dataKey="amount" fill={theme.bar} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  ```

- [ ] Create `src/components/dashboard/TopCategories.tsx`:
  ```tsx
  'use client'
  import { useTheme } from '@/components/ThemeProvider'
  import { t } from '@/lib/i18n'
  import { fmt } from '@/lib/theme'
  import type { Lang, Transaction, Category } from '@/lib/types'

  interface Props { transactions: Transaction[]; categories: Category[]; lang: Lang }

  export function TopCategories({ transactions, categories, lang }: Props) {
    const { theme } = useTheme()
    const expenses = transactions.filter(tx => tx.type === 'expense')

    const totals = categories
      .filter(c => c.type === 'expense')
      .map(c => ({
        name: c.name,
        total: expenses.filter(tx => tx.category_id === c.id).reduce((s, tx) => s + tx.amount, 0),
      }))
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    const max = totals[0]?.total ?? 1

    return (
      <div className="tj-card anim-card">
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
          {t('topCategories', lang)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {totals.map(({ name, total }) => (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontFamily: 'var(--font-thai)', color: 'var(--text-primary)' }}>{name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>฿{fmt(total)}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-secondary)' }}>
                <div style={{
                  height: '100%', borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.accentLight}, ${theme.bar})`,
                  width: `${(total / max) * 100}%`,
                  transition: 'width 600ms ease-out',
                }} />
              </div>
            </div>
          ))}
          {totals.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', fontFamily: 'var(--font-thai)' }}>
              ยังไม่มีรายจ่ายเดือนนี้
            </p>
          )}
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/app/dashboard/page.tsx`:
  ```tsx
  'use client'
  import { useEffect, useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { ChevronDown, Globe } from 'lucide-react'
  import { getSupabase } from '@/lib/supabase/client'
  import { AppShell } from '@/components/AppShell'
  import { BottomNav } from '@/components/BottomNav'
  import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
  import { SummaryCards } from '@/components/dashboard/SummaryCards'
  import { DailyChart } from '@/components/dashboard/DailyChart'
  import { TopCategories } from '@/components/dashboard/TopCategories'
  import { useTheme } from '@/components/ThemeProvider'
  import { useTransactions } from '@/hooks/useTransactions'
  import { useBudgets } from '@/hooks/useBudgets'
  import { useCategories } from '@/hooks/useCategories'
  import { useLang } from '@/hooks/useLang'

  const MONTH_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

  export default function DashboardPage() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [lang, setLang] = useLang()
    const { setSpendingData } = useTheme()

    const now = new Date()
    const [year, setYear] = useState(now.getFullYear())
    const [month, setMonth] = useState(now.getMonth() + 1)

    useEffect(() => {
      getSupabase().auth.getUser().then(({ data }) => {
        if (!data.user) { router.push('/'); return }
        setUserId(data.user.id)
      })
    }, [router])

    const { transactions, loading } = useTransactions(userId, year, month)
    const { budgets, totalBudget } = useBudgets(userId)
    const { categories } = useCategories(userId)

    const totalExpense = transactions.filter(x => x.type === 'expense').reduce((s, x) => s + x.amount, 0)
    useEffect(() => { setSpendingData(totalExpense, totalBudget) }, [totalExpense, totalBudget])

    const daysInMonth = new Date(year, month, 0).getDate()
    const daysElapsed = year === now.getFullYear() && month === now.getMonth() + 1 ? now.getDate() : daysInMonth
    const expectedPct = Math.round((daysElapsed / daysInMonth) * 100)
    const actualPct   = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0

    const monthLabel = lang === 'th' ? `${MONTH_TH[month - 1]} ${year + 543}` : `${new Date(year, month - 1).toLocaleString('en', { month: 'long' })} ${year}`

    if (loading) return <AppShell><div style={{ flex: 1 }} /></AppShell>

    return (
      <AppShell>
        {/* Header */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-thai)', fontWeight: 600, fontSize: 15 }}>
            {monthLabel} <ChevronDown size={16} />
          </button>
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-full)',
            padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Globe size={13} /> {lang === 'th' ? 'TH · EN' : 'EN · TH'}
          </button>
        </div>

        {/* Content */}
        <div className="scroll-hidden" style={{ flex: 1, padding: '8px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <BudgetProgress expectedPct={expectedPct} actualPct={actualPct} lang={lang} />
          <SummaryCards transactions={transactions} daysElapsed={daysElapsed} lang={lang} />
          <DailyChart transactions={transactions} daysInMonth={daysInMonth} lang={lang} />
          <TopCategories transactions={transactions} categories={categories} lang={lang} />
        </div>

        <BottomNav lang={lang} />
      </AppShell>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/app/dashboard/ src/components/dashboard/ && git commit -m "feat: add dashboard page with charts and budget progress"
  ```

---

## Task 10: Form Page

**Files:** `src/components/form/FormShell.tsx` and all `StepX.tsx`, `src/app/form/page.tsx`

- [ ] Create `src/components/form/FormShell.tsx`:
  ```tsx
  'use client'
  import { ArrowLeft } from 'lucide-react'

  interface Props {
    step: number
    totalSteps: number
    onBack: () => void
    children: React.ReactNode
    animDir: 'forward' | 'back'
  }

  export function FormShell({ step, totalSteps, onBack, children, animDir }: Props) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
          {step > 1
            ? <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <ArrowLeft size={22} color="var(--text-secondary)" />
              </button>
            : <div style={{ width: 30 }} />
          }
          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} style={{
                height: 8,
                width: i + 1 === step ? 24 : 8,
                borderRadius: 999,
                background: i + 1 === step ? 'var(--accent)' : 'var(--border)',
                transition: 'width 200ms ease-out, background 200ms ease-out',
              }} />
            ))}
          </div>
          <div style={{ width: 30 }} />
        </div>

        {/* Step content */}
        <div
          key={step}
          className={animDir === 'forward' ? 'anim-in-r' : 'anim-in-l'}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16px 32px' }}
        >
          {children}
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepType.tsx`:
  ```tsx
  import { TrendingUp, TrendingDown } from 'lucide-react'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  interface Props { lang: Lang; onSelect: (type: 'income' | 'expense') => void }

  export function StepType({ lang, onSelect }: Props) {
    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: 'center' }}>
          {t('formType', lang)}
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {([['income', TrendingUp, 'rgba(16,185,129,0.08)', '#059669'] , ['expense', TrendingDown, 'rgba(239,68,68,0.08)', '#DC2626']] as const).map(([type, Icon, bg, color]) => (
            <button key={type} onClick={() => onSelect(type)} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: bg, border: `1.5px solid ${color}20`,
              borderRadius: 'var(--r-lg)', padding: '20px 24px', cursor: 'pointer',
              transition: 'transform 120ms ease-out',
            }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'none')}
            >
              <Icon size={28} color={color} />
              <span style={{ fontFamily: 'var(--font-thai)', fontWeight: 600, fontSize: 18, color: 'var(--text-primary)' }}>
                {t(type, lang)}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepAmount.tsx`:
  ```tsx
  import { useState } from 'react'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  interface Props { lang: Lang; initial?: string; onNext: (amount: string) => void }

  export function StepAmount({ lang, initial = '', onNext }: Props) {
    const [value, setValue] = useState(initial)
    const display = value ? Number(value).toLocaleString('en-US') : ''

    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: 'center' }}>
          {t('formAmount', lang)}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <input
            type="number" inputMode="decimal" autoFocus
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="0"
            className="tj-input"
            style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, textAlign: 'right', flex: 1 }}
          />
          <span style={{ fontFamily: 'var(--font-thai)', color: 'var(--text-secondary)', fontSize: 18, flexShrink: 0 }}>
            {t('baht', lang)}
          </span>
        </div>
        <button
          className="tj-btn-primary"
          style={{ width: '100%' }}
          disabled={!value || Number(value) <= 0}
          onClick={() => onNext(value)}
        >
          {t('continue', lang)}
        </button>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepCategory.tsx`:
  ```tsx
  import { t } from '@/lib/i18n'
  import type { Lang, Category } from '@/lib/types'

  interface Props { lang: Lang; categories: Category[]; type: 'income' | 'expense'; initial?: string; onNext: (catId: string) => void }

  export function StepCategory({ lang, categories, type, initial, onNext }: Props) {
    const filtered = categories.filter(c => c.type === type).sort((a, b) => b.usage_count - a.usage_count)

    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: 'center' }}>
          {t('formCategory', lang)}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {filtered.map(cat => (
            <button key={cat.id} onClick={() => onNext(cat.id)} style={{
              background: cat.id === initial ? 'var(--accent)' : 'var(--surface-secondary)',
              color: cat.id === initial ? '#fff' : 'var(--text-primary)',
              border: '1.5px solid transparent', borderRadius: 'var(--r-xl)',
              padding: '10px 16px', cursor: 'pointer',
              fontFamily: 'var(--font-thai)', fontSize: 14, fontWeight: 500,
              transition: 'transform 180ms ease-out, background 150ms',
            }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepNote.tsx`:
  ```tsx
  import { useState } from 'react'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  interface Props { lang: Lang; initial?: string; onNext: (note: string) => void; onSkip: () => void }

  export function StepNote({ lang, initial = '', onNext, onSkip }: Props) {
    const [value, setValue] = useState(initial)
    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: 'center' }}>
          {t('formNote', lang)}
        </h1>
        <input
          type="text" autoFocus
          value={value} onChange={e => setValue(e.target.value)}
          placeholder={t('notePlaceholder', lang)}
          className="tj-input" style={{ marginBottom: 16 }}
          onKeyDown={e => e.key === 'Enter' && (value ? onNext(value) : onSkip())}
        />
        <button className="tj-btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={() => onNext(value)} disabled={!value}>
          {t('continue', lang)}
        </button>
        <button className="tj-btn-ghost" style={{ width: '100%' }} onClick={onSkip}>
          {t('skip', lang)} →
        </button>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepDate.tsx`:
  ```tsx
  import { useState } from 'react'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  interface Props { lang: Lang; initial?: string; onNext: (date: string) => void }

  export function StepDate({ lang, initial, onNext }: Props) {
    const today = new Date().toISOString().split('T')[0]
    const [value, setValue] = useState(initial ?? today)

    return (
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, marginBottom: 32, textAlign: 'center' }}>
          {t('formDate', lang)}
        </h1>
        <input type="date" value={value} onChange={e => setValue(e.target.value)} className="tj-input" style={{ marginBottom: 12 }} />
        <button className="tj-btn-ghost" style={{ width: '100%', marginBottom: 20 }} onClick={() => setValue(today)}>
          {t('today', lang)}
        </button>
        <button className="tj-btn-primary" style={{ width: '100%' }} onClick={() => onNext(value)} disabled={!value}>
          {t('continue', lang)}
        </button>
      </div>
    )
  }
  ```

- [ ] Create `src/components/form/StepConfirm.tsx`:
  ```tsx
  import { t } from '@/lib/i18n'
  import { fmt } from '@/lib/theme'
  import type { Lang, Category } from '@/lib/types'

  interface Draft { type: 'income' | 'expense'; amount: string; categoryId: string; note: string; date: string }
  interface Props { lang: Lang; draft: Draft; categories: Category[]; onSave: () => void; onEdit: () => void }

  export function StepConfirm({ lang, draft, categories, onSave, onEdit }: Props) {
    const cat = categories.find(c => c.id === draft.categoryId)
    const rows = [
      { label: t('fType', lang),     value: t(draft.type, lang) },
      { label: t('fAmount', lang),   value: `฿${fmt(Number(draft.amount))}` },
      { label: t('fCategory', lang), value: cat?.name ?? '—' },
      { label: t('fNote', lang),     value: draft.note || t('noNote', lang) },
      { label: t('fDate', lang),     value: draft.date },
    ]

    return (
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, marginBottom: 24, textAlign: 'center' }}>
          {t('formConfirm', lang)}
        </h2>
        <div className="tj-card" style={{ marginBottom: 24 }}>
          {rows.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
              <span style={{ fontWeight: 500, fontSize: 14, fontFamily: 'var(--font-thai)' }}>{value}</span>
            </div>
          ))}
        </div>
        <button className="tj-btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={onSave}>
          {t('save', lang)}
        </button>
        <button className="tj-btn-ghost" style={{ width: '100%' }} onClick={onEdit}>
          {t('edit', lang)}
        </button>
      </div>
    )
  }
  ```

- [ ] Create `src/app/form/page.tsx`:
  ```tsx
  'use client'
  import { useEffect, useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { getSupabase } from '@/lib/supabase/client'
  import { AppShell } from '@/components/AppShell'
  import { BottomNav } from '@/components/BottomNav'
  import { FormShell } from '@/components/form/FormShell'
  import { StepType } from '@/components/form/StepType'
  import { StepAmount } from '@/components/form/StepAmount'
  import { StepCategory } from '@/components/form/StepCategory'
  import { StepNote } from '@/components/form/StepNote'
  import { StepDate } from '@/components/form/StepDate'
  import { StepConfirm } from '@/components/form/StepConfirm'
  import { useCategories } from '@/hooks/useCategories'
  import { useTransactions } from '@/hooks/useTransactions'
  import { useLang } from '@/hooks/useLang'
  import { t } from '@/lib/i18n'

  interface Draft {
    type: 'income' | 'expense'
    amount: string
    categoryId: string
    note: string
    date: string
  }

  const TOTAL_STEPS = 6

  export default function FormPage() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [lang] = useLang()
    const [step, setStep] = useState(1)
    const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward')
    const [draft, setDraft] = useState<Partial<Draft>>({})
    const [toast, setToast] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)

    const now = new Date()
    const { categories } = useCategories(userId)
    const { transactions, addTransaction, editTransaction } = useTransactions(userId, now.getFullYear(), now.getMonth() + 1)

    useEffect(() => {
      getSupabase().auth.getUser().then(({ data }) => {
        if (!data.user) { router.push('/'); return }
        setUserId(data.user.id)
      })
    }, [router])

    function advance() { setAnimDir('forward'); setStep(s => s + 1) }
    function goBack()  { setAnimDir('back');    setStep(s => s - 1) }

    function prefillLast() {
      const last = [...transactions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      if (!last) return
      setEditId(last.id)
      setDraft({ type: last.type, amount: String(last.amount), categoryId: last.category_id, note: last.note ?? '', date: last.date })
      setAnimDir('forward')
      setStep(1)
    }

    async function handleSave() {
      if (!draft.type || !draft.amount || !draft.categoryId || !draft.date) return
      const tx = { type: draft.type, amount: Number(draft.amount), category_id: draft.categoryId, note: draft.note ?? null, date: draft.date }
      if (editId) {
        await editTransaction(editId, tx)
      } else {
        await addTransaction(tx)
      }
      setToast(true)
      setTimeout(() => { setToast(false); router.push('/dashboard') }, 1500)
    }

    return (
      <AppShell>
        <FormShell step={step} totalSteps={TOTAL_STEPS} onBack={goBack} animDir={animDir}>
          {step === 1 && (
            <>
              <StepType lang={lang} onSelect={type => { setDraft(d => ({ ...d, type })); advance() }} />
              {transactions.length > 0 && (
                <button onClick={prefillLast} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', display: 'block', width: '100%', marginTop: 24, fontFamily: 'var(--font-thai)' }}>
                  {t('editLast', lang)} →
                </button>
              )}
            </>
          )}
          {step === 2 && <StepAmount lang={lang} initial={draft.amount} onNext={amount => { setDraft(d => ({ ...d, amount })); advance() }} />}
          {step === 3 && draft.type && <StepCategory lang={lang} categories={categories} type={draft.type} initial={draft.categoryId} onNext={categoryId => { setDraft(d => ({ ...d, categoryId })); advance() }} />}
          {step === 4 && <StepNote lang={lang} initial={draft.note} onNext={note => { setDraft(d => ({ ...d, note })); advance() }} onSkip={() => { setDraft(d => ({ ...d, note: '' })); advance() }} />}
          {step === 5 && <StepDate lang={lang} initial={draft.date} onNext={date => { setDraft(d => ({ ...d, date })); advance() }} />}
          {step === 6 && draft.type && draft.amount && draft.categoryId && draft.date && (
            <StepConfirm lang={lang} draft={draft as any} categories={categories} onSave={handleSave} onEdit={() => { setAnimDir('back'); setStep(1) }} />
          )}
        </FormShell>

        {toast && (
          <div style={{
            position: 'fixed', bottom: 84, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--text-primary)', color: '#fff', padding: '12px 20px',
            borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-thai)',
            boxShadow: '0 8px 24px rgba(28,25,23,0.3)', zIndex: 60,
          }}>
            {t('saved', lang)}
          </div>
        )}

        <BottomNav lang={lang} />
      </AppShell>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/app/form/ src/components/form/ && git commit -m "feat: add 6-step form with slide animations"
  ```

---

## Task 11: Budget Page

**Files:** `src/components/budget/BudgetCategoryRow.tsx`, `src/components/budget/AddCategorySheet.tsx`, `src/app/budget/page.tsx`

- [ ] Create `src/components/budget/BudgetCategoryRow.tsx`:
  ```tsx
  import { useState } from 'react'
  import { Trash2 } from 'lucide-react'
  import { fmt } from '@/lib/theme'
  import { t } from '@/lib/i18n'
  import type { Lang, Category, Budget } from '@/lib/types'

  interface Props {
    category: Category
    budget?: Budget
    lang: Lang
    onBudgetChange: (catId: string, amount: number) => void
    onDelete: (catId: string) => void
    showAmount: boolean
  }

  export function BudgetCategoryRow({ category, budget, lang, onBudgetChange, onDelete, showAmount }: Props) {
    const [value, setValue] = useState(budget ? String(budget.amount) : '')

    function handleBlur() {
      const n = Number(value)
      if (!isNaN(n) && n >= 0) onBudgetChange(category.id, n)
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-thai)', fontSize: 15 }}>{category.name}</span>
        {showAmount && (
          <input
            type="number" value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={handleBlur}
            placeholder={t('notSet', lang)}
            style={{
              width: 100, textAlign: 'right', border: 'none', background: 'transparent',
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
              color: 'var(--text-primary)', outline: 'none',
            }}
          />
        )}
        <button onClick={() => onDelete(category.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Trash2 size={16} color="var(--text-muted)" />
        </button>
      </div>
    )
  }
  ```

- [ ] Create `src/components/budget/AddCategorySheet.tsx`:
  ```tsx
  import { useState } from 'react'
  import { X } from 'lucide-react'
  import { t } from '@/lib/i18n'
  import type { Lang } from '@/lib/types'

  interface Props { lang: Lang; type: 'income' | 'expense'; onAdd: (name: string) => void; onClose: () => void }

  export function AddCategorySheet({ lang, type, onAdd, onClose }: Props) {
    const [name, setName] = useState('')

    return (
      <>
        {/* Backdrop */}
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
        {/* Sheet */}
        <div className="anim-sheet" style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, background: 'var(--surface)',
          borderRadius: '24px 24px 0 0', padding: 24, zIndex: 50,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>{t('newCategory', lang)}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
          </div>
          <input
            autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder={t('categoryName', lang)} className="tj-input" style={{ marginBottom: 16 }}
            onKeyDown={e => e.key === 'Enter' && name && (onAdd(name), onClose())}
          />
          <button className="tj-btn-primary" style={{ width: '100%' }} disabled={!name} onClick={() => { onAdd(name); onClose() }}>
            {t('save', lang)}
          </button>
        </div>
      </>
    )
  }
  ```

- [ ] Create `src/app/budget/page.tsx`:
  ```tsx
  'use client'
  import { useEffect, useState } from 'react'
  import { useRouter } from 'next/navigation'
  import { Plus } from 'lucide-react'
  import { getSupabase } from '@/lib/supabase/client'
  import { AppShell } from '@/components/AppShell'
  import { BottomNav } from '@/components/BottomNav'
  import { BudgetCategoryRow } from '@/components/budget/BudgetCategoryRow'
  import { AddCategorySheet } from '@/components/budget/AddCategorySheet'
  import { useCategories } from '@/hooks/useCategories'
  import { useBudgets } from '@/hooks/useBudgets'
  import { useLang } from '@/hooks/useLang'
  import { t } from '@/lib/i18n'
  import { fmt } from '@/lib/theme'

  export default function BudgetPage() {
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)
    const [lang] = useLang()
    const [sheet, setSheet] = useState<'income' | 'expense' | null>(null)

    const { categories, addCategory, deleteCategory } = useCategories(userId)
    const { budgets, setBudget, totalBudget } = useBudgets(userId)

    useEffect(() => {
      getSupabase().auth.getUser().then(({ data }) => {
        if (!data.user) { router.push('/'); return }
        setUserId(data.user.id)
      })
    }, [router])

    const expenseCategories = categories.filter(c => c.type === 'expense')
    const incomeCategories  = categories.filter(c => c.type === 'income')

    return (
      <AppShell>
        {/* Header */}
        <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>{t('budgetTitle', lang)}</h2>
        </div>

        <div className="scroll-hidden" style={{ flex: 1, padding: '8px 16px 24px' }}>
          {/* Expense budgets */}
          <div className="tj-card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-thai)' }}>
              {t('expense', lang)}
            </div>
            {expenseCategories.map(cat => (
              <BudgetCategoryRow key={cat.id} category={cat} budget={budgets.find(b => b.category_id === cat.id)}
                lang={lang} onBudgetChange={setBudget} onDelete={deleteCategory} showAmount />
            ))}
            {/* Total row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, fontWeight: 700 }}>
              <span style={{ fontFamily: 'var(--font-thai)' }}>{t('totalBudget', lang)}</span>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: 18 }}>฿{fmt(totalBudget)}</span>
            </div>
            <button onClick={() => setSheet('expense')} className="tj-btn-ghost" style={{
              width: '100%', marginTop: 12,
              borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Plus size={16} /> {t('addCategory', lang)}
            </button>
          </div>

          {/* Income categories (name-only) */}
          <div className="tj-card">
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-thai)' }}>
              {t('income', lang)}
            </div>
            {incomeCategories.map(cat => (
              <BudgetCategoryRow key={cat.id} category={cat} lang={lang}
                onBudgetChange={() => {}} onDelete={deleteCategory} showAmount={false} />
            ))}
            <button onClick={() => setSheet('income')} className="tj-btn-ghost" style={{
              width: '100%', marginTop: 12,
              borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Plus size={16} /> {t('addCategory', lang)}
            </button>
          </div>
        </div>

        {sheet && (
          <AddCategorySheet lang={lang} type={sheet}
            onAdd={name => addCategory(name, sheet)}
            onClose={() => setSheet(null)}
          />
        )}

        <BottomNav lang={lang} />
      </AppShell>
    )
  }
  ```

- [ ] Commit:
  ```bash
  git add src/app/budget/ src/components/budget/ && git commit -m "feat: add budget page with category management"
  ```

---

## Task 12: First-Login Category Seeding

**Files:** `src/lib/db.ts` (already has `seedCategories`), called from login callback

- [ ] Add `src/app/auth/callback/route.ts` (Supabase OAuth redirect handler):
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  import { seedCategories, getOrCreateProfile } from '@/lib/db'

  export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    if (!code) return NextResponse.redirect(`${origin}/`)

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } },
    )

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    if (!session) return NextResponse.redirect(`${origin}/`)

    const user = session.user
    const profile = await getOrCreateProfile(user.id, user.email!, user.user_metadata?.full_name ?? '')

    // Only seed on first login (profile was just created = created_at within last 10 seconds)
    const isNew = Date.now() - new Date(profile.created_at).getTime() < 10_000
    if (isNew) await seedCategories(user.id)

    return NextResponse.redirect(`${origin}/dashboard`)
  }
  ```

- [ ] Update `src/app/page.tsx` OAuth options to use the callback URL:
  ```ts
  options: { redirectTo: `${location.origin}/auth/callback` }
  ```
  *(replace the earlier `/dashboard` redirectTo)*

- [ ] Commit:
  ```bash
  git add src/app/auth/ src/app/page.tsx && git commit -m "feat: handle OAuth callback and seed first-login categories"
  ```

---

## Task 13: Deployment

- [ ] Create `.env.local.example` (commit this, not `.env.local`):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  ```

- [ ] Push repo to GitHub:
  ```bash
  git remote add origin https://github.com/<your-username>/tongjod.git
  git push -u origin main
  ```

- [ ] In Supabase dashboard → Authentication → URL Configuration:
  - Site URL: `https://tongjod.vercel.app`
  - Redirect URLs: `https://tongjod.vercel.app/auth/callback`

- [ ] In Vercel:
  - Import GitHub repo
  - Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Deploy

- [ ] Verify: open deployed URL → login with Google → dashboard loads with green/yellow/red theme → form saves transactions → budget page editable

- [ ] Commit any final tweaks:
  ```bash
  git add . && git commit -m "chore: deployment configuration"
  ```

---

## Self-Review Checklist

- [x] Google OAuth + middleware redirect covered (Tasks 4, 12)
- [x] RLS policies on all 4 tables (Task 2)
- [x] Dynamic gradient theme shifts on all pages (Task 7 ThemeProvider)
- [x] Budget status: excellent / onTrack / over / default (Task 3 theme.ts)
- [x] 6-step form with slide animations + edit last entry (Task 10)
- [x] Category usage_count increment (Task 8 db.ts `insertTransaction`)
- [x] Thai/English toggle persisted to localStorage (Task 8 useLang)
- [x] Dashboard: progress bar, summary cards, daily chart, top 5 (Task 9)
- [x] Budget: inline edit amounts, soft-delete categories, add new (Task 11)
- [x] First-login preset category seeding (Task 12)
- [x] Vercel + Supabase deployment (Task 13)
- [x] Status messages always Thai regardless of lang setting (randomMessage() in theme.ts)
- [x] Font: Plus Jakarta Sans + Inter + Noto Sans Thai (Task 5 globals.css)
