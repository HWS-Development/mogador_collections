import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { loyaltyBenefits } from '../data/siteData'
import { directBookingBenefits } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

const loyaltyGallery = [
  ['/assets/showcase/hero-service-wide.webp', 'Accueil reconnu', 'Un contact plus personnel dès la prochaine demande.', 'Relation directe'],
  ['/assets/legacy/sea-suite.jpg', 'Séjours directs', 'Des avantages pensés pour ceux qui réservent avec Mogador.', 'Client membre'],
  ['/assets/official/restaurant-official.jpg', 'Expériences membres', 'Des inspirations restauration, bien-être et destination.', 'Art de vivre'],
  ['/assets/official/mice-official.jpg', 'Groupes & corporate', 'Une relation simplifiée pour les demandes récurrentes.', 'Corporate'],
]

const loyaltyBenefitLabels = ['Direct', 'Accueil', 'Membres', 'Expériences', 'Langues']

export default function LoyaltyPage({ t, lang }) {
  const [title, text] = t.pages.loyalty
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-loyalty-page">
      <PageHero eyebrow="Fidélité" title={title} text={text} image="/assets/legacy/sea-suite.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/contact', label: t.nav.contact }} t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">Relation client</span>
          <h2>Un programme sobre, utile, orienté récurrence et réservation directe.</h2>
        </div>
        <div className="gm-rich-copy">
          <p>Un espace relationnel pensé pour reconnaître les clients directs, personnaliser l’accueil et encourager les prochains séjours Mogador.</p>
        </div>
      </section>

      <section className="gm-loyalty-ledger gm-page-section" aria-label="Bénéfices fidélité Mogador">
        {loyaltyBenefits.map((benefit, index) => (
          <article className="gm-reveal" style={{ '--delay': `${index * 60}ms` }} key={benefit}>
            <span>{loyaltyBenefitLabels[index] || 'Mogador'}</span>
            <h3>{benefit}</h3>
            <p>Un bénéfice à activer dans une logique de relation directe, multilingue et propriétaire.</p>
          </article>
        ))}
      </section>

      <section className="gm-loyalty-gallery gm-page-section" aria-label="Galerie programme fidélité Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Avantages relationnels</span>
          <h2>Faire revenir le client avec du service, des attentions et des offres directes.</h2>
        </div>
        <div className="gm-loyalty-gallery__grid">
          {loyaltyGallery.map(([image, title, body, label], index) => (
            <article className="gm-loyalty-visual gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={title}>
              <img src={image} alt={title} loading="lazy" />
              <div><span>{label}</span><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label="Avantages réservation directe">
        {directBookingBenefits.map(([benefit, text]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{text}</span></article>)}
      </section>

      <section className="gm-final gm-final--compact">
        <span className="gm-label">Activation</span>
        <h2>Transformer la fidélité en demande qualifiée.</h2>
        <p>Inscrivez-vous pour recevoir les avantages directs, les offres membres et les inspirations de séjour Mogador.</p>
        <div className="gm-actions"><Link to="/contact" className="gm-button gm-button--primary">Activer le programme</Link></div>
      </section>
    </div>
  )
}
