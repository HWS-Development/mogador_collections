import { useEffect, useState } from 'react'
import ResponsiveImage from './ResponsiveImage'

export default function GallerySlider({ items, label = 'Galerie', className = '', t, lang = 'fr' }) {
  const slides = items.filter(Boolean).map((item) => (Array.isArray(item) ? { image: item[0], title: item[1], text: item[2] } : item))
  const [active, setActive] = useState(0)
  const [manualPaused, setManualPaused] = useState(false)
  const [interactionPaused, setInteractionPaused] = useState(false)
  const [hiddenPaused, setHiddenPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const count = slides.length
  const paused = manualPaused || interactionPaused || hiddenPaused
  const copy = t?.common || {}
  const isRtl = lang === 'ar'

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
    const onVisibilityChange = () => setHiddenPaused(document.hidden)
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
      setAnnouncement(`${copy.image || 'Image'} ${nextIndex + 1} ${copy.of || 'sur'} ${count}${slides[nextIndex].title ? `: ${slides[nextIndex].title}` : ''}`)
      return nextIndex
    })
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(isRtl ? 1 : -1)
    if (event.key === 'ArrowRight') go(isRtl ? -1 : 1)
  }

  return (
    <div
      className={`gm-fs-gallery ${className}`}
      role="region"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false)
      }}
    >
      <button className="gm-fs-gallery__arrow gm-fs-gallery__arrow--prev" type="button" onClick={() => go(-1)} aria-label={copy.previousImage || 'Image précédente'}>‹</button>
      <div className="gm-fs-gallery__stage">
        {count > 1 ? <SlidePreview slide={previous} side="previous" /> : null}
        <figure className="gm-fs-gallery__slide gm-fs-gallery__slide--active" key={`${current.image}-${active}`}>
          <ResponsiveImage src={current.image} sizes="(max-width: 760px) 100vw, 72vw" alt={current.title || label} loading="lazy" />
          {(current.title || current.text) ? (
            <figcaption>
              {current.title ? <strong>{current.title}</strong> : null}
              {current.text ? <span>{current.text}</span> : null}
            </figcaption>
          ) : null}
        </figure>
        {count > 1 ? <SlidePreview slide={next} side="next" /> : null}
      </div>
      <button className="gm-fs-gallery__arrow gm-fs-gallery__arrow--next" type="button" onClick={() => go(1)} aria-label={copy.nextImage || 'Image suivante'}>›</button>
      <div className="gm-fs-gallery__counter" aria-live="polite">
        {announcement || `${label}, ${count} ${copy.images || (count > 1 ? 'images' : 'image')}`}
      </div>
      {count > 1 ? (
        <button className="gm-fs-gallery__pause" type="button" aria-pressed={manualPaused} onClick={() => setManualPaused((value) => !value)}>
          {manualPaused ? (copy.resume || 'Reprendre') : (copy.pause || 'Pause')}
        </button>
      ) : null}
    </div>
  )
}

function SlidePreview({ slide, side }) {
  return (
    <figure className={`gm-fs-gallery__slide gm-fs-gallery__slide--${side}`} aria-hidden="true">
      <ResponsiveImage src={slide.image} sizes="(max-width: 760px) 20vw, 14vw" alt="" loading="lazy" />
    </figure>
  )
}
