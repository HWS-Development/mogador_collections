import { hotelRunnerImageSets } from '../data/hotelRunnerData'

export default function ResponsiveImage({ src, sizes = '100vw', ...props }) {
  const srcSet = hotelRunnerImageSets[src]

  return <img {...props} src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} />
}
