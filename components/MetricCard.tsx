import { MetricCardProps } from '@/types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function MetricCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon 
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}