import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BookingBar from '../components/BookingBar'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { images } from '../data/images'
import { brand, brandMoments, destinations, directReasons, hotels, magazineArticles, mice, offers, stats } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

gsap.registerPlugin(ScrollTrigger)

const signatureSlugs = ['grand-mogador-agdal', 'grand-mogador-menara', 'grand-mogador-sea-view-tanger', 'mogador-opera']

const travellerPaths = [
  ['Famille', 'Séjours fluides, chambres adaptées, piscines et loisirs.', images.legacy.agadirPool, 'people', '/hotels'],
  ['Couple', 'Spa, gastronomie, suites et parenthèses lumineuses.', images.legacy.seaSuite, 'spa', '/experiences'],
  ['Business', 'Salles, hébergement, congrès et accompagnement groupes.', images.legacy.agdalCongress, 'meeting', '/reunions-evenements'],
]

const bookingIntents = [
  ['Un séjour', 'Comparez les hôtels, choisissez vos dates et sécurisez votre avantage direct.', images.legacy.seaSuite, '/#reservation', 'Réserver maintenant'],
  ['Un événement', 'Congrès, séminaire, groupe ou réception: une équipe commerciale vous répond.', images.legacy.agdalCongress, '/reunions-evenements', 'Demander un devis'],
  ['Une expérience', 'Spa, gastronomie, loisirs et moments locaux pour composer un séjour complet.', images.legacy.homeSpa, '/experiences', 'Composer mon séjour'],
]

const immersionMoments = [
  ['Dormir', 'Chambres & suites', 'Des espaces pensés pour le repos, la lumière et le confort.', images.legacy.menaraRoom, '/hotels'],
  ['Manger', 'Restaurants & salons', 'Cuisine marocaine, tables internationales, pauses gourmandes.', images.legacy.homeRestaurant, '/experiences'],
  ['Se détendre', 'Spa & loisirs', 'Hammams, soins, piscines et rituels inspirés du Maroc.', images.legacy.homeSpa, '/experiences'],
  ['Se réunir', 'MICE & congrès', 'Salles, palais des congrès et accompagnement corporate.', images.legacy.agdalCongress, '/reunions-evenements'],
  ['Explorer', 'Destinations', 'Marrakech, Tanger, Agadir, Essaouira et Casablanca.', images.legacy.destMarrakech, '/destinations'],
]

const collections = [
  ['Grand Mogador', '5 étoiles', 'Bleu et beige', 'gm-collection--grand'],
  ['Mogador', '4 étoiles', 'Rouge et gris', 'gm-collection--mogador'],
  ['Mogador Express', 'Séjours actifs', 'Bleu express', 'gm-collection--express'],
  ['Aqua Fun', 'Famille', 'Bleus aquatiques', 'gm-collection--aqua'],
  ['Grand Palais', 'MICE', 'Rouge palais', 'gm-collection--palace'],
]

const experienceIcons = [
  ['spa', 'Spa'],
  ['dining', 'Gastronomie'],
  ['leisure', 'Loisirs'],
  ['meeting', 'Événements'],
  ['local', 'Culture'],
]

