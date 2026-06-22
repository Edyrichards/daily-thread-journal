# Threads of Grace — Redesign Design System
**Theme:** Sacred Minimalism — warm, editorial, contemplative. Earth tones, generous whitespace, elegant serif headlines paired with a clean humanist sans.

> This file is the single source of truth for the visual system. Components must
> read colors from the HSL tokens in `src/index.css` (never hardcode), use the
> two-font stack below, and stay within the earth-tone palette (no gold / blue /
> purple / lavender).

---
## 1. Typography
### Display / Headlines — **Cormorant Garamond**
- Weights: 400, 500, 600 — scripture verses, page titles, section headers, hero quotes.
- High-contrast serif, calligraphic italics, devotional/editorial feel.
### Body / UI — **Inter**
- Weights: 400, 500, 600 — body copy, buttons, labels, navigation, metadata, inputs.
### Import
```css
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap");
```
### Tailwind
```ts
fontFamily: {
  display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
  sans:    ['Inter', 'system-ui', 'sans-serif'],
}
```

---
## 2. Color Palette (HSL tokens in `src/index.css`)
### Light
| Token | HSL | Role |
|---|---|---|
| `--background` | `36 33% 96%` | warm cream canvas |
| `--foreground` | `155 24% 22%` | deep forest text |
| `--card` | `0 0% 100%` | white surfaces |
| `--primary` | `155 24% 22%` | forest green (CTAs) |
| `--accent` | `30 33% 64%` | soft terracotta / clay |
| `--muted` | `36 20% 90%` | subtle backgrounds |
| `--muted-foreground` | `155 10% 40%` | secondary text |
| `--border` | `36 20% 85%` | hairlines |
| `--ring` | `155 24% 22%` | focus rings |
### Dark
`--background #1A1F1C` · `--foreground #F5F0E8` · `--card #242A26` · `--primary #A8C0B0` (sage) · `--accent #C4A484`.
### Data-viz / accent (earth tones only)
`#7D9B76` sage · `#C4A484` terracotta · `#D4B896` sand · `#A8826B` clay · `#6B8E7F` muted teal.

---
## 3. Shape & Spacing
- `--radius: 1rem`. Cards `rounded-2xl`/`rounded-3xl`; buttons pill (`rounded-full`).
- Spacing: 4/8/12/16/24/32/48/64. Generous whitespace.

## 4. Elevation (tinted with forest, never harsh black)
```css
--shadow-sm:     0 1px 2px  hsl(155 24% 22% / 0.04);
--shadow-card:   0 4px 16px hsl(155 24% 22% / 0.06);
--shadow-lifted: 0 12px 40px hsl(155 24% 22% / 0.10);
```

## 5. Motion (Framer Motion)
Page enter opacity+y 400ms easeOut; stagger 60–80ms; hover lift y:-2 scale:1.02; honor `prefers-reduced-motion`.

## 6. Iconography
lucide-react at `stroke-width 1.5`. Brand mark: feather. Sizes 16/20/24/32.

## 7. Components
- **Primary button:** `bg-primary text-primary-foreground rounded-full px-8 py-3 font-medium` (Inter).
- **Card:** `bg-card border border-border rounded-2xl p-6 shadow-card`.
- **Input:** `bg-card border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-ring`.
- **Mood pill:** `rounded-full bg-muted px-4 py-2`; selected → `bg-accent text-foreground`.

## 8. Voice & Imagery
Calm, second-person, devotional, never preachy. Natural-light earth-tone imagery; thin-line botanical motifs in terracotta. Avoid stained-glass / hilltop-cross clichés.

## 9. Accessibility
WCAG AA contrast; visible focus rings; touch targets ≥ 44px; respect reduced motion; semantic HTML first.
