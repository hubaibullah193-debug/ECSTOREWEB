# Design System — Khan Glowcare Center

**Hallmark · macrostructure: Marquee Hero (Home) · Workbench (Admin) · Newsprint (editorial) · tone: utilitarian · anchor hue: 40° (warm grey-brown)**

A unified visual system for Khan Glowcare Center — a personal skincare and hygiene e-commerce platform serving Pakistan. All prices in PKR (whole-rupee, no fractions). Phone-first, WhatsApp-primary, cash-on-delivery default. Reliability > decoration.

---

## 1. Design Principles

Aligned with CLAUDE.md:

- **Trustworthy** — No hidden charges, no surprise totals. Every number, every total, every amount earned is visible and recalculated in real time.
- **No frills** — Every visual, every interaction, every colour choice has a purpose. No decoration for decoration's sake.
- **Reliable** — Forms don't vanish. Orders don't disappear. Stock levels are atomic. Carts survive page refreshes and cross-device access.
- **Phone-first** — Designed for 320px narrow devices; scales fluidly to 2560px. Touch-friendly button targets (48px minimum).
- **Accessible** — WCAG AA: colour contrast ≥7:1 on body text, ≥4.5:1 on UI; `:focus-visible` rings on all interactive elements; no interactive content tied to hover alone.
- **Regional** — Pakistani phone numbers (format: `03XX-XXXXXXX`). PKR currency with whole-rupee amounts only. WhatsApp notification preference. No Western assumptions.

---

## 2. Typography

**Display face** — `Newsreader` (serif, roman only, high-contrast)
- Headlines, hero copy, section breaks
- Weights: 400 (body), 700 (strong)
- Never italic

**Body face** — `Inter` (humanist sans, crisp reading)
- Running text, form labels, tables, small print
- Weights: 400 (regular), 500 (medium), 600 (semibold)
- Never italic for headers; italic only for emphasis *inside paragraphs*

**Mono face** — `JetBrains Mono` (if SKUs, codes, prices need fixed-width; optional)
- Order numbers, variant SKUs
- Weight: 500

### Scale

All sizes in rem, rooted at 16px system default.

```
--text-12:       0.75rem  (12px)  — tiny labels, helper text
--text-14:       0.875rem (14px)  — small labels, captions
--text-16:       1rem     (16px)  — body text (default)
--text-18:       1.125rem (18px)  — slightly large body
--text-20:       1.25rem  (20px)  — subsection text
--text-24:       1.5rem   (24px)  — section heading
--text-32:       2rem     (32px)  — page heading
--text-40:       2.5rem   (40px)  — hero heading
--text-48:       3rem     (48px)  — hero (short)
--text-56:       3.5rem   (56px)  — hero (short, aggressive)
--text-64:       4rem     (64px)  — display (homepage hero)
```

### Measure

- **Body measure** — 65 characters max (±5) for comfortable reading
- **Line height** — 1.5 (body), 1.2 (headlines)
- **Letter spacing** — 0 (default), +0.02em on labels (small caps, all-caps)

### Hero headline sizing

When writing headlines without user-supplied copy:
- ≤50 chars: use `--text-64`
- 51–90 chars: use `--text-48`, cap at 90 characters
- >90 chars: rewrite shorter or use `--text-40`

---

## 3. Colour

All colours defined as OKLCH. Paper is cream (warm white), accent is warm brown (earthy, trustworthy, not tech-blue).

### Token palette

