# Logo and Brand Colours Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the owner's logo on the site and retheme every colour token to the logo palette.

**Architecture:** Static assets go in `img/`. The header emblem is an inline `<svg>` whose fills come from CSS tokens, so it follows light and dark themes. The footer lockup is a `<picture>` (WebP + PNG). Colours change only in the `:root` token blocks.

**Tech Stack:** Plain HTML/CSS in `index.html`. `cwebp` and `sips` for images. Playwright suite reused from the earlier session.

**Spec:** `docs/superpowers/specs/2026-11-15-logo-and-brand-colours-design.md`

## Global Constraints

- No build step, no web fonts, no libraries. Total page weight < 300 KB.
- Text contrast ≥ 4.5:1 (≥ 3:1 for large text and UI shapes) in light and dark themes.
- Brick red appears only inside logo images, never as a token.
- Every new piece of text or alt text needs `hi` and `en` variants (`data-alt-hi` / `data-alt-en` for images).
- Works at 360 px with no horizontal scroll.

## Review Focus

1. Dark mode header: the emblem's dark green leaves must not vanish on the dark header → leaves use `var(--brand)` (light green in dark mode). Test reads the computed fill in dark mode.
2. `data-theme="dark"` override (not just the media query) gets the same tokens → test sets the attribute and checks `--brand`.
3. Old phones without WebP get the PNG footer logo → `<picture>` with `<img src=…png>`; test asserts the `img` src is the PNG.
4. Footer logo sizing at 360 px causes no overflow and isn't blurry → test checks the rendered width ≤ 260 px and natural width ≥ 2× rendered.
5. Leftover old colours (`#1D6B3B`, `#D8A31C`, `#123A22`) anywhere in `index.html` or `img/*.svg` → test greps for them.

## Token values (contrast pre-checked, `scratchpad/contrast.js`)

| Token | Light | Dark (both dark blocks) |
|---|---|---|
| `--brand` | `#1D360B` (13.2:1 on white) | `#8DBA62` (7.6:1 on surface) |
| `--brand-h` | `#142708` | `#9CC772` |
| `--brand-50` | `#E9EFE0` | `#1F2D14` |
| `--on-brand` | `#FFFFFF` | `#0B1404` |
| `--accent` | `#C9A35B` | `#D9B670` |
| `--accent-h` | `#B8914A` | `#E3C384` |
| `--accent-ink` | `#7A5A1E` (6.3:1 on white) | `#D9B670` |
| `--accent-50` | `#F7EEDB` | `#2E2614` |
| `--on-accent` | `#1D1405` | `#1D1405` |
| `--hero` | `#1D360B` | `#14260A` |
| `--hero-2` | `#14260A` | `#0E1B07` |
| `--hero-ink` | `#F4F1E6` | (inherit) |
| `--hero-muted` | `#C5D0B5` | (inherit) |
| `--ok`, `--ok-50`, `--bad*`, `--off*`, `--wa*` | unchanged | unchanged |

`<meta name="theme-color">` becomes `#1D360B`.

---

### Task 1: Logo assets

**Files:**
- Modify: `img/logo.svg` (replace the placeholder "M" with the app icon; the URL stays the same, so JSON-LD and the favicon link keep working)
- Create: `img/icon-180.png` (copy of owner image 1, 180×180)
- Create: `img/logo-stacked.webp`, `img/logo-stacked.png` (owner image 6 resized to 520 px wide)

**Interfaces:**
- Produces: the paths above, used by Task 2.

- [ ] **Step 1:** Write `img/logo.svg`: `viewBox="0 0 512 512"`, `<rect rx="112" fill="#1D360B">`, then the three leaves from the owner's `malhan-emblem.svg` geometry, scaled into the box. Leaves `fill="#FFFFFF"`, stroke `#1D360B` width 10 (the stroke separates overlapping leaves), veins `#C9A35B`. Keep `role="img"` and `aria-label="Malhan Trading Company"`.
- [ ] **Step 2:** `cp images/1.png img/icon-180.png`. Then `sips -Z 520 images/6.png --out img/logo-stacked.png` and `cwebp -q 85 -alpha_q 90 img/logo-stacked.png -o img/logo-stacked.webp`.
- [ ] **Step 3: Verify.** Run `ls -l img/`. Expected: webp < 30 KB, png < 60 KB, logo.svg < 2 KB. Open `img/logo.svg` in Chromium and screenshot at 64 px and 16 px. The leaves must be distinct and the veins visible at 64 px.

### Task 2: Wire logos and recolour tokens in `index.html`

**Files:**
- Modify: `index.html` (lines 10, 12, 61–88 tokens, 128 `.brand img` rule, 346–351 header brand, 562–565 footer first column; JSON-LD needs no change)
- Test: `scratchpad/site-tests/test.js` (add a `brand` group)

