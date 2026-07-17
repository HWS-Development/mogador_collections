# Homepage Media Swap

The homepage is deployment-ready. Its media slots are centralized in `src/data/homeMedia.js` and use local files only.

For the final delivery, replace the file contents while keeping the same paths and aspect ratios. No component or CSS change is required.

## Priority Replacements

| Slot | Current file | Recommended final ratio |
| --- | --- | --- |
| Hero film | `public/assets/video/mogador-brand-film-demo.mp4` | 16:9, 1600x900 or 1920x1080 |
| Hero poster | `public/assets/editorial/hero-film-poster.jpg` | 16:9 |
| Hospitality gesture | `public/assets/showcase/hero-service-wide.webp` | 16:9 |
| Service portrait | `public/assets/showcase/service-detail-portrait.webp` | 3:4 |
| Heritage detail | `public/assets/editorial/morocco-courtyard.jpg` | 3:2 |
| Moroccan landscape | `public/assets/editorial/marrakech-light.jpg` | 3:2 |
| Marrakech destination | `public/assets/editorial/riad-interior.jpg` | 3:2 |
| Wellness experience | `public/assets/editorial/wellness-ritual.jpg` | 3:2 |
| Dining experience | `public/assets/editorial/table-experience.jpg` | 3:2 |

The temporary still photography is sourced from Unsplash. The temporary hero film is sourced from Pexels and compressed locally for production delivery.
