import { User } from '@/types'
import { Users, UserPlus, TrendingUp, CreditCard } from 'lucide-react'

interface UserStatsProps {
  users: User[]
  freeUsers: number
  proUsers: number
  conversionRate: number
}

export default function UserStats({ 
  users, 
  freeUsers, 
  proUsers, 
  conversionRate 
}: UserStatsProps) {
  const totalUsers = users.length
  const newUsersThisWeek = users.filter(user => {
    const signupDate = new Date(user.metadata.signup_date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return signupDate >= weekAgo
  }).length

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: <Users size={20} />,
      color: 'text-blue-500'
    },
    {
      title: 'New This Week',
      value: newUsersThisWeek.toLocaleString(),
      icon: <UserPlus size={20} />,
      color: 'text-green-500'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      icon: <TrendingUp size={20} />,
      color: 'text-purple-500'
    },
    {
      title: 'Pro Subscribers',
      value: proUsers.toLocaleString(),
      icon: <CreditCard size={20} />,
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={stat.color}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}