import { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout'
import { oldSiteRoutes } from './data/officialContent'
import { translations, supportedLanguages } from './i18n/translations'
import { useGmPageMotion, useLuxuryMotion, useReveal, useScrollEffects } from './hooks/usePageEffects'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import DestinationsPage from './pages/DestinationsPage'
import HotelsPage from './pages/HotelsPage'
import HotelPage from './pages/HotelPage'
import ExperiencesPage from './pages/ExperiencesPage'
import OffersPage from './pages/OffersPage'
import MicePage from './pages/MicePage'
import LoyaltyPage from './pages/LoyaltyPage'
import MagazinePage from './pages/MagazinePage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'

function getInitialLang() {
  const stored = window.localStorage.getItem('mogador-lang')
  return supportedLanguages.includes(stored) ? stored : 'fr'
}

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return oldSiteRoutes[path] || path
}

function renderPage(path, props) {
  if (path === '/') return <HomePage {...props} />
  if (path === '/a-propos') return <AboutPage {...props} />
  if (path === '/destinations') return <DestinationsPage {...props} />
  if (path === '/hotels') return <HotelsPage {...props} />
  if (path.startsWith('/hotels/')) return <HotelPage slug={path.replace('/hotels/', '')} {...props} />
  if (path === '/experiences') return <ExperiencesPage {...props} />
  if (path === '/offres') return <OffersPage {...props} />
  if (path === '/reunions-evenements') return <MicePage {...props} />
  if (path === '/programme-fidelite') return <LoyaltyPage {...props} />
  if (path === '/magazine') return <MagazinePage {...props} />
  if (path === '/contact') return <ContactPage {...props} />
  return <NotFoundPage {...props} />
}

export default function App() {
  const [path, setPath] = useState(getRoute)
  const [lang, setLangState] = useState(getInitialLang)

  useReveal()
  useScrollEffects()
  useGmPageMotion(path)
  useLuxuryMotion(path)

  useEffect(() => {
    const onPopState = () => setPath(getRoute())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!window.location.hash) return
    const target = document.querySelector(window.location.hash)
    if (!target) return
    window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [path])

  useEffect(() => {
    const onClick = (event) => {
      const tracked = event.target.closest?.('[data-track]')
      if (!tracked) return
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'cta_click', action: tracked.dataset.track, path: window.location.pathname })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const setLang = (nextLang) => {
    window.localStorage.setItem('mogador-lang', nextLang)
    setLangState(nextLang)
  }

  const t = useMemo(() => translations[lang] || translations.fr, [lang])
  const page = renderPage(path, { t, lang })

  return (
    <>
      <Layout t={t} lang={lang} setLang={setLang}>
        {page}
      </Layout>
    </>
  )
}
