import { Suspense } from 'react'
import { Users, UserPlus, Crown, Activity } from 'lucide-react'
import UserTable from '@/components/UserTable'
import UserStats from '@/components/UserStats'
import UserSearch from '@/components/UserSearch'
import UserFilters from '@/components/UserFilters'
import MetricCard from '@/components/MetricCard'
import { getUsers, getUserSessions } from '@/lib/cosmic'
import { formatNumber, calculateGrowthPercentage } from '@/lib/analytics'

async function UsersContent() {
  try {
    const [users, sessions] = await Promise.all([
      getUsers(),
      getUserSessions()
    ])

    const freeUsers = users.filter(user => user.metadata.subscription_plan === 'free').length
    const proUsers = users.filter(user => user.metadata.subscription_plan === 'pro').length
    const activeUsers = users.filter(user => user.metadata.status === 'active').length
    const conversionRate = users.length > 0 ? (proUsers / users.length) * 100 : 0

    // Fix: Create UserStats compatible props with proper structure
    const userStatsProps = {
      totalUsers: users.length,
      activeUsers: activeUsers,
      proUsers: proUsers,
      conversionRate: conversionRate
    }

    const growth = calculateGrowthPercentage(users.length, Math.max(0, users.length - 10))

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Track user activity, subscriptions, and engagement metrics
          </p>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(users.length)}
            change={growth}
            trend="up"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(activeUsers)}
            change={`${((activeUsers / users.length) * 100).toFixed(1)}% of total`}
            trend="up"
            icon={<Activity size={24} />}
          />
          <MetricCard
            title="Pro Subscribers"
            value={formatNumber(proUsers)}
            change={`${conversionRate.toFixed(1)}% conversion`}
            trend="up"
            icon={<Crown size={24} />}
          />
          <MetricCard
            title="New Users"
            value={formatNumber(Math.min(10, users.length))}
            change="Last 7 days"
            trend="up"
            icon={<UserPlus size={24} />}
          />
        </div>

        {/* User Stats Component */}
        <UserStats {...userStatsProps} />

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserSearch />
          </div>
          <div>
            <UserFilters />
          </div>
        </div>

        {/* Users Table */}
        <UserTable users={users} />
      </div>
    )
  } catch (error) {
    console.error('Users page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Users Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load users data. Please check your configuration.
          </p>
        </div>
      </div>
    )
  }
}

function UsersLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="border-b border-border pb-6">
        <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-accent rounded animate-pulse w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  )
}