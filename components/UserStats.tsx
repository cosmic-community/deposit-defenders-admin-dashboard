import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown,
  TrendingUp,
  Calendar
} from 'lucide-react'
import MetricCard from './MetricCard'

interface UserStatsProps {
  metrics: {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    proUsers: number
    freeUsers: number
    newUsersThisMonth: number
    conversionRate: number
  }
}

export default function UserStats({ metrics }: UserStatsProps) {
  const conversionPercentage = metrics.conversionRate.toFixed(1)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Users"
        value={metrics.totalUsers.toLocaleString()}
        change={`${metrics.newUsersThisMonth} this month`}
        trend={metrics.newUsersThisMonth > 0 ? 'up' : 'neutral'}
        icon={<Users size={24} />}
      />
      
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.toLocaleString()}
        change={`${metrics.inactiveUsers} inactive`}
        trend={metrics.activeUsers > metrics.inactiveUsers ? 'up' : 'neutral'}
        icon={<UserCheck size={24} />}
      />
      
      <MetricCard
        title="Pro Subscribers"
        value={metrics.proUsers.toLocaleString()}
        change={`${conversionPercentage}% conversion`}
        trend={metrics.conversionRate > 10 ? 'up' : 'neutral'}
        icon={<Crown size={24} />}
      />
      
      <MetricCard
        title="Growth Rate"
        value={`${metrics.newUsersThisMonth}`}
        change="new users this month"
        trend={metrics.newUsersThisMonth > 0 ? 'up' : 'neutral'}
        icon={<TrendingUp size={24} />}
      />
    </div>
  )
}