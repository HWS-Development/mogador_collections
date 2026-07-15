# HeaderMenu Specification

## Overview
- Target file: `src/components/Header.jsx`
- Interaction model: click-driven overlay, hover-driven image preview, scroll-driven compact state.

## DOM Structure
- `header.gm-owned-header`
- logo link
- `nav.gm-owned-menu`
- `gm-owned-menu__visual` preview image
- `gm-owned-menu__links` numbered route links
- `gm-owned-menu__footer` direct booking CTA
- language switcher, reserve link, menu toggle

## Behaviors
- Body class `gm-header-compact` after ~42px scroll changes background, border and logo tone.
- Menu button toggles `gm-owned-header--open` and `site-nav--open`.
- Hovering a nav route updates preview image state in React.

## Responsive
- Desktop overlay uses two columns: preview + links.
- Mobile overlay stacks preview above large route links.
