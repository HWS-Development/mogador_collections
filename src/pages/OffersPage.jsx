import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import GallerySlider from '../components/GallerySlider'
import SignatureExperience from '../components/SignatureExperience'
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

const featuredOffer = {
  title: 'Offre directe',
  kicker: 'Offre à la une',
  image: '/assets/legacy/sea-suite.jpg',
  text: 'Réservez sur le site officiel Mogador et gardez un contact direct avec nos équipes pour choisir votre destination, vos dates et les attentions utiles à votre séjour.',
}

export default function OffersPage({ t, lang }) {
  const [title, text] = t.pages.offers
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-offers-page">
      <PageHero eyebrow="Trouvez nos offres" title={title} text={text} image="/assets/legacy/agadir-pool.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/programme-fidelite', label: t.nav.loyalty }} t={t} />

      <SignatureExperience variant="offers" cta="/#reservation" />

      <section className="gm-fs-offer-intro gm-page-section" aria-label="Introduction offres Mogador">
        <Link to="/destinations">Mogador</Link>
        <h2>{title}</h2>
        <p>{text}</p>
      </section>

      <section className="gm-fs-featured-offer gm-page-section" aria-label="Offre à la une Mogador">
        <figure className="gm-reveal">
          <img src={featuredOffer.image} alt={featuredOffer.title} loading="lazy" />
        </figure>
        <article className="gm-reveal">
          <span>{featuredOffer.kicker}</span>
          <h2>{featuredOffer.title}</h2>
          <p>{featuredOffer.text}</p>
          <Link to="/#reservation">Détails</Link>
        </article>
      </section>

      <section className="gm-offer-engine gm-page-section" id="reservation-offres">
        <div>
          <span className="gm-label">Site officiel</span>
          <h2>Choisissez votre hôtel, vos dates et votre offre.</h2>
          <p>Consultez les avantages disponibles et réservez votre séjour depuis le site officiel Mogador.</p>
        </div>
        <BookingBar t={t} />
      </section>

      <section className="gm-fs-offers-grid gm-page-section" aria-label="Toutes les offres Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Toutes les offres</span>
          <h2>Des offres officielles pour réserver votre séjour Mogador.</h2>
          <Link to="/#reservation">Meilleur tarif garanti</Link>
        </div>
        <div className="gm-fs-offers-grid__cards">
          {offers.map((offer, index) => {
            const [image, body] = offerVisuals[offer.title] || ['/assets/legacy/sea-suite.jpg', offer.text]
            return (
              <article className="gm-fs-offer-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={offer.title}>
                <img src={image} alt={offer.title} loading="lazy" />
                <div>
                  <span>{offer.badge}</span>
                  <h3>{offer.title}</h3>
                  <p>{body}</p>
                  <Link to="/#reservation" data-track={`offer_booking_${offer.title.toLowerCase().replace(/\s|&/g, '_')}`}>Voir l’offre</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-offer-gallery gm-page-section" aria-label="Galerie commerciale offres Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Galerie</span>
          <h2>Découvrez les expériences Mogador associées à nos offres.</h2>
        </div>
        <GallerySlider items={offerGallery} label="Galerie offres Mogador" />
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label="Pourquoi réserver sur notre site web">
        {directBookingBenefits.map(([benefit, text]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{text}</span></article>)}
      </section>
    </div>
  )
}
