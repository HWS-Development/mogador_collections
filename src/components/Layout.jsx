import Header from './Header'
import Footer from './Footer'
import ConversionDock from './ConversionDock'
import BookingTakeover from './BookingTakeover'
import RouteTransition from './RouteTransition'

export default function Layout({ children, t, lang, setLang, path }) {
  return (
    <>
      <a className="gm-skip-link" href="#content">{t.common.skipContent}</a>
      <RouteTransition />
      <Header t={t} lang={lang} setLang={setLang} path={path} />
      <main id="content">{children}</main>
      <BookingTakeover t={t} lang={lang} />
      <Footer t={t} lang={lang} />
      <ConversionDock t={t} />
    </>
  )
}
