import { brand } from '../data/siteData'
import Link from '../router/Link'

export default function ConversionDock({ t }) {
  const dockActions = [
    [t.common.book, '/#reservation', 'dock_booking'],
    [t.nav.offers, '/offres', 'dock_offers'],
    [t.nav.hotels, '/hotels', 'dock_hotels'],
    [t.nav.mice, '/reunions-evenements', 'dock_mice'],
  ]

  return (
    <aside className="conversion-dock" aria-label={t.common.quickAccess}>
      <div className="conversion-dock__proof">
        <span>{t.common.official}</span>
        <strong>{t.common.bestRate}</strong>
      </div>
      <nav className="conversion-dock__actions" aria-label={t.common.quickAccess}>
        {dockActions.map(([label, to, track]) => (
          <Link to={to} data-track={track} key={track}>{label}</Link>
        ))}
        <a href={`tel:${brand.phone.replaceAll(' ', '')}`} data-track="dock_call">{t.common.call}</a>
      </nav>
    </aside>
  )
}
