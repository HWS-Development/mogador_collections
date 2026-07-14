import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BookingBar from '../components/BookingBar'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { images } from '../data/images'
import { brand, brandMoments, destinations, directReasons, hotels, mice, stats } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

gsap.registerPlugin(ScrollTrigger)

const serviceNames = ['Piscines', 'Restaurants', 'Bars', 'Spa', 'Fitness', 'Kids & loisirs', 'Business', 'Congrès']

const usageCards = [
  ['Dormir', 'Chambres, suites et séjours famille', 'Comparer les hôtels par destination, niveau de confort et usage.', images.legacy.menaraRoom, '/hotels', 'bed'],
  ['Se détendre', 'Spas, hammams et piscines', 'Composer une parenthèse bien-être dans les adresses Mogador.', images.official.spa, '/experiences', 'spa'],
  ['Se réunir', 'Congrès, séminaires et groupes', 'Marrakech, Casablanca et Tanger pour vos événements corporate.', images.official.mice, '/reunions-evenements', 'meeting'],
  ['Manger', 'Restaurants, salons et saveurs marocaines', 'Tables marocaines, cuisines du monde et pauses conviviales.', images.official.restaurant, '/experiences', 'dining'],
  ['Explorer', 'Cinq destinations au Maroc', 'Marrakech, Tanger, Casablanca, Agadir et Essaouira.', images.official.destinations.marrakech, '/destinations', 'local'],
]

const chapters = [
  {
    number: '01',
    kicker: 'Une histoire marocaine',
    title: 'Un groupe hôtelier, plusieurs façons de vivre le Maroc.',
    text: 'Mogador Hotels & Resorts réunit des adresses urbaines, resorts, hôtels 5 étoiles, appart-hôtels et lieux d’événements. La promesse est simple: choisir une destination, comprendre l’expérience, réserver directement avec la marque.',
    image: images.official.universe,
    to: '/hotels',
    cta: 'Découvrir le groupe',
  },
  {
    number: '02',
    kicker: 'Chambres, suites et resorts',
    title: 'Des séjours pour dormir, respirer, travailler ou partir en famille.',
    text: 'Des chambres 5 étoiles de Marrakech et Tanger aux séjours libres en appart-hôtel, chaque adresse met en avant le confort, les services essentiels et l’accès direct aux équipes Mogador.',
    image: images.legacy.seaSuite,
    to: '/hotels',
    cta: 'Voir les hôtels',
  },
  {
    number: '03',
    kicker: 'Gastronomie et salons',
    title: 'Une table marocaine ouverte aux cuisines du monde.',
    text: 'Restaurants, salons de thé, petits-déjeuners, room service et moments conviviaux accompagnent le séjour sans transformer la page en promesse vide.',
    image: images.official.restaurant,
    to: '/experiences',
    cta: 'Découvrir les expériences',
  },
  {
    number: '04',
    kicker: 'Spa et détente',
    title: 'Hammams, soins, piscines et rituels de repos.',
    text: 'Le bien-être Mogador s’exprime par des espaces concrets: spas, salles de massage, piscines intérieures et extérieures, fitness et loisirs selon les établissements.',
    image: images.official.spa,
    to: '/experiences',
    cta: 'Préparer mon séjour',
  },
  {
    number: '05',
    kicker: 'Événements',
    title: 'Le Grand Palais des Congrès donne une vraie force corporate au groupe.',
    text: mice.text,
    image: images.official.mice,
    to: '/reunions-evenements',
    cta: 'Planifier un événement',
  },
]

const signatureSlugs = ['grand-mogador-agdal', 'grand-mogador-menara', 'grand-mogador-sea-view-tanger']

