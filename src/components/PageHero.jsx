import BookingBar from './BookingBar'
import Link from '../router/Link'
import { images } from '../data/images'

export default function PageHero({ eyebrow, title, text, scene = 'hero', image, primary, secondary, booking = false, compact = false, t }) {
  const heroImage = image || images.media[scene] || images.legacy.agdalPalace
  const journey = [
    eyebrow || 'Mogador',
    'Réserver en direct',
    'Vivre le Maroc',
  ]

  return (
    <section className={`gm-page-hero gm-owned-hero gm-page-hero--${scene} ${booking ? 'gm-page-hero--booking' : ''} ${compact ? 'gm-page-hero--compact' : ''}`}>
      <figure className="gm-page-hero__media" aria-hidden="true">
        <img src={heroImage} alt="" />
      </figure>
      <div className="gm-owned-hero__portal" aria-hidden="true"><span /><span /><span /></div>
      <aside className="gm-owned-hero__rail" aria-label="Parcours Mogador">
        {journey.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
      </aside>
      <div className="gm-page-hero__content reveal">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
        <div className="gm-page-hero__proof" aria-label="Preuves Mogador">
          <span>12 hôtels</span>
          <span>5 destinations</span>
          <span>3000 chambres</span>
        </div>
        <div className="gm-page-hero__conversion" aria-label="Avantages réservation directe">
          <strong>{t?.common?.directBooking || 'Réservation directe'}</strong>
          <span>{t?.common?.bestRate || 'Meilleur avantage direct'}</span>
          <span>{t?.common?.limited || 'Offres limitées selon disponibilité'}</span>
        </div>
        <div className="gm-actions">
          {primary ? <Link to={primary.to} className="gm-button gm-button--light" data-track={primary.track}>{primary.label}</Link> : null}
          {secondary ? <Link to={secondary.to} className="gm-button gm-button--outline-light" data-track={secondary.track}>{secondary.label}</Link> : null}
        </div>
      </div>
      <div className="gm-owned-hero__signature" aria-hidden="true">
        <span>Mogador Hotels & Resorts</span>
        <i />
        <span>Official booking</span>
      </div>
      <a className="gm-owned-hero__scroll" href="#content" aria-label="Descendre dans la page"><span />Explorer</a>
      {booking ? <div className="gm-page-hero__booking"><BookingBar t={t} /></div> : null}
    </section>
  )
}
