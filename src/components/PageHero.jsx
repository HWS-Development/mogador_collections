import Link from '../router/Link'
import { images } from '../data/images'

export default function PageHero({ eyebrow, title, text, scene = 'hero', image, primary, secondary, compact = false, t }) {
  const heroImage = image || images.media[scene] || images.legacy.agdalPalace
  const chrome = t?.common || {}

  return (
    <section className={`gm-page-hero gm-owned-hero gm-page-hero--${scene} ${compact ? 'gm-page-hero--compact' : ''}`}>
      <figure className="gm-page-hero__media" aria-hidden="true">
        <img src={heroImage} alt="" fetchPriority="high" decoding="async" />
        <span className="gm-page-hero__veil" />
      </figure>
      <div className="gm-page-hero__content">
        {eyebrow ? <span className="eyebrow"><i aria-hidden="true" />{eyebrow}</span> : null}
        <h1><span>{title}</span></h1>
        {text ? <p>{text}</p> : null}
        <div className="gm-actions">
          {primary ? <Link to={primary.to} className="gm-button gm-button--light" data-track={primary.track} data-hotel={primary.hotel} data-destination={primary.destination} data-offer={primary.offer}>{primary.label}</Link> : null}
          {secondary ? <Link to={secondary.to} className="gm-button gm-button--outline-light" data-track={secondary.track} data-hotel={secondary.hotel} data-destination={secondary.destination} data-offer={secondary.offer}>{secondary.label}</Link> : null}
        </div>
      </div>
      <div className="gm-page-hero__meta" aria-hidden="true">
        <span>{chrome.collection || 'Collection Mogador'}</span>
        <span>{chrome.countrySince || 'Maroc · depuis 1999'}</span>
      </div>
      <div className="gm-page-hero__scroll" aria-hidden="true">
        <span />
        <small>{chrome.continue || 'Découvrir la suite'}</small>
      </div>
    </section>
  )
}