export default function HomePage({ t, lang }) {
  const rootRef = useRef(null)
  useSeo({ title: t.home.seoTitle, description: t.home.seoDescription, lang })

  const signatureHotels = signatureSlugs.map((slug) => hotels.find((hotel) => hotel.slug === slug)).filter(Boolean)

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

  return (
    <main className="gm-home gm-radical-home" ref={rootRef}>
      <section className="gm-radical-hero" aria-label="Accueil Mogador Hotels & Resorts">
        <div className="gm-radical-hero__photo" aria-hidden="true">
          <img src={images.official.homeHero} alt="" loading="eager" decoding="async" fetchPriority="high" />
        </div>
        <div className="gm-radical-hero__shade" aria-hidden="true" />
        <div className="gm-radical-hero__topline">
          <img src={images.brand.logoWhite} alt="Mogador Hotels & Resorts" />
          <Link to="/#reservation" className="gm-radical-book-link" data-track="home_top_booking">Réserver</Link>
        </div>
        <div className="gm-radical-hero__content">
          <span className="gm-radical-eyebrow">Site officiel</span>
          <h1>Escale de luxe au Maroc</h1>
          <p>Mogador Hotels & Resorts rassemble douze hôtels, cinq destinations et le Grand Palais des Congrès Marrakech pour des séjours, événements et expériences réservés en direct.</p>
        </div>
        <aside className="gm-radical-compare" aria-label="Avantage site officiel">
          <span>Site officiel</span>
          <strong>Meilleurs tarifs & contact direct</strong>
          <small>Autres sites: intermédiaires</small>
        </aside>
        <div className="gm-radical-booking" id="reservation">
          <BookingBar t={t} />
        </div>
      </section>

      <section className="gm-radical-direct gm-radical-reveal" aria-label="Pourquoi réserver en direct">
        {directReasons.map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </article>
        ))}
      </section>

      <section className="gm-radical-intro" aria-label="Présentation Mogador">
        <div className="gm-radical-intro__number gm-radical-reveal">01</div>
        <div className="gm-radical-intro__copy gm-radical-reveal">
          <span className="gm-radical-eyebrow">Une histoire de marque</span>
          <h2>Hospitalité marocaine, adresses concrètes, réservation directe.</h2>
          <p>{brand.mission}</p>
        </div>
        <div className="gm-radical-services gm-radical-reveal" aria-label="Services et prestations">
          <span>Services & prestations</span>
          <div>{serviceNames.map((service) => <strong key={service}>{service}</strong>)}</div>
        </div>
      </section>

      <section className="gm-radical-usage" aria-label="Parcours par envie">
        <div className="gm-radical-section-head gm-radical-reveal">
          <span className="gm-radical-eyebrow">Choisir par envie</span>
          <h2>Dormir, se détendre, se réunir, manger, explorer.</h2>
          <p>La navigation doit être immédiate: le visiteur ne cherche pas une brochure, il cherche le bon séjour.</p>
        </div>
        <div className="gm-radical-usage__grid">
          {usageCards.map(([label, title, text, image, to, icon], index) => (
            <Link className="gm-radical-use gm-radical-reveal" to={to} key={label} data-track={`home_use_${label.toLowerCase().replace(/\s/g, '_')}`}>
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
      </section>

      <section className="gm-radical-chapters" aria-label="Chapitres Mogador">
        {chapters.map((chapter, index) => (
          <article className={`gm-radical-chapter gm-radical-chapter--${index % 2 === 0 ? 'left' : 'right'} gm-radical-reveal`} key={chapter.number}>
            <div className="gm-radical-chapter__media">
              <img src={chapter.image} alt={chapter.title} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
            </div>
            <div className="gm-radical-chapter__copy">
              <span className="gm-radical-chapter__number">{chapter.number}</span>
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
          <h2>Trois adresses pour comprendre le niveau Grand Mogador.</h2>
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
        <h2>Le bon prix, le bon hôtel, le bon contact: commencez sur le site officiel.</h2>
        <div className="gm-radical-final__actions">
          <Link to="/#reservation" className="gm-radical-button" data-track="home_final_booking">Réserver maintenant</Link>
          <Link to="/contact" className="gm-radical-button gm-radical-button--light" data-track="home_final_contact">Contacter Mogador</Link>
        </div>
        <small>{brand.phone}</small>
      </section>
    </main>
  )
}
