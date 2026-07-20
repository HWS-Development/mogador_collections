import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import ResponsiveImage from '../components/ResponsiveImage'
import Link from '../router/Link'
import { activeHotels as hotels, brand, destinations } from '../data/siteData'
import { officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'
import { translateDestinationName, translateHotelLabel } from '../i18n/hotelLabels'

export default function HotelsPage({ t, lang }) {
  const [title, text] = t.pages.hotels
  const copy = getInteriorCopy(lang).hotels
  const benefits = getInteriorCopy(lang).benefits
  const [activeHotel, setActiveHotel] = useState(0)
  const [activeDestination, setActiveDestination] = useState('all')
  const hotelDestinations = destinations.filter((destination) => hotels.some((hotel) => hotel.destination === destination.name))
  const filteredHotels = activeDestination === 'all' ? hotels : hotels.filter((hotel) => hotel.destination === activeDestination)
  const activeHotelData = filteredHotels[activeHotel] || filteredHotels[0]
  const activeHotelDetails = activeHotelData ? officialHotelDetails[activeHotelData.slug] : null
  const activeProofs = activeHotelData ? getHotelProofs(activeHotelData, lang) : []

  useEffect(() => {
    setActiveHotel(0)
  }, [activeDestination])

  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const goToHotel = (direction) => {
    if (filteredHotels.length < 2) return
    setActiveHotel((value) => (value + direction + filteredHotels.length) % filteredHotels.length)
  }

  const onCarouselKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToHotel(lang === 'ar' ? 1 : -1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToHotel(lang === 'ar' ? -1 : 1)
    }
  }

  return (
    <div className="gm-page gm-hotels-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/legacy/menara-salon.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">{copy.portfolio}</span>
          <h2>{copy.portfolioTitle}</h2>
        </div>
        <div className="gm-rich-copy">
          {copy.portfolioText.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="gm-hotel-sales-panel gm-page-section" aria-label={copy.salesTitle}>
        <div className="gm-hotel-sales-panel__copy">
          <span className="gm-label">{copy.salesLabel}</span>
          <h2>{copy.salesTitle}</h2>
          <p>{copy.salesText}</p>
        </div>
        <BookingBar t={t} lang={lang} source="hotels_directory" initialDestination="Toutes les destinations" />
        <div className="gm-direct-proof gm-direct-proof--compact">
          {benefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
        </div>
      </section>

      <section id="hotel-collection" className="gm-hotel-collection gm-page-section" aria-label={copy.collectionTitle}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.collection}</span>
          <h2>{copy.collectionTitle}</h2>
          <p>{copy.collectionText}</p>
        </div>
        <div className="gm-hotel-collection__filters gm-reveal" aria-label={copy.collection}>
          {['all', ...hotelDestinations.map((destination) => destination.name)].map((destination) => (
            <button
              type="button"
              className={destination === activeDestination ? 'is-active' : ''}
              aria-pressed={destination === activeDestination}
              onClick={() => setActiveDestination(destination)}
              key={destination}
            >
              {destination === 'all' ? copy.all : translateDestinationName(destination, lang)}
            </button>
          ))}
        </div>

        {activeHotelData ? (
          <div className="gm-hotel-atelier gm-reveal" role="region" aria-label={copy.carousel} tabIndex={0} onKeyDown={onCarouselKeyDown}>
            <div className="gm-hotel-atelier__visual">
              <Link to={`/hotels/${activeHotelData.slug}`} aria-label={`${copy.explore}: ${activeHotelData.name}`}>
                <ResponsiveImage src={activeHotelData.image || activeHotelData.gallery?.[0]} sizes="(max-width: 760px) 100vw, 64vw" alt={activeHotelData.name} key={activeHotelData.slug} />
                <span aria-hidden="true" />
              </Link>
              <div className="gm-hotel-atelier__meta">
                <span>{translateDestinationName(activeHotelData.destination, lang)}</span>
                <span>{translateHotelLabel(activeHotelData.category, lang)}</span>
              </div>
              <div className="gm-hotel-atelier__count" aria-hidden="true">
                <strong>{String(activeHotel + 1).padStart(2, '0')}</strong>
                <i />
                <span>{String(filteredHotels.length).padStart(2, '0')}</span>
              </div>
            </div>

            <article className="gm-hotel-atelier__story" id="hotel-collection-panel" aria-live="polite">
              <header>
                <span>{activeHotelData.family}</span>
                <div className="gm-hotel-atelier__controls">
                  <button type="button" onClick={() => goToHotel(-1)} aria-label={copy.previous} disabled={filteredHotels.length < 2}><CollectionArrow direction="back" /></button>
                  <button type="button" onClick={() => goToHotel(1)} aria-label={copy.next} disabled={filteredHotels.length < 2}><CollectionArrow /></button>
                </div>
              </header>
              <h3>{activeHotelData.name}</h3>
              <p>{lang === 'fr' ? (activeHotelDetails?.overview?.[0] || activeHotelData.description || activeHotelData.baseline) : `${activeHotelData.family} · ${translateDestinationName(activeHotelData.destination, lang)}. ${text}`}</p>
              <div className="gm-hotel-atelier__proofs">
                {activeProofs.map((proof) => <small key={proof}>{translateHotelLabel(proof, lang)}</small>)}
              </div>
              <div className="gm-hotel-atelier__actions">
                <Link to={`/hotels/${activeHotelData.slug}`} data-track={`hotel_collection_details_${activeHotelData.slug}`}>{copy.explore}<CollectionArrow /></Link>
                <Link to="/#reservation" data-hotel={activeHotelData.name} data-destination={activeHotelData.destination}>{copy.book}</Link>
              </div>
              <a className="gm-hotel-atelier__call" href={`tel:${brand.phone.replaceAll(' ', '')}`}>{copy.call} · {brand.phone}</a>
            </article>
          </div>
        ) : null}

        <nav className="gm-hotel-collection__index gm-reveal" aria-label={copy.choose}>
          {filteredHotels.map((hotel, index) => (
            <button
              type="button"
              className={index === activeHotel ? 'is-active' : ''}
              aria-pressed={index === activeHotel}
              aria-controls="hotel-collection-panel"
              onClick={() => setActiveHotel(index)}
              key={hotel.slug}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{hotel.name}</strong>
              <small>{translateDestinationName(hotel.destination, lang)}</small>
            </button>
          ))}
        </nav>
      </section>
    </div>
  )
}

function CollectionArrow({ direction = 'forward' }) {
  return (
    <svg viewBox="0 0 28 16" aria-hidden="true">
      <path d={direction === 'back' ? 'M27 8H2M8 1 1 8l7 7' : 'M1 8h25M20 1l7 7-7 7'} />
    </svg>
  )
}

function getHotelProofs(hotel, lang) {
  const roomCount = hotel.roomTypes?.length || hotel.rooms?.length || 0
  const serviceCount = hotel.services?.length || 0
  if (lang === 'en') return [hotel.category, `${roomCount} room categories`, `${serviceCount} listed service${serviceCount === 1 ? '' : 's'}`]
  if (lang === 'ar') return [hotel.category, `${roomCount} فئات غرف`, `${serviceCount} خدمات مدرجة`]
  return [hotel.category, `${roomCount} catégories de chambres`, `${serviceCount} service${serviceCount === 1 ? '' : 's'} référencé${serviceCount === 1 ? '' : 's'}`]
}
