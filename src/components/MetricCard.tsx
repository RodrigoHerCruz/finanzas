// import { Icon, type IconName } from './Icon'
import { currency } from '../utils/format'
export function MetricCard({
  // icon,
  title,
  value,
  type,
}: {
  // icon: IconName
  title: string
  value: number
  type: string
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${type}`}>
        {/* <Icon name={icon} /> */}
      </div>
      <div>
        <p>{title}</p>
        <h3>{currency(value)}</h3>
      </div>
    </article>
  )
}
