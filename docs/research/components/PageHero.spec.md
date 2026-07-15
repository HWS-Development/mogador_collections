# PageHero Specification

## Overview
- Target file: `src/components/PageHero.jsx`
- Interaction model: load-driven, scroll-driven, pointer-reactive.

## DOM Structure
- `section.gm-page-hero.gm-owned-hero`
- `figure.gm-page-hero__media > img`
- `div.gm-owned-hero__portal > span * 3`
- `aside.gm-owned-hero__rail > span * 3`
- `div.gm-page-hero__content`
- `div.gm-owned-hero__signature`
- `a.gm-owned-hero__scroll`
- optional `div.gm-page-hero__booking > BookingBar`

## Behaviors
- Hero image scales in on route load via GSAP.
- Portal rings orbit continuously unless reduced motion is enabled.
- Pointer updates radial light position.
- Scroll cue animates vertical line.
- Booking panel appears when `booking=true`.

## Responsive
- Desktop: rail and signature visible.
- Tablet/mobile: rail and signature hidden; title remains oversized but constrained.
