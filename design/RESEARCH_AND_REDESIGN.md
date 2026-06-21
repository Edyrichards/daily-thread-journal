# Selah — Research, Strategy & Redesign
### A rebrand of *Threads of Grace / Daily Thread Journal*
*Prepared June 2026*

---

## 1. The verdict: yes — this is still a very good app to build

The faith + wellness software market is large, growing fast, and attracting serious
capital — but the current product (a faith-based mood/journal app) is undifferentiated
and unfinished. The opportunity is real **if we pick a sharp position and ship a
genuinely calm, private, daily-habit product.** This document lays out the research,
the gaps, a rebrand to **Selah**, the full page/feature plan, and a rendered mockup of
every screen.

### Market signal
- **Spiritual-wellness apps** are projected to grow from **~$2.89B (2026) to ~$9.91B by 2035 (≈14.7% CAGR).**
- **Hallow** (Catholic prayer) has raised **~$157M** and was estimated at **~1M downloads / ~$1M revenue in a single recent month.**
- **Glorify** (daily Christian routine) has raised **~$84.6M** and passed **5M+ downloads / ~2.5M users.**
- **Gen Z is unexpectedly opening back up to faith** — "over half of Gen Z teens feel motivated to learn more about Jesus," and the youth gender gap in religiosity is closing. This is a rare demand tailwind for a *new* entrant.
- **AI is now trusted for spiritual input**: ~1 in 3 U.S. adults (2 in 5 among Gen Z/Millennials) say AI spiritual advice is as trustworthy as a pastor's; ~4 in 10 practicing Christians say AI has already helped their prayer or study.

