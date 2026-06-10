---
name: TongJod
version: "1.0"
description: >
  Personal income & expense tracker for Thai users. Mobile-first (390px wide).
  Visual style: Duolingo-inspired — bold, rounded, high-contrast, cozy.
  No mascot. Language: Thai (th) primary, English (en) secondary.

colors:
  # Base palette
  background: "#FFFFFF"
  surface: "#FFFFFF"
  surface-secondary: "#F7F7F7"
  text-primary: "#1C1917"
  text-secondary: "#777777"
  text-muted: "#AAAAAA"
  border: "#E5E5E5"

  # Excellent budget status (spending well under target)
  excellent-accent: "#58CC02"
  excellent-light: "#89E219"
  excellent-shadow: "#58A700"
  excellent-tint: "#DCFCE7"
  excellent-text: "#15803D"

  # OnTrack budget status (spending near target)
  ontrack-accent: "#FF9600"
  ontrack-light: "#FFC800"
  ontrack-shadow: "#D47900"
  ontrack-tint: "#FEF3C7"
  ontrack-text: "#92400E"

  # Over budget status (spending exceeds target)
  over-accent: "#FF4B4B"
  over-light: "#FF7070"
  over-shadow: "#D43333"
  over-tint: "#FEE2E2"
  over-text: "#DC2626"

  # Default (no budget set)
  default-accent: "#4B7BE5"
  default-shadow: "#3B5FBB"
  default-tint: "#EFF6FF"

  # Income & Expense indicators
  income-color: "#22C55E"
  income-tint: "#DCFCE7"
  expense-color: "#EF4444"
  expense-tint: "#FEE2E2"

typography:
  font-primary: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif"
  font-body: "'Inter', 'Noto Sans Thai', sans-serif"
  font-thai: "'Noto Sans Thai', 'Plus Jakarta Sans', sans-serif"

  scale:
    hero:
      size: "40px"
      weight: "800"
      line-height: "1.1"
      usage: "Budget percentage, key numbers on dashboard"
    title:
      size: "28px"
      weight: "700"
      line-height: "1.2"
      usage: "Form step headings"
    heading:
      size: "20px"
      weight: "700"
      line-height: "1.3"
      usage: "Card titles, section headings"
    subheading:
      size: "18px"
      weight: "600"
      line-height: "1.4"
      usage: "Page headers (Dashboard, Budget)"
    body:
      size: "15px"
      weight: "500"
      line-height: "1.5"
      usage: "Category names, main content"
    label:
      size: "13px"
      weight: "500"
      line-height: "1.4"
      usage: "Row labels, chip text"
    caption:
      size: "12px"
      weight: "400"
      line-height: "1.4"
      usage: "Avg per day, muted hints, nav labels"
    nano:
      size: "11px"
      weight: "400"
      line-height: "1.3"
      usage: "Progress bar labels, hex values"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  content-padding: "16px"
  section-gap: "12px"

border-radius:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  chip: "28px"
  pill: "9999px"
  nav-active: "14px"
  sheet: "32px"

shadows:
  card: "0 4px 0 0 #E5E5E5"
  card-soft: "0 2px 12px rgba(28,25,23,0.07)"
  button-green: "0 4px 0 0 #58A700"
  button-amber: "0 4px 0 0 #D47900"
  button-red: "0 4px 0 0 #D43333"
  button-blue: "0 4px 0 0 #3B5FBB"
  nav: "0 -1px 0 0 #E5E5E5, 0 -4px 12px rgba(0,0,0,0.05)"

components:
  button-primary:
    height: "56px"
    border-radius: "16px"
    font-size: "16px"
    font-weight: "700"
    shadow: "lifted (0 4px 0 shadow-color)"
    active-state: "shadow collapses to 0 2px 0, translateY(2px)"

  button-ghost:
    height: "48px"
    border-radius: "16px"
    border: "1.5px solid #E5E5E5"
    font-size: "14px"
    font-weight: "500"
    color: "#777777"

  card:
    border-radius: "20px"
    border: "1px solid #F0F0F0"
    background: "#FFFFFF"
    shadow: "0 4px 0 0 #E5E5E5"
    padding: "16px"

  chip:
    border-radius: "28px"
    padding: "10px 18px"
    font-size: "14px"
    font-weight: "500"
    inactive: { background: "#F7F7F7", border: "1px solid #E5E5E5", color: "#444444" }
    active: { background: "accent-color", shadow: "lifted with accent-shadow", color: "#FFFFFF" }

  bottom-nav:
    height: "80px"
    background: "#FFFFFF"
    shadow: "0 -1px 0 0 #E5E5E5"
    active-tab:
      background: "#F0FDE4"
      border-radius: "14px"
      padding: "10px 20px"
      color: "#58CC02"
      font-weight: "700"
    inactive-tab:
      color: "#AAAAAA"
      font-weight: "400"
    add-button:
      size: "54px"
      border-radius: "16px"
      background: "#58CC02"
      shadow: "0 4px 0 0 #58A700"
      icon-color: "#FFFFFF"

  progress-bar:
    height: "12px"
    border-radius: "6px"
    track: "rgba(255,255,255,0.28) on colored hero, #F0F0F0 on white"
    fill: "rgba(255,255,255,0.88) on hero, accent-color on white"

  status-hero-banner:
    height: "176px"
    width: "100%"
    border-radius: "0"
    background: "budget-status accent color"
    shadow: "0 4px 0 0 budget-status shadow-color"

  form-progress-dots:
    active-dot: { width: "24px", height: "8px", border-radius: "4px", color: "#58CC02" }
    completed-dot: { size: "8px", border-radius: "4px", color: "#58CC02" }
    pending-dot: { size: "8px", border-radius: "4px", color: "#E5E5E5" }

