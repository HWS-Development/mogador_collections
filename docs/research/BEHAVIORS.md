# Behavior Bible

## Global Behaviors
- Header starts transparent over hero, becomes compact after ~42px scroll via `body.gm-header-compact`.
- Menu button opens fullscreen editorial overlay with route image previews on hover.
- Page transitions use `body.gm-route-transition` with portal blur, particles, and spatial wipe.
- Pointer movement updates `--lux-x` and `--lux-y` for spotlight and portal effects.
- Magnetic hover updates `--magnet-x`, `--magnet-y`, `--tilt-x`, `--tilt-y`, `--spot-x`, and `--spot-y`.
- `prefers-reduced-motion: reduce` disables animation-heavy transforms.

## Scroll Behaviors
- Heroes use image scale-in on page load and parallax on interior pages.
- Sections/cards reveal on scroll with GSAP blur, translation, rotation, and clip-path where supported.
- Images use object reveal: scale/saturation/contrast transition when entering viewport.
- Conversion dock appears after the visitor scrolls past the hero threshold.

## Hover Behaviors
- Cards use 3D tilt, image zoom, spotlight overlays, and CTA underline reveal.
- Gallery active image receives depth hover and shadow.
- Destination/menu/filter controls receive magnetic and spotlight hover.
- Signature split media zooms with border reveal.
- Mega-menu and destination cards should preview context images or motifs on hover, following KV Hotels/My Mont/Social Club patterns.

## Time Behaviors
- Shared galleries autoplay every 3000ms.
- Hotel carousel advances every 3000ms.
- Booking bar uses pending scan and ready pulse.

## Responsive Behaviors
- Desktop: fullscreen hero, side rails, two-column editorial splits, large typography.
- Tablet: menus and split sections collapse to one column.
- Mobile: fullscreen menu becomes stacked, side rails hidden/collapsed, booking remains direct via dock/CTA.

## Conversion Behaviors
- Booking entry points remain visible after the hero through the dock/rail and mobile bar.
- Intent-led CTAs should route visitors to direct booking, offers, hotels, MICE quote, or phone without generic labels.
- Official-site proof can use price comparison language, best-rate labels, and short reassurance copy, but must not invent live rates.
