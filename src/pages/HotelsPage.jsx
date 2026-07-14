import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import Link from '../router/Link'
import { hotels } from '../data/siteData'
import { directBookingBenefits, officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function HotelsPage({ t, lang }) {
  const [title, text] = t.pages.hotels
  const [activeHotel, setActiveHotel] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHotel((value) => (value + 1) % hotels.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [])

  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const goToHotel = (direction) => {
    setActiveHotel((value) => (value + direction + hotels.length) % hotels.length)
  }

  return (
    <div className="gm-page gm-hotels-page">
      <PageHero eyebrow="Nos hôtels" title={title} text={text} image="/assets/legacy/menara-salon.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} booking t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">Portefeuille</span>
          <h2>Douze établissements, cinq destinations et une lecture claire par gamme.</h2>
        </div>
        <div className="gm-rich-copy">
          <p>Les hôtels sont organisés pour comparer rapidement destination, gamme, ambiance et intention de séjour.</p>
          <p>Chaque fiche dirige vers l’essentiel: présentation, hébergement, restauration, bien-être, espaces MICE, galerie et réservation directe.</p>
        </div>
      </section>

      <section className="gm-hotel-sales-panel gm-page-section" aria-label="Réservation directe hôtels Mogador">
        <div className="gm-hotel-sales-panel__copy">
          <span className="gm-label">Réserver au bon endroit</span>
          <h2>Un hôtel, une destination, une action claire: réserver en direct.</h2>
          <p>Le client ne doit jamais chercher le prochain geste. Chaque établissement propose une action immédiate vers la réservation, le devis ou le contact.</p>
        </div>
        <BookingBar t={t} />
        <div className="gm-direct-proof gm-direct-proof--compact">
          {directBookingBenefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
        </div>
      </section>

      <section className="gm-hotel-directory gm-hotel-carousel-section" aria-label="Hôtels Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Collection Mogador</span>
          <h2>Une seule galerie pour parcourir les douze adresses.</h2>
          <p>Faites défiler les hôtels comme une sélection éditoriale: image, destination, preuves utiles et accès direct à la fiche.</p>
        </div>
        <div className="gm-hotel-carousel gm-reveal" role="region" aria-label="Carousel hôtels Mogador">
          <div className="gm-hotel-carousel__viewport">
            <div className="gm-hotel-carousel__track" style={{ '--active-hotel': activeHotel }}>
              {hotels.map((hotel, index) => <HotelTile hotel={hotel} index={index} active={index === activeHotel} key={hotel.slug} />)}
            </div>
          </div>
          <div className="gm-hotel-carousel__controls" aria-label="Navigation hôtels">
            <button type="button" onClick={() => goToHotel(-1)} aria-label="Hôtel précédent">‹</button>
            <strong>{activeHotel + 1} / {hotels.length}</strong>
            <button type="button" onClick={() => goToHotel(1)} aria-label="Hôtel suivant">›</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function HotelTile({ hotel, index, active }) {
  const highlights = (hotel.facts?.length ? hotel.facts : [hotel.destination, hotel.category, hotel.family]).slice(0, 3)

  return (
    <article className={`gm-hotel-tile gm-hotel-tile--${hotel.palette} ${active ? 'is-active' : ''}`} style={{ '--delay': `${index * 55}ms` }}>
      <Link className="gm-hotel-tile__media" to={`/hotels/${hotel.slug}`}>
        <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
      </Link>
      <div className="gm-hotel-tile__body">
        <span className="gm-hotel-tile__topline">{hotel.destination} / {hotel.category}</span>
        <h3>{hotel.name}</h3>
        <i />
        <p>{hotel.baseline}</p>
        <div className="gm-hotel-tile__badges">{highlights.map((highlight) => <small key={highlight}>{highlight}</small>)}</div>
        <div className="gm-hotel-tile__actions"><Link className="gm-hotel-tile__details" to={`/hotels/${hotel.slug}`} data-track={`hotel_card_details_${hotel.slug}`}>Détails</Link></div>
      </div>
    </article>
  )
}
