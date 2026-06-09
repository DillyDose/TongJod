# TongJod — Income & Expense Web App Design Spec

**Date:** 2026-06-09  
**Stack:** Next.js App Router + Supabase + Vercel  
**Language:** Thai / English (user-switchable)

---

## 1. Overview

A personal income and expense tracker for personal use, open to anyone with a Google account. Each user sees only their own data. The app has three pages: Dashboard, Form, and Budget. The core experience is a conversational step-by-step form and a dynamic dashboard that reacts to budget health with color gradients and randomized Thai status messages.

---

## 2. Architecture

```
User (Browser)
    ↓
Next.js App Router (Vercel)
    ├── /             → Login page (if not authenticated)
    ├── /dashboard    → Dashboard
    ├── /form         → Step-by-step entry form
    └── /budget       → Budget & category settings
    ↓
Supabase
    ├── Auth          → Google OAuth only
    ├── PostgreSQL    → profiles, categories, transactions, budgets
    └── Row Level Security (RLS) → users see only their own data
```

- All data fetching is client-side via Supabase JS SDK
- Next.js middleware redirects unauthenticated users to the login page
- No custom backend — Supabase RLS handles all data isolation
- Language preference stored in `localStorage` and synced to the `profiles` table

---

## 3. Database Schema

### `profiles`
| column | type | note |
|---|---|---|
| id | uuid | mirrors Supabase auth user id |
| email | text | |
| display_name | text | |
| language | text | `'th'` or `'en'`, default `'th'` |
| created_at | timestamp | |

### `categories`
| column | type | note |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → profiles |
| name | text | e.g. "Food & Drinks" |
| type | text | `'income'` or `'expense'` |
| is_deleted | boolean | soft delete, default false |
| usage_count | integer | incremented each time user picks this category in the form, default 0 |
| created_at | timestamp | |

### `transactions`
| column | type | note |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → profiles |
| type | text | `'income'` or `'expense'` |
| amount | numeric | Thai Baht |
| category_id | uuid | FK → categories |
| note | text | nullable |
| date | date | user-selected, defaults to today |
| created_at | timestamp | used to determine "last transaction" |

### `budgets`
| column | type | note |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → profiles |
| category_id | uuid | FK → categories (expense only) |
| amount | numeric | monthly budget limit in Baht |
| updated_at | timestamp | |

---

## 4. Auth Flow

- Landing page (`/`) shows a single "Sign in with Google" button
- On first login: auto-create profile + seed preset categories for the user
- On subsequent logins: redirect straight to `/dashboard`
- Any unauthenticated route access redirects to `/`

---

## 5. Pages

### 5.1 Dashboard (`/dashboard`)

**Filter:** month/year selector at the top, defaults to current month/year.

**Budget Progress Bar**
- Two markers on a single bar: Expected progress vs Actual progress
- Expected = (days elapsed ÷ total days in month)
- Actual = (total expense for the month ÷ sum of all category budgets)
- Bar color and entire app gradient theme reflect budget status

**Budget Status Tiers**
| Status | Condition | Theme |
|---|---|---|
| Over budget | actual > expected | 🔴 Red gradient |
| On track | actual ≤ expected AND actual > (expected − 10%) | 🟡 Yellow/amber gradient |
| Excellent | actual ≤ (expected − 10%) | 🟢 Green gradient |
| No budget set | budgets table empty | Neutral/default gradient |

**Status Messages (Thai, randomly picked per load)**

Over budget (3+ phrases):
- "ใช้เงินเยอะเกินไปแล้วนะ!"
- "ระวังด้วย! งบเกินแล้ว"
- "โอ้โห ใช้หนักไปหน่อยนะเดือนนี้"

On track (3+ phrases):
- "ทำได้ตามแผนเลย ดีมาก!"
- "ยังอยู่ในงบ สู้ต่อไป!"
- "เป๊ะมากเลย ไปได้สวย!"

Excellent (3+ phrases):
- "เก่งมาก ประหยัดได้เยอะสุดๆ"
- "ยอดเยี่ยม! ประหยัดกว่าแผนมาก"
- "สุดยอด! เงินเหลือเยอะเลย"

**Summary Cards** (side by side)
- Income card: total for month + avg per day
- Expense card: total for month + avg per day

**Expense Timeline Chart**
- Line/bar chart: x-axis = days in month, y-axis = expense amount per day (not cumulative)
- Shows daily spending spikes clearly

**Top 5 Expense by Category**
- Horizontal bar chart, top 5 categories by total spend for the selected month

**Navigation**
- Mobile: fixed bottom nav with 3 tabs — Dashboard / Form / Budget
- Desktop: sidebar or top nav with the same 3 items

---

### 5.2 Form (`/form`)

Step-by-step conversational flow. Each step slides in only after the previous is answered. Slide-right animation going forward, slide-left going back.

**Steps:**
1. **Type** — two large buttons: Income / Expense
2. **Amount** — number input, auto-focus, currency in Thai Baht
3. **Category** — chip grid sorted by most-used first (tracks per-user usage frequency); category list filtered by type selected in step 1
4. **Note** — text input with a visible "Skip" option
5. **Date** — date picker, defaults to today
6. **Confirm** — summary card showing all selections; Submit button to save

**Progress indicator** — step dots or bar at the top (e.g. Step 3 of 6)

**Edit last transaction** — a small "Edit last entry" button on the form page. Pre-fills the form with the most recent transaction's data. On submit, overwrites that transaction (no new row created). Only the single most recent transaction is editable.

**Category usage tracking** — each time a category is selected in the form, increment `categories.usage_count` for that row. Sort chip grid by `usage_count` descending.

---

### 5.3 Budget (`/budget`)

**Expense budget list**
- All active expense categories shown
- Each row: category name + editable amount input
- Categories with no budget set show a placeholder (e.g. "Set budget")
- Total monthly budget displayed at the bottom (auto-sum of all rows)

**Income categories section**
- Separate section below for income category names only
- No budget amount — name management only

**Category management (both sections)**
- Add new custom category (name input + type)
- Soft-delete a category: sets `is_deleted = true`
  - Existing transactions keep their `category_id` link (historical data preserved, still shown in charts)
  - Deleted category no longer appears in the form's category picker

**First-time setup**
- On first login, preset categories are auto-seeded per user

**Preset expense categories:**
Food & Drinks, Transport, Shopping, Entertainment, Health, Housing/Rent, Utilities, Education, Personal Care, Others

**Preset income categories:**
Salary, Freelance, Investment, Gift, Others

---

## 6. Language & Theming

**i18n**
- Toggle between Thai (`th`) and English (`en`) in the app header
- All UI labels, buttons, and navigation translate
- Status messages always remain in Thai (they are the personality of the app)
- Preference persisted in `localStorage` and synced to `profiles.language`

**Gradient Theme**
- Entire app background uses a gradient that shifts based on budget status
- Recalculated every time the dashboard loads or the month filter changes
- Applied globally so all pages reflect the current status color

---

## 7. Deployment

- **Frontend:** Vercel (connected to GitHub repo, auto-deploy on push to main)
- **Backend:** Supabase (hosted, managed PostgreSQL + Auth)
- **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` stored in Vercel project settings
