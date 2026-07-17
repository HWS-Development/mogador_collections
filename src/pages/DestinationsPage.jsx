import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { destinations, hotels } from '../data/siteData'
import { destinationGuides } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'
import { translateHotelLabel } from '../i18n/hotelLabels'

const filters = [
  { key: 'all', label: 'Toutes', match: () => true },
  { key: 'marrakech', label: 'Marrakech', match: (destination) => destination.slug === 'marrakech' },
  { key: 'ocean', label: 'Océan', match: (destination) => /agadir|essaouira|tanger/i.test(destination.slug) },
  { key: 'business', label: 'Business', match: (destination) => destination.experiences.some((item) => /business|mice|corporate/i.test(item)) },
  { key: 'family', label: 'Famille', match: (destination) => destination.experiences.some((item) => /famille|aqua|loisirs/i.test(item)) },
]

const legacyDestinationPaths = {
  '/fr/agadir-page-275256': 'agadir',
  '/fr/casablanca-page-275258': 'casablanca',
  '/fr/essaouira-page-275260': 'essaouira',
  '/fr/marrakech-page-275262': 'marrakech',
  '/fr/tanger-page-275264': 'tanger',
  '/our-destinations/agadir': 'agadir',
  '/our-destinations/casablanca': 'casablanca',
  '/our-destinations/essaouira': 'essaouira',
  '/our-destinations/marrakech': 'marrakech',
  '/our-destinations/tanger': 'tanger',
}

