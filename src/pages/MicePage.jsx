import PageHero from '../components/PageHero'
import GallerySlider from '../components/GallerySlider'
import Link from '../router/Link'
import { hotels, mice } from '../data/siteData'
import { businessContent } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

const seminarOffer = [
  ['Séminaires d’entreprise', 'Journées d’étude, formations, codir et réunions régionales dans des salles équipées.'],
  ['Soirées d’entreprise & afterworks', 'Dîners, cocktails, réceptions privées et temps forts de marque dans un cadre marocain.'],
  ['Team building & cohésion', 'Activités sur mesure autour de Marrakech, de l’océan, de la gastronomie et du bien-être.'],
  ['Cocktails déjeunatoires ou dînatoires', 'Formats debout, buffets, pauses gourmandes et scénographies adaptées au rythme de l’événement.'],
  ['Animations sur mesure', 'Accueil, logistique, technique, restauration, hébergement et expériences locales coordonnées.'],
  ['Location de salles équipées', 'Salles modulables, sous-commissions, plénières, amphithéâtre et accompagnement opérationnel.'],
]

const seminarTypes = [
  {
    title: 'Hôtels Essentiels',
    text: 'Des adresses efficaces pour réunions, formations, groupes corporate et séjours d’affaires, avec des espaces fonctionnels et des services directs.',
  },
  {
    title: 'Hôtels Expériences',
    text: 'Des hôtels qui vont plus loin: hébergement, restauration, bien-être, team building et expériences locales pour créer un événement mémorable.',
  },
]

