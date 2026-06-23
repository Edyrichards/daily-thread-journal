# Signing & release

## 1. Create an upload keystore (once)
```bash
keytool -genkey -v -keystore upload.keystore \
  -alias threads-upload -keyalg RSA -keysize 2048 -validity 10000
```
Keep `upload.keystore` and its passwords safe and **out of git**.

## 2. Add CI secrets (GitHub → Settings → Secrets → Actions)
| Secret | Value |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload.keystore` output |
| `ANDROID_KEYSTORE_PASSWORD` | store password |
| `ANDROID_KEY_ALIAS` | `threads-upload` |
| `ANDROID_KEY_PASSWORD` | key password |
| `VITE_SUPABASE_URL` | (optional) for connected builds |
| `VITE_SUPABASE_ANON_KEY` | (optional) for connected builds |

## 3. Build
- Tag a release: `git tag v1.0.0 && git push --tags`, or run the
  **Android Release (AAB)** workflow manually.
- Download the `threads-of-grace-release-aab` artifact.

## 4. Play Console (one-time)
- Create the app, enroll in **Play App Signing** (upload your upload key, or let
  Google generate the app signing key).
- First release goes to **Internal testing**, then **Closed testing** (required
  for new personal developer accounts), then **Production**.
- Complete: Data Safety form, Content rating (IARC), target audience, store
  listing (use `store/PLAY_LISTING.md` + `store/screenshots/`), and set the
  privacy-policy URL.

## Local build (with Android Studio)
```bash
npm run android:sync     # build web + copy into android/
npm run android:open     # open in Android Studio → Build > Generate Signed Bundle
```
