# DESIGN.md: Mogador Interior Pages

## Source
- Capture date: 2026-07-17
- Target stack: React and CSS
- Evidence: Firecrawl branding, images, markdown, and full-page screenshots
- References: [The Hotel Brussels](https://www.thehotel-brussels.be/fr/), [Ksar Ighnda](https://www.ksarighnda.com/), [KV Hotels](https://www.kvhotels.com/), [My Mont Saint-Michel](https://www.mymontsaintmichel.com/), [The Social Club](https://www.the-social-club.com/), [Hotel Don Cesar](https://www.hoteldoncesar.com/), [Ker Moor](https://www.ker-moor.com/)

## Reference Screenshots
![The Hotel Brussels](./.firecrawl/thehotel-screenshot.png)
![Ksar Ighnda](./.firecrawl/ksarighnda-screenshot.png)
![KV Hotels](./.firecrawl/kvhotels-screenshot.png)
![My Mont Saint-Michel](./.firecrawl/mymont-screenshot.png)
![The Social Club](./.firecrawl/socialclub-screenshot.png)
![Hotel Don Cesar](./.firecrawl/doncesar-screenshot.png)
![Ker Moor](./.firecrawl/kermoor-screenshot.png)

Use these captures for hierarchy and density only. Mogador keeps its own identity, content, photography, logos, and colors.

## Design Summary
The interior routes use a contemporary Moroccan gallery rather than a dark cinematic interface. A single framed panorama opens each page, the photograph carries the emotion, and the content follows in calm editorial chapters. The layout borrows Ksar Ighnda's generous image framing, The Hotel Brussels' direct hierarchy, KV Hotels' ecosystem navigation, and My Mont's visible booking intent without reproducing their brands.

The memorable device is the **Mogador horizon**: a thin red line that anchors labels and selected states. It replaces arches, portals, decorative grids, duplicate media, and simulated depth.

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
- Gallery: one dominant landscape image with neighboring previews and simple controls.
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
- No pointer tilt, portal rotation, blur-heavy transitions, or continuous decorative motion.
- Respect `prefers-reduced-motion` and coarse pointers.

## Agent Build Instructions
- Preserve the homepage markup and `group-home.css` presentation.
- Scope all new rules to `body.gm-interior-route` or `.gm-page`.
- Use only local Mogador assets from `public/assets`.
- Keep one active interior stylesheet and remove competing interior layers.
- Test at 320px, 390px, 768px, 1024px, and 1440px.
- Prevent horizontal overflow and keep every tap target at least 44px.

## Rerun Inputs
```yaml
workflow: firecrawl-website-design-clone
source_urls:
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
