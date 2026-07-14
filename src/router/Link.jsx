export default function Link({ to, children, className, onClick, ...props }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) return

    event.preventDefault()
    const url = new URL(to, window.location.origin)
    const hash = url.hash
    const nextPath = `${url.pathname}${url.search}${url.hash}`
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

    if (nextPath !== currentPath) window.history.pushState({}, '', nextPath)
    window.dispatchEvent(new PopStateEvent('popstate'))

    if (hash) {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
    }
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
