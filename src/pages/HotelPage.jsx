import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import GallerySlider from '../components/GallerySlider'
import SignatureExperience from '../components/SignatureExperience'
import Link from '../router/Link'
import { hotels } from '../data/siteData'
import { officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import NotFoundPage from './NotFoundPage'

export default function HotelPage({ slug, t, lang }) {
  const hotel = hotels.find((item) => item.slug === slug)
  const details = hotel ? officialHotelDetails[hotel.slug] : null
  const [activeRoom, setActiveRoom] = useState(0)
  const [activePhoto, setActivePhoto] = useState(0)
  const [photoDirection, setPhotoDirection] = useState(1)
  const safeGallery = hotel?.gallery?.length ? hotel.gallery : [hotel?.image].filter(Boolean)

  useEffect(() => {
    setActivePhoto(0)
    setPhotoDirection(1)
  }, [activeRoom])

  useEffect(() => {
    const photoCount = Math.max(safeGallery.length, 1)
    const timer = window.setInterval(() => {
      setPhotoDirection(1)
      setActivePhoto((value) => (value + 1) % photoCount)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [activeRoom, safeGallery.length])

  useSeo({
    title: hotel ? `${hotel.name} | ${hotel.destination} | Mogador Hotels & Resorts` : 'Hôtel introuvable | Mogador Hotels & Resorts',
    description: hotel?.baseline || 'Hôtel Mogador introuvable.',
    lang,
  })

  if (!hotel) return <NotFoundPage t={t} lang={lang} />

  const gallery = safeGallery
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
    photos: buildRoomPhotos(index, roomImages, gallery, accommodationImage),
    description: getRoomDescription(room, hotel),
    facts: getRoomFacts(room, hotel, index),
  }))
  const serviceGroups = buildServiceGroups(hotel, sections, gallery, heroImage)
  const sliderImages = [...new Set([heroImage, ...gallery, ...sections.map((section) => section.image)].filter(Boolean))]
  const activeRoomData = rooms[activeRoom] || rooms[0]
  const activePhotos = activeRoomData?.photos?.length ? activeRoomData.photos : [activeRoomData?.image || accommodationImage].filter(Boolean)
  const visiblePhoto = activePhotos[activePhoto % activePhotos.length] || activeRoomData?.image || accommodationImage

  const goRoomPhoto = (direction) => {
    setPhotoDirection(direction)
    setActivePhoto((value) => (value + direction + activePhotos.length) % activePhotos.length)
  }

  const goRoom = (direction) => {
    setPhotoDirection(direction)
    setActiveRoom((value) => (value + direction + rooms.length) % rooms.length)
  }

  return (
    <div className="gm-page gm-hotel-page">
      <PageHero eyebrow={`${hotel.destination} / ${hotel.category}`} title={hotel.name} text={hotel.baseline} image={heroImage} primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/contact', label: t.nav.contact }} booking t={t} />

      <SignatureExperience variant="hotels" title={`Séjourner à ${hotel.name}`} text={`${hotel.destination}, ${hotel.category}: découvrez les chambres, services, restaurants et espaces de détente de cette adresse Mogador avant de réserver sur le site officiel.`} image={heroImage} cta="/#reservation" />

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
          <p>Un aperçu des espaces clés de l’hôtel: arrivée, chambre, table, loisirs et événements.</p>
        </div>
        <GallerySlider items={sliderImages.map((image, index) => ({ image, title: index === 0 ? hotel.name : 'Moment Mogador', text: `${hotel.destination} / ${hotel.category}` }))} label={`Galerie immersive ${hotel.name}`} />
      </section>

      {details?.facilities?.length ? (
        <section className="gm-facilities gm-page-section" aria-label="Équipements et prestations de l’hôtel">
          {details.facilities.map(([title, text]) => <article className="gm-reveal" key={title}><span>{title}</span><p>{text}</p></article>)}
        </section>
      ) : null}

      <section className="gm-room-showcase gm-room-showcase--cinema gm-page-section" aria-label="Hébergement">
        <div className="gm-room-showcase__intro gm-reveal">
          <span className="gm-label">Dormir</span>
          <h2>Chambres & suites</h2>
          <p>Choisissez l’atmosphère adaptée à votre séjour, consultez les informations utiles, puis réservez depuis le site officiel.</p>
        </div>
        <div className="gm-room-cinematic gm-reveal" role="region" aria-label={`Catégories d’hébergement ${hotel.name}`}>
          <div className="gm-room-tabs" aria-label="Choisir une chambre">
            {rooms.map((room, index) => (
              <button className={index === activeRoom ? 'is-active' : ''} type="button" onClick={() => setActiveRoom(index)} key={`${room.name}-tab`}>
                {room.name}
              </button>
            ))}
          </div>
          <div className="gm-room-cinematic__detail">
            <div className="gm-room-cinematic__gallery">
              <div className="gm-room-cinema-frame" data-direction={photoDirection}>
                <img src={visiblePhoto} alt={`${hotel.name} - ${activeRoomData.name}`} loading="lazy" key={`${activeRoomData.name}-${visiblePhoto}-${activePhoto}`} />
                <div className="gm-room-cinema-frame__shade" />
                <div className="gm-room-cinema-frame__border" />
                <div className="gm-room-cinema-frame__label"><i />{hotel.destination} / {hotel.category}</div>
                <div className="gm-room-cinema-frame__title">
                  <h3>{activeRoomData.name}</h3>
                  <span>Chambre sélectionnée</span>
                </div>
                <button type="button" onClick={() => goRoomPhoto(-1)} aria-label="Photo précédente">‹</button>
                <button type="button" onClick={() => goRoomPhoto(1)} aria-label="Photo suivante">›</button>
                <div className="gm-room-photo-progress">
                  <span>Photo</span>
                  <i key={`${activeRoom}-${activePhoto}`} />
                  <span>Galerie</span>
                </div>
              </div>
              <div className="gm-room-thumbs" style={{ '--thumb-count': Math.min(activePhotos.length, 7) }}>
                {activePhotos.slice(0, 7).map((photo, index) => (
                  <button className={index === activePhoto % activePhotos.length ? 'is-active' : ''} type="button" onClick={() => { setPhotoDirection(index > activePhoto ? 1 : -1); setActivePhoto(index) }} aria-label={`Photo ${index + 1}`} key={`${photo}-${index}`}>
                    <img src={photo} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            <article className="gm-room-info-card" key={`${activeRoomData.name}-desc`}>
              <span className="gm-room-corner gm-room-corner--tl" />
              <span className="gm-room-corner gm-room-corner--tr" />
              <span className="gm-room-corner gm-room-corner--bl" />
              <span className="gm-room-corner gm-room-corner--br" />
              <span className="gm-label">{hotel.family}</span>
              <h3>{activeRoomData.name}</h3>
              <i />
              <p>{activeRoomData.description}</p>
              <div>
                <strong>Repères utiles</strong>
                <ul>{activeRoomData.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </div>
              <footer>
                <Link to="/#reservation" data-track={`room_book_${hotel.slug}_${activeRoom}`}>Réserver</Link>
                <div>
                  <button type="button" onClick={() => goRoom(-1)} aria-label="Chambre précédente">‹</button>
                  <button type="button" onClick={() => goRoom(1)} aria-label="Chambre suivante">›</button>
                </div>
              </footer>
            </article>
          </div>
          <div className="gm-room-marquee" aria-hidden="true">
            <div>{[...rooms, ...rooms].map((room, index) => <span key={`${room.name}-${index}`}>{room.name}<i /></span>)}</div>
          </div>
        </div>
      </section>

      <section className="gm-scroll-overlays gm-page-section" aria-label="Moments de séjour">
        <article className="gm-scroll-overlays__copy gm-reveal">
          <span className="gm-label">Expérience client au coeur</span>
          <h2>Les moments clés de votre séjour.</h2>
          <p>Images, services et informations pratiques aident à choisir le bon séjour: famille, couple, affaires, détente ou événement.</p>
        </article>
        <div className="gm-scroll-overlays__media">
          {sliderImages.slice(0, 4).map((image, index) => (
            <figure className="gm-scroll-overlay-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={`${image}-overlay-${index}`}>
              <img src={image} alt={`${hotel.name} - moment de séjour ${index + 1}`} loading="lazy" />
              <figcaption>{['Arrivée', 'Hébergement', 'Table', 'Événement'][index] || 'Moment Mogador'}</figcaption>
            </figure>
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
        <GallerySlider items={(gallery.length ? gallery : sections.map((section) => section.image)).filter(Boolean).map((image) => ({ image, title: `${hotel.name}`, text: 'Galerie officielle' }))} label={`Galerie de l’hôtel ${hotel.name}`} />
      </section>

      <section className="gm-final gm-final--compact" aria-label="Réserver cet hôtel">
        <span className="gm-label">Réservation directe</span>
        <h2>Réserver {hotel.name} depuis le site officiel.</h2>
        <p>Le site officiel facilite le contact direct, les disponibilités et les demandes groupes ou MICE.</p>
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

function buildRoomPhotos(index, roomImages, gallery, fallback) {
  const ordered = [
    roomImages[index % roomImages.length],
    gallery[index % gallery.length],
    gallery[(index + 1) % gallery.length],
    roomImages[(index + 1) % roomImages.length],
    fallback,
  ].filter(Boolean)

  return [...new Set(ordered)]
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
