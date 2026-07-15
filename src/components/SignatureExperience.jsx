import Link from '../router/Link'
import { images } from '../data/images'

const defaultCards = [
  ['Choisir', 'Sélectionnez votre destination, votre hôtel et les services adaptés à votre séjour.'],
  ['Profiter', 'Chambres, restaurants, spa, piscines et espaces événementiels accompagnent chaque moment.'],
  ['Réserver', 'Réservez directement sur le site officiel ou contactez les équipes Mogador.'],
]

const variantCopy = {
  hotels: {
    eyebrow: 'Collection officielle',
    title: 'Des hôtels Mogador pour chaque séjour au Maroc.',
    text: 'Mogador rassemble des adresses pour dormir, célébrer, travailler, se détendre ou partir en famille, avec un accès direct à la réservation officielle.',
    image: images.legacy.menaraSalon,
  },
  destinations: {
    eyebrow: 'Destinations Mogador',
    title: 'Cinq villes pour découvrir le Maroc avec Mogador.',
    text: 'Marrakech, Tanger, Casablanca, Agadir et Essaouira accueillent vos séjours loisirs, affaires, famille et événements.',
    image: images.official.destinations.tanger,
  },
  experiences: {
    eyebrow: 'Art de vivre',
    title: 'Le séjour devient mémorable quand il dépasse la chambre.',
    text: 'Spa, hammam, table, piscine, salon, destination et rencontres composent une hospitalité qui se ressent dans le corps et reste dans la mémoire.',
    image: images.official.spa,
  },
  offers: {
    eyebrow: 'Offres officielles',
    title: 'Des offres pour organiser votre prochain séjour Mogador.',
    text: 'Retrouvez les avantages disponibles et choisissez l’offre adaptée à votre destination, vos dates et vos envies.',
    image: images.legacy.seaSuite,
  },
  mice: {
    eyebrow: 'Événements puissants',
    title: 'Des espaces Mogador pour vos événements au Maroc.',
    text: 'Congrès, séminaires, lancements, dîners et incentives trouvent chez Mogador des volumes, des équipes et des destinations capables de marquer les invités.',
    image: images.official.mice,
  },
  brand: {
    eyebrow: 'Hospitalité marocaine',
    title: 'Mogador Hotels & Resorts vous accueille au Maroc.',
    text: 'La marque réunit service, patrimoine, efficacité et chaleur humaine pour accompagner vos séjours, réunions et événements.',
    image: images.official.universe,
  },
}

export default function SignatureExperience({ variant = 'brand', title, text, image, cta = '/#reservation' }) {
  const copy = variantCopy[variant] || variantCopy.brand
  const finalTitle = title || copy.title
  const finalText = text || copy.text
  const finalImage = image || copy.image

  return (
    <section className={`gm-signature-experience gm-signature-experience--${variant}`} aria-label="Expérience signature Mogador">
      <figure className="gm-signature-experience__media gm-reveal">
        <img src={finalImage} alt={finalTitle} loading="lazy" decoding="async" />
        <figcaption>Site officiel / Mogador Hotels & Resorts</figcaption>
      </figure>
      <div className="gm-signature-experience__body gm-reveal">
        <span className="gm-label">{copy.eyebrow}</span>
        <h2>{finalTitle}</h2>
        <p>{finalText}</p>
        <div className="gm-signature-experience__cards">
          {defaultCards.map(([cardTitle, body]) => (
            <article key={cardTitle}>
              <strong>{cardTitle}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="gm-actions">
          <Link className="gm-button gm-button--primary" to={cta}>Réserver en direct</Link>
          <Link className="gm-button gm-button--secondary-dark" to="/contact">Parler à Mogador</Link>
        </div>
      </div>
    </section>
  )
}
