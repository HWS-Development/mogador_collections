import { useEffect, useState } from 'react'
import { activeHotels, brand, destinations } from '../data/siteData'
import { images } from '../data/images'
import Link from '../router/Link'
import { translateDestinationName } from '../i18n/hotelLabels'

const footerCopy = {
  fr: {
    official: 'Site officiel Mogador',
    title: 'Recevoir les actualités et offres Mogador.',
    text: 'Inscrivez-vous pour recevoir les offres officielles, nouveautés hôtelières et informations utiles sur les destinations Mogador.',
    positioning: brand.positioning,
    email: 'Email',
    placeholder: 'votre@email.com',
    subscribe: 'S’inscrire',
    status: 'Votre messagerie va s’ouvrir pour confirmer votre inscription.',
    subject: 'Inscription aux actualités Mogador',
    body: 'Je souhaite recevoir les actualités Mogador à l’adresse {email}.',
    information: 'Informations',
    journal: 'Le carnet Mogador',
    since: 'Depuis 1999',
    copyright: '© Mogador Hotels & Resorts. Site officiel du groupe.',
  },
  en: {
    official: 'Official Mogador website',
    title: 'Receive Mogador news and offers.',
    text: 'Sign up for official offers, hotel news and useful inspiration from Mogador destinations.',
    positioning: 'A collection of Moroccan hotels, a sincere art of welcoming and stays that remain in memory.',
    email: 'Email',
    placeholder: 'your@email.com',
    subscribe: 'Subscribe',
    status: 'Your email app will open to confirm your subscription.',
    subject: 'Mogador news subscription',
    body: 'I would like to receive Mogador news at {email}.',
    information: 'Information',
    journal: 'The Mogador journal',
    since: 'Since 1999',
    copyright: '© Mogador Hotels & Resorts. Official Group website.',
  },
  ar: {
    official: 'الموقع الرسمي لموغادور',
    title: 'توصلوا بأخبار وعروض موغادور.',
    text: 'سجلوا للحصول على العروض الرسمية وأخبار الفنادق والمعلومات المفيدة عن وجهات موغادور.',
    positioning: 'مجموعة من الفنادق المغربية، وفن صادق في الاستقبال، وإقامات تبقى في الذاكرة.',
    email: 'البريد الإلكتروني',
    placeholder: 'name@email.com',
    subscribe: 'التسجيل',
    status: 'سيفتح تطبيق البريد لتأكيد تسجيلكم.',
    subject: 'التسجيل في أخبار موغادور',
    body: 'أرغب في تلقي أخبار موغادور على البريد {email}.',
    information: 'معلومات',
    journal: 'دفتر موغادور',
    since: 'منذ 1999',
    copyright: '© فنادق ومنتجعات موغادور. الموقع الرسمي للمجموعة.',
  },
}

export default function Footer({ t, lang }) {
  const [newsletterStatus, setNewsletterStatus] = useState('')
  const [mobileFooter, setMobileFooter] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const [openGroup, setOpenGroup] = useState(null)
  const copy = footerCopy[lang] || footerCopy.fr

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')
    const onChange = (event) => {
      setMobileFooter(event.matches)
      if (!event.matches) setOpenGroup(null)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const handleNewsletter = (event) => {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    setNewsletterStatus(copy.status)
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(copy.body.replace('{email}', email))}`
  }

  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__decor" aria-hidden="true">
        <img src={images.brand.mark} alt="" />
      </div>
      <section className="site-footer__signature" aria-label={copy.positioning}>
        <div className="site-footer__identity">
          <span>{copy.official}</span>
          <Link className="site-footer__logo-stage reveal" to="/" aria-label="Mogador Hotels & Resorts">
            <i aria-hidden="true" />
            <img src={images.brand.logo} alt="" />
          </Link>
          <small>{copy.since}</small>
        </div>
        <div className="site-footer__promise reveal" style={{ '--delay': '100ms' }}>
          <h2>{copy.positioning}</h2>
          <div>
            <Link className="site-footer__book" to="/#reservation" data-track="footer_booking">{t.common.book}</Link>
            <Link className="site-footer__contact" to="/contact">{t.nav.contact}</Link>
          </div>
        </div>
      </section>
      <section className="gm-owned-prefooter" aria-label={copy.official}>
        <div className="site-footer__newsletter-copy">
          <span>{copy.journal}</span>
          <h3>{copy.title}</h3>
          <p>{copy.text}</p>
        </div>
        <form className="site-footer__newsletter-form" onSubmit={handleNewsletter}>
          <label><span>{copy.email}</span><input name="email" type="email" autoComplete="email" placeholder={copy.placeholder} required /></label>
          <button type="submit">{copy.subscribe}</button>
          <small aria-live="polite">{newsletterStatus}</small>
        </form>
      </section>
      <nav className="site-footer__grid" aria-label={t.nav.information || copy.information}>
        <FooterGroup id="destinations" title={t.nav.destinations} mobile={mobileFooter} open={openGroup === 0} onToggle={() => setOpenGroup(openGroup === 0 ? null : 0)}>
          {destinations.map((destination) => <Link key={destination.slug} to={`/destinations#${destination.slug}`}>{translateDestinationName(destination.name, lang)}</Link>)}
        </FooterGroup>
        <FooterGroup id="hotels" title={t.nav.hotels} mobile={mobileFooter} open={openGroup === 1} onToggle={() => setOpenGroup(openGroup === 1 ? null : 1)}>
          {activeHotels.map((hotel) => <Link key={hotel.slug} to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>)}
        </FooterGroup>
        <FooterGroup id="information" title={copy.information} mobile={mobileFooter} open={openGroup === 2} onToggle={() => setOpenGroup(openGroup === 2 ? null : 2)}>
          <Link to="/a-propos">{t.nav.about}</Link>
          <Link to="/offres">{t.nav.offers}</Link>
          <Link to="/reunions-evenements">{t.nav.mice}</Link>
          <Link to="/programme-fidelite">{t.nav.loyalty}</Link>
          <Link to="/magazine">{t.nav.magazine}</Link>
        </FooterGroup>
        <FooterGroup id="contact" title={t.nav.contact} mobile={mobileFooter} open={openGroup === 3} onToggle={() => setOpenGroup(openGroup === 3 ? null : 3)}>
          <a href={`tel:${brand.phone}`}>{brand.phone}</a>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <span>{brand.website}</span>
        </FooterGroup>
      </nav>
      <div className="site-footer__bottom">
        <span>{copy.copyright}</span>
        <Link to="/contact">{t.nav.contact}</Link>
      </div>
    </footer>
  )
}

function FooterGroup({ id, title, mobile, open, onToggle, children }) {
  const contentId = `footer-${id}`
  return (
    <section className={`site-footer__group${open ? ' is-open' : ''}`}>
      {mobile ? (
        <button type="button" aria-expanded={open} aria-controls={contentId} onClick={onToggle}>
          <span>{title}</span><i aria-hidden="true" />
        </button>
      ) : <h3>{title}</h3>}
      <div id={contentId} hidden={mobile && !open}>{children}</div>
    </section>
  )
}
