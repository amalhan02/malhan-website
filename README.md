# Malhan Trading Company website

The public website for Malhan Trading Company, Odhan (Sirsa), Haryana.

- Address: https://malhantradingcompany.in
- Hosted on GitHub Pages from the `main` branch, root folder.
- Everything is in `index.html`. There is no build step: change a file on GitHub, and the site updates in a minute or two.
- Today's rates and stock come live from the shop app (Supabase). Enquiries ("keep bags aside") go to the **Enquiries** tab in the app.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site: text, design and code |
| `config.js` | Supabase address, public key, enquiry address, Turnstile site key, staff app link |
| `img/shop.webp`, `img/shop.jpg` | Shop-front photo (WebP for most phones, JPEG as a fallback and for WhatsApp previews) |
| `img/logo.svg` | The "M" logo and browser tab icon |
| `CNAME` | The custom domain, `malhantradingcompany.in`. Don't delete it, or the domain stops working |
| `robots.txt`, `sitemap.xml` | For Google |

## Change some text

1. Open the repo on github.com and click `index.html`.
2. Click the pencil icon (Edit this file).
3. Press Ctrl+F (or Cmd+F) and search for the words you want to change.
4. Every sentence is written twice, in Hindi and English, like this:

   ```html
   <span class="hi" lang="hi">सुबह 9 से शाम 6 बजे तक</span><span class="en" lang="en">9 AM to 6 PM</span>
   ```

   Change the words between `>` and `<`. Change **both** languages. Don't touch the parts inside `< >`.
5. Click **Commit changes**. Wait a minute or two and reload the site.

Things that appear in more than one place: the phone number, address, hours and licence numbers are each written in several places (hero, visit section, footer, and the `application/ld+json` block near the top that Google reads). Search for the old value and change every match.

Hours: the JSON-LD block says open every day 09:00–18:00. If the shop has a weekly closed day, remove that day from `"dayOfWeek"` and mention it in the hours text.

Rates are **not** edited here. They come from the shop app's Products. Untick "Show on website" on a product to hide it.

## Change the photo

1. Take a landscape-ish or portrait photo of the shop front, in daylight.
2. Make it about 800–1000 px wide and save two copies: `shop.webp` (about 80 KB) and `shop.jpg` (about 100 KB). Free tool: https://squoosh.app (choose WebP, quality ~70; then MozJPEG, quality ~60).
3. On GitHub, open the `img` folder, click **Add file → Upload files**, drop both files (same names), and commit.
4. If the new photo has a different size, update `width="765" height="1020"` on the `<img>` in `index.html`, and `og:image:width` / `og:image:height` near the top.

Keep the total small: villagers open this on 4G. The whole page should stay under 300 KB.

## Domain (malhantradingcompany.in, registered at Hostinger)

The domain is already written into `CNAME`, `sitemap.xml`, `robots.txt`, and the canonical / `og:url` / JSON-LD lines in `index.html`.

1. **DNS at Hostinger:** hPanel → Domains → malhantradingcompany.in → DNS / Nameservers → DNS records.
   - Delete any existing `A` record for `@` and any "parked" / `ALIAS` record for `@`.
   - Add four `A` records, name `@`:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add a `CNAME` record: name `www`, target `amalhan02.github.io`.
   - (Optional, for IPv6) four `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
2. **GitHub:** repo → Settings → Pages → Source: "Deploy from a branch", `main`, `/ (root)`. Custom domain: `malhantradingcompany.in` → Save. When the DNS check turns green (can take up to a day), tick **Enforce HTTPS**.
3. Recommended: in your GitHub account settings → Pages, **verify** the domain so nobody else can claim it.

If the domain ever changes: edit `CNAME`, then search for `malhantradingcompany.in` in `index.html`, `sitemap.xml` and `robots.txt` and replace every match.

## Spam protection (Cloudflare Turnstile)

Until a site key is set, the form works without the "I'm human" check (the server still limits each phone number to 3 enquiries a day and 60 an hour for the shop).

1. Make a free Cloudflare account → **Turnstile** → **Add widget**.
2. Hostname: `malhantradingcompany.in` (add `www.malhantradingcompany.in` too). Mode: **Managed**.
3. Copy the **site key** into `config.js`: `turnstileSiteKey: "0x4AAAA..."`. Commit.
4. Put the **secret key** in Supabase only (Edge Functions → Secrets → `TURNSTILE_SECRET`). **Never** put the secret key in this repo.

## Google Business Profile

So the shop shows up on Google Maps and Search with the right details:

1. Go to https://business.google.com and sign in with the shop's Google account.
2. Search for "Malhan Trading Company, Odhan" and claim it (or update it if already claimed). Google may verify by phone, SMS, video or postcard.
3. Make sure these match the website exactly:
   - Name: Malhan Trading Company
   - Category: Fertilizer supplier (add Seed supplier, Agricultural shop / Pesticide supplier as extra categories)
   - Address: Near Nac Town, Odhan (Sirsa), Haryana 125077
   - Phone: 93179 29928
   - Hours: 9 AM – 6 PM (and the closed day, if any)
   - Website: https://malhantradingcompany.in
4. Add photos of the shop front and inside. Ask happy customers for reviews.

## Settings in `config.js`

| Setting | Meaning |
|---|---|
| `supabaseUrl` | The shop app's Supabase project |
| `supabaseAnonKey` | The **publishable** (public) key. Safe to publish. Never put a `service_role` / secret key here |
| `enquiryUrl` | The `enquiry` Edge Function |
| `turnstileSiteKey` | Cloudflare Turnstile site key, or `""` to switch the check off |
| `appUrl` | Where the small "Staff login" link in the footer goes |
| `showStock` | `false` (now): every product shows "Available". `true`: shows real Available / Out of stock from the shop app |
| `enquiries` | `false` (now): no "Keep aside" buttons and no booking form. `true`: farmers can send keep-aside requests, which appear in the app's Enquiries tab |

To change a switch: open `config.js` on GitHub → pencil icon → change `false` to `true` → **Commit changes**. The site updates in about a minute.
