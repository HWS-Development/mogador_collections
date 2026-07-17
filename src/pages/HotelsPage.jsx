import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import Link from '../router/Link'
import { brand, destinations, hotels } from '../data/siteData'
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
  const filteredHotels = activeDestination === 'all' ? hotels : hotels.filter((hotel) => hotel.destination === activeDestination)
  const activeHotelData = filteredHotels[activeHotel] || filteredHotels[0]
  const activeHotelDetails = activeHotelData ? officialHotelDetails[activeHotelData.slug] : null
  const activeProofs = activeHotelData ? [activeHotelData.category, activeHotelData.family, ...(activeHotelData.facts || [])].slice(0, 4) : []

  useEffect(() => {
    setActiveHotel(0)
  }, [activeDestination])

  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const goToHotel = (direction) => {
    setActiveHotel((value) => (value + direction + filteredHotels.length) % filteredHotels.length)
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

      <section className="gm-hotel-directory gm-hotel-carousel-section" aria-label={copy.collectionTitle}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.collection}</span>
          <h2>{copy.collectionTitle}</h2>
          <p>{copy.collectionText}</p>
        </div>
        <div className="gm-hotel-compass gm-reveal" aria-label={copy.choose}>
          <div className="gm-hotel-compass__filters" aria-label={copy.collection}>
            {['all', ...destinations.map((destination) => destination.name)].map((destination) => (
              <button
                type="button"
                className={destination === activeDestination ? 'is-active' : ''}
                onClick={() => setActiveDestination(destination)}
                key={destination}
              >
                {destination === 'all' ? copy.all : translateDestinationName(destination, lang)}
              </button>
            ))}
          </div>
          {activeHotelData ? (
            <article className="gm-hotel-compass__active" aria-label={`${copy.selected}: ${activeHotelData.name}`}>
              <span aria-hidden="true">{String(activeHotel + 1).padStart(2, '0')}</span>
              <div>
                <strong>{activeHotelData.name}</strong>
                <p>{lang === 'fr' ? (activeHotelDetails?.overview?.[0] || activeHotelData.description || activeHotelData.baseline) : `${activeHotelData.family} · ${translateDestinationName(activeHotelData.destination, lang)}. ${text}`}</p>
              </div>
              <div className="gm-hotel-compass__proofs">
                {activeProofs.map((proof) => <small key={proof}>{translateHotelLabel(proof, lang)}</small>)}
              </div>
              <nav aria-label={`${activeHotelData.name}`}>
                <Link to={`/hotels/${activeHotelData.slug}`}>{copy.explore}</Link>
                <Link to="/#reservation" data-hotel={activeHotelData.name} data-destination={activeHotelData.destination}>{copy.book}</Link>
                <a href={`tel:${brand.phone.replaceAll(' ', '')}`}>{copy.call}</a>
              </nav>
            </article>
          ) : null}
        </div>
        <div className="gm-hotel-carousel gm-reveal" role="region" aria-label={copy.carousel}>
          <div className="gm-hotel-carousel__viewport">
            <div className="gm-hotel-carousel__track" style={{ '--active-hotel': activeHotel }}>
              {filteredHotels.map((hotel, index) => <HotelTile hotel={hotel} index={index} active={index === activeHotel} copy={copy} lang={lang} fallbackText={text} key={hotel.slug} />)}
            </div>
          </div>
          <div className="gm-hotel-carousel__controls" aria-label={copy.carousel}>
            <button type="button" onClick={() => goToHotel(-1)} aria-label={copy.previous}>‹</button>
            <strong>{copy.browse}</strong>
            <button type="button" onClick={() => goToHotel(1)} aria-label={copy.next}>›</button>
          </div>
          <div className="gm-hotel-carousel__progress" aria-label={copy.choose}>
            {filteredHotels.map((hotel, index) => (
              <button type="button" className={index === activeHotel ? 'is-active' : ''} onClick={() => setActiveHotel(index)} key={hotel.slug} aria-label={`${copy.display} ${hotel.name}`}>
                <span>{hotel.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function HotelTile({ hotel, index, active, copy, lang, fallbackText }) {
  const highlights = (hotel.facts?.length ? hotel.facts : [hotel.destination, hotel.category, hotel.family]).slice(0, 3)

  return (
    <article className={`gm-hotel-tile gm-hotel-tile--${hotel.palette} ${active ? 'is-active' : ''}`} style={{ '--delay': `${index * 55}ms` }}>
      <Link className="gm-hotel-tile__media" to={`/hotels/${hotel.slug}`}>
        <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
      </Link>
      <div className="gm-hotel-tile__body">
        <span className="gm-hotel-tile__topline">{translateDestinationName(hotel.destination, lang)} / {translateHotelLabel(hotel.category, lang)}</span>
        <h3>{hotel.name}</h3>
        <i />
        <p>{lang === 'fr' ? hotel.baseline : `${translateDestinationName(hotel.destination, lang)}. ${fallbackText}`}</p>
        <div className="gm-hotel-tile__badges">{highlights.map((highlight) => <small key={highlight}>{translateHotelLabel(highlight, lang)}</small>)}</div>
        <div className="gm-hotel-tile__actions"><Link className="gm-hotel-tile__details" to={`/hotels/${hotel.slug}`} data-track={`hotel_card_details_${hotel.slug}`}>{copy.details}</Link></div>
      </div>
    </article>
  )
}
