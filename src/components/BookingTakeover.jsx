import { useEffect, useState } from 'react'
import BookingBar from './BookingBar'
import { brand } from '../data/siteData'
import { images } from '../data/images'
import Link from '../router/Link'

const bookingIntents = [
  ['Dormir', 'Une chambre, une suite, une ville: choisissez le décor qui fera commencer le voyage avant l’arrivée.', '/hotels'],
  ['S’évader', 'Une offre directe, un spa, une piscine, une table: laissez l’envie devenir une date.', '/offres'],
  ['Réunir', 'Un congrès, un séminaire, une réception: donnez à votre moment un espace qui impose le souvenir.', '/reunions-evenements'],
  ['Être rappelé', 'Un doute, un besoin spécial, un groupe: gardez le lien humain avec Mogador.', '/contact'],
]

export default function BookingTakeover({ t }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openFromReservationLink = (event) => {
      const link = event.target.closest?.('a[href="/#reservation"], a[href="#reservation"]')
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      setOpen(true)
    }

    document.addEventListener('click', openFromReservationLink, true)
    return () => document.removeEventListener('click', openFromReservationLink, true)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('gm-booking-takeover-open', open)
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('gm-booking-takeover-open')
    }
  }, [open])

  return (
    <div className={`gm-booking-takeover ${open ? 'gm-booking-takeover--open' : ''}`} aria-hidden={!open}>
      <div className="gm-booking-takeover__backdrop" onClick={() => setOpen(false)} />
      <section className="gm-booking-takeover__panel" role="dialog" aria-modal="true" aria-label="Réservation officielle Mogador">
        <button className="gm-booking-takeover__close" type="button" onClick={() => setOpen(false)} aria-label="Fermer la réservation">Fermer</button>
        <figure className="gm-booking-takeover__media" aria-hidden="true">
          <img src={images.official.homeHero} alt="" />
          <span>Réserver<br />Mogador</span>
        </figure>
        <div className="gm-booking-takeover__body">
          <span className="gm-radical-eyebrow">Site officiel Mogador</span>
          <h2>Réservez votre séjour sur le site officiel Mogador.</h2>
          <p>Choisissez votre destination, indiquez vos dates et contactez directement les équipes Mogador si vous avez besoin d’assistance.</p>
          <div className="gm-booking-takeover__proof" aria-label="Avantages de réservation directe">
            <strong>Contact direct</strong>
            <strong>Avantage officiel</strong>
            <strong>{brand.phone}</strong>
          </div>
          <div className="gm-booking-takeover__intents">
            {bookingIntents.map(([title, text, to]) => (
              <Link to={to} key={title} onClick={() => setOpen(false)}>
                <strong>{title}</strong>
                <small>{text}</small>
              </Link>
            ))}
          </div>
          <BookingBar t={t} />
        </div>
      </section>
    </div>
  )
}
