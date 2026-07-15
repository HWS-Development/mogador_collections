import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BookingBar from '../components/BookingBar'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { images } from '../data/images'
import { brand, brandMoments, destinations, hotels, mice, stats } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

gsap.registerPlugin(ScrollTrigger)

const serviceNames = ['Piscines', 'Restaurants', 'Bars', 'Spa', 'Fitness', 'Kids & loisirs', 'Business', 'Congrès']

const usageCards = [
  ['Dormir', 'Chambres, suites et appartements Mogador', 'Choisissez votre destination et consultez les hébergements disponibles pour un séjour confortable au Maroc.', images.legacy.menaraRoom, '/hotels', 'bed'],
  ['Se détendre', 'Spa, hammams, piscines et espaces bien-être', 'Profitez des espaces de détente Mogador selon les services disponibles dans chaque hôtel.', images.official.spa, '/experiences', 'spa'],
  ['Se réunir', 'Salles, congrès, séminaires et célébrations', 'Organisez vos réunions, lancements, congrès et événements avec les équipes Mogador.', images.official.mice, '/reunions-evenements', 'meeting'],
  ['Manger', 'Tables, salons et conversations qui durent', 'Des parfums marocains aux cuisines du monde, chaque table devient un prétexte pour rester un peu plus longtemps.', images.official.restaurant, '/experiences', 'dining'],
  ['Explorer', 'Cinq destinations Mogador au Maroc', 'Marrakech, Tanger, Casablanca, Agadir et Essaouira vous accueillent pour vos séjours loisirs, affaires et famille.', images.official.destinations.marrakech, '/destinations', 'local'],
]

const chapters = [
  {
    number: '01',
    kicker: 'Une histoire marocaine',
    title: 'Mogador Hotels & Resorts vous accueille au Maroc.',
    text: 'Le groupe réunit des hôtels urbains, des resorts, des adresses d’affaires et des lieux d’événements dans les principales destinations marocaines.',
    image: images.official.universe,
    to: '/hotels',
    cta: 'Découvrir le groupe',
  },
  {
    number: '02',
    kicker: 'Chambres, suites et resorts',
    title: 'Chambres, suites et appartements pour chaque séjour.',
    text: 'Selon l’adresse choisie, profitez de chambres confortables, de suites, d’appartements, de piscines, de restaurants et de services adaptés à votre voyage.',
    image: images.legacy.seaSuite,
    to: '/hotels',
    cta: 'Voir les hôtels',
  },
  {
    number: '03',
    kicker: 'Gastronomie et salons',
    title: 'La table devient le coeur battant du séjour.',
    text: 'Restaurants, salons, petits-déjeuners et moments de partage accompagnent votre séjour selon les services proposés dans chaque hôtel Mogador.',
    image: images.official.restaurant,
    to: '/experiences',
    cta: 'Découvrir les expériences',
  },
  {
    number: '04',
    kicker: 'Spa et détente',
    title: 'Le calme a une adresse, parfois une vapeur, parfois une piscine.',
    text: 'Hammams, soins, salles de massage, piscines intérieures ou extérieures et espaces fitness complètent l’expérience bien-être dans plusieurs adresses Mogador.',
    image: images.official.spa,
    to: '/experiences',
    cta: 'Préparer mon séjour',
  },
  {
    number: '05',
    kicker: 'Événements',
    title: 'Des espaces pour vos réunions, congrès et célébrations.',
    text: `${mice.text} Les équipes Mogador vous accompagnent dans l’organisation de vos événements professionnels et privés au Maroc.`,
    image: images.official.mice,
    to: '/reunions-evenements',
    cta: 'Planifier un événement',
  },
]

const emotionalProofs = [
  ['Réserver en direct', 'Un contact direct avec les équipes Mogador et un parcours officiel pour préparer votre séjour.'],
  ['Choisir votre destination', 'Marrakech, Casablanca, Tanger, Agadir et Essaouira réunies sur le site officiel Mogador.'],
  ['Préparer votre voyage', 'Hôtels, offres, expériences et événements accessibles depuis un même espace.'],
]

const intentCards = [
  ['Un séjour', 'Réserver un hôtel Mogador', 'Choisissez votre destination et consultez les hôtels disponibles pour votre prochain séjour.', '/hotels', 'Voir les hôtels'],
  ['Une offre', 'Consulter les offres officielles', 'Escapade, famille, affaires ou détente: retrouvez les offres disponibles sur le site officiel.', '/offres', 'Voir les offres'],
  ['Un événement', 'Organiser une réunion ou un événement', 'Séminaire, congrès, célébration ou lancement: les équipes Mogador vous accompagnent.', '/reunions-evenements', 'Demander un devis'],
  ['Un échange', 'Contacter Mogador', 'Une question, une arrivée spéciale ou un besoin précis: contactez directement nos équipes.', '/contact', 'Contacter'],
]

