import { images } from '../data/images'

export default function RouteTransition() {
  return (
    <div className="gm-route-transition" aria-hidden="true">
      <div className="gm-route-transition__plane gm-route-transition__plane--paper" />
      <div className="gm-route-transition__plane gm-route-transition__plane--line" />
      <div className="gm-route-transition__signature">
        <img src={images.brand.mark} alt="" />
        <span>Une histoire marocaine</span>
      </div>
    </div>
  )
}