animations:
  form-transition: "slideIn 280ms ease-out"
  card-appear: "fadeUp 240ms ease-out"
  button-press: "translateY(2px) + shadow collapse 120ms"
  status-change: "background 600ms ease-out"
---

# TongJod — Design System

## Overview

TongJod ("ทองจด") is a personal finance tracker for Thai users. **ทอง** means gold, **จด** means to record — it's a "golden record" of your money. The app tracks income and expenses, sets monthly budgets per category, and shows a dashboard that reacts to your budget health.

**Stack:** Next.js App Router + Supabase + Vercel  
**Auth:** Google OAuth only  
**Target device:** Mobile (390px), also works on desktop in a centered phone frame

---

## Design Philosophy

The visual direction is **Duolingo-inspired** — bold, rounded, high-contrast, and warm — but applied to personal finance features. No mascot, no XP points, no gamification mechanics. Just the aesthetic DNA:

- **Bold typography** — numbers and headings are large and confident
- **Lifted shadows** — cards and buttons use a solid-color bottom shadow (`0 4px 0 shadow-color`) that creates a tactile, 3D "pressed button" feel
- **Rounded everything** — 20px cards, 16px buttons, 28px chips
- **Semantic colors** — green/amber/red map directly to budget health and the entire app theme shifts based on spending status
- **All labels always visible** — bottom nav always shows icon + label, never icon-only
- **Content fits one screen** — the dashboard must not require scrolling on a standard mobile viewport (844px height)

---

## Color Usage

### Budget Status System
The app uses four budget states. The primary accent color and hero background shift dynamically:

| State | Condition | Primary | Shadow | Background tint |
|---|---|---|---|---|
| **Excellent** | spending ≤ (expected − 10%) | `#58CC02` | `#58A700` | `#DCFCE7` |
| **OnTrack** | spending within ±10% of expected | `#FF9600` | `#D47900` | `#FEF3C7` |
| **Over** | spending > (expected + 10%) | `#FF4B4B` | `#D43333` | `#FEE2E2` |
| **Default** | no budget set | `#4B7BE5` | `#3B5FBB` | `#EFF6FF` |

**Always use Excellent (green) as the default/showcase state** in mockups and onboarding.

### Income vs Expense
- Income: always green (`#22C55E` icon, `#DCFCE7` tint, `#15803D` text)
- Expense: always red (`#EF4444` icon, `#FEE2E2` tint, `#DC2626` text)

---

## Typography

Use **Plus Jakarta Sans** for headings and display text, **Noto Sans Thai** for Thai strings. Fall back to Inter if unavailable. Thai text should never be clipped — always use sufficient line-height (1.5+).

Key rules:
- Hero numbers (budget %, amounts): 40px Extra Bold — make them the dominant visual element
- Form headings: 28px Bold — confident and clear
- Card amounts: 20–22px Extra Bold — scannable at a glance
- Never use font weight below 500 for interactive elements

---

## Components

### Lifted Shadow Cards
Every interactive card uses the "Duolingo lifted" effect: a solid-color bottom shadow with zero blur. On press, the shadow shrinks and the element translates down 2px, simulating a physical button press.

```css
/* Default state */
box-shadow: 0 4px 0 0 #E5E5E5;

/* Pressed state */
box-shadow: 0 2px 0 0 #E5E5E5;
transform: translateY(2px);
```

For colored buttons, use the matching shadow token (e.g., green button → `#58A700` shadow).

### Category Chips
Wrap-grid layout with 10px gap. Sort by `usage_count` descending (most-used first). Selected chip gets accent fill + lifted shadow. Unselected chip: `#F7F7F7` background with `#E5E5E5` border.

### Bottom Navigation
80px tall (was 64px). Three tabs: **หน้าหลัก** (Dashboard) · **+** (Add, center) · **งบประมาณ** (Budget). The center Add button is a 54×54px rounded square (radius 16px) with the current status accent color and lifted shadow. All tabs always show icon + label.

---

## Screens

### 1. Login (`/`)
Full-screen green (`#58CC02`) gradient background with decorative translucent circles. Bottom 45% is a white rounded sheet (border-radius: 32px 32px 0 0). Sheet contains:
- App name "TongJod" — 52px Extra Bold, centered
- Tagline "บันทึกรายรับ-รายจ่ายของคุณ" — 15px Medium, white 82% opacity
- A coin icon placeholder (translucent white circle, 100px) above the name
- "Sign in with Google" button — 56px tall, white background, 16px radius, lifted shadow, Google blue circle + bold label
- Privacy caption below the button

