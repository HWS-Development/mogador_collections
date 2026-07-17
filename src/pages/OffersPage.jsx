import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { offers } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

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

const featuredOffer = {
  title: 'Offre directe',
  kicker: 'Offre à la une',
  image: '/assets/legacy/sea-suite.jpg',
  text: 'Réservez sur le site officiel Mogador et gardez un contact direct avec nos équipes pour choisir votre destination, vos dates et les attentions utiles à votre séjour.',
}

export default function OffersPage({ t, lang }) {
  const [title, text] = t.pages.offers
  const allCopy = getInteriorCopy(lang)
  const copy = allCopy.offers
  const localizedGallery = offerGallery.map(([image], index) => [image, copy.cards[index][1], copy.cards[index][2]])
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-offers-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/legacy/agadir-pool.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/programme-fidelite', label: t.nav.loyalty }} t={t} />

      <section className="gm-fs-featured-offer gm-page-section" aria-label={copy.featuredLabel}>
        <figure className="gm-reveal">
          <img src={featuredOffer.image} alt={copy.featuredTitle} loading="lazy" />
        </figure>
        <article className="gm-reveal">
          <span>{copy.featuredLabel}</span>
          <h2>{copy.featuredTitle}</h2>
          <p>{copy.featuredText}</p>
          <Link to="/#reservation" data-offer={featuredOffer.title}>{copy.prepare}</Link>
        </article>
      </section>

      <section className="gm-offer-engine gm-page-section" id="reservation-offres">
        <div>
          <span className="gm-label">{copy.engineLabel}</span>
          <h2>{copy.engineTitle}</h2>
          <p>{copy.engineText}</p>
        </div>
        <BookingBar t={t} lang={lang} source="offers_page" initialDestination="Toutes les destinations" />
      </section>

      <section className="gm-fs-offers-grid gm-page-section" aria-label={copy.allLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.allLabel}</span>
          <h2>{copy.allTitle}</h2>
          <Link to="/#reservation">{copy.book}</Link>
        </div>
        <div className="gm-fs-offers-grid__cards">
          {offers.map((offer, index) => {
            const [image] = offerVisuals[offer.title] || ['/assets/legacy/sea-suite.jpg']
            const [badge, cardTitle, body] = copy.cards[index] || [offer.badge, offer.title, offer.text]
            return (
              <article className="gm-fs-offer-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={offer.title}>
                <img src={image} alt={cardTitle} loading="lazy" />
                <div>
                  <span>{badge}</span>
                  <h3>{cardTitle}</h3>
                  <p>{body}</p>
                  <Link to="/#reservation" data-offer={offer.title} data-track={`offer_booking_${offer.title.toLowerCase().replace(/\s|&/g, '_')}`}>{copy.prepare}</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-offer-gallery gm-page-section" aria-label={copy.galleryLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.gallery}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={localizedGallery} label={copy.galleryLabel} t={t} lang={lang} />
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label={t.common.directBooking}>
        {allCopy.benefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
      </section>
    </div>
  )
}
