import PageHero from '../components/PageHero'
import { brand, destinations } from '../data/siteData'
import { directBookingBenefits, hotelContacts } from '../data/officialContent'
import { useSeo } from '../hooks/usePageEffects'

export default function ContactPage({ t, lang }) {
  const [title, text] = t.pages.contact
  useSeo({ title: `${title} | Mogador Hotels & Resorts`, description: text, lang })

  return (
    <div className="gm-page gm-contact-page">
      <PageHero eyebrow="Contact" title={title} text={text} image="/assets/legacy/menara-salon.jpg" primary={{ to: '/#reservation', label: t.common.bookDirect }} t={t} />

      <section className="gm-contact-command gm-page-section">
        <div>
          <span className="gm-label">Siège Mogador</span>
          <h2>Avenue Hassan II, Marrakech - Maroc</h2>
          <div className="gm-contact-links">
            <a href="tel:+212524425200">+212 (0) 524 42 52 00</a>
            <a href="mailto:contact@mogadorhotels.com">contact@mogadorhotels.com</a>
            <a href={`tel:${brand.phone}`}>{brand.phone}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </div>
        </div>
        <form className="gm-contact-form" onSubmit={(event) => event.preventDefault()}>
          <label><span>Type de demande</span><select><option>Séjour individuel</option><option>Voyage d’affaires</option><option>Groupe</option><option>Demande MICE</option></select></label>
          <label><span>Destination</span><select>{destinations.map((destination) => <option key={destination.slug}>{destination.name}</option>)}</select></label>
          <label><span>Prénom</span><input type="text" required /></label>
          <label><span>Nom de famille</span><input type="text" required /></label>
          <label><span>Email</span><input type="email" required /></label>
          <label><span>Téléphone</span><input type="tel" /></label>
          <label className="gm-contact-form__wide"><span>Message</span><textarea rows="5" required /></label>
          <button className="gm-button gm-button--primary" type="submit">Envoyer la demande</button>
          <p aria-live="polite">Votre demande sera orientée vers l’équipe Mogador concernée.</p>
        </form>
      </section>

      <section className="gm-page-section gm-contact-hotels" aria-label="Contacts hôtels officiels">
        <div className="gm-section-head gm-reveal">
          <span className="gm-label">Contacts hôtels</span>
          <h2>Un accès direct aux équipes Mogador pour réserver, organiser ou demander un devis.</h2>
        </div>
        <div className="gm-contact-hotels__grid">
          {hotelContacts.map((hotel) => (
            <article className="gm-reveal" key={hotel.email}>
              <h3>{hotel.name}</h3>
              <p>{hotel.address}</p>
              <a href={`tel:${hotel.phone}`}>{hotel.phone}</a>
              <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="gm-page-section gm-direct-proof" aria-label="Pourquoi réserver sur notre site web">
        {directBookingBenefits.map(([title, text]) => <article className="gm-reveal" key={title}><strong>{title}</strong><span>{text}</span></article>)}
      </section>
    </div>
  )
}
