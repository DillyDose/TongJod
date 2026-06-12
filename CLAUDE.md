# TongJod — Claude Instructions

## Session start (REQUIRED — do this before anything else)

1. Read [PROGRESS.md](PROGRESS.md) — understand what's done, what's pending, which branch is active
2. If the user's request touches design/layout: also read [docs/design-spec.md](docs/design-spec.md)
3. State the current situation in one sentence before proceeding

Skip steps 1–3 only if you were dispatched as a subagent for a specific narrowly-scoped task.

## Project overview

Personal income/expense tracker (Thai-first, EN toggle), Duolingo-style playful design.
Three pages: **Dashboard** (budget status + history), **Form** (6-step entry), **Budget** (per-category budgets).
The whole color theme shifts green / orange / red based on how spending compares to budget pace.

- Stack: Next.js 15 App Router · Supabase (Google OAuth + Postgres + RLS) · Vercel
- Repo: https://github.com/DillyDose/TongJod

## Key files

| File | Purpose |
|---|---|
| [PROGRESS.md](PROGRESS.md) | Running status, backlog, key decisions — the source of truth |
| [docs/design-spec.md](docs/design-spec.md) | Full Duolingo-style design tokens + 7-screen specs |
| `src/lib/i18n.ts` | All UI strings — always use `t(key, lang, vars)`, never hardcode |
| `src/lib/icons.ts` | Category icon map — always use `categoryIcon(name)` |
| `src/lib/dates.ts` | Local-timezone date helpers — use `todayISO()` / `yesterdayISO()`, **never** `toISOString()` (causes UTC day-shift bug for UTC+7) |

## Workflow

- `dev` branch → every push gets a **Vercel preview URL** for testing on a real phone
- `master` = production — merge only after user approves the preview
- Checks before pushing: `npm run type-check` · `npx vitest run` · `npm run build`

## Conventions

- Commit prefixes: `feat:` / `fix:` / `docs:` / `chore:` (lowercase)
- Tests live in `tests/` (vitest); pure logic files get unit tests
- Input `font-size` must be ≥ 16px — prevents iOS Safari auto-zoom on focus
- Animations always play — `prefers-reduced-motion` block was intentionally removed (owner's Windows reports reduced motion but wants animations; revert is 6 lines in globals.css)
- Soft-delete categories (`is_deleted` boolean); budgets of deleted categories are excluded from totals

## After completing work (REQUIRED)

When meaningful work lands, before ending the session:

1. Add a dated entry to `PROGRESS.md` — **newest on top**, format:
   ```
   **YYYY-MM-DD — [Short title] (on `dev`, not yet released)** or (released)
   - bullet: what changed
   - bullet: key decision made and WHY
   ```
2. Move completed backlog items into the ✅ Done section; add new discovered items to 🔜 Backlog
3. If a decision was made that would otherwise be re-debated, add it to the 📌 Key decisions table with a *why*
4. Commit the doc update: same commit as the work, or a follow-up `docs: update PROGRESS.md`

**What counts as meaningful:** feature shipped, bug fixed, architectural decision, new utility file created, workflow changed.  
**Skip for:** cosmetic tweaks, type-only fixes, refactors with no behavior change.
