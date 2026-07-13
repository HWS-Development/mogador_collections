import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useReveal() {
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
  })
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
        if (!reduceMotion) {
          document.documentElement.style.setProperty('--parallax-y', `${window.scrollY * 0.08}px`)
          document.documentElement.style.setProperty('--cinema-y', `${window.scrollY * -0.025}px`)
          document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
        }
        document.body.classList.toggle('show-conversion-dock', showDock)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('show-conversion-dock')
    }
  }, [])
}

export function useGmPageMotion(path) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.querySelector('.gm-page')
    if (!root) return undefined

    const pageType = getGmPageType(root)
    root.classList.add('gm-cinema-ready')
    root.dataset.cinema = pageType

    if (reduceMotion) {
      root.querySelectorAll('.gm-reveal, .gm-page-hero__content, .gm-page-hero__proof span').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
      })
      return () => {
        root.classList.remove('gm-cinema-ready')
        root.removeAttribute('data-cinema')
      }
    }

    let pointerFrame = 0
    const magneticCleanups = []

    const onPointerMove = (event) => {
      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth
        const y = event.clientY / window.innerHeight
        root.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`)
        root.style.setProperty('--my', `${(y * 100).toFixed(2)}%`)
        root.style.setProperty('--cinema-tilt-x', `${((y - 0.5) * -8).toFixed(2)}deg`)
        root.style.setProperty('--cinema-tilt-y', `${((x - 0.5) * 8).toFixed(2)}deg`)
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    root.querySelectorAll('.gm-hotel-tile, .gm-room-card, .gm-values__grid article, .gm-loyalty-ledger article, .gm-experience-index__grid article, .gm-contact-hotels__grid article, .gm-attraction-grid section').forEach((element) => {
      const onCardMove = (event) => {
        const rect = element.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        element.style.setProperty('--card-x', `${(x * 100).toFixed(2)}%`)
        element.style.setProperty('--card-y', `${(y * 100).toFixed(2)}%`)
        element.style.setProperty('--card-rx', `${((0.5 - y) * 8).toFixed(2)}deg`)
        element.style.setProperty('--card-ry', `${((x - 0.5) * 8).toFixed(2)}deg`)
        element.style.setProperty('--card-tx', `${((x - 0.5) * 8).toFixed(2)}px`)
        element.style.setProperty('--card-ty', `${((y - 0.5) * 8).toFixed(2)}px`)
      }
      const onCardLeave = () => {
        element.style.setProperty('--card-rx', '0deg')
        element.style.setProperty('--card-ry', '0deg')
        element.style.setProperty('--card-tx', '0px')
        element.style.setProperty('--card-ty', '0px')
      }

      element.addEventListener('pointermove', onCardMove, { passive: true })
      element.addEventListener('pointerleave', onCardLeave)
      magneticCleanups.push(() => {
        element.removeEventListener('pointermove', onCardMove)
        element.removeEventListener('pointerleave', onCardLeave)
      })
    })

    let ctx
    const frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const hero = root.querySelector('.gm-page-hero')

        if (hero) {
          const heroProfile = getHeroProfile(pageType)

          gsap.timeline({ defaults: { ease: 'power3.out' } })
            .from('.gm-page-hero__media img', heroProfile.image, 0)
            .from('.gm-page-hero__logo', { y: 12, duration: 0.45 }, '-=0.6')
            .from('.gm-page-hero .eyebrow', heroProfile.eyebrow, '-=0.42')
            .from('.gm-page-hero h1', heroProfile.title, '-=0.34')
            .from('.gm-page-hero p', heroProfile.copy, '-=0.42')
            .from('.gm-page-hero__proof span', heroProfile.proof, '-=0.3')
            .from('.gm-page-hero .gm-button', heroProfile.buttons, '-=0.28')

          gsap.to('.gm-page-hero__media img', {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          })
        }

        gsap.utils.toArray('.gm-reveal').forEach((element, index) => {
          gsap.from(element, {
            ...getRevealProfile(pageType, index),
            clearProps: 'transform,filter,opacity,visibility,clipPath',
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
              toggleActions: 'play none none none',
            },
          })
        })

        gsap.utils.toArray('.gm-story-row figure, .gm-business-row figure, .gm-hotel-section figure, .gm-destination-guide figure').forEach((figure) => {
          const image = figure.querySelector('img')
          if (!image) return

          gsap.fromTo(image, { yPercent: -7, scale: 1.08 }, {
            yPercent: 7,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: figure,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          })
        })

        gsap.utils.toArray('.gm-room-catalog__grid, .gm-hotel-directory__grid, .gm-values__grid, .gm-contact-hotels__grid, .gm-experience-index__grid').forEach((grid) => {
          const children = Array.from(grid.children)
          if (!children.length) return

          gsap.from(children, {
            ...getGridProfile(pageType),
            immediateRender: false,
            scrollTrigger: {
              trigger: grid,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          })
        })

        runPageSpecificMotion(pageType)
      }, root)

      ScrollTrigger.refresh()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(pointerFrame)
      window.removeEventListener('pointermove', onPointerMove)
      magneticCleanups.forEach((cleanup) => cleanup())
      root.classList.remove('gm-cinema-ready')
      root.removeAttribute('data-cinema')
      ctx?.revert()
    }
  }, [path])
}

export function useLuxuryMotion(path) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.querySelector('.gm-home, .gm-page')
    if (!root) return undefined

    root.classList.add('gm-luxury-motion')

    if (reduceMotion) {
      root.classList.add('gm-motion-reduced')
      root.querySelectorAll('.gm-reveal, .reveal').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
      })
      return () => {
        root.classList.remove('gm-luxury-motion', 'gm-motion-reduced')
      }
    }

    let ctx
    let frame = 0
    let pointerFrame = 0
    const magneticCleanups = []

    const onPointerMove = (event) => {
      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => {
        root.style.setProperty('--lux-x', `${((event.clientX / window.innerWidth) * 100).toFixed(2)}%`)
        root.style.setProperty('--lux-y', `${((event.clientY / window.innerHeight) * 100).toFixed(2)}%`)
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const magneticSelector = [
      '.gm-path',
      '.gm-immersion-card',
      '.gm-hotel-lead',
      '.gm-experience',
      '.gm-booking-intent',
      '.gm-collection',
      '.gm-destination',
      '.gm-hotel-tile',
      '.gm-room-card',
      '.gm-offer-card',
      '.gm-editorial-card',
      '.gm-loyalty-visual',
      '.gm-service-card',
      '.gm-hotel-slide',
      '.gm-magazine-gallery__item',
      '.gm-offer-gallery__item',
      '.gm-values__grid article',
      '.gm-direct-proof article',
      '.gm-contact-hotels__grid article',
      '.gm-experience-index__grid article',
      '.gm-attraction-grid section',
    ].join(', ')

    root.querySelectorAll(magneticSelector).forEach((element) => {
      element.classList.add('gm-magnetic')

      const onMove = (event) => {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        element.style.setProperty('--spot-x', `${(x * 100).toFixed(2)}%`)
        element.style.setProperty('--spot-y', `${(y * 100).toFixed(2)}%`)
        element.style.setProperty('--magnet-x', `${((x - 0.5) * 10).toFixed(2)}px`)
        element.style.setProperty('--magnet-y', `${((y - 0.5) * 10).toFixed(2)}px`)
        element.style.setProperty('--tilt-x', `${((0.5 - y) * 5).toFixed(2)}deg`)
        element.style.setProperty('--tilt-y', `${((x - 0.5) * 5).toFixed(2)}deg`)
      }
      const onLeave = () => {
        element.style.setProperty('--magnet-x', '0px')
        element.style.setProperty('--magnet-y', '0px')
        element.style.setProperty('--tilt-x', '0deg')
        element.style.setProperty('--tilt-y', '0deg')
      }

      element.addEventListener('pointermove', onMove, { passive: true })
      element.addEventListener('pointerleave', onLeave)
      magneticCleanups.push(() => {
        element.classList.remove('gm-magnetic')
        element.removeEventListener('pointermove', onMove)
        element.removeEventListener('pointerleave', onLeave)
      })
    })

    frame = window.requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const hero = root.querySelector('.gm-hero, .gm-page-hero')
        const heroImage = root.querySelector('.gm-hero__image img, .gm-page-hero__media img')

        if (hero) {
          if (heroImage) {
            gsap.fromTo(heroImage, { scale: 1.045, yPercent: -1 }, { scale: 1.02, yPercent: 0, duration: 0.55, clearProps: 'transform', ease: 'power2.out' })
          }
        }

        gsap.utils.toArray('.gm-section-head, .gm-page-intro > div, .gm-reservation-takeover__copy, .gm-hotel-sales-panel__copy, .gm-hotel-booking-panel > div:first-child').forEach((element) => {
          gsap.from(element, {
            y: 42,
            duration: 0.82,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: element, start: 'top 84%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-path, .gm-immersion-card, .gm-hotel-lead, .gm-experience, .gm-booking-intent, .gm-collection, .gm-destination, .gm-hotel-tile, .gm-room-card, .gm-offer-card, .gm-editorial-card, .gm-loyalty-visual, .gm-service-card, .gm-hotel-slide, .gm-magazine-gallery__item, .gm-offer-gallery__item').forEach((card, index) => {
          gsap.from(card, {
            y: 52,
            rotationX: index % 2 ? -5 : 5,
            transformPerspective: 1000,
            duration: 0.72,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-path img, .gm-immersion-card img, .gm-hotel-lead img, .gm-experience img, .gm-destination img, .gm-hotel-tile img, .gm-room-card img, .gm-offer-card img, .gm-editorial-card img, .gm-loyalty-visual img, .gm-service-card img, .gm-hotel-slide img, .gm-magazine-gallery__item img, .gm-offer-gallery__item img, .gm-hotel-gallery img').forEach((image) => {
          gsap.fromTo(image, { yPercent: -5, scale: 1.08 }, {
            yPercent: 5,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 0.85 },
          })
        })

        gsap.utils.toArray('.gm-numbers article, .gm-direct article, .gm-direct-proof article, .gm-facilities article, .gm-mice-command__stats article').forEach((item, index) => {
          gsap.from(item, {
            y: 28,
            scale: 0.92,
            duration: 0.58,
            delay: (index % 4) * 0.035,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'back.out(1.25)',
            immediateRender: false,
            scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' },
          })
        })
      }, root)

      ScrollTrigger.refresh()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(pointerFrame)
      window.removeEventListener('pointermove', onPointerMove)
      magneticCleanups.forEach((cleanup) => cleanup())
      root.classList.remove('gm-luxury-motion')
      ctx?.revert()
    }
  }, [path])
}

function getGmPageType(root) {
  const pageClass = Array.from(root.classList).find((className) => className !== 'gm-page' && className.startsWith('gm-') && className.endsWith('-page'))
  return pageClass?.replace(/^gm-/, '').replace(/-page$/, '') || 'standard'
}

function getHeroProfile(type) {
  const profiles = {
    about: {
      image: { scale: 1.08, xPercent: -2, duration: 1.2 },
      eyebrow: { x: -12, duration: 0.45 },
      title: { x: -18, duration: 0.62 },
      copy: { x: -12, duration: 0.5 },
      proof: { y: 10, stagger: 0.05, duration: 0.36 },
      buttons: { x: -10, stagger: 0.05, duration: 0.36 },
    },
    hotels: {
      image: { scale: 1.06, yPercent: -2, duration: 1.15 },
      eyebrow: { y: 10, duration: 0.42 },
      title: { y: 18, duration: 0.58 },
      copy: { y: 12, duration: 0.48 },
      proof: { y: 10, stagger: 0.04, duration: 0.34 },
      buttons: { y: 10, stagger: 0.05, duration: 0.36 },
    },
    hotel: {
      image: { scale: 1.08, duration: 1.2 },
      eyebrow: { y: 10, duration: 0.42 },
      title: { y: 16, scale: 0.99, duration: 0.58 },
      copy: { y: 10, duration: 0.48 },
      proof: { x: -8, stagger: 0.05, duration: 0.34 },
      buttons: { y: 8, stagger: 0.05, duration: 0.34 },
    },
    destinations: {
      image: { scale: 1.07, xPercent: 2, duration: 1.15 },
      eyebrow: { x: 10, duration: 0.42 },
      title: { x: 18, duration: 0.58 },
      copy: { x: 12, duration: 0.48 },
      proof: { y: 8, stagger: 0.04, duration: 0.34 },
      buttons: { x: 8, stagger: 0.04, duration: 0.34 },
    },
    experiences: {
      image: { scale: 1.08, rotation: -0.25, duration: 1.2 },
      eyebrow: { y: 10, duration: 0.42 },
      title: { y: 16, rotationZ: -0.35, duration: 0.58 },
      copy: { y: 10, duration: 0.48 },
      proof: { scale: 0.98, stagger: 0.04, duration: 0.34 },
      buttons: { y: 8, stagger: 0.05, duration: 0.34 },
    },
    offers: {
      image: { scale: 1.07, xPercent: -2, duration: 1.1 },
      eyebrow: { y: 8, duration: 0.4 },
      title: { y: 16, duration: 0.55 },
      copy: { y: 10, duration: 0.45 },
      proof: { x: -8, stagger: 0.04, duration: 0.32 },
      buttons: { scale: 0.98, stagger: 0.05, duration: 0.34 },
    },
    mice: {
      image: { scale: 1.06, yPercent: 2, duration: 1.1 },
      eyebrow: { y: 10, duration: 0.42 },
      title: { y: 18, duration: 0.58 },
      copy: { y: 10, duration: 0.48 },
      proof: { y: 8, stagger: 0.04, duration: 0.34 },
      buttons: { y: 8, stagger: 0.05, duration: 0.34 },
    },
    contact: {
      image: { scale: 1.06, xPercent: 1, duration: 1.05 },
      eyebrow: { y: 8, duration: 0.42 },
      title: { y: 16, duration: 0.55 },
      copy: { y: 8, duration: 0.42 },
      proof: { y: 6, stagger: 0.04, duration: 0.32 },
      buttons: { y: 6, duration: 0.32 },
    },
  }

  return profiles[type] || profiles.hotel
}

function getRevealProfile(type, index) {
  const side = index % 2 === 0 ? -1 : 1
  const profiles = {
    about: { x: side * 24, duration: 0.58, ease: 'power3.out' },
    hotels: { y: 28, duration: 0.58, ease: 'power3.out' },
    hotel: { y: 26, duration: 0.58, ease: 'power3.out' },
    destinations: { x: side * 24, duration: 0.58, ease: 'power3.out' },
    experiences: { y: 26, duration: 0.58, ease: 'power3.out' },
    offers: { x: -24, duration: 0.58, ease: 'power3.out' },
    mice: { y: 28, scale: 0.98, duration: 0.58, ease: 'power3.out' },
    contact: { x: side * 18, y: 12, duration: 0.58, ease: 'power3.out' },
    loyalty: { y: 24, scale: 0.98, duration: 0.58, ease: 'power3.out' },
    magazine: { y: 24, duration: 0.58, ease: 'power3.out' },
  }

  return profiles[type] || { y: 24, duration: 0.58, ease: 'power3.out' }
}

function getGridProfile(type) {
  const profiles = {
    hotels: { y: 24, stagger: { each: 0.04, from: 'start' }, duration: 0.58, ease: 'power3.out' },
    hotel: { y: 20, scale: 0.98, stagger: { each: 0.035, from: 'center' }, duration: 0.52, ease: 'power3.out' },
    destinations: { x: 20, stagger: 0.035, duration: 0.52, ease: 'power3.out' },
    contact: { y: 18, stagger: { each: 0.035, from: 'edges' }, duration: 0.52, ease: 'power3.out' },
    experiences: { y: 20, stagger: 0.04, duration: 0.52, ease: 'power3.out' },
  }

  return profiles[type] || { y: 18, stagger: 0.035, duration: 0.52, ease: 'power3.out' }
}

function runPageSpecificMotion(type) {
  if (type === 'destinations') {
    gsap.utils.toArray('.gm-destination-guide').forEach((guide, index) => {
      gsap.from(guide.querySelectorAll('.gm-attraction-grid section'), {
        x: index % 2 ? -28 : 28,
        stagger: 0.045,
        duration: 0.58,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: guide, start: 'top 70%', toggleActions: 'play none none none' },
      })
    })
  }

  if (type === 'hotel') {
    gsap.utils.toArray('.gm-hotel-section').forEach((section) => {
      gsap.from(section.querySelectorAll('.gm-feature-list span'), {
        y: 20,
        stagger: 0.035,
        duration: 0.46,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: section, start: 'top 68%', toggleActions: 'play none none none' },
      })
    })
  }

  if (type === 'mice') {
    gsap.from('.gm-mice-command__stats article', {
      y: 36,
      scale: 0.9,
      stagger: 0.06,
      duration: 0.68,
      ease: 'back.out(1.4)',
      immediateRender: false,
      scrollTrigger: { trigger: '.gm-mice-command__stats', start: 'top 78%', toggleActions: 'play none none none' },
    })
  }

  if (type === 'offers') {
    gsap.from('.gm-offer-row', {
      xPercent: -4,
      stagger: 0.08,
      duration: 0.78,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: '.gm-offer-board', start: 'top 76%', toggleActions: 'play none none none' },
    })
  }

  if (type === 'contact') {
    gsap.from('.gm-contact-form label, .gm-contact-form button', {
      x: 24,
      stagger: 0.045,
      duration: 0.52,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: '.gm-contact-form', start: 'top 78%', toggleActions: 'play none none none' },
    })
  }
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
