import Header from './Header'
import Footer from './Footer'
import ConversionDock from './ConversionDock'
import BookingTakeover from './BookingTakeover'

export default function Layout({ children, t, lang, setLang }) {
  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="content">{children}</main>
      <BookingTakeover t={t} />
      <Footer t={t} />
      <ConversionDock t={t} />
    </>
  )
}
