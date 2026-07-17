import { useState } from 'react'
import { brand, destinations, hotels } from '../data/siteData'
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
    copyright: '© فنادق ومنتجعات موغادور. الموقع الرسمي للمجموعة.',
  },
}

export default function Footer({ t, lang }) {
  const [newsletterStatus, setNewsletterStatus] = useState('')
  const copy = footerCopy[lang] || footerCopy.fr

  const handleNewsletter = (event) => {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    setNewsletterStatus(copy.status)
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(copy.subject)}&body=${encodeURIComponent(copy.body.replace('{email}', email))}`
  }

  return (
    <footer className="site-footer" id="footer">
      <section className="gm-owned-prefooter" aria-label={copy.official}>
        <div>
          <span>{copy.official}</span>
          <h2>{copy.title}</h2>
          <p>{copy.text}</p>
        </div>
        <form onSubmit={handleNewsletter}>
          <label><span>{copy.email}</span><input name="email" type="email" autoComplete="email" placeholder={copy.placeholder} required /></label>
          <button type="submit">{copy.subscribe}</button>
          <small aria-live="polite">{newsletterStatus}</small>
        </form>
      </section>
      <div className="site-footer__brand">
        <img src={images.brand.logoWhite} alt="Mogador Hotels & Resorts" />
        <p>{copy.positioning}</p>
      </div>
      <div className="site-footer__grid">
        <div>
          <h3>{t.nav.destinations}</h3>
          {destinations.map((destination) => <Link key={destination.slug} to={`/destinations#${destination.slug}`}>{translateDestinationName(destination.name, lang)}</Link>)}
        </div>
        <div>
          <h3>{t.nav.hotels}</h3>
          {hotels.map((hotel) => <Link key={hotel.slug} to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>)}
        </div>
        <div>
          <h3>{copy.information}</h3>
          <Link to="/a-propos">{t.nav.about}</Link>
          <Link to="/offres">{t.nav.offers}</Link>
          <Link to="/reunions-evenements">{t.nav.mice}</Link>
          <Link to="/programme-fidelite">{t.nav.loyalty}</Link>
          <Link to="/magazine">{t.nav.magazine}</Link>
        </div>
        <div>
          <h3>{t.nav.contact}</h3>
          <a href={`tel:${brand.phone}`}>{brand.phone}</a>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <span>{brand.website}</span>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>{copy.copyright}</span>
        <Link to="/contact">{t.nav.contact}</Link>
      </div>
    </footer>
  )
}
