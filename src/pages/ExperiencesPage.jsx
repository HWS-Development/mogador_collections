import PageHero from '../components/PageHero'
import Icon from '../components/Icon'
import Link from '../router/Link'
import { brandMoments, experiences } from '../data/siteData'
import { useSeo } from '../hooks/usePageEffects'

export default function ExperiencesPage({ t, lang }) {
  const [title, text] = t.pages.experiences
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-experiences-page">
      <PageHero eyebrow="Expériences" title={title} text={text} image="/assets/official/spa-official.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} secondary={{ to: '/destinations', label: t.nav.destinations }} t={t} />

      <section className="gm-brand-moments" aria-label="Expériences officielles Mogador">
        {brandMoments.map((moment, index) => (
          <article className={`gm-story-row ${index % 2 ? 'gm-story-row--reverse' : ''} gm-reveal`} key={moment.title}>
            <figure><img src={moment.image} alt={moment.title} loading="lazy" /></figure>
            <div>
              <span className="gm-label">{moment.label}</span>
              <h2>{moment.title}</h2>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="gm-page-section gm-experience-index" aria-label="Catégories d’expériences">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Catégories</span>
          <h2>Des portes d’entrée orientées séjour, pas des cartes interchangeables.</h2>
        </div>
        <div className="gm-experience-index__grid">
          {experiences.map((experience, index) => (
            <article className="gm-reveal" style={{ '--delay': `${index * 70}ms` }} key={experience.slug}>
              <Icon name={index === 0 ? 'spa' : index === 1 ? 'dining' : index === 2 ? 'leisure' : 'local'} />
              <h3>{experience.title}</h3>
              <p>{experience.text}</p>
              <div className="gm-keyword-line">{experience.moments.map((moment) => <span key={moment}>{moment}</span>)}</div>
              <Link to="/#reservation">Réserver une expérience</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
