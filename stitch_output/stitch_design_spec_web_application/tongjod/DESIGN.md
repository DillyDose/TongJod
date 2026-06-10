---
name: TongJod
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#3f4a36'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#6f7b64'
  outline-variant: '#becbb1'
  surface-tint: '#2b6c00'
  primary: '#2b6c00'
  on-primary: '#ffffff'
  primary-container: '#58cc02'
  on-primary-container: '#1e5000'
  inverse-primary: '#6be026'
  secondary: '#8c5000'
  on-secondary: '#ffffff'
  secondary-container: '#fd9500'
  on-secondary-container: '#633700'
  tertiary: '#9a397a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8ed4'
  on-tertiary-container: '#7b1f60'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#87fe45'
  primary-fixed-dim: '#6be026'
  on-primary-fixed: '#082100'
  on-primary-fixed-variant: '#1f5100'
  secondary-fixed: '#ffdcbf'
  secondary-fixed-dim: '#ffb872'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6a3b00'
  tertiary-fixed: '#ffd8eb'
  tertiary-fixed-dim: '#ffaedd'
  on-tertiary-fixed: '#3b002c'
  on-tertiary-fixed-variant: '#7d2061'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
  excellent-accent: '#58CC02'
  excellent-shadow: '#58A700'
  excellent-tint: '#DCFCE7'
  ontrack-accent: '#FF9600'
  ontrack-shadow: '#D47900'
  ontrack-tint: '#FEF3C7'
  over-accent: '#FF4B4B'
  over-shadow: '#D43333'
  over-tint: '#FEE2E2'
  default-accent: '#4B7BE5'
  default-shadow: '#3B5FBB'
  default-tint: '#EFF6FF'
  income-green: '#22C55E'
  expense-red: '#EF4444'
  surface-gray: '#F7F7F7'
  border-gray: '#E5E5E5'
  text-secondary: '#777777'
  text-muted: '#AAAAAA'
typography:
  hero-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  heading-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  subheading-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 25px
  body-main:
    fontFamily: Noto Sans Thai
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 24px
  label-md:
    fontFamily: Noto Sans Thai
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  caption-sm:
    fontFamily: Noto Sans Thai
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 17px
  nano-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 16px
  section-gap: 12px
  card-gap: 10px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
---

## Brand & Style

The design system is built on a **Duolingo-inspired** aesthetic: bold, rounded, and high-contrast, optimized for a cozy yet highly functional personal finance experience. It prioritizes clarity and tactile feedback to make the routine task of expense tracking feel engaging and physical.

### Design Style: Tactile Modernism
The system utilizes a "lifted" UI approach. Elements appear as physical slabs with solid, non-blurred bottom shadows. This creates a clear mental model: **if it has a lifted shadow, it is interactive.**

- **Key Principles:**
  - **Tactile Feedback:** Buttons and cards "press" into the surface when tapped (shadow shrinks, element translates down).
  - **Dynamic Personality:** The entire interface's mood (colors, buttons, banners) shifts based on the user's budget health.
  - **Rounded Geometry:** Large corner radii (up to 32px for sheets) evoke a friendly, approachable, and safe environment for financial data.
  - **Thai-Centric:** Layouts are specifically designed to accommodate the vertical requirements of Thai glyphs without clipping.

## Colors

The system uses a **State-Driven Color Model**. The primary accent of the application is not static; it is determined by the "Budget Status."

- **Excellent (Default/Showcase):** Use Green (`#58CC02`) for users spending well under target.
- **OnTrack:** Use Amber (`#FF9600`) for users near their spending target.
- **Over:** Use Red (`#FF4B4B`) for users exceeding their budget.
- **Default:** Use Blue (`#4B7BE5`) when no budget is established.

### Implementation Rules
1. **The Accent Shift:** When a state changes, the following elements must update their color: Status Hero Banner, Primary Buttons, Active Navigation Indicators, and Chart Bars.
2. **Income & Expense:** These remain fixed. Income is always Green (`#22C55E`) and Expense is always Red (`#EF4444`), regardless of the overall budget status.
3. **Lifted Shadows:** Always use the specific `shadow` variant of the current accent color for primary buttons and active chips to maintain the 3D effect.

## Typography

This system employs a dual-font strategy to ensure both Latin numbers/headings and Thai content look premium and remain legible.