export default function HomePage({ t, lang }) {
  const rootRef = useRef(null)
  useSeo({ title: t.home.seoTitle, description: t.home.seoDescription, lang })

  const signatureHotels = signatureSlugs.map((slug) => hotels.find((hotel) => hotel.slug === slug)).filter(Boolean)
  const [leadHotel, ...otherHotels] = signatureHotels
  const [leadDestination, ...otherDestinations] = destinations

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.gm-reveal, .gm-hero__content, .gm-booking', { autoAlpha: 1, clearProps: 'transform,filter' })
        return
      }

      gsap.from('.gm-hero__image img', { scale: 1.025, duration: 0.45, clearProps: 'transform', ease: 'power2.out' })

      gsap.utils.toArray('.gm-reveal').forEach((element) => {
        gsap.from(element, {
          y: 30,
          duration: 0.72,
          clearProps: 'transform,filter,opacity,visibility',
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="gm-home" ref={rootRef}>
      <section className="gm-hero" aria-label="Accueil Mogador Hotels & Resorts">
        <div className="gm-hero__image" aria-hidden="true"><img src={images.official.homeHero} alt="" loading="eager" decoding="async" fetchPriority="high" /></div>
        <div className="gm-hero__content">
          <span>Site officiel</span>
          <h1>Séjours d’exception au Maroc</h1>
          <p>Mogador Hotels & Resorts réunit douze hôtels, cinq destinations et une hospitalité marocaine conçue pour réserver directement auprès de la marque.</p>
          <div className="gm-actions">
            <Link to="/#reservation" className="gm-button gm-button--primary" data-track="home_hero_booking">Réserver maintenant</Link>
            <Link to="/hotels" className="gm-button gm-button--ghost" data-track="home_hero_hotels">Découvrir les hôtels</Link>
          </div>
        </div>
        <div className="gm-booking"><BookingBar t={t} /></div>
      </section>

      <section className="gm-direct" aria-label="Réservation directe">
        {directReasons.map(([title, text]) => <article key={title}><strong>{title}</strong><span>{text}</span></article>)}
      </section>

      <section className="gm-reservation-takeover gm-reveal" aria-label="Réserver dès maintenant">
        <div className="gm-reservation-takeover__copy">
          <span className="gm-label">Conversion directe</span>
          <h2>Réservez maintenant. Le bon canal, la bonne équipe, le bon avantage.</h2>
          <p>Le parcours met en avant la réservation directe, les demandes MICE et les expériences à forte valeur pour réduire la dépendance aux OTA.</p>
        </div>
        <BookingBar t={t} />
        <div className="gm-booking-intents" aria-label="Intentions de réservation">
          {bookingIntents.map(([title, text, image, to, label]) => (
            <Link className="gm-booking-intent" to={to} key={title} style={{ '--card-image': `url(${image})` }} data-track={`home_intent_${title.toLowerCase().replace(/\s/g, '_')}`}>
              <img src={image} alt={title} loading="eager" decoding="async" fetchPriority={title === 'Un séjour' ? 'high' : 'auto'} />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
                <em>{label}</em>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-brand-signature gm-reveal" id="marque" aria-label="Promesse Mogador">
        <div className="gm-brand-signature__copy">
          <span className="gm-label">La marque</span>
          <h2>Une chaîne marocaine, pensée comme une expérience de confiance.</h2>
          <p>{brand.mission}</p>
        </div>
        <figure className="gm-brand-signature__visual">
          <img src={images.official.universe} alt="Hospitalité et art de vivre Mogador Hotels & Resorts" loading="eager" decoding="async" fetchPriority="high" />
          <figcaption>
            <span>Moroccan lifestyle</span>
            <strong>Hospitalité, patrimoine et confiance client.</strong>
          </figcaption>
        </figure>
        <div className="gm-brand-signature__proof" aria-label="Preuves de marque">
          <article><strong>12</strong><span>hôtels au Maroc</span></article>
          <article><strong>5</strong><span>destinations</span></article>
          <article><strong>Direct</strong><span>réservation officielle</span></article>
        </div>
      </section>

      <section className="gm-brand-film gm-reveal" aria-label="Film de marque Mogador">
        <div className="gm-brand-film__media">
          <video muted playsInline controls preload="none" poster={images.official.homeHero} aria-label="Film d'ambiance Mogador Hotels & Resorts">
            <source src={images.videos.brandFilm} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture vidéo.
          </video>
        </div>
        <div className="gm-brand-film__panel">
          <span className="gm-label">Film d’inspiration</span>
          <h2>Voir le Maroc avant de choisir son adresse.</h2>
          <p>Un temps fort cinématique installe l’émotion attendue dans le cahier des charges: lumière, hospitalité, destinations et désir de réserver en direct.</p>
          <div className="gm-brand-film__meta" aria-label="Parcours mis en avant">
            <span>Séjours</span>
            <span>Expériences</span>
            <span>MICE</span>
          </div>
          <div className="gm-actions">
            <Link to="/#reservation" className="gm-button gm-button--primary" data-track="home_film_booking">Réserver en direct</Link>
            <Link to="/experiences" className="gm-button gm-button--ghost" data-track="home_film_experiences">Découvrir les expériences</Link>
          </div>
        </div>
      </section>

      <section className="gm-immersion-board" id="parcours" aria-label="Univers Mogador inspiré des usages hôteliers premium">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Parcours premium</span>
          <h2>Dormir, manger, se détendre, se réunir, explorer: chaque envie mène à une réservation.</h2>
          <p>Une navigation par moments de vie, plus émotionnelle et plus commerciale qu’un simple catalogue d’hôtels.</p>
        </div>
        <div className="gm-immersion-board__grid">
          {immersionMoments.map(([kicker, title, text, image, to], index) => (
            <Link className={`gm-immersion-card gm-immersion-card--${index + 1} gm-reveal`} to={to} key={title} style={{ '--card-image': `url(${image})` }}>
              <img src={image} alt={title} loading="eager" decoding="async" fetchPriority={index < 2 ? 'high' : 'auto'} />
              <div>
                <span>{kicker}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <strong>Découvrir et réserver</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-paths" aria-label="Choisir son séjour">
        {travellerPaths.map(([label, text, image, icon, to]) => (
          <Link className="gm-path gm-reveal" to={to} key={label} style={{ '--card-image': `url(${image})` }}>
            <img src={image} alt={label} loading="lazy" decoding="async" />
            <div><Icon name={icon} /><strong>{label}</strong><span>{text}</span></div>
          </Link>
        ))}
      </section>

      <section className="gm-split gm-destinations" aria-label="Destinations Mogador">
        <div className="gm-split__copy gm-reveal">
          <span className="gm-label">Destinations</span>
          <h2>Cinq portes d’entrée vers le Maroc.</h2>
          <p>Marrakech, Casablanca, Tanger, Agadir et Essaouira structurent la découverte par envies de séjour.</p>
          <Link to="/destinations" className="gm-link">Toutes les destinations</Link>
        </div>
        <article className="gm-destination gm-reveal">
          <img src={leadDestination.image} alt={leadDestination.name} loading="lazy" decoding="async" />
          <div><span>Destination phare</span><h3>{leadDestination.name}</h3><p>{leadDestination.text}</p></div>
        </article>
        <nav className="gm-destination-list" aria-label="Autres destinations">
          {otherDestinations.map((destination) => <Link className="gm-reveal" to={`/destinations#${destination.slug}`} key={destination.slug}><strong>{destination.name}</strong><span>{destination.hotels} hôtel{destination.hotels > 1 ? 's' : ''}</span></Link>)}
        </nav>
      </section>

      <section className="gm-collections" aria-label="Collections Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Collections</span>
          <h2>Une architecture de marque lisible.</h2>
          <p>Chaque gamme utilise sa couleur de charte pour clarifier le niveau d’expérience.</p>
        </div>
        <div className="gm-collections__grid">
          {collections.map(([name, meta, tone, className]) => <article className={`gm-collection ${className} gm-reveal`} key={name}><span>{meta}</span><h3>{name}</h3><p>{tone}</p></article>)}
        </div>
      </section>

      <section className="gm-hotels" aria-label="Hôtels signature">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Hôtels signature</span>
          <h2>Des adresses concrètes pour porter le prestige.</h2>
        </div>
        {leadHotel ? <Link className="gm-hotel-lead gm-reveal" to={`/hotels/${leadHotel.slug}`}>
          <img src={leadHotel.image} alt={leadHotel.name} loading="lazy" decoding="async" />
          <div><span>{leadHotel.destination} / {leadHotel.category}</span><h3>{leadHotel.name}</h3><p>{leadHotel.baseline}</p><strong>Voir les disponibilités</strong></div>
        </Link> : null}
        <div className="gm-hotel-list">
          {otherHotels.map((hotel) => <Link className="gm-reveal" to={`/hotels/${hotel.slug}`} key={hotel.slug}><img src={hotel.image} alt={hotel.name} loading="lazy" decoding="async" /><div><span>{hotel.destination}</span><h3>{hotel.name}</h3><p>{hotel.category}</p></div></Link>)}
        </div>
      </section>

      <section className="gm-experiences" aria-label="Expériences Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Expériences</span>
          <h2>L’émotion avant l’inventaire.</h2>
          <p>Le site doit vendre des moments: bien-être, gastronomie, art de vivre, loisirs et événements.</p>
        </div>
        <div className="gm-experience-grid">
          {brandMoments.map((moment) => <article className="gm-experience gm-reveal" key={moment.title}><img src={moment.image} alt={moment.title} loading="lazy" decoding="async" /><div><span>{moment.label}</span><h3>{moment.title}</h3><p>{moment.text}</p></div></article>)}
        </div>
        <div className="gm-icons gm-reveal">{experienceIcons.map(([icon, label]) => <span key={label}><Icon name={icon} />{label}</span>)}</div>
      </section>

      <section className="gm-offers" aria-label="Offres directes">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Offres directes</span>
          <h2>Rendre le choix direct évident.</h2>
        </div>
        <div className="gm-offer-list">
          {offers.map((offer) => <article className="gm-reveal" key={offer.title}><span>{offer.badge}</span><h3>{offer.title}</h3><p>{offer.text}</p><small>{offer.urgency}</small></article>)}
        </div>
        <Link to="/#reservation" className="gm-button gm-button--primary gm-reveal" data-track="home_offers_booking">Réserver en direct</Link>
      </section>

      <section className="gm-mice" aria-label="Grand Palais des Congrès Marrakech">
        <img src={images.official.mice} alt="" loading="lazy" decoding="async" aria-hidden="true" />
        <div className="gm-mice__content gm-reveal">
          <span className="gm-label">Grand Palais des Congrès Marrakech</span>
          <h2>Une capacité corporate qui crédibilise le groupe.</h2>
          <p>{mice.text}</p>
          <div className="gm-mice__stats">{mice.stats.slice(0, 3).map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}</div>
          <Link to="/reunions-evenements" className="gm-button gm-button--light" data-track="home_mice_quote">Demander une proposition</Link>
        </div>
      </section>

      <section className="gm-numbers" aria-label="Mogador en chiffres">
        {stats.map((stat) => <article className="gm-reveal" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="gm-final" aria-label="Réservation officielle Mogador">
        <img src={images.brand.logo} alt="Mogador Hotels & Resorts" />
        <span className="gm-label">Site officiel</span>
        <h2>Votre séjour commence ici.</h2>
        <p>Choisissez la destination, comparez les hôtels, découvrez les expériences et réservez directement auprès de Mogador Hotels & Resorts.</p>
        <div>{magazineArticles.slice(0, 3).map((article) => <Link to="/magazine" key={article.slug}>{article.title}</Link>)}</div>
        <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/#reservation" data-track="home_final_booking">Réserver maintenant</Link><Link className="gm-button gm-button--secondary-dark" to="/contact" data-track="home_final_contact">Contacter Mogador</Link></div>
      </section>

    </main>
  )
}
