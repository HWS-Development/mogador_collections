import { useEffect, useState } from 'react'

export default function GallerySlider({ items, label = 'Galerie', className = '' }) {
  const slides = items.filter(Boolean).map((item) => (Array.isArray(item) ? { image: item[0], title: item[1], text: item[2] } : item))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const count = slides.length

  useEffect(() => {
    setActive(0)
  }, [count])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (count < 2 || paused || reduceMotion || document.hidden) return undefined
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % count)
    }, 5500)

    return () => window.clearInterval(timer)
  }, [count, paused])

  useEffect(() => {
    const onVisibilityChange = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  if (!count) return null

  const current = slides[active]
  const previous = slides[(active - 1 + count) % count]
  const next = slides[(active + 1) % count]
  const go = (direction) => {
    setActive((value) => {
      const nextIndex = (value + direction + count) % count
      setAnnouncement(`Image ${nextIndex + 1} sur ${count}${slides[nextIndex].title ? `: ${slides[nextIndex].title}` : ''}`)
      return nextIndex
    })
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(-1)
    if (event.key === 'ArrowRight') go(1)
  }

  return (
    <div
      className={`gm-fs-gallery ${className}`}
      role="region"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
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
        {announcement || `${label}, ${count} image${count > 1 ? 's' : ''}`}
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
