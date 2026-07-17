import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { useSeo } from '../hooks/usePageEffects'
import { getInteriorCopy } from '../i18n/interiorCopy'

export default function NotFoundPage({ t, lang }) {
  const copy = getInteriorCopy(lang).notFound
  useSeo({ title: `${copy.seo} | Mogador Hotels & Resorts`, description: copy.text, lang })

  return (
    <div className="gm-page gm-not-found-page">
      <PageHero eyebrow={copy.eyebrow} title={copy.title} text={copy.text} image="/assets/legacy/menara-room.jpg" primary={{ to: '/', label: t.nav.home }} t={t} compact />
      <section className="gm-final gm-final--compact">
        <span className="gm-label">{copy.label}</span>
        <h2>{copy.finalTitle}</h2>
        <p>{copy.finalText}</p>
        <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/">{copy.home}</Link></div>
      </section>
    </div>
  )
}