- **Plus Jakarta Sans:** Used for all headings, hero numbers, and English UI strings. It provides the bold, geometric look essential for the brand.
- **Noto Sans Thai:** Used for all Thai text and body content. 

### Critical Rules
- **Line Height:** Thai script requires more vertical breathing room. A minimum line-height of 1.5x (or as specified in the tokens) is mandatory to prevent vowel and tone mark clipping.
- **Weight:** Never use a font weight below **500** for interactive elements (buttons, chips, nav) to maintain the bold, high-contrast aesthetic.
- **Hero Numbers:** These are the dominant visual anchor. They should be rendered in `Extra Bold` to emphasize financial progress.

## Layout & Spacing

This is a **Mobile-First (390px)** system designed to fit critical information within a single viewport (844px height) without scrolling.

### Layout Philosophy
- **Fixed Width (Mobile):** Components are designed for a 390px width. On larger screens, the UI should be contained within a centered phone-frame container.
- **The "No-Scroll" Dashboard:** Content priority is strictly enforced. If the dashboard exceeds the viewport, reduce the Daily Bar Chart height and collapse category lists to 3 rows before allowing vertical scrolling.
- **Grid:** Use a simple 16px side margin for the main container. Internal cards use 10px or 12px gaps to maintain a dense, "cozy" feel.

### Touch Targets
All interactive elements must maintain a minimum tap area of **44x44px**, even if the visual representation is smaller (e.g., small chips or icons).

## Elevation & Depth

Depth is conveyed through **Bold Borders** and **Solid Shadows** rather than blurs or gradients. This system mimics physical cut-outs and stacked cards.

- **Lifted State:** Interactive components (cards, buttons) feature a solid `4px` bottom shadow (`0 4px 0 0`) using a darker tint of the background color or a neutral light gray (`#E5E5E5`).
- **Pressed State:** Upon interaction, the element uses a CSS transform `translateY(2px)` and the shadow reduces to `2px`. This "squish" effect is the primary feedback mechanism.
- **Flat Surfaces:** Non-interactive background elements or "ghost" containers remain flat. If it doesn't have a solid shadow, the user should not expect it to be clickable.
- **Sheets:** Bottom sheets (like on the login screen) use high corner radii (32px) to suggest they are "sliding over" the base layer, creating depth through stacking rather than shadowing.

## Shapes

The shape language is consistently **Rounded** and friendly. There are no sharp corners in the design system.

- **Buttons & Cards:** Use a base `16px` to `20px` radius.
- **Chips:** Use a "Pill" shape (`9999px` or `28px`) to distinguish them from larger card elements.
- **Active Navigation:** The active state indicator in the bottom nav uses a `14px` radius "squircle" background.
- **Progress Bars:** Fully rounded ends (`pill`) to look soft and non-technical.
- **Bottom Sheets:** `32px` top-only rounding for a "tucked-in" appearance.

## Components

### Buttons
- **Primary:** 56px tall, 16px radius. Uses the current state accent color. Must include the `shadow-color` (4px solid) and the "squish" animation on press.
- **Ghost:** 48px tall, 1.5px border (`#E5E5E5`). Used for secondary actions like "Clear" or "Edit."

### Lifted Cards
- Used for summary data (Income/Expense) and dashboard sections. 
- **Radius:** 20px. 
- **Shadow:** `0 4px 0 0 #E5E5E5`.
- **Active state:** In the budget view, the "Active" card row receives a 4px left-border accent of the current status color.

### Bottom Navigation
- **Height:** 80px.
- **Tabs:** Three fixed tabs (Home, Add, Budget). Labels are always visible.
- **Add Button:** The center "+" button is a specialized 54x54px card with a 16px radius and the current budget accent color.
- **Active Tab:** Indicated by a soft tint background (`#F0FDE4` for Excellent) and bolded text.

### Category Chips
- Grid-based with 10px gaps.
- **Inactive:** Light gray background (`#F7F7F7`) with a thin border.
- **Active:** Full accent color fill with a lifted shadow matching the accent's shadow color.

### Form Elements
- **Type Selection Cards:** Large (92px tall) cards for "Income" vs "Expense" with distinct tinted backgrounds and heavy borders.
- **Amount Display:** Large typography (46px) with a centered layout. The active focus state is shown via a 2px colored border.
- **Progress Dots:** Horizontal bar of rounded dots; the active step is an elongated pill (24px wide).