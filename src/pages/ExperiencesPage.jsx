import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { brandMoments, experiences } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

const experienceVisuals = {
  'Bien-être': {
    image: '/assets/official/spa-official.jpg',
    label: 'Spa, hammam & soins',
    text: 'Hammams, massages, piscines intérieures et rituels de détente inspirés de l’art de vivre marocain.',
  },
  Gastronomie: {
    image: '/assets/official/restaurant-official.jpg',
    label: 'Tables & salons',
    text: 'Cuisine marocaine, inspirations internationales, salons de thé et instants gourmands à composer selon le séjour.',
  },
  Loisirs: {
    image: '/assets/legacy/agadir-pool.jpg',
    label: 'Piscines & loisirs',
    text: 'Resorts, piscines, Aqua Fun et adresses pensées pour des séjours fluides avec enfants et proches.',
  },
  'Expériences locales': {
    image: '/assets/official/dest-marrakech-official.jpg',
    label: 'Destinations & patrimoine',
    text: 'Marrakech, Casablanca, Tanger, Agadir et Essaouira comme portes d’entrée vers le Maroc vivant.',
  },
}

const fallbackExperienceImages = [
  '/assets/official/spa-official.jpg',
  '/assets/official/restaurant-official.jpg',
  '/assets/legacy/agadir-pool.jpg',
  '/assets/official/dest-marrakech-official.jpg',
]

const experienceGallery = [
  ['/assets/official/spa-official.jpg', 'Bien-être', 'Hammam, massage, piscine intérieure et rituels de détente'],
  ['/assets/official/restaurant-official.jpg', 'Gastronomie', 'Tables marocaines, salons de thé et moments gourmands'],
  ['/assets/legacy/agadir-pool.jpg', 'Loisirs', 'Piscines, Aqua Fun, familles et lumière de vacances'],
  ['/assets/official/dest-marrakech-official.jpg', 'Culture', 'Médinas, patrimoine, palmeraies et destinations vivantes'],
  ['/assets/legacy/sea-pool.jpg', 'Évasion', 'Vue mer, respiration méditerranéenne et parenthèse sensorielle'],
]

export default function ExperiencesPage({ t, lang }) {
  const [title, text] = t.pages.experiences
  const copy = getInteriorCopy(lang).experiences
  const localizedGallery = experienceGallery.map(([image], index) => [image, copy.cards[index % copy.cards.length][1], copy.cards[index % copy.cards.length][2]])
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-experiences-page">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/official/spa-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-brand-moments" aria-label={copy.officialAria}>
        {copy.brandMoments.map(([label, title, body], index) => (
          <article className={`gm-story-row ${index % 2 ? 'gm-story-row--reverse' : ''} gm-reveal`} key={title}>
            <figure><img src={brandMoments[index].image} alt={title} loading="lazy" /></figure>
            <div>
              <span className="gm-label">{label}</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="gm-page-section gm-experience-index" aria-label={copy.category}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.category}</span>
          <h2>{copy.categoryTitle}</h2>
        </div>
        <div className="gm-experience-index__grid gm-experience-index__grid--visual">
          {experiences.map((experience, index) => (
            <article id={experience.slug} className="gm-experience-card gm-reveal gm-depth-object" style={{ '--delay': `${index * 70}ms` }} key={experience.slug}>
              <figure>
                <img src={(experienceVisuals[experience.title]?.image || fallbackExperienceImages[index])} alt={experience.title} loading="lazy" />
              </figure>
              <div>
                <Icon name={index === 0 ? 'spa' : index === 1 ? 'dining' : index === 2 ? 'leisure' : 'local'} />
                <span>{copy.cards[index]?.[0] || experienceVisuals[experience.title]?.label}</span>
                <h3>{copy.cards[index]?.[1] || experience.title}</h3>
                <p>{copy.cards[index]?.[2] || experience.text}</p>
                <div className="gm-keyword-line">{(lang === 'fr' ? experience.moments : copy.cards[index].slice(0, 2)).map((moment) => <span key={moment}>{moment}</span>)}</div>
                <Link to="/#reservation">{copy.book}</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-offer-gallery gm-experience-gallery gm-page-section" aria-label={copy.galleryLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.gallery}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={localizedGallery} label={copy.galleryLabel} t={t} lang={lang} />
      </section>
    </div>
  )
}
