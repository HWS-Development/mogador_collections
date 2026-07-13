import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import Link from '../router/Link'
import { hotels } from '../data/siteData'
import { officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import NotFoundPage from './NotFoundPage'

export default function HotelPage({ slug, t, lang }) {
  const hotel = hotels.find((item) => item.slug === slug)
  const details = hotel ? officialHotelDetails[hotel.slug] : null

  useSeo({
    title: hotel ? `${hotel.name} | ${hotel.destination} | Mogador Hotels & Resorts` : 'Hôtel introuvable | Mogador Hotels & Resorts',
    description: hotel?.baseline || 'Hôtel Mogador introuvable.',
    lang,
  })

  if (!hotel) return <NotFoundPage t={t} lang={lang} />

  const gallery = hotel.gallery?.length ? hotel.gallery : [hotel.image].filter(Boolean)
  const heroImage = hotel.image || gallery[0] || details?.sections?.[0]?.image || '/assets/legacy/menara-salon.jpg'
  const overview = details?.overview || [hotel.description]
  const sections = details?.sections || [
    { title: 'Hébergement', image: gallery[0] || heroImage, text: 'Catégories issues du portefeuille et de la charte Mogador.', items: hotel.rooms },
    { title: 'Restauration', image: gallery[1] || heroImage, items: hotel.dining },
    { title: 'Loisirs', image: gallery[2] || heroImage, items: hotel.wellness },
    { title: 'MICE', image: gallery[3] || heroImage, items: hotel.mice },
  ]
  const accommodationImage = sections.find((section) => section.title.toLowerCase().includes('hébergement'))?.image || gallery[0] || heroImage
  const roomImages = [accommodationImage, ...gallery.filter((image) => /room|suite|apartment|salon|chambre/i.test(image))].filter(Boolean)
  const rooms = hotel.rooms.map((room, index) => ({
    name: room,
    image: roomImages[index % roomImages.length] || accommodationImage,
    description: getRoomDescription(room, hotel),
    facts: getRoomFacts(room, hotel, index),
  }))
  const serviceGroups = buildServiceGroups(hotel, sections, gallery, heroImage)
  const sliderImages = [...new Set([heroImage, ...gallery, ...sections.map((section) => section.image)].filter(Boolean))]

  return (
    <div className="gm-page gm-hotel-page">
      <PageHero eyebrow={`${hotel.destination} / ${hotel.category}`} title={hotel.name} text={hotel.baseline} image={heroImage} primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/contact', label: t.nav.contact }} booking t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">{details ? 'Fiche hôtel Mogador' : 'Portefeuille Mogador'}</span>
          <h2>{details?.sourceTitle || hotel.family}</h2>
        </div>
        <div className="gm-rich-copy">
          {overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="gm-fact-line">
            {(hotel.facts || [hotel.destination, hotel.category, hotel.family]).map((fact) => <span key={fact}>{fact}</span>)}
          </div>
        </div>
      </section>

      <section className="gm-hotel-booking-panel gm-page-section" aria-label={`Réserver ${hotel.name}`}>
        <div>
          <span className="gm-label">Disponibilités & contact direct</span>
          <h2>Bloquer votre séjour à {hotel.name} sans quitter le canal officiel.</h2>
          <p>Choisissez vos dates, indiquez vos voyageurs, puis poursuivez vers la réservation ou vers un conseiller Mogador pour une demande personnalisée.</p>
        </div>
        <BookingBar t={t} />
      </section>

      <section className="gm-hotel-slider gm-page-section" aria-label={`Galerie immersive ${hotel.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Immersion visuelle</span>
          <h2>Voir l’hôtel avant de choisir sa chambre.</h2>
          <p>Un parcours visuel rapide pour projeter le client dans les espaces clés: arrivée, chambre, table, loisirs et événements.</p>
        </div>
        <div className="gm-hotel-slider__track">
          {sliderImages.map((image, index) => (
            <figure className="gm-hotel-slide gm-reveal" style={{ '--delay': `${index * 55}ms` }} key={`${image}-${index}`}>
              <img src={image} alt={`${hotel.name} - ambiance ${index + 1}`} loading="lazy" />
              <figcaption><span>{String(index + 1).padStart(2, '0')}</span><strong>{index === 0 ? hotel.name : 'Moment Mogador'}</strong></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {details?.facilities?.length ? (
        <section className="gm-facilities gm-page-section" aria-label="Équipements et prestations de l’hôtel">
          {details.facilities.map(([title, text]) => <article className="gm-reveal" key={title}><span>{title}</span><p>{text}</p></article>)}
        </section>
      ) : null}

      <section className="gm-room-catalog gm-page-section" aria-label="Catégories d’hébergement">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Hébergement</span>
          <h2>Chaque catégorie transforme le besoin client en choix évident.</h2>
          <p>Des descriptifs plus sensoriels, des preuves rapides et un CTA direct évitent la fiche froide et accélèrent la réservation.</p>
        </div>
        <div className="gm-room-catalog__grid">
          {rooms.map((room, index) => (
            <article className="gm-room-card gm-reveal" style={{ '--delay': `${index * 45}ms` }} key={`${room.name}-${index}`}>
              <img src={room.image} alt={`${hotel.name} - ${room.name}`} loading="lazy" />
              <div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                <div className="gm-room-card__facts">{room.facts.map((fact) => <small key={fact}>{fact}</small>)}</div>
                <Link to="/#reservation" data-track={`room_booking_${hotel.slug}_${index}`}>Choisir cette chambre</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-service-matrix gm-page-section" aria-label={`Services et équipements ${hotel.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Services & équipements</span>
          <h2>Tout ce qui rassure avant de réserver.</h2>
        </div>
        <div className="gm-service-matrix__grid">
          {serviceGroups.map((group, index) => (
            <article className="gm-service-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={group.title}>
              <img src={group.image} alt={group.title} loading="lazy" />
              <div>
                <span>{group.label}</span>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <div>{group.items.slice(0, 8).map((item) => <small key={item}>{item}</small>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-hotel-sections" aria-label="Contenu hôtel officiel">
        {sections.map((section, index) => <HotelSection section={section} index={index} key={`${section.title}-${index}`} />)}
      </section>

      <section className="gm-hotel-gallery gm-page-section" aria-label="Galerie de l’hôtel">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Galerie</span>
          <h2>Chambres, salons, restauration et espaces de vie.</h2>
        </div>
        <div className="gm-hotel-gallery__grid">
          {(gallery.length ? gallery : sections.map((section) => section.image)).filter(Boolean).map((src, index) => (
            <figure className="gm-reveal" style={{ '--delay': `${index * 60}ms` }} key={`${src}-${index}`}>
              <img src={src} alt={`${hotel.name} - galerie ${index + 1}`} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      <section className="gm-final gm-final--compact" aria-label="Réserver cet hôtel">
        <span className="gm-label">Réservation directe</span>
        <h2>Réserver {hotel.name} depuis le site officiel.</h2>
        <p>Le parcours priorise le contact direct, les disponibilités et les demandes groupes ou MICE sans détour inutile.</p>
        <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/#reservation">{t.common.bookDirect}</Link><Link className="gm-button gm-button--secondary-dark" to="/contact">Contacter l’hôtel</Link></div>
      </section>
    </div>
  )
}

function HotelSection({ section, index }) {
  return (
    <article className={`gm-hotel-section ${index % 2 ? 'gm-hotel-section--reverse' : ''} gm-reveal`}>
      <figure><img src={section.image} alt={section.title} loading="lazy" /></figure>
      <div>
        <span className="gm-label">{String(index + 1).padStart(2, '0')}</span>
        <h2>{section.title}</h2>
        {section.text ? <p>{section.text}</p> : null}
        <div className="gm-feature-list">
          {section.items.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </article>
  )
}

function getRoomDescription(room, hotel) {
  const normalized = room.toLowerCase()
  if (normalized.includes('suite')) return `Une catégorie généreuse pour vivre ${hotel.destination} avec plus d’espace, plus de calme et une vraie sensation de séjour privilégié.`
  if (normalized.includes('appartement') || normalized.includes('studio')) return `Une adresse souple et confortable, pensée pour les familles, les longs séjours et les voyageurs qui veulent garder leur rythme.`
  if (normalized.includes('deluxe')) return `Une chambre lumineuse pour se poser, respirer et profiter d’un confort soigné après une journée marocaine intense.`
  if (normalized.includes('twin') || normalized.includes('2 lits')) return `Deux couchages confortables pour voyager à deux, entre amis, collègues ou famille, sans renoncer à l’élégance Mogador.`
  if (normalized.includes('grand lit') || normalized.includes('double')) return `Un cocon apaisant pour ralentir, dormir profondément et retrouver la douceur d’une hospitalité attentive.`
  return `Une catégorie pensée pour un séjour simple à choisir, facile à réserver et fidèle au confort Mogador.`
}

function getRoomFacts(room, hotel, index) {
  const facts = [hotel.category, hotel.destination]
  if (/suite/i.test(room)) facts.push('Espace salon')
  if (/appartement|studio/i.test(room)) facts.push('Kitchenette')
  if (/vue mer|sea/i.test(room)) facts.push('Vue mer')
  if (/famille|2 lits|twin|double/i.test(room)) facts.push('Idéal famille')
  if (index === 0 && hotel.facts?.[0]) facts.push(hotel.facts[0])
  return [...new Set(facts)].slice(0, 4)
}

function buildServiceGroups(hotel, sections, gallery, heroImage) {
  const sectionImage = (name, fallback) => sections.find((section) => section.title.toLowerCase().includes(name))?.image || fallback

  return [
    {
      label: 'Accueil',
      title: 'Services essentiels',
      text: 'Les attentions qui simplifient le séjour, rassurent à l’arrivée et fluidifient chaque demande.',
      image: gallery[0] || heroImage,
      items: hotel.services?.length ? hotel.services : ['Réception', 'Wi-Fi', 'Contact direct', 'Accompagnement client'],
    },
    {
      label: 'Table',
      title: 'Restauration',
      text: 'Des moments culinaires pour prolonger l’expérience sans sortir du parcours Mogador.',
      image: sectionImage('restauration', '/assets/official/restaurant-official.jpg'),
      items: hotel.dining || ['Restaurant', 'Petit-déjeuner', 'Salon de thé'],
    },
    {
      label: 'Bien-être',
      title: 'Loisirs & détente',
      text: 'Piscines, hammam, spa, fitness ou espaces familles selon l’adresse choisie.',
      image: sectionImage('loisirs', '/assets/official/spa-official.jpg'),
      items: hotel.wellness || ['Piscine', 'Hammam', 'Soins', 'Détente'],
    },
    {
      label: 'Business',
      title: 'MICE & groupes',
      text: 'Une réponse claire pour les séminaires, réunions, congrès, groupes et événements privés.',
      image: sectionImage('conférences', sectionImage('espace', '/assets/official/mice-official.jpg')),
      items: hotel.mice || ['Réunions', 'Groupes', 'Devis MICE'],
    },
  ]
}
