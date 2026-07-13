import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { mice } from '../data/siteData'
import { businessContent } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function MicePage({ t, lang }) {
  const [title, text] = t.pages.mice
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-mice-page">
      <PageHero eyebrow="Mogador for business" title={title} text={text} image="/assets/official/mice-official.jpg" primary={{ to: '/contact', label: t.common.quoteMice }} secondary={{ to: '/hotels', label: t.common.seeHotels }} t={t} />

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

      <section className="gm-business-sections" aria-label="Offre Mogador entreprise officielle">
        {businessContent.sections.map((section, index) => (
          <article className={`gm-business-row ${index % 2 ? 'gm-business-row--reverse' : ''} gm-reveal`} key={section.title}>
            <figure><img src={section.image} alt={section.title} loading="lazy" /></figure>
            <div>
              <span className="gm-label">{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
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
    </div>
  )
}
