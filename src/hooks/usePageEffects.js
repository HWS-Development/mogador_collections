import { useEffect } from 'react'

let gsap
let ScrollTrigger
let motionEnginePromise

function loadMotionEngine() {
  if (!motionEnginePromise) {
    motionEnginePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      gsap = gsapModule.gsap || gsapModule.default
      ScrollTrigger = scrollModule.ScrollTrigger || scrollModule.default
      gsap.registerPlugin(ScrollTrigger)
    })
  }
  return motionEnginePromise
}

export function useReveal(path) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealItems = document.querySelectorAll('.reveal')

    if (reduceMotion) {
      revealItems.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    revealItems.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [path])
}

export function useScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let frame = 0
    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        const showDock = window.scrollY > Math.min(window.innerHeight * 0.7, 760)
        const compactHeader = window.scrollY > 42
        if (!reduceMotion) {
          document.documentElement.style.setProperty('--parallax-y', `${window.scrollY * 0.08}px`)
          document.documentElement.style.setProperty('--cinema-y', `${window.scrollY * -0.025}px`)
          document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
        }
        document.body.classList.toggle('show-conversion-dock', showDock)
        document.body.classList.toggle('gm-header-compact', compactHeader)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('show-conversion-dock')
      document.body.classList.remove('gm-header-compact')
    }
  }, [])
}

export function useGmPageMotion(path) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.querySelector('.gm-page')
    if (!root) return undefined

    root.classList.add('gm-motion-ready')

    if (reduceMotion) {
      root.querySelectorAll('.gm-reveal, .gm-page-hero__content > *, .gm-page-hero__media, .gm-page-hero__meta, .gm-page-hero__scroll').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
      })
      return () => {
        root.classList.remove('gm-motion-ready')
      }
    }

    let ctx
    let cancelled = false
    const frame = window.requestAnimationFrame(() => {
      loadMotionEngine().then(() => {
        if (cancelled) return
        ctx = gsap.context(() => {
          const hero = root.querySelector('.gm-page-hero')

          if (hero) {
            gsap.timeline({ defaults: { ease: 'power3.out' } })
              .fromTo('.gm-page-hero__media', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.05 }, 0)
              .fromTo('.gm-page-hero__media img', { scale: 1.1, filter: 'saturate(.72)' }, { scale: 1.02, filter: 'saturate(.94)', duration: 1.35 }, 0)
              .from('.gm-page-hero .eyebrow', { y: 14, autoAlpha: 0, duration: 0.42 }, 0.22)
              .from('.gm-page-hero h1 span', { y: 34, autoAlpha: 0, duration: 0.72 }, 0.28)
              .from('.gm-page-hero__content > p', { y: 18, autoAlpha: 0, duration: 0.55 }, 0.42)
              .from('.gm-page-hero .gm-button', { y: 14, autoAlpha: 0, stagger: 0.06, duration: 0.42 }, 0.52)
              .from('.gm-page-hero__meta, .gm-page-hero__scroll', { autoAlpha: 0, duration: 0.45 }, 0.62)

            gsap.timeline({
              scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.9,
              },
            })
              .to('.gm-page-hero__media img', { yPercent: 6, scale: 1.08, ease: 'none' }, 0)
              .to('.gm-page-hero__content', { y: -34, autoAlpha: 0.62, ease: 'none' }, 0)
          }

          gsap.utils.toArray('.gm-reveal').forEach((element, index) => {
            gsap.from(element, {
              y: 30,
              autoAlpha: 0,
              duration: 0.72,
              delay: Math.min(index * 0.015, 0.12),
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              immediateRender: false,
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            })
          })

          gsap.utils.toArray('.gm-story-row figure, .gm-business-row figure, .gm-hotel-section figure, .gm-destination-feature figure, .gm-fs-featured-offer figure, .gm-magazine-feature figure, .gm-seminar-human figure').forEach((figure) => {
            const image = figure.querySelector('img')
            if (!image) return

            gsap.fromTo(image, { yPercent: -2, scale: 1.035 }, {
              yPercent: 3,
              scale: 1.035,
              ease: 'none',
              scrollTrigger: {
                trigger: figure,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.9,
              },
            })
          })
        }, root)

        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      root.classList.remove('gm-motion-ready')
      ctx?.revert()
    }
  }, [path])
}

