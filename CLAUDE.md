# Malhan Trading Company — public website

Public site for a fertilizer, seed and pesticide shop in Odhan (Sirsa), Haryana, and NFL (National Fertilizers Ltd) authorised dealer. Served by GitHub Pages from `main` at https://malhantradingcompany.in (`CNAME`). The design spec lives in the app repo: `malhan-trading-company/docs/superpowers/specs/2026-11-15-company-website-design.md`.

## Architecture

- **No build step, no frameworks, no web fonts, no supabase-js.** Everything is in `index.html` (inline CSS and JS). The owner edits text in GitHub's web UI, and farmers load it on old Android phones over village 4G.
- **Page weight budget: under 300 KB total** (currently ~176 KB: HTML ~80 KB + hero WebP ~78 KB + footer logo WebP ~18 KB). Don't add libraries or big images.
- `config.js` holds `supabaseUrl`, the publishable anon key, `enquiryUrl`, `turnstileSiteKey` and `appUrl`. Never commit a `service_role` / secret key.
- Backend lives in the app repo (`malhan-trading-company`: `schema.sql`, `supabase/functions/enquiry/index.ts`). Code against these contracts:
  - **Rates:** `POST {supabaseUrl}/rest/v1/rpc/public_catalog`, headers `apikey` + `Content-Type: application/json`, body `{}`. **No `Authorization` header** (the key is a publishable key, not a JWT). Returns `{updatedAt, products:[{id, name, category, bagKg|null, pack: bag|bottle|can|packet|piece, size|null, sizeUnit: kg|g|L|ml, mrp|null, available}]}`. `category` is free text: Fertilizer, Seed, Pesticide and Other have translations in `T`; custom ones (added by managers in the app) show as typed, after the built-ins and before Other. Sizes show as `packLabel()` ("500 ml bottle"), prices "per <pack>". `bagKg` is legacy; use `size`.
  - **Enquiry:** `POST {enquiryUrl}`, header `apikey`, body `{name, phone, village, productId|null, product, bags, note, website (honeypot), token}`. Returns `{ok:true,id}` or `{ok:false, code: invalid|rate_limited|captcha|server}`. Network error / non-JSON / unknown code → treat as `server`.
  - Turnstile (`challenges.cloudflare.com/turnstile/v0/api.js`, explicit render) loads only when `turnstileSiteKey` is set, lazily when the form nears the viewport; otherwise send `token: ""`.

## Business facts

Only phone number shown anywhere: **9317929928** (WhatsApp `wa.me/919317929928`). The shop photo's signboard shows a second number; never put that one in text. Hours 9 AM–6 PM (weekly closed day not confirmed; JSON-LD currently lists all 7 days). GSTIN 06ADXPM1828Q1ZN (read off the signboard, to be confirmed). Licences: Ferti/2023/05315, Ferti/2023/05313, Inct Lic/2023/02863, Seed LIC/2023/03268. Owners Prem Chand Malhan (main) and Ankur Malhan, since 2026. Facts repeat in the hero, visit section, footer and the JSON-LD block — change all of them together.

## Languages

- Hindi is the default (`<html lang="hi">`). Toggle हिं / EN in the header; choice saved in `localStorage` key `malhan-site-lang` (always wrapped in try/catch).
- Static text is written in both languages in the markup: `<span class="hi" lang="hi">…</span><span class="en" lang="en">…</span>`. CSS hides the inactive language (`html[lang=hi] .en, html[lang=en] .hi {display:none}`), so the page works without JS. Every new piece of text needs both spans.
- Text built by JS comes from the `T.hi` / `T.en` dictionaries in the script; `setLang()` re-renders chips, rates, the product dropdown, field errors, the error alert and the success panel. Title and meta description also come from `T`. Image alt text uses `data-alt-hi` / `data-alt-en`.
- The H1 shows the name in both scripts at all times (spans with `lang` but no `hi`/`en` class).
- Customer-facing WhatsApp message text is **Hinglish** (Latin script), e.g. "Mujhe DAP ke 10 bag rakhwane hain."

