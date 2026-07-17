import { useMemo, useState } from 'react'
import { hotels } from '../data/siteData'
import { translateDestinationName } from '../i18n/hotelLabels'

const guestOptions = {
  fr: [['1', '1 adulte'], ['2', '2 adultes'], ['3', '3 adultes'], ['4', '4 adultes']],
  en: [['1', '1 adult'], ['2', '2 adults'], ['3', '3 adults'], ['4', '4 adults']],
  ar: [['1', 'بالغ واحد'], ['2', 'بالغان'], ['3', '3 بالغين'], ['4', '4 بالغين']],
}

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDay(value) {
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + 1)
  return formatLocalDate(date)
}

export default function BookingBar({
  t,
  variant = 'default',
  source = 'site',
  showPromo = true,
  initialDestination = 'Marrakech',
  hotel = '',
  offer = '',
  lang = '',
}) {
  const { today, tomorrow } = useMemo(() => {
    const now = new Date()
    const next = new Date(now)
    next.setDate(now.getDate() + 1)
    return {
      today: formatLocalDate(now),
      tomorrow: formatLocalDate(next),
    }
  }, [])
  const bookableHotels = useMemo(() => hotels.filter((property) => property.bookingUrl), [])
  const selectedProperty = bookableHotels.find((property) => property.slug === hotel || property.name === hotel)
  const contactChoice = hotel && !selectedProperty ? `contact:${hotel}` : ''
  const orderedHotels = useMemo(
    () => [...bookableHotels].sort((a, b) => Number(b.destination === initialDestination) - Number(a.destination === initialDestination)),
    [bookableHotels, initialDestination],
  )
  const currentLang = ['fr', 'en', 'ar'].includes(lang) ? lang : (document.documentElement.lang || 'fr')
  const [search, setSearch] = useState({ hotel: selectedProperty?.slug || contactChoice, arrival: today, departure: tomorrow, guests: '2', promo: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const bookingHotel = bookableHotels.find((property) => property.slug === search.hotel)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'booking_search',
      source,
      hotel: bookingHotel?.name || hotel,
      offer,
      booking_provider: bookingHotel ? 'hotelrunner' : 'contact',
    })

    if (!bookingHotel) {
      const request = {
        request: offer ? 'offre' : 'reservation',
        hotel: hotel || search.hotel.replace('contact:', ''),
        arrival: search.arrival,
        departure: search.departure,
        guests: search.guests,
      }
      if (offer) request.offer = offer
      window.location.href = `/contact?${new URLSearchParams(request).toString()}`
      return
    }

    const params = new URLSearchParams({
      search: JSON.stringify({
        checkin_date: search.arrival,
        checkout_date: search.departure,
        rooms: [{ adult_count: Number(search.guests), child_count: 0, child_ages: [] }],
      }),
      locale: currentLang,
    })
    if (search.promo.trim()) params.set('coupon_code', search.promo.trim())
    window.location.href = `${bookingHotel.bookingUrl}?${params.toString()}`
  }

  const handleArrival = (event) => {
    const arrival = event.target.value
    setSearch((current) => ({
      ...current,
      arrival,
      departure: current.departure <= arrival ? addDay(arrival) : current.departure,
    }))
  }

  const updateSearch = (field) => (event) => {
    setSearch((current) => ({ ...current, [field]: event.target.value }))
  }

  return (
    <form className={`booking-bar booking-bar--${variant}`} aria-label={t.booking.formLabel || t.common.directBooking} onSubmit={handleSubmit}>
      <div className="booking-bar__seal" aria-hidden="true">
        <span>Mogador</span>
        <strong>{t.common.directBooking}</strong>
      </div>
      <label>
        <span>{t.booking.hotel || t.booking.destination}</span>
        <select name="hotel" value={search.hotel} onChange={updateSearch('hotel')} required>
          <option value="">{t.booking.hotelPlaceholder || t.booking.destination}</option>
          {contactChoice ? <option value={contactChoice}>{hotel}</option> : null}
          {orderedHotels.map((property) => (
            <option value={property.slug} key={property.slug}>{property.name} · {translateDestinationName(property.destination, currentLang)}</option>
          ))}
        </select>
      </label>
      <label>
        <span>{t.booking.arrival}</span>
        <input name="arrival" type="date" min={today} value={search.arrival} onChange={handleArrival} required />
      </label>
      <label>
        <span>{t.booking.departure}</span>
        <input name="departure" type="date" min={addDay(search.arrival)} value={search.departure} onChange={updateSearch('departure')} required />
      </label>
      <label>
        <span>{t.booking.guests}</span>
        <select name="guests" value={search.guests} onChange={updateSearch('guests')}>
          {(guestOptions[currentLang] || guestOptions.fr).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      {showPromo && (
        <label className="booking-bar__promo">
          <span>{t.booking.promo}</span>
          <input name="promo" type="text" value={search.promo} onChange={updateSearch('promo')} placeholder={t.booking.promoPlaceholder} autoComplete="off" />
        </label>
      )}
      <button type="submit" data-track="booking_submit">{t.booking.search}</button>
      <p>{t.booking.idle}</p>
    </form>
  )
}
