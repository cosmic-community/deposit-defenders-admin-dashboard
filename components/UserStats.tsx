import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  conversionRate: number;
}

export default function UserStats({ 
  totalUsers, 
  activeUsers, 
  proUsers, 
  conversionRate 
}: UserStatsProps) {
  const freeUsers = totalUsers - proUsers
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
  
  // Fix: Ensure proper trend type validation
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-500" />
      case 'down':
        return <TrendingDown size={16} className="text-red-500" />
      default:
        return <Minus size={16} className="text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  // Fix: Ensure trend is properly typed as one of the allowed values
  const getConversionTrend = (): 'up' | 'down' | 'neutral' => {
    if (conversionRate > 15) return 'up'
    if (conversionRate < 5) return 'down'
    return 'neutral'
  }

  const conversionTrend = getConversionTrend()

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">User Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Users
          </div>
        </div>

        {/* Active Users */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            Active Users
          </div>
          <div className="flex items-center justify-center gap-1">
            {getTrendIcon(activePercentage > 70 ? 'up' : activePercentage < 30 ? 'down' : 'neutral')}
            <span className={`text-xs ${getTrendColor(activePercentage > 70 ? 'up' : activePercentage < 30 ? 'down' : 'neutral')}`}>
              {activePercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Pro Users */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {proUsers.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            Pro Subscribers
          </div>
          <div className="flex items-center justify-center gap-1">
            {getTrendIcon(conversionTrend)}
            <span className={`text-xs ${getTrendColor(conversionTrend)}`}>
              {conversionRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Free Users */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground mb-2">
            {freeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Free Users
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-8 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Active Users</span>
            <span className="text-foreground">{activePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-accent rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, activePercentage)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Pro Conversion Rate</span>
            <span className="text-foreground">{conversionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-accent rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, conversionRate * 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}