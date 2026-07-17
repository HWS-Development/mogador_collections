import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
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
  const routeLanguage = window.location.pathname === '/en' || /^\/(about-us|our-|find-offers|mogador-for-business|help)/.test(window.location.pathname)
    ? 'en'
    : window.location.pathname === '/fr' || window.location.pathname.startsWith('/fr/') ? 'fr' : ''
  if (routeLanguage) return routeLanguage
  const stored = window.localStorage.getItem('mogador-lang')
  return supportedLanguages.includes(stored) ? stored : 'fr'
}

function getRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return oldSiteRoutes[path] || path
}

function getLocation() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function forceRouteScroll(location, focus = false) {
  const hash = new URL(location, window.location.origin).hash
  const targetId = hash ? decodeURIComponent(hash.slice(1)) : ''
  const target = targetId ? document.getElementById(targetId) : null
  const root = document.documentElement
  const body = document.body
  const rootBehavior = root.style.getPropertyValue('scroll-behavior')
  const rootPriority = root.style.getPropertyPriority('scroll-behavior')
  const bodyBehavior = body.style.getPropertyValue('scroll-behavior')
  const bodyPriority = body.style.getPropertyPriority('scroll-behavior')
  const scroll = () => {
    if (target) target.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' })
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  root.style.setProperty('scroll-behavior', 'auto', 'important')
  body.style.setProperty('scroll-behavior', 'auto', 'important')
  scroll()

  if (focus && hash !== '#reservation') {
    const focusTarget = target?.matches('a, button, input, select, textarea, [tabindex]')
      ? target
      : target?.querySelector('h1, h2, h3, a, button') || document.querySelector('main#content')
    if (focusTarget) {
      const hadTabIndex = focusTarget.hasAttribute('tabindex')
      if (!hadTabIndex && !focusTarget.matches('a, button, input, select, textarea')) focusTarget.setAttribute('tabindex', '-1')
      focusTarget.focus({ preventScroll: true })
      if (!hadTabIndex) focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true })
      scroll()
    }
  }

  if (rootBehavior) root.style.setProperty('scroll-behavior', rootBehavior, rootPriority)
  else root.style.removeProperty('scroll-behavior')
  if (bodyBehavior) body.style.setProperty('scroll-behavior', bodyBehavior, bodyPriority)
  else body.style.removeProperty('scroll-behavior')
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
  const [route, setRoute] = useState(() => ({ path: getRoute(), location: getLocation(), navigationId: 0 }))
  const [lang, setLangState] = useState(getInitialLang)
  const path = route.path

  useReveal(path)
  useScrollEffects()
  useGmPageMotion(path)
  useLuxuryMotion(path)

  useEffect(() => {
    const onNavigation = () => setRoute((current) => ({ path: getRoute(), location: getLocation(), navigationId: current.navigationId + 1 }))
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.addEventListener('popstate', onNavigation)
    window.addEventListener('hashchange', onNavigation)
    return () => {
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('popstate', onNavigation)
      window.removeEventListener('hashchange', onNavigation)
    }
  }, [])

  useLayoutEffect(() => {
    document.body.classList.toggle('gm-interior-route', path !== '/')
    return () => document.body.classList.remove('gm-interior-route')
  }, [path])

  useLayoutEffect(() => {
    let secondFrame = 0
    const firstFrame = window.requestAnimationFrame(() => {
      forceRouteScroll(route.location)
      secondFrame = window.requestAnimationFrame(() => forceRouteScroll(route.location))
    })
    const settleTimer = window.setTimeout(() => forceRouteScroll(route.location, true), 120)
    forceRouteScroll(route.location)
    return () => {
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      window.clearTimeout(settleTimer)
    }
  }, [route.location, route.navigationId])

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
  const page = renderPage(path, { t, lang, routeLocation: route.location })

  return (
    <>
      <Layout t={t} lang={lang} setLang={setLang} path={path}>
        {page}
      </Layout>
    </>
  )
}