**Read:** the category is proven and funded (so it's competitive), but it's growing fast
with a fresh young audience and a new AI surface area. A focused indie product can win a
niche the giants under-serve.

---

## 2. What people actually look for (and what they hate)

### What users want
| Want | Why it matters |
|---|---|
| **Low friction — one tap to something meaningful** | "If it takes more than one tap to see something meaningful, most people won't use it." Widgets, notifications, a clean home screen. |
| **Scripture woven into everything** | Reference, tag, highlight, and reflect on verses *inside* the journal — not a separate silo. |
| **Voice journaling** | Huge for commuters, parents, and people who think by speaking, not typing. |
| **AI that finds themes** | Surfacing recurring topics, **answered prayers**, and spiritual patterns is the single most-praised new feature (Psalmlog's wedge). |
| **A daily spiritual *rhythm*** | Glorify wins by bundling verse + devotional + prayer + gratitude into one morning routine. |
| **Gentle gamification** | Streaks, badges, companions, milestone rewards drive the daily-habit loop — *if* tasteful. |
| **Real privacy** | Journals are intimate; trust is the product. |

### What users complain about (our opening)
- **Predatory paywalls** — core journaling capped at ~10 pages, "most important features locked." One competitor (Digible) is winning goodwill purely by promising *"your study should never be restricted by a paywall."*
- **Clunky highlighting & weak search** in the Bible reader (whole entry highlights instead of a word; no word search).
- **Privacy betrayal** — reporting has shown prayer apps *selling users' prayers*. This is a reputational landmine and a differentiation gift.
- **Sterile, generic "Calm-clone" pastel UI** — the market is full of look-alikes.

### Gap analysis vs. our current app
Our codebase already has the *pieces* (journal, mood, prayer tracker, Bible, devotionals,
habits, community, analytics) — but spread across **27 pages** with no clear spine, generic
pastel styling, and several half-built flows. **We're feature-rich and product-poor.**

| Have (keep) | Missing / weak (build) |
|---|---|
| Mood journaling, guided new-entry flow | **Voice journaling** front-and-center |
| Prayer tracker + prayer wall | **Answered-prayer** tracking as a celebrated, first-class object |
| Bible lookup, reading plans, devotionals | **AI "themes & reflections"** over your own journal |
| Mood analytics | A single **"Today" home** that creates a one-tap daily rhythm |
| Habit tracker | **Privacy story** as a visible promise, not a footnote |
| Onboarding, settings, dark mode | A **distinct, premium, warm** visual identity (not pastel-clone) |
| | A **fair monetization** model (journaling free forever) |

---

## 3. The rebrand: **Selah**

> **Selah** /ˈseɪlə/ — a word that appears 74 times in the Psalms, widely read as a
> musical instruction to **pause and reflect.** It *is* the product in one word.

- **Name:** Selah
- **Tagline:** **Pause. Pray. Reflect.**
- **Positioning:** *The calm, private daily companion for your walk with God.* A single
  quiet moment a day — verse, prayer, and reflection — that actually respects your
  attention and your privacy.
- **Promise (the wedge):** **Journaling is free forever. Your reflections are encrypted on
  your device. We never read, share, or sell them.** This directly answers the two loudest
  complaints in the market.
- **Personality:** warm, literary, unhurried, grown-up. Less "meditation startup," more
  "a beautiful leather journal and a window of morning light."

### Visual language (a deliberate move away from pastel-clone)
- **Palette — "Dawn":** warm ivory paper `#F7F1E7`, sage `#6E8E70` (calm/primary),
  terracotta/clay `#C26B4A` (warm CTA), gold `#D7A33E` (streaks/light), warm ink `#2C2622`.
  A nighttime **"Vespers"** dark theme (deep plum) for evening prayer.
- **Type:** **Fraunces** (a warm literary serif) for scripture & headings; **Inter** for UI.
  The serif makes scripture feel like scripture.
- **Form:** soft 20–28px radii, generous whitespace, one accent per screen, subtle light
  gradients instead of stock photos. Calm, accessible, high-contrast.

---

## 4. Full page & feature plan

The 27 scattered pages collapse into **5 tabs + supporting screens**, organized around a
daily rhythm. Every screen below has a rendered mockup in `design/mockups/png/`.

### Primary navigation (bottom tabs)
1. **Today** — the home / daily rhythm
2. **Journal** — write & revisit
3. **Pray** — prayer life & guided sessions
4. **Bible** — read, plans, devotionals ("Grow")
5. **Insights** — trends, AI reflections, your journey

### Screen-by-screen

| # | Screen | Purpose & key features |
|---|---|---|
| 01 | **Welcome / Onboarding** | Brand moment; sets reminder time, translation, and the privacy promise. |
| 02 | **Today (Home)** | *One-tap meaningful:* verse of the day, "How is your heart?" mood check-in, **Today's rhythm** checklist (Read / Pray / Journal) with progress, streak. |
| 03 | **Journal** | Library of entries with mood dots, verse tags, voice tags, filter chips, search, stats; FAB to create. |
| 04 | **New Entry (guided)** | 4-step flow — Mood → Verse → Write → Reflect. **Voice journaling** + AI assist + attach-verse, with autosave & word count. |
| 05 | **Pray** | Prayer list with "days praying" & pray-count; **Active / Answered** tabs; "8 answered this year" celebration; entry to guided sessions. |
| 06 | **Guided Prayer** | Immersive Vespers mode; **A.C.T.S.** framework, breathing orb, scripture prompt, audio, gentle pacing. |
| 07 | **Bible Reader** | Clean serif reader, **per-verse** highlight/note/pray/listen/share, translation switch, inline notes, search (fixes the top reader complaints). |
| 08 | **Grow (Plans & Devotionals)** | Featured plan, continue-reading progress, devotional series by season (Gratitude, Rest, Hope, Anxiety). |
| 09 | **Insights** | Mood trend chart, **"Selah noticed…" AI reflection** (recurring themes, calmer-after-prayer), key counts (streak, answered, days in the Word). |
| 10 | **Community (Prayer Wall)** | Safe, moderated wall; anonymous option; "I prayed" reactions; **answered-prayer** highlights; carry each other's burdens. |
| 11 | **Your Journey** | Tasteful streaks + milestone progress + badge collection. Gamification that encourages, never nags. |
| 12 | **Profile & Settings** | **Privacy-by-design** card, reminders, translation, theme, data export, and **Selah Plus**. |

---

## 5. Monetization (deliberately not predatory)

- **Free forever:** unlimited journaling, mood tracking, daily verse, basic prayer list,
  Bible reader, community. *(This is the trust wedge against the paywall complaints.)*
- **Selah Plus (~$4.99/mo or ~$39.99/yr — undercut Hallow's $69.99):**
  - AI "themes & reflections" over your journal
  - Audio-guided prayer & full plan library
  - Vespers + custom themes, premium devotionals
  - Cross-device encrypted sync
- **Never:** sell or train on user reflections. Stated plainly, in-app.

---

## 6. The mockups

Twelve phone screens (1206×2622 px, 3× retina) are in **`design/mockups/png/`**:

```
01-welcome   02-today    03-journal   04-new-entry
05-prayer    06-guided-prayer         07-bible
08-grow      09-insights 10-community 11-journey   12-settings
```

They're generated from a single source of truth — a design-system + HTML generator —
so the look is consistent and easy to iterate:

```bash
node design/build-mockups.mjs        # re-renders all PNGs + HTML
```

- Design tokens (color, type, spacing), icon set, status bar and bottom-nav are all
  defined once in `design/build-mockups.mjs`.
- Per-screen HTML is also written to `design/mockups/html/` if you want to open/tweak in a
  browser.
- Fonts are embedded locally (`design/fonts/`) so rendering needs no network.

### Suggested build order
1. **Today + New Entry + Journal** (the core daily loop) → 2. **Bible reader + Pray** →
3. **Insights + AI reflections** (the retention & differentiation layer) →
4. **Community + Journey** → 5. **Plus / monetization.**

---

## Sources
- [Best Christian Journal Apps 2026 — Psalmlog](https://psalmlog.com/blog/best-christian-journal-apps-2026/)
- [Best Spiritual Journaling Apps 2026 — Psalmlog](https://psalmlog.com/blog/best-spiritual-journaling-apps-2026/)
- [Best AI Bible Study Apps 2026 — Psalmlog](https://psalmlog.com/blog/top-bible-study-apps-personalized-guidance-2026/)
- [Best Bible Journaling Apps 2026 — Digible](https://digibleapp.com/guides/best-bible-journaling-app)
- [Best Bible Apps 2026 — chMeetings](https://www.chmeetings.com/blog/best-bible-apps/)
- [Spiritual Wellness Apps Market — Grand View Research](https://www.grandviewresearch.com/industry-analysis/spiritual-wellness-apps-market-report)
- [Spiritual Wellness Apps Market Sizing — Towards Healthcare](https://www.towardshealthcare.com/insights/spiritual-wellness-apps-market-sizing)
- [VCs See Profit in Prayer — Christianity Today](https://www.christianitytoday.com/2022/01/app-investment-prayer-bible-meditation-glorify-hallow/)
- [Hallow profile — Tracxn](https://tracxn.com/d/companies/hallow/__KTAm122vA7UhIoIBJEq8-DwcfbdA9OICMot6EdRuxfs)
- [Glorify profile — Tracxn](https://tracxn.com/d/companies/glorify/__jYZe4FPt7DCeSTq2lUeKbMLCc2SVK3K-8Knfv4bElpQ)
- [Apps Reserve The Right To Sell Your Prayers — BuzzFeed News](https://www.buzzfeednews.com/article/emilybakerwhite/apps-selling-your-prayers)
- [State of the Church 2026 Trends — Barna](https://www.barna.com/research/state-of-the-church-2026-trends/)
- [Gen Z Faith Resurgence — Christian Standard](https://christianstandard.com/2026/05/hope-for-the-future/)
- [Best Christian AI Apps 2026 — faith.tools](https://faith.tools/artificial-intelligence-ai)
- [UX/UI Design Trends 2026 — Envato](https://elements.envato.com/learn/ux-ui-design-trends)
- [The 10 Best Journaling Apps of 2026 — Architect](https://architectapp.ai/blog/best-journaling-apps-2026)
