import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { brandMoments, experiences } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

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
  ['https://u.profitroom.pl/2020-mogadorhotels-com/thumb/0x900/uploads/Tanger/Piscinecouverte2.jpg', 'Évasion', 'Vue mer, respiration méditerranéenne et parenthèse sensorielle'],
]

export default function ExperiencesPage({ t, lang }) {
  const [title, text] = t.pages.experiences
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-experiences-page">
      <PageHero eyebrow="Expériences" title={title} text={text} image="/assets/official/spa-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-brand-moments" aria-label="Expériences officielles Mogador">
        {brandMoments.map((moment, index) => (
          <article className={`gm-story-row ${index % 2 ? 'gm-story-row--reverse' : ''} gm-reveal`} key={moment.title}>
            <figure><img src={moment.image} alt={moment.title} loading="lazy" /></figure>
            <div>
              <span className="gm-label">{moment.label}</span>
              <h2>{moment.title}</h2>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="gm-page-section gm-experience-index" aria-label="Catégories d’expériences">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Catégories</span>
          <h2>Des portes d’entrée orientées séjour, pas des cartes interchangeables.</h2>
        </div>
        <div className="gm-experience-index__grid gm-experience-index__grid--visual">
          {experiences.map((experience, index) => (
            <article className="gm-experience-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={experience.slug}>
              <figure>
                <img src={(experienceVisuals[experience.title]?.image || fallbackExperienceImages[index])} alt={experience.title} loading="lazy" />
              </figure>
              <div>
                <Icon name={index === 0 ? 'spa' : index === 1 ? 'dining' : index === 2 ? 'leisure' : 'local'} />
                <span>{experienceVisuals[experience.title]?.label || 'Moment Mogador'}</span>
                <h3>{experience.title}</h3>
                <p>{experienceVisuals[experience.title]?.text || experience.text}</p>
                <div className="gm-keyword-line">{experience.moments.map((moment) => <span key={moment}>{moment}</span>)}</div>
                <Link to="/#reservation">Réserver une expérience</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-offer-gallery gm-experience-gallery gm-page-section" aria-label="Galerie expériences Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Galerie</span>
          <h2>Bien-être, gastronomie et moments de vie à composer autour du séjour.</h2>
        </div>
        <GallerySlider items={experienceGallery} label="Galerie expériences Mogador" />
      </section>
    </div>
  )
}
