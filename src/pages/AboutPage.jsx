import PageHero from '../components/PageHero'
import SignatureExperience from '../components/SignatureExperience'
import Link from '../router/Link'
import { aboutStory } from '../data/officialContent'
import { brand, stats, values } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

export default function AboutPage({ t, lang }) {
  useSeo({
    title: 'Qui sommes-nous | Mogador Hotels & Resorts',
    description: aboutStory[0].paragraphs[0],
    lang,
  })

  return (
    <div className="gm-page gm-about-page">
      <PageHero
        eyebrow="Qui sommes-nous"
        title="Une marque marocaine, un art de vivre, une exigence de service."
        text={aboutStory[0].paragraphs[0]}
        image="/assets/legacy/sea-reception.jpg"
        primary={{ to: '/hotels', label: 'Découvrir les hôtels' }}
        secondary={{ to: '/contact', label: t.nav.contact }}
        t={t}
      />

      <SignatureExperience variant="brand" cta="/hotels" />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">Positionnement</span>
          <h2>{brand.positioning}</h2>
        </div>
        <div className="gm-rich-copy">
          <p>{brand.mission}</p>
          <p>{brand.vision}</p>
        </div>
      </section>

      <section className="gm-story-stack" aria-label="Histoire officielle Mogador">
        {aboutStory.map((section, index) => (
          <article className={`gm-story-row ${index % 2 ? 'gm-story-row--reverse' : ''} gm-reveal`} key={section.title}>
            <figure>
              <img src={section.image} alt={section.title} loading="lazy" />
            </figure>
            <div>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </section>

      <section className="gm-values gm-page-section" aria-label="Valeurs Mogador">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Valeurs</span>
          <h2>Une culture de service lisible, humaine et entièrement orientée client.</h2>
        </div>
        <div className="gm-values__grid">
          {values.map((value) => (
            <article className="gm-reveal" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-numbers gm-numbers--page" aria-label="Mogador en chiffres">
        {stats.map((stat) => <article className="gm-reveal" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></article>)}
      </section>

      <section className="gm-final gm-final--compact" aria-label="Continuer vers Mogador">
        <span className="gm-label">Site officiel</span>
        <h2>Passer de l’histoire à la réservation.</h2>
        <p>Découvrez les destinations, choisissez l’adresse adaptée à votre séjour et réservez directement auprès de Mogador Hotels & Resorts.</p>
        <div className="gm-actions">
          <Link className="gm-button gm-button--primary" to="/hotels">Voir les hôtels</Link>
          <Link className="gm-button gm-button--secondary-dark" to="/#reservation">Réserver</Link>
        </div>
      </section>
    </div>
  )
}
