import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { hotels } from '../data/siteData'
import { images } from '../data/images'
import { translateDestinationName } from '../i18n/hotelLabels'

const guestOptions = {
  fr: [['1', '1 adulte'], ['2', '2 adultes'], ['3', '3 adultes'], ['4', '4 adultes'], ['5', '5 adultes'], ['6', '6 adultes']],
  en: [['1', '1 adult'], ['2', '2 adults'], ['3', '3 adults'], ['4', '4 adults'], ['5', '5 adults'], ['6', '6 adults']],
  ar: [['1', 'بالغ واحد'], ['2', 'بالغان'], ['3', '3 بالغين'], ['4', '4 بالغين'], ['5', '5 بالغين'], ['6', '6 بالغين']],
}

const locales = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-MA' }

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDay(value) {
  return shiftDate(value, 1)
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

function shiftDate(value, amount) {
  const date = parseDate(value)
  date.setDate(date.getDate() + amount)
  return formatLocalDate(date)
}

function monthStart(value) {
  const date = parseDate(value)
  date.setDate(1)
  return formatLocalDate(date)
}

function shiftMonth(value, amount) {
  const date = parseDate(value)
  date.setDate(1)
  date.setMonth(date.getMonth() + amount)
  return formatLocalDate(date)
}

function shiftDateMonth(value, amount) {
  const date = parseDate(value)
  const desiredDay = date.getDate()
  date.setDate(1)
  date.setMonth(date.getMonth() + amount)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12).getDate()
  date.setDate(Math.min(desiredDay, lastDay))
  return formatLocalDate(date)
}

function getCalendarDates(monthValue) {
  const first = parseDate(monthStart(monthValue))
  const offsetFromMonday = (first.getDay() + 6) % 7
  first.setDate(first.getDate() - offsetFromMonday)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(first)
    date.setDate(first.getDate() + index)
    return formatLocalDate(date)
  })
}

function formatBookingDate(value, lang) {
  const date = parseDate(value)
  const locale = locales[lang] || locales.fr
  return {
    date: new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date),
  }
}

function formatFullDate(value, lang) {
  return new Intl.DateTimeFormat(locales[lang] || locales.fr, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseDate(value))
}

function formatMonth(value, lang) {
  return new Intl.DateTimeFormat(locales[lang] || locales.fr, { month: 'long', year: 'numeric' }).format(parseDate(value))
}

function getWeekdays(lang) {
  const monday = new Date(2026, 0, 5, 12)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      short: new Intl.DateTimeFormat(locales[lang] || locales.fr, { weekday: 'narrow' }).format(date),
      full: new Intl.DateTimeFormat(locales[lang] || locales.fr, { weekday: 'long' }).format(date),
    }
  })
}

