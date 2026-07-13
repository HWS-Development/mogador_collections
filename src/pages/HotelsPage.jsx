import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import Link from '../router/Link'
import { additionalBrandMentions, hotels } from '../data/siteData'
import { directBookingBenefits, officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function HotelsPage({ t, lang }) {
  const [title, text] = t.pages.hotels
  const officialHotels = hotels.filter((hotel) => officialHotelDetails[hotel.slug])
  const charterHotels = hotels.filter((hotel) => !officialHotelDetails[hotel.slug])

  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

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

      <section className="gm-hotel-directory" aria-label="Hôtels officiels Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Contenu officiel</span>
          <h2>Les adresses prêtes à transformer l’inspiration en réservation.</h2>
        </div>
        <div className="gm-hotel-directory__grid">
          {officialHotels.map((hotel, index) => <HotelTile hotel={hotel} index={index} key={hotel.slug} />)}
        </div>
      </section>

      <section className="gm-charter-directory gm-page-section" aria-label="Portefeuille charte Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Portefeuille Mogador</span>
          <h2>Les autres marques restent visibles, avec une lecture claire et non trompeuse.</h2>
          <p>{additionalBrandMentions.join(' / ')}</p>
        </div>
        <div className="gm-charter-list">
          {charterHotels.map((hotel) => (
            <Link className={`gm-charter-row gm-charter-row--${hotel.palette} gm-reveal`} to={`/hotels/${hotel.slug}`} key={hotel.slug}>
              <span>{hotel.family}</span>
              <strong>{hotel.name}</strong>
              <small>{hotel.destination} / {hotel.category}</small>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function HotelTile({ hotel, index }) {
  const highlights = (hotel.facts?.length ? hotel.facts : [hotel.destination, hotel.category, hotel.family]).slice(0, 3)

  return (
    <article className={`gm-hotel-tile gm-hotel-tile--${hotel.palette} gm-reveal`} style={{ '--delay': `${index * 55}ms` }}>
      <Link className="gm-hotel-tile__media" to={`/hotels/${hotel.slug}`}>
        <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
      </Link>
      <div className="gm-hotel-tile__body">
        <span className="gm-hotel-tile__topline">{hotel.destination} / {hotel.category}</span>
        <h3>{hotel.name}</h3>
        <p>{hotel.baseline}</p>
        <div className="gm-hotel-tile__badges">{highlights.map((highlight) => <small key={highlight}>{highlight}</small>)}</div>
        <div className="gm-hotel-tile__actions">
          <Link className="gm-hotel-tile__book" to="/#reservation" data-track={`hotel_card_book_${hotel.slug}`}>Réserver en direct</Link>
          <Link className="gm-hotel-tile__details" to={`/hotels/${hotel.slug}`} data-track={`hotel_card_details_${hotel.slug}`}>Découvrir l’adresse</Link>
        </div>
      </div>
    </article>
  )
}
