import { useState } from 'react'
import { images } from '../data/images'
import { supportedLanguages } from '../i18n/translations'
import Link from '../router/Link'

const navRoutes = [
  ['home', '/'],
  ['about', '/a-propos'],
  ['destinations', '/destinations'],
  ['hotels', '/hotels'],
  ['experiences', '/experiences'],
  ['offers', '/offres'],
  ['mice', '/reunions-evenements'],
  ['loyalty', '/programme-fidelite'],
  ['magazine', '/magazine'],
  ['contact', '/contact'],
]

export default function Header({ t, lang, setLang }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <Link className="site-logo" to="/" aria-label="Accueil Mogador Hotels & Resorts">
        <img src={images.brand.logoWhite} alt="Mogador Hotels & Resorts" />
      </Link>
      <nav id="menu" className={`site-nav ${open ? 'site-nav--open' : ''}`} aria-label="Navigation principale">
        {navRoutes.map(([key, to]) => (
          <Link to={to} key={key} onClick={() => setOpen(false)}>{t.nav[key]}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Langues disponibles">
          {supportedLanguages.map((code) => (
            <button className={code === lang ? 'is-active' : ''} type="button" key={code} onClick={() => setLang(code)}>{code.toUpperCase()}</button>
          ))}
        </div>
        <Link to="/#reservation" className="reserve-link" data-track="header_booking">{t.common.book}</Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
