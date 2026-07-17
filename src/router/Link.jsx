let leaveTimer
let enterTimer

export default function Link({ to, children, className, onClick, ...props }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download) return
    if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) return

    const url = new URL(to, window.location.origin)
    if (url.origin !== window.location.origin) return
    event.preventDefault()
    const nextPath = `${url.pathname}${url.search}${url.hash}`
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const navigate = () => {
      if (nextPath !== currentPath) window.history.pushState({}, '', nextPath)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }

    if (sameDocument || reduceMotion) {
      navigate()
      return
    }

    window.clearTimeout(leaveTimer)
    window.clearTimeout(enterTimer)
    document.body.classList.remove('gm-route-entering')
    document.body.classList.add('gm-route-leaving')
    leaveTimer = window.setTimeout(() => {
      navigate()
      document.body.classList.remove('gm-route-leaving')
      document.body.classList.add('gm-route-entering')
      enterTimer = window.setTimeout(() => document.body.classList.remove('gm-route-entering'), 760)
    }, 460)
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
