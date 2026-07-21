import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { aboutStory } from '../data/officialContent'
import { stats } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

export default function AboutPage({ t, lang }) {
  const copy = getInteriorCopy(lang).about
  useSeo({
    title: `${copy.eyebrow} | Mogador Hotels & Resorts`,
    description: copy.heroText,
    lang,
  })

  return (
    <div className="gm-page gm-about-page">
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.heroTitle}
        text={copy.heroText}
        image="/assets/legacy/sea-reception.jpg"
        primary={{ to: '#histoire', label: copy.storyCta }}
        secondary={{ to: '/hotels', label: copy.hotelsCta }}
        t={t}
      />

      <section className="gm-page-intro gm-page-section">
        <div>
          <span className="gm-label">{copy.positioningLabel}</span>
          <h2>{copy.positioning}</h2>
        </div>
        <div className="gm-rich-copy">
          <p>{copy.mission}</p>
          <p>{copy.vision}</p>
        </div>
      </section>

      <section id="histoire" className="gm-story-stack" aria-label={copy.historyAria}>
        {copy.story.map(([title, ...paragraphs], index) => (
          <article className={`gm-story-row ${index % 2 ? 'gm-story-row--reverse' : ''} gm-reveal`} key={title}>
            <figure>
              <img src={aboutStory[index].image} alt={title} loading="lazy" />
            </figure>
            <div>
              <h2>{title}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
        ))}
      </section>

      <section className="gm-values gm-page-section" aria-label={copy.valuesLabel}>
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">{copy.valuesLabel}</span>
          <h2>{copy.valuesTitle}</h2>
        </div>
        <div className="gm-values__showcase">
          <figure className="gm-values__visual gm-reveal">
            <img src="/assets/showcase/service-detail-portrait.webp" alt="" loading="lazy" />
            <figcaption>
              <div><span>{copy.valuesLabel}</span><strong>Mogador Hotels & Resorts</strong></div>
              <Link className="gm-button gm-button--primary" to="/#reservation">{copy.finalBook}</Link>
            </figcaption>
          </figure>
          <div className="gm-values__grid">
            {copy.values.map(([title, text], index) => (
              <article className="gm-reveal" style={{ '--delay': `${index * 60}ms` }} key={title}>
                <span className="gm-values__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chiffres" className="gm-numbers gm-numbers--page" aria-label={copy.statsLabels.join(', ')}>
        {stats.map((stat, index) => <article className="gm-reveal" key={stat.label}><strong>{stat.value}</strong><span>{copy.statsLabels[index] || stat.label}</span></article>)}
      </section>

      <section className="gm-final gm-final--compact" aria-label={copy.finalTitle}>
        <span className="gm-label">{copy.finalLabel}</span>
        <h2>{copy.finalTitle}</h2>
        <p>{copy.finalText}</p>
        <div className="gm-actions">
          <Link className="gm-button gm-button--primary" to="/hotels">{copy.finalHotels}</Link>
          <Link className="gm-button gm-button--secondary-dark" to="/#reservation">{copy.finalBook}</Link>
        </div>
      </section>
    </div>
  )
}
