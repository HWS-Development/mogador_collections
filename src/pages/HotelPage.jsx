import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import BookingBar from '../components/BookingBar'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { hotels } from '../data/siteData'
import { officialHotelDetails } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'
import { translateDestinationName, translateHotelLabel } from '../i18n/hotelLabels'
import NotFoundPage from './NotFoundPage'

export default function HotelPage({ slug, t, lang }) {
  const hotel = hotels.find((item) => item.slug === slug)
  const copy = getInteriorCopy(lang).hotel
  const details = hotel ? officialHotelDetails[hotel.slug] : null
  const [activeRoom, setActiveRoom] = useState(0)
  const [activePhoto, setActivePhoto] = useState(0)
  const [photoDirection, setPhotoDirection] = useState(1)
  const safeGallery = hotel?.gallery?.length ? hotel.gallery : [hotel?.image].filter(Boolean)

  useEffect(() => {
    setActiveRoom(0)
    setActivePhoto(0)
    setPhotoDirection(1)
  }, [slug])

  useEffect(() => {
    setActivePhoto(0)
    setPhotoDirection(1)
  }, [activeRoom])

  useSeo({
    title: hotel ? `${hotel.name} | ${hotel.destination} | Mogador Hotels & Resorts` : 'Hôtel introuvable | Mogador Hotels & Resorts',
    description: hotel?.baseline || 'Hôtel Mogador introuvable.',
    lang,
  })

  if (!hotel) return <NotFoundPage t={t} lang={lang} />

  const gallery = safeGallery
  const heroImage = hotel.image || gallery[0] || details?.sections?.[0]?.image || '/assets/legacy/menara-salon.jpg'
  const overview = lang === 'fr' ? (details?.overview || [hotel.description]) : [t.pages.hotel[1]]
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
    description: getRoomDescription(room, hotel, lang),
    facts: getRoomFacts(room, hotel, index, lang),
  }))
  const serviceGroups = buildServiceGroups(hotel, sections, gallery, heroImage, copy)
  const sliderImages = [...new Set([heroImage, ...gallery, ...sections.map((section) => section.image)].filter(Boolean))]
  const activeRoomData = rooms[activeRoom] || rooms[0]
  const activePhotos = activeRoomData?.photos?.length ? activeRoomData.photos : [activeRoomData?.image || accommodationImage].filter(Boolean)
  const visiblePhoto = activePhotos[activePhoto % activePhotos.length] || activeRoomData?.image || accommodationImage
  const facilities = details?.facilities?.map(([title, body]) => translateFacility(title, body, lang)) || []

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
      <PageHero eyebrow={`${translateDestinationName(hotel.destination, lang)} / ${translateHotelLabel(hotel.category, lang)}`} title={hotel.name} text={lang === 'fr' ? hotel.baseline : t.pages.hotel[1]} image={heroImage} primary={{ to: '/#reservation', label: t.common.bookDirect, hotel: hotel.name, destination: hotel.destination }} secondary={{ to: `/contact?request=reservation&hotel=${encodeURIComponent(hotel.name)}&destination=${encodeURIComponent(hotel.destination)}`, label: t.nav.contact }} t={t} />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">{details ? copy.detailLabel : copy.portfolioLabel}</span>
          <h2>{hotel.family} · {translateDestinationName(hotel.destination, lang)}</h2>
        </div>
        <div className="gm-rich-copy">
          {overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="gm-fact-line">
            {(hotel.facts || [hotel.destination, hotel.category, hotel.family]).map((fact) => <span key={fact}>{translateHotelLabel(fact, lang)}</span>)}
          </div>
        </div>
      </section>

      <section className="gm-hotel-booking-panel gm-page-section" aria-label={`Réserver ${hotel.name}`}>
        <div>
          <span className="gm-label">{copy.bookingLabel}</span>
          <h2>{copy.bookingTitle.replace('{hotel}', hotel.name)}</h2>
          <p>{copy.bookingText}</p>
        </div>
        <BookingBar key={hotel.slug} t={t} lang={lang} source={`hotel_${hotel.slug}`} initialDestination={hotel.destination} hotel={hotel.name} />
      </section>

      <section className="gm-hotel-slider gm-page-section" aria-label={`Galerie immersive ${hotel.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.immersionLabel}</span>
          <h2>{copy.immersionTitle}</h2>
          <p>{copy.immersionText}</p>
        </div>
        <GallerySlider items={sliderImages.map((image, index) => ({ image, title: index === 0 ? hotel.name : copy.immersionLabel, text: `${translateDestinationName(hotel.destination, lang)} / ${translateHotelLabel(hotel.category, lang)}` }))} label={`${copy.immersiveGallery} ${hotel.name}`} t={t} lang={lang} />
      </section>

      {facilities.length ? (
        <section className="gm-facilities gm-page-section" aria-label={copy.facilities}>
          {facilities.map(([title, body]) => <article className="gm-reveal" key={title}><span>{title}</span><p>{body}</p></article>)}
        </section>
      ) : null}

      <section className="gm-room-showcase gm-room-showcase--cinema gm-page-section" aria-label={copy.roomsTitle}>
        <div className="gm-room-showcase__intro gm-reveal">
          <span className="gm-label">{copy.sleep}</span>
          <h2>{copy.roomsTitle}</h2>
          <p>{copy.roomsText}</p>
        </div>
        <div className="gm-room-cinematic gm-reveal" role="region" aria-label={`Catégories d’hébergement ${hotel.name}`}>
          <div className="gm-room-tabs" aria-label={copy.chooseRoom}>
            {rooms.map((room, index) => (
              <button className={index === activeRoom ? 'is-active' : ''} type="button" onClick={() => setActiveRoom(index)} key={`${room.name}-tab`}>
                {translateHotelLabel(room.name, lang)}
              </button>
            ))}
          </div>
          <div className="gm-room-cinematic__detail">
            <div className="gm-room-cinematic__gallery">
              <div className="gm-room-cinema-frame" data-direction={photoDirection}>
                <img src={visiblePhoto} alt={`${hotel.name} - ${translateHotelLabel(activeRoomData.name, lang)}`} loading="lazy" key={`${activeRoomData.name}-${visiblePhoto}-${activePhoto}`} />
                <div className="gm-room-cinema-frame__shade" />
                <div className="gm-room-cinema-frame__border" />
                <div className="gm-room-cinema-frame__label"><i />{translateDestinationName(hotel.destination, lang)} / {translateHotelLabel(hotel.category, lang)}</div>
                <div className="gm-room-cinema-frame__title">
                  <h3>{translateHotelLabel(activeRoomData.name, lang)}</h3>
                <span>{copy.selectedRoom}</span>
                </div>
                <button type="button" onClick={() => goRoomPhoto(-1)} aria-label={copy.previousPhoto}>‹</button>
                <button type="button" onClick={() => goRoomPhoto(1)} aria-label={copy.nextPhoto}>›</button>
                <div className="gm-room-photo-progress">
                  <span>{copy.photo}</span>
                  <i key={`${activeRoom}-${activePhoto}`} />
                  <span>{copy.gallery}</span>
                </div>
              </div>
              <div className="gm-room-thumbs" style={{ '--thumb-count': Math.min(activePhotos.length, 7) }}>
                {activePhotos.slice(0, 7).map((photo, index) => (
                  <button className={index === activePhoto % activePhotos.length ? 'is-active' : ''} type="button" onClick={() => { setPhotoDirection(index > activePhoto ? 1 : -1); setActivePhoto(index) }} aria-label={`${copy.photo} ${index + 1}`} key={`${photo}-${index}`}>
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
              <h3>{translateHotelLabel(activeRoomData.name, lang)}</h3>
              <i />
              <p>{activeRoomData.description}</p>
              <div>
                <strong>{copy.useful}</strong>
                <ul>{activeRoomData.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </div>
              <footer>
                <Link to="/#reservation" data-track={`room_book_${hotel.slug}_${activeRoom}`} data-hotel={hotel.name} data-destination={hotel.destination}>{copy.book}</Link>
                <div>
                  <button type="button" onClick={() => goRoom(-1)} aria-label={copy.previousRoom}>‹</button>
                  <button type="button" onClick={() => goRoom(1)} aria-label={copy.nextRoom}>›</button>
                </div>
              </footer>
            </article>
          </div>
          <div className="gm-room-marquee" aria-hidden="true">
            <div>{[...rooms, ...rooms].map((room, index) => <span key={`${room.name}-${index}`}>{translateHotelLabel(room.name, lang)}<i /></span>)}</div>
          </div>
        </div>
      </section>

      <section className="gm-scroll-overlays gm-page-section" aria-label={copy.stayTitle}>
        <article className="gm-scroll-overlays__copy gm-reveal">
          <span className="gm-label">{copy.stayLabel}</span>
          <h2>{copy.stayTitle}</h2>
          <p>{copy.stayText}</p>
        </article>
        <div className="gm-scroll-overlays__media">
          {sliderImages.slice(0, 4).map((image, index) => (
            <figure className="gm-scroll-overlay-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={`${image}-overlay-${index}`}>
              <img src={image} alt={`${hotel.name} - moment de séjour ${index + 1}`} loading="lazy" />
              <figcaption>{copy.moments[index] || copy.immersionLabel}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="gm-service-matrix gm-page-section" aria-label={`Services et équipements ${hotel.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.servicesLabel}</span>
          <h2>{copy.servicesTitle}</h2>
        </div>
        <div className="gm-service-matrix__grid">
          {serviceGroups.map((group, index) => (
            <article className="gm-service-card gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={group.title}>
              <img src={group.image} alt={group.title} loading="lazy" />
              <div>
                <span>{group.label}</span>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
                <div>{group.items.slice(0, 8).map((item) => <small key={item}>{translateHotelLabel(item, lang)}</small>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-hotel-sections" aria-label={copy.servicesLabel}>
        {sections.map((section, index) => <HotelSection section={section} index={index} copy={copy} lang={lang} key={`${section.title}-${index}`} />)}
      </section>

      <section className="gm-hotel-gallery gm-page-section" aria-label={`${copy.gallery} ${hotel.name}`}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.gallery}</span>
          <h2>{copy.galleryTitle}</h2>
        </div>
        <GallerySlider items={(gallery.length ? gallery : sections.map((section) => section.image)).filter(Boolean).map((image) => ({ image, title: `${hotel.name}`, text: copy.officialGallery }))} label={`${copy.gallery} ${hotel.name}`} t={t} lang={lang} />
      </section>

      <section className="gm-final gm-final--compact" aria-label={copy.finalTitle.replace('{hotel}', hotel.name)}>
        <span className="gm-label">{copy.finalLabel}</span>
        <h2>{copy.finalTitle.replace('{hotel}', hotel.name)}</h2>
        <p>{copy.finalText}</p>
        <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/#reservation" data-hotel={hotel.name} data-destination={hotel.destination}>{t.common.bookDirect}</Link><Link className="gm-button gm-button--secondary-dark" to={`/contact?request=reservation&hotel=${encodeURIComponent(hotel.name)}&destination=${encodeURIComponent(hotel.destination)}`}>{copy.contact}</Link></div>
      </section>
    </div>
  )
}

function HotelSection({ section, index, copy, lang }) {
  const normalizedTitle = section.title.toLowerCase()
  const title = Object.entries(copy.sectionLabels).find(([key]) => normalizedTitle.includes(key))?.[1] || section.title
  return (
    <article className={`gm-hotel-section ${index % 2 ? 'gm-hotel-section--reverse' : ''} gm-reveal`}>
      <figure><img src={section.image} alt={title} loading="lazy" /></figure>
      <div>
        <h2>{title}</h2>
        {section.text && lang === 'fr' ? <p>{section.text}</p> : null}
        <div className="gm-feature-list">
          {section.items.map((item) => <span key={item}>{translateHotelLabel(item, lang)}</span>)}
        </div>
      </div>
    </article>
  )
}

function getRoomDescription(room, hotel, lang) {
  const normalized = room.toLowerCase()
  if (lang === 'en') return `This category is available at ${hotel.name}. Capacity, views and amenities are confirmed for your selected dates.`
  if (lang === 'ar') return `هذه الفئة متوفرة في ${hotel.name}. يتم تأكيد السعة والإطلالة والتجهيزات حسب التواريخ المختارة.`
  if (normalized.includes('suite')) return `Cette suite fait partie des catégories proposées par ${hotel.name}. La capacité, la vue et les équipements sont confirmés selon vos dates.`
  if (normalized.includes('appartement') || normalized.includes('studio')) return `Cet hébergement est disponible à ${hotel.name}. Consultez l’équipe pour confirmer sa capacité et ses équipements.`
  if (normalized.includes('twin') || normalized.includes('2 lits')) return `Cette chambre comprend deux couchages. Les disponibilités et la vue sont confirmées au moment de la réservation.`
  if (normalized.includes('grand lit') || normalized.includes('double')) return `Cette chambre comprend un grand lit. Les disponibilités et la vue sont confirmées au moment de la réservation.`
  return `Cette catégorie est proposée par ${hotel.name}, à ${hotel.destination}. Les détails sont confirmés selon les dates choisies.`
}

function getRoomFacts(room, hotel, index, lang) {
  const facts = [translateHotelLabel(hotel.category, lang), translateDestinationName(hotel.destination, lang)]
  const labels = lang === 'en'
    ? ['Lounge area', 'Kitchenette', 'Sea view', 'Family friendly']
    : lang === 'ar' ? ['فضاء جلوس', 'مطبخ صغير', 'إطلالة بحرية', 'مناسب للعائلة'] : ['Espace salon', 'Kitchenette', 'Vue mer', 'Idéal famille']
  if (/suite/i.test(room)) facts.push(labels[0])
  if (/appartement|studio/i.test(room)) facts.push(labels[1])
  if (/vue mer|sea/i.test(room)) facts.push(labels[2])
  if (/famille|2 lits|twin|double/i.test(room)) facts.push(labels[3])
  if (index === 0 && hotel.facts?.[0]) facts.push(translateHotelLabel(hotel.facts[0], lang))
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

function buildServiceGroups(hotel, sections, gallery, heroImage, copy) {
  const sectionImage = (name, fallback) => sections.find((section) => section.title.toLowerCase().includes(name))?.image || fallback

  return [
    {
      label: copy.serviceLabels[0][0],
      title: copy.serviceLabels[0][1],
      text: copy.serviceLabels[0][2],
      image: gallery[0] || heroImage,
      items: hotel.services?.length ? hotel.services : ['Réception', 'Wi-Fi', 'Contact direct', 'Accompagnement client'],
    },
    {
      label: copy.serviceLabels[1][0],
      title: copy.serviceLabels[1][1],
      text: copy.serviceLabels[1][2],
      image: sectionImage('restauration', '/assets/official/restaurant-official.jpg'),
      items: hotel.dining || ['Restaurant', 'Petit-déjeuner', 'Salon de thé'],
    },
    {
      label: copy.serviceLabels[2][0],
      title: copy.serviceLabels[2][1],
      text: copy.serviceLabels[2][2],
      image: sectionImage('loisirs', '/assets/official/spa-official.jpg'),
      items: hotel.wellness || ['Piscine', 'Hammam', 'Soins', 'Détente'],
    },
    {
      label: copy.serviceLabels[3][0],
      title: copy.serviceLabels[3][1],
      text: copy.serviceLabels[3][2],
      image: sectionImage('conférences', sectionImage('espace', '/assets/official/mice-official.jpg')),
      items: hotel.mice || ['Réunions', 'Groupes', 'Devis MICE'],
    },
  ]
}

function translateFacility(title, body, lang) {
  if (lang === 'fr') {
    const copy = {
      General: ['Général', 'Presse, climatisation, coffre-fort, chauffage, ascenseur et accessibilité.'],
      'High-tech': ['Équipements', 'Téléphone, télévision et Wi-Fi.'],
      Outdoors: ['Extérieurs', 'Piscine extérieure, terrasse ensoleillée et jardins.'],
      'To do': ['Bien-être', 'Sauna, fitness, solarium, spa, massages, hammam et piscine intérieure.'],
    }
    return copy[title] || [title, body]
  }
  if (lang === 'ar') {
    const copy = {
      General: ['عام', 'تكييف وخزنة وتدفئة ومصعد وتجهيزات لذوي الحركة المحدودة.'],
      'High-tech': ['التجهيزات', 'هاتف وتلفزيون وواي فاي.'],
      Outdoors: ['الفضاءات الخارجية', 'مسبح خارجي وتراس مشمس وحدائق.'],
      'To do': ['العافية', 'ساونا ولياقة وسبا وتدليك وحمام ومسبح داخلي.'],
    }
    return copy[title] || [title, body]
  }
  return [title, body]
}
