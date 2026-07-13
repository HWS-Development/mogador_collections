import Header from './Header'
import Footer from './Footer'
import ConversionDock from './ConversionDock'

export default function Layout({ children, t, lang, setLang }) {
  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} />
      <main>{children}</main>
      <ConversionDock t={t} />
      <Footer t={t} />
    </>
  )
}