function BookingIcon({ name }) {
  let content
  if (name === 'hotel') {
    content = <><path d="M5 21V6l7-3 7 3v15" /><path d="M3 21h18M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 21v-4h6v4" /></>
  } else if (name === 'calendar') {
    content = <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>
  } else if (name === 'guests') {
    content = <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
  } else if (name === 'tag') {
    content = <><path d="M20.6 13.6 11 23l-9-9V2h12l6.6 6.6a3.5 3.5 0 0 1 0 5Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>
  } else if (name === 'chevron') {
    content = <path d="m7 9 5 5 5-5" />
  } else if (name === 'check') {
    content = <path d="m5 12 4 4L19 6" />
  } else if (name === 'arrow') {
    content = <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>
  } else if (name === 'shield') {
    content = <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>
  } else if (name === 'close') {
    content = <><path d="M6 6l12 12M18 6 6 18" /></>
  } else if (name === 'plus') {
    content = <><path d="M12 5v14M5 12h14" /></>
  } else if (name === 'previous') {
    content = <path d="m15 18-6-6 6-6" />
  } else if (name === 'next') {
    content = <path d="m9 18 6-6-6-6" />
  }

  return (
    <svg className={`booking-icon booking-icon--${name}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {content}
    </svg>
  )
}

function BookingFieldLabel({ id, index, children }) {
  return (
    <span className="booking-field__label" id={id}>
      <b>{index}</b><span>{children}</span>
    </span>
  )
}

function BookingChoice({ index, name, label, value, options, onChange, placeholder, icon, error, closeLabel }) {
  const uid = useId()
  const labelId = `${uid}-label`
  const listId = `${uid}-list`
  const errorId = `${uid}-error`
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const focusOptionsOnOpen = useRef(false)
  const [open, setOpen] = useState(false)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0)

  useEffect(() => {
    if (!open) return undefined
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0
    setActiveIndex(nextIndex)
    const frame = focusOptionsOnOpen.current
      ? window.requestAnimationFrame(() => optionRefs.current[nextIndex]?.focus())
      : 0
    focusOptionsOnOpen.current = false
    return () => window.cancelAnimationFrame(frame)
  }, [open, selectedIndex])

  const close = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const choose = (optionIndex) => {
    const option = options[optionIndex]
    if (!option) return
    onChange(option.value)
    close()
  }

  const move = (nextIndex) => {
    if (!options.length) return
    const normalized = (nextIndex + options.length) % options.length
    setActiveIndex(normalized)
    window.requestAnimationFrame(() => optionRefs.current[normalized]?.focus())
  }

  const handleListKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      move(activeIndex + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      move(activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      move(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      move(options.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const focusedIndex = Number(event.target.dataset.optionIndex)
      choose(Number.isInteger(focusedIndex) ? focusedIndex : activeIndex)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (open) {
        move(activeIndex + (event.key === 'ArrowDown' ? 1 : -1))
      } else {
        focusOptionsOnOpen.current = true
        setOpen(true)
      }
    } else if (event.key === 'Escape' && open) {
      event.preventDefault()
      close()
    }
  }

  return (
    <div className={`booking-field booking-choice booking-choice--${name}${open ? ' is-open' : ''}${error ? ' has-error' : ''}`}>
      <BookingFieldLabel id={labelId} index={index}>{label}</BookingFieldLabel>
      <button
        ref={triggerRef}
        className="booking-choice__trigger"
        type="button"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${selected?.label || placeholder}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        data-booking-control={name}
        onClick={() => {
          focusOptionsOnOpen.current = false
          setOpen((current) => !current)
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <BookingIcon name={icon} />
        <span className="booking-choice__value">
          <strong>{selected?.label || placeholder}</strong>
          {selected?.meta ? <small>{selected.meta}</small> : null}
        </span>
        <BookingIcon name="chevron" />
      </button>
      <input name={name} type="hidden" value={value} />
      {error ? <span className="booking-field__error" id={errorId} role="alert">{error}</span> : null}
      {open ? (
        <>
          <button className="booking-choice__backdrop" type="button" tabIndex="-1" aria-label={closeLabel} onClick={() => close()} />
          <div className="booking-choice__popover">
            <div className="booking-choice__header">
              <span>{label}</span>
              <button className="booking-choice__close" type="button" aria-label={closeLabel} onClick={() => close()}><BookingIcon name="close" /></button>
            </div>
            <div className="booking-choice__list" id={listId} role="listbox" aria-labelledby={labelId} onKeyDown={handleListKeyDown}>
              {options.map((option, optionIndex) => (
                <button
                  ref={(node) => { optionRefs.current[optionIndex] = node }}
                  className={`booking-choice__option${option.value === value ? ' is-selected' : ''}`}
                  id={`${uid}-option-${optionIndex}`}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  data-option-index={optionIndex}
                  tabIndex={optionIndex === activeIndex ? 0 : -1}
                  onClick={() => choose(optionIndex)}
                  onMouseEnter={() => setActiveIndex(optionIndex)}
                  key={option.value}
                >
                  <BookingIcon name="check" />
                  <span><strong>{option.label}</strong>{option.meta ? <small>{option.meta}</small> : null}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function BookingDatePicker({ index, name, label, value, min, rangeStart, rangeEnd, onChange, lang, closeLabel, previousLabel, nextLabel }) {
  const uid = useId()
  const labelId = `${uid}-label`
  const dialogId = `${uid}-dialog`
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)
  const dayRefs = useRef(new Map())
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(monthStart(value))
  const [activeDate, setActiveDate] = useState(value)
  const formatted = formatBookingDate(value, lang)
  const calendarDates = useMemo(() => getCalendarDates(visibleMonth), [visibleMonth])
  const weekdays = useMemo(() => getWeekdays(lang), [lang])
  const weeks = Array.from({ length: 6 }, (_, week) => calendarDates.slice(week * 7, week * 7 + 7))
  const today = formatLocalDate(new Date())
  const canGoPrevious = visibleMonth.slice(0, 7) > min.slice(0, 7)

  useEffect(() => {
    if (!open) return undefined
    const frame = window.requestAnimationFrame(() => dayRefs.current.get(activeDate)?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [activeDate, open, visibleMonth])

  useLayoutEffect(() => {
    if (!open || !popoverRef.current) return undefined
    const popover = popoverRef.current
    const adjust = () => {
      popover.style.marginBlockStart = '0px'
      if (!window.matchMedia('(min-width: 768px)').matches) return
      const rect = popover.getBoundingClientRect()
      let shift = -Math.max(0, rect.bottom - (window.innerHeight - 12))
      if (rect.top + shift < 12) shift += 12 - (rect.top + shift)
      popover.style.marginBlockStart = `${shift}px`
    }
    adjust()
    window.addEventListener('resize', adjust)
    return () => window.removeEventListener('resize', adjust)
  }, [open, visibleMonth])

  const show = () => {
    const next = value < min ? min : value
    setActiveDate(next)
    setVisibleMonth(monthStart(next))
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const choose = (date) => {
    if (date < min) return
    onChange(date)
    close()
  }

  const focusDate = (date) => {
    const next = date < min ? min : date
    setActiveDate(next)
    if (monthStart(next) !== visibleMonth) setVisibleMonth(monthStart(next))
  }

  const changeMonth = (amount) => {
    const nextMonth = shiftMonth(visibleMonth, amount)
    setVisibleMonth(nextMonth)
    setActiveDate(nextMonth < min ? min : nextMonth)
  }

  const handleDayKeyDown = (event, date) => {
    const forward = lang === 'ar' ? -1 : 1
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusDate(shiftDate(date, forward))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusDate(shiftDate(date, -forward))
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusDate(shiftDate(date, 7))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusDate(shiftDate(date, -7))
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusDate(shiftDate(date, -((parseDate(date).getDay() + 6) % 7)))
    } else if (event.key === 'End') {
      event.preventDefault()
      focusDate(shiftDate(date, 6 - ((parseDate(date).getDay() + 6) % 7)))
    } else if (event.key === 'PageUp') {
      event.preventDefault()
      focusDate(shiftDateMonth(date, -1))
    } else if (event.key === 'PageDown') {
      event.preventDefault()
      focusDate(shiftDateMonth(date, 1))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(date)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
    }
  }

  return (
    <div className={`booking-field booking-datepicker booking-datepicker--${name}${open ? ' is-open' : ''}`}>
      <BookingFieldLabel id={labelId} index={index}>{label}</BookingFieldLabel>
      <button
        ref={triggerRef}
        className="booking-datepicker__trigger"
        type="button"
        aria-controls={dialogId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`${label}: ${formatFullDate(value, lang)}`}
        data-booking-control={name}
        onClick={() => open ? close() : show()}
      >
        <BookingIcon name="calendar" />
        <span><strong>{formatted.date}</strong><small>{formatted.weekday}</small></span>
        <BookingIcon name="chevron" />
      </button>
      <input name={name} type="hidden" value={value} />
      {open ? (
        <>
          <button className="booking-choice__backdrop booking-datepicker__backdrop" type="button" tabIndex="-1" aria-label={closeLabel} onClick={close} />
          <div ref={popoverRef} className="booking-datepicker__popover" id={dialogId} role="dialog" aria-labelledby={labelId} onKeyDown={(event) => {
            if (event.key !== 'Escape') return
            event.preventDefault()
            close()
          }}>
            <div className="booking-datepicker__header">
              <span>{label}</span>
              <button className="booking-choice__close" type="button" aria-label={closeLabel} onClick={close}><BookingIcon name="close" /></button>
            </div>
            <div className="booking-datepicker__month-nav">
              <button type="button" aria-label={previousLabel} disabled={!canGoPrevious} onClick={() => changeMonth(-1)}><BookingIcon name="previous" /></button>
              <strong aria-live="polite">{formatMonth(visibleMonth, lang)}</strong>
              <button type="button" aria-label={nextLabel} onClick={() => changeMonth(1)}><BookingIcon name="next" /></button>
            </div>
            <div className="booking-datepicker__calendar" role="grid" aria-label={formatMonth(visibleMonth, lang)}>
              <div className="booking-datepicker__weekdays" role="row">
                {weekdays.map((weekday, weekdayIndex) => <span role="columnheader" aria-label={weekday.full} key={`${weekday.full}-${weekdayIndex}`}>{weekday.short}</span>)}
              </div>
              {weeks.map((week, weekIndex) => (
                <div className="booking-datepicker__week" role="row" key={week[0]}>
                  {week.map((date) => {
                    const disabled = date < min
                    const outside = date.slice(0, 7) !== visibleMonth.slice(0, 7)
                    const inRange = rangeStart && rangeEnd && date >= rangeStart && date <= rangeEnd
                    const classes = [
                      'booking-datepicker__day',
                      outside ? 'is-outside' : '',
                      date === today ? 'is-today' : '',
                      date === value ? 'is-selected' : '',
                      inRange ? 'is-in-range' : '',
                      date === rangeStart ? 'is-range-start' : '',
                      date === rangeEnd ? 'is-range-end' : '',
                    ].filter(Boolean).join(' ')
                    return (
                      <button
                        ref={(node) => {
                          if (node) dayRefs.current.set(date, node)
                          else dayRefs.current.delete(date)
                        }}
                        className={classes}
                        type="button"
                        role="gridcell"
                        aria-label={formatFullDate(date, lang)}
                        aria-selected={date === value}
                        aria-current={date === today ? 'date' : undefined}
                        disabled={disabled}
                        tabIndex={date === activeDate ? 0 : -1}
                        onClick={() => choose(date)}
                        onFocus={() => setActiveDate(date)}
                        onKeyDown={(event) => handleDayKeyDown(event, date)}
                        key={date}
                      >
                        <span>{parseDate(date).getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function PromoField({ label, placeholder, action, value, onChange }) {
  const inputId = useId()
  const inputRef = useRef(null)
  const [open, setOpen] = useState(Boolean(value))

  const reveal = () => {
    setOpen(true)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className={`booking-promo${open ? ' is-open' : ''}`}>
      <button className="booking-promo__toggle" type="button" aria-expanded={open} aria-controls={inputId} onClick={reveal}>
        <BookingIcon name="tag" />
        <span><strong>{action}</strong><small>{placeholder}</small></span>
        <BookingIcon name="plus" />
      </button>
      <label className="booking-field booking-field--promo" htmlFor={inputId}>
        <BookingFieldLabel index="05">{label}</BookingFieldLabel>
        <span className="booking-promo__control">
          <BookingIcon name="tag" />
          <input ref={inputRef} id={inputId} name="promo" type="text" value={value} onChange={onChange} placeholder={placeholder} autoComplete="off" />
        </span>
      </label>
    </div>
  )
}

export default function BookingBar({
  t,
  variant = 'default',
  source = 'site',
  showPromo = true,
  initialDestination = 'Marrakech',
  hotel = '',
  offer = '',
  lang = '',
}) {
  const { today, tomorrow } = useMemo(() => {
    const now = new Date()
    const next = new Date(now)
    next.setDate(now.getDate() + 1)
    return { today: formatLocalDate(now), tomorrow: formatLocalDate(next) }
  }, [])
  const bookableHotels = useMemo(() => hotels.filter((property) => property.bookingUrl), [])
  const selectedProperty = bookableHotels.find((property) => property.slug === hotel || property.name === hotel)
  const contactChoice = hotel && !selectedProperty ? `contact:${hotel}` : ''
  const orderedHotels = useMemo(
    () => [...bookableHotels].sort((a, b) => Number(b.destination === initialDestination) - Number(a.destination === initialDestination)),
    [bookableHotels, initialDestination],
  )
  const currentLang = ['fr', 'en', 'ar'].includes(lang) ? lang : (document.documentElement.lang || 'fr')
  const [search, setSearch] = useState({ hotel: selectedProperty?.slug || contactChoice, arrival: today, departure: tomorrow, guests: '2', promo: '' })
  const [hotelError, setHotelError] = useState('')
  const hotelOptions = [
    ...(contactChoice ? [{ value: contactChoice, label: hotel, meta: translateDestinationName(initialDestination, currentLang) }] : []),
    ...orderedHotels.map((property) => ({ value: property.slug, label: property.name, meta: translateDestinationName(property.destination, currentLang) })),
  ]
  const travellers = (guestOptions[currentLang] || guestOptions.fr).map(([value, label]) => ({ value, label }))

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!search.hotel) {
      setHotelError(t.booking.hotelRequired || t.booking.hotelPlaceholder)
      window.requestAnimationFrame(() => form.querySelector('[data-booking-control="hotel"]')?.focus())
      return
    }

    const bookingHotel = bookableHotels.find((property) => property.slug === search.hotel)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'booking_search',
      source,
      hotel: bookingHotel?.name || hotel,
      offer,
      booking_provider: bookingHotel ? 'hotelrunner' : 'contact',
    })

    if (!bookingHotel) {
      const request = {
        request: offer ? 'offre' : 'reservation',
        hotel: hotel || search.hotel.replace('contact:', ''),
        arrival: search.arrival,
        departure: search.departure,
        guests: search.guests,
      }
      if (offer) request.offer = offer
      window.location.href = `/contact?${new URLSearchParams(request).toString()}`
      return
    }

    const params = new URLSearchParams({
      search: JSON.stringify({
        checkin_date: search.arrival,
        checkout_date: search.departure,
        rooms: [{ adult_count: Number(search.guests), child_count: 0, child_ages: [] }],
      }),
      locale: currentLang,
    })
    if (search.promo.trim()) params.set('coupon_code', search.promo.trim())
    window.location.href = `${bookingHotel.bookingUrl}?${params.toString()}`
  }

  const handleArrival = (arrival) => {
    setSearch((current) => ({
      ...current,
      arrival,
      departure: current.departure <= arrival ? addDay(arrival) : current.departure,
    }))
  }

  const updateInput = (field) => (event) => {
    setSearch((current) => ({ ...current, [field]: event.target.value }))
  }

  const updateChoice = (field) => (value) => {
    setSearch((current) => ({ ...current, [field]: value }))
    if (field === 'hotel') setHotelError('')
  }

  return (
    <form className={`booking-bar booking-bar--premium booking-bar--${variant}${showPromo ? '' : ' booking-bar--no-promo'}`} aria-label={t.booking.formLabel || t.common.directBooking} onSubmit={handleSubmit}>
      <div className="booking-bar__seal" aria-hidden="true">
        <span className="booking-bar__seal-mark"><img src={images.brand.mark} alt="" /></span>
        <span className="booking-bar__seal-copy"><small>Mogador</small><strong>{t.common.directBooking}</strong></span>
      </div>
      <div className="booking-bar__fields">
        <BookingChoice
          index="01"
          name="hotel"
          label={t.booking.hotel || t.booking.destination}
          value={search.hotel}
          options={hotelOptions}
          onChange={updateChoice('hotel')}
          placeholder={t.booking.hotelPlaceholder || t.booking.destination}
          icon="hotel"
          error={hotelError}
          closeLabel={t.booking.closeOptions || t.booking.takeover?.close}
        />
        <BookingDatePicker
          index="02"
          name="arrival"
          label={t.booking.arrival}
          value={search.arrival}
          min={today}
          rangeStart={search.arrival}
          rangeEnd={search.departure}
          onChange={handleArrival}
          lang={currentLang}
          closeLabel={t.booking.closeOptions || t.booking.takeover?.close}
          previousLabel={t.booking.previousMonth}
          nextLabel={t.booking.nextMonth}
        />
        <BookingDatePicker
          index="03"
          name="departure"
          label={t.booking.departure}
          value={search.departure}
          min={addDay(search.arrival)}
          rangeStart={search.arrival}
          rangeEnd={search.departure}
          onChange={updateChoice('departure')}
          lang={currentLang}
          closeLabel={t.booking.closeOptions || t.booking.takeover?.close}
          previousLabel={t.booking.previousMonth}
          nextLabel={t.booking.nextMonth}
        />
        <BookingChoice
          index="04"
          name="guests"
          label={t.booking.guests}
          value={search.guests}
          options={travellers}
          onChange={updateChoice('guests')}
          placeholder={t.booking.guests}
          icon="guests"
          closeLabel={t.booking.closeOptions || t.booking.takeover?.close}
        />
        {showPromo ? <PromoField label={t.booking.promo} placeholder={t.booking.promoPlaceholder} action={t.booking.promoAction || t.booking.promo} value={search.promo} onChange={updateInput('promo')} /> : null}
      </div>
      <button className="booking-bar__submit" type="submit" data-track="booking_submit">
        <span>{t.booking.search}</span><BookingIcon name="arrow" />
      </button>
      <p className="booking-bar__note"><BookingIcon name="shield" /><span>{t.booking.idle}</span></p>
    </form>
  )
}
