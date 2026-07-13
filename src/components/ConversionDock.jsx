import { brand } from '../data/siteData'
import Link from '../router/Link'

export default function ConversionDock({ t }) {
  return (
    <aside className="conversion-dock" aria-label="Actions de réservation Mogador">
      <div className="conversion-dock__proof">
        <span>{t.common.official}</span>
        <strong>{t.common.bestRate}</strong>
      </div>
      <div className="conversion-dock__actions">
        <Link to="/#reservation" data-track="dock_booking">{t.common.bookDirect}</Link>
        <Link to="/reunions-evenements" data-track="dock_mice">{t.common.quoteMice}</Link>
        <a href={`tel:${brand.phone}`} data-track="dock_call">{t.common.call}</a>
      </div>
    </aside>
  )
}