const businessRows = [
  {
    title: 'Un réseau pour travailler, recevoir et rassembler',
    label: '01',
    image: '/assets/official/business-space-official.jpg',
    paragraphs: [
      'Au-delà de l’accès à des destinations attractives comme Marrakech, Casablanca, Tanger, Agadir et Essaouira, Mogador réunit salles équipées, espaces modulables, hébergement, restauration et accompagnement dédié.',
      'Nos équipes vous aident à choisir le cadre idéal, le format juste et le programme le plus fluide pour vos participants.',
    ],
  },
  {
    title: 'Des événements sur mesure, de 10 à 6000 invités',
    label: '02',
    image: '/assets/official/mice-official.jpg',
    paragraphs: [
      'Du comité de direction au symposium, du dîner de gala au team building, chaque demande est pensée comme une composition: capacité, timing, technique, pauses, restauration et expérience.',
      'Petites salles, sous-commissions, plénières, espaces combinables et palais des congrès permettent de construire une réponse adaptée à chaque ambition.',
    ],
  },
  {
    title: 'Le Grand Palais des Congrès Agdal',
    label: '03',
    image: 'https://u.profitroom.pl/2020-mogadorhotels-com/thumb/0x900/uploads/Agdal/37.jpg',
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
  ['https://u.profitroom.pl/2020-mogadorhotels-com/thumb/0x900/uploads/Agdal/37.jpg', 'Grand Palais', 'Composer un événement de grande capacité'],
  ['https://u.profitroom.pl/2020-mogadorhotels-com/thumb/0x900/uploads/stock/business.jpg', 'Réunions', 'Réserver une salle équipée et modulable'],
  ['/assets/official/restaurant-official.jpg', 'Réceptions', 'Ajouter cocktails, pauses gourmandes et dîners privés'],
  ['/assets/official/spa-official.jpg', 'Incentive', 'Associer travail, détente et expériences bien-être'],
]

const seminarFaq = [
  ['Quels types d’événements pouvez-vous organiser ?', 'Séminaires d’entreprise, codir, congrès, lancements de produit, soirées corporate, cocktails, incentives, groupes affaires et événements privés.'],
  ['Où sont situés les lieux Mogador ?', 'Marrakech concentre les plus grandes capacités, notamment autour du Grand Palais des Congrès. Casablanca, Tanger, Agadir et Essaouira complètent le réseau pour les formats business et destination.'],
  ['Comment demander un devis ?', 'Contactez l’équipe Mogador avec votre destination, vos dates, le nombre de participants, le format souhaité et les besoins en hébergement, restauration ou technique.'],
  ['Peut-on interroger plusieurs hôtels ?', 'Oui. L’équipe commerciale peut orienter la demande vers plusieurs établissements du groupe afin de proposer la solution la plus adaptée.'],
]

export default function MicePage({ t, lang }) {
  const [title, text] = t.pages.mice
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-mice-page gm-mice-page--seminar">
      <PageHero eyebrow="Mogador for business" title={title} text={text} image="/assets/official/mice-official.jpg" primary={{ to: '/contact', label: t.common.quoteMice }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

      <section className="gm-seminar-finder gm-page-section" aria-label="Trouver le lieu idéal pour votre événement">
        <div className="gm-seminar-finder__intro gm-reveal">
          <span className="gm-label">Trouver le lieu idéal</span>
          <h2>Un événement professionnel au Maroc, orchestré avec un seul interlocuteur.</h2>
          <p>Choisissez une destination, une capacité et une intention: nos équipes vous orientent vers l’hôtel, la salle et le format les plus adaptés.</p>
        </div>
        <form className="gm-seminar-search gm-reveal">
          <label><span>Destination</span><select defaultValue="Marrakech"><option>Marrakech</option><option>Casablanca</option><option>Tanger</option><option>Agadir</option><option>Essaouira</option></select></label>
          <label><span>Capacité</span><select defaultValue="50 et plus"><option>0 - 20</option><option>20 - 50</option><option>50 et plus</option><option>500 et plus</option></select></label>
          <label><span>Format</span><select defaultValue="Séminaire"><option>Séminaire</option><option>Congrès</option><option>Cocktail</option><option>Team building</option></select></label>
          <Link className="gm-button gm-button--primary" to="/contact">Demander un devis</Link>
        </form>
      </section>

      <section className="gm-mice-command gm-page-section">
        <div>
          <span className="gm-label">{businessContent.title}</span>
          <h2>{mice.title}</h2>
          <p>{mice.text}</p>
          <Link className="gm-button gm-button--primary" to="/contact">{t.common.quoteMice}</Link>
        </div>
        <div className="gm-mice-command__stats">
          {mice.stats.map((stat) => <article key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
        </div>
      </section>

      <section className="gm-seminar-editorial gm-page-section" aria-label="Organisation de séminaires Mogador">
        <div className="gm-reveal">
          <span className="gm-label">Séminaires & événements</span>
          <h2>Organisez vos séminaires au coeur des destinations Mogador.</h2>
        </div>
        <div className="gm-reveal">
          <p>Chez Mogador Hotels & Resorts, nous imaginons des événements professionnels qui sortent du cadre habituel: au coeur de Marrakech, dans une adresse urbaine à Casablanca, face à la mer à Tanger, ou dans une destination plus douce à Agadir et Essaouira.</p>
          <p>Nous vous accompagnons dans la création d’événements sur mesure, pensés pour allier travail, convivialité, hébergement, restauration, bien-être et découverte. Offrez à vos équipes plus qu’un séminaire: un lieu de caractère, des expériences locales et des moments de partage qui créent du lien.</p>
          <p><strong>Pour répondre à vos besoins, Mogador distingue deux approches: Essentiel et Expérience. Elles vous permettent de choisir facilement l’établissement et le niveau d’accompagnement les plus adaptés à votre événement.</strong></p>
        </div>
      </section>

      <section className="gm-seminar-types gm-page-section" aria-label="Typologies d’hôtels séminaires Mogador">
        {seminarTypes.map((type, index) => (
          <article className="gm-reveal" style={{ '--delay': `${index * 80}ms` }} key={type.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{type.title}</h3>
            <p>{type.text}</p>
          </article>
        ))}
      </section>

      <section className="gm-seminar-offer gm-page-section" aria-label="Notre offre séminaires">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Notre offre séminaires</span>
          <h2>Des formats clairs, une exécution fluide, une expérience mémorable.</h2>
        </div>
        <div className="gm-seminar-offer__grid">
          {seminarOffer.map(([item, body], index) => (
            <article className="gm-reveal" style={{ '--delay': `${index * 55}ms` }} key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-business-sections" aria-label="Offre Mogador entreprise premium">
        {businessRows.map((section, index) => (
          <article className={`gm-business-row ${index % 2 ? 'gm-business-row--reverse' : ''} gm-reveal`} key={section.title}>
            <figure><img src={section.image} alt={section.title} loading="lazy" /></figure>
            <div>
              <span className="gm-label">{section.label}</span>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </section>

      <section className="gm-seminar-venues gm-page-section" aria-label="Lieux séminaires Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Lieux recommandés</span>
          <h2>Trouvez le lieu idéal pour votre séminaire.</h2>
          <Link to="/hotels">Voir nos hôtels séminaires</Link>
        </div>
        <div className="gm-seminar-venues__grid">
          {seminarLocations.map((hotel, index) => (
            <article className="gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={hotel.slug}>
              <img src={hotel.image || hotel.gallery?.[0]} alt={hotel.name} loading="lazy" />
              <div>
                <span>{hotel.destination}, Maroc</span>
                <h3>{hotel.name}</h3>
                <ul>{hotel.mice.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                <div><Link to={`/hotels/${hotel.slug}`}>Voir les expériences</Link><Link to="/contact">Demander un devis</Link></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-page-section gm-event-types" aria-label="Types d’événements">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Types d’événements</span>
          <h2>Du comité restreint au congrès de grande capacité.</h2>
        </div>
        <div className="gm-feature-list gm-feature-list--large gm-reveal">
          {mice.eventTypes.map((type) => <span key={type}>{type}</span>)}
        </div>
      </section>

      <section className="gm-seminar-faq gm-page-section" aria-label="FAQ séminaires Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">FAQ</span>
          <h2>Les réponses utiles avant votre demande.</h2>
        </div>
        <div className="gm-seminar-faq__list">
          {seminarFaq.map(([question, answer]) => <details className="gm-reveal" key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="gm-seminar-human gm-page-section" aria-label="Accompagnement événementiel Mogador">
        <div className="gm-reveal">
          <span className="gm-label">L’humain au coeur de votre événement</span>
          <h2>Une équipe commerciale vous accompagne à chaque étape.</h2>
          <p>Besoin d’un conseil, d’un devis ou d’un cadrage rapide ? Nos équipes vous aident à préciser vos besoins, comparer les options et composer une proposition cohérente.</p>
          <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/contact">Envoyer une demande</Link><a className="gm-button gm-button--secondary-dark" href="tel:+212530530520">Appeler</a></div>
        </div>
        <figure className="gm-reveal"><img src="/assets/official/team-official.jpg" alt="Équipe Mogador" loading="lazy" /></figure>
      </section>

      <section className="gm-offer-gallery gm-mice-gallery gm-page-section" aria-label="Galerie réunions et événements Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Galerie</span>
          <h2>Les ambiances Mogador à composer autour de votre événement.</h2>
        </div>
        <GallerySlider items={miceGallery} label="Galerie réunions et événements Mogador" />
      </section>
    </div>
  )
}
