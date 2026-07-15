import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import SignatureExperience from '../components/SignatureExperience'
import Link from '../router/Link'
import { magazineArticles } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

const articleVisuals = {
  'hotel-marrakech-sejour-famille': {
    image: '/assets/legacy/agadir-pool.jpg',
    kicker: 'Famille',
    read: '4 min',
    body: 'Piscines, chambres adaptées, distances, restauration et rythme de séjour: les bons critères facilitent les vacances des parents comme des enfants.',
  },
  'hotel-luxe-maroc-experience': {
    image: '/assets/legacy/sea-suite.jpg',
    kicker: 'Luxe marocain',
    read: '5 min',
    body: 'Service attentif, qualité du repos, équipements et hospitalité marocaine font partie des critères d’un séjour haut de gamme.',
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
    body: 'Gastronomie, bien-être, médinas, océan et hospitalité marocaine accompagnent votre séjour dans les destinations Mogador.',
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

      <SignatureExperience variant="destinations" title="Guides et inspirations pour préparer votre séjour Mogador." text="Retrouvez des idées de destinations, de séjours famille, de bien-être, d’événements et d’escapades au Maroc." cta="/destinations" />

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
          <h2>Des guides pour choisir votre destination et votre hôtel.</h2>
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
          <h2>Le Maroc Mogador en images.</h2>
        </div>
        <GallerySlider items={magazineGallery} label="Galerie inspiration Mogador" />
      </section>
    </div>
  )
}
