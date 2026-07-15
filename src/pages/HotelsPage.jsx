import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import SignatureExperience from '../components/SignatureExperience'
import Link from '../router/Link'
import { brand, destinations, hotels } from '../data/siteData'
import { directBookingBenefits, officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function HotelsPage({ t, lang }) {
  const [title, text] = t.pages.hotels
  const [activeHotel, setActiveHotel] = useState(0)
  const [activeDestination, setActiveDestination] = useState('Tous')
  const filteredHotels = activeDestination === 'Tous' ? hotels : hotels.filter((hotel) => hotel.destination === activeDestination)
  const activeHotelData = filteredHotels[activeHotel] || filteredHotels[0]
  const activeHotelDetails = activeHotelData ? officialHotelDetails[activeHotelData.slug] : null
  const activeProofs = activeHotelData ? [activeHotelData.category, activeHotelData.family, ...(activeHotelData.facts || [])].slice(0, 4) : []

  useEffect(() => {
    if (filteredHotels.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveHotel((value) => (value + 1) % filteredHotels.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [filteredHotels.length])

  useEffect(() => {
    setActiveHotel(0)
  }, [activeDestination])

  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const goToHotel = (direction) => {
    setActiveHotel((value) => (value + direction + filteredHotels.length) % filteredHotels.length)
  }

  return (
    <div className="gm-page gm-hotels-page">
      <PageHero eyebrow="Nos hôtels" title={title} text={text} image="/assets/legacy/menara-salon.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} booking t={t} />

      <SignatureExperience variant="hotels" cta="/#reservation" />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">Portefeuille</span>
          <h2>Douze établissements Mogador dans cinq destinations marocaines.</h2>
        </div>
        <div className="gm-rich-copy">
          <p>Consultez les hôtels Mogador par destination, catégorie et services disponibles.</p>
          <p>Chaque fiche rassemble les informations essentielles: hébergement, restauration, bien-être, espaces MICE, galerie et réservation directe.</p>
        </div>
      </section>

      <section className="gm-hotel-sales-panel gm-page-section" aria-label="Réservation directe hôtels Mogador">
        <div className="gm-hotel-sales-panel__copy">
          <span className="gm-label">Réserver au bon endroit</span>
          <h2>Réservez votre hôtel Mogador sur le site officiel.</h2>
          <p>Découvrez les adresses Mogador au Maroc et réservez directement votre prochain séjour depuis le site officiel.</p>
        </div>
        <BookingBar t={t} />
        <div className="gm-direct-proof gm-direct-proof--compact">
          {directBookingBenefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
        </div>
      </section>

      <section className="gm-hotel-directory gm-hotel-carousel-section" aria-label="Hôtels Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Collection Mogador</span>
          <h2>Douze hôtels Mogador à découvrir.</h2>
          <p>Parcourez la collection, filtrez par destination et accédez aux informations de chaque hôtel avant de réserver en direct.</p>
        </div>
        <div className="gm-hotel-compass gm-reveal" aria-label="Sélecteur d'hôtel Mogador">
          <div className="gm-hotel-compass__filters" aria-label="Filtrer par destination">
            {['Tous', ...destinations.map((destination) => destination.name)].map((destination) => (
              <button
                type="button"
                className={destination === activeDestination ? 'is-active' : ''}
                onClick={() => setActiveDestination(destination)}
                key={destination}
              >
                {destination}
              </button>
            ))}
          </div>
          {activeHotelData ? (
            <article className="gm-hotel-compass__active">
              <span>Adresse sélectionnée</span>
              <div>
                <strong>{activeHotelData.name}</strong>
                <p>{activeHotelDetails?.overview?.[0] || activeHotelData.description || activeHotelData.baseline}</p>
              </div>
              <div className="gm-hotel-compass__proofs">
                {activeProofs.map((proof) => <small key={proof}>{proof}</small>)}
              </div>
              <nav aria-label={`Actions pour ${activeHotelData.name}`}>
                <Link to={`/hotels/${activeHotelData.slug}`}>Explorer l’adresse</Link>
                <Link to="/#reservation">Réserver en direct</Link>
                <a href={`tel:${brand.phone.replaceAll(' ', '')}`}>Appeler</a>
              </nav>
            </article>
          ) : null}
        </div>
        <div className="gm-hotel-carousel gm-reveal" role="region" aria-label="Carousel hôtels Mogador">
          <div className="gm-hotel-carousel__viewport">
            <div className="gm-hotel-carousel__track" style={{ '--active-hotel': activeHotel }}>
              {filteredHotels.map((hotel, index) => <HotelTile hotel={hotel} index={index} active={index === activeHotel} key={hotel.slug} />)}
            </div>
          </div>
          <div className="gm-hotel-carousel__controls" aria-label="Navigation hôtels">
            <button type="button" onClick={() => goToHotel(-1)} aria-label="Hôtel précédent">‹</button>
            <strong>Parcourir</strong>
            <button type="button" onClick={() => goToHotel(1)} aria-label="Hôtel suivant">›</button>
          </div>
          <div className="gm-hotel-carousel__progress" aria-label="Choisir un hôtel">
            {filteredHotels.map((hotel, index) => (
              <button type="button" className={index === activeHotel ? 'is-active' : ''} onClick={() => setActiveHotel(index)} key={hotel.slug} aria-label={`Afficher ${hotel.name}`}>
                <span>{hotel.name}</span>
              </button>
            ))}
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
