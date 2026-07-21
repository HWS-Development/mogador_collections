# DESIGN.md: Mogador Editorial Image System

## Source
- Capture date: 2026-07-21
- Target stack: React and CSS
- Evidence: Firecrawl branding, images, markdown, and full-page screenshots
- Primary image reference: [Dar Touyir](https://dar-touyir.polished-bar-70d1.workers.dev/fr/)
- Supporting references: [The Hotel Brussels](https://www.thehotel-brussels.be/fr/), [Ksar Ighnda](https://www.ksarighnda.com/), [KV Hotels](https://www.kvhotels.com/), [My Mont Saint-Michel](https://www.mymontsaintmichel.com/), [The Social Club](https://www.the-social-club.com/), [Hotel Don Cesar](https://www.hoteldoncesar.com/), [Ker Moor](https://www.ker-moor.com/)

## Reference Screenshots
![Dar Touyir](./.firecrawl/dar-touyir-full-screenshot.png)
![The Hotel Brussels](./.firecrawl/thehotel-screenshot.png)
![Ksar Ighnda](./.firecrawl/ksarighnda-screenshot.png)
![KV Hotels](./.firecrawl/kvhotels-screenshot.png)
![My Mont Saint-Michel](./.firecrawl/mymont-screenshot.png)
![The Social Club](./.firecrawl/socialclub-screenshot.png)
![Hotel Don Cesar](./.firecrawl/doncesar-screenshot.png)
![Ker Moor](./.firecrawl/kermoor-screenshot.png)

Use these captures for hierarchy and density only. Mogador keeps its own identity, content, photography, logos, and colors.

## Design Summary
The site uses a contemporary Moroccan gallery rather than a dark cinematic interface. A single architectural panorama opens each page, the photograph carries the emotion, and content follows in calm editorial chapters. Dar Touyir supplies the primary image grammar: bright architecture, full-height frames, quiet directional veils, irregular 7/5 mosaics, portrait photography, and barely perceptible zoom. Mogador retains its own identity, typography, red accent, content, and local photography.

The memorable device is the **living Mogador frame**: a photograph that opens from a calm crop into full color and scale, anchored by the thin red Mogador horizon. It replaces heavy filters, generic cards, aggressive hover lifts, duplicate media, and simulated depth.

## Dar Touyir Image Direction
- Observed hero: full-height `object-fit: cover` image with a left-to-right warm veil and a lighter right side.
- Observed gallery: 12-column layout alternating `7/5`, `5/7`, and `4/4/4` spans.
- Observed editorial images: portrait ratio near `0.73`, landscape frames up to `34vw`, and feature frames up to `58vw` high.
- Observed motion: `scale(1.025)` for editorial pairs, `1.035` for galleries, and `1.04` only for compact feature cards.
- Observed timing: `650-800ms`, transform only, with no clip-path, card lift, glow, or decorative blur.
- Mogador adaptation: preserve local assets and cooler brand color balance; use the reference for crop, scale, rhythm, overlay restraint, and image hierarchy only.

## Design Tokens

### Colors
- Canvas: `#F3F1EC`
- Paper: `#FFFEFB`
- Ink: `#202238`
- Text: `#33343B`
- Muted: `#6D6B67`
- Mogador red: `#991A1D`
- Mineral beige: `#B69A82`
- Hairline: `rgba(32, 34, 56, 0.14)`

Red is reserved for booking actions, active navigation, and the horizon line. Large surfaces remain paper, canvas, or photographic.

### Typography
- Display: existing Mogador `Cedra 4F Wide` stack
- Body: existing Mogador `Avenir` stack
- Utility labels: existing `Century Gothic Bold` stack
- Hero title: `clamp(3rem, 5.5vw, 6.4rem)`, 0.94 line height
- Section title: `clamp(2.25rem, 4vw, 4.75rem)`, 1.0 line height
- Body: `clamp(1rem, 1vw, 1.1rem)`, 1.7 line height, maximum 62 characters

### Spacing And Layout
- Content width: `1480px`
- Page gutter: `clamp(1rem, 4vw, 4.75rem)`
- Section rhythm: `clamp(5rem, 9vw, 9rem)`
- Grid gap: `clamp(1.5rem, 4vw, 5rem)`
- Radius: `0`; photographs and actions use square geometry
- Shadow: only for raised booking surfaces, never on editorial cards

## Components
- Header: white, quiet, fixed; primary routes remain visible and booking remains the only filled action.
- Page hero: one local still image, framed on desktop and edge-to-edge on mobile; left-aligned copy over a restrained lower gradient.
- Buttons: square, compact, uppercase utility type; red primary and transparent secondary.
- Editorial split: image and copy alternate with no decorative card shell.
- Collection cards: image-led with information below or in a simple paper panel; no 3D tilt.
- Booking: plain labeled fields, direct proof, and one submit action.
- Gallery: one dominant architectural image with an external caption rail; supporting images form an irregular 7/5 editorial rhythm where the page structure allows it.
- Image cards: square geometry, no card lift, restrained `1.025-1.035` image zoom on hover-capable devices only.
- Captions: a narrow mineral or ink rail attached to the image edge, never a floating glass chip.
- Values manifesto: one hospitality portrait, one featured commitment, then a readable 2x2 sequence; never five equal narrow columns.
- Closing conversion: a full-width local photograph with a directional veil, concise copy, and direct booking as the decisive action.
- Forms: labels above fields, visible focus, no floating labels.

## Page Patterns
1. Framed photographic hero with one primary and at most one secondary action.
2. Short orientation section explaining the page's purpose.
3. Page-specific image-led content with alternating rhythm.
4. Proof, services, or practical details in ruled lists rather than generic cards.
5. One decisive direct-booking or contact close.

## Content Style
- Write specific hospitality language and factual Mogador information.
- Prefer short active labels: `Voir les hôtels`, `Réserver en direct`, `Demander un devis`.
- Avoid invented rates, artificial scarcity, vague luxury claims, and decorative numbering.

## Motion
- One load sequence for the hero: image reveal, then copy.
- Simple opacity and vertical reveals for chapters.
- Gentle image parallax only on desktop.
- Image hover uses `650-800ms` and never exceeds `scale(1.035)` on large editorial surfaces.
- No pointer tilt, whole-card lift, portal rotation, blur-heavy transitions, or continuous decorative motion.
- Respect `prefers-reduced-motion` and coarse pointers.

## Agent Build Instructions
- Preserve the homepage markup while consolidating its image presentation in `group-home.css`.
- Scope all new rules to `body.gm-interior-route` or `.gm-page`.
- Use only local Mogador assets from `public/assets`.
- Keep `ResponsiveImage` as a direct `img`; do not wrap it in a new element.
- Use existing 980/760px Home and 1180/900/640px interior breakpoints.
- Keep one active interior stylesheet and remove competing interior layers.
- Test at 320px, 390px, 768px, 1024px, and 1440px.
- Prevent horizontal overflow and keep every tap target at least 44px.

## Rerun Inputs
```yaml
workflow: firecrawl-website-design-clone
source_urls:
  - https://dar-touyir.polished-bar-70d1.workers.dev/fr/
  - https://www.thehotel-brussels.be/fr/
  - https://www.ksarighnda.com/
  - https://www.kvhotels.com/
  - https://www.mymontsaintmichel.com/
  - https://www.the-social-club.com/
  - https://www.hoteldoncesar.com/
  - https://www.ker-moor.com/
target_stack: React and CSS
output: DESIGN.md
```