```
--color-paper:           oklch(96% 0.01 40)   — cream background
--color-paper-1:         oklch(92% 0.01 40)   — subtle lift (cards, inputs)
--color-paper-2:         oklch(86% 0.02 40)   — hover/active lift
--color-paper-3:         oklch(80% 0.02 38)   — strong contrast (table rows)

--color-ink:             oklch(12% 0.02 40)   — body text, primary copy
--color-ink-secondary:   oklch(35% 0.01 40)   — secondary text, captions
--color-ink-tertiary:    oklch(55% 0.01 40)   — disabled, placeholder

--color-accent:          oklch(42% 0.15 40)   — warm brown; links, buttons, highlights
--color-accent-hover:    oklch(35% 0.16 40)   — darker brown on hover
--color-accent-focus:    oklch(55% 0.12 40)   — lighter brown on focus (accessibility ring)

--color-success:         oklch(52% 0.18 142)  — green; order confirmed, stock ✓
--color-warning:         oklch(65% 0.19 60)   — amber; low stock, pending action
--color-error:           oklch(55% 0.22 20)   — red; out of stock, form error, payment failed

--color-surface:         oklch(100% 0 0)      — white; modals, overlays
--color-surface-dim:     oklch(0% 0 0 / 12%)  — black at 12% opacity; overlays, backdrop

--color-border:          oklch(88% 0.01 40)   — subtle dividers, input borders
--color-focus:           oklch(42% 0.15 40)   — `:focus-visible` ring (same as accent for consistency)
```

### Contrast

- **Body text** (ink on paper): 7:1 (WCAG AAA)
- **Accent on paper**: 5.5:1 (WCAG AA+)
- **UI elements** (buttons, cards): ≥4.5:1 on interactive states

---

## 4. Spacing

4-point scale. All spacing uses `--space-*` tokens.

```
--space-1:       0.25rem  (4px)
--space-2:       0.5rem   (8px)
--space-3:       0.75rem  (12px)
--space-4:       1rem     (16px)
--space-6:       1.5rem   (24px)
--space-8:       2rem     (32px)
--space-12:      3rem     (48px)
--space-16:      4rem     (64px)
--space-20:      5rem     (80px)
--space-24:      6rem     (96px)
```

### Grid

- **Container max-width**: 1280px (80rem)
- **Gutter** (margin between grid tracks): `--space-4` on mobile, `--space-6` on tablet+
- **Breakpoints**:
  - `0–319px`: mobile (single column)
  - `320–767px`: mobile (single column, full bleed)
  - `768–1023px`: tablet (2–3 columns)
  - `1024–1279px`: desktop (3–4 columns)
  - `1280px+`: wide (4+ columns, centered with max-width)

---

## 5. Components

### Forms

All form inputs use the same recipe:

**Input, Textarea, Select:**
- Border: 1px solid `--color-border`
- Background: `--color-paper-1`
- Padding: `--space-3 --space-4` (vertical · horizontal)
- Border-radius: `0.375rem` (6px, subtle curve)
- Font: `--text-16` body weight 400
- Focus: ring `2px solid --color-focus`, ring-offset `2px`

**Button**

- **Primary** (CTA, place order, add to cart):
  - Background: `--color-accent`
  - Text: white (or `--color-surface`)
  - Padding: `--space-3 --space-8` (12px · 32px)
  - Border-radius: `0.375rem`
  - Font: `--text-16` body weight 600
  - States:
    - default: `--color-accent` bg
    - hover: `--color-accent-hover` bg, cursor pointer
    - active: `--color-accent` bg, `transform: translateY(1px)`
    - disabled: `--color-ink-tertiary` bg, cursor not-allowed
    - loading: `--color-accent` bg, spinner 12px inside button
    - focus: ring `2px solid --color-focus`

- **Secondary** (cancel, back, remove):
  - Background: transparent
  - Border: 1px solid `--color-ink-secondary`
  - Text: `--color-ink`
  - Padding: `--space-3 --space-8`
  - States: hover shows `--color-paper-2` bg, active adds ring

**Checkbox, Radio**

- Size: 20px × 20px (min 48px touch target with padding)
- Border: 2px solid `--color-border` (unchecked)
- Background: `--color-paper` (unchecked), `--color-accent` (checked)
- Checked indicator: white checkmark (SVG) or circle
- Focus: ring `2px solid --color-focus` on parent `<label>`

**Card**

- Background: `--color-paper-1`
- Border: 1px solid `--color-border` (optional)
- Padding: `--space-6`
- Border-radius: `0.5rem` (8px)
- Used for: product listing, order detail, bundle preview

**Modal / Overlay**

- Backdrop: `--color-surface-dim` (black 12% opacity)
- Modal bg: `--color-surface` (white)
- Min padding: `--space-6`
- Border-radius: `0.5rem`
- Max-width: 90vw, max-height: 90vh

