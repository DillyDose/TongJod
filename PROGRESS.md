# TongJod — Project Progress

> Living document: update whenever meaningful work lands. Newest entries on top.
> Goal: anyone (human or AI) reading this file understands the project's full context.

## What is TongJod

A personal income/expense tracker (Thai-first, EN toggle) with a Duolingo-style playful design.
Three pages: **Dashboard** (budget status + charts + history), **Form** (step-by-step entry),
**Budget** (per-category budgets + category management). The app's personality: the whole
color theme shifts green/orange/red based on how the user's spending compares to their budget pace.

- **Stack:** Next.js 15 (App Router) · Supabase (Google OAuth + Postgres + RLS) · Vercel
- **Repo:** https://github.com/DillyDose/TongJod
- **Production:** https://vercel.com/patsapol-s-projects/tongjod (deploys from `master`)
- **Design specs:** [docs/design-spec.md](docs/design-spec.md) · [docs/superpowers/specs/2026-06-09-income-expense-design.md](docs/superpowers/specs/2026-06-09-income-expense-design.md)

## Workflow (decided 2026-06-11)

- Daily work happens on the **`dev` branch** → every push gets a **Vercel preview URL** for testing on a real phone.
- **`master` = production.** Merge `dev` → `master` only after the preview is approved.
- Local dev: `npm run dev` (http://localhost:3000). Checks before pushing: `npm run type-check`, `npx vitest run`, `npm run build`.

## Status

### ✅ Done

**2026-07-07 — Fix: iOS keyboard covered the form's Continue/Save buttons → "can't save" (on `dev`, pending phone test)**
- **Symptom:** second user (iPhone Safari) couldn't save any transaction after the 2026-07-07 production merge; owner (iPhone Chrome) could. Zero `POST /transactions` reached Supabase — pure client-side.
- **Root cause:** the amount step grew ~130px taller in that merge (quick-add template chips + `+`/`−` operator chips). With the input's `autoFocus` opening the iOS keyboard on arrival, the ต่อไป button (y≈584–640 on a 812pt phone) sat fully under the keyboard (top ≈477–522). iOS overlays the keyboard **without shrinking `dvh`**, so the inner scroll container had `overflow: 0` — the button was unreachable and untappable, with no way to scroll to it.
- **Why only her:** template chips render only when history has a recurring (category, amount) pair ≥2× — she had one (เดินทาง ฿35 ×3), the owner didn't. Her button was pushed ~76px lower than his, below the keyboard line.
- **Fix:** (1) removed `autoFocus` from StepAmount + StepDetails so the keyboard doesn't open on arrival; (2) `useKeyboardInset()` in FormShell — tracks `window.visualViewport` and pads the scroll container by the keyboard overlap, so content above the keyboard is always scrollable-into-view.
- **Debugging notes:** confirmed via Supabase API logs (form loads with zero POSTs, repeated visits + logout/relogin = user retrying), DB (no successful saves by anyone after the deploy), and a local prod build walkthrough with a mocked Supabase client + button geometry measurement.

**2026-07-04 — Fix avg/day miscalculation and category-sheet centering bug (on `dev`, not yet released)**
- `SummaryCards` was dividing income/expense totals by `daysElapsed` (days so far this month) instead of `daysInMonth`, so the avg/day figure kept changing shape as the month progressed. Now divides by total days in the month.
- `AddCategorySheet`'s bottom sheet centered itself with `left: 50%; transform: translateX(-50%)`, but its `anim-sheet` slide-up animation also drives the `transform` property via CSS keyframes — animations own `transform` outright, so once the animation finished the centering transform was wiped out, leaving the sheet pinned at the viewport's horizontal center point (shifted right by half its own width) instead of actually centered. Fixed by centering via `left: 0; right: 0; margin: 0 auto` instead, which doesn't touch `transform`.
- Also physically deleted `src/lib/supabase/server.ts` and the Stitch design-reference zip/output files — these were untracked from git in an earlier cleanup pass but never actually removed from disk.

**2026-06-29 — Month-specific budgets (on `dev`, not yet released)**
- Budget page now has `< June 2026 >` month selector (prev/next arrows, same pattern as dashboard, no future-month restriction)
- `budgets` table gains `year` and `month` columns; unique constraint changed from `(user_id, category_id)` to `(user_id, category_id, year, month)`; existing rows migrated to 2026/6 via migration file `20260629000001_budgets_monthly.sql`
- Auto-copy: navigating to a month with no budgets clones from the most recent prior month and saves to DB immediately; full race-condition guard (seq counter) mirrors `useTransactions` pattern
- Dashboard `useBudgets` call now passes `year`/`month` so budget progress bar reflects the selected month, not always the current month
- `monthLabel(year, month, lang)` helper extracted to `src/lib/dates.ts`; dashboard removes its inline `MONTH_TH`/`MONTH_EN` arrays
- New `totalBudgetMonth` i18n key with `{m}` variable for dynamic month subtitle
- New tests: `tests/hooks/useBudgets.test.ts` (6 cases: happy path, auto-copy, no prior data, race condition, setBudget, totalBudget filter); `monthLabel` cases added to `dates.test.ts`; new i18n key case added to `i18n.test.ts`

**2026-06-12 — Form UX batch: 5-step form, calculator input, quick templates, time-aware categories, PWA manifest (on `dev`, not yet released)**
- **Note + date merged into one Details step** (6 → 5 steps): both fields are optional/low-friction,
  so they share a screen — note input, date picker, Today/Yesterday chips, never-disabled Continue
- **Calculator amount input**: the amount field accepts `120+45+30` with a live `= ฿195` line;
  `+`/`−` chips under the field because the iOS decimal keypad has no operator keys; quick-amount
  buttons now build a visible expression instead of silently summing; only the evaluated total
  ever reaches the draft/DB (new pure `lib/calc.ts`)
- **Quick-add template chips** on the amount step: top 3 recurring (category, amount) pairs from
  the last 200 transactions (≥2 occurrences), one tap → prefilled Confirm with today's date —
  typical repeat entry is now 2 taps; hidden in edit mode and for income (new `lib/suggest.ts` +
  `fetchRecentTransactions` in `lib/db`)
- **Time-of-day aware category ordering**: the category grid is reordered by usage in the current
  time bucket (morning/midday/evening/night), falling back to plain `usage_count` when the bucket
  has <3 transactions — new users see no change
- **Installable PWA**: `src/app/manifest.ts` (standalone, opens on `/form`), theme color, placeholder
  ฿ icons via `scripts/generate-icons.mjs` (replace artwork + re-run anytime). Deliberately NO
  service worker — installability without cache-invalidation complexity
- New tests: `lib/calc`, `lib/suggest`, `StepDetails`, `StepAmount`, `form-quick-template` (63 total)

**2026-06-12 — Bug sweep #2: edit-mode data-overwrite + stale-data fixes (on `dev`, not yet released)**
- **Edit mode now follows the URL** (`useSearchParams`): tapping the "+" tab while editing used to keep
  the edit state silently — saving a "new" entry overwrote the old transaction. Now `/form` without
  `?edit` always resets to a fresh entry; "edit last entry" also writes `?edit=<id>` into the URL so
  every entry point behaves the same
- `latestTx` is updated after an edit-save — previously "แก้ไขรายการล่าสุด" prefilled pre-edit values
  and could revert the edit
- Month-switch race fixed in `useTransactions`: latest-request-wins guard (fast prev/next month could
  show the wrong month's data)
- Undo-delete restores into the DB but only into the visible list when the viewed month matches the
  entry's month (new pure helper `isoInMonth` in `lib/dates`)
- Snackbar gets `key={deleted.id}` so the 5s auto-close timer restarts per deleted item
  (consecutive deletes used to close the second snackbar almost immediately)
- i18n: `บาท` in SummaryCards and the TopCategories empty state now go through `t()` (EN mode showed Thai)
- Update payload no longer includes `user_id`; removed dead `getOrCreateProfile`/`seedCategories`
  from `lib/db` (seeding lives in `auth/callback/route.ts`); CLAUDE.md drift fixed
  (`gestures.ts` reference removed, soft-delete is `is_deleted` not `deleted_at`)
- New tests: `tests/hooks/useTransactions.test.ts`, `tests/app/form-edit-mode.test.tsx`,
  `tests/components/i18n-leaks.test.tsx` — first React Testing Library page/hook tests in the repo

**2026-06-11 — Tinder-style swipe on form steps (on `dev`, not yet released)**
- Step now follows the finger in real time (translate + slight rotate + fade), flies off on commit, springs back on cancel — replaces the old "detect at finger-lift only" swipe that gave no feedback and ignored slow drags
- Commit = drag past 90px OR fast flick (≥0.5 px/ms after ≥30px); fast yank back toward start always cancels
- Disabled directions (invalid step, confirm step) rubber-band at 1/3 instead of doing nothing silently — validity gates moved from the handlers into `canSwipeForward`/`canSwipeBack` in form/page.tsx so FormShell knows mid-drag
- Switched touch events → pointer events: swipe now also works with a mouse (desktop testing) — capture starts only after horizontal axis-lock so taps still click; one post-drag ghost click is swallowed
- `lib/gestures.ts` rewritten as pure helpers (`lockAxis`, `dragOffset`, `shouldCommitSwipe`) with unit tests; `detectSwipe` removed

**2026-06-11 — Seamless navigation (on `dev`, not yet released)**
- Direction-aware page slide transitions between tabs; bottom nav stays stationary
- Swipe left/right on form steps = continue/back (validated per step; confirm step still needs a tap)
- Removed the prefers-reduced-motion kill switch — animations always play (user's Windows has OS animations off)

**2026-06-11 — Mobile layout fixes (released)**
- Amount input no longer overflows the screen (flex min-width bug, was 583px on a 375px phone)
- App frame locked to 100dvh: every page same width, content scrolls inside, bottom nav frozen
- 16px minimum input font (stops iOS focus zoom), safe-area padding, explicit viewport

**2026-06-11 — Bug sweep + UX features (released)**
- Fixed 16 usability bugs: dead month selector, budgets wiping to ฿0, double-save duplicates,
  UTC date shift (TH timezone), deleted categories inflating totals, theme resets across pages,
  stale status messages, half-translated EN mode, missing icons, no logout, and more
- New features: transaction history with tap-to-edit + delete, month navigation,
  per-category spent-vs-budget bars, undo snackbars, "add another entry", expense-first form,
  net balance card

**2026-06-09/10 — Initial build (released)**
- Full app: auth, dashboard, 6-step form, budget page, i18n, dynamic theme, Duolingo-style redesign

### 🔜 Next / Backlog

- [ ] Apply DB migration `20260629000001_budgets_monthly.sql` to the remote Supabase project (run SQL in dashboard or `supabase db push`)
- [ ] User testing of the navigation features on the `dev` preview → then release to `master`
- [ ] Separate **dev database** (second Supabase project) so local/preview testing stops touching production data
- [ ] Service worker / offline shell (installable manifest shipped 2026-06-12; offline is a separate phase)
- [ ] Real app icon artwork (current ฿ icon is a generated placeholder — see `scripts/generate-icons.mjs`)
- [ ] Daily logging reminder or streak counter (fits the Duolingo personality)
- [ ] CSV export of a month
- [ ] Supabase redirect allow-list for preview URLs (Google login on `*-patsapol-s-projects.vercel.app`)

### 📌 Key decisions (and why)

| Decision | Why |
|---|---|
| Form defaults to **expense**, starting on the amount step | Expenses are ~90% of entries; saves a tap. Income reachable via the type chip / back |
| **Undo snackbar** instead of delete confirmations | Keeps the flow fast; mistakes are recoverable instead of prevented with friction |
| Animations **ignore prefers-reduced-motion** | The owner's Windows reports reduced motion but they explicitly want the animations (revert is 6 lines in globals.css if ever needed) |
| Status messages stay **Thai-only** in EN mode | They are the app's personality (per original spec) |
| Soft-delete categories; budgets of deleted categories excluded from totals | Preserves history in charts while keeping the math honest |
| `dev` → preview → `master` workflow | Owner wants to test features before they hit production |
| Form edit mode is driven by the `?edit=` URL param (single source of truth) | Component state alone couldn't tell "+ tab" apart from edit mode — saving a "new" entry overwrote the edited transaction. Every prefill writes the param; no param = fresh entry |
| Budgets keyed by `(user_id, category_id, year, month)` — fully independent per month | Users need to track different budget amounts per month; a single global budget per category was too rigid |
| Auto-copy from most recent prior month on first visit to a new month | Avoids making users re-enter the same amounts every month while still keeping months independent |
| Note + date merged into one Details step (5 steps) | Both optional/low-friction; one screen fewer per entry |
| Amount input supports `+`/`-` only (no `*` `/`) | Receipt-summing use case; left-to-right eval, no precedence rules; operator chips because the iOS decimal pad has no `+` |
| Template chips jump to Confirm, never instant-save | A mis-tap must not write to the DB; one extra tap is the safety margin |
| Template = (category, amount) pair seen ≥2× in last 200 tx, top 3 by count then recency | One bounded `fetchRecentTransactions` query, no month-window stitching |
| Time buckets 5–10 / 11–14 / 15–20 / 21–4 with `usage_count` fallback under 3 bucket-tx | Avoids garbage ordering on thin data; empty history = unchanged behavior |
| PWA = manifest + icons only, no service worker | Installability without cache-invalidation complexity; offline shell is a separate later phase |

## Conventions

- Commit style: `fix:` / `feat:` / `chore:` prefixes, lowercase
- Tests live in `tests/` (vitest); pure logic gets unit tests (`lib/dates`, `lib/theme`, `lib/i18n`); hook/page behavior tests use React Testing Library (`tests/hooks/`, `tests/app/`, `tests/components/`)
- All UI strings go through `t()` in [src/lib/i18n.ts](src/lib/i18n.ts); category icons through [src/lib/icons.ts](src/lib/icons.ts); dates through [src/lib/dates.ts](src/lib/dates.ts) (local timezone, never `toISOString()`)
