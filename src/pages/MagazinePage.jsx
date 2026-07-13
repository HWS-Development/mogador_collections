import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { magazineArticles } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

const articleVisuals = {
  'hotel-marrakech-sejour-famille': {
    image: '/assets/legacy/agadir-pool.jpg',
    kicker: 'Famille',
    read: '4 min',
    body: 'Piscines, chambres adaptées, distances, restauration et rythme de séjour: les bons critères transforment les vacances en expérience fluide pour les parents comme pour les enfants.',
  },
  'hotel-luxe-maroc-experience': {
    image: '/assets/legacy/sea-suite.jpg',
    kicker: 'Luxe marocain',
    read: '5 min',
    body: 'Le luxe se ressent dans la précision du service, la douceur de la lumière, la qualité du repos et la capacité d’un lieu à créer un souvenir durable.',
  },
  'mice-marrakech-palais-congres': {
    image: '/assets/official/mice-official.jpg',
    kicker: 'MICE',
    read: '6 min',
    body: 'Capacités, modularité, accès, hébergement et accompagnement technique: Marrakech devient une réponse solide pour les événements corporate ambitieux.',
  },
  'experiences-locales-mogador': {
    image: '/assets/official/restaurant-official.jpg',
    kicker: 'Expériences',
    read: '4 min',
    body: 'Gastronomie, bien-être, médinas, océan et hospitalité marocaine donnent de la profondeur à un séjour et déclenchent l’envie de réserver.',
  },
}

const magazineGallery = [
  ['/assets/official/dest-marrakech-official.jpg', 'Marrakech', 'Cité impériale, lumière chaude et séjours famille.'],
  ['/assets/official/spa-official.jpg', 'Bien-être', 'Hammam, soins et respiration sensorielle.'],
  ['/assets/official/mice-official.jpg', 'MICE', 'Grand Palais, séminaires et congrès.'],
  ['/assets/official/dest-essaouira-official.jpg', 'Essaouira', 'Océan, culture et parenthèse authentique.'],
  ['/assets/official/restaurant-official.jpg', 'Gastronomie', 'Saveurs marocaines et tables généreuses.'],
]

export default function MagazinePage({ t, lang }) {
  const [title, text] = t.pages.magazine
  const [featured, ...articles] = magazineArticles
  const featuredVisual = articleVisuals[featured.slug]
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-magazine-page">
      <PageHero eyebrow="Magazine" title={title} text={text} image="/assets/official/dest-essaouira-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-magazine-feature gm-page-section" aria-label="Article à la une Mogador">
        <figure>
          <img src={featuredVisual.image} alt={featured.title} loading="lazy" />
        </figure>
        <div>
          <span className="gm-label">À la une / {featuredVisual.read}</span>
          <h2>{featured.title}</h2>
          <p>{featuredVisual.body}</p>
          <div className="gm-keyword-line">{featured.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
          <div className="gm-actions">
            <Link className="gm-button gm-button--primary" to="/#reservation" data-track="magazine_feature_booking">Réserver ce séjour</Link>
            <Link className="gm-button gm-button--secondary-dark" to="/destinations" data-track="magazine_feature_destinations">Explorer les destinations</Link>
          </div>
        </div>
      </section>

      <section className="gm-editorial-grid gm-page-section" aria-label="Articles magazine Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Guides & inspirations</span>
          <h2>Des contenus qui donnent envie, rassurent et ramènent vers la réservation.</h2>
        </div>
        <div className="gm-editorial-grid__cards">
          {articles.map((article, index) => {
            const visual = articleVisuals[article.slug]
            return (
              <article className="gm-editorial-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={article.slug}>
                <img src={visual.image} alt={article.title} loading="lazy" />
                <div>
                  <span>{visual.kicker} / {visual.read}</span>
                  <h3>{article.title}</h3>
                  <p>{visual.body}</p>
                  <div className="gm-keyword-line">{article.keywords.map((keyword) => <small key={keyword}>{keyword}</small>)}</div>
                  <Link to="/#reservation" data-track={`magazine_article_booking_${article.slug}`}>Préparer ce séjour</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-magazine-gallery gm-page-section" aria-label="Galerie inspiration Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Carnet visuel</span>
          <h2>Le Maroc Mogador en images, par envies de séjour.</h2>
        </div>
        <div className="gm-magazine-gallery__grid">
          {magazineGallery.map(([image, label, body], index) => (
            <figure className={`gm-magazine-gallery__item gm-magazine-gallery__item--${index + 1} gm-reveal`} key={label}>
              <img src={image} alt={label} loading="eager" decoding="async" fetchPriority={index < 2 ? 'high' : 'auto'} />
              <figcaption><strong>{label}</strong><span>{body}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
