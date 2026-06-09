# TongJod — UI Design Specification

## Design Philosophy

**Modern but cozy.** The app should feel like a warm, personal space — not a cold finance tool. Think soft gradients, rounded shapes, friendly typography, and gentle animations. Every interaction should feel satisfying and calm, not stressful. Money tracking is already stressful enough.

**Mood keywords:** Soft · Warm · Rounded · Friendly · Alive

---

## Color System

### Base Palette (always present regardless of theme)

| Token | Hex | Usage |
|---|---|---|
| `bg-base` | `#F7F5F1` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Cards, modals, inputs |
| `surface-secondary` | `#F0EDE8` | Secondary card background |
| `text-primary` | `#1C1917` | Headings, important numbers |
| `text-secondary` | `#78716C` | Labels, subtitles, captions |
| `text-muted` | `#A8A29E` | Placeholder text, hints |
| `border` | `#E7E2D9` | Card borders, input borders |
| `white` | `#FFFFFF` | Text on dark gradients |

---

### Dynamic Theme Gradients

The entire app background shifts based on budget status. Applied as a full-page gradient overlay behind the `bg-base`.

#### 🟢 Excellent (spending well below budget)
```
Background gradient: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 40%, #6EE7B7 100%)
Accent color: #059669
Card tint: rgba(16, 185, 129, 0.08)
Progress bar fill: #10B981
Status pill bg: #D1FAE5 · text: #065F46
```

#### 🟡 On Track (within 10% of expected)
```
Background gradient: linear-gradient(135deg, #FEF9C3 0%, #FDE68A 40%, #FCD34D 100%)
Accent color: #D97706
Card tint: rgba(245, 158, 11, 0.08)
Progress bar fill: #F59E0B
Status pill bg: #FEF3C7 · text: #92400E
```

#### 🔴 Over Budget (spending exceeds expected)
```
Background gradient: linear-gradient(135deg, #FFE4E6 0%, #FECDD3 40%, #FDA4AF 100%)
Accent color: #DC2626
Card tint: rgba(239, 68, 68, 0.08)
Progress bar fill: #EF4444
Status pill bg: #FFE4E6 · text: #9F1239
```

#### ⚪ Default (no budget set)
```
Background gradient: linear-gradient(135deg, #F7F5F1 0%, #EDE9E3 100%)
Accent color: #78716C
Progress bar fill: #A8A29E
```

---

## Typography

| Role | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Display (big numbers) | Plus Jakarta Sans | 36px | 700 | 1.1 |
| Heading 1 | Plus Jakarta Sans | 24px | 700 | 1.2 |
| Heading 2 | Plus Jakarta Sans | 18px | 600 | 1.3 |
| Body | Inter | 15px | 400 | 1.5 |
| Body Medium | Inter | 15px | 500 | 1.5 |
| Caption | Inter | 13px | 400 | 1.4 |
| Label / Tag | Inter | 12px | 500 | 1 |

**Font import:**
```
Plus Jakarta Sans: weights 600, 700
Inter: weights 400, 500
```

---

## Spacing & Layout

```
Base unit: 4px

xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px

Page horizontal padding (mobile): 16px
Page horizontal padding (desktop): 24px
Max content width (desktop): 480px centered (app stays phone-width on desktop)
Bottom nav height: 64px
Top header height: 56px
```

---

## Border Radius

```
sm:   8px   (tags, chips small)
md:   12px  (inputs, buttons)
lg:   16px  (cards)
xl:   24px  (category chips, large pills)
full: 9999px (circular buttons, toggles)
```

---

## Shadows

```
card:    0px 2px 12px rgba(28, 25, 23, 0.07)
card-hover: 0px 4px 20px rgba(28, 25, 23, 0.12)
button:  0px 2px 8px rgba(28, 25, 23, 0.10)
bottom-nav: 0px -2px 16px rgba(28, 25, 23, 0.06)
```

---

## Components

### Card
```
Background: #FFFFFF (or card tint on themed pages)
Border: 1px solid var(--border)
Border radius: 16px
Padding: 16px
Shadow: card shadow
```

