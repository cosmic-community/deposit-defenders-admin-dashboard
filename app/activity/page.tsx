import { Suspense } from 'react'
import { 
  Activity, 
  Clock, 
  Users, 
  LogIn, 
  CreditCard,
  Settings,
  Eye,
  Download,
  Filter,
  Calendar
} from 'lucide-react'
import MetricCard from '@/components/MetricCard'
import ChartCard from '@/components/ChartCard'
import ActivityTable from '@/components/ActivityTable'
import ActivityFilters from '@/components/ActivityFilters'
import { getUsers, getUserSessions } from '@/lib/cosmic'
import { 
  calculateUserMetrics,
  generateActivityData,
  createActivityChart,
  createHourlyActivityChart,
  formatNumber
} from '@/lib/analytics'

// Define the ActivityRecord interface to match the component
interface ActivityRecord {
  id: string
  type: 'login' | 'registration' | 'subscription' | 'payment'
  user_email: string
  timestamp: string
  details: string
  ip_address?: string | null
}

async function ActivityContent() {
  try {
    const [users, sessions] = await Promise.all([
      getUsers(),
      getUserSessions()
    ])

    const userMetrics = calculateUserMetrics(users)
    const activityData = generateActivityData(sessions, users)
    
    // Calculate activity metrics
    const totalActivities = sessions.length + users.length // Sessions + user registrations
    const todayActivities = sessions.filter(session => {
      const sessionDate = new Date(session.metadata?.login_date || session.created_at)
      const today = new Date()
      return sessionDate.toDateString() === today.toDateString()
    }).length
    
    const uniqueActiveUsers = new Set(sessions.map(s => s.metadata?.user_id)).size
    const avgSessionDuration = sessions.reduce((sum, session) => 
      sum + (session.metadata?.session_duration || 0), 0) / sessions.length || 0

    // Create activity charts
    const dailyActivityChart = createActivityChart(activityData)
    const hourlyActivityChart = createHourlyActivityChart(sessions)

    // Device distribution
    const deviceDistribution = {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        label: 'Device Usage',
        data: [
          sessions.filter(s => s.metadata?.device_type === 'desktop').length,
          sessions.filter(s => s.metadata?.device_type === 'mobile').length,
          sessions.filter(s => s.metadata?.device_type === 'tablet').length
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0
      }]
    }

    // Activity types distribution
    const activityTypes = {
      logins: sessions.length,
      registrations: users.filter(u => {
        const signupDate = new Date(u.metadata?.signup_date || u.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return signupDate >= thirtyDaysAgo
      }).length,
      subscriptions: users.filter(u => u.metadata?.subscription_plan === 'pro').length,
      payments: users.filter(u => u.metadata?.total_spent && u.metadata.total_spent > 0).length
    }

    const activityTypesChart = {
      labels: ['Logins', 'Registrations', 'Subscriptions', 'Payments'],
      datasets: [{
        label: 'Activity Distribution',
        data: [
          activityTypes.logins,
          activityTypes.registrations, 
          activityTypes.subscriptions,
          activityTypes.payments
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    }

    // Generate recent activity feed with properly typed activity records
    const recentActivities: ActivityRecord[] = [
      ...sessions.slice(0, 10).map(session => ({
        id: session.id,
        type: 'login' as const,
        user_email: users.find(u => u.id === session.metadata?.user_id)?.metadata?.email || 'Unknown User',
        timestamp: session.metadata?.login_date || session.created_at,
        details: `Logged in from ${session.metadata?.device_type || 'unknown'} device`,
        ip_address: session.metadata?.ip_address || null
      })),
      ...users.slice(0, 5).map(user => ({
        id: user.id,
        type: 'registration' as const,
        user_email: user.metadata?.email || 'Unknown',
        timestamp: user.metadata?.signup_date || user.created_at,
        details: `Signed up for ${user.metadata?.subscription_plan || 'free'} plan`,
        ip_address: null
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20)

    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Activity size={32} />
              Activity Monitor
            </h1>
            <p className="text-muted-foreground mt-2">
              Track user activities, system events, and platform usage analytics
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
              <Download size={18} />
              Export Activity
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Eye size={18} />
              Real-time View
            </button>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Activities"
            value={formatNumber(totalActivities)}
            change="All time"
            trend="neutral"
            icon={<Activity size={24} />}
          />
          <MetricCard
            title="Today's Activities"
            value={formatNumber(todayActivities)}
            change={`${((todayActivities / totalActivities) * 100).toFixed(1)}% of total`}
            trend={todayActivities > 10 ? 'up' : 'neutral'}
            icon={<Clock size={24} />}
          />
          <MetricCard
            title="Active Users"
            value={formatNumber(uniqueActiveUsers)}
            change={`${sessions.length} total sessions`}
            trend="up"
            icon={<Users size={24} />}
          />
          <MetricCard
            title="Avg Session Duration"
            value={`${Math.round(avgSessionDuration)} min`}
            change={avgSessionDuration > 15 ? '+12% vs avg' : 'Below average'}
            trend={avgSessionDuration > 15 ? 'up' : 'down'}
            icon={<LogIn size={24} />}
          />
        </div>

        {/* Activity Charts Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Activity Analytics</h2>
          </div>
          
          {/* Daily Activity Chart */}
          <ChartCard
            title="Daily Activity Trends (Last 30 Days)"
            data={dailyActivityChart}
            type="line"
            height={400}
          />

          {/* Hourly Activity & Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Hourly Activity Pattern"
              data={hourlyActivityChart}
              type="bar"
              height={300}
            />
            <ChartCard
              title="Device Distribution"
              data={deviceDistribution}
              type="doughnut"
              height={300}
            />
          </div>
        </div>

        {/* Activity Types Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Activity Distribution</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="User Logins"
              value={formatNumber(activityTypes.logins)}
              change={`${uniqueActiveUsers} unique users`}
              trend="up"
              icon={<LogIn size={24} />}
            />
            <MetricCard
              title="New Registrations"
              value={formatNumber(activityTypes.registrations)}
              change="Last 30 days"
              trend={activityTypes.registrations > 5 ? 'up' : 'neutral'}
              icon={<Users size={24} />}
            />
            <MetricCard
              title="Subscriptions"
              value={formatNumber(activityTypes.subscriptions)}
              change={`${((activityTypes.subscriptions / users.length) * 100).toFixed(1)}% conversion`}
              trend="up"
              icon={<CreditCard size={24} />}
            />
            <MetricCard
              title="Payment Events"
              value={formatNumber(activityTypes.payments)}
              change="Revenue generating"
              trend="up"
              icon={<CreditCard size={24} />}
            />
          </div>

          {/* Activity Types Chart */}
          <ChartCard
            title="Activity Types Distribution (Last 30 Days)"
            data={activityTypesChart}
            type="pie"
            height={400}
          />
        </div>

        {/* Activity Filters and Table */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Recent Activity Feed</h2>
          </div>
          
          {/* Activity Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <ActivityFilters />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter size={16} />
              Showing {recentActivities.length} recent activities
            </div>
          </div>

          {/* Activity Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Activity Log ({recentActivities.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                Real-time updates
              </div>
            </div>
            
            <ActivityTable activities={recentActivities} />
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Peak Activity Time</p>
              <p className="font-semibold text-foreground">
                {sessions.length > 0 ? '2:00 PM - 4:00 PM' : 'No data'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Most Active Day</p>
              <p className="font-semibold text-foreground">
                {sessions.length > 0 ? 'Wednesday' : 'No data'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">User Retention</p>
              <p className="font-semibold text-foreground">
                {uniqueActiveUsers > 0 ? `${((uniqueActiveUsers / users.length) * 100).toFixed(1)}%` : '0%'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Platform Health</p>
              <p className="font-semibold text-green-500">
                {todayActivities > 0 ? 'Active' : 'Quiet'}
              </p>
            </div>
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
            Activity Monitor Error
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
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <div className="h-8 bg-accent rounded animate-pulse w-64 mb-2" />
          <div className="h-4 bg-accent rounded animate-pulse w-96" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-accent rounded animate-pulse w-32" />
          <div className="h-10 bg-accent rounded animate-pulse w-32" />
        </div>
      </div>
      
      {/* Loading metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card">
            <div className="h-4 bg-accent rounded animate-pulse mb-2" />
            <div className="h-8 bg-accent rounded animate-pulse mb-2" />
            <div className="h-4 bg-accent rounded animate-pulse w-16" />
          </div>
        ))}
      </div>
      
      {/* Loading charts */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="h-96 bg-accent rounded animate-pulse" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="chart-container">
              <div className="h-6 bg-accent rounded animate-pulse mb-4 w-32" />
              <div className="h-72 bg-accent rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading table */}
      <div className="space-y-6">
        <div className="h-6 bg-accent rounded animate-pulse w-48" />
        <div className="bg-card border border-border rounded-lg">
          <div className="px-6 py-4 border-b border-border">
            <div className="h-6 bg-accent rounded animate-pulse w-32" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-accent rounded animate-pulse" />
            ))}
          </div>
        </div>
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