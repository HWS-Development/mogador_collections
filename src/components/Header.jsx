import { useEffect, useRef, useState } from 'react'
import { images } from '../data/images'
import { supportedLanguages } from '../i18n/translations'
import Link from '../router/Link'

const navRoutes = [
  ['home', '/', images.official.homeHero],
  ['about', '/a-propos', images.official.universe],
  ['destinations', '/destinations', images.official.destinations.marrakech],
  ['hotels', '/hotels', images.legacy.menaraSalon],
  ['experiences', '/experiences', images.official.spa],
  ['offers', '/offres', images.legacy.seaSuite],
  ['mice', '/reunions-evenements', images.official.mice],
  ['loyalty', '/programme-fidelite', images.official.restaurant],
  ['magazine', '/magazine', images.official.destinations.essaouira],
  ['contact', '/contact', images.official.team],
]

const menuGroups = [
  {
    title: 'Séjourner',
    promise: 'Choisir la chambre, la ville et la lumière qui donneront le ton du voyage.',
    image: images.legacy.menaraSalon,
    links: [
      ['Nos hôtels', '/hotels'],
      ['Marrakech', '/destinations#marrakech'],
      ['Tanger', '/destinations#tanger'],
      ['Agadir', '/destinations#agadir'],
    ],
  },
  {
    title: 'Ressentir',
    promise: 'Entrer dans les spas, les tables, les piscines et les moments qui prolongent le séjour.',
    image: images.official.spa,
    links: [
      ['Expériences', '/experiences'],
      ['Bien-être', '/experiences#wellness'],
      ['Tables & salons', '/experiences#gastronomy'],
      ['Magazine', '/magazine'],
    ],
  },
  {
    title: 'Se réunir',
    promise: 'Organiser réunions, congrès, séminaires et célébrations avec les équipes Mogador.',
    image: images.official.mice,
    links: [
      ['Réunions & événements', '/reunions-evenements'],
      ['Grand Palais', '/reunions-evenements#palais'],
      ['Demander un devis', '/contact'],
      ['Offres', '/offres'],
    ],
  },
  {
    title: 'Découvrir',
    promise: 'Comprendre l’univers Mogador, ses villes, ses avantages directs et le lien humain.',
    image: images.official.universe,
    links: [
      ['À propos', '/a-propos'],
      ['Destinations', '/destinations'],
      ['Fidélité', '/programme-fidelite'],
      ['Contact', '/contact'],
    ],
  },
]

const menuUtilities = [
  ['Accès et contact', '/contact'],
  ['Galerie & inspirations', '/magazine'],
  ['Tarifs et réservation', '/#reservation'],
]

export default function Header({ t, lang, setLang }) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(navRoutes[0][2])
  const menuRef = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('gm-menu-open', open)
    if (open) menuRef.current?.scrollTo({ top: 0, left: 0 })
    return () => document.body.classList.remove('gm-menu-open')
  }, [open])

  return (
    <header className={`site-header gm-owned-header ${open ? 'gm-owned-header--open' : ''}`}>
      <Link className="site-logo" to="/" aria-label="Accueil Mogador Hotels & Resorts">
        <img src={images.brand.logoWhite} alt="Mogador Hotels & Resorts" />
      </Link>
      <nav id="menu" ref={menuRef} className={`site-nav gm-owned-menu ${open ? 'site-nav--open' : ''}`} aria-label="Navigation principale">
        <button className="gm-owned-menu__close" type="button" onClick={() => setOpen(false)} aria-label="Fermer le menu"><span /></button>
        <div className="gm-owned-menu__visual" aria-hidden="true">
          <img src={preview} alt="" />
          <span>Choisir<br />Mogador</span>
        </div>
        <div className="gm-owned-menu__links">
          <div className="gm-owned-menu__quick" aria-label="Accès rapides">
            {navRoutes.slice(0, 6).map(([key, to, image], index) => (
              <Link to={to} key={key} onClick={() => setOpen(false)} onMouseEnter={() => setPreview(image)}>
                {t.nav[key]}
              </Link>
            ))}
          </div>
          <div className="gm-owned-menu__groups" aria-label="Parcours Mogador">
            {menuGroups.map((group, index) => (
              <article className="gm-owned-menu__group" key={group.title} onMouseEnter={() => setPreview(group.image)}>
                <h3>{group.title}</h3>
                <p>{group.promise}</p>
                <div>
                  {group.links.map(([label, to]) => (
                    <Link to={to} key={label} onClick={() => setOpen(false)}>{label}</Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="gm-owned-menu__utilities" aria-label="Accès utiles">
            {menuUtilities.map(([label, to]) => (
              <Link to={to} key={label} onClick={() => setOpen(false)}>{label}</Link>
            ))}
          </div>
        </div>
        <div className="gm-owned-menu__footer">
          <span>Site officiel · contact direct · meilleur avantage Mogador</span>
          <Link to="/#reservation" onClick={() => setOpen(false)}>Réserver maintenant</Link>
        </div>
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Langues disponibles">
          {supportedLanguages.map((code) => (
            <button className={code === lang ? 'is-active' : ''} type="button" key={code} onClick={() => setLang(code)}>{code.toUpperCase()}</button>
          ))}
        </div>
        <Link to="/#reservation" className="reserve-link" data-track="header_booking">{t.common.book}</Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
