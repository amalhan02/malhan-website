# Logo and brand colours (short design)

## Intent
The owner has a finished company logo (three-leaf emblem, Hindi + English lockups, app icon). The website should carry it and its colours, so the site looks like the brand instead of the placeholder "M" in bright green and NFL yellow.

## Goals
- Replace the placeholder logo everywhere it appears: header, browser tab / home-screen icon, JSON-LD `logo`.
- Retheme the site to the logo palette: deep green `#1D360B`, gold `#C9A35B`, light gold `#E8D29B`.
- Show the full stacked lockup (light-lettering version) in the footer.

## Non-goals
- Brick red as a UI colour. It appears only inside the logo image (owner picked option A).
- Changing the app's colours (possible follow-up).
- Changing layout, copy or behaviour.

## Anti-goals
- Gold text on white that fails contrast.
- Breaking the 300 KB budget, adding web fonts, or making the header unreadable at 360 px.

## Constraints
No build step, no web fonts, everything inline in `index.html`, owner edits in GitHub's web UI. Light and dark themes (`prefers-color-scheme` + `data-theme`). WCAG AA for text (4.5:1, 3:1 for large text and UI).

## Approaches
1. **Emblem SVG + typed bilingual name in the header, stacked lockup image in the footer.** Picked. Tiny, sharp, keeps the language toggle working.
2. Full horizontal lockup image in the header. Rejected: at ~38 px tall on a 360 px phone the English line is ~6 px and unreadable. It also wouldn't switch language and needs light and dark versions.

## Decided
- Header: owner's emblem SVG next to the existing typed name.
- Footer: stacked lockup with light lettering (owner's image 6, 1677×987 PNG) on deep green, as an optimised WebP with a PNG fallback.
- Favicon / apple-touch-icon / JSON-LD logo: owner's app icon (green rounded square, white leaves, gold veins).
- Hero: unchanged layout, new colours.

## Left to the builder (my calls)
- Exact token values: light theme `--brand:#1D360B`, `--hero:#1D360B`, `--accent:#C9A35B`, a darker gold `--accent-ink` that passes AA on white. Dark theme uses a lighter green for `--brand` so it reads on dark surfaces. `--ok` and `--wa` stay as they are, and `--bad` stays red. Check every pairing for contrast.
- `theme-color` meta set to the new hero green.
- Rebuild the app icon as a small SVG (from the emblem geometry) rather than shipping the PNG. Keep a 180 px PNG for apple-touch-icon.
- Footer lockup sized about 200–260 px wide, under ~30 KB.
- Update the colour wording in CLAUDE.md ("earthy green / NFL yellow" becomes the logo palette, no longer matching the app).