### Primary Button
```
Background: var(--accent-color)
Text: #FFFFFF
Border radius: 12px
Padding: 14px 24px
Font: Body Medium
Shadow: button shadow
Hover: darken 8%
Active: scale(0.97)
```

### Ghost Button / Skip
```
Background: transparent
Text: var(--text-secondary)
Border: 1px solid var(--border)
Border radius: 12px
Padding: 12px 20px
```

### Input Field
```
Background: #FFFFFF
Border: 1.5px solid var(--border)
Border radius: 12px
Padding: 14px 16px
Font size: 16px (prevents iOS zoom)
Focus border: var(--accent-color)
Focus shadow: 0 0 0 3px rgba(accent, 0.15)
```

### Category Chip
```
Background: var(--surface-secondary)
Border: 1.5px solid transparent
Border radius: 24px
Padding: 10px 16px
Font: Label
Selected state:
  Background: var(--accent-color)
  Text: #FFFFFF
  Border: transparent
  Scale: 1.04 (subtle pop)
```

### Step Progress Dots
```
Dot size: 8px
Active dot: 24px wide (pill shape), var(--accent-color)
Inactive dot: 8px circle, var(--border)
Gap: 6px
```

### Progress Bar (Dashboard)
```
Track: var(--surface-secondary), height 12px, border-radius full
Expected marker: white vertical line with drop shadow
Actual fill: gradient from accent-light to accent
Border radius: full
```

### Bottom Navigation
```
Background: #FFFFFF
Border-top: 1px solid var(--border)
Shadow: bottom-nav shadow
Height: 64px
Icon size: 22px
Active tab: var(--accent-color) icon + label
Inactive tab: var(--text-muted) icon, no label
Active indicator: small pill under icon, var(--accent-color), 4px height
```

### Status Pill (Expense status)
```
Background: status-specific (see theme)
Border radius: full
Padding: 6px 14px
Font: Label, weight 600
Positioned at top of dashboard, centered
```

---

## Animations

All animations use `ease-out` curve. Keep them quick — snappy, not slow.

| Interaction | Animation | Duration |
|---|---|---|
| Form step → next | Slide out left + slide in from right | 280ms |
| Form step → back | Slide out right + slide in from left | 280ms |
| Theme gradient change | Cross-fade background | 600ms |
| Category chip select | Scale 1.0 → 1.04 → 1.0 | 180ms |
| Card appear | Fade in + translate Y 8px → 0 | 240ms |
| Button press | Scale 0.97 | 120ms |
| Page transition | Fade in | 200ms |
| Status message change | Fade out → fade in | 300ms |

---

## Pages

### Login Page

```
Layout: centered, full screen
Background: default gradient
Content:
  - App name "TongJod" (ต้องจด) — Display font, centered
  - Tagline — Caption, text-secondary
  - Google sign-in button — white card button, Google logo + "Continue with Google"
  - Button width: 280px
  - Positioned at 45% vertical
```

---

### Dashboard (`/dashboard`)

```
Header (56px):
  Left: Month/Year selector (e.g. "มิถุนายน 2026") with chevron down
  Right: Language toggle (TH · EN pill)

Section 1 — Status + Progress (card, full width)
  Top: Status pill (centered)
  Middle: Status message text (Thai, 16px, centered, text-primary)
  Bottom: Progress bar
    - Label row: "คาดการณ์ X%" left · "จริง Y%" right
    - Bar with two markers

Section 2 — Summary Cards (2 columns, equal width)
  Income card:
    Icon + "รายรับ" label
    Big number (Display font) + "บาท"
    Caption: "เฉลี่ย X บาท/วัน"
    Card tint: green tint (always, regardless of theme)
  Expense card:
    Icon + "รายจ่าย" label
    Big number + "บาท"
    Caption: "เฉลี่ย X บาท/วัน"
    Card tint: red tint (always, regardless of theme)

Section 3 — Expense Timeline (card, full width)
  Title: "รายจ่ายรายวัน"
  Bar chart or area chart
  x-axis: day numbers
  y-axis: Baht amount per day
  Bar/line color: accent color of current theme
  Soft rounded bars if bar chart

Section 4 — Top 5 Categories (card, full width)
  Title: "หมวดหมู่ที่ใช้มากสุด"
  Horizontal bars, ranked 1–5
  Bar color: gradient from accent to accent-light
  Label: category name left, amount right

Bottom Nav (fixed)
```

