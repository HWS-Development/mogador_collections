import { useEffect, useRef, useState } from 'react'
import BookingBar from './BookingBar'
import { brand } from '../data/siteData'
import { images } from '../data/images'
import Link from '../router/Link'

export default function BookingTakeover({ t, lang }) {
  const [open, setOpen] = useState(false)
  const [context, setContext] = useState({})
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const copy = t.booking.takeover
  const title = context.hotel
    ? copy.hotelTitle.replace('{hotel}', context.hotel)
    : context.offer ? copy.offerTitle : copy.defaultTitle
  const description = context.offer
    ? copy.offerText.replace('{offer}', context.offer)
    : context.hotel ? copy.hotelText : copy.defaultText

  const close = () => {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useEffect(() => {
    const openFromReservationLink = (event) => {
      const link = event.target.closest?.('a[href="/#reservation"], a[href="#reservation"]')
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      triggerRef.current = link
      setContext({
        hotel: link.dataset.hotel || '',
        destination: link.dataset.destination || 'Marrakech',
        offer: link.dataset.offer || '',
      })
      setOpen(true)
    }

    document.addEventListener('click', openFromReservationLink, true)
    return () => document.removeEventListener('click', openFromReservationLink, true)
  }, [])

  useEffect(() => {
    const syncWithLocation = () => {
      if (window.location.hash !== '#reservation') {
        setOpen(false)
        return
      }
      setContext({ hotel: '', destination: 'Marrakech', offer: '' })
      setOpen(true)
    }

    syncWithLocation()
    window.addEventListener('popstate', syncWithLocation)
    window.addEventListener('hashchange', syncWithLocation)
    return () => {
      window.removeEventListener('popstate', syncWithLocation)
      window.removeEventListener('hashchange', syncWithLocation)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('gm-booking-takeover-open', open)
    if (!open) return undefined
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(panelRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])') || [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('gm-booking-takeover-open')
    }
  }, [open])

  return (
    <div className={`gm-booking-takeover ${open ? 'gm-booking-takeover--open' : ''}`} aria-hidden={!open} inert={open ? undefined : true}>
      <div className="gm-booking-takeover__backdrop" onClick={close} />
      <section ref={panelRef} className="gm-booking-takeover__panel" role="dialog" aria-modal="true" aria-label={copy.label}>
        <button ref={closeRef} className="gm-booking-takeover__close" type="button" onClick={close} aria-label={copy.close}>{copy.close}</button>
        <figure className="gm-booking-takeover__media" aria-hidden="true">
          <img src={images.official.homeHero} alt="" />
          <span>{copy.media}</span>
        </figure>
        <div className="gm-booking-takeover__body">
          <div className="gm-booking-takeover__intro">
            <span className="gm-radical-eyebrow">{copy.eyebrow}</span>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="gm-booking-takeover__proof" aria-label={t.common.directBooking}>
            <strong>{copy.directContact}</strong>
            <strong>{copy.officialEngine}</strong>
            <a href={`tel:${brand.phone.replaceAll(' ', '')}`}>{brand.phone}</a>
          </div>
          <BookingBar
            key={`${context.hotel}-${context.offer}-${context.destination}`}
            t={t}
            variant="takeover"
            source="booking_takeover"
            initialDestination={context.destination}
            hotel={context.hotel}
            offer={context.offer}
            lang={lang}
          />
          <div className="gm-booking-takeover__alternatives">
            <span>{copy.undecided}</span>
            <p>{copy.alternatives}</p>
          </div>
          <div className="gm-booking-takeover__intents">
            {copy.intents.map(([title, text, to]) => (
              <Link to={to} key={title} onClick={() => setOpen(false)}>
                <strong>{title}</strong>
                <small>{text}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