### 2. Dashboard (`/dashboard`)
**Must fit 844px without scrolling.** Layout top-to-bottom:

1. **Status Hero Banner** (176px, full-width, no side padding)
   - Background: budget-status accent color
   - Left side: status pill (`🎉 ยอดเยี่ยม` etc.) + status message in Thai
   - Right side: big percentage number (40px Extra Bold, white)
   - Bottom: dual-label progress bar (expected vs actual), 12px height, white track

2. **Month Selector Row** (52px, 16px side padding)
   - Left: pill button with current month (Thai Buddhist era year) + chevron
   - Right: language toggle pill (TH · EN)

3. **Summary Cards** (96px, two columns, 16px side padding, 10px gap)
   - Income card: green left accent strip, ↑ dot, amount 20px Extra Bold, avg caption
   - Expense card: red left accent strip, ↓ dot, amount, avg caption
   - Both: 20px radius, lifted card shadow

4. **Daily Bar Chart** (180px, 16px side padding)
   - Inline header: "รายจ่ายรายวัน" left, month label right
   - 30 bars (one per day), rounded tops, color matches status theme
   - Highest-spending days: full opacity; others: 50% opacity

5. **Top 3 Categories** (126px, 16px side padding)
   - Header: "หมวดหมู่หลัก" left, "ดูทั้งหมด →" right in green
   - 3 rows: category name + amount + colored fill bar (6px height)

6. **Bottom Nav** (80px, pinned to bottom)

### 3. Form — Step 1: Type (`/form`)
Centered content in remaining viewport. Two large choice cards:
- **รายรับ (Income):** `#DCFCE7` background, green border, circle icon (↑, `#22C55E`), bold green label + gray sublabel. Lifted green-tint shadow.
- **รายจ่าย (Expense):** `#FEE2E2` background, red border, circle icon (↓, `#EF4444`), bold red label + gray sublabel. Lifted red-tint shadow.

Cards: 358px wide, 92px tall, 20px radius. Pressing animates scale(0.97) + shadow shrink.

Below the cards: small "แก้ไขรายการล่าสุด" hint row in a gray rounded pill.

### 4. Form — Step 2: Amount (`/form`)
- Small type badge at top (e.g., "▼ รายจ่าย" in red pill) showing selected type
- Heading: "ใส่จำนวนเงิน" 26px Bold centered
- Amount display card: `#FAFAFA` background, 2px green border (active state), shows "฿ บาท" label + large number (46px Extra Bold)
- Primary green button: "ต่อไป →"
- Ghost button: "ล้างค่า"
- Quick-amount chips row: ฿100, ฿500, ฿1,000, ฿2,000

### 5. Form — Step 3: Category (`/form`)
- Heading: "เลือกหมวดหมู่" 26px Bold centered
- Chip wrap grid: preset expense categories sorted by usage
- Selected chip: green fill + lifted shadow; unselected: gray fill
- Primary button: "ต่อไป →" below the grid

Preset expense categories: อาหาร, เดินทาง, ช็อปปิ้ง, บันเทิง, สุขภาพ, ค่าเช่า, สาธารณูปโภค, การศึกษา, ดูแลตัวเอง, อื่นๆ

### 6. Form — Confirm (Step 6, final step)
- Heading: "ยืนยันรายการ" centered
- White summary card (20px radius, lifted shadow) with 5 rows:
  - ประเภท / จำนวน / หมวดหมู่ / หมายเหตุ / วันที่
  - Each row: muted label left (13px) + bold value right (14px) + thin divider
- "บันทึก" green primary button (lifted green shadow)
- "แก้ไข" ghost button

### 7. Budget (`/budget`)
Header shows page title left + total budget amount right in accent color.

Two section cards:
- **ค่าใช้จ่าย (Expense budgets):** one row per expense category
  - Each row 52px tall: category name + right-aligned amount input + delete icon
  - Active row: 4px green left border
  - Bottom: auto-sum total row + dashed "เพิ่มหมวดหมู่" button
- **รายรับ (Income categories):** name management only, no budget amounts

Both cards: 20px radius, lifted card shadow.

---

## UX Principles

1. **One screen, no scroll (Dashboard)** — the dashboard must show all key info without scrolling on a 390×844 viewport. If content grows, collapse Top Categories to 3 rows and reduce chart height before adding scroll.

2. **Big tap targets** — minimum interactive area 44×44px. Bottom nav tabs minimum 44px wide. Form step cards minimum 80px tall.

3. **Lifted shadow = interactive** — if something has a lifted shadow, it responds to press. Flat surfaces are non-interactive.

4. **Status drives the whole UI** — the budget status color is not just a badge; it colors the hero banner, the primary buttons, the active nav indicator, and the chart bars. All of these shift together when status changes.

5. **Always show labels** — bottom nav always shows text labels. Form progress always shows step count. Never icon-only in navigation.

6. **Thai first, English second** — all strings render in Thai by default. English is a toggle. Status messages (encouragement phrases) are always Thai regardless of language setting.
