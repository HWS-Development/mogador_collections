import { images } from '../data/images'

export default function ScenicPanel({ scene = 'hero', label, className = '' }) {
  const media = images.media[scene]

  return (
    <div className={`scenic-panel ${images.scenes[scene] || images.scenes.hero} ${className}`} aria-label={label || scene}>
      {media ? <img className="scenic-panel__image" src={media} alt="" aria-hidden="true" /> : null}
      <span className="scenic-panel__shine" />
      <span className="scenic-panel__mark" />
    </div>
  )
}
