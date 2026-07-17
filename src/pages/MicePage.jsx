import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { hotels, mice } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'
import { translateDestinationName, translateHotelLabel } from '../i18n/hotelLabels'

const businessRows = [
  {
    title: 'Un réseau pour travailler, recevoir et rassembler',
    image: '/assets/official/business-space-official.jpg',
    paragraphs: [
      'Au-delà de l’accès à des destinations attractives comme Marrakech, Casablanca, Tanger, Agadir et Essaouira, Mogador réunit salles équipées, espaces modulables, hébergement, restauration et accompagnement dédié.',
      'Nos équipes vous aident à choisir le cadre idéal, le format juste et le programme le plus fluide pour vos participants.',
    ],
  },
  {
    title: 'Des événements de 10 à 5 000 invités',
    image: '/assets/official/mice-official.jpg',
    paragraphs: [
      'Du comité de direction au symposium, la demande est étudiée selon la capacité, le calendrier, la technique, les pauses et la restauration.',
      'Petites salles, sous-commissions, plénières et espaces combinables permettent d’adapter la configuration au nombre de participants.',
    ],
  },
  {
    title: 'Le Grand Palais des Congrès Agdal',
    image: '/assets/official/agdal-space-official.jpg',
    paragraphs: [
      'Avec une capacité d’accueil majeure à Marrakech, le Grand Palais des Congrès Agdal s’impose comme une adresse incontournable pour les événements nationaux et internationaux.',
      'Sa situation, ses volumes, ses infrastructures et ses espaces modulables permettent de recevoir conventions, salons, congrès, lancements et rencontres d’envergure.',
    ],
  },
]

const seminarLocations = hotels
  .filter((hotel) => hotel.mice?.length)
  .slice(0, 4)

const miceGallery = [
  ['/assets/official/mice-official.jpg', 'Plénières', 'Organiser un congrès ou une convention à Marrakech'],
  ['/assets/official/agdal-space-official.jpg', 'Grand Palais', 'Composer un événement de grande capacité'],
  ['/assets/official/business-space-official.jpg', 'Réunions', 'Réserver une salle équipée et modulable'],
  ['/assets/official/restaurant-official.jpg', 'Réceptions', 'Ajouter cocktails, pauses gourmandes et dîners privés'],
  ['/assets/official/spa-official.jpg', 'Incentive', 'Associer travail, détente et expériences bien-être'],
]

