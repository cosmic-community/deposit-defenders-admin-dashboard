import { Suspense } from 'react'
import { Activity, Users, Clock, TrendingUp } from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ActivityTable from '@/components/ActivityTable'
import ActivityFilters from '@/components/ActivityFilters'
import { getUserSessions, getUsers } from '@/lib/cosmic'
import { formatNumber } from '@/lib/analytics'

async function ActivityContent() {
  try {
    const [sessions, users] = await Promise.all([
      getUserSessions(),
      getUsers()
    ])

    const todaySessions = sessions.filter(session => {
      const loginDate = new Date(session.metadata.login_date)
      const today = new Date()
      return loginDate.toDateString() === today.toDateString()
    })

    const uniqueUsers = new Set(sessions.map(s => s.metadata.user_id)).size
    const averageSessionsPerUser = uniqueUsers > 0 ? sessions.length / uniqueUsers : 0

    return (
      <div className="p-8 space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Activity Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Track user engagement and platform activity patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sessions"
            value={formatNumber(sessions.length)}
            change={`${todaySessions.length} today`}
            trend={todaySessions.length > 0 ? 'up' : 'neutral'}
            icon={<Activity size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(uniqueUsers)}
            change={`${users.length} total users`}
            trend={uniqueUsers > 0 ? 'up' : 'neutral'}
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Today's Logins"
            value={formatNumber(todaySessions.length)}
            change="vs yesterday"
            trend={todaySessions.length > 0 ? 'up' : 'neutral'}
            icon={<Clock size={24} />}
          />
          <MetricCard
            title="Avg Sessions/User"
            value={averageSessionsPerUser.toFixed(1)}
            change="engagement rate"
            trend={averageSessionsPerUser > 1 ? 'up' : 'neutral'}
            icon={<TrendingUp size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ActivityFilters />
          </div>
          <div className="lg:col-span-3">
            <ActivityTable sessions={sessions} />
          </div>
        </div>
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

export default function ActivityPage() {
  return (
    <Suspense fallback={<ActivityLoading />}>
      <ActivityContent />
    </Suspense>
  )
}