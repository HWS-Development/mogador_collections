import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { destinations, hotels } from '../data/siteData'
import { destinationGuides } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function DestinationsPage({ t, lang }) {
  const [title, text] = t.pages.destinations
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-destinations-page">
      <PageHero eyebrow="Nos destinations" title={title} text={text} image="/assets/official/dest-marrakech-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">Ancien site officiel</span>
          <h2>Les cinq destinations sont reconstruites avec leurs textes, attractions et hôtels associés.</h2>
        </div>
        <div className="gm-rich-copy">
          <p>La page liste les destinations comme un guide de séjour, pas comme une mosaïque décorative. Chaque ville garde son contenu touristique officiel et ses liens vers les établissements Mogador.</p>
        </div>
      </section>

      <section className="gm-destination-guides" aria-label="Guides destinations Mogador">
        {destinations.map((destination, index) => {
          const guide = destinationGuides[destination.slug]
          const destinationHotels = hotels.filter((hotel) => hotel.destination === destination.name)
          return (
            <article id={destination.slug} className={`gm-destination-guide ${index % 2 ? 'gm-destination-guide--reverse' : ''} gm-reveal`} style={{ '--delay': `${index * 80}ms` }} key={destination.slug}>
              <figure><img src={guide?.image || destination.image} alt={destination.name} loading="lazy" /></figure>
              <div className="gm-destination-guide__body">
                <span className="gm-label">{String(index + 1).padStart(2, '0')} / {destination.hotels} hôtel{destination.hotels > 1 ? 's' : ''}</span>
                <h2>{destination.name}</h2>
                <h3>{guide?.title || destination.text}</h3>
                {(guide?.intro || [destination.text]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <div className="gm-keyword-line">{destination.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                <div className="gm-inline-links">
                  {destinationHotels.map((hotel) => <Link key={hotel.slug} to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>)}
                </div>
              </div>
              {guide?.attractions?.length ? (
                <div className="gm-attraction-grid">
                  {guide.attractions.map(([name, description, image], attractionIndex) => {
                    const attractionImage = image || guide.attractionImages?.[attractionIndex] || guide.image || destination.image

                    return (
                    <section key={name}>
                      <div className="gm-attraction-grid__media">
                        <img src={attractionImage} alt={name} loading="lazy" />
                      </div>
                      <h4>{name}</h4>
                      <p>{description}</p>
                    </section>
                    )
                  })}
                  {guide.source ? <small>{guide.source}</small> : null}
                </div>
              ) : null}
            </article>
          )
        })}
      </section>
    </div>
  )
}
