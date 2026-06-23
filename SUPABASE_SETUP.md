# Connecting the Supabase backend

The app ships **local-only** and lights up cloud features (accounts, cross-device
sync, the live Community/Prayer Wall, moderation) the moment these are set.

## 1. Create a project
- Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
- Copy **Project URL** and **anon public key** from *Project Settings → API*.

## 2. Add credentials
Create `.env.local` (git-ignored) from `.env.example`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Rebuild (`npm run build` / `npm run android:sync`). `isSupabaseConfigured`
flips to true automatically.

## 3. Run the schema
In the Supabase dashboard → **SQL Editor**, paste and run
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
It creates profiles, synced `journal_entries` + `prayers`, the community
`prayer_requests` (+ pray/report tables), all **row-level security** policies,
a profile-on-signup trigger, a pray-count trigger, and **auto-hide-after-3-reports**
moderation.

## 4. Enable auth providers
*Authentication → Providers*:
- **Email** (on by default). For dev you may disable "Confirm email".
- **Google**: add OAuth client ID/secret, then add your redirect URLs
  (web origin, and the app's deep-link/origin) to *URL Configuration*.

## 5. (Later) Push notifications
For server-sent push, add **FCM** and a Supabase Edge Function / cron to send
reminders & "someone prayed for you" — not required for the local daily reminder,
which already works on-device.

## What's wired in the app
- `src/lib/cloud/client.ts` — env-gated Supabase client (`isSupabaseConfigured`).
- `src/lib/cloud/auth.tsx` — `AuthProvider` / `useAuth` (email + Google).
- `src/lib/cloud/sync.ts` — offline-first, last-write-wins sync of journal + prayers
  (runs on sign-in and when the app regains focus).
- `src/lib/cloud/community.ts` — prayer wall: list / post / pray / report / delete.
- `/auth` screen, Settings **Account** section, and the Community **Prayer Wall**
  all activate automatically once configured + signed in.

## Data Safety note (Play Console)
Once cloud is on you collect: email (auth), journal/prayer content (synced),
and community posts. Update the Play **Data Safety** form accordingly. Personal
journal/prayer rows are protected by RLS (owner-only); community posts are
visible to authenticated users and support report + auto-hide.
