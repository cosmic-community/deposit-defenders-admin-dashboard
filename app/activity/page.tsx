import { Suspense } from 'react'
import { Activity, Users, Clock, TrendingUp } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ActivityTable from '@/components/ActivityTable'
import ActivityFilters from '@/components/ActivityFilters'
import { getUsers, getUserSessions } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateActivityData,
  createHourlyActivityChart,
  createActivityChart,
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
    const hourlyChart = createHourlyActivityChart(sessions)
    const dailyChart = createActivityChart(activityData)

    // Calculate activity metrics
    const totalSessions = sessions.length
    const uniqueUsers = new Set(sessions.map(s => s.metadata.user_id)).size
    const avgSessionsPerUser = uniqueUsers > 0 ? totalSessions / uniqueUsers : 0
    
    // Calculate recent activity (last 7 days)
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const recentSessions = sessions.filter(session => {
      const loginDate = new Date(session.metadata.login_date || session.created_at)
      return loginDate >= sevenDaysAgo
    })

    const weeklyGrowth = calculateGrowthPercentage(recentSessions.length, Math.max(1, totalSessions - recentSessions.length))

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            User Activity Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track user engagement, session patterns, and activity trends
          </p>
        </div>

        {/* Activity Filters */}
        <ActivityFilters />

        {/* Key Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sessions"
            value={formatNumber(totalSessions)}
            change={weeklyGrowth}
            trend={recentSessions.length > 0 ? 'up' : 'neutral'}
            icon={<Activity size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(uniqueUsers)}
            change={`${userMetrics.activeUsers} total active`}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Avg Sessions/User"
            value={avgSessionsPerUser.toFixed(1)}
            change="per user"
            icon={<TrendingUp size={24} />}
          />
          <MetricCard
            title="Recent Activity"
            value={formatNumber(recentSessions.length)}
            change="last 7 days"
            trend={recentSessions.length > 0 ? 'up' : 'neutral'}
            icon={<Clock size={24} />}
          />
        </div>

        {/* Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Hourly Activity Pattern"
            data={hourlyChart}
            type="line"
            height={350}
          />
          <ChartCard
            title="Daily Activity Trends"
            data={dailyChart}
            type="bar"
            height={350}
          />
        </div>

        {/* Activity Table */}
        <ActivityTable sessions={sessions} />
      </div>
    )
  } catch (error) {
    console.error('Activity page error:', error)
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Activity Data Error
          </h2>
          <p className="text-destructive-foreground">
            Unable to load activity data. Please check your configuration.
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
        <div className="h-8 bg-accent rounded animate-pulse w-80 mb-2" />
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

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivityLoading />}>
      <ActivityContent />
    </Suspense>
  )
}