# SignatureExperience Specification

## Overview
- Target file: `src/components/SignatureExperience.jsx`
- Interaction model: scroll reveal + hover-driven object reveal and 3D card motion.

## DOM Structure
- `section.gm-signature-experience`
- `figure.gm-signature-experience__media > img + figcaption`
- `div.gm-signature-experience__body`
- eyebrow, h2, paragraph
- `div.gm-signature-experience__cards > article * 3`
- CTA actions

## Behaviors
- Media and cards reveal on scroll via GSAP.
- Media image zooms and border appears on hover.
- Cards tilt/move magnetically on pointer hover.
- CTA underline reveals on hover.

## Responsive
- Desktop: two-column split.
- Mobile/tablet: one-column stack; cards stack vertically.
