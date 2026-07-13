import { images } from '../data/images'

export default function PatternRail({ side = 'left' }) {
  return <img className={`pattern-rail pattern-rail--${side}`} src={images.brand.pattern} alt="" aria-hidden="true" />
}