**Interfaces:**
- Consumes: Task 1 files.

- [ ] **Step 1: Write failing tests** in `test.js`:
  - `brand: header emblem inline` → `.brand svg.emblem` exists, has 3 `path.leaf` and 3 `path.vein`, and no `.brand img`.
  - `brand: tokens light` → `getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() === '#1D360B'` and `--accent` is `#C9A35B`.
  - `brand: tokens dark` (colorScheme dark) → `--brand` is `#8DBA62`, and the first `.brand path.leaf` computed `fill` is `rgb(141, 186, 98)`. Then repeat with a light colorScheme plus `document.documentElement.dataset.theme='dark'`.
  - `brand: favicon + apple icon` → `link[rel=icon]` href is `img/logo.svg`, and `link[rel=apple-touch-icon]` href is `img/icon-180.png` with status 200.
  - `brand: footer lockup` → `footer picture source[type="image/webp"]` srcset is `img/logo-stacked.webp`. The `footer picture img` src ends `logo-stacked.png`, has a non-empty `alt` in both languages, and at 360 px its `getBoundingClientRect().width` is ≤ 260 while `naturalWidth` is ≥ 2× that width.
  - `brand: no old colours` → read `index.html` and `img/*.svg` from disk. None contains `1D6B3B`, `D8A31C`, `123A22` or `E3B43E` (case-insensitive).
  - `brand: theme-color` → meta content is `#1D360B`.
- [ ] **Step 2:** `cd scratchpad/site-tests && SITE=/Users/ankurmalhan/malhan-website node test.js`. Expected: the new `brand:` tests FAIL and the existing tests PASS.
- [ ] **Step 3: Implement.**
  - Replace the token values per the table. Change `theme-color`. Add `<link rel="apple-touch-icon" href="img/icon-180.png">`.
  - Header: replace `<img src="img/logo.svg">` with `<svg class="emblem" viewBox="380 160 240 200" width="44" height="38" aria-hidden="true">` containing the owner's three leaf groups. Leaf paths get `class="leaf"` and veins `class="vein"`. CSS: `.emblem .leaf{fill:var(--brand);stroke:var(--surface);stroke-width:10;stroke-linejoin:round}.emblem .vein{stroke:var(--accent);stroke-width:7;stroke-linecap:round}`. Change the `.brand img` rule to `.brand .emblem{flex:none}`. Check the header's background token and use it for the stroke if it isn't `--surface`.
  - Footer: at the top of the first column, before the name, add `<picture><source srcset="img/logo-stacked.webp" type="image/webp"><img src="img/logo-stacked.png" width="260" height="153" loading="lazy" decoding="async" alt="…" data-alt-hi="मल्हान ट्रेडिंग कम्पनी का लोगो" data-alt-en="Malhan Trading Company logo"></picture>`. Set `alt` to the Hindi text. Style it `footer picture img{width:min(260px,70vw);height:auto;display:block;margin-bottom:14px}`. Keep the typed name below the logo (it's searchable text).
  - Confirm the existing `setLang()` alt swap picks up `data-alt-*` on the new img (it queries `[data-alt-hi]`). Fix it if it only targets the hero.
- [ ] **Step 4:** Run the suite again. Expected: everything passes, including weight < 300 KB, no console errors and no horizontal scroll at 360 and 1280.
- [ ] **Step 5: Screenshots.** Take 360 and 1280, hi/en, light and dark: top of page, the products section and the footer. Check that the emblem is visible in dark mode, that gold buttons read well, that the Available tag is unchanged, and that the footer logo is crisp.
- [ ] **Step 6: Commit** (`img/`, `index.html`).

### Task 3: Docs and final check

**Files:**
- Modify: `CLAUDE.md` (Conventions → design tokens line; Architecture → weight numbers), `README.md` if it mentions colours or the logo.

- [ ] **Step 1: CLAUDE.md design tokens line.** Change it to: "Design tokens on `:root` with light and dark themes (`prefers-color-scheme`, plus `data-theme` override), taken from the company logo: deep green `--brand` `#1D360B`, gold `--accent` `#C9A35B` (use `--accent-ink` for gold text on light backgrounds); brick red only inside the logo images. The hero and footer are always deep green. Logo files: `img/logo.svg` (app icon/favicon), `img/icon-180.png`, `img/logo-stacked.{webp,png}` (footer); the header emblem is inline SVG coloured by tokens." Update the "currently ~150 KB" weight figure to the measured value.
- [ ] **Step 2:** Run the syntax check (`node syntax.js`) and the full suite one last time, including the real-`config.js` test. Expected: everything passes.
- [ ] **Step 3: Commit.** Push to `main` only after the user OKs it (the push goes live on GitHub Pages).