const constellation = [
  ['Marrakech', 'La ville rouge, les palais, les congrès, les jardins et l’énergie qui ne dort jamais.', images.official.destinations.marrakech, '/destinations#marrakech'],
  ['Tanger', 'La Méditerranée en ligne d’horizon, l’élégance Grand Mogador et le frisson du détroit.', images.official.destinations.tanger, '/destinations#tanger'],
  ['Agadir', 'Une lumière atlantique, des séjours faciles, la douceur d’un départ au soleil.', images.official.destinations.agadir, '/destinations#agadir'],
  ['Essaouira', 'Le vent, la pierre, le riad, l’océan: une halte pour ceux qui aiment les lieux avec une âme.', images.official.destinations.essaouira, '/destinations#essaouira'],
]

const signatureSlugs = ['grand-mogador-agdal', 'grand-mogador-menara', 'grand-mogador-sea-view-tanger']

const destinationHighlights = {
  marrakech: 'De la ville rouge à l’Atlas',
  casablanca: 'Énergie business au bord de l’Atlantique',
  tanger: 'Entre Méditerranée et détroit',
  agadir: 'La lumière atlantique',
  essaouira: 'Riad, port et vents océaniques',
}

export default function HomePage({ t, lang }) {
  const rootRef = useRef(null)
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(0)
  const [activeUseIndex, setActiveUseIndex] = useState(0)
  useSeo({ title: t.home.seoTitle, description: t.home.seoDescription, lang })

  const signatureHotels = signatureSlugs.map((slug) => hotels.find((hotel) => hotel.slug === slug)).filter(Boolean)
  const activeDestination = destinations[activeDestinationIndex] || destinations[0]

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.set('.gm-radical-reveal', { autoAlpha: 1 })
      if (reduceMotion) return

      gsap.from('.gm-radical-hero__photo img', {
        scale: 1.04,
        duration: 1.1,
        ease: 'power2.out',
        clearProps: 'transform',
      })

      gsap.utils.toArray('.gm-radical-reveal').forEach((element) => {
        gsap.from(element, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || destinations.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveDestinationIndex((current) => (current + 1) % destinations.length)
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || usageCards.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveUseIndex((current) => (current + 1) % usageCards.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [])

  const showPreviousUse = () => setActiveUseIndex((current) => (current - 1 + usageCards.length) % usageCards.length)
  const showNextUse = () => setActiveUseIndex((current) => (current + 1) % usageCards.length)

  const getUseState = (index) => {
    if (index === activeUseIndex) return 'active'
    if (index === (activeUseIndex - 1 + usageCards.length) % usageCards.length) return 'previous'
    if (index === (activeUseIndex + 1) % usageCards.length) return 'next'
    return 'hidden'
  }

  return (
    <main className="gm-home gm-radical-home" ref={rootRef}>
      <section className="gm-radical-hero" aria-label="Accueil Mogador Hotels & Resorts">
        <div className="gm-radical-hero__photo" aria-hidden="true">
          <img src={images.official.homeHero} alt="" loading="eager" decoding="async" fetchPriority="high" />
        </div>
        <div className="gm-radical-hero__shade" aria-hidden="true" />
        <div className="gm-radical-hero__content">
          <span className="gm-radical-eyebrow">Site officiel Mogador</span>
          <h1>Le Maroc commence ici.</h1>
          <p>Douze hôtels, cinq destinations et un grand palais des congrès pour vivre le pays par ses lumières, ses silences, ses tables, ses rituels et ses nuits les plus mémorables.</p>
        </div>
        <aside className="gm-radical-compare" aria-label="Avantage site officiel">
          <span>Réservation officielle</span>
          <strong>Le chemin le plus court vers votre séjour</strong>
          <small>Contact direct. Avantages officiels. Décision immédiate.</small>
        </aside>
        <div className="gm-radical-booking" id="reservation">
          <BookingBar t={t} />
        </div>
      </section>

      <section className="gm-radical-intents gm-radical-reveal" aria-label="Choisir son intention de réservation">
        <div className="gm-radical-intents__head">
          <span className="gm-radical-eyebrow">Réserver sur le site officiel</span>
          <h2>Comment souhaitez-vous préparer votre séjour?</h2>
        </div>
        <div className="gm-radical-intents__grid">
          {intentCards.map(([kicker, title, text, to, cta]) => (
            <Link className="gm-radical-intent" to={to} key={kicker} data-track={`home_intent_${kicker.toLowerCase().replace(/\s/g, '_')}`}>
              <small>{kicker}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>{cta}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-radical-direct gm-radical-reveal" aria-label="Pourquoi réserver en direct">
        {emotionalProofs.map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </article>
        ))}
      </section>

      <section className="gm-radical-intro" aria-label="Présentation Mogador">
        <div className="gm-radical-intro__copy gm-radical-reveal">
          <span className="gm-radical-eyebrow">Hospitalité marocaine</span>
          <h2>Des adresses Mogador pour séjourner, se réunir et profiter du Maroc.</h2>
          <p>Du séjour urbain au resort familial, du spa au palais des congrès, Mogador Hotels & Resorts accueille vos voyages au Maroc avec confort, service et attention.</p>
        </div>
        <div className="gm-radical-services gm-radical-reveal" aria-label="Services et prestations">
          <span>Services & prestations</span>
          <div>{serviceNames.map((service) => <strong key={service}>{service}</strong>)}</div>
        </div>
      </section>

      <section className="gm-radical-map" aria-label="Destinations Mogador au Maroc">
        <div className="gm-radical-map__copy gm-radical-reveal">
          <span className="gm-radical-eyebrow">Nos destinations</span>
          <h2>Cinq destinations Mogador au Maroc.</h2>
          <p>Douze hôtels vous accueillent à Marrakech, Casablanca, Tanger, Agadir et Essaouira pour vos séjours loisirs, voyages d’affaires, événements et escapades en bord de mer.</p>
          <Link to="/destinations" className="gm-radical-text-link" data-track="home_map_destinations">Explorer les destinations</Link>
        </div>
        <div className="gm-radical-map__stage gm-radical-reveal">
          <div className="gm-radical-map__hero">
            <img src={activeDestination.image} alt={activeDestination.name} loading="lazy" decoding="async" />
            <div>
              <span>Maroc Mogador</span>
              <strong>{destinationHighlights[activeDestination.slug] || activeDestination.name}</strong>
            </div>
          </div>
          <div className="gm-radical-map__list" aria-label="Liste des destinations Mogador">
            {destinations.map((destination, index) => (
              <Link
                className={`gm-radical-map__pin${index === activeDestinationIndex ? ' gm-radical-map__pin--active' : ''}`}
                to={`/destinations#${destination.slug}`}
                key={destination.slug}
                aria-current={index === activeDestinationIndex ? 'true' : undefined}
                onFocus={() => setActiveDestinationIndex(index)}
                onMouseEnter={() => setActiveDestinationIndex(index)}
                style={{ '--pin-delay': `${index * 70}ms` }}
                data-track={`home_map_${destination.slug}`}
              >
                <img src={destination.image} alt="" loading="lazy" decoding="async" />
                <strong>{destination.name}</strong>
                <small>{destination.hotels} hôtel{destination.hotels > 1 ? 's' : ''}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="gm-radical-usage" aria-label="Préparer votre séjour Mogador">
        <div className="gm-radical-section-head gm-radical-reveal">
          <span className="gm-radical-eyebrow">Préparer votre séjour</span>
          <h2>Choisissez votre séjour Mogador selon vos besoins.</h2>
          <p>Hôtels, bien-être, restauration, réunions et destinations: accédez rapidement aux services qui correspondent à votre voyage.</p>
        </div>
        <div className="gm-radical-usage__carousel gm-radical-reveal" aria-label="Parcours de séjour Mogador">
          <button className="gm-radical-usage__arrow gm-radical-usage__arrow--prev" type="button" onClick={showPreviousUse} aria-label="Parcours précédent">‹</button>
          <div className="gm-radical-usage__track">
          {usageCards.map(([label, title, text, image, to, icon], index) => (
            <Link
              className={`gm-radical-use gm-radical-use--${getUseState(index)}`}
              to={to}
              key={label}
              aria-hidden={getUseState(index) === 'hidden' ? 'true' : undefined}
              tabIndex={getUseState(index) === 'hidden' ? -1 : undefined}
              data-track={`home_use_${label.toLowerCase().replace(/\s/g, '_')}`}
            >
              <img src={image} alt={title} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
              <div>
                <span><Icon name={icon} /> {label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>Découvrir</strong>
              </div>
            </Link>
          ))}
          </div>
          <button className="gm-radical-usage__arrow gm-radical-usage__arrow--next" type="button" onClick={showNextUse} aria-label="Parcours suivant">›</button>
        </div>
      </section>

      <section className="gm-radical-constellation" aria-label="Constellation Mogador">
        <div className="gm-radical-section-head gm-radical-reveal">
          <span className="gm-radical-eyebrow">Collection vivante</span>
          <h2>Quatre destinations pour préparer votre prochain séjour.</h2>
          <p>Découvrez les villes Mogador, leurs ambiances, leurs hôtels et les expériences à vivre sur place.</p>
        </div>
        <div className="gm-radical-constellation__grid">
          {constellation.map(([name, text, image, to], index) => (
            <Link className="gm-radical-scene gm-radical-reveal" to={to} key={name} style={{ '--scene-delay': `${index * 80}ms` }}>
              <img src={image} alt={name} loading="lazy" decoding="async" />
              <div>
                <h3>{name}</h3>
                <p>{text}</p>
                <strong>Entrer dans la destination</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-radical-chapters" aria-label="Chapitres Mogador">
        {chapters.map((chapter, index) => (
          <article className={`gm-radical-chapter gm-radical-chapter--${index % 2 === 0 ? 'left' : 'right'} gm-radical-reveal`} key={chapter.number}>
            <div className="gm-radical-chapter__media">
              <img src={chapter.image} alt={chapter.title} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
            </div>
            <div className="gm-radical-chapter__copy">
              <span className="gm-radical-eyebrow">{chapter.kicker}</span>
              <h2>{chapter.title}</h2>
              <p>{chapter.text}</p>
              <Link to={chapter.to} className="gm-radical-text-link" data-track={`home_chapter_${chapter.number}`}>{chapter.cta}</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="gm-radical-signatures" aria-label="Hôtels signature">
        <div className="gm-radical-section-head gm-radical-reveal">
          <span className="gm-radical-eyebrow">Hôtels signature</span>
          <h2>Trois adresses signature Mogador.</h2>
          <p>Découvrez une sélection d’hôtels Mogador à Marrakech et Tanger, puis accédez aux détails de chaque adresse avant de réserver en direct.</p>
        </div>
        <div className="gm-radical-signatures__grid">
          {signatureHotels.map((hotel, index) => (
            <article className="gm-hotel-tile gm-hotel-tile--signature gm-radical-reveal" style={{ '--delay': `${index * 70}ms` }} key={hotel.slug}>
              <Link className="gm-hotel-tile__media" to={`/hotels/${hotel.slug}`}>
                <img src={hotel.image} alt={hotel.name} loading="lazy" decoding="async" />
              </Link>
              <div className="gm-hotel-tile__body">
                <span className="gm-hotel-tile__topline">{hotel.destination} / {hotel.category}</span>
                <h3>{hotel.name}</h3>
                <i />
                <p>{hotel.baseline}</p>
                <div className="gm-hotel-tile__badges">{hotel.facts.slice(0, 3).map((fact) => <small key={fact}>{fact}</small>)}</div>
                <div className="gm-hotel-tile__actions"><Link className="gm-hotel-tile__details" to={`/hotels/${hotel.slug}`}>Détails</Link></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-radical-destinations" aria-label="Destinations Mogador">
        <div className="gm-radical-destinations__visual gm-radical-reveal">
          <img src={images.official.destinations.tanger} alt="Destinations Mogador au Maroc" loading="lazy" decoding="async" />
        </div>
        <div className="gm-radical-destinations__copy gm-radical-reveal">
          <span className="gm-radical-eyebrow">Le Maroc Mogador</span>
          <h2>Cinq destinations, une seule porte officielle.</h2>
          <p>Choisissez votre ville selon votre séjour: loisirs, affaires, famille, événement, bord de mer ou escapade urbaine.</p>
          <div className="gm-radical-destination-list">
            {destinations.map((destination) => (
              <Link to={`/destinations#${destination.slug}`} key={destination.slug}>
                <strong>{destination.name}</strong>
                <span>{destination.hotels} hôtel{destination.hotels > 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
          <Link to="/destinations" className="gm-radical-text-link" data-track="home_destinations_all">Toutes les destinations</Link>
        </div>
      </section>

      <section className="gm-radical-moments" aria-label="Moments de séjour">
        {brandMoments.map((moment) => (
          <article className="gm-radical-moment gm-radical-reveal" key={moment.title}>
            <img src={moment.image} alt={moment.title} loading="lazy" decoding="async" />
            <div>
              <span>{moment.label}</span>
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="gm-radical-numbers" aria-label="Mogador en chiffres">
        {stats.slice(0, 4).map((stat) => (
          <article className="gm-radical-reveal" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </section>

      <section className="gm-radical-final" aria-label="Réservation officielle Mogador">
        <span className="gm-radical-eyebrow">Réservez votre séjour</span>
        <h2>Réservez votre séjour Mogador sur le site officiel.</h2>
        <p>Choisissez votre destination, consultez les hôtels et contactez directement les équipes Mogador pour toute demande particulière.</p>
        <div className="gm-radical-final__actions">
          <Link to="/#reservation" className="gm-radical-button" data-track="home_final_booking">Réserver maintenant</Link>
          <Link to="/contact" className="gm-radical-button gm-radical-button--light" data-track="home_final_contact">Contacter Mogador</Link>
        </div>
        <small>{brand.phone}</small>
      </section>
    </main>
  )
}
