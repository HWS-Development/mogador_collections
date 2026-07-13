import PageHero from '../components/PageHero'
import Link from '../router/Link'
import { useSeo } from '../hooks/usePageEffects'

export default function NotFoundPage({ t, lang }) {
  useSeo({ title: 'Page introuvable | Mogador Hotels & Resorts', description: 'La page demandée est introuvable.', lang })

  return (
    <div className="gm-page gm-not-found-page">
      <PageHero eyebrow="404" title="Page introuvable" text="Cette page n’existe pas encore dans l’architecture Mogador." image="/assets/legacy/menara-room.jpg" primary={{ to: '/', label: t.nav.home }} t={t} compact />
      <section className="gm-final gm-final--compact">
        <span className="gm-label">Orientation</span>
        <h2>Retourner vers le site officiel.</h2>
        <p>Les anciennes routes principales de Mogador sont redirigées vers leur nouvelle structure.</p>
        <div className="gm-actions"><Link className="gm-button gm-button--primary" to="/">Retour à l’accueil</Link></div>
      </section>
    </div>
  )
}
