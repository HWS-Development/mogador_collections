import { useEffect, useRef, useState } from 'react'
import { images } from '../data/images'
import { supportedLanguages } from '../i18n/translations'
import Link from '../router/Link'

const navRoutes = [
  ['home', '/', images.showcase.heroService],
  ['about', '/a-propos', images.official.universe],
  ['hotels', '/hotels', images.legacy.menaraSalon],
  ['destinations', '/destinations', images.official.destinations.marrakech],
  ['experiences', '/experiences', images.official.spa],
  ['mice', '/reunions-evenements', images.official.mice],
  ['offers', '/offres', images.legacy.seaSuite],
  ['loyalty', '/programme-fidelite', images.official.restaurant],
  ['magazine', '/magazine', images.official.destinations.essaouira],
  ['contact', '/contact', images.official.team],
]

const headerCopy = {
  fr: {
    story: ['Une histoire', 'marocaine'],
    groups: [
      ['Le Groupe', 'Découvrir l’histoire, la vision et les engagements qui relient toutes les maisons Mogador.', images.official.universe, [['Notre histoire', '/a-propos#histoire'], ['Nos destinations', '/destinations'], ['Nos expériences', '/experiences'], ['Le Groupe en chiffres', '/a-propos#chiffres']]],
      ['Nos maisons', 'Choisir la ville, l’atmosphère et l’adresse qui donneront le ton du voyage.', images.legacy.menaraSalon, [['Tous les hôtels', '/hotels'], ['Marrakech', '/destinations#marrakech'], ['Tanger', '/destinations#tanger'], ['Agadir', '/destinations#agadir']]],
      ['Vivre Mogador', 'Entrer dans les spas, les tables, les piscines et les moments qui prolongent le séjour.', images.official.spa, [['Expériences', '/experiences'], ['Bien-être', '/experiences#bien-etre'], ['Tables & salons', '/experiences#gastronomie'], ['Offres', '/offres']]],
      ['Se réunir', 'Organiser réunions, congrès, séminaires et célébrations avec les équipes Mogador.', images.official.mice, [['Réunions & événements', '/reunions-evenements'], ['Grand Palais', '/reunions-evenements#palais'], ['Demander un devis', '/contact?request=mice#contact-form'], ['Contact', '/contact']]],
    ],
    utilities: [['Accès et contact', '/contact'], ['Galerie & inspirations', '/magazine'], ['Tarifs et réservation', '/#reservation']],
    footer: 'Groupe hôtelier marocain · depuis 1999',
    reserve: 'Réserver maintenant',
    close: 'Fermer le menu',
    open: 'Ouvrir le menu',
    primary: 'Navigation principale',
    quick: 'Accès rapides',
    journeys: 'Parcours Mogador',
    useful: 'Accès utiles',
  },
  en: {
    story: ['A Moroccan', 'story'],
    groups: [
      ['The Group', 'Discover the story, vision and commitments connecting every Mogador hotel.', images.official.universe, [['Our story', '/a-propos#histoire'], ['Our destinations', '/destinations'], ['Our experiences', '/experiences'], ['The Group in figures', '/a-propos#chiffres']]],
      ['Our hotels', 'Choose the city, atmosphere and address that will set the tone for your journey.', images.legacy.menaraSalon, [['All hotels', '/hotels'], ['Marrakech', '/destinations#marrakech'], ['Tangier', '/destinations#tanger'], ['Agadir', '/destinations#agadir']]],
      ['Live Mogador', 'Enter the spas, restaurants, pools and moments that extend the stay.', images.official.spa, [['Experiences', '/experiences'], ['Wellness', '/experiences#bien-etre'], ['Dining & lounges', '/experiences#gastronomie'], ['Offers', '/offres']]],
      ['Come together', 'Plan meetings, congresses, seminars and celebrations with Mogador teams.', images.official.mice, [['Meetings & events', '/reunions-evenements'], ['Grand Palais', '/reunions-evenements#palais'], ['Request a proposal', '/contact?request=mice#contact-form'], ['Contact', '/contact']]],
    ],
    utilities: [['Access & contact', '/contact'], ['Gallery & inspiration', '/magazine'], ['Rates & booking', '/#reservation']],
    footer: 'Moroccan hotel group · since 1999',
    reserve: 'Book now',
    close: 'Close menu',
    open: 'Open menu',
    primary: 'Main navigation',
    quick: 'Quick access',
    journeys: 'Mogador journeys',
    useful: 'Useful links',
  },
  ar: {
    story: ['حكاية', 'مغربية'],
    groups: [
      ['المجموعة', 'اكتشفوا الحكاية والرؤية والالتزامات التي تجمع كل فنادق موغادور.', images.official.universe, [['حكايتنا', '/a-propos#histoire'], ['وجهاتنا', '/destinations'], ['تجاربنا', '/experiences'], ['المجموعة في أرقام', '/a-propos#chiffres']]],
      ['فنادقنا', 'اختاروا المدينة والأجواء والعنوان الذي سيمنح رحلتكم إيقاعها.', images.legacy.menaraSalon, [['كل الفنادق', '/hotels'], ['مراكش', '/destinations#marrakech'], ['طنجة', '/destinations#tanger'], ['أكادير', '/destinations#agadir']]],
      ['عيشوا موغادور', 'ادخلوا إلى عالم السبا والمطاعم والمسابح واللحظات التي تطيل متعة الإقامة.', images.official.spa, [['التجارب', '/experiences'], ['العافية', '/experiences#bien-etre'], ['المطاعم والصالونات', '/experiences#gastronomie'], ['العروض', '/offres']]],
      ['لنجتمع', 'نظموا الاجتماعات والمؤتمرات والندوات والاحتفالات مع فرق موغادور.', images.official.mice, [['الاجتماعات والفعاليات', '/reunions-evenements'], ['القصر الكبير', '/reunions-evenements#palais'], ['اطلبوا عرضا', '/contact?request=mice#contact-form'], ['اتصلوا بنا', '/contact']]],
    ],
    utilities: [['الوصول والاتصال', '/contact'], ['المعرض والإلهام', '/magazine'], ['الأسعار والحجز', '/#reservation']],
    footer: 'مجموعة فندقية مغربية · منذ 1999',
    reserve: 'احجزوا الآن',
    close: 'إغلاق القائمة',
    open: 'فتح القائمة',
    primary: 'التنقل الرئيسي',
    quick: 'الوصول السريع',
    journeys: 'مسارات موغادور',
    useful: 'روابط مفيدة',
  },
}