export default function DestinationsPage({ t, lang, routeLocation }) {
  const [title, text] = t.pages.destinations
  const copy = getInteriorCopy(lang).destinations
  const [activeSlug, setActiveSlug] = useState('marrakech')
  const [activeFilter, setActiveFilter] = useState('all')
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const activeDestination = destinations.find((destination) => destination.slug === activeSlug) || destinations[0]
  const activeGuide = destinationGuides[activeDestination.slug]
  const activeHotels = hotels.filter((hotel) => hotel.destination === activeDestination.name)
  const selectedFilter = filters.find((filter) => filter.key === activeFilter) || filters[0]
  const visibleDestinations = destinations.filter((destination) => selectedFilter.match(destination))
  const localizedGuide = copy.content[activeDestination.slug]
  const activeAttractions = localizedGuide?.attractions || []
  const displayName = getDestinationName(activeDestination, lang)
  const destinationTags = getDestinationTags(activeDestination, lang)

  useEffect(() => {
    const slug = window.location.hash.replace('#', '') || legacyDestinationPaths[window.location.pathname]
    if (destinations.some((destination) => destination.slug === slug)) {
      setActiveFilter('all')
      setActiveSlug(slug)
    }
  }, [routeLocation])

  const selectFilter = (filter) => {
    const nextDestinations = destinations.filter((destination) => filter.match(destination))
    setActiveFilter(filter.key)
    if (!nextDestinations.some((destination) => destination.slug === activeSlug)) {
      setActiveSlug(nextDestinations[0]?.slug || destinations[0].slug)
    }
  }

  const selectDestination = (slug) => {
    setActiveSlug(slug)
    window.history.replaceState({}, '', `/destinations#${slug}`)
  }

  return (
    <div className="gm-page gm-destinations-page gm-destinations-page--calm">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/official/dest-marrakech-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

      <section className="gm-destination-lounge gm-page-section" aria-label={copy.chooseAria}>
        <div className="gm-destination-lounge__intro gm-reveal">
          <span className="gm-label">{copy.label}</span>
          <h2>{copy.title}</h2>
          <p>{copy.text}</p>
        </div>

        <div className="gm-destination-filterbar gm-reveal" aria-label={copy.filterAria}>
          {filters.map((filter) => (
            <button className={filter.key === activeFilter ? 'is-active' : ''} type="button" aria-pressed={filter.key === activeFilter} onClick={() => selectFilter(filter)} key={filter.key}>
              {copy.filters.find(([key]) => key === filter.key)?.[1] || filter.label}
            </button>
          ))}
        </div>

        <div className="gm-destination-lounge__grid">
          <aside className="gm-destination-menu" aria-label={copy.chooseAria}>
            {visibleDestinations.map((destination) => (
              <button id={destination.slug} className={destination.slug === activeDestination.slug ? 'is-active' : ''} type="button" aria-pressed={destination.slug === activeDestination.slug} onClick={() => selectDestination(destination.slug)} key={destination.slug}>
                <span>{destination.hotels} {destination.hotels > 1 ? copy.pluralHotels : copy.singularHotel}</span>
                <strong>{getDestinationName(destination, lang)}</strong>
              </button>
            ))}
          </aside>

          <article className="gm-destination-feature gm-reveal gm-depth-object" key={activeDestination.slug}>
            <figure>
              <img src={activeGuide?.image || activeDestination.image} alt={displayName} loading="eager" />
            </figure>
            <div>
              <span className="gm-label">{destinationTags.slice(0, 3).join(' / ')}</span>
              <h2>{displayName}</h2>
              <h3>{localizedGuide?.title || activeGuide?.title || activeDestination.text}</h3>
              {(localizedGuide?.intro || activeGuide?.intro || [activeDestination.text]).slice(0, 2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="gm-keyword-line">{destinationTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="gm-actions">
                <Link className="gm-button gm-button--primary" to="/#reservation" data-destination={activeDestination.name}>{copy.book}</Link>
                <Link className="gm-button gm-button--secondary-dark" to="/hotels">{copy.seeHotels}</Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="gm-destination-hotels gm-page-section" aria-label={`${copy.associated}: ${displayName}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.associated}</span>
          <h2>{copy.stay.replace('{destination}', displayName)}</h2>
        </div>
        <div className="gm-destination-hotels__rail gm-reveal">
          {activeHotels.map((hotel) => (
            <Link className="gm-destination-hotel-card" to={`/hotels/${hotel.slug}`} key={hotel.slug}>
              <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
              <div><span>{translateHotelLabel(hotel.category, lang)}</span><strong>{hotel.name}</strong><p>{lang === 'fr' ? hotel.baseline : t.pages.hotel[1]}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-destination-attractions gm-page-section" aria-label={`${copy.live}: ${displayName}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.live}</span>
          <h2>{copy.discover}</h2>
        </div>
        <div className="gm-destination-attractions__grid">
          {activeAttractions.map(([name, description, image], index) => {
            const attractionImage = activeGuide?.attractions?.[index]?.[2] || activeGuide?.attractionImages?.[index] || activeGuide?.image || activeDestination.image
            return (
              <article className="gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={name}>
                <img src={attractionImage} alt={name} loading="lazy" />
                <div><h3>{name}</h3><p>{description}</p></div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="gm-destination-index gm-page-section" aria-label={copy.all}>
        {destinations.map((destination) => {
          const guide = destinationGuides[destination.slug]
          return (
             <button className={destination.slug === activeDestination.slug ? 'is-active' : ''} type="button" aria-pressed={destination.slug === activeDestination.slug} onClick={() => selectDestination(destination.slug)} key={destination.slug}>
              <img src={guide?.image || destination.image} alt="" loading="lazy" />
              <span>{destination.hotels} {destination.hotels > 1 ? copy.pluralHotels : copy.singularHotel}</span>
              <strong>{getDestinationName(destination, lang)}</strong>
            </button>
          )
        })}
      </section>
    </div>
  )
}

function getDestinationName(destination, lang) {
  if (lang !== 'ar') return destination.name
  return { marrakech: 'مراكش', casablanca: 'الدار البيضاء', tanger: 'طنجة', agadir: 'أكادير', essaouira: 'الصويرة' }[destination.slug] || destination.name
}

function getDestinationTags(destination, lang) {
  if (lang === 'fr') return destination.experiences
  const tags = {
    en: {
      marrakech: ['Family stays', 'Wellness', 'Meetings', 'Dining'],
      casablanca: ['Business', 'Marina', 'Dining', 'City break'],
      tanger: ['Sea view', 'Leisure', 'Couples', 'Escape'],
      agadir: ['Marina', 'Family', 'Ocean', 'Relaxation'],
      essaouira: ['Riad', 'Culture', 'Ocean', 'Local life'],
    },
    ar: {
      marrakech: ['إقامات عائلية', 'العافية', 'الفعاليات', 'المذاقات'],
      casablanca: ['الأعمال', 'المارينا', 'المذاقات', 'إقامة حضرية'],
      tanger: ['إطلالة بحرية', 'الترفيه', 'الأزواج', 'الاسترخاء'],
      agadir: ['المارينا', 'العائلة', 'المحيط', 'الراحة'],
      essaouira: ['رياض', 'الثقافة', 'المحيط', 'الحياة المحلية'],
    },
  }
  return tags[lang]?.[destination.slug] || destination.experiences
}
