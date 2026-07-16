export default function Link({ to, children, className, onClick, ...props }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || props.download) return
    if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) return

    const url = new URL(to, window.location.origin)
    if (url.origin !== window.location.origin) return
    event.preventDefault()
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
      window.setTimeout(() => {
        const heading = document.querySelector('main#content h1')
        if (!heading) return
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
        heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), { once: true })
      }, 80)
    }
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
