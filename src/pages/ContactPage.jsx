import { useState } from 'react'
import PageHero from '../components/PageHero'
import { brand, destinations } from '../data/siteData'
import { hotelContacts } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'
import { translateDestinationName } from '../i18n/hotelLabels'

function formatRequestDate(value, lang) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function ContactPage({ t, lang, routeLocation }) {
  const [title, text] = t.pages.contact
  const allCopy = getInteriorCopy(lang)
  const copy = allCopy.contact
  const [submitted, setSubmitted] = useState(false)
  const bookingRequest = Object.fromEntries(new URLSearchParams(window.location.search))
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const subjectTarget = form.get('hotel') || form.get('offer') || form.get('destination')
    const subject = `${title} Mogador - ${form.get('requestType')} - ${subjectTarget || 'Mogador'}`
    const body = [
      `${copy.firstName}: ${form.get('firstName')}`,
      `${copy.lastName}: ${form.get('lastName')}`,
      `${copy.email}: ${form.get('email')}`,
      `${copy.phone}: ${form.get('phone') || '-'}`,
      `${copy.destination}: ${form.get('destination')}`,
      form.get('hotel') ? `${t.booking.hotel}: ${form.get('hotel')}` : null,
      form.get('offer') ? `${t.nav.offers}: ${form.get('offer')}` : null,
      '',
      form.get('message'),
    ].filter((line) => line !== null).join('\n')

    setSubmitted(true)
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const arrival = formatRequestDate(bookingRequest.arrival, lang)
  const departure = formatRequestDate(bookingRequest.departure, lang)
  const requestTarget = bookingRequest.hotel || bookingRequest.offer || bookingRequest.destination
  const bookingMessage = getBookingMessage(bookingRequest, arrival, departure, lang)

  return (
    <div className="gm-page gm-contact-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/legacy/menara-salon.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} t={t} />

      <section className="gm-contact-command gm-page-section">
        <div>
          <span className="gm-label">{copy.office}</span>
          <h2>{copy.address}</h2>
          <div className="gm-contact-links">
            <a href={`tel:${brand.phone}`}>{brand.phone}</a>
            <a href="mailto:contact@mogadorhotels.com">contact@mogadorhotels.com</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </div>
        </div>
        <form id="contact-form" className="gm-contact-form" onSubmit={handleSubmit} key={`${routeLocation}-${lang}`}>
          {requestTarget ? (
            <div className="gm-contact-form__summary">
              <span>{copy.selection}</span>
              <strong>{bookingRequest.hotel || bookingRequest.offer || bookingRequest.destination}</strong>
              {arrival ? <small>{arrival} – {departure} · {bookingRequest.guests || '2'}</small> : <small>{copy.officialChannel}</small>}
            </div>
          ) : null}
          <input name="hotel" type="hidden" value={bookingRequest.hotel || ''} readOnly />
          <input name="offer" type="hidden" value={bookingRequest.offer || ''} readOnly />
          <label><span>{copy.requestType}</span><select name="requestType" defaultValue={bookingRequest.request === 'mice' ? copy.requests[3] : bookingRequest.request === 'loyalty' ? copy.requests[4] : copy.requests[0]}>{copy.requests.map((request) => <option key={request}>{request}</option>)}</select></label>
          <label><span>{copy.destination}</span><select name="destination" defaultValue={bookingRequest.destination || 'Marrakech'}><option value="">{copy.allDestinations}</option>{destinations.map((destination) => <option value={destination.name} key={destination.slug}>{translateDestinationName(destination.name, lang)}</option>)}</select></label>
          <label><span>{copy.firstName}</span><input name="firstName" type="text" autoComplete="given-name" required /></label>
          <label><span>{copy.lastName}</span><input name="lastName" type="text" autoComplete="family-name" required /></label>
          <label><span>{copy.email}</span><input name="email" type="email" autoComplete="email" required /></label>
          <label><span>{copy.phone}</span><input name="phone" type="tel" autoComplete="tel" /></label>
          <label className="gm-contact-form__wide"><span>{copy.message}</span><textarea name="message" rows="5" defaultValue={bookingMessage} required /></label>
          <button className="gm-button gm-button--primary" type="submit">{copy.send}</button>
          <p aria-live="polite">{submitted ? copy.sentStatus : copy.initialStatus}</p>
        </form>
      </section>

      <section className="gm-page-section gm-contact-hotels" aria-label={copy.contactsAria}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.hotelContacts}</span>
          <h2>{copy.hotelContactsTitle}</h2>
        </div>
        <div className="gm-contact-hotels__grid">
          {hotelContacts.map((hotel) => (
            <article className="gm-reveal" key={hotel.email}>
              <h3>{hotel.name}</h3>
              <p>{hotel.address}</p>
              <a href={`tel:${hotel.phone}`}>{hotel.phone}</a>
              <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label={t.common.directBooking}>
        {allCopy.benefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
      </section>
    </div>
  )
}

function getBookingMessage(request, arrival, departure, lang) {
  const hotel = request.hotel ? ` ${request.hotel}` : ''
  const destination = request.destination || 'Marrakech'
  const guests = request.guests || '2'

  if (lang === 'en') {
    if (request.request === 'loyalty') return 'I would like to join the Mogador loyalty programme and receive member information.'
    if (request.request === 'mice') return `I would like to organise a ${request.eventFormat || 'business event'} in ${destination} for ${request.capacity || '50 or more guests'}. Please suggest suitable venues and services.`
    if (request.arrival) return `I would like to plan a stay${hotel ? ` at${hotel}` : ''} from ${arrival} to ${departure} for ${guests} guests.${request.offer ? ` Requested offer: ${request.offer}.` : ''}${request.promo ? ` Promo code: ${request.promo}.` : ''}`
    if (request.hotel || request.offer || request.destination) return `I would like more information about ${request.hotel || request.offer || destination}.`
    return ''
  }

  if (lang === 'ar') {
    if (request.request === 'loyalty') return 'أرغب في الانضمام إلى برنامج ولاء موغادور والحصول على معلومات الأعضاء.'
    if (request.request === 'mice') return `أرغب في تنظيم ${request.eventFormat || 'فعالية'} في ${destination} بسعة ${request.capacity || '50 مشاركا أو أكثر'}. يرجى اقتراح الفضاءات والخدمات المناسبة.`
    if (request.arrival) return `أرغب في تحضير إقامة${hotel ? ` في${hotel}` : ''} من ${arrival} إلى ${departure} لعدد ${guests} من الضيوف.${request.offer ? ` العرض المطلوب: ${request.offer}.` : ''}${request.promo ? ` رمز العرض: ${request.promo}.` : ''}`
    if (request.hotel || request.offer || request.destination) return `أرغب في الحصول على معلومات حول ${request.hotel || request.offer || destination}.`
    return ''
  }

  if (request.request === 'loyalty') return 'Je souhaite rejoindre le programme fidélité Mogador et recevoir les informations membres.'
  if (request.request === 'mice') return `Je souhaite organiser un ${request.eventFormat || 'événement'} à ${destination} pour une capacité de ${request.capacity || '50 personnes et plus'}. Merci de me proposer les espaces et services adaptés.`
  if (request.arrival) return `Je souhaite préparer un séjour${hotel ? ` à${hotel}` : ''} du ${arrival} au ${departure}, pour ${guests} personnes.${request.offer ? ` Offre souhaitée : ${request.offer}.` : ''}${request.promo ? ` Code promotionnel : ${request.promo}.` : ''}`
  if (request.hotel || request.offer || request.destination) return `Je souhaite recevoir des informations sur ${request.hotel || request.offer || destination}.`
  return ''
}
