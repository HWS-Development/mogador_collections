import { useEffect, useMemo, useState } from 'react'
import { destinations } from '../data/siteData'
import Link from '../router/Link'

export default function BookingBar({ t }) {
  const [bookingState, setBookingState] = useState('idle')
  const { today, tomorrow } = useMemo(() => {
    const now = new Date()
    const next = new Date(now)
    next.setDate(now.getDate() + 1)
    return {
      today: now.toISOString().slice(0, 10),
      tomorrow: next.toISOString().slice(0, 10),
    }
  }, [])

  useEffect(() => {
    if (bookingState !== 'pending') return undefined
    const timer = window.setTimeout(() => setBookingState('ready'), 720)
    return () => window.clearTimeout(timer)
  }, [bookingState])

  const handleSubmit = (event) => {
    event.preventDefault()
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'booking_search', source: 'mogador_direct_engine' })
    setBookingState('pending')
  }

  const statusText = bookingState === 'pending' ? t.booking.pending : bookingState === 'ready' ? t.booking.ready : t.booking.idle

  return (
    <form className="booking-bar reveal" id="reservation" aria-label="Moteur de réservation Mogador" onSubmit={handleSubmit}>
      <div className="booking-bar__seal" aria-hidden="true">
        <span>{t.common.official}</span>
        <strong>{t.common.bestRate}</strong>
      </div>
      <div className="booking-bar__rate-proof" aria-label="Avantage site officiel">
        <span>{t.booking.otherChannels}</span>
        <strong>{t.booking.variableRate}</strong>
        <span>{t.common.official}</span>
        <strong>{t.common.bestRate}</strong>
      </div>
      <label>
        <span>{t.booking.destination}</span>
        <select defaultValue="Marrakech">
          {destinations.map((destination) => <option key={destination.slug}>{destination.name}</option>)}
        </select>
      </label>
      <label>
        <span>{t.booking.arrival}</span>
        <input type="date" defaultValue={today} />
      </label>
      <label>
        <span>{t.booking.departure}</span>
        <input type="date" defaultValue={tomorrow} />
      </label>
      <label>
        <span>{t.booking.guests}</span>
        <select defaultValue="2 adultes">
          <option>1 adulte</option>
          <option>2 adultes</option>
          <option>2 adultes + 1 enfant</option>
          <option>Groupe / MICE</option>
        </select>
      </label>
      <label>
        <span>{t.booking.promo}</span>
        <input type="text" placeholder={t.booking.promoPlaceholder} />
      </label>
      <button type="submit" data-track="booking_submit">{bookingState === 'pending' ? t.booking.loading : t.booking.search}</button>
      <p aria-live="polite">{statusText}</p>
      {bookingState === 'ready' ? <Link className="booking-bar__next" to="/contact" data-track="booking_ready_contact">{t.booking.finalize}</Link> : null}
    </form>
  )
}
