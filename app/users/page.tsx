import { Suspense } from 'react'
import { Users, UserPlus, Search, Filter } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import UserTable from '@/components/UserTable'
import UserStats from '@/components/UserStats'
import UserSearch from '@/components/UserSearch'
import UserFilters from '@/components/UserFilters'
import { getUsers, getUserSessions } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function UsersContent() {
  try {
    const [users, sessions] = await Promise.all([
      getUsers(),
      getUserSessions()
    ])

    const userMetrics = calculateUserMetrics(users)
    
    // Calculate recent growth
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentUsers = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date || user.created_at)
      return signupDate >= thirtyDaysAgo
    })

    const growthPercentage = calculateGrowthPercentage(
      userMetrics.totalUsers, 
      Math.max(1, userMetrics.totalUsers - recentUsers.length)
    )

    // Calculate user engagement
    const uniqueSessionUsers = new Set(sessions.map(s => s.metadata.user_id)).size
    const engagementRate = userMetrics.totalUsers > 0 ? (uniqueSessionUsers / userMetrics.totalUsers) * 100 : 0

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, track subscriptions, and analyze user behavior
          </p>
        </div>

        {/* User Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <UserSearch />
          </div>
          <div className="lg:w-80">
            <UserFilters />
          </div>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change={growthPercentage}
            trend={recentUsers.length > 0 ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Pro Subscribers"
            value={formatNumber(userMetrics.proUsers)}
            change={`${userMetrics.conversionRate.toFixed(1)}% conversion`}
            icon={<UserPlus size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(userMetrics.activeUsers)}
            change={`${engagementRate.toFixed(1)}% engaged`}
            icon={<Search size={24} />}
          />
          <MetricCard
            title="New This Month"
            value={formatNumber(recentUsers.length)}
            change="last 30 days"
            trend={recentUsers.length > 0 ? 'up' : 'neutral'}
            icon={<Filter size={24} />}
          />
        </div>

        {/* User Statistics */}
        <UserStats 
          users={users}
          freeUsers={userMetrics.freeUsers}
          proUsers={userMetrics.proUsers}
          conversionRate={userMetrics.conversionRate}
        />

        {/* User Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">
              All Users ({formatNumber(userMetrics.totalUsers)})
            </h3>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <UserPlus size={16} />
              Add User
            </button>
          </div>
          <UserTable users={users} showActions={true} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Users page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            User Data Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load user data. Please check your configuration.
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