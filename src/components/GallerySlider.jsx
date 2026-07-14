import { useEffect, useState } from 'react'

export default function GallerySlider({ items, label = 'Galerie', className = '' }) {
  const slides = items.filter(Boolean).map((item) => (Array.isArray(item) ? { image: item[0], title: item[1], text: item[2] } : item))
  const [active, setActive] = useState(0)
  const count = slides.length

  useEffect(() => {
    setActive(0)
  }, [count])

  useEffect(() => {
    if (count < 2) return undefined
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % count)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [count])

  if (!count) return null

  const current = slides[active]
  const previous = slides[(active - 1 + count) % count]
  const next = slides[(active + 1) % count]
  const go = (direction) => setActive((value) => (value + direction + count) % count)

  return (
    <div className={`gm-fs-gallery ${className}`} role="region" aria-label={label}>
      <button className="gm-fs-gallery__arrow gm-fs-gallery__arrow--prev" type="button" onClick={() => go(-1)} aria-label="Image précédente">‹</button>
      <div className="gm-fs-gallery__stage">
        {count > 1 ? <SlidePreview slide={previous} side="previous" /> : null}
        <figure className="gm-fs-gallery__slide gm-fs-gallery__slide--active" key={`${current.image}-${active}`}>
          <img src={current.image} alt={current.title || label} loading="lazy" />
          {(current.title || current.text) ? (
            <figcaption>
              {current.title ? <strong>{current.title}</strong> : null}
              {current.text ? <span>{current.text}</span> : null}
            </figcaption>
          ) : null}
        </figure>
        {count > 1 ? <SlidePreview slide={next} side="next" /> : null}
      </div>
      <button className="gm-fs-gallery__arrow gm-fs-gallery__arrow--next" type="button" onClick={() => go(1)} aria-label="Image suivante">›</button>
      <div className="gm-fs-gallery__counter" aria-live="polite">
        {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </div>
    </div>
  )
}

function SlidePreview({ slide, side }) {
  return (
    <figure className={`gm-fs-gallery__slide gm-fs-gallery__slide--${side}`} aria-hidden="true">
      <img src={slide.image} alt="" loading="lazy" />
    </figure>
  )
}
