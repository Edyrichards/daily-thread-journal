# Selah — Redesign & Mockups

This folder holds the **rebrand + redesign** of the app (formerly *Threads of Grace /
Daily Thread Journal*) into **Selah — Pause. Pray. Reflect.**

- **[`RESEARCH_AND_REDESIGN.md`](./RESEARCH_AND_REDESIGN.md)** — market research, the
  "is this worth building?" verdict, what users want / what's missing, the rebrand, the
  full page & feature plan, and monetization. Start here.
- **`mockups/png/`** — a rendered mockup of every screen (3× retina, phone-sized). Open
  these on your phone.
- **`mockups/html/`** — the same screens as standalone HTML (open in a browser to tweak).
- **`build-mockups.mjs`** — single source of truth: design tokens, icons, nav, and every
  screen. Re-render with:

  ```bash
  node design/build-mockups.mjs
  ```

- **`fonts/`** — Fraunces + Inter embedded locally so rendering works offline.

## Screens
`01-welcome` · `02-today` · `03-journal` · `04-new-entry` · `05-prayer` ·
`06-guided-prayer` · `07-bible` · `08-grow` · `09-insights` · `10-community` ·
`11-journey` · `12-settings`
