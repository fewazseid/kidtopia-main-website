# Admin Dashboard Connection

How Laravel Cloud, this Kidtopia website, and Firebase work together so **Manage Website** opens the Admin CMS.

## Overview

| System | Role |
|--------|------|
| **Laravel Cloud** | Only human login / system dashboards. **Manage Website** button mints a Firebase custom token and redirects here. |
| **This website** (`/admin/sso` → `/admin`) | Receives the token, signs into Firebase Auth, opens `AdminDashboard`. |
| **Firebase** | Auth session for the editor + Firestore storage for all editable website content. |

Visitors browse the public site by **reading** Firestore. Admins **write** content only after a valid Firebase Auth session from Laravel SSO.

## Happy path

```
Admin logs into Laravel
        ↓
Clicks "Manage Website"
        ↓
Laravel (Firebase Admin SDK) creates custom token
        ↓
Redirect → {WEBSITE_ORIGIN}/admin/sso?token=...
        ↓
Website: signInWithCustomToken(token)
        ↓
Role check (must be admin)
        ↓
Navigate to /admin (AdminDashboard)
        ↓
CMS reads/writes Firestore (content, settings, bookings, …)
```

### Example redirect URL (local)

```
http://localhost:3000/admin/sso?token=<FIREBASE_CUSTOM_TOKEN>
```

Production: same path on your Yegara domain:

```
https://YOUR-DOMAIN/admin/sso?token=<FIREBASE_CUSTOM_TOKEN>
```

Do not commit or share live tokens; they expire quickly.

## What each side must do

### Laravel

1. Allow only authenticated **admins**.
2. Use Firebase Admin SDK for project `gen-lang-client-0190889089` (same as this site).
3. Mint a custom token for the website editor Firebase user (e.g. UID `website_editor`).
4. Redirect to `{WEBSITE_ORIGIN}/admin/sso?token={customToken}`.
5. Keep the service account JSON on the server only.

Env example:

```env
WEBSITE_ORIGIN=http://localhost:3000
```

### This website

| Piece | Location |
|-------|----------|
| SSO entry | [`src/pages/AdminSsoPage.tsx`](src/pages/AdminSsoPage.tsx) — route `/admin/sso` |
| Custom token sign-in | [`src/firebase.ts`](src/firebase.ts) — `loginWithCustomToken` |
| Admin gate | [`src/components/ProtectedRoute.tsx`](src/components/ProtectedRoute.tsx) |
| CMS UI | [`src/pages/AdminDashboard.tsx`](src/pages/AdminDashboard.tsx) |
| Laravel login URL | [`src/config.ts`](src/config.ts) — `VITE_LARAVEL_LOGIN_URL` |
| Firebase web config | [`firebase-applet-config.json`](firebase-applet-config.json) |

Behavior:

- `/login` and Header **Login** → Laravel Cloud login (no website password form).
- Unauthenticated `/admin` → Laravel login.
- Logout from AdminDashboard → Laravel login.

### Firebase

| Service | Use |
|---------|-----|
| **Auth** | Session after SSO (`signInWithCustomToken`). |
| **Firestore** (DB id `ai-studio-8ffecb1d-4453-4c2f-a3c1-0945971372b2`) | Site content (`content/en`, `content/am`), `settings/*`, bookings, users, newsletter. |
| **Storage** | Optional CMS uploads. |

## Who counts as admin

[`getUserRole`](src/firebase.ts) returns `admin` if the signed-in user’s email:

- ends with `@kidtopiaet.internal`, or
- matches a few hardcoded admin emails / `settings/admin_config` worker email, or
- has `users/{uid}.role === "admin"` in Firestore.

**Recommendation:** Laravel’s editor user email should be like `website_editor@kidtopiaet.internal` (or ensure Firestore `users/website_editor` has `role: "admin"`).

## What is not used for this flow

- Express `/api/login` + SQLite `admin`/`admin` — unused for CMS auth.
- Old website username/password login UI — removed; access is Laravel → SSO only.

## Quick troubleshooting

| Symptom | Check |
|---------|--------|
| SSO page says missing token | Laravel redirect must include `?token=` |
| Sign-in fails | Same Firebase project; valid custom token; Auth enabled |
| “Not authorized to edit” | Editor email / Firestore `users/{uid}.role` is not admin |
| Token works once then fails | Token expired; click Manage Website again |
| Localhost Auth error | Add `localhost` to Firebase Auth → Authorized domains |

## Related Laravel login

- System login: `https://kidtopia-main-u5x6pj.laravel.cloud/login`
- Override on this site via `VITE_LARAVEL_LOGIN_URL` in `.env`
