import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

const loyaltyGallery = [
  ['/assets/showcase/hero-service-wide.webp', 'Accueil reconnu', 'Un contact plus personnel dès la prochaine demande.', 'Relation directe'],
  ['/assets/legacy/sea-suite.jpg', 'Séjours directs', 'Des avantages pensés pour ceux qui réservent avec Mogador.', 'Client membre'],
  ['/assets/official/restaurant-official.jpg', 'Expériences membres', 'Des inspirations restauration, bien-être et destination.', 'Art de vivre'],
  ['/assets/official/mice-official.jpg', 'Groupes & corporate', 'Une relation simplifiée pour les demandes récurrentes.', 'Corporate'],
]

export default function LoyaltyPage({ t, lang }) {
  const [title, text] = t.pages.loyalty
  const allCopy = getInteriorCopy(lang)
  const copy = allCopy.loyalty
  const localizedGallery = loyaltyGallery.map(([image], index) => ({ image, title: copy.benefits[index]?.[1] || copy.galleryLabel, text: copy.benefits[index]?.[2] || copy.introText }))
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-loyalty-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/legacy/sea-suite.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/contact', label: t.nav.contact }} t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">{copy.introLabel}</span>
          <h2>{copy.introTitle}</h2>
        </div>
        <div className="gm-rich-copy">
          <p>{copy.introText}</p>
        </div>
      </section>

      <section className="gm-loyalty-ledger gm-page-section" aria-label={copy.introTitle}>
        {copy.benefits.map(([label, benefit, body], index) => (
          <article className="gm-reveal" style={{ '--delay': `${index * 60}ms` }} key={benefit}>
            <span>{label}</span>
            <h3>{benefit}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="gm-loyalty-gallery gm-page-section" aria-label={copy.galleryAria}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.galleryLabel}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={localizedGallery} label={copy.galleryAria} t={t} lang={lang} />
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label={t.common.directBooking}>
        {allCopy.benefits.map(([benefit, body]) => <article className="gm-reveal" key={benefit}><strong>{benefit}</strong><span>{body}</span></article>)}
      </section>

      <section className="gm-final gm-final--compact">
        <span className="gm-label">{copy.finalLabel}</span>
        <h2>{copy.finalTitle}</h2>
        <p>{copy.finalText}</p>
        <div className="gm-actions"><Link to="/contact?request=loyalty#contact-form" className="gm-button gm-button--primary">{copy.activate}</Link></div>
      </section>
    </div>
  )
}
