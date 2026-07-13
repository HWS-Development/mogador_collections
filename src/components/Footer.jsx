import { brand, destinations, hotels } from '../data/siteData'
import { images } from '../data/images'
import Link from '../router/Link'

export default function Footer({ t }) {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__brand">
        <img src={images.brand.logoWhite} alt="Mogador Hotels & Resorts" />
        <p>{brand.positioning}</p>
      </div>
      <div className="site-footer__grid">
        <div>
          <h3>{t.nav.destinations}</h3>
          {destinations.map((destination) => <Link key={destination.slug} to={`/destinations#${destination.slug}`}>{destination.name}</Link>)}
        </div>
        <div>
          <h3>{t.nav.hotels}</h3>
          {hotels.map((hotel) => <Link key={hotel.slug} to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>)}
        </div>
        <div>
          <h3>Informations</h3>
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
        <span>© Mogador Hotels & Resorts. Site officiel du groupe.</span>
        <Link to="/contact">{t.nav.contact}</Link>
      </div>
    </footer>
  )
}