export default function MicePage({ t, lang }) {
  const [title, text] = t.pages.mice
  const copy = getInteriorCopy(lang).mice
  const localizedGallery = miceGallery.map(([image], index) => [image, copy.eventTypes[index % copy.eventTypes.length], copy.galleryTitle])
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  const handleFinderSubmit = (event) => {
    event.preventDefault()
    const request = Object.fromEntries(new FormData(event.currentTarget))
    const query = new URLSearchParams({ request: 'mice', ...request })
    window.history.pushState({}, '', `/contact?${query.toString()}#contact-form`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="gm-page gm-mice-page gm-mice-page--seminar">
      <PageHero eyebrow={copy.eyebrow} title={title} text={text} image="/assets/official/mice-official.jpg" primary={{ to: '/contact?request=mice#contact-form', label: t.common.quoteMice }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

      <section className="gm-seminar-finder gm-page-section" aria-label={copy.finderTitle}>
        <div className="gm-seminar-finder__intro gm-reveal">
          <span className="gm-label">{copy.finderLabel}</span>
          <h2>{copy.finderTitle}</h2>
          <p>{copy.finderText}</p>
        </div>
        <form className="gm-seminar-search gm-reveal" onSubmit={handleFinderSubmit}>
          <label><span>{copy.destination}</span><select name="destination" defaultValue="Marrakech">{['Marrakech', 'Casablanca', 'Tanger', 'Agadir', 'Essaouira'].map((destination) => <option value={destination} key={destination}>{translateDestinationName(destination, lang)}</option>)}</select></label>
          <label><span>{copy.capacity}</span><select name="capacity" defaultValue={copy.capacities[2]}>{copy.capacities.map((capacity) => <option key={capacity}>{capacity}</option>)}</select></label>
          <label><span>{copy.format}</span><select name="eventFormat" defaultValue={copy.formats[0]}>{copy.formats.map((format) => <option key={format}>{format}</option>)}</select></label>
          <button className="gm-button gm-button--primary" type="submit">{copy.quote}</button>
        </form>
      </section>

      <section id="palais" className="gm-mice-command gm-page-section">
        <div>
          <span className="gm-label">{copy.commandLabel}</span>
          <h2>{copy.commandTitle}</h2>
          <p>{copy.commandText}</p>
          <Link className="gm-button gm-button--primary" to="/contact">{t.common.quoteMice}</Link>
        </div>
        <div className="gm-mice-command__stats">
          {mice.stats.map((stat, index) => <article key={stat.label}><strong>{stat.value}</strong><span>{copy.stats[index] || stat.label}</span></article>)}
        </div>
      </section>

      <section className="gm-seminar-editorial gm-page-section" aria-label={copy.editorialLabel}>
        <div className="gm-reveal">
          <span className="gm-label">{copy.editorialLabel}</span>
          <h2>{copy.editorialTitle}</h2>
        </div>
        <div className="gm-reveal">
          {copy.editorial.map((paragraph, index) => <p key={paragraph}>{index === copy.editorial.length - 1 ? <strong>{paragraph}</strong> : paragraph}</p>)}
        </div>
      </section>

      <section className="gm-seminar-types gm-page-section" aria-label={copy.offerLabel}>
        {copy.types.map(([type, body], index) => (
          <article className="gm-reveal" style={{ '--delay': `${index * 80}ms` }} key={type}>
            <h3>{type}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="gm-seminar-offer gm-page-section" aria-label={copy.offerLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.offerLabel}</span>
          <h2>{copy.offerTitle}</h2>
        </div>
        <div className="gm-seminar-offer__grid">
          {copy.offers.map(([item, body], index) => (
            <article className="gm-reveal" style={{ '--delay': `${index * 55}ms` }} key={item}>
              <h3>{item}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-business-sections" aria-label={copy.commandLabel}>
        {copy.rows.map(([sectionTitle, ...paragraphs], index) => (
          <article className={`gm-business-row ${index % 2 ? 'gm-business-row--reverse' : ''} gm-reveal`} key={sectionTitle}>
            <figure><img src={businessRows[index].image} alt={sectionTitle} loading="lazy" /></figure>
            <div>
              <h2>{sectionTitle}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </section>

      <section className="gm-seminar-venues gm-page-section" aria-label={copy.venuesLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.venuesLabel}</span>
          <h2>{copy.venuesTitle}</h2>
          <Link to="/hotels">{copy.venuesLink}</Link>
        </div>
        <div className="gm-seminar-venues__grid">
          {seminarLocations.map((hotel, index) => (
            <article className="gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={hotel.slug}>
              <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
              <div>
                <span>{translateDestinationName(hotel.destination, lang)}</span>
                <h3>{hotel.name}</h3>
                <ul>{hotel.mice.slice(0, 3).map((item) => <li key={item}>{translateHotelLabel(item, lang)}</li>)}</ul>
                <div><Link to={`/hotels/${hotel.slug}`}>{copy.viewVenue}</Link><Link to={`/contact?request=mice&hotel=${encodeURIComponent(hotel.name)}&destination=${encodeURIComponent(hotel.destination)}#contact-form`}>{copy.quote}</Link></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-page-section gm-event-types" aria-label={copy.eventLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.eventLabel}</span>
          <h2>{copy.eventTitle}</h2>
        </div>
        <div className="gm-feature-list gm-feature-list--large gm-reveal">
          {copy.eventTypes.map((type) => <span key={type}>{type}</span>)}
        </div>
      </section>

      <section className="gm-seminar-faq gm-page-section" aria-label={copy.faqLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.faqLabel}</span>
          <h2>{copy.faqTitle}</h2>
        </div>
        <div className="gm-seminar-faq__list">
          {copy.faq.map(([question, answer]) => <details className="gm-reveal" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="gm-seminar-human gm-page-section" aria-label={copy.humanLabel}>
        <div className="gm-reveal">
          <span className="gm-label">{copy.humanLabel}</span>
          <h2>{copy.humanTitle}</h2>
          <p>{copy.humanText}</p>
          <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/contact?request=mice#contact-form">{copy.send}</Link><a className="gm-button gm-button--secondary-dark" href="tel:+212530530520">{copy.call}</a></div>
        </div>
        <figure className="gm-reveal"><img src="/assets/official/team-official.jpg" alt="Équipe Mogador" loading="lazy" /></figure>
      </section>

      <section className="gm-offer-gallery gm-mice-gallery gm-page-section" aria-label={copy.galleryLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.gallery}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={localizedGallery} label={copy.galleryLabel} t={t} lang={lang} />
      </section>
    </div>
  )
}