const primaryRoutes = [
  ['about', '/a-propos'],
  ['hotels', '/hotels'],
  ['destinations', '/destinations'],
  ['experiences', '/experiences'],
]

export default function Header({ t, lang, setLang, path }) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(navRoutes[0][2])
  const menuRef = useRef(null)
  const closeRef = useRef(null)
  const toggleRef = useRef(null)
  const copy = headerCopy[lang] || headerCopy.fr

  useEffect(() => {
    document.body.classList.toggle('gm-menu-open', open)
    if (open) {
      menuRef.current?.scrollTo({ top: 0, left: 0 })
      window.requestAnimationFrame(() => closeRef.current?.focus())
    }
    return () => document.body.classList.remove('gm-menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        window.requestAnimationFrame(() => toggleRef.current?.focus())
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(menuRef.current?.querySelectorAll('a[href], button:not([disabled])') || [])
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const currentPath = path || window.location.pathname
  const isHome = currentPath === '/'
  const isCurrentRoute = (to) => currentPath === to || (to !== '/' && currentPath.startsWith(`${to}/`))

  return (
    <header className={`site-header gm-owned-header ${isHome ? 'gm-story-header' : 'gm-interior-header'} ${open ? 'gm-owned-header--open' : ''}`}>
      <Link className="site-logo" to="/" aria-label="Accueil Mogador Hotels & Resorts">
        <img className="site-logo__standard" src={images.brand.logo} alt="Mogador Hotels & Resorts" />
        <img className="site-logo__inverse" src={images.brand.logoWhite} alt="" aria-hidden="true" />
      </Link>
      <nav className="gm-header-primary" aria-label={copy.primary}>
        {primaryRoutes.map(([key, to]) => (
          <Link to={to} key={key} aria-current={isCurrentRoute(to) ? 'page' : undefined}>
            {t.nav[key]}
          </Link>
        ))}
      </nav>
      <nav id="menu" ref={menuRef} className={`site-nav gm-owned-menu ${open ? 'site-nav--open' : ''}`} aria-label={copy.primary} aria-hidden={!open} inert={open ? undefined : true}>
        <button ref={closeRef} className="gm-owned-menu__close" type="button" onClick={() => setOpen(false)} aria-label={copy.close}><span /></button>
        <div className="gm-owned-menu__visual" aria-hidden="true">
          <img src={preview} alt="" />
          <span>{copy.story[0]}<br />{copy.story[1]}</span>
        </div>
        <div className="gm-owned-menu__links">
          <div className="gm-owned-menu__quick" aria-label={copy.quick}>
            {navRoutes.map(([key, to, image]) => (
              <Link to={to} key={key} onClick={() => setOpen(false)} onMouseEnter={() => setPreview(image)} onFocus={() => setPreview(image)} aria-current={isCurrentRoute(to) ? 'page' : undefined}>
                {t.nav[key]}
              </Link>
            ))}
          </div>
          <div className="gm-owned-menu__groups" aria-label={copy.journeys}>
            {copy.groups.map(([title, promise, image, links]) => (
              <article className="gm-owned-menu__group" key={title} onMouseEnter={() => setPreview(image)} onFocus={() => setPreview(image)}>
                <h3>{title}</h3>
                <p>{promise}</p>
                <div>
                  {links.map(([label, to]) => (
                    <Link to={to} key={label} onClick={() => setOpen(false)}>{label}</Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="gm-owned-menu__utilities" aria-label={copy.useful}>
            {copy.utilities.map(([label, to]) => (
              <Link to={to} key={label} onClick={() => setOpen(false)}>{label}</Link>
            ))}
          </div>
        </div>
        <div className="gm-owned-menu__footer">
          <span>{copy.footer}</span>
          <div className="gm-owned-menu__languages" aria-label="Langues disponibles">
            {supportedLanguages.map((code) => (
              <button className={code === lang ? 'is-active' : ''} type="button" key={code} onClick={() => setLang(code)}>{code.toUpperCase()}</button>
            ))}
          </div>
          <Link to="/#reservation" onClick={() => setOpen(false)}>{copy.reserve}</Link>
        </div>
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Langues disponibles">
          {supportedLanguages.map((code) => (
            <button className={code === lang ? 'is-active' : ''} type="button" key={code} onClick={() => setLang(code)}>{code.toUpperCase()}</button>
          ))}
        </div>
        <Link to="/#reservation" className="reserve-link" data-track="header_booking">{t.common.book}</Link>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((value) => !value)} aria-label={open ? copy.close : copy.open}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