### Data display

**Table**

- Header row bg: `--color-paper-2`
- Data rows: alternating `--color-paper` / `--color-paper-1`
- Borders: 1px `--color-border` between rows and columns
- Padding: `--space-3 --space-4` per cell
- Font: `--text-14` on mobile, `--text-16` on desktop

**Badge / Label**

- Background: `--color-paper-2`
- Text: `--color-ink`
- Padding: `--space-1 --space-2`
- Border-radius: `0.25rem` (4px)
- Font: `--text-12` weight 600
- Color variants: `success`, `warning`, `error` use their respective colour tokens

**Toast / Notification**

- Background: `--color-surface`
- Border-left: 4px solid accent (or success/warning/error)
- Padding: `--space-4`
- Border-radius: `0.375rem`
- Shadow: `0 4px 12px rgba(0,0,0,0.1)`
- Timeout: 4000ms auto-dismiss
- Position: bottom-right, mobile: full-width at bottom

---

## 6. Motion

**Principle**: State changes and loading states only. No scroll animations, no auto-play, no celebratory motion. Cut before adding.

**Easings**

```
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1)     — exit animations (fade out, collapse)
--ease-in:       cubic-bezier(0.7, 0, 0.84, 0)     — enter animations (fade in, expand)
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1)      — interactive (dragging, toggling)
```

**Durations**

```
--dur-fast:      150ms   — micro-interactions (hover feedback, focus ring)
--dur-mid:       300ms   — state transitions (modal open, form validation)
--dur-slow:      500ms   — page transitions, loading states (if needed)
```

### Recipes

**Button hover feedback**
```css
.btn:hover {
  background: var(--color-accent-hover);
  transition: background var(--dur-fast) var(--ease-out);
}
```

**Focus ring**
```css
.interactive:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  /* Never animate the ring appearance — must show instantly */
}
```

**Form validation feedback**
```css
.input.error {
  border-color: var(--color-error);
  background: oklch(100% 0 0 / 0.5) /* white tint */;
  box-shadow: inset 0 0 0 1px var(--color-error);
  transition: box-shadow var(--dur-mid) var(--ease-out);
}
```