---

### Form (`/form`)

```
Header (56px):
  Back arrow (if not step 1)
  Step progress dots (centered)
  Empty right side

Step content area (full height between header and bottom):
  Vertically centered content per step

Step 1 — Type:
  Question text: "วันนี้เป็น..." (Heading 1, centered)
  Two large cards stacked or side by side:
    - "รายรับ" (Income) — green tint, icon
    - "รายจ่าย" (Expense) — red tint, icon
  Each card: 100% width, 80px tall, rounded lg

Step 2 — Amount:
  Question: "จำนวนเท่าไหร่?" (Heading 1)
  Large number input, center-aligned text
  "บาท" suffix label next to input
  Currency formatted as user types (e.g. 1,000)
  Numpad-style keyboard on mobile
  Continue button at bottom

Step 3 — Category:
  Question: "หมวดหมู่ไหน?" (Heading 1)
  Chip grid: 2–3 columns, wrap
  Sorted by usage_count descending
  Selected chip: accent color fill
  Scroll if many categories

Step 4 — Note:
  Question: "มีอะไรเพิ่มเติมไหม?" (Heading 1)
  Text input, full width
  "ข้ามได้เลย →" skip button below input (ghost style)

Step 5 — Date:
  Question: "วันที่?" (Heading 1)
  Date picker, defaults to today
  "วันนี้" quick-pick button
  Continue button

Step 6 — Confirm:
  Title: "ตรวจสอบอีกครั้ง" (Heading 2)
  Summary card showing all entries:
    Type · Amount · Category · Note · Date
  Row layout: label (text-muted) + value (text-primary)
  "บันทึก" save button (full width, primary)
  "แก้ไข" edit link below (ghost, goes back to step 1)

Edit last transaction:
  Small text link at bottom of Step 1: "แก้ไขรายการล่าสุด →"
  Pre-fills form and overwrites on save
```

---

### Budget (`/budget`)

```
Header (56px):
  Title: "ตั้งงบประมาณ" (Heading 2)
  Right: Language toggle

Section 1 — Expense Budgets
  Section header: "รายจ่าย"
  List of expense categories:
    Row: [Category name] [Amount input "บาท"] [Soft delete icon]
    Input: right-aligned, numeric, no border (inline edit feel)
    Empty state: placeholder "ยังไม่ได้ตั้ง"
  Total row (pinned at bottom of list):
    "งบรวม" label · auto-sum value (Display font, accent color)
  "เพิ่มหมวดหมู่" add button (ghost, full width, dashed border)

Section 2 — Income Categories
  Section header: "รายรับ"
  Same list style but no amount input column
  "เพิ่มหมวดหมู่" add button

Add category sheet (bottom sheet):
  Title: "เพิ่มหมวดหมู่ใหม่"
  Name input
  Save button
  Appears with slide-up animation from bottom
```

---

## Iconography

Use **Lucide Icons** (clean, modern, consistent stroke style).

Key icons:
| Usage | Icon name |
|---|---|
| Income | `trending-up` |
| Expense | `trending-down` |
| Dashboard | `layout-dashboard` |
| Form / Add | `plus-circle` |
| Budget | `wallet` |
| Delete | `trash-2` |
| Edit | `pencil` |
| Calendar | `calendar` |
| Language | `globe` |
| Category Food | `utensils` |
| Category Transport | `car` |
| Category Health | `heart-pulse` |
| Category Shopping | `shopping-bag` |

---

## Responsive Behavior

```
Mobile (< 640px):
  Bottom navigation fixed
  Full-width cards
  Single column layout

Desktop (≥ 640px):
  App centered in a 480px container
  Floating card container with subtle shadow wrapping the app
  Bottom nav stays (keeps mobile feel on desktop)
  Background gradient fills the full desktop screen behind the card
```
