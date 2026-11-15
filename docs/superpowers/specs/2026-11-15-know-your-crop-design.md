# "Know your crop" explainers (short design)

## Intent
The owner wants the site to teach, not just list: show farmers how fertilizers, seeds and the wheat crop work together, with modern animated figures in the style of Zapier / HubSpot, so each product is tied to a real use and people want to visit. Owner opted out of further questions ("yes" = dive in).

## Goals
1. **"What your wheat needs"**: an animated wheat plant (inline SVG). Tabs N · P · K · S+Zn; the matching plant part highlights, with what the nutrient does, signs of shortage, and the shop's products for it. Auto-cycles gently until the visitor interacts.
2. **Season timeline**: sowing (Oct–Nov) → first watering (~3 weeks) → tillering → flowering → grain filling → harvest (Apr), each with what to apply and which product. Line draws itself when scrolled into view.
3. **Nutrient badges on product cards**: tiny N/P/K meter + "% N" text + one-line "when to use" for known fertilizers; sowing window + trait for known wheat varieties. Unknown products show no badge.
Plus subtle scroll-reveal on section content.

## Non-goals / anti-goals
- No GIFs, videos, libraries or web fonts; page stays < 300 KB.
- Not an agronomy textbook: three pieces only, short sentences, Hindi first.
- No exact per-field prescriptions presented as advice; everything "typical practice, follow your soil test / ask at the shop".
- Cotton, mustard, paddy: later, if the owner asks.

## Constraints
Single `index.html`, inline CSS/JS/SVG; every string bilingual (markup spans or `T` dictionary); `esc()` for anything from data; works at 360 px; honours `prefers-reduced-motion` (no auto-cycle, no draw animation); keyboard operable tabs (`role=tablist`, arrow keys).

## Facts to use (verified 15 Nov 2026)
- Wheat, Haryana (HAU trials): ~150 N : 60 P2O5 : 30 K2O kg/ha ≈ 60:24:12 per acre. Practice: 1 bag DAP (50 kg) + ~20 kg MOP at sowing; urea ~2 bags/acre split half at sowing, half at first watering (CRI, 20–25 days).
- Nutrient contents: Urea 46-0-0; DAP 18-46-0; MOP 0-0-60; TSP 0-46-0; SSP 0-16-0 + 11% S; Zincated SSP (ZSSP) 0-16-0 + 11% S + 0.5% Zn; Ammonium sulphate 20.6-0-0 + 24% S; bentonite Sulphur 90% S. Parnam: unknown, no badge.
- Varieties (ICAR-IIWBR / PAU): DBW-187 Karan Vandana, timely/early, 5–25 Nov, rust resistant; DBW-222 Karan Narendra, timely, 5–25 Nov, stands up well (lodging tolerant); DBW-303 Karan Vaishnavi, early, 25 Oct–5 Nov, very high yield; DBW-327 Karan Shivani, early, late Oct–early Nov, very high yield; PBW-872 (PAU), early, high yield, brown-rust resistant.
- Haryana: ~54% of soil samples low in zinc (ICAR, 21,598 samples); sulphur deficiency present in parts of Sirsa.

## Approaches
1. Inline SVG + CSS animation + ~60 lines JS (tabs, scroll-reveal, badge lookup). **Picked**: tiny, sharp, interactive.
2. Lottie/GIF animations. Rejected: 0.5–2 MB each, blurry, breaks budget.
3. Static illustrations only. Rejected: not "innovative", no connection to products.

## Left to the builder
Exact SVG drawing, copy, placement (new section `#know` between What we sell and Our products; nav gets "Know your crop"), badge styling, tests.
