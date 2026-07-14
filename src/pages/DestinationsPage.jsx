import { useState } from 'react'
import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { destinations, hotels } from '../data/siteData'
import { destinationGuides } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

const filters = [
  { key: 'all', label: 'Toutes', match: () => true },
  { key: 'marrakech', label: 'Marrakech', match: (destination) => destination.slug === 'marrakech' },
  { key: 'ocean', label: 'Océan', match: (destination) => /agadir|essaouira|tanger/i.test(destination.slug) },
  { key: 'business', label: 'Business', match: (destination) => destination.experiences.some((item) => /business|mice|corporate/i.test(item)) },
  { key: 'family', label: 'Famille', match: (destination) => destination.experiences.some((item) => /famille|aqua|loisirs/i.test(item)) },
]

export default function DestinationsPage({ t, lang }) {
  const [title, text] = t.pages.destinations
  const [activeSlug, setActiveSlug] = useState('marrakech')
  const [activeFilter, setActiveFilter] = useState('all')
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const activeDestination = destinations.find((destination) => destination.slug === activeSlug) || destinations[0]
  const activeGuide = destinationGuides[activeDestination.slug]
  const activeHotels = hotels.filter((hotel) => hotel.destination === activeDestination.name)
  const selectedFilter = filters.find((filter) => filter.key === activeFilter) || filters[0]
  const visibleDestinations = destinations.filter((destination) => selectedFilter.match(destination))
  const activeAttractions = activeGuide?.attractions?.slice(0, 4) || []

  return (
    <div className="gm-page gm-destinations-page gm-destinations-page--calm">
      <PageHero eyebrow="Nos destinations" title={title} text={text} image="/assets/official/dest-marrakech-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

      <section className="gm-destination-lounge gm-page-section" aria-label="Explorer les destinations Mogador">
        <div className="gm-destination-lounge__intro gm-reveal">
          <span className="gm-label">Le Maroc Mogador</span>
          <h2>Cinq destinations, une lecture simple.</h2>
          <p>Un parcours volontairement plus calme: choisir une ville, comprendre son ambiance, puis accéder directement aux hôtels disponibles.</p>
        </div>

        <div className="gm-destination-filterbar gm-reveal" aria-label="Filtrer les destinations">
          {filters.map((filter) => (
            <button className={filter.key === activeFilter ? 'is-active' : ''} type="button" onClick={() => setActiveFilter(filter.key)} key={filter.key}>
              {filter.label}
            </button>
          ))}
        </div>

        <div className="gm-destination-lounge__grid">
          <aside className="gm-destination-menu gm-reveal" aria-label="Choisir une destination">
            {visibleDestinations.map((destination) => (
              <button className={destination.slug === activeDestination.slug ? 'is-active' : ''} type="button" onClick={() => setActiveSlug(destination.slug)} key={destination.slug}>
                <span>{String(destination.hotels).padStart(2, '0')} hôtel{destination.hotels > 1 ? 's' : ''}</span>
                <strong>{destination.name}</strong>
              </button>
            ))}
          </aside>

          <article className="gm-destination-feature gm-reveal" key={activeDestination.slug}>
            <figure>
              <img src={activeGuide?.image || activeDestination.image} alt={activeDestination.name} loading="eager" />
            </figure>
            <div>
              <span className="gm-label">{activeDestination.experiences.slice(0, 3).join(' / ')}</span>
              <h2>{activeDestination.name}</h2>
              <h3>{activeGuide?.title || activeDestination.text}</h3>
              {(activeGuide?.intro || [activeDestination.text]).slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="gm-keyword-line">{activeDestination.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
              <div className="gm-actions">
                <Link className="gm-button gm-button--primary" to="/#reservation">Réserver cette destination</Link>
                <Link className="gm-button gm-button--secondary-dark" to="/hotels">Voir les hôtels</Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="gm-destination-hotels gm-page-section" aria-label={`Hôtels Mogador à ${activeDestination.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Hôtels associés</span>
          <h2>Séjourner à {activeDestination.name}</h2>
        </div>
        <div className="gm-destination-hotels__rail gm-reveal">
          {activeHotels.map((hotel) => (
            <Link className="gm-destination-hotel-card" to={`/hotels/${hotel.slug}`} key={hotel.slug}>
              <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
              <div><span>{hotel.category}</span><strong>{hotel.name}</strong><p>{hotel.baseline}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-destination-attractions gm-page-section" aria-label={`À voir à ${activeDestination.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">À vivre sur place</span>
          <h2>Repères utiles sans surcharge visuelle.</h2>
        </div>
        <div className="gm-destination-attractions__grid">
          {activeAttractions.map(([name, description, image], index) => {
            const attractionImage = image || activeGuide?.attractionImages?.[index] || activeGuide?.image || activeDestination.image
            return (
              <article className="gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={name}>
                <img src={attractionImage} alt={name} loading="lazy" />
                <div><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><p>{description}</p></div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-destination-index gm-page-section" aria-label="Toutes les destinations Mogador">
        {destinations.map((destination) => {
          const guide = destinationGuides[destination.slug]
          return (
            <button className={destination.slug === activeDestination.slug ? 'is-active' : ''} type="button" onClick={() => setActiveSlug(destination.slug)} key={destination.slug}>
              <img src={guide?.image || destination.image} alt="" loading="lazy" />
              <span>{destination.hotels} hôtel{destination.hotels > 1 ? 's' : ''}</span>
              <strong>{destination.name}</strong>
            </button>
          )
        })}
      </section>
    </div>
  )
}
