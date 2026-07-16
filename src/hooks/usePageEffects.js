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

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
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

    if (finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true })

    if (finePointer) root.querySelectorAll('.gm-hotel-tile, .gm-room-card, .gm-values__grid article, .gm-loyalty-ledger article, .gm-experience-index__grid article, .gm-contact-hotels__grid article, .gm-attraction-grid section').forEach((element) => {
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
      if (finePointer) window.removeEventListener('pointermove', onPointerMove)
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
    const root = document.querySelector('.gm-home')
    if (!root) return undefined
    const isHome = true

    root.classList.add('gm-luxury-motion', 'gm-high-conversion-motion')
    document.body.classList.add('gm-route-transition')
    const routeTimer = window.setTimeout(() => document.body.classList.remove('gm-route-transition'), 620)

    if (reduceMotion) {
      root.classList.add('gm-motion-reduced')
      root.querySelectorAll('.gm-reveal, .reveal, .gm-radical-reveal, .gm-radical-intent, .gm-radical-use, .gm-radical-scene, .gm-radical-chapter, .gm-radical-hotel, .gm-radical-moment').forEach((element) => {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.filter = 'none'
      })
      return () => {
        window.clearTimeout(routeTimer)
        document.body.classList.remove('gm-route-transition')
        root.classList.remove('gm-luxury-motion', 'gm-high-conversion-motion', 'gm-motion-reduced')
      }
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
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

    if (finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true })

    const magneticSelector = [
      '.gm-radical-use',
      '.gm-radical-intent',
      '.gm-booking-takeover__intents a',
      '.gm-owned-menu__group',
      '.gm-radical-scene',
      '.gm-radical-chapter',
      '.gm-radical-hotel',
      '.gm-radical-moment',
      '.gm-radical-destination-list a',
      '.gm-radical-map__pin',
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
      '.gm-fs-offer-card',
      '.gm-seminar-type',
      '.gm-seminar-offer__grid article',
      '.gm-seminar-venues__grid article',
      '.gm-signature-experience__media',
      '.gm-signature-experience__cards article',
      '.gm-destination-filterbar button',
      '.gm-destination-menu button',
      '.gm-room-tabs button',
      '.gm-room-showcase__controls button',
      '.gm-fs-gallery__arrow',
      '.booking-bar button',
      '.booking-bar__next',
    ].join(', ')

    if (finePointer && magneticSelector) root.querySelectorAll(magneticSelector).forEach((element) => {
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
        element.style.setProperty('--card-x', `${(x * 100).toFixed(2)}%`)
        element.style.setProperty('--card-y', `${(y * 100).toFixed(2)}%`)
        element.style.setProperty('--card-rx', `${((0.5 - y) * 7).toFixed(2)}deg`)
        element.style.setProperty('--card-ry', `${((x - 0.5) * 7).toFixed(2)}deg`)
        element.style.setProperty('--card-tx', `${((x - 0.5) * 8).toFixed(2)}px`)
        element.style.setProperty('--card-ty', `${((y - 0.5) * 8).toFixed(2)}px`)
      }
      const onLeave = () => {
        element.style.setProperty('--magnet-x', '0px')
        element.style.setProperty('--magnet-y', '0px')
        element.style.setProperty('--tilt-x', '0deg')
        element.style.setProperty('--tilt-y', '0deg')
        element.style.setProperty('--card-rx', '0deg')
        element.style.setProperty('--card-ry', '0deg')
        element.style.setProperty('--card-tx', '0px')
        element.style.setProperty('--card-ty', '0px')
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
        const hero = root.querySelector('.gm-radical-hero, .gm-hero, .gm-page-hero')
        const heroImage = root.querySelector('.gm-radical-hero__photo img, .gm-hero__image img, .gm-page-hero__media img')

        if (hero) {
          if (heroImage) {
            const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
            const heroChrome = root.querySelectorAll('.gm-radical-hero__topline, .gm-hero__content, .gm-page-hero__content')
            const heroContent = root.querySelectorAll('.gm-radical-hero__content > *, .gm-hero__content > *, .gm-page-hero__content > *')
            const heroBooking = root.querySelectorAll('.gm-radical-compare, .gm-radical-booking, .gm-booking, .gm-page-hero__booking')

            heroTimeline.fromTo(heroImage, { scale: isHome ? 1.16 : 1.045, filter: isHome ? 'brightness(0.72) saturate(0.72)' : 'brightness(0.92)' }, { scale: 1.02, filter: 'brightness(1) saturate(1)', duration: isHome ? 1.35 : 0.8, clearProps: 'transform,filter' }, 0)
            if (heroChrome.length) heroTimeline.from(heroChrome, { y: isHome ? -22 : 16, autoAlpha: 0, duration: isHome ? 0.72 : 0.5 }, 0.15)
            if (heroContent.length) heroTimeline.from(heroContent, { x: isHome ? -46 : 0, y: isHome ? 0 : 18, autoAlpha: 0, stagger: isHome ? 0.075 : 0.045, duration: isHome ? 0.86 : 0.55 }, 0.28)
            if (heroBooking.length) heroTimeline.from(heroBooking, { y: isHome ? 42 : 22, autoAlpha: 0, stagger: 0.06, duration: isHome ? 0.76 : 0.55 }, 0.45)
          }
        }

        runDirectionalScrollMotion(root)
        runHighConversionMotion(root)

        if (!isHome) {
          runInteriorLuxuryMotion(root)
          return
        }

        gsap.utils.toArray('.gm-radical-section-head, .gm-radical-map__copy, .gm-radical-intro__copy, .gm-radical-services, .gm-section-head, .gm-page-intro > div, .gm-offer-engine > div:first-child, .gm-mice-command > div:first-child, .gm-reservation-takeover__copy, .gm-hotel-sales-panel__copy, .gm-hotel-booking-panel > div:first-child').forEach((element) => {
          gsap.from(element, {
            x: -56,
            y: 22,
            autoAlpha: 0,
            filter: 'blur(12px)',
            duration: 0.9,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'power4.out',
            immediateRender: false,
            scrollTrigger: { trigger: element, start: 'top 84%', toggleActions: 'play none none reverse' },
          })
        })

        gsap.utils.toArray('.gm-radical-intents__grid, .gm-radical-usage__carousel, .gm-radical-constellation__grid, .gm-radical-signatures__grid, .gm-radical-moments, .gm-radical-numbers, .gm-radical-destination-list, .gm-room-catalog__grid, .gm-hotel-directory__grid, .gm-values__grid, .gm-contact-hotels__grid, .gm-experience-index__grid, .gm-charter-list, .gm-offer-showcase__grid, .gm-offer-gallery, .gm-hotel-slider__track, .gm-service-matrix__grid, .gm-hotel-gallery__grid, .gm-facilities, .gm-direct-proof, .gm-mice-command__stats, .gm-feature-list').forEach((grid) => {
          const children = Array.from(grid.children)
          if (!children.length) return

          gsap.from(children, {
            x: 86,
            y: 18,
            autoAlpha: 0,
            rotationY: -24,
            rotationX: 7,
            transformPerspective: 1100,
            transformOrigin: 'left center',
            filter: 'blur(10px)',
            stagger: { each: 0.035, from: 'start' },
            duration: 0.38,
            ease: 'power4.out',
            clearProps: 'transform,filter,opacity,visibility',
            immediateRender: false,
            scrollTrigger: { trigger: grid, start: 'top 96%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-radical-chapter').forEach((chapter, index) => {
          const media = chapter.querySelector('.gm-radical-chapter__media')
          const copy = chapter.querySelector('.gm-radical-chapter__copy')
          const direction = index % 2 === 0 ? -1 : 1

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: chapter, start: 'top 78%', toggleActions: 'play none none reverse' },
            defaults: { ease: 'power4.out' },
          })

          if (media) timeline.from(media, { x: direction * 70, autoAlpha: 0, rotationY: direction * -22, transformPerspective: 1200, clipPath: 'inset(0 38% 0 0)', duration: 0.95, clearProps: 'transform,clipPath,opacity,visibility' }, 0)
          if (copy?.children?.length) timeline.from(copy.children, { x: direction * -42, autoAlpha: 0, stagger: 0.07, duration: 0.74, clearProps: 'transform,opacity,visibility' }, 0.16)
        })

        gsap.utils.toArray('.gm-story-row, .gm-business-row, .gm-destination-guide, .gm-hotel-section').forEach((row, index) => {
          const media = row.querySelector('figure, .gm-attraction-grid, .gm-hotel-section figure')
          const copy = row.querySelector(':scope > div:not(.gm-attraction-grid), .gm-destination-guide__body')
          const reverse = row.className.includes('--reverse')
          const direction = reverse ? 1 : -1

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 78%', toggleActions: 'play none none reverse' },
            defaults: { ease: 'power4.out' },
          })

          if (media) timeline.from(media, { x: direction * 72, autoAlpha: 0, rotationY: direction * -24, transformPerspective: 1200, filter: 'blur(10px)', duration: 0.95, clearProps: 'transform,filter,opacity,visibility' }, 0)
          if (copy?.children?.length) timeline.from(copy.children, { x: direction * -44, autoAlpha: 0, stagger: 0.075, duration: 0.72, clearProps: 'transform,opacity,visibility' }, 0.14)

          const nested = row.querySelectorAll('.gm-attraction-grid section, .gm-feature-list span')
          if (nested.length) {
            gsap.from(nested, {
              x: 54,
              autoAlpha: 0,
              rotationY: -18,
              transformPerspective: 1000,
              stagger: 0.055,
              duration: 0.62,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              immediateRender: false,
              scrollTrigger: { trigger: row, start: 'top 68%', toggleActions: 'play none none reverse' },
            })
          }
        })

        gsap.utils.toArray('.gm-radical-use img, .gm-radical-scene img, .gm-signature-experience__media img, .gm-radical-chapter__media img, .gm-radical-hotel img, .gm-radical-moment img, .gm-radical-destinations__visual img, .gm-story-row img, .gm-business-row img, .gm-destination-guide img, .gm-hotel-section img, .gm-page-hero__media img').forEach((image) => {
          gsap.fromTo(image, { scale: 1.16, xPercent: -3, filter: 'contrast(0.86) saturate(0.72)' }, {
            scale: 1.03,
            xPercent: 0,
            filter: 'contrast(1) saturate(1)',
            duration: 0.42,
            ease: 'power3.out',
            clearProps: 'transform,filter',
            scrollTrigger: { trigger: image, start: 'top 96%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-section-head, .gm-page-intro > div, .gm-reservation-takeover__copy, .gm-hotel-sales-panel__copy, .gm-hotel-booking-panel > div:first-child').forEach((element) => {
          gsap.from(element, {
            y: 42,
            duration: 0.36,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { trigger: element, start: 'top 84%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-radical-use, .gm-radical-scene, .gm-signature-experience__media, .gm-signature-experience__cards article, .gm-radical-hotel, .gm-radical-moment, .gm-charter-row, .gm-attraction-grid section, .gm-facilities article, .gm-hotel-gallery figure, .gm-final, .gm-path, .gm-immersion-card, .gm-hotel-lead, .gm-experience, .gm-booking-intent, .gm-collection, .gm-destination, .gm-hotel-tile, .gm-room-card, .gm-offer-card, .gm-editorial-card, .gm-loyalty-visual, .gm-service-card, .gm-hotel-slide, .gm-magazine-gallery__item, .gm-offer-gallery__item').forEach((card, index) => {
          gsap.from(card, {
            x: index % 2 ? 48 : -48,
            y: 32,
            autoAlpha: 0,
            rotationY: index % 2 ? -16 : 16,
            rotationX: index % 2 ? -8 : 8,
            transformPerspective: 1100,
            filter: 'blur(8px)',
            duration: 0.82,
            clearProps: 'transform,filter,opacity,visibility',
            ease: 'power4.out',
            immediateRender: false,
            scrollTrigger: { trigger: card, start: 'top 96%', toggleActions: 'play none none none' },
          })
        })

        gsap.utils.toArray('.gm-path img, .gm-immersion-card img, .gm-hotel-lead img, .gm-experience img, .gm-destination img, .gm-hotel-tile img, .gm-room-card img, .gm-offer-card img, .gm-editorial-card img, .gm-loyalty-visual img, .gm-service-card img, .gm-hotel-slide img, .gm-magazine-gallery__item img, .gm-offer-gallery__item img, .gm-hotel-gallery img, .gm-offer-gallery img').forEach((image) => {
          gsap.fromTo(image, { yPercent: -7, scale: 1.12 }, {
            yPercent: 7,
            scale: 1.12,
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
      window.clearTimeout(routeTimer)
      window.removeEventListener('pointermove', onPointerMove)
      magneticCleanups.forEach((cleanup) => cleanup())
      document.body.classList.remove('gm-route-transition')
      root.classList.remove('gm-luxury-motion', 'gm-high-conversion-motion')
      ctx?.revert()
    }
  }, [path])
}

function runHighConversionMotion(root) {
  gsap.utils.toArray('.gm-page-section, .gm-radical-direct, .gm-radical-usage, .gm-radical-story, .gm-radical-signatures, .gm-radical-destinations, .gm-radical-moments, .gm-radical-numbers').forEach((section) => {
    gsap.from(section, {
      y: 36,
      scale: 0.985,
      autoAlpha: 0,
      clipPath: 'inset(8% 4% 8% 4% round 34px)',
      filter: 'blur(10px) saturate(0.9)',
      duration: 0.9,
      ease: 'power4.out',
      clearProps: 'transform,filter,opacity,visibility,clipPath',
      immediateRender: false,
      scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.gm-section-head').forEach((head) => {
    const mark = head
    gsap.fromTo(mark, { '--portal-rotate': '-10deg', '--portal-scale': 0.86 }, {
      '--portal-rotate': '0deg',
      '--portal-scale': 1,
      duration: 0.9,
      ease: 'back.out(1.35)',
      scrollTrigger: { trigger: head, start: 'top 86%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.gm-hotel-tile, .gm-room-card, .gm-offer-card, .gm-fs-offer-card, .gm-editorial-card, .gm-experience-card, .gm-service-card, .gm-destination-feature, .gm-seminar-type').forEach((card) => {
    const image = card.querySelector('img')
    if (!image) return
    gsap.from(image, {
      scale: 1.18,
      rotate: 1.2,
      filter: 'blur(8px) saturate(0.72)',
      duration: 0.92,
      ease: 'power3.out',
      clearProps: 'transform,filter',
      immediateRender: false,
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })
}

function runInteriorLuxuryMotion(root) {
  gsap.utils.toArray('.gm-section-head, .gm-page-intro > div, .gm-offer-engine > div:first-child, .gm-mice-command > div:first-child, .gm-hotel-sales-panel__copy, .gm-hotel-booking-panel > div:first-child').forEach((element) => {
    gsap.from(element, {
      y: 24,
      autoAlpha: 0,
      duration: 0.58,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: element, start: 'top 86%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.gm-story-row, .gm-business-row, .gm-destination-guide, .gm-hotel-section').forEach((row) => {
    const media = row.querySelector('figure')
    const copy = row.querySelector(':scope > div:not(.gm-attraction-grid), .gm-destination-guide__body')
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none none' },
      defaults: { ease: 'power2.out' },
    })

    if (media) timeline.from(media, { x: -34, autoAlpha: 0, duration: 0.62, clearProps: 'transform,opacity,visibility' }, 0)
    if (copy?.children?.length) timeline.from(copy.children, { x: 28, autoAlpha: 0, stagger: 0.04, duration: 0.5, clearProps: 'transform,opacity,visibility' }, 0.1)
  })

  gsap.utils.toArray('.gm-hotel-directory__grid, .gm-values__grid, .gm-contact-hotels__grid, .gm-experience-index__grid, .gm-charter-list, .gm-charter-compliance__grid, .gm-charter-palette, .gm-offer-showcase__grid, .gm-offer-gallery, .gm-hotel-slider__track, .gm-service-matrix__grid, .gm-hotel-gallery__grid, .gm-facilities, .gm-brand-proof, .gm-direct-proof, .gm-mice-command__stats, .gm-feature-list, .gm-attraction-grid, .gm-scroll-overlays__media').forEach((grid) => {
    const children = Array.from(grid.children).filter((child) => child.tagName !== 'SMALL')
    if (!children.length) return
    const ordered = centerOut(children)
    const centerIndex = Math.floor((children.length - 1) / 2)

    gsap.from(ordered, {
      x: (_, element) => {
        const index = children.indexOf(element)
        if (index === centerIndex) return 0
        return index > centerIndex ? 24 : -24
      },
      y: 12,
      autoAlpha: 0,
      stagger: 0.055,
      duration: 0.54,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: grid, start: 'top 84%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.gm-hotel-slide, .gm-offer-gallery__item, .gm-hotel-gallery figure, .gm-room-card, .gm-scroll-overlay-card, .gm-brand-proof article, .gm-service-card, .gm-offer-card, .gm-hotel-tile, .gm-charter-row').forEach((card, index) => {
    gsap.from(card, {
      x: 22 + (index % 3) * 8,
      autoAlpha: 0,
      duration: 0.52,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.gm-page img').forEach((image) => {
    gsap.from(image, {
      x: -18,
      scale: 1.025,
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: image, start: 'top 90%', toggleActions: 'play none none none' },
    })
  })
}

function runDirectionalScrollMotion(root) {
  const imageBlocks = root.querySelectorAll([
    '.gm-page-hero__media',
    '.gm-story-row figure',
    '.gm-business-row figure',
    '.gm-destination-guide figure',
    '.gm-hotel-section figure',
    '.gm-attraction-grid__media',
    '.gm-hotel-tile__media',
    '.gm-room-card > img',
    '.gm-scroll-overlay-card',
    '.gm-charter-compliance__grid article',
    '.gm-service-card > img',
    '.gm-offer-card > img',
    '.gm-hotel-slide',
    '.gm-hotel-gallery figure',
    '.gm-offer-gallery__item img',
    '.gm-radical-chapter__media',
    '.gm-radical-destinations__visual',
    '.gm-radical-use img',
    '.gm-radical-hotel img',
    '.gm-radical-moment img',
  ].join(', '))

  imageBlocks.forEach((element) => {
    gsap.from(element, {
      x: -38,
      autoAlpha: 0,
      duration: 0.68,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })

  const textBlocks = root.querySelectorAll([
    '.gm-page-hero__content',
    '.gm-page-intro .gm-rich-copy',
    '.gm-section-head',
    '.gm-story-row > div:not(.gm-attraction-grid)',
    '.gm-business-row > div',
    '.gm-destination-guide__body',
    '.gm-hotel-section > div',
    '.gm-hotel-tile__body',
    '.gm-room-card > div',
    '.gm-room-showcase__intro',
    '.gm-scroll-overlays__copy',
    '.gm-service-card > div',
    '.gm-offer-card > div',
    '.gm-mice-command > div:first-child',
    '.gm-offer-engine > div:first-child',
    '.gm-hotel-sales-panel__copy',
    '.gm-hotel-booking-panel > div:first-child',
    '.gm-radical-chapter__copy',
    '.gm-radical-destinations__copy',
    '.gm-radical-use > div',
    '.gm-radical-hotel > div',
    '.gm-radical-moment > div',
  ].join(', '))

  textBlocks.forEach((element) => {
    gsap.from(element, {
      x: 34,
      autoAlpha: 0,
      duration: 0.62,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      immediateRender: false,
      scrollTrigger: { trigger: element, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })
}

function centerOut(items) {
  const center = Math.floor((items.length - 1) / 2)
  return [...items].sort((a, b) => {
    const distance = Math.abs(items.indexOf(a) - center) - Math.abs(items.indexOf(b) - center)
    if (distance !== 0) return distance
    return items.indexOf(a) - items.indexOf(b)
  })
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
    const offerBoard = document.querySelector('.gm-offer-board')
    const offerRows = document.querySelectorAll('.gm-offer-row')
    if (!offerBoard || !offerRows.length) return

    gsap.from(offerRows, {
      xPercent: -4,
      stagger: 0.08,
      duration: 0.78,
      ease: 'power3.out',
      immediateRender: false,
      scrollTrigger: { trigger: offerBoard, start: 'top 76%', toggleActions: 'play none none none' },
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
