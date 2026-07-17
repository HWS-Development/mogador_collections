import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { magazineArticles } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

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
  const copy = getInteriorCopy(lang).magazine
  const [featured, ...articles] = magazineArticles
  const featuredVisual = articleVisuals[featured.slug]
  const featuredCopy = copy.articles[0]
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-magazine-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/official/dest-essaouira-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-magazine-feature gm-page-section" aria-label={copy.featured}>
        <figure>
          <img src={featuredVisual.image} alt={featuredCopy[2]} loading="lazy" />
        </figure>
        <div>
          <span className="gm-label">{copy.featured} / {featuredCopy[1]}</span>
          <h2>{featuredCopy[2]}</h2>
          <p>{featuredCopy[3]}</p>
          <div className="gm-keyword-line">{(lang === 'fr' ? featured.keywords : [featuredCopy[0], title]).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
          <div className="gm-actions">
            <Link className="gm-button gm-button--primary" to="/#reservation" data-track="magazine_feature_booking">{copy.book}</Link>
            <Link className="gm-button gm-button--secondary-dark" to="/destinations" data-track="magazine_feature_destinations">{copy.explore}</Link>
          </div>
        </div>
      </section>

      <section className="gm-editorial-grid gm-page-section" aria-label={copy.guides}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.guides}</span>
          <h2>{copy.guidesTitle}</h2>
        </div>
        <div className="gm-editorial-grid__cards">
          {articles.map((article, index) => {
            const visual = articleVisuals[article.slug]
            const articleCopy = copy.articles[index + 1]
            return (
              <article className="gm-editorial-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={article.slug}>
                <img src={visual.image} alt={articleCopy[2]} loading="lazy" />
                <div>
                  <span>{articleCopy[0]} / {articleCopy[1]}</span>
                  <h3>{articleCopy[2]}</h3>
                  <p>{articleCopy[3]}</p>
                  <div className="gm-keyword-line">{(lang === 'fr' ? article.keywords : [articleCopy[0], title]).map((keyword) => <small key={keyword}>{keyword}</small>)}</div>
                  <Link to="/#reservation" data-track={`magazine_article_booking_${article.slug}`}>{copy.prepare}</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-magazine-gallery gm-page-section" aria-label={copy.galleryLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.gallery}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={magazineGallery} label={copy.galleryLabel} t={t} lang={lang} />
      </section>
    </div>
  )
}
