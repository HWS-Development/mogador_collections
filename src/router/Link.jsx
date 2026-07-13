export default function Link({ to, children, className, onClick, ...props }) {
  const handleClick = (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!to || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('#')) return

    event.preventDefault()
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
    const hash = to.includes('#') ? to.slice(to.indexOf('#')) : ''
    if (hash) {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