## Conventions

- Design tokens on `:root`, **one light theme only** (owner's choice, 15 Nov 2026: everyone sees the same look; `<meta name="color-scheme" content="light">`, no `prefers-color-scheme` or `data-theme` blocks; don't add a dark mode back). Style: **clean white + green**, bright and spacious (owner found dark-green bands heavy, cream dull, boxes crowded). White page, sections alternate white / pale green `--subtle` `#F5F8F1`; soft tints `--tint`. Logo colours: deep green `--brand` `#1D360B` for headings, buttons and text accents; fresher `--leaf` `#457424` for icons and links; gold `--accent` `#C9A35B` only as small decoration (the short rule under section headings, licence card top edge), `--accent-ink` for gold text. Brick red appears only inside the logo images. No dark-green bands: the hero is light with the shop photo as the feature and a floating hours card; the footer is light with the full-colour logo. A trust bar (four reasons) sits right under the hero. Pill-shaped buttons; on phones the hero buttons are hidden because the bottom bar carries them. "Available" `--ok`, WhatsApp `--wa`/`--wa-i`, `--bad` red. Focus ring `--focus` (dark gold). The app still uses the older green/yellow.
- Logo: `img/logo.svg` is the app icon (favicon, JSON-LD `logo`), `img/icon-180.png` the apple-touch-icon, `img/logo-stacked-color.{webp,png}` the footer lockup (full colour, red Hindi wordmark, for the light footer). The header emblem is inline SVG coloured by `--brand`/`--accent` (its leaf stroke uses `--bg` to separate the leaves).
- Sentence-case labels; no all-caps eyebrow labels.
- Mobile first: works at 360px with no horizontal scroll; tap targets at least 44px; below 900px a fixed bottom bar (`.abar`: Call, WhatsApp, Directions) replaces the floating WhatsApp button, and the footer is padded so nothing hides under it. The header nav has no separate link for "What we sell"; it goes Our products, About, Visit.
- Indian formatting: `₹` via `Intl.NumberFormat("en-IN")`, dates like "15 Nov 2026" (`en-IN`, `month: "short"`), times like "10:20 am".
- **Everything rendered from data goes through `esc()`** (product names, ids, user input echoed back).
- Stock is shown only as "Available" / "Out of stock" — never "low" or quantities. `mrp: null` shows "Call for rate".
- Owner switches in `config.js` (missing = on): `showRates: false` adds `html.no-rates` — no price cells, and text marked `.rates-only` is swapped for its `.norates-only` twin ("Our products", "See fertilizers"); every new rate-related string needs both. `showStock: false` shows every product as Available; `enquiries: false` adds `html.no-enq`, which hides everything marked `.enq-only` (nav link, enquiry section), drops the Keep aside buttons and never loads Turnstile. Both are currently `false` by the owner's choice. New booking-related markup must carry `enq-only`. Tests run with both on, plus one test against the real `config.js`.
- Rates: fetch on load, then every 5 min while the tab is visible; last good response cached in `localStorage` (`malhan-site-catalog`). On failure with cache → "As of <time>"; with no cache (or empty list) → "Call for today's rates" with call/WhatsApp buttons.
- Form: mobile normalised (strip spaces, +91, leading 0) then `^[6-9][0-9]{9}$`; bags integer 1–500; name 2–60 chars. Every error message offers call/WhatsApp.

## Testing

Before pushing:

1. Syntax-check the inline script and JSON-LD (`new Function` on the extracted `<script>` body; `JSON.parse` on the ld+json).
2. Playwright against `python3 -m http.server`, with `public_catalog`, the enquiry function, Turnstile and the Google Maps iframe mocked via `page.route`. Cover: language toggle + persistence, 360/1280 px no horizontal scroll, rates rendering and both fallbacks, Keep aside prefill, form validation/success/WhatsApp link/each error code, HTML in product names rendered as text, no console errors, page weight < 300 KB.
3. Look at screenshots at 360px and 1280px in both languages (also with the device in dark mode, which must still show the light theme) before calling a visual change done.
