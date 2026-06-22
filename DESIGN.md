# Threads of Grace — Redesign Design System

**Theme:** Sacred Minimalism — warm, editorial, contemplative. Earth tones, generous whitespace, elegant serif headlines paired with a clean humanist sans.

---

## 1. Typography

The redesign mockups use a two-font system loaded from Google Fonts.

### Display / Headlines — **Cormorant Garamond**
- Source: https://fonts.google.com/specimen/Cormorant+Garamond
- Weights used: 400 (Regular), 500 (Medium), 600 (SemiBold)
- Used for: scripture verses, page titles, section headers, hero quotes
- Character: high-contrast serif, calligraphic italics, devotional/editorial feel

### Body / UI — **Inter**
- Source: https://fonts.google.com/specimen/Inter
- Weights used: 400, 500, 600
- Used for: body copy, buttons, labels, navigation, metadata, form inputs
- Character: neutral humanist sans, excellent legibility at small sizes

### Optional accent — **Cormorant Garamond Italic**
- Used sparingly for pull quotes and scripture attributions ("— Matthew 6:33").

### Import

```css
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap");
```

### Tailwind config

```ts
fontFamily: {
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  sans:  ['Inter', 'system-ui', 'sans-serif'],
}
```

### Scale

| Token | Size | Line-height | Usage |
|---|---|---|---|
| `display-xl` | 48–56px | 1.1 | Hero scripture |
| `display-lg` | 36–40px | 1.15 | Page titles |
| `h2` | 28–32px | 1.2 | Section headers |
| `h3` | 20–22px | 1.3 | Card titles |
| `body` | 16px | 1.6 | Paragraphs |
| `small` | 13–14px | 1.5 | Meta, captions |

---

## 2. Color Palette

All colors are stored as HSL design tokens in `index.css`. **Never hardcode** colors in components.

### Light mode

| Token | HSL | Hex | Role |
|---|---|---|---|
| `--background` | `36 33% 96%` | `#F5F0E8` | Warm cream canvas |
| `--foreground` | `155 24% 22%` | `#2D4A3E` | Deep forest text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Elevated surfaces |
| `--primary` | `155 24% 22%` | `#2D4A3E` | Deep forest green (CTAs) |
| `--primary-foreground` | `36 33% 96%` | `#F5F0E8` | On primary |
| `--accent` | `30 33% 64%` | `#C4A484` | Soft terracotta / clay |
| `--muted` | `36 20% 90%` | `#EAE3D6` | Subtle backgrounds |
| `--muted-foreground` | `155 10% 40%` | `#5C6B64` | Secondary text |
| `--border` | `36 20% 85%` | `#DCD3C2` | Hairlines |
| `--ring` | `155 24% 22%` | `#2D4A3E` | Focus rings |

### Dark mode

| Token | Hex | Role |
|---|---|---|
| `--background` | `#1A1F1C` | Deep forest night |
| `--foreground` | `#F5F0E8` | Cream text |
| `--card` | `#242A26` | Elevated panels |
| `--primary` | `#A8C0B0` | Sage (inverted CTA) |
| `--accent` | `#C4A484` | Terracotta (preserved) |

### Accent / data viz palette

Use for mood charts, badges, illustrations:

- `#7D9B76` sage
- `#C4A484` terracotta
- `#D4B896` sand
- `#A8826B` clay
- `#6B8E7F` muted teal

---

## 3. Shape & Spacing

- **Radius:** `--radius: 1rem` (16px). Cards use `rounded-2xl` (1rem) or `rounded-3xl` (1.5rem). Buttons are pill-shaped (`rounded-full`).
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px (Tailwind defaults).
- **Container:** max-width `840px` for editorial content, `1280px` for dashboards.
- **Whitespace:** generous — minimum `py-12` on sections, `p-6` on cards.

---

## 4. Elevation & Surface

```css
--shadow-sm:     0 1px 2px hsl(155 24% 22% / 0.04);
--shadow-card:   0 4px 16px hsl(155 24% 22% / 0.06);
--shadow-lifted: 0 12px 40px hsl(155 24% 22% / 0.10);
```

- Cards rest on `--shadow-card`, lift to `--shadow-lifted` on hover.
- Avoid harsh black shadows — always tint with the foreground green.

---

## 5. Motion

Powered by **Framer Motion**.

- **Page enter:** `opacity 0→1`, `y 12→0`, 400ms `easeOut`
- **Stagger lists:** 60–80ms delay between items
- **Hover lift:** `y: -2`, `scale: 1.02`, 200ms
- **Reduced-motion:** honor `prefers-reduced-motion` — disable transforms, keep opacity only

---

## 6. Iconography

- **Library:** [lucide-react](https://lucide.dev) at `stroke-width={1.5}` for a refined, editorial line.
- **Brand mark:** feather icon — symbolizes journaling, lightness, grace.
- **Size scale:** 16 / 20 / 24 / 32 px.

---

## 7. Component Patterns

### Buttons
- **Primary:** `bg-primary text-primary-foreground rounded-full px-8 py-3 font-medium`
- **Secondary:** `border border-border bg-card rounded-full`
- **Ghost:** `hover:bg-muted rounded-full`

### Cards
- `bg-card border border-border rounded-2xl p-6 shadow-card`
- Optional accent: subtle terracotta top-border for featured cards.

### Inputs
- `bg-card border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring`

### Mood pills
- `rounded-full bg-muted px-4 py-2` with emoji + label; selected state swaps to `bg-accent text-foreground`.

---

## 8. Voice & Imagery

- **Voice:** calm, second-person, devotional but never preachy. Short sentences.
- **Photography:** natural light, soft focus, earth tones — fields, linen, candles, hands, open books. Avoid stock-religious clichés (stained glass, crosses on hilltops).
- **Illustration:** thin-line botanical motifs (olive branches, wheat, vines) in accent terracotta.

---

## 9. Accessibility

- Minimum contrast: WCAG AA (4.5:1 for body, 3:1 for large text). Forest green on cream passes both.
- Focus rings always visible (`--ring`, 2px offset).
- Touch targets ≥ 44×44px.
- All motion respects `prefers-reduced-motion`.
- Semantic HTML first; ARIA only when necessary.

---

## 10. Quick reference

```css
/* Drop into src/index.css :root */
--background: 36 33% 96%;
--foreground: 155 24% 22%;
--card: 0 0% 100%;
--card-foreground: 155 24% 22%;
--primary: 155 24% 22%;
--primary-foreground: 36 33% 96%;
--accent: 30 33% 64%;
--accent-foreground: 155 24% 22%;
--muted: 36 20% 90%;
--muted-foreground: 155 10% 40%;
--border: 36 20% 85%;
--input: 36 20% 85%;
--ring: 155 24% 22%;
--radius: 1rem;
```
