# Threads of Grace — Android Launch Plan

Status of the codebase: a **Vite + React SPA**, data stored **locally** (localStorage),
Bible bundled **offline** (WEB + KJV in `public/bible`), production build succeeds
(~394 KB gzip JS). PWA scaffolding exists (`manifest.json`, `public/sw.js`,
`usePWA`). This plan takes it to a **published Google Play app**.

---

## Recommended path: **Capacitor** (native wrapper)
Capacitor wraps the existing web build in a native Android shell, gives us the
Play Store + native plugins (notifications, microphone, file/share), and needs
**no rewrite**. (A pure **TWA/Bubblewrap** PWA is simpler but needs web hosting,
can't fix the WebView speech/export gaps, and feels less "app-like" — not
recommended for v1 given voice journaling + reminders.)

---

## Phase 0 — Decisions that change scope (do first)
1. **MVP shape — local-only vs. backend?** Today everything is on-device and the
   **Community / Prayer Wall is sample data with no server.** Choose:
   - **A. Local-only v1 (fastest):** ship journaling, prayer, Bible, journey,
     guided prayer. **Hide/disable Community** (or mark "coming soon"). No
     accounts, no sync, no push. → can launch in ~1–2 weeks of work.
   - **B. Connected v1:** real accounts, cloud **sync**, live **Community/Prayer
     Wall**, **push**. Requires a backend (Supabase or Firebase) + moderation.
     → adds 3–6+ weeks and ongoing ops/cost.
2. **App identity:** package id (e.g. `com.threadsofgrace.app`), legal app name,
   developer account (Google Play Console, $25 one-time).
3. **Monetization:** free, or "Plus" (Play Billing) — affects Data Safety + review.
4. **Translations:** WEB + KJV are public-domain ✓. NIV/ESV would need licensing
   (not bundled).

---

## Phase 1 — Production-harden the web app
- [ ] **Remove the Lovable dev script** `https://cdn.gpteng.co/gptengineer.js` from `index.html`.
- [ ] **Fix `manifest.json`**: correct name/short_name/description, `theme_color`
      `#324A3A`, `background_color` `#F5F0E8`, real **maskable icons** (192/512),
      categories. (Currently purple `#8b5cf6` + `placeholder.svg`.)
- [ ] **App icons & splash**: design adaptive icon (foreground feather + forest bg)
      + splash; generate densities via `@capacitor/assets`.
- [ ] **Code-split routes** (`React.lazy`) — single 1.37 MB chunk → faster cold start.
- [ ] **Prune legacy**: remove the old `*-legacy` routes/pages (purple theme,
      Lovable) to shrink bundle and avoid dead ends.
- [ ] **Review the service worker** (`public/sw.js`) — make sure it caches the app
      shell + `public/bible/*` for offline; or rely on Capacitor's bundled assets.
- [ ] **Env/config**: any API keys (none required now) via `.env`; set base `/`.
- [ ] **Accessibility pass** (design.md §9): focus-visible rings, ≥44px targets,
      labels on icon-only buttons, contrast, reduced-motion (partly done).
- [ ] **Empty/error/offline states** audited across pages.

## Phase 2 — Capacitor + Android project
- [ ] `npm i @capacitor/core @capacitor/cli @capacitor/android`
- [ ] `npx cap init "Threads of Grace" com.threadsofgrace.app --web-dir=dist`
- [ ] `npx cap add android`; commit the `android/` project.
- [ ] Build flow: `vite build` → `npx cap copy` → open in Android Studio / Gradle.
- [ ] Configure `capacitor.config.ts` (app name, scheme `https`, splash, status bar).
- [ ] Verify routing, deep links, and that `/bible/...` assets load inside WebView.

## Phase 3 — Native integrations (fixes web-only gaps)
- [ ] **Local notifications** for the **Daily Reminder** (currently stored but does
      nothing): `@capacitor/local-notifications` — schedule at chosen time, handle
      permission, reschedule on boot.
- [ ] **Voice journaling**: Web Speech API **does not work in Android WebView** →
      `@capacitor-community/speech-recognition` + `RECORD_AUDIO` permission +
      mic-rationale UI. Fall back gracefully if denied.
- [ ] **Export / Backup / Restore**: browser `a.click()` download is unreliable in
      WebView → `@capacitor/filesystem` + `@capacitor/share` (write JSON, share
      sheet); restore via file picker.
- [ ] **Share** (verse/insight): `@capacitor/share` instead of `navigator.share`.
- [ ] **Status bar / splash / back button**: `@capacitor/status-bar`,
      `@capacitor/splash-screen`, `@capacitor/app` (Android hardware back).
- [ ] **Haptics** on key actions (optional polish).
- [ ] **Storage durability**: localStorage persists in WebView, but consider
      `@capacitor/preferences` for critical prefs to avoid eviction.

## Phase 4 — Backend (only if Phase 0 = "Connected v1")
- [ ] Choose **Supabase** (Postgres + Auth + RLS + Realtime) or **Firebase**.
- [ ] **Auth** (email/Google) + account screen.
- [ ] **Cloud sync** of journal/prayers (offline-first, conflict handling).
- [ ] **Community/Prayer Wall** tables + **moderation** + report/block (Play
      requires UGC moderation).
- [ ] **Push** via FCM for reminders/answers.

## Phase 5 — Store readiness & compliance
- [ ] **Signing**: generate upload keystore; enroll in **Play App Signing**; build
      a signed **AAB** (`./gradlew bundleRelease`).
- [ ] **Target API level**: meet Google's current minimum (Android 14 / API 34+).
- [ ] **Permissions**: declare only what's used (INTERNET, RECORD_AUDIO,
      POST_NOTIFICATIONS) with in-app rationale.
- [ ] **Privacy Policy + Terms**: host at real URLs; wire the Settings links.
- [ ] **Data Safety form**: declare what's collected. Our story is strong
      ("on-device, not sold") — the form must match reality (esp. if backend added).
- [ ] **Content rating** (IARC questionnaire).
- [ ] **Store listing**: title, short/long description, **feature graphic**,
      phone **screenshots** (we can generate these from the live app), category
      (Lifestyle), contact email.
- [ ] **Versioning**: `versionCode`/`versionName` strategy.

## Phase 6 — QA & rollout
- [ ] Test on multiple devices/screen sizes + Android back/gestures + offline +
      permission-denied paths + dark mode.
- [ ] **Internal testing** track → **Closed testing** (Play now requires a closed
      test with testers before production for new personal devs) → **Production**
      staged rollout.
- [ ] Crash/analytics (e.g. Sentry/Firebase Crashlytics) — privacy-respecting.

---

## Critical blockers to flag now
1. **Voice journaling breaks in WebView** → needs the speech plugin (Phase 3).
2. **Daily reminder does nothing** → needs local notifications (Phase 3).
3. **Export/Backup won't work as-is in WebView** → Filesystem/Share (Phase 3).
4. **Community has no backend** → decide A vs B in Phase 0.
5. **Lovable dev script + placeholder manifest/icons** must be fixed (Phase 1).

## Suggested first sprint (gets a real installable build fast)
Phase 1 cleanup → Phase 2 Capacitor wrap → Phase 3 notifications + voice + export
→ signed AAB to **Internal testing**. That yields a genuine, installable Android
app (local-only MVP, Community hidden) you can put on a device and into closed
testing while backend (if wanted) is built in parallel.
