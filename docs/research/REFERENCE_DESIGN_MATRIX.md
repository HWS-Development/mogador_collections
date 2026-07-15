# Mogador Owned Reference Design Matrix

## Mission
Use the owned reference sites as design and effects sources only. All public copy, hotels, offers, destinations, phone numbers, and reservation language must remain Mogador content.

## Reference Patterns To Rebuild

| Pattern | Reference Sources | Mogador Implementation |
| --- | --- | --- |
| Full-screen cinematic hero | The Hotel Brussels, Don Cesar, Ker Moor, My Mont | `PageHero` and home hero use immersive media, large display titles, dark overlays, booking proof, scroll cue, and portal rings. |
| Editorial fullscreen menu with image preview | The Hotel Brussels, KV Hotels, Ker Moor | `Header` uses an overlay menu with hovered route preview images, numbered navigation, and direct booking CTA. |
| Embedded booking/search conversion | My Mont, Don Cesar, Ker Moor | `BookingBar` remains central and gets animated `idle/pending/ready` states. Add global/mobile booking access. |
| Alternating editorial split sections | Ksar Ighnda, KV Hotels, The Hotel Brussels | `SignatureExperience` creates a reusable image/text split with numbered cards and emotional Mogador narrative. |
| Destination card constellation | The Social Club, Ker Moor, My Mont | Home `gm-radical-constellation` turns Mogador destinations into cinematic cards with 3D hover. |
| Numbered chapter storytelling | Don Cesar, Ksar Ighnda | Home chapters and hotel pages use numbered sequences and large typography to guide intent. |
| Image reveal and object hover | Ksar Ighnda, Social Club, Ker Moor | Global GSAP selectors animate image reveal, hover zoom, magnetic spotlight, and 3D card tilt. |
| Dark/light luxury rhythm | The Hotel Brussels, Don Cesar, Social Club | Global CSS alternates ivory, deep red, dark blue, and warm sand sections. |
| Footer newsletter/conversion | Social Club, Don Cesar, My Mont | `Footer` includes Mogador emotional prefooter newsletter/conversion block. |
| Side utility rail | Ker Moor, Don Cesar | Add a fixed rail for offers, gallery, direct booking, call/contact on desktop. |
| Mobile booking bar | My Mont, Ker Moor | Keep conversion accessible on mobile without hiding content. |
| Multi-vertical booking intent | My Mont, Social Club | Booking entry points should separate hotel stay, restaurant/experience, MICE quote, and gift/offer intent while keeping Mogador labels/content. |
| Illustrated mega-navigation | KV Hotels, My Mont | Menus can group the collection by stay, taste, wellness, business, and destination with image/illustration previews rather than flat links only. |
| Local-map destination storytelling | KV Hotels, Ker Moor | Destination pages should feel anchored in place with mapped geography, nearby experiences, and progressive cards. |
| Heritage motif overlays | Ksar Ighnda, Don Cesar, Ker Moor | Decorative marks, stamps, and architectural motifs can frame Mogador images as overlays, never replacing the Mogador brand mark. |
| Numbered long-scroll homepage | Don Cesar | High-value pages can be structured as numbered chapters with large images, short emotional copy, and one decisive CTA per chapter. |

## Reference Notes From 2026-07-15 Fetch
- Ksar Ighnda: mandala motif, heritage story, room tabs, service cards, surrounding-activity editorial block.
- KV Hotels: grouped mega-menu, property/restaurant/spa ecosystem, place map, alternating image/text lifestyle modules.
- My Mont Saint-Michel: strong booking widget, official-vs-OTA price proof, intent selector for lodging/restaurant/events, category cards.
- The Social Club: expressive stamps/hachures, destination collage, manifesto tone, reservation popup by establishment type.
- Don Cesar: hero video timer feel, numbered chapters from 01-06, service icon list, long-scroll resort narrative.
- Ker Moor: compact utility icons, sea-view booking, local destination map/cards, rooftop/services proof, partner trust badges.

## Pages Covered
- `/`
- `/a-propos`
- `/hotels`
- `/hotels/:slug`
- `/destinations`
- `/experiences`
- `/offres`
- `/reunions-evenements`
- `/programme-fidelite`
- `/magazine`
- `/contact`

## Non-Negotiables
- Do not expose internal directives or research copy publicly.
- Keep Mogador phone: `+212 530 530 520`.
- No `CHECK RATES` copy.
- Hotel listing remains one horizontal carousel.
- Use Mogador content only.
