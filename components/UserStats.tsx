import { User } from '@/types'
import { Users, UserPlus, Crown, Activity } from 'lucide-react'
import { formatNumber, calculateGrowthPercentage } from '@/lib/analytics'

export interface UserStatsProps {
  users: User[]
}

export default function UserStats({ users }: UserStatsProps) {
  if (!users || users.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
    )
  }

  const totalUsers = users.length
  const activeUsers = users.filter(user => user.metadata.status === 'active').length
  const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
  const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length

  // Calculate new users today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const newUsersToday = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    return signupDate >= today
  }).length

  // Calculate growth (using mock previous data for demo)
  const prevTotalUsers = Math.max(0, totalUsers - 10) // Mock previous count
  const userGrowth = calculateGrowthPercentage(totalUsers, prevTotalUsers)

  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(totalUsers),
      change: userGrowth,
      trend: totalUsers > prevTotalUsers ? 'up' : 'neutral' as const,
      icon: <Users size={24} />
    },
    {
      title: 'Active Users',
      value: formatNumber(activeUsers),
      change: `${((activeUsers / totalUsers) * 100).toFixed(1)}% of total`,
      trend: activeUsers > 0 ? 'up' : 'neutral' as const,
      icon: <Activity size={24} />
    },
    {
      title: 'Pro Subscribers',
      value: formatNumber(proUsers),
      change: `${((proUsers / totalUsers) * 100).toFixed(1)}% conversion`,
      trend: proUsers > 0 ? 'up' : 'neutral' as const,
      icon: <Crown size={24} />
    },
    {
      title: 'New Today',
      value: formatNumber(newUsersToday),
      change: `${formatNumber(freeUsers)} free users`,
      trend: newUsersToday > 0 ? 'up' : 'neutral' as const,
      icon: <UserPlus size={24} />
    }
  ]

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              {stat.change && (
                <p className={`text-sm mt-2 ${getTrendColor(stat.trend)}`}>
                  {stat.change}
                </p>
              )}
            </div>
            <div className="text-muted-foreground">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}