export function useLuxuryMotion(path) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.querySelector('.gm-home')
    if (!root) return undefined

    if (reduceMotion) {
      root.querySelectorAll('.reveal, .gm-divine-hero__content > *, .gm-divine-hero__facts, .gm-divine-hero__control, .gm-divine-hero__scroll').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
      })
      root.querySelector('.gm-story__thread span')?.style.setProperty('transform', 'scaleY(1)')
      return undefined
    }

    let ctx
    let cancelled = false
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const compactViewport = window.matchMedia('(max-width: 767px)').matches
    const frame = window.requestAnimationFrame(() => {
      loadMotionEngine().then(() => {
        if (cancelled) return
        ctx = gsap.context(() => {
          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .fromTo('.gm-divine-hero__media', { scale: 1.08 }, { scale: 1, duration: 1.35 }, 0)
            .from('.gm-divine-hero__eyebrow', { y: 16, autoAlpha: 0, duration: 0.46 }, 0.18)
            .from('.gm-divine-hero h1 span', { y: 48, autoAlpha: 0, stagger: 0.1, duration: 0.82 }, 0.24)
            .from('.gm-divine-hero__content > p', { y: 24, autoAlpha: 0, duration: 0.58 }, 0.43)
            .from('.gm-divine-hero__content .gm-home-actions', { y: 18, autoAlpha: 0, duration: 0.5 }, 0.53)
            .from('.gm-divine-hero__mark', { scale: 0.86, autoAlpha: 0, duration: 1.05 }, 0.35)
            .from('.gm-divine-hero__facts > span', { x: 18, autoAlpha: 0, stagger: 0.06, duration: 0.46 }, 0.58)
            .from('.gm-divine-hero__control, .gm-divine-hero__scroll', { y: 10, autoAlpha: 0, stagger: 0.06, duration: 0.44 }, 0.68)

          if (!compactViewport && !coarsePointer) {
            gsap.timeline({
              scrollTrigger: { trigger: '.gm-divine-hero', start: 'top top', end: 'bottom top', scrub: 0.85 },
            })
              .to('.gm-divine-hero__media :where(img, video)', { scale: 1.09, yPercent: 5, ease: 'none' }, 0)
              .to('.gm-divine-hero__content', { y: -52, autoAlpha: 0.38, ease: 'none' }, 0)
              .to('.gm-divine-hero__mark', { yPercent: -12, autoAlpha: 0.08, ease: 'none' }, 0)
          }

          gsap.from('.gm-manifesto__statement p > *', {
            y: 42,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.76,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.gm-manifesto__statement', start: 'top 82%', toggleActions: 'play none none none' },
          })

          gsap.fromTo('.gm-story__thread span', { scaleY: 0 }, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.gm-story__chapters',
              start: 'top 72%',
              end: 'bottom 55%',
              scrub: 0.7,
            },
          })

          gsap.utils.toArray('.gm-media-reveal').forEach((figure) => {
            const image = figure.querySelector('img')
            gsap.fromTo(figure, { clipPath: 'inset(0 0 100% 0)' }, {
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.95,
              ease: 'power3.out',
              scrollTrigger: { trigger: figure, start: 'top 86%', toggleActions: 'play none none none' },
            })
            if (image) {
              gsap.fromTo(image, { scale: 1.1 }, {
                scale: 1.02,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: { trigger: figure, start: 'top 86%', toggleActions: 'play none none none' },
              })
            }
          })

          if (!compactViewport && !coarsePointer) {
            gsap.utils.toArray('.gm-manifesto__primary img, .gm-mice-home__media img').forEach((image) => {
              gsap.fromTo(image, { yPercent: -2, scale: 1.045 }, {
                yPercent: 3,
                scale: 1.045,
                ease: 'none',
                scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 0.85 },
              })
            })
          }
        }, root)

        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      ctx?.revert()
    }
  }, [path])
}

export function useSeo({ title, description, lang = 'fr' }) {
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = title

    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', description)
  }, [title, description, lang])
}
