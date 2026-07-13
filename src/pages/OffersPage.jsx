import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import Link from '../router/Link'
import { offers } from '../data/siteData'
import { directBookingBenefits } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

const offerVisuals = {
  'Offre directe': ['/assets/legacy/sea-suite.jpg', 'Réservez sur le site officiel et gardez le contact direct avec Mogador.'],
  'Séjour famille': ['/assets/legacy/agadir-pool.jpg', 'Piscines, chambres adaptées et moments simples à organiser.'],
  'Évasion couple': ['/assets/official/spa-official.jpg', 'Spa, dîner et parenthèse sensorielle dans une destination marocaine.'],
  'Business & MICE': ['/assets/official/mice-official.jpg', 'Réunions, groupes et événements avec réponse commerciale prioritaire.'],
}

const offerGallery = [
  ['/assets/legacy/menara-room.jpg', 'Chambres', 'Réserver un séjour confortable'],
  ['/assets/official/restaurant-official.jpg', 'Tables', 'Ajouter une expérience culinaire'],
  ['/assets/official/spa-official.jpg', 'Bien-être', 'Composer une pause détente'],
  ['/assets/official/mice-official.jpg', 'MICE', 'Demander un devis groupe'],
]

export default function OffersPage({ t, lang }) {
  const [title, text] = t.pages.offers
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-offers-page">
      <PageHero eyebrow="Trouvez nos offres" title={title} text={text} image="/assets/legacy/agadir-pool.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/programme-fidelite', label: t.nav.loyalty }} t={t} />

      <section className="gm-offer-engine gm-page-section" id="reservation-offres">
        <div>
          <span className="gm-label">Site officiel</span>
          <h2>Choisir l’hôtel, les dates, puis déclencher la demande directe.</h2>
          <p>Comparez les avantages directs, choisissez votre intention de séjour et lancez votre demande depuis le canal officiel Mogador.</p>
        </div>
        <BookingBar t={t} />
      </section>

      <section className="gm-offer-showcase gm-page-section" aria-label="Offres Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Offres à pousser</span>
          <h2>Des offres visibles, désirables, répétées et orientées action immédiate.</h2>
        </div>
        <div className="gm-offer-showcase__grid">
          {offers.map((offer, index) => {
            const [image, body] = offerVisuals[offer.title] || ['/assets/legacy/sea-suite.jpg', offer.text]
            return (
              <article className="gm-offer-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={offer.title}>
                <img src={image} alt={offer.title} loading="lazy" />
                <div>
                  <span>{offer.badge}</span>
                  <h3>{offer.title}</h3>
                  <p>{body}</p>
                  <strong>{offer.urgency}</strong>
                  <Link to="/#reservation" data-track={`offer_booking_${offer.title.toLowerCase().replace(/\s|&/g, '_')}`}>Voir les dates</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-offer-gallery gm-page-section" aria-label="Galerie commerciale offres Mogador">
        {offerGallery.map(([image, title, text]) => (
          <Link className="gm-offer-gallery__item gm-reveal" to="/#reservation" key={title}>
            <img src={image} alt={title} loading="lazy" />
            <div><strong>{title}</strong><span>{text}</span></div>
          </Link>
        ))}
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label="Pourquoi réserver sur notre site web">
        {directBookingBenefits.map(([benefit, text]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{text}</span></article>)}
      </section>
    </div>
  )
}
