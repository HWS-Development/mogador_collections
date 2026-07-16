import { brand } from '../data/siteData'
import Link from '../router/Link'

export default function ConversionDock({ t }) {
  return (
    <>
      <style>{`
        html body .conversion-dock.conversion-dock--actions-only,
        html body:not(.show-conversion-dock) .conversion-dock.conversion-dock--actions-only,
        html body.show-conversion-dock .conversion-dock.conversion-dock--actions-only {
          position: relative !important;
          left: auto !important;
          right: auto !important;
          top: auto !important;
          bottom: auto !important;
          inset: auto !important;
          display: block !important;
          box-sizing: border-box !important;
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          background: var(--white) !important;
          border: 0 !important;
          border-top: 1px solid rgba(191, 165, 147, 0.32) !important;
          box-shadow: none !important;
        }

        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__proof {
          display: none !important;
        }

        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions {
          display: grid !important;
          grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          box-sizing: border-box !important;
          width: 100% !important;
          min-width: 0 !important;
          height: 56px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a {
          position: static !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
          width: auto !important;
          min-width: 0 !important;
          max-width: none !important;
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
          margin: 0 !important;
          padding: 0.5rem 0.45rem !important;
          overflow: hidden !important;
          border: 0 !important;
          border-left: 1px solid rgba(191, 165, 147, 0.32) !important;
          color: var(--red) !important;
          background: var(--white) !important;
          box-shadow: none !important;
          font-size: clamp(0.58rem, 0.68vw, 0.72rem) !important;
          line-height: 1 !important;
          letter-spacing: 0.08em !important;
          text-align: center !important;
          text-overflow: clip !important;
          white-space: nowrap !important;
          writing-mode: horizontal-tb !important;
          text-orientation: mixed !important;
          transform: none !important;
        }

        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:first-child {
          color: var(--white) !important;
          background: var(--red) !important;
        }

        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:hover,
        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:focus-visible,
        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:first-child:hover,
        html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:first-child:focus-visible {
          color: var(--white) !important;
          background: var(--grand-blue) !important;
          border-color: var(--grand-blue) !important;
        }

        @media (max-width: 820px) {
          html body .conversion-dock.conversion-dock--actions-only,
          html body:not(.show-conversion-dock) .conversion-dock.conversion-dock--actions-only,
          html body.show-conversion-dock .conversion-dock.conversion-dock--actions-only {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }

          html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            height: auto !important;
          }

          html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a {
            height: auto !important;
            min-height: 56px !important;
            max-height: none !important;
            padding: 0.75rem 0.65rem !important;
            overflow: visible !important;
            font-size: 0.68rem !important;
            line-height: 1.25 !important;
            white-space: normal !important;
            text-wrap: balance !important;
          }

          html body .conversion-dock.conversion-dock--actions-only .conversion-dock__actions a:last-child {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
      <aside className="conversion-dock conversion-dock--actions-only" aria-label="Actions de réservation Mogador">
        <div className="conversion-dock__actions">
          <Link to="/#reservation" data-track="dock_booking">{t.common.bookDirect}</Link>
          <Link to="/offres" data-track="dock_offers">Offres</Link>
          <Link to="/hotels" data-track="dock_hotels">Hôtels</Link>
          <Link to="/reunions-evenements" data-track="dock_mice">{t.common.quoteMice}</Link>
          <a href={`tel:${brand.phone}`} data-track="dock_call">{t.common.call}</a>
        </div>
      </aside>
    </>
  )
}
