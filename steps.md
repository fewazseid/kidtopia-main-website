# Deploy Kidtopia Website to Yegara DirectAdmin

This guide deploys the React website to the root of [`kidtopiainternational.com`](http://kidtopiainternational.com/) as static files on **Yegara DirectAdmin**. The Laravel application remains on Laravel Cloud. Do not upload or run the Express server, SQLite database, Dockerfile, or `server.cjs` on Yegara.

## 1. Configure Laravel mail

The static website sends email through the Laravel application:

```text
kidtopiainternational.com → POST Laravel /api/website/email → Laravel mailer
```

1. Generate a long random token. One PowerShell option:

```powershell
[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLower()
```

2. Add these variables to the Laravel Cloud environment:

```env
WEBSITE_ORIGIN="https://kidtopiainternational.com"
WEBSITE_MAIL_TOKEN="paste_the_generated_token"
```

Laravel also allows the `http://` twin of that origin automatically (CORS + auth), so email still works if someone opens the site without HTTPS. Prefer forcing HTTPS on DirectAdmin so visitors always use `https://kidtopiainternational.com`. For `www`, add:

```env
WEBSITE_ALLOWED_ORIGINS="https://www.kidtopiainternational.com,http://www.kidtopiainternational.com"
```

3. Configure Laravel Cloud's normal `MAIL_*` variables for SMTP, Resend, Postmark, or another Laravel-supported mailer.
4. Deploy the Laravel application and confirm `POST /api/website/email` exists.

The endpoint validates the request, checks the configured origin and bearer token, and limits each IP address to 10 requests per minute. The browser must contain the same token, so it is an abuse deterrent rather than a private server credential. Rotate it if abused. For stronger public-form protection later, add Turnstile or reCAPTCHA.

## 2. Configure the local production build

Open the website `.env` and set the Laravel system base URL once (login, enroll, and mail API are derived from it):

```env
VITE_SITE_URL="https://kidtopiainternational.com"
VITE_LARAVEL_APP_URL="https://app.kidtopiainternational.com"
VITE_WEBSITE_MAIL_TOKEN="the_same_token_used_by_laravel"
```

Optional overrides (only if a path must differ):

```env
# VITE_LARAVEL_LOGIN_URL="https://app.kidtopiainternational.com/login"
# VITE_LARAVEL_ENROLL_URL="https://app.kidtopiainternational.com/enroll"
# VITE_LARAVEL_API_URL="https://app.kidtopiainternational.com"
```

Never upload `.env`, a Gmail app password, Firebase service-account JSON, or any other private key to `public_html`.

## 3. Build locally

From the website project:

```powershell
cd "C:\Users\pc\Desktop\kidtopia-main-website"
npm ci
npm run lint
npm run build:static
```

The deployable files are created in `dist`. The static build intentionally does not create `server.cjs`.

Confirm that `dist` contains:

- `index.html`
- `.htaccess`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `sw.js`
- `manifest.json`
- other public assets

## 4. Connect the domain in DirectAdmin

Use the exact DNS values shown in the Yegara / DirectAdmin account because server addresses differ by account.

1. Log in to DirectAdmin (usually `https://your-server:2222` or the URL Yegara gave you).
2. Open **Account Manager → Domain Setup**.
3. Confirm `kidtopiainternational.com` is the primary domain (it already shows the Yegara “Coming Soon” page).
4. Point the root domain and `www` to Yegara using either:
   - Yegara nameservers, or
   - the A/CNAME records shown in DirectAdmin **DNS Management**.
5. Keep Laravel at [https://app.kidtopiainternational.com/](https://app.kidtopiainternational.com/) (Laravel Cloud). Do not point that subdomain’s DNS at DirectAdmin.
6. Wait for DNS propagation if you changed DNS.

## 5. Upload through DirectAdmin File Manager

1. Open **System Info & Files → File Manager**.
2. Open the document root for `kidtopiainternational.com`. On DirectAdmin this is usually:

```text
/domains/kidtopiainternational.com/public_html
```

   (Some accounts still use `~/public_html` for the main domain.)
3. Back up any existing files (including the current Coming Soon page).
4. **Do not empty `public_html`.** Other apps already use a shared `uploads/` folder and `kidtopia_media.php` there. Leave those (and similar shared folders such as `cgi-bin/` or `.well-known/`) untouched.
5. Remove only the default Yegara landing page / old website files (`index.html`, `assets/`, etc.). Never delete `uploads/` or `kidtopia_media.php`.
6. Show hidden files so `.htaccess` is visible (File Manager settings / “Show Hidden Files”).
7. Upload the **contents inside `dist`**, not the `dist` folder itself.
   - You can zip `dist` locally, upload the zip, then extract it **into** `public_html` so existing files are overwritten.
   - Do **not** extract into a fresh empty folder and then replace all of `public_html`.
   - Then delete the zip.
8. Verify that `public_html/.htaccess` exists next to `index.html`, and that `public_html/uploads/` and `public_html/kidtopia_media.php` are still present.

The correct result is:

```text
public_html/
├── .htaccess
├── index.html
├── assets/
├── sw.js
├── manifest.json
├── kidtopia_media.php   ← keep this; other apps use it
├── uploads/             ← keep this; other apps use it
└── ...
```

Do not upload:

- `node_modules`
- `src`
- `.env`
- `server.ts`
- `src/server`
- `data/app.db`
- `Dockerfile`
- Firebase service-account credentials

**DirectAdmin HTTPS folder note:** if older domains use a separate `private_html` for HTTPS, open **Domain Setup → kidtopiainternational.com** and set `private_html` to a symbolic link to `public_html` so HTTP and HTTPS serve the same files.

## 6. Enable HTTPS in DirectAdmin

1. Open **Account Manager → SSL Certificates**.
2. Enable **Secure SSL**.
3. Choose **Free & automatic certificate from Let's Encrypt**.
4. Include at least:
   - `kidtopiainternational.com`
   - `www.kidtopiainternational.com`
5. Save / issue the certificate.
6. Enable **Force SSL with https redirect**.
7. Confirm `https://kidtopiainternational.com` loads without a certificate warning.

Do not test Firebase SSO over plain HTTP in production. The current [Coming Soon](http://kidtopiainternational.com/) page is on HTTP — finish SSL before relying on Admin SSO.

## 7. Configure Firebase for the production domain

In Firebase Console for project `gen-lang-client-0190889089`:

1. Open **Authentication → Settings → Authorized domains**.
2. Add `kidtopiainternational.com`.
3. Add `www.kidtopiainternational.com` only when the site will use that hostname.
4. Confirm Firestore rules allow public content reads and permit CMS writes only for authenticated admins.

The Firebase web API key in `firebase-applet-config.json` is a client identifier, not a server secret. Security must be enforced by Firebase Auth and Firestore rules.

## 7b. SEO checklist after go-live

1. Confirm these are publicly reachable:
   - `https://kidtopiainternational.com/robots.txt`
   - `https://kidtopiainternational.com/sitemap.xml`
2. In Google Search Console, add `kidtopiainternational.com` and submit the sitemap URL.
3. Confirm page titles change when you open `/about`, `/programs`, `/contact`, etc.
4. Optionally share a page URL in Facebook/WhatsApp and check the preview card.
5. Prefer HTTPS only (force SSL) so search engines index the secure site.

## 8. Test the deployed website

Test each item:

1. Open `https://kidtopiainternational.com`.
2. Open `/about`, refresh the browser, and confirm it does not show 404.
3. Open `/programs`, `/book-tour`, and `/contact`.
4. Submit a contact form and verify Laravel sends the message.
5. Book a test tour and verify parent/admin emails.
6. Open `/admin` while logged out and confirm it redirects to the current Laravel login.
7. Test Laravel **Manage Website** after `WEBSITE_ORIGIN=https://kidtopiainternational.com`.
8. Refresh `/admin` after SSO and confirm the CMS remains accessible.
9. Edit harmless website text and confirm Firestore updates appear publicly.
10. Check the browser console for Firebase, service-worker, or mixed-content errors.

If an old version appears, hard refresh once and unregister the old service worker in browser developer tools. The current service-worker cache is `kidtopia-yegara-v3`.

## 9. Laravel custom domain

The Laravel system is live at [https://app.kidtopiainternational.com/](https://app.kidtopiainternational.com/).

On Laravel Cloud, keep:

```env
APP_URL="https://app.kidtopiainternational.com"
WEBSITE_ORIGIN="https://kidtopiainternational.com"
WEBSITE_MAIL_TOKEN="same_token_as_website_build"
```

On the website build, keep:

```env
VITE_LARAVEL_APP_URL="https://app.kidtopiainternational.com"
VITE_WEBSITE_MAIL_TOKEN="same_token_as_laravel"
```

After changing either side, rebuild the website with `npm run build:static` and re-upload `dist/` to DirectAdmin.

## 10. Future deployments

For every update:

1. Pull or save the latest source.
2. Run `npm ci` when dependencies changed.
3. Run `npm run lint`.
4. Run `npm run build:static`.
5. Back up the current DirectAdmin `public_html` (copy it somewhere safe; do not delete it in place).
6. Upload/overwrite **only** the new `dist` files (`index.html`, `assets/`, `.htaccess`, `sw.js`, etc.) on top of the existing `public_html`.
7. **Never delete or replace `public_html/uploads/` or `public_html/kidtopia_media.php`.** They belong to other apps on the same domain. Also leave `cgi-bin/` and `.well-known/` if they exist.
8. Confirm `.htaccess` was uploaded and is visible, and that `uploads/` and `kidtopia_media.php` are still there.
9. Test one public route, email delivery, and Admin SSO.

The admin AI translation/helper buttons require a separately hosted API configured through `VITE_API_URL`. When it is empty, those tools show a clear unavailable message; the website and normal CMS editing continue to work.