**Loading spinner** (CSS, 12px)
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spinner {
  width: 12px; height: 12px;
  border: 2px solid var(--color-accent);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

**Mobile**: `prefers-reduced-motion: reduce` collapses all spatial motion to ≤150ms opacity crossfade. State changes still happen, but without translation.

---

## 7. Pages & Macrostructures

### Storefront pages

#### Home (Marquee Hero)

Structure:
1. **Hero** — 1–2 short lines (≤50 chars), warm brown accent, cream background
2. **Featured products** — 3–4 products in a grid, cards with image, name, price, add-to-cart
3. **Featured bundles** — 2–3 bundle kits, highlighting the savings
4. **CTA** — "Shop all" button, centre-aligned, prominent
5. **Footer** — minimal (N6 masthead pattern)

Copy discipline:
- Hero: "Discover trusted personal care." (no marketing hyperbole)
- Section heads: "Best sellers", "Limited offers"

#### Shop (Catalog Grid)

Structure:
1. **Filter sidebar** (mobile: collapsible) — category, price range, stock status
2. **Product grid** — 2 columns on mobile, 3–4 on desktop
3. **Search bar** — top, full-width on mobile
4. **Sort dropdown** — "Newest", "Price: Low to high", "Price: High to low"

Grid cells show: image (1:1 aspect ratio), name, price (PKR, no fractions), stock status ("In stock" / "1 left" / "Out of stock").

#### Product detail

Structure:
1. **Image gallery** — 1:1 aspect ratio, thumbnail strip below
2. **Variant selector** — size, quantity-per-variant stock level shown
3. **Price** — large, prominent, warm brown accent
4. **Ingredient / allergen list** — grey secondary text, full width
5. **Bundle highlight** — if this product is in a bundle, show it: "Included in: [Bundle name] — save Rs [amount]"
6. **Add-to-cart + quantity selector**
7. **Footer**

Copy: ingredient list in bullets, no bold or emphasis.

#### Cart

Structure:
1. **Item list** — per item: image thumbnail (small 80px), name, variant, quantity selector (±), per-item price, remove button
2. **Cart summary** — Subtotal, Shipping (flat rate shown), Bundle savings (if any), Total (large, warm brown)
3. **Checkout CTA** — "Proceed to checkout" (primary button, full width on mobile)
4. **Continue shopping** — secondary link

Empty state: "Your cart is empty. [Shop now]"

#### Checkout

Structure:
1. **Contact info** — phone (validated format, required), email (optional)
2. **Delivery address** — address line 1, address line 2, city, region, postal code (all required)
3. **Order summary** (sticky on desktop, below on mobile) — item list (compact), subtotal, shipping, total
4. **Payment method selection** — three radio buttons: "Cash on Delivery", "JazzCash", "Easypaisa"
5. **Place order button** — full width, primary, large touch target

Totals shown at every step. No hidden fees.

#### Account (Long Document)

Structure:
1. **Sign in / Sign up tabs** (if not authenticated)
2. **Profile section** — name, phone, email, password reset link (if email verified)
3. **Address book** — list of saved addresses, add new, edit, remove
4. **Order history** — table: order number (linked), date, total, status
5. **Order detail modal** — order number, items (with prices), total, status timeline

#### About / Contact

Structure:
1. **About section** — store info (1–2 paragraphs), mission (reliability, trust)
2. **Contact form** — name, phone, email, message (all required)
3. **Contact info** — WhatsApp link, email, hours

---

### Admin pages

#### Dashboard (Workbench)

Structure:
1. **Sidebar nav** — Home, Catalog, Orders, Bundles, Settings, Sign out
2. **Main panel**:
   - **KPIs** — 4 cards: Total orders (today/week/month selector), Total revenue (PKR), Orders pending action, Variants low-stock (count)
   - **Recent orders table** — order number (linked), customer phone, total, status, date, action button ("View details")
   - **Low-stock alerts** — list of variants at or below threshold (e.g., ≤5 units)
3. **Footer** — admin name, last sync time

#### Catalog (Workbench)

Structure:
1. **Sidebar nav** — (as above)
2. **Main panel**:
   - **Search + Filter** — by category, by name
   - **Product table** — name, category, price, variants (count), status (active/archived), actions (edit, delete)
   - **Add product button** — primary, top right
3. **Product edit modal** — name, description, category, price (PKR), image upload, variants (form repeater), save/cancel

#### Orders (Workbench)

Structure:
1. **Sidebar nav**
2. **Main panel**:
   - **Filter tabs** — Pending, Shipped, Delivered, Cancelled, Returned
   - **Order table** — order number, customer phone, total, status, date, action button ("View details")
3. **Order detail modal** — full order info, status timeline, action buttons (Mark shipped, Mark delivered, Request cancellation approval, Issue refund)

#### Bundles (Workbench)

Structure:
1. **Sidebar nav**
2. **Main panel**:
   - **Bundle list** — name, components (count), bundle price, individual total, savings, status, actions (edit, archive/reactivate)
   - **Add bundle button** — primary, top right
3. **Bundle edit modal** — name, image, components (repeater: product + quantity), bundle price, dates (start/end), save/cancel

---

## 8. Responsive patterns

**Mobile-first (320px+)**
- Single column layout
- Full-width cards and inputs
- Sidebar nav → hamburger menu (mobile), sidebar (tablet+)
- Modals → full-height on mobile (top padding for safety), centered on desktop
- Tables → horizontal scroll on mobile (if necessary), fixed on desktop

**Touch targets**
- Minimum 48×48px for buttons and interactive elements
- Padding around links in lists (≥8px)

**Images**
- Aspect ratios locked: product images 1:1, hero images 16:9 (if used)
- `max-width: 100%` on all images
- No layout shift: use `aspect-ratio` CSS property or paddingBottom hack

**Typography**
- Body text: `--text-16` on mobile, `--text-18` on desktop
- Headlines: scale down by one step on mobile (`--text-40` → `--text-32` at 320px)
- Line-height: 1.5 on all sizes (readable on small screens)

---

## 9. Accessibility (WCAG AA)

- **Colour contrast** — 7:1 on body text, 4.5:1 on UI
- **Focus indicators** — 2px ring on all `:focus-visible`, never removed
- **Link text** — never "click here", always descriptive ("View order #12345", "Add to cart")
- **Form labels** — `<label>` associated with inputs via `for` attribute or nesting
- **Error messages** — inline, near the input, colour + icon (never colour alone)
- **Skip links** — "Skip to main content" at top of page (invisible until focused)
- **Alt text** — all images have descriptive alt text; product images include key details
- **Keyboard navigation** — all interactive elements reachable via Tab; no keyboard traps
- **Reduced motion** — `prefers-reduced-motion: reduce` supported on all animations

---

## 10. Code structure

### Import order

```css
@import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&family=Inter:wght@400;500;600&display=swap');

:root {
  /* -- define all tokens here */
}

/* Base styles */
body { font-family: var(--font-body); color: var(--color-ink); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-display); }

/* Components */
.btn { /* ... */ }
.input { /* ... */ }
.card { /* ... */ }

/* Pages */
.page-home { /* ... */ }
.page-shop { /* ... */ }

/* Utilities */
.flex { display: flex; }
.grid { display: grid; }
```

### Tailwind integration

If using Tailwind, define tokens in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      paper: 'var(--color-paper)',
      ink: 'var(--color-ink)',
      accent: 'var(--color-accent)',
      // ... rest of palette
    },
    spacing: {
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      // ... rest of scale
    },
    fontFamily: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
      mono: 'var(--font-mono)',
    },
  },
}
```

---

## 11. Exports

### tokens.css

Copy-paste or import this in your main stylesheet:

```css
@import url('https://fonts.googleapis.com/css2?family=Newsreader:wght@400;700&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Typography */
  --font-display: 'Newsreader', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-12: 0.75rem;
  --text-14: 0.875rem;
  --text-16: 1rem;
  --text-18: 1.125rem;
  --text-20: 1.25rem;
  --text-24: 1.5rem;
  --text-32: 2rem;
  --text-40: 2.5rem;
  --text-48: 3rem;
  --text-56: 3.5rem;
  --text-64: 4rem;

  /* Colour */
  --color-paper: oklch(96% 0.01 40);
  --color-paper-1: oklch(92% 0.01 40);
  --color-paper-2: oklch(86% 0.02 40);
  --color-paper-3: oklch(80% 0.02 38);
  --color-ink: oklch(12% 0.02 40);
  --color-ink-secondary: oklch(35% 0.01 40);
  --color-ink-tertiary: oklch(55% 0.01 40);
  --color-accent: oklch(42% 0.15 40);
  --color-accent-hover: oklch(35% 0.16 40);
  --color-accent-focus: oklch(55% 0.12 40);
  --color-success: oklch(52% 0.18 142);
  --color-warning: oklch(65% 0.19 60);
  --color-error: oklch(55% 0.22 20);
  --color-surface: oklch(100% 0 0);
  --color-surface-dim: oklch(0% 0 0 / 12%);
  --color-border: oklch(88% 0.01 40);
  --color-focus: oklch(42% 0.15 40);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 150ms;
  --dur-mid: 300ms;
  --dur-slow: 500ms;

  /* Radii */
  --radius-xs: 0.25rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Implementation checklist

- [ ] Copy `tokens.css` to `app/globals.css` or `src/styles/tokens.css`
- [ ] Import Google Fonts or use `next/font` (Newsreader + Inter)
- [ ] Build button component with 8-state support (default, hover, focus, active, disabled, loading, error, success)
- [ ] Build input component with validation (border-color changes on error, focus ring visible)
- [ ] Build card component (uses `--color-paper-1`, border optional)
- [ ] Build form layout (labels above inputs, errors below)
- [ ] Test mobile responsiveness at 320px, 375px, 768px, 1024px
- [ ] Verify colour contrast with WCAG AAA checker
- [ ] Add skip-to-main-content link
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter, Escape on modals)

---

**Last updated**: 2026-08-15  
**Theme**: Newsprint (editorial genre, utilitarian tone)  
**Hallmark version**: v1.1.0
