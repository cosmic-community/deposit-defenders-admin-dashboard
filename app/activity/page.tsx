import { Suspense } from 'react'
import { Activity, Users, Clock, Calendar } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ActivityTable from '@/components/ActivityTable'
import ActivityFilters from '@/components/ActivityFilters'
import { getUsers, getUserSessions } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateActivityData,
  createHourlyActivityChart,
  formatNumber,
  calculateGrowthPercentage
} from '@/lib/analytics'

async function ActivityContent() {
  try {
    const [users, sessions] = await Promise.all([
      getUsers(),
      getUserSessions()
    ])

    const userMetrics = calculateUserMetrics(users)
    const activityData = generateActivityData(users, sessions)
    const hourlyActivityChart = createHourlyActivityChart(sessions)

    // Calculate today's activity
    const today = new Date().toISOString().split('T')[0]
    const todayLogins = sessions.filter(session => {
      const loginDate = (session.metadata.login_date || session.created_at).split('T')[0]
      return loginDate === today
    }).length

    const todaySignups = users.filter(user => {
      const signupDate = (user.metadata.signup_date || user.created_at).split('T')[0]
      return signupDate === today
    }).length

    // Calculate growth percentages
    const totalActivity = sessions.length + users.length
    const avgDailyLogins = sessions.length / 30 // rough estimate
    const loginGrowth = calculateGrowthPercentage(todayLogins, avgDailyLogins)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Activity
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor user engagement, logins, and platform activity
          </p>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Logins"
            value={formatNumber(todayLogins)}
            change={loginGrowth}
            trend={todayLogins > avgDailyLogins ? 'up' : 'neutral'}
            icon={<Activity size={24} />}
          />
          <MetricCard
            title="New Signups Today"
            value={formatNumber(todaySignups)}
            change="vs yesterday"
            trend={todaySignups > 0 ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Total Sessions"
            value={formatNumber(sessions.length)}
            change="all time"
            icon={<Clock size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(userMetrics.activeUsers)}
            change={`${userMetrics.totalUsers} total`}
            icon={<Calendar size={24} />}
          />
        </div>

        {/* Filters */}
        <ActivityFilters />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Hourly Activity (Last 24 Hours)"
            data={hourlyActivityChart}
            type="line"
            height={350}
          />
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Activity Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Logins</span>
                <span className="font-semibold">{formatNumber(sessions.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unique Users</span>
                <span className="font-semibold">{formatNumber(userMetrics.totalUsers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-semibold">{formatNumber(userMetrics.activeUsers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Session/User</span>
                <span className="font-semibold">
                  {userMetrics.totalUsers > 0 ? (sessions.length / userMetrics.totalUsers).toFixed(1) : '0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <ActivityTable sessions={sessions.slice(0, 20)} />
      </div>
    )
  } catch (error) {
    console.error('Activity page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Activity Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load activity data. Please check your Cosmic configuration.
          </p>
        </div>
      </div>
    )
  }
}

function ActivityLoading() {
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="chart-container">
            <div className="h-6 bg-accent rounded animate-pulse mb-4 w-48" />
            <div className="h-80 bg-accent rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivityLoading />}>
      <ActivityContent />
    </Suspense>
  )
}