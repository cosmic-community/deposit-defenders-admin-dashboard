import { Suspense } from 'react'
import { Users, UserPlus, Filter, Search } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import UserTable from '@/components/UserTable'
import UserFilters from '@/components/UserFilters'
import UserSearch from '@/components/UserSearch'
import UserStats from '@/components/UserStats'
import { getUsers } from '@/lib/cosmic'
import { calculateUserMetrics, formatNumber, calculateGrowthPercentage } from '@/lib/analytics'

async function UsersContent() {
  try {
    const users = await getUsers()
    const userMetrics = calculateUserMetrics(users)

    // Calculate growth metrics
    const today = new Date().toISOString().split('T')[0]
    const newUsersToday = users.filter(user => {
      const signupDate = (user.metadata.signup_date || user.created_at).split('T')[0]
      return signupDate === today
    }).length

    const thisWeek = new Date()
    thisWeek.setDate(thisWeek.getDate() - 7)
    const newUsersThisWeek = users.filter(user => {
      const signupDate = new Date(user.metadata.signup_date || user.created_at)
      return signupDate >= thisWeek
    }).length

    // Mock previous week for growth calculation
    const prevWeekUsers = Math.max(0, newUsersThisWeek - 5)
    const weeklyGrowth = calculateGrowthPercentage(newUsersThisWeek, prevWeekUsers)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor all users on your Deposit Defenders platform
          </p>
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={formatNumber(userMetrics.totalUsers)}
            change="all time"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="New Today"
            value={formatNumber(newUsersToday)}
            change="vs yesterday"
            trend={newUsersToday > 0 ? 'up' : 'neutral'}
            icon={<UserPlus size={24} />}
          />
          <MetricCard
            title="Weekly Growth"
            value={weeklyGrowth}
            change="new users"
            trend={newUsersThisWeek > prevWeekUsers ? 'up' : 'neutral'}
            icon={<Filter size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(userMetrics.activeUsers)}
            change={`${((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}% of total`}
            icon={<Search size={24} />}
          />
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserSearch />
          </div>
          <div>
            <UserFilters />
          </div>
        </div>

        {/* User Stats and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <UserStats users={users} />
          </div>
          <div className="lg:col-span-3">
            <UserTable users={users} showActions={true} />
          </div>
        </div>
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
            Unable to load users data. Please check your Cosmic configuration.
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
      
      <div className="h-96 bg-accent rounded animate-pulse" />
